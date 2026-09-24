"""
CowVision - Pelatihan Model CNN untuk Citra Visual Ambing & Puting Sapi
Deteksi Gejala Mastitis Visual (Kemerahan, Pembengkakan, Luka, Lesi, Hiperkeratosis)
Menggunakan Arsitektur CNN dengan Transfer Learning (MobileNetV2 / ResNet18) & Penanganan Imbalance
"""

import os
import glob
import json
import time
import copy
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, WeightedRandomSampler
import torchvision.transforms as transforms
import torchvision.models as models
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score

# Konfigurasi Path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_DIR = os.path.join(BASE_DIR, "Dataset", "Gambar", "Data")
MODEL_DIR = os.path.join(BASE_DIR, "models")
REPORT_DIR = os.path.join(BASE_DIR, "reports")

os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(REPORT_DIR, exist_ok=True)

# Perangkat Komputasi (CUDA GPU jika tersedia, fallback CPU)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[INFO] Komputasi menggunakan perangkat: {DEVICE}")

# Mapping Label Kelas
CLASS_NAMES = ["Normal", "Mastitis"]
LABEL_MAP = {
    "normal": 0,
    "normal teats": 0,
    "mastitis": 1
}

def scan_image_dataset(dataset_dir: str):
    """
    Memindai folder dataset citra gambar mastitis dan normal teats.
    """
    valid_extensions = ("*.jpg", "*.jpeg", "*.png", "*.bmp", "*.webp")
    image_paths = []
    labels = []

    # 1. Pindai folder kelas
    for folder_name, label_idx in LABEL_MAP.items():
        folder_path = os.path.join(dataset_dir, folder_name)
        if os.path.exists(folder_path):
            found_in_folder = []
            for ext in valid_extensions:
                found_in_folder.extend(glob.glob(os.path.join(folder_path, ext)))
                found_in_folder.extend(glob.glob(os.path.join(folder_path, ext.upper())))

            found_in_folder = list(set(found_in_folder))
            for p in found_in_folder:
                image_paths.append(p)
                labels.append(label_idx)

    # 2. Cek loose files di root Data/ jika ada
    loose_files = []
    for ext in valid_extensions:
        loose_files.extend(glob.glob(os.path.join(dataset_dir, ext)))
        loose_files.extend(glob.glob(os.path.join(dataset_dir, ext.upper())))
    
    # Loose files default diklasifikasikan berdasarkan nama file jika relevan
    for p in set(loose_files):
        fname = os.path.basename(p).lower()
        if "normal" in fname:
            image_paths.append(p)
            labels.append(0)
        else:
            image_paths.append(p)
            labels.append(1)

    labels = np.array(labels)
    unique, counts = np.unique(labels, return_counts=True)
    dist = dict(zip([CLASS_NAMES[u] for u in unique], counts))
    print(f"[INFO] Total citra ditemukan: {len(image_paths)}")
    print(f"[INFO] Distribusi citra: {dist}")

    if len(image_paths) == 0:
        raise FileNotFoundError(f"Tidak ada file gambar valid ditemukan di: {dataset_dir}")

    return image_paths, labels

class TeatImageDataset(Dataset):
    """
    Custom Dataset PyTorch untuk memuat gambar ambing sapi dan augmentasi.
    """
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        path = self.image_paths[idx]
        label = self.labels[idx]

        try:
            image = Image.open(path).convert("RGB")
        except Exception as e:
            # Fallback blank image jika file corrupt
            print(f"[WARNING] Gagal membaca gambar {path}: {e}")
            image = Image.new("RGB", (224, 224), color=(0, 0, 0))

        if self.transform:
            image = self.transform(image)

        return image, torch.tensor(label, dtype=torch.long)

def get_transforms():
    """
    Pipeline transformasi & augmentasi data.
    Augmentasi intensif sangat penting karena kelas 'Normal' hanya memiliki sedikit sampel.
    """
    train_transform = transforms.Compose([
        transforms.Resize((240, 240)),
        transforms.RandomResizedCrop(224, scale=(0.75, 1.0)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.3),
        transforms.RandomRotation(degrees=25),
        transforms.ColorJitter(brightness=0.25, contrast=0.25, saturation=0.25, hue=0.05),
        transforms.RandomAffine(degrees=0, translate=(0.1, 0.1)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])

    return train_transform, val_transform

def build_model(arch="mobilenet_v2", num_classes=2, pretrained=True):
    """
    Membangun model CNN.
    Menggunakan MobileNetV2 / ResNet18 yang sangat ringan & optimal untuk integrasi mobile Android.
    """
    if arch == "mobilenet_v2":
        print("[INFO] Menginisialisasi arsitektur MobileNetV2 (Pre-trained)...")
        weights = models.MobileNet_V2_Weights.DEFAULT if pretrained else None
        model = models.mobilenet_v2(weights=weights)
        in_features = model.classifier[1].in_features
        # Head classifier baru untuk deteksi biner mastitis
        model.classifier = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, 128),
            nn.ReLU(),
            nn.Dropout(p=0.2),
            nn.Linear(128, num_classes)
        )
    elif arch == "resnet18":
        print("[INFO] Menginisialisasi arsitektur ResNet18 (Pre-trained)...")
        weights = models.ResNet18_Weights.DEFAULT if pretrained else None
        model = models.resnet18(weights=weights)
        in_features = model.fc.in_features
        model.fc = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, 128),
            nn.ReLU(),
            nn.Dropout(p=0.2),
            nn.Linear(128, num_classes)
        )
    else:
        # Custom CNN Sederhana dari awal
        print("[INFO] Menginisialisasi arsitektur Custom CNN...")
        class CustomCNN(nn.Module):
            def __init__(self, num_classes=2):
                super().__init__()
                self.features = nn.Sequential(
                    nn.Conv2d(3, 32, kernel_size=3, padding=1),
                    nn.BatchNorm2d(32),
                    nn.ReLU(),
                    nn.MaxPool2d(2, 2),

                    nn.Conv2d(32, 64, kernel_size=3, padding=1),
                    nn.BatchNorm2d(64),
                    nn.ReLU(),
                    nn.MaxPool2d(2, 2),

                    nn.Conv2d(64, 128, kernel_size=3, padding=1),
                    nn.BatchNorm2d(128),
                    nn.ReLU(),
                    nn.MaxPool2d(2, 2),
                )
                self.classifier = nn.Sequential(
                    nn.AdaptiveAvgPool2d((4, 4)),
                    nn.Flatten(),
                    nn.Linear(128 * 4 * 4, 128),
                    nn.ReLU(),
                    nn.Dropout(0.3),
                    nn.Linear(128, num_classes)
                )
            def forward(self, x):
                return self.classifier(self.features(x))

        model = CustomCNN(num_classes=num_classes)

    return model.to(DEVICE)

def train_cnn(model, train_loader, val_loader, criterion, optimizer, scheduler, num_epochs=25):
    """
    Loop pelatihan CNN dengan validasi dan early checkpointing.
    """
    best_model_wts = copy.deepcopy(model.state_dict())
    best_f1 = 0.0
    history = {"train_loss": [], "val_loss": [], "train_acc": [], "val_acc": []}

    print("\n" + "="*55)
    print(f"       MEMULAI PELATIHAN CNN ({num_epochs} EPOCHS)")
    print("="*55)

    start_time = time.time()
    for epoch in range(1, num_epochs + 1):
        # 1. Training Phase
        model.train()
        running_loss = 0.0
        running_corrects = 0
        total_train = 0

        for inputs, labels in train_loader:
            inputs = inputs.to(DEVICE)
            labels = labels.to(DEVICE)

            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            _, preds = torch.max(outputs, 1)

            loss.backward()
            optimizer.step()

            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data).item()
            total_train += inputs.size(0)

        epoch_train_loss = running_loss / max(1, total_train)
        epoch_train_acc = running_corrects / max(1, total_train)

        # 2. Validation Phase
        model.eval()
        val_loss = 0.0
        val_corrects = 0
        total_val = 0
        all_val_preds = []
        all_val_labels = []

        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs = inputs.to(DEVICE)
                labels = labels.to(DEVICE)

                outputs = model(inputs)
                loss = criterion(outputs, labels)
                _, preds = torch.max(outputs, 1)

                val_loss += loss.item() * inputs.size(0)
                val_corrects += torch.sum(preds == labels.data).item()
                total_val += inputs.size(0)

                all_val_preds.extend(preds.cpu().numpy())
                all_val_labels.extend(labels.cpu().numpy())

        epoch_val_loss = val_loss / max(1, total_val)
        epoch_val_acc = val_corrects / max(1, total_val)
        epoch_f1 = f1_score(all_val_labels, all_val_preds, average='macro', zero_division=0)

        if scheduler:
            scheduler.step(epoch_val_loss)

        history["train_loss"].append(epoch_train_loss)
        history["val_loss"].append(epoch_val_loss)
        history["train_acc"].append(epoch_train_acc)
        history["val_acc"].append(epoch_val_acc)

        print(f"Epoch [{epoch:02d}/{num_epochs:02d}] "
              f"Train Loss: {epoch_train_loss:.4f} | Train Acc: {epoch_train_acc*100:.1f}% "
              f"| Val Loss: {epoch_val_loss:.4f} | Val Acc: {epoch_val_acc*100:.1f}% | Macro F1: {epoch_f1:.3f}")

        # Simpan checkpoint bobot terbaik berdasarkan F1 Score
        if epoch_f1 >= best_f1:
            best_f1 = epoch_f1
            best_model_wts = copy.deepcopy(model.state_dict())

    time_elapsed = time.time() - start_time
    print(f"\n[INFO] Pelatihan selesai dalam: {time_elapsed // 60:.0f}m {time_elapsed % 60:.0f}s")
    print(f"[INFO] Best Validation Macro F1: {best_f1:.4f}")

    model.load_state_dict(best_model_wts)
    return model, history

def evaluate_and_plot(model, val_loader, history):
    """
    Evaluasi akhir pada validation set dan pembuatan plot laporan grafik.
    """
    model.eval()
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for inputs, labels in val_loader:
            inputs = inputs.to(DEVICE)
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.numpy())

    acc = accuracy_score(all_labels, all_preds)
    f1 = f1_score(all_labels, all_preds, average="weighted", zero_division=0)

    print("\n" + "="*50)
    print("           HASIL EVALUASI MODEL CNN")
    print("="*50)
    print(f"Accuracy : {acc * 100:.2f}%")
    print(f"F1-Score : {f1 * 100:.2f}%")
    print("\nLaporan Klasifikasi Citra Ambing:")
    print(classification_report(all_labels, all_preds, target_names=CLASS_NAMES, zero_division=0))

    # 1. Plot Learning Curves (Loss & Accuracy)
    plt.figure(figsize=(12, 4))
    plt.subplot(1, 2, 1)
    plt.plot(history["train_loss"], label="Train Loss", color="tomato", lw=2)
    plt.plot(history["val_loss"], label="Val Loss", color="royalblue", lw=2)
    plt.title("Kurva Loss CNN")
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.legend()
    plt.grid(alpha=0.3)

    plt.subplot(1, 2, 2)
    plt.plot(history["train_acc"], label="Train Acc", color="tomato", lw=2)
    plt.plot(history["val_acc"], label="Val Acc", color="royalblue", lw=2)
    plt.title("Kurva Akurasi CNN")
    plt.xlabel("Epoch")
    plt.ylabel("Accuracy")
    plt.legend()
    plt.grid(alpha=0.3)

    plt.tight_layout()
    curve_path = os.path.join(REPORT_DIR, "cnn_learning_curves.png")
    plt.savefig(curve_path, dpi=300)
    plt.close()
    print(f"[INFO] Grafik performa CNN disimpan ke: {curve_path}")

    # 2. Plot Confusion Matrix
    cm = confusion_matrix(all_labels, all_preds)
    plt.figure(figsize=(5, 4))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Greens',
                xticklabels=CLASS_NAMES,
                yticklabels=CLASS_NAMES)
    plt.title("Confusion Matrix - CNN (Citra Ambing)")
    plt.xlabel("Prediksi")
    plt.ylabel("Aktual")
    plt.tight_layout()
    cm_path = os.path.join(REPORT_DIR, "confusion_matrix_cnn.png")
    plt.savefig(cm_path, dpi=300)
    plt.close()
    print(f"[INFO] Plot Confusion Matrix CNN disimpan ke: {cm_path}")

    return {"accuracy": float(acc), "f1_score": float(f1)}

def export_model_artifacts(model, metrics):
    """
    Ekspor model CNN: PyTorch weights (.pth), TorchScript (.pt), dan metadata.
    """
    pth_path = os.path.join(MODEL_DIR, "cnn_mastitis_model.pth")
    torch.save(model.state_dict(), pth_path)
    print(f"[INFO] Bobot model CNN disimpan di: {pth_path}")

    # Ekspor ke TorchScript (untuk inferensi mobile Android offline)
    try:
        model.eval()
        example_input = torch.rand(1, 3, 224, 224).to(DEVICE)
        traced_model = torch.jit.trace(model, example_input)
        pt_path = os.path.join(MODEL_DIR, "cnn_mastitis_model_traced.pt")
        traced_model.save(pt_path)
        print(f"[INFO] Model TorchScript untuk Mobile/Android disimpan di: {pt_path}")
    except Exception as e:
        print(f"[WARNING] Gagal mengekspor TorchScript: {e}")

    meta_path = os.path.join(MODEL_DIR, "cnn_metadata.json")
    with open(meta_path, "w") as f:
        json.dump({
            "model_architecture": "MobileNetV2",
            "input_resolution": [224, 224, 3],
            "classes": CLASS_NAMES,
            "metrics": metrics
        }, f, indent=4)
    print(f"[INFO] Metadata model citra disimpan di: {meta_path}")

def run_pipeline():
    # 1. Pindai dataset
    image_paths, labels = scan_image_dataset(IMAGE_DIR)

    # 2. Split Train & Validation (Stratified 80:20)
    train_paths, val_paths, train_labels, val_labels = train_test_split(
        image_paths, labels, test_size=0.20, random_state=42, stratify=labels
    )
    print(f"[INFO] Pembagian data -> Train: {len(train_paths)}, Val: {len(val_paths)}")

    # 3. Transformasi data
    train_tf, val_tf = get_transforms()
    train_dataset = TeatImageDataset(train_paths, train_labels, transform=train_tf)
    val_dataset = TeatImageDataset(val_paths, val_labels, transform=val_tf)

    # 4. Weighted Sampler untuk mengatasi ketidakseimbangan kelas (Imbalance)
    class_sample_counts = np.bincount(train_labels)
    class_weights = 1.0 / np.maximum(class_sample_counts, 1)
    sample_weights = [class_weights[label] for label in train_labels]
    sampler = WeightedRandomSampler(weights=sample_weights, num_samples=len(sample_weights), replacement=True)

    train_loader = DataLoader(train_dataset, batch_size=16, sampler=sampler, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=16, shuffle=False, num_workers=0)

    # 5. Inisialisasi Model, Loss, Optimizer
    model = build_model(arch="mobilenet_v2", num_classes=2, pretrained=True)

    # Weighted Cross Entropy Loss
    norm_weights = torch.tensor([class_weights[0], class_weights[1]], dtype=torch.float).to(DEVICE)
    norm_weights = norm_weights / norm_weights.sum()
    criterion = nn.CrossEntropyLoss(weight=norm_weights)

    optimizer = optim.AdamW(model.parameters(), lr=1e-4, weight_decay=1e-2)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=3)

    # 6. Train Model
    trained_model, history = train_cnn(
        model, train_loader, val_loader, criterion, optimizer, scheduler, num_epochs=20
    )

    # 7. Evaluasi & Visualisasi
    metrics = evaluate_and_plot(trained_model, val_loader, history)

    # 8. Ekspor Model
    export_model_artifacts(trained_model, metrics)
    print("[SUCCESS] Pelatihan CNN Citra Ambing Selesai!")

if __name__ == "__main__":
    run_pipeline()
