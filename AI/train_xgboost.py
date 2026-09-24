"""
CowVision - Pelatihan Model XGBoost untuk Data Sensor Susu Sapi
Deteksi Mastitis berdasarkan parameter fisikokimia susu:
- Milk_Temperature (Suhu susu)
- Milk_pH (Tingkat keasaman)
- Milk_Conductivity (Konduktivitas listrik)
- Somatic_Cell_Count / SCC (Jumlah sel somatik)
- Milk_Yield (Volume perahan susu)
- Clotting (Penggumpalan susu)
- Day (Hari laktasi)
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
    roc_curve,
    precision_recall_curve
)
from xgboost import XGBClassifier

# Konfigurasi path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "Dataset", "Susu", "cow_milk_mastitis_dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
REPORT_DIR = os.path.join(BASE_DIR, "reports")

os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(REPORT_DIR, exist_ok=True)

def load_and_preprocess_data(csv_path: str):
    """
    Membaca dataset susu, memvalidasi schema, dan memisahkan fitur serta target.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset tidak ditemukan di path: {csv_path}")

    print(f"[INFO] Membaca dataset dari: {csv_path}")
    df = pd.read_csv(csv_path)
    print(f"[INFO] Dimensi dataset: {df.shape[0]} baris, {df.shape[1]} kolom")
    print(df.head(5))

    # Validasi missing values
    missing_counts = df.isnull().sum()
    if missing_counts.sum() > 0:
        print("[WARNING] Ditemukan missing values, melakukan imputasi median...")
        df = df.fillna(df.median(numeric_only=True))
    else:
        print("[INFO] Tidak ditemukan missing values.")

    # Target kolom adalah 'class1' (0: Sehat, 1: Mastitis)
    target_col = "class1"
    if target_col not in df.columns:
        raise ValueError(f"Kolom target '{target_col}' tidak ditemukan di dataset.")

    # Kolom fitur yang digunakan untuk prediksi (Cow_ID diabaikan karena hanya identifier)
    feature_cols = [
        "Day",
        "Milk_Temperature",
        "Milk_pH",
        "Milk_Conductivity",
        "Somatic_Cell_Count",
        "Milk_Yield",
        "Clotting"
    ]

    # Pastikan semua fitur ada di dataset
    for col in feature_cols:
        if col not in df.columns:
            raise ValueError(f"Kolom fitur '{col}' tidak ditemukan di dataset.")

    X = df[feature_cols].copy()
    y = df[target_col].astype(int).copy()

    # Cek distribusi kelas
    class_counts = y.value_counts().to_dict()
    print(f"[INFO] Distribusi Kelas: 0 (Normal) = {class_counts.get(0, 0)}, 1 (Mastitis) = {class_counts.get(1, 0)}")

    return X, y, feature_cols

def train_xgboost(X_train, y_train, scale_pos_weight: float = 1.0):
    """
    Melatih model XGBoost dengan hyperparameter optimal dan penanganan ketidakseimbangan kelas.
    """
    print(f"\n[INFO] Melatih model XGBoost (scale_pos_weight={scale_pos_weight:.2f})...")

    model = XGBClassifier(
        n_estimators=250,
        learning_rate=0.03,
        max_depth=5,
        subsample=0.85,
        colsample_bytree=0.85,
        min_child_weight=2,
        gamma=0.1,
        scale_pos_weight=scale_pos_weight,
        random_state=42,
        eval_metric="logloss",
        n_jobs=-1
    )

    model.fit(X_train, y_train)
    return model

def evaluate_model(model, X_train, y_train, X_test, y_test, feature_names):
    """
    Mengevaluasi performa model pada data train dan test, serta membuat visualisasi.
    """
    print("\n" + "="*50)
    print("           HASIL EVALUASI MODEL XGBOOST")
    print("="*50)

    # Prediksi
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    # Metrik
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    roc_auc = roc_auc_score(y_test, y_proba)

    print(f"Accuracy  : {acc * 100:.2f}%")
    print(f"Precision : {prec * 100:.2f}%")
    print(f"Recall    : {rec * 100:.2f}%")
    print(f"F1-Score  : {f1 * 100:.2f}%")
    print(f"ROC-AUC   : {roc_auc:.4f}")
    print("\nLaporan Klasifikasi Lengkap:")
    print(classification_report(y_test, y_pred, target_names=["Sehat / Normal", "Mastitis"]))

    # 1. Plot Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=["Normal (0)", "Mastitis (1)"],
                yticklabels=["Normal (0)", "Mastitis (1)"])
    plt.title("Confusion Matrix - XGBoost (Data Susu)")
    plt.xlabel("Prediksi")
    plt.ylabel("Aktual")
    plt.tight_layout()
    cm_path = os.path.join(REPORT_DIR, "confusion_matrix_xgboost.png")
    plt.savefig(cm_path, dpi=300)
    plt.close()
    print(f"[INFO] Plot Confusion Matrix disimpan ke: {cm_path}")

    # 2. Plot ROC Curve
    fpr, tpr, _ = roc_curve(y_test, y_proba)
    plt.figure(figsize=(6, 5))
    plt.plot(fpr, tpr, color="darkorange", lw=2, label=f"ROC curve (AUC = {roc_auc:.3f})")
    plt.plot([0, 1], [0, 1], color="navy", lw=1.5, linestyle="--")
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curve - Deteksi Mastitis Susu")
    plt.legend(loc="lower right")
    plt.grid(alpha=0.3)
    plt.tight_layout()
    roc_path = os.path.join(REPORT_DIR, "roc_curve_xgboost.png")
    plt.savefig(roc_path, dpi=300)
    plt.close()
    print(f"[INFO] Plot ROC Curve disimpan ke: {roc_path}")

    # 3. Plot Feature Importance
    importance = model.feature_importances_
    feat_df = pd.DataFrame({"Feature": feature_names, "Importance": importance})
    feat_df = feat_df.sort_values(by="Importance", ascending=True)

    plt.figure(figsize=(8, 5))
    plt.barh(feat_df["Feature"], feat_df["Importance"], color="#2E86AB")
    plt.xlabel("Relative Importance (Gain)")
    plt.title("Feature Importance - XGBoost Parameter Susu")
    plt.grid(axis='x', alpha=0.3)
    plt.tight_layout()
    feat_path = os.path.join(REPORT_DIR, "feature_importance_xgboost.png")
    plt.savefig(feat_path, dpi=300)
    plt.close()
    print(f"[INFO] Plot Feature Importance disimpan ke: {feat_path}")

    metrics = {
        "accuracy": float(acc),
        "precision": float(prec),
        "recall": float(rec),
        "f1_score": float(f1),
        "roc_auc": float(roc_auc)
    }
    return metrics

def save_model(model, feature_names, metrics):
    """
    Menyimpan model ke format .json (native XGBoost) dan .joblib bersama metadata.
    """
    json_model_path = os.path.join(MODEL_DIR, "xgboost_milk_model.json")
    joblib_model_path = os.path.join(MODEL_DIR, "xgboost_milk_model.joblib")
    meta_path = os.path.join(MODEL_DIR, "xgboost_metadata.json")

    # Simpan model native XGBoost
    model.save_model(json_model_path)
    print(f"[INFO] Model XGBoost (.json) disimpan di: {json_model_path}")

    # Simpan pipeline objek joblib
    joblib.dump({
        "model": model,
        "feature_names": feature_names,
        "metrics": metrics
    }, joblib_model_path)
    print(f"[INFO] Model XGBoost (.joblib) disimpan di: {joblib_model_path}")

    # Metadata file
    metadata = {
        "model_type": "XGBClassifier",
        "features": feature_names,
        "target": "class1 (0: Normal, 1: Mastitis)",
        "metrics": metrics
    }
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=4)
    print(f"[INFO] Metadata model disimpan di: {meta_path}")

def run_pipeline():
    # 1. Load data
    X, y, feature_names = load_and_preprocess_data(DATASET_PATH)

    # 2. Stratified train/test split (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"[INFO] Data latih (train): {X_train.shape[0]} sampel")
    print(f"[INFO] Data uji (test)   : {X_test.shape[0]} sampel")

    # 3. Hitung rasio bobot kelas untuk XGBoost
    neg_count = (y_train == 0).sum()
    pos_count = (y_train == 1).sum()
    scale_pos_weight = neg_count / max(1, pos_count)
    print(f"[INFO] Rasio bobot negatif:positif = {scale_pos_weight:.2f}")

    # 4. Training
    model = train_xgboost(X_train, y_train, scale_pos_weight=scale_pos_weight)

    # 5. K-Fold Cross Validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(model, X, y, cv=cv, scoring="f1")
    print(f"\n[INFO] 5-Fold Cross Validation F1-Score: {cv_scores.mean()*100:.2f}% (+/- {cv_scores.std()*100:.2f}%)")

    # 6. Evaluasi
    metrics = evaluate_model(model, X_train, y_train, X_test, y_test, feature_names)

    # 7. Simpan model
    save_model(model, feature_names, metrics)

    # 8. Contoh inferensi simulasi
    print("\n--- Contoh Uji Inferensi Sampel Baru ---")
    sample_normal = pd.DataFrame([{
        "Day": 15,
        "Milk_Temperature": 35.8,
        "Milk_pH": 6.6,
        "Milk_Conductivity": 4.5,
        "Somatic_Cell_Count": 120,
        "Milk_Yield": 22.5,
        "Clotting": 0
    }])
    sample_mastitis = pd.DataFrame([{
        "Day": 18,
        "Milk_Temperature": 38.6,
        "Milk_pH": 7.1,
        "Milk_Conductivity": 7.2,
        "Somatic_Cell_Count": 750,
        "Milk_Yield": 8.0,
        "Clotting": 1
    }])

    pred_normal = model.predict(sample_normal)[0]
    prob_normal = model.predict_proba(sample_normal)[0][1]
    pred_mast = model.predict(sample_mastitis)[0]
    prob_mast = model.predict_proba(sample_mastitis)[0][1]

    print(f"Sampel 1 (Kondisi Ideal) -> Prediksi: {'Mastitis' if pred_normal == 1 else 'Sehat'} (Probabilitas Mastitis: {prob_normal*100:.2f}%)")
    print(f"Sampel 2 (Kondisi Kritis)-> Prediksi: {'Mastitis' if pred_mast == 1 else 'Sehat'} (Probabilitas Mastitis: {prob_mast*100:.2f}%)")
    print("[SUCCESS] Pelatihan XGBoost Selesai!")

if __name__ == "__main__":
    run_pipeline()
