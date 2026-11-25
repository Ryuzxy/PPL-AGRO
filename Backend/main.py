import os
import json
import logging
import hashlib
import time
from collections import defaultdict, deque
from typing import Optional
import requests
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from schemas import (
    MilkSensorInput,
    MilkPredictionResponse,
    ImagePredictionResponse,
    MultimodalResponse,
    LactationPredictionInput,
    LactationPredictionResponse,
    FeedOptimizationInput,
    FeedOptimizationResponse,
)
from predictor import predictor

logger = logging.getLogger(__name__)
MAX_IMAGE_BYTES = 8 * 1024 * 1024
SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", "").split(",") if origin.strip()]


rate_windows: dict[str, deque[float]] = defaultdict(deque)


def require_user(request: Request) -> dict:
    authorization = request.headers.get("authorization", "")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    token = authorization.removeprefix("Bearer ").strip()
    if not token or not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise HTTPException(status_code=401, detail="Authentication unavailable")
    try:
        response = requests.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={"Authorization": f"Bearer {token}", "apikey": SUPABASE_ANON_KEY},
            timeout=5,
        )
    except requests.RequestException:
        raise HTTPException(status_code=503, detail="Authentication service unavailable")
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid authentication")
    user = response.json()
    key = user.get("id") or hashlib.sha256(token.encode()).hexdigest()
    now = time.monotonic()
    window = rate_windows[key]
    while window and now - window[0] > 60:
        window.popleft()
    if len(window) >= 60:
        raise HTTPException(status_code=429, detail="Terlalu banyak permintaan.")
    window.append(now)
    return user


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(self), microphone=()"
        return response

# ==========================================
# FastAPI Application Initialization
# ==========================================
app = FastAPI(
    title="MowTitis Dairy AI REST API",
    description="Backend REST API untuk Pipeline Inferensi CNN MobileNetV2 (Deteksi Mastitis Ambing) dan XGBoost (Sensor Susu & Siklus Laktasi)",
    version="1.0.0",
    docs_url="/docs" if os.getenv("APP_ENV", "production") != "production" else None,
    redoc_url="/redoc" if os.getenv("APP_ENV", "production") != "production" else None,
    openapi_url="/openapi.json" if os.getenv("APP_ENV", "production") != "production" else None,
)
app.add_middleware(SecurityHeadersMiddleware)

# CORS Middleware for Frontend React connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

# ==========================================
# Root & Health Endpoints
# ==========================================
@app.get("/", tags=["Sistem"])
def root():
    return {
        "status": "online",
        "app": "MowTitis Dairy AI REST API",
        "version": "1.0.0",
        "partner": "Rembangan Dairy Farm (Arjasa, Jember)",
        "models": {
            "cnn_mobilenet_v2": "Aktif (Deteksi Mastitis Ambing)",
            "xgboost_milk": "Aktif (Analisis Fisikokimia Susu)",
            "wood_lactation_model": "Aktif (Prediksi Kurva 305 Hari)",
            "feed_optimizer": "Aktif (NRC Least-Cost Ration)"
        },
        "docs": "/docs"
    }

@app.get("/health", tags=["Sistem"])
@app.get("/api/health", tags=["Sistem"])
def health_check():
    return {
        "status": "healthy",
        "device": predictor.device,
        "xgboost_loaded": predictor.xgb_model is not None,
        "cnn_loaded": predictor.cnn_model is not None,
        "torch_available": predictor.torch is not None
    }

@app.get("/v1/models", tags=["Sistem"])
def list_models():
    """OpenAI-compatible model discovery endpoint for frontend health checks."""
    return {
        "object": "list",
        "data": [
            {
                "id": "mowtitis-dairy-ai",
                "object": "model",
                "owned_by": "mowtitis",
            }
        ],
    }

# ==========================================
# 1. Milk Sensor Prediction (XGBoost)
# ==========================================
@app.post("/api/predict/milk", response_model=MilkPredictionResponse, tags=["Inferensi AI"])
def predict_milk_telemetry(payload: MilkSensorInput, _: dict = Depends(require_user)):
    """
    Menerima parameter fisikokimia susu hasil perahan (suhu, pH, konduktivitas, SCC, yield, clotting)
    dan mengembalikan hasil inferensi XGBoost untuk deteksi dini mastitis.
    """
    try:
        result = predictor.predict_milk(
            day=payload.day,
            temp=payload.milk_temperature,
            ph=payload.milk_ph,
            cond=payload.milk_conductivity,
            scc=payload.somatic_cell_count,
            yld=payload.milk_yield,
            clotting=payload.clotting
        )
        return result
    except Exception:
        logger.exception("Milk inference failed")
        raise HTTPException(status_code=500, detail="Gagal memproses inferensi susu.")

# ==========================================
# 2. Udder Visual Image Prediction (CNN MobileNetV2)
# ==========================================
@app.post("/api/predict/image", response_model=ImagePredictionResponse, tags=["Inferensi AI"])
async def predict_udder_image(
    file: UploadFile = File(..., description="Foto ambing sapi (JPG/PNG)"),
    _: dict = Depends(require_user),
):
    """
    Menerima upload foto inspeksi ambing/puting sapi dan mengklasifikasikan
    status kesehatan menggunakan model CNN MobileNetV2.
    """
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=400, detail="File yang diunggah harus berupa gambar (JPG, PNG, WebP).")

    try:
        contents = await file.read(MAX_IMAGE_BYTES + 1)
        if len(contents) > MAX_IMAGE_BYTES:
            raise HTTPException(status_code=413, detail="Ukuran gambar maksimal 8 MB.")
        res = predictor.predict_image(contents)
        if "error" in res:
            raise HTTPException(status_code=422, detail=res["error"])
        return res
    except HTTPException:
        raise
    except Exception:
        logger.exception("Image inference failed")
        raise HTTPException(status_code=500, detail="Gagal memproses analisis citra.")

# ==========================================
# 3. Multimodal Diagnostic Fusion (Susu + Citra)
# ==========================================
@app.post("/api/predict/multimodal", response_model=MultimodalResponse, tags=["Inferensi AI"])
async def predict_multimodal_diagnosis(
    milk_data_json: Optional[str] = Form(None, description="String JSON data fisikokimia susu"),
    image_file: Optional[UploadFile] = File(None, description="Foto ambing sapi"),
    _: dict = Depends(require_user),
):
    """
    Inferensi gabungan (Multimodal Fusion) yang mengintegrasikan parameter sensor susu (60% bobot)
    dengan analisis visual citra ambing CNN (40% bobot) untuk diagnosis definitif.
    """
    parsed_milk_data = None
    if milk_data_json:
        try:
            parsed_milk_data = json.loads(milk_data_json)
        except Exception:
            raise HTTPException(status_code=400, detail="Format JSON milk_data_json tidak valid.")

    image_bytes = None
    if image_file:
        image_bytes = await image_file.read(MAX_IMAGE_BYTES + 1)
        if len(image_bytes) > MAX_IMAGE_BYTES:
            raise HTTPException(status_code=413, detail="Ukuran gambar maksimal 8 MB.")

    if not parsed_milk_data and not image_bytes:
        raise HTTPException(status_code=400, detail="Wajib menyertakan minimal salah satu: data susu atau foto ambing.")

    try:
        diag = predictor.multimodal_diagnosis(parsed_milk_data, image_bytes)
        return {
            "sapi_id": parsed_milk_data.get("sapi_id") if parsed_milk_data else None,
            "hasil_sensor_susu": diag.get("hasil_sensor_susu"),
            "hasil_citra_ambing": diag.get("hasil_citra_ambing"),
            "analisis_kombinasi": diag["analisis_kombinasi"]
        }
    except Exception:
        logger.exception("Multimodal inference failed")
        raise HTTPException(status_code=500, detail="Gagal menjalankan diagnosis multimodal.")

# ==========================================
# 4. Lactation Cycle Prediction
# ==========================================
@app.post("/api/predict/lactation", response_model=LactationPredictionResponse, tags=["Siklus Laktasi"])
def predict_lactation_cycle(payload: LactationPredictionInput, _: dict = Depends(require_user)):
    """
    Memproyeksikan kurva laktasi 305 hari, estimasi hari puncak (peak DIM),
    dan target produksi puncak berdasarkan bobot badan & fase laktasi.
    """
    try:
        res = predictor.predict_lactation(
            sapi_id=payload.sapi_id,
            berat_badan=payload.berat_badan,
            dim=payload.dim,
            laktasi_ke=payload.laktasi_ke,
            rerata_sekarang=payload.rerata_produksi_sekarang,
            skor_bcs=payload.skor_bcs
        )
        return res
    except Exception:
        logger.exception("Lactation inference failed")
        raise HTTPException(status_code=500, detail="Gagal menghitung siklus laktasi.")

# ==========================================
# 5. Feed Rations & IOFC Optimization
# ==========================================
@app.post("/api/feed/optimize", response_model=FeedOptimizationResponse, tags=["Optimasi Pakan"])
def optimize_feed_rations(payload: FeedOptimizationInput, _: dict = Depends(require_user)):
    """
    Menghitung rekomendasi takaran ransum harian berbasis least-cost formulation
    (rumput odot, indigofera, konsentrat, ampas tahu) serta estimasi marjin IOFC.
    """
    try:
        res = predictor.optimize_feed(
            sapi_id=payload.sapi_id,
            bobot_badan_kg=payload.bobot_badan_kg,
            target_susu_liter=payload.target_susu_liter,
            fase_laktasi=payload.fase_laktasi,
            harga_konsentrat_per_kg=payload.harga_konsentrat_per_kg,
            harga_jual_susu_per_liter=payload.harga_jual_susu_per_liter
        )
        return res
    except Exception:
        logger.exception("Feed optimization failed")
        raise HTTPException(status_code=500, detail="Gagal mengoptimasi ransum pakan.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
