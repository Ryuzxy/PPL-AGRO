# MowTitis Backend REST API (FastAPI)

Backend layanan REST API berbasis Python FastAPI untuk melayani pipeline inferensi AI:
- **CNN MobileNetV2**: Klasifikasi citra visual peradangan ambing sapi (Deteksi Mastitis).
- **XGBoost**: Klasifikasi dini mastitis berdasarkan parameter fisikokimia susu hasil perahan.
- **Multimodal Fusion**: Penggabungan bobot probabilitas klinis susu (60%) dan citra ambing (40%).
- **Lactation Cycle Wood Model**: Estimasi puncak laktasi, persistensi, dan kurva 305 hari.
- **Feed Optimizer (NRC)**: Optimasi ransum pakan harian minimum biaya (Least-Cost Ration) dan marjin IOFC.

---

## 🚀 Cara Menjalankan

### 1. Instalasi Dependensi
```bash
cd Backend
pip install -r requirements.txt
```

### 2. Menjalankan Server
```bash
python run.py
```
atau menggunakan Uvicorn langsung:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Dokumentasi Interaktif (Swagger UI)
Buka browser pada:
- **Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📡 Daftar Endpoint API

### 1. Deteksi Mastitis dari Sensor Susu (XGBoost)
- **Method**: `POST`
- **Path**: `/api/predict/milk`
- **Request Body (JSON)**:
```json
{
  "sapi_id": 7,
  "day": 15,
  "milk_temperature": 38.4,
  "milk_ph": 6.6,
  "milk_conductivity": 5.2,
  "somatic_cell_count": 250.0,
  "milk_yield": 18.5,
  "clotting": 0
}
```
- **Response**:
```json
{
  "status_prediksi": "Normal / Sehat",
  "kode_kelas": 0,
  "probabilitas_mastitis": 14.5,
  "tingkat_risiko": "Rendah",
  "indikator_kritis": {
    "suhu_tinggi": false,
    "ph_abnormal": false,
    "scc_tinggi": false,
    "konduktivitas_tinggi": false,
    "ada_gumpalan": false
  },
  "rekomendasi_tindakan": "Kualitas susu prima dalam standar SNI 3141.1:2011. Aman disetorkan ke tangki pendingin KUD.",
  "rekomendasi_pakan": "Pertahankan rasio ransum saat ini guna menjaga kestabilan persistensi laktasi harian."
}
```

---

### 2. Deteksi Mastitis dari Citra Visual Ambing (CNN MobileNetV2)
- **Method**: `POST`
- **Path**: `/api/predict/image`
- **Request (Multipart/Form-Data)**:
  - `file`: Foto ambing sapi (`.jpg`, `.png`, `.webp`)
- **Response**:
```json
{
  "status_prediksi": "Normal / Sehat",
  "kode_kelas": 0,
  "confidence_skor": 96.8,
  "probabilitas_mastitis": 3.2,
  "probabilitas_normal": 96.8,
  "kuartir_terdampak": "Semua Kuartir Simetris",
  "rekomendasi_penanganan": "Tekstur jaringan dan 4 kuartir ambing simetris normal tanpa tanda-tanda edema atau lesi luar."
}
```

---

### 3. Diagnosis Multimodal Terpadu
- **Method**: `POST`
- **Path**: `/api/predict/multimodal`
- **Request (Form-Data)**:
  - `milk_data_json`: String JSON parameter susu
  - `image_file`: File foto ambing sapi
- **Response**:
  - Menggabungkan hasil sensor dan foto dengan bobot klinis terkalibrasi.

---

### 4. Proyeksi Siklus Laktasi
- **Method**: `POST`
- **Path**: `/api/predict/lactation`
- **Request Body**:
```json
{
  "sapi_id": 12,
  "nama_sapi": "Melati",
  "berat_badan": 520.0,
  "dim": 65,
  "laktasi_ke": 2,
  "rerata_produksi_sekarang": 21.4,
  "skor_bcs": 3.25
}
```

---

### 5. Optimasi Ransum Pakan (NRC Least-Cost)
- **Method**: `POST`
- **Path**: `/api/feed/optimize`
- **Request Body**:
```json
{
  "sapi_id": 7,
  "bobot_badan_kg": 500.0,
  "target_susu_liter": 20.0,
  "fase_laktasi": "Awal Laktasi (Peak)",
  "harga_konsentrat_per_kg": 4500.0,
  "harga_jual_susu_per_liter": 14000.0
}
```
