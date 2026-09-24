"""
CowVision - Pipeline Inferensi & Prediksi Terpadu
Mengintegrasikan Model XGBoost (Data Susu) dan Model CNN (Citra Ambing)
untuk deteksi dini mastitis sapi perah.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from PIL import Image

import torch
import torchvision.transforms as transforms
import torchvision.models as models

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class CowVisionPredictor:
    def __init__(self):
        self.xgb_model = None
        self.cnn_model = None
        self.feature_names = []
        self._load_xgboost()
        self._load_cnn()

    def _load_xgboost(self):
        joblib_path = os.path.join(MODEL_DIR, "xgboost_milk_model.joblib")
        if os.path.exists(joblib_path):
            try:
                data = joblib.load(joblib_path)
                self.xgb_model = data["model"]
                self.feature_names = data.get("feature_names", [])
                print("[INFO] Model XGBoost berhasil dimuat.")
            except Exception as e:
                print(f"[WARNING] Gagal memuat XGBoost joblib: {e}")
        else:
            print(f"[WARNING] File model XGBoost tidak ditemukan di {joblib_path}. Jalankan train_xgboost.py terlebih dahulu.")

    def _load_cnn(self):
        pth_path = os.path.join(MODEL_DIR, "cnn_mastitis_model.pth")
        if os.path.exists(pth_path):
            try:
                # Arsitektur MobileNetV2
                model = models.mobilenet_v2(weights=None)
                in_features = model.classifier[1].in_features
                model.classifier = torch.nn.Sequential(
                    torch.nn.Dropout(p=0.3),
                    torch.nn.Linear(in_features, 128),
                    torch.nn.ReLU(),
                    torch.nn.Dropout(p=0.2),
                    torch.nn.Linear(128, 2)
                )
                model.load_state_dict(torch.load(pth_path, map_location=DEVICE))
                model.to(DEVICE)
                model.eval()
                self.cnn_model = model
                print("[INFO] Model CNN berhasil dimuat.")
            except Exception as e:
                print(f"[WARNING] Gagal memuat model CNN: {e}")
        else:
            print(f"[WARNING] File model CNN tidak ditemukan di {pth_path}. Jalankan train_cnn.py terlebih dahulu.")

    def predict_milk(self, day: int, temp: float, ph: float, cond: float, scc: float, yld: float, clotting: int):
        """
        Prediksi mastitis berdasarkan parameter fisikokimia susu menggunakan XGBoost.
        """
        if self.xgb_model is None:
            return {"error": "Model XGBoost belum dilatih/tersedia."}

        input_df = pd.DataFrame([{
            "Day": day,
            "Milk_Temperature": temp,
            "Milk_pH": ph,
            "Milk_Conductivity": cond,
            "Somatic_Cell_Count": scc,
            "Milk_Yield": yld,
            "Clotting": clotting
        }])

        pred = int(self.xgb_model.predict(input_df)[0])
        prob = float(self.xgb_model.predict_proba(input_df)[0][1])

        status = "Mastitis" if pred == 1 else "Normal / Sehat"
        risk_level = "Tinggi" if prob >= 0.7 else ("Sedang" if prob >= 0.4 else "Rendah")

        return {
            "prediksi": status,
            "kode_kelas": pred,
            "probabilitas_mastitis": round(prob * 100, 2),
            "tingkat_risiko": risk_level,
            "indikator_kritis": {
                "suhu_tinggi": temp >= 38.0,
                "ph_abnormal": ph > 6.8 or ph < 6.4,
                "scc_tinggi": scc > 400,
                "konduktivitas_tinggi": cond > 6.0,
                "ada_gumpalan": clotting == 1
            }
        }

    def predict_image(self, image_path: str):
        """
        Prediksi mastitis visual dari foto ambing/puting sapi menggunakan CNN.
        """
        if self.cnn_model is None:
            return {"error": "Model CNN belum dilatih/tersedia."}

        if not os.path.exists(image_path):
            return {"error": f"Gambar tidak ditemukan di: {image_path}"}

        val_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])
        ])

        try:
            image = Image.open(image_path).convert("RGB")
            tensor_img = val_transform(image).unsqueeze(0).to(DEVICE)

            with torch.no_grad():
                outputs = self.cnn_model(tensor_img)
                probs = torch.softmax(outputs, dim=1)[0]
                pred_idx = torch.argmax(probs).item()

            prob_mastitis = float(probs[1].item())
            status = "Mastitis" if pred_idx == 1 else "Normal / Sehat"

            return {
                "prediksi": status,
                "kode_kelas": pred_idx,
                "probabilitas_mastitis": round(prob_mastitis * 100, 2),
                "probabilitas_normal": round(float(probs[0].item()) * 100, 2)
            }
        except Exception as e:
            return {"error": f"Gagal memproses gambar: {e}"}

    def multimodal_diagnosis(self, milk_data: dict, image_path: str = None):
        """
        Sistem pendukung keputusan komprehensif menggabungkan sensor susu & citra ambing.
        """
        result = {}
        milk_res = None
        image_res = None

        if milk_data:
            milk_res = self.predict_milk(
                day=milk_data.get("day", 15),
                temp=milk_data.get("milk_temperature", 36.0),
                ph=milk_data.get("milk_ph", 6.6),
                cond=milk_data.get("milk_conductivity", 4.5),
                scc=milk_data.get("somatic_cell_count", 150),
                yld=milk_data.get("milk_yield", 20.0),
                clotting=milk_data.get("clotting", 0)
            )
            result["hasil_sensor_susu"] = milk_res

        if image_path:
            image_res = self.predict_image(image_path)
            result["hasil_citra_ambing"] = image_res

        # Integrasi Keputusan
        if milk_res and "probabilitas_mastitis" in milk_res and image_res and "probabilitas_mastitis" in image_res:
            # Weighted average: 60% parameter susu (klinis sangat presisi), 40% citra visual
            combined_prob = 0.60 * milk_res["probabilitas_mastitis"] + 0.40 * image_res["probabilitas_mastitis"]
            final_pred = "Mastitis" if combined_prob >= 50.0 else "Normal / Sehat"
            result["analisis_kombinasi"] = {
                "kesimpulan_akhir": final_pred,
                "gabungan_probabilitas_mastitis": round(combined_prob, 2),
                "rekomendasi": (
                    "Segera lakukan isolasi sapi, bersihkan ambing dengan larutan antiseptik, dan hubungi dokter hewan untuk terapi antibiotik."
                    if final_pred == "Mastitis" else
                    "Kondisi sapi prima dan sehat. Lanjutkan sanitasi rutin sebelum dan sesudah pemerahan."
                )
            }

        return result

if __name__ == "__main__":
    predictor = CowVisionPredictor()

    print("\n--- Contoh Uji Coba Prediksi Sensor Susu (XGBoost) ---")
    res_milk = predictor.predict_milk(
        day=20, temp=38.4, ph=7.2, cond=7.0, scc=720, yld=7.5, clotting=1
    )
    print(json.dumps(res_milk, indent=2))
