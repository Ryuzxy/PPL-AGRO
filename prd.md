# PRODUCT REQUIREMENT DOCUMENT (PRD)

## CowVision: Sistem Prediksi Siklus Laktasi Sapi dan Deteksi Penyakit Mastitis Berbasis Web dengan YOLO & CNN dan XGBoost

---

## 1. Informasi Proyek & Dokumen

| Parameter | Detail |
| :--- | :--- |
| **Nama Produk** | CowVision |
| **Tipe Produk** | Aplikasi Web & AI Cloud Backend |
| **Versi Dokumen** | 1.0.0 |
| **Status** | Approved / Baseline |
| **Project Sponsor** | Pak Hafid (Karyawan Sapi Perah Rembangan Dairy Farm) |
| **Lokasi Mitra** | Rembangan Dairy Farm, Jl. Rembangan, Darungan, Kemuning Lor, Kec. Arjasa, Jember |
| **Institusi** | Program Studi Informatika, Fasilkom, Universitas Jember |
| **Tim Penyusun** | - Yurissandy Al Aham Pratama (242410103083)<br>- Kaysa Rafa Aditya Putra Negara (242410103022)<br>- Yuri Wicaksono (242410103034)<br>- Risky Puspita Indraswari  (242410103037) |

---

## 2. Latar Belakang & Masalah (Problem Statement)

Peternakan sapi perah di Rembangan Dairy Farm memiliki beberapa permasalahan utama dalam tata kelola dan kesehatan ternak[cite: 1]:
1. **Keterlambatan Deteksi Mastitis**: Peternak sulit mengidentifikasi gejala dini peradangan ambing (mastitis), sehingga penanganan medis terlambat dan biaya kuratif membengkak[cite: 1].
2. **Kualitas Pakan & Nutrisi Belum Optimal**: Belum tersedianya acuan presisi dalam menghitung takaran pakan harian berdasarkan kondisi individual sapi, yang berdampak langsung pada kualitas susu[cite: 1].
3. **Ketidaktepatan Jadwal Panen Susu**: Kurangnya prediksi akurat mengenai siklus laktasi menyebabkan sapi dipanen mendahului atau melewati masa puncak laktasi[cite: 1].
4. **Pencatatan Konvensional**: Belum tersedianya sistem terintegrasi yang mencatat profil ternak, histori perahan susu, serta transaksi keuangan (arus kas masuk dan keluar) secara *real-time*[cite: 1].
5. **Keterbatasan Media Edukasi**: Belum tersedianya pusat informasi dan panduan teknis yang mudah diakses untuk meningkatkan keterampilan peternak pemula di kandang[cite: 1].

---

## 3. Tujuan Produk & Nilai Bisnis (Business Value)

### 3.1. Nilai Terukur (Tangible Values)
* **Peningkatan Kualitas & Nilai Jual Susu**[cite: 1]:
  * *Sebelum*: Produksi rata-rata 90 Liter/hari dengan harga Rp12.000/L (Omzet harian: Rp1.080.000)[cite: 1].
  * *Sesudah*: Mutu susu meningkat sehingga harga jual naik menjadi Rp14.000/L (Omzet harian: Rp1.260.000)[cite: 1].
  * *Dampak*: Kenaikan omzet sebesar Rp180.000/hari atau peningkatan pendapatan sekitar ~16,6%[cite: 1].
* **Penghematan Biaya Pengobatan Mastitis**[cite: 1]:
  * *Sebelum*: Rata-rata 4 ekor sapi per bulan terjangkit mastitis (@ Rp500.000/ekor = Rp2.000.000/bulan)[cite: 1].
  * *Sesudah*: Deteksi dini menekan keparahan menjadi rata-rata 3 kasus per periode (@ Rp500.000/ekor = Rp1.500.000)[cite: 1].
  * *Dampak*: Penghematan biaya perawatan medis sebesar Rp500.000 per bulan (efisiensi 25%)[cite: 1].
* **Peningkatan Produktivitas Siklus Laktasi**[cite: 1]:
  * *Sebelum*: 7 ekor sapi laktasi menghasilkan 90 L/hari (~12,8 L/ekor)[cite: 1].
  * *Sesudah*: Manajemen jadwal laktasi menambah 1 ekor sapi produktif menjadi 8 ekor laktasi (kapasitas 112 L/hari)[cite: 1].
  * *Dampak*: Peningkatan omzet harian sebesar Rp264.000/hari[cite: 1].

### 3.2. Nilai Tak Terukur (Intangible Values)
* Mempermudah analisis data performa sapi untuk pengambilan keputusan yang lebih cepat dan terukur[cite: 1].
* Mengakselerasi kurva belajar dan keterampilan peternak pemula[cite: 1].
* Membangun kepercayaan pelanggan terhadap higienitas dan mutu susu perah[cite: 1].
* Memodernisasi citra Rembangan Dairy Farm melalui adopsi teknologi agritech berbasis AI[cite: 1].

---

## 4. Persona Pengguna & Aktor Sistem

1. **Peternak (Operator Pengguna)**[cite: 1]:
   * Mengambil dan mengunggah foto sapi/ambing untuk deteksi mastitis[cite: 1].
   * Melakukan pengelolaan data ternak (registrasi, pembaruan status, catatan kesehatan)[cite: 1].
   * Mencatat data keuangan (pemasukan dan pengeluaran kandang)[cite: 1].
   * Menjalankan inferensi rekomendasi pakan dan prediksi masa laktasi[cite: 1].
   * Membaca serta menambahkan artikel edukasi peternakan[cite: 1].
2. **AI Subsystem (Aktor Sistem Eksternal / Cloud)**[cite: 1]:
   * **Model YOLO**: Memproses gambar masukan, mengekstraksi fitur visual ambing, mendeteksi keberadaan penyakit mastitis, serta mengklasifikasikan tingkat keparahannya[cite: 1].
   * **Model ANN**: Mengolah parameter tabel ternak (bobot badan, riwayat produksi harian, tanggal beranak) untuk memproyeksikan siklus laktasi dan formulasi takaran pakan[cite: 1].

---

## 5. Ruang Lingkup Sistem (Product Scope)

### 5.1. Dalam Lingkup (In-Scope)
* Aplikasi Android native / mobile client[cite: 1].
* Autentikasi pengguna berbasis peran (Login dan Logout)[cite: 1].
* Manajemen data master ternak sapi (CRUD profil sapi)[cite: 1].
* Diagnosa visual penyakit mastitis menggunakan model YOLO[cite: 1].
* Estimasi siklus laktasi dan histori produksi susu menggunakan ANN[cite: 1].
* Rekomendasi optimasi jumlah dan jenis pakan berbasis ANN[cite: 1].
* Pencatatan arus kas (pemasukan penjualan produk susu dan pengeluaran pakan/operasional)[cite: 1].
* Modul artikel panduan dan edukasi peternak[cite: 1].

### 5.2. Luar Lingkup (Out-of-Scope)
* Pemantauan kamera kandang otomatis secara terus-menerus tanpa intervensi pengguna (saat ini input foto dilakukan secara manual)[cite: 1].
* Pemrosesan AI secara lokal di perangkat (*on-device inference* offline)[cite: 1].
* Integrasi variabel eksternal seperti sensor cuaca otomatis, suhu udara, dan kelembapan lingkungan kandang[cite: 1].

---

## 6. Kebutuhan Fungsional (Functional Requirements)

| Kode Modul | Use Case ID | Nama Fitur | Deskripsi Fungsional | Kriteria Keberhasilan (Acceptance Criteria) |
| :--- | :--- | :--- | :--- | :--- |
| **FR-01** | UC001[cite: 1] | Autentikasi Pengguna (Login) | Peternak masuk ke sistem menggunakan username dan password[cite: 1]. | Berhasil dialihkan ke beranda jika kredensial valid; muncul alert error jika salah[cite: 1]. |
| **FR-02** | UC015[cite: 1] | Logout | Mengakhiri sesi akun pengguna[cite: 1]. | Sesi dihapus dan pengguna diarahkan kembali ke layar login[cite: 1]. |
| **FR-03** | UC002[cite: 1] | Deteksi Mastitis (YOLO) | Membuka kamera/galeri, mengunggah foto sapi/ambing, memanggil engine YOLO, dan menampilkan hasil[cite: 1]. | Sistem menampilkan label status (`hasil_deteksi`) dan `tingkat_keparahan`[cite: 1]. |
| **FR-04** | UC003[cite: 1] | Tambah Data Sapi | Merekam identitas sapi baru (jenis kelamin, tanggal lahir, berat badan, tanggal melahirkan, ras, status kesehatan, catatan)[cite: 1]. | Data tervalidasi dan tersimpan ke tabel database `sapi`[cite: 1]. |
| **FR-05** | UC004[cite: 1] | Ubah Data Sapi | Memperbarui atribut sapi yang sudah terdaftar berdasarkan ID sapi[cite: 1]. | Data sapi ter-update di database; notifikasi konfirmasi tampil[cite: 1]. |
| **FR-06** | UC005[cite: 1] | Lihat Data Sapi | Menampilkan daftar seluruh ID sapi dan detail lengkap ternak terpilih[cite: 1]. | Informasi detail sapi tampil sesuai ID yang diklik[cite: 1]. |
| **FR-07** | UC006[cite: 1] | Tambah Pemasukan | Mencatat transaksi pemasukan (tanggal, nominal/jumlah, keterangan, relasi ID sapi/produk)[cite: 1]. | Transaksi tercatat pada tabel `pemasukan`[cite: 1]. |
| **FR-08** | UC007[cite: 1] | Lihat Pemasukan | Menampilkan daftar seluruh pemasukan keuangan kandang berdasarkan tanggal[cite: 1]. | Riwayat transaksi pemasukan tersaji kronologis[cite: 1]. |
| **FR-09** | UC008[cite: 1] | Tambah Pengeluaran | Mencatat transaksi belanja operasional/pakan (tanggal, nominal, keterangan, ID pakan)[cite: 1]. | Transaksi tercatat pada tabel `pengeluaran`[cite: 1]. |
| **FR-10** | UC009[cite: 1] | Lihat Pengeluaran | Menampilkan data riwayat pengeluaran yang dikelompokkan berdasarkan tanggal[cite: 1]. | Riwayat pengeluaran berhasil ditarik dan disajikan[cite: 1]. |
| **FR-11** | UC010[cite: 1] | Rekomendasi Pakan (ANN) | Menjalankan model optimasi pakan berbasis bobot sapi dan produksi susu[cite: 1]. | Menghasilkan rekomendasi jenis pakan, takaran jumlah, dan alasan rekomendasi[cite: 1]. |
| **FR-12** | UC011[cite: 1] | Histori Produksi Susu | Menampilkan rekapitulasi volume dan kualitas susu perahan harian per sapi[cite: 1]. | Data histori produksi tersaji dalam bentuk tabel atau grafik[cite: 1]. |
| **FR-13** | UC012[cite: 1] | Prediksi Siklus Laktasi | Menjalankan pemodelan ANN untuk mengestimasi fase laktasi dan proyeksi hasil perahan berikutnya[cite: 1]. | Menampilkan tanggal prediksi, fase siklus laktasi, dan perkiraan kuantitas susu[cite: 1]. |
| **FR-14** | UC013[cite: 1] | Lihat Artikel Edukasi | Menampilkan daftar judul panduan dan isi artikel lengkap saat dipilih[cite: 1]. | Konten artikel tersaji lengkap (judul, isi, tanggal, kategori)[cite: 1]. |
| **FR-15** | UC014[cite: 1] | Tambah Artikel Edukasi | Mempublikasikan modul/artikel panduan baru ke sistem[cite: 1]. | Artikel tersimpan ke tabel `artikel` dan dapat diakses pengguna lain[cite: 1]. |

---

## 7. Pipeline Kecerdasan Buatan (Machine Learning Architecture)

### 7.1. Pipeline YOLO (Deteksi Mastitis)
* **Preprocessing Image**[cite: 1]:
  * *Rescale* resolusi citra[cite: 1].
  * Normalisasi rentang piksel $[0, 1]$[cite: 1].
  * Augmentasi citra (*Rotation*, *Horizontal/Vertical Flip*, *Brightness adjustment*)[cite: 1].
* **Pembagian Data**: Rasio Train : Validation : Test = **70 : 15 : 15**[cite: 1].
* **Arsitektur Model**:
  * *Backbone*: Ekstraksi fitur visual[cite: 1].
  * *Neck*: FPN / PAN untuk fusi fitur multi-resolusi[cite: 1].
  * *Head*: Lapisan prediksi *Bounding Box*, kelas deteksi, dan skor kepercayaan[cite: 1].
  * *Post-Processing*: *Non-Maximum Suppression* (NMS) dan *Confidence Thresholding*[cite: 1].
* **Evaluasi & Pengujian**: Loss Function, Validasi mAP (*mean Average Precision*), Precision, Recall, F1-Score, IoU, dan Confusion Matrix[cite: 1].

### 7.2. Pipeline ANN (Prediksi Siklus Laktasi & Optimasi Pakan)
* **Preprocessing Data Tabular**[cite: 1]:
  * Penanganan nilai kosong (*Handling Missing Values*)[cite: 1].
  * Deteksi dan eliminasi pencilan (*Outliers Detection*)[cite: 1].
  * Rekayasa fitur (*Feature Engineering*)[cite: 1].
  * Normalisasi skala data $[0, 1]$[cite: 1].
* **Pembagian Data**: Rasio Train : Test = **70 : 30**[cite: 1].
* **Arsitektur Jaringan**:
  * *Input Layer*: Menerima bobot badan, umur, tanggal beranak, dan riwayat perahan[cite: 1].
  * *Hidden Layer*: Fungsi aktivasi **ReLU**[cite: 1].
  * *Output Layer*:
    * Klasifikasi Fase: 3 Neuron (Fase Laktasi)[cite: 1].
    * Estimasi Regresi: 1 Neuron (Kuantitas Produksi Susu / Takaran Pakan)[cite: 1].
* **Evaluasi & Pengujian**: Forward Propagation, Loss Function, MSE, MAE, $R^2$, dan Akurasi Klasifikasi[cite: 1].

---

## 8. Desain Skema Basis Data (Database Schema)

Sistem menggunakan 11 entitas relasional utama[cite: 1]:

```sql
-- Entitas Autentikasi Pengguna
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Entitas Data Induk Sapi
CREATE TABLE sapi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jenis_kelamin VARCHAR(20),
    tanggal_lahir DATE,
    berat_badan DECIMAL(6,2),
    tanggal_melahirkan DATE,
    ras VARCHAR(50),
    status_kesehatan VARCHAR(50),
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entitas Citra Sapi
CREATE TABLE foto_sapi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sapi INT NOT NULL,
    url_foto VARCHAR(255),
    tanggal_foto DATE,
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sapi) REFERENCES sapi(id)
);

-- Entitas Hasil Deteksi Mastitis (YOLO)
CREATE TABLE hasil_deteksi_mastitis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_foto INT NOT NULL,
    tanggal_deteksi DATE,
    hasil_deteksi VARCHAR(50),
    tingkat_keparahan VARCHAR(50),
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_foto) REFERENCES foto_sapi(id)
);

-- Entitas Histori Produksi Susu Harian
CREATE TABLE histori_produksi_susu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sapi INT NOT NULL,
    tanggal_produksi DATE,
    jumlah_susu DECIMAL(6,2),
    kualitas VARCHAR(50),
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sapi) REFERENCES sapi(id)
);

-- Entitas Hasil Prediksi Siklus Laktasi (ANN)
CREATE TABLE prediksi_siklus_laktasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sapi INT NOT NULL,
    tanggal_prediksi DATE,
    fase_laktasi VARCHAR(50),
    hasil_prediksi DECIMAL(6,2),
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sapi) REFERENCES sapi(id)
);

-- Entitas Master Pakan
CREATE TABLE pakan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_pakan VARCHAR(100),
    jenis_pakan VARCHAR(50),
    stok INT,
    satuan VARCHAR(20),
    harga_per_unit DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entitas Rekomendasi Pakan (ANN)
CREATE TABLE rekomendasi_pakan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sapi INT NOT NULL,
    id_pakan INT NOT NULL,
    tanggal_rekomendasi DATE,
    alasan_rekomendasi TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sapi) REFERENCES sapi(id),
    FOREIGN KEY (id_pakan) REFERENCES pakan(id)
);

-- Entitas Master Produk Hasil Ternak
CREATE TABLE produk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_produk VARCHAR(100),
    jenis_produk VARCHAR(50),
    stok INT,
    satuan VARCHAR(20),
    harga_per_satuan DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entitas Pemasukan Keuangan
CREATE TABLE pemasukan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE,
    jumlah DECIMAL(12,2),
    keterangan TEXT,
    id_sapi INT,
    id_produk INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sapi) REFERENCES sapi(id),
    FOREIGN KEY (id_produk) REFERENCES produk(id)
);

-- Entitas Pengeluaran Operasional
CREATE TABLE pengeluaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE,
    jumlah DECIMAL(12,2),
    keterangan TEXT,
    id_pakan INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pakan) REFERENCES pakan(id)
);

-- Entitas Konten Edukasi Peternak
CREATE TABLE artikel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(200),
    isi TEXT,
    tanggal_terbit DATE,
    kategori VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
## 9. Kebutuhan Non-Fungsional (Non-Functional Requirements)

1. **Performa & Manajemen Penyimpanan**:
   - Pemrosesan deteksi citra dan kalkulasi prediksi dijalankan secara terpusat melalui cloud server untuk menjaga efisiensi komputasi perangkat mobile.
   - Data deteksi dan pencatatan disimpan di server untuk periode tertentu guna mencegah penumpukan data (data bloat) serta menjaga performa respon aplikasi tetap optimal.
2. **Konektivitas & Ketersediaan Jaringan**:
   - Aplikasi CowVision berbasis Android dan memerlukan koneksi internet yang stabil untuk menjalankan proses deteksi mastitis maupun prediksi siklus laktasi melalui cloud server.
3. **Kualitas Citra & Usabilitas Lapangan**:
   - Tingkat akurasi deteksi penyakit sangat bergantung pada kualitas foto yang diunggah peternak, sehingga sudut pengambilan gambar dan pencahayaan objek ambing sapi harus memadai.
   - Antarmuka aplikasi dirancang sederhana dan ergonomis agar mempermudah peternak dalam melakukan input manual di area kandang.
4. **Keamanan & Integritas Data**:
   - Seluruh formulir input (data sapi, pencatatan keuangan, unggah foto) dilengkapi validasi sistem ketat untuk mencegah masuknya data kosong atau tidak valid ke database.
   - Akses fitur aplikasi dilindungi oleh mekanisme autentikasi akun (login menggunakan username dan password).

---

## 10. Batasan Sistem (Constraints) & Asumsi

1. **Ketergantungan Jaringan Internet**: Aplikasi tidak mendukung deteksi penuh secara luring (offline); proses inferensi model YOLO dan ANN mutlak membutuhkan koneksi internet menuju server.
2. **Sensitivitas Input Citra**: Sistem menggunakan algoritma YOLO berbasis gambar yang diunggah pengguna, sehingga ketepatan diagnosis dipengaruhi oleh kejelasan visual dan ketiadaan distorsi/kotoran pada lensa.
3. **Variabel Prediksi Siklus Laktasi Terbatas**: Model prediksi siklus laktasi beroperasi murni berdasarkan data produksi susu harian dan tanggal kelahiran/melahirkan yang diinput, tanpa memperhitungkan faktor cuaca eksternal, kondisi mikroklimat kandang, atau fluktuasi pakan harian.
4. **Kebijakan Retensi Data Server**: Data pencatatan serta riwayat deteksi visual hanya dipertahankan dalam basis data server untuk jangka waktu tertentu demi menjaga kinerja sistem.
5. **Ketiadaan Sensor Otomatis**: Aplikasi belum mendukung pemantauan otomatis berbasis IoT, sehingga pengguna harus mengambil foto dan mencatat data perahan secara manual.
6. **Lokalitas Model Rekomendasi Pakan**: Formula pakan disesuaikan secara khusus dengan basis data dan ketersediaan jenis pakan di Rembangan Dairy Farm, sehingga hasilnya dapat berbeda jika diimplementasikan di peternakan lain.