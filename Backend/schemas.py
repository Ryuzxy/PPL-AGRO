from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

# ==========================================
# 1. Milk Sensor Telemetry Schemas (XGBoost)
# ==========================================
class MilkSensorInput(BaseModel):
    sapi_id: Optional[int] = Field(default=None, description="ID Sapi jika tersinkronisasi dengan database")
    day: int = Field(default=15, ge=1, le=400, description="Hari laktasi (Days in Milk / DIM)")
    milk_temperature: float = Field(default=38.4, ge=30.0, le=43.0, description="Suhu susu dalam derajat Celcius (°C)")
    milk_ph: float = Field(default=6.6, ge=5.0, le=9.0, description="Tingkat keasaman (pH) susu")
    milk_conductivity: float = Field(default=5.2, ge=2.0, le=12.0, description="Konduktivitas listrik susu (mS/cm)")
    somatic_cell_count: float = Field(default=250.0, ge=10.0, le=5000.0, description="Jumlah Sel Somatis / SCC (x10^3 sel/mL)")
    milk_yield: float = Field(default=18.5, ge=0.5, le=50.0, description="Volume perahan susu dalam liter (L)")
    clotting: int = Field(default=0, ge=0, le=1, description="Deteksi gumpalan susu (0 = Tidak Ada, 1 = Ada)")

class MilkIndicators(BaseModel):
    suhu_tinggi: bool
    ph_abnormal: bool
    scc_tinggi: bool
    konduktivitas_tinggi: bool
    ada_gumpalan: bool

class MilkPredictionResponse(BaseModel):
    status_prediksi: str = Field(description="Normal / Sehat atau Mastitis")
    kode_kelas: int = Field(description="0 = Normal, 1 = Mastitis")
    probabilitas_mastitis: float = Field(description="Persentase risiko mastitis (0-100%)")
    tingkat_risiko: str = Field(description="Rendah, Sedang, atau Tinggi")
    indikator_kritis: MilkIndicators
    rekomendasi_tindakan: str
    rekomendasi_pakan: Optional[str] = None

# ==========================================
# 2. Udder Image CNN Schemas (MobileNetV2)
# ==========================================
class ImagePredictionResponse(BaseModel):
    status_prediksi: str = Field(description="Normal / Sehat atau Mastitis")
    kode_kelas: int = Field(description="0 = Normal, 1 = Mastitis")
    confidence_skor: float = Field(description="Akurasi keyakinan model (0-100%)")
    probabilitas_mastitis: float
    probabilitas_normal: float
    kuartir_terdampak: Optional[str] = Field(default="Evaluasi Lapangan Diperlukan", description="Posisi kuartir ambing yang terindikasi radang")
    rekomendasi_penanganan: str

# ==========================================
# 3. Multimodal Diagnostic Fusion Schemas
# ==========================================
class MultimodalDecision(BaseModel):
    kesimpulan_akhir: str
    gabungan_probabilitas_mastitis: float
    sumber_bobot: str = "60% Sensor Fisikokimia Susu + 40% Citra Ambing CNN"
    urgensi_tindakan: str
    rekomendasi_medis: str

class MultimodalResponse(BaseModel):
    sapi_id: Optional[int] = None
    hasil_sensor_susu: Optional[MilkPredictionResponse] = None
    hasil_citra_ambing: Optional[ImagePredictionResponse] = None
    analisis_kombinasi: MultimodalDecision

# ==========================================
# 4. Lactation Cycle Prediction Schemas
# ==========================================
class LactationPredictionInput(BaseModel):
    sapi_id: Optional[int] = None
    nama_sapi: Optional[str] = "Cantik"
    berat_badan: float = Field(default=520.0, ge=300.0, le=900.0, description="Bobot badan sapi (kg)")
    dim: int = Field(default=65, ge=1, le=400, description="Hari laktasi saat ini (Days in Milk)")
    laktasi_ke: int = Field(default=2, ge=1, le=10, description="Periode laktasi ke-berapa")
    rerata_produksi_sekarang: float = Field(default=21.4, description="Produksi harian saat ini (Liter)")
    skor_bcs: float = Field(default=3.25, ge=1.0, le=5.0, description="Body Condition Score")

class LactationPredictionResponse(BaseModel):
    sapi_id: Optional[int] = None
    puncak_laktasi_hari: int = Field(description="Estimasi hari tercapainya puncak laktasi (DIM)")
    estimasi_produksi_puncak_liter: float
    estimasi_total_siklus_liter: float
    persistensi_laktasi_pct: float
    proyeksi_harian_30hari: List[Dict[str, Any]]
    rekomendasi_nutrisi_fase: str

# ==========================================
# 5. Feed Optimization Schemas
# ==========================================
class FeedOptimizationInput(BaseModel):
    sapi_id: Optional[int] = None
    bobot_badan_kg: float = Field(default=500.0, description="Bobot badan sapi dalam kg")
    target_susu_liter: float = Field(default=20.0, description="Target produksi susu per hari (Liter)")
    fase_laktasi: str = Field(default="Awal Laktasi (Peak)", description="Awal, Tengah, atau Akhir Laktasi")
    harga_konsentrat_per_kg: float = Field(default=4500.0, description="Harga konsentrat pakan per kg")
    harga_jual_susu_per_liter: float = Field(default=14000.0, description="Harga jual susu per liter")

class FeedItemRation(BaseModel):
    nama_pakan: str
    jumlah_kg: float
    estimasi_biaya: int

class FeedOptimizationResponse(BaseModel):
    sapi_id: Optional[int] = None
    kebutuhan_bk_kg: float = Field(description="Kebutuhan Bahan Kering / Dry Matter (kg/hari)")
    kebutuhan_pk_pct: float = Field(description="Kebutuhan Protein Kasar (%)")
    rekomendasi_ransum: List[FeedItemRation]
    total_biaya_pakan_harian: int
    estimasi_omzet_susu_harian: int
    estimasi_marjin_iofc_harian: int
    rasio_iofc_pct: float
