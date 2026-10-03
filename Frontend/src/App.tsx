import { useState } from 'react';

// 1. Entry & Dashboards
import Opening from './Opening.tsx';
import DashboardWeb from './Dashboard/Dashboard_Web.tsx';
import DashboardKandangMowtitis from './Dashboard/Dashboard_Kandang_Mowtitis.tsx';

// 2. Keuangan & Kas Mikro (Consolidated)
import DashboardKas from './Kas/Dashboard_Kas.tsx';
import BukuKasMikroMowtitis from './Kas/Buku_Kas_Mikro_Mowtitis.tsx';
import RiwayatKas from './Kas/Riwayat_Kas.tsx';
import FormulirInputKas from './Kas/Formulir_Input_Kas.tsx';
import KirimLaporanWA from './Kas/Kirim_Laporan_WA.tsx';

// 3. Notifikasi & Unduhan (Consolidated)
import SuksesKirimWA from './Notifikasi/Sukses_Kirim_WA.tsx';
import UnduhCetakLaporan from './Downloads/Unduh_Cetak_Laporan.tsx';

// 4. Manajemen Kawanan Ternak
import KatalogKawanan from './Kawanan/Katalog_Kawanan.tsx';
import RingkasanProduksiKawanan from './Kawanan/Ringkasan_Produksi_Kawanan.tsx';

// 5. AI Deteksi Mastitis CNN & Identifikasi RFID (Consolidated)
import PilihSapiDeteksiCNN from './Yolo/Pilih_Sapi_Deteksi_CNN.tsx';
import DeteksiCNN from './Yolo/Deteksi_CNN.tsx';
import { DeteksiMastitisCNNInspeksi } from './Yolo/Deteksi_Mastitis_CNN_Inspeksi.tsx';
import HasilDeteksiMastitis from './Yolo/Hasil_Deteksi_Mastitis.tsx';
import PemindaiRFID from './Yolo/Pemindai_RFID.tsx';
import KetikManualEartag from './Yolo/Ketik_Manual_Eartag.tsx';
import TelemetriRutin from './Yolo/Telemetri_Rutin.tsx';

// 6. Prediksi Laktasi & Nutrisi Pakan What-If (Consolidated)
import PrediksiLaktasiPakan from './Prediksi/Prediksi_Laktasi&Pakan.tsx';
import SimulasiPakanWhatIf from './Prediksi/Simulasi_Pakan_WhatIf.tsx';

// 7. Pemerahan Susu
import SesiPemerahanSusu from './Pemerahan_Susu/Sesi_Pemerahan_Susu.tsx';

// 8. Pengobatan & Rekam Medis (Consolidated)
import DashboardPascaPemulihan from './Pengobatan/Dashboard_Pasca_Pemulihan.tsx';
import CatatPengobatanMastitis from './Pengobatan/Catat_Pengobatan_Mastitis.tsx';
import ProfilRekamMedisSapi from './Profile/Sapi/Profil_Rekam_Medis_Sapi.tsx';
import RapidTestSCC from './Test_Kesehatan/Rapid_Test_SCC.tsx';

export type ScreenType =
  | 'opening'
  | 'dashboard'
  | 'dashboard_kandang_mowtitis'
  | 'kas'
  | 'buku_kas_mikro_mowtitis'
  | 'riwayat_kas'
  | 'form_input_kas'
  | 'form_input_pengeluaran'
  | 'input_pengeluaran_medis'
  | 'kirim_laporan_wa'
  | 'sukses_wa'
  | 'unduh_kas'
  | 'katalog'
  | 'ringkasan_produksi_kawanan'
  | 'deteksi'
  | 'pilih_sapi_deteksi_cnn'
  | 'deteksi_mastitis_cnn_inspeksi'
  | 'hasil_deteksi_mastitis'
  | 'pemindai_rfid'
  | 'ketik_manual_eartag'
  | 'telemetri_rutin'
  | 'prediksi'
  | 'simulasi_whatif'
  | 'pemerahan'
  | 'pasca_pemulihan'
  | 'catat_pengobatan'
  | 'profil_sapi'
  | 'rapid_test'
  | string;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('opening');

  const handleNavigate = (screen: any) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen">
      {/* 1. Opening & Splash */}
      {currentScreen === 'opening' && (
        <Opening onNavigateToDashboard={() => handleNavigate('dashboard')} />
      )}

      {/* 2. Dashboards */}
      {currentScreen === 'dashboard' && (
        <DashboardWeb onNavigate={handleNavigate} />
      )}
      {(currentScreen === 'dashboard_kandang_mowtitis' || currentScreen === 'dashboard_mobile') && (
        <DashboardKandangMowtitis onNavigate={handleNavigate} />
      )}

      {/* 3. Kas & Keuangan */}
      {currentScreen === 'kas' && (
        <DashboardKas onNavigate={handleNavigate} />
      )}
      {(currentScreen === 'buku_kas_mikro_mowtitis' || currentScreen === 'buku_kas_pasca_sapi07' || currentScreen === 'keuangan_kas_mikro') && (
        <BukuKasMikroMowtitis onNavigate={handleNavigate} />
      )}
      {currentScreen === 'riwayat_kas' && (
        <RiwayatKas onNavigate={handleNavigate} />
      )}
      {(currentScreen === 'form_input_kas' || currentScreen === 'form_input_pengeluaran' || currentScreen === 'input_pengeluaran_medis' || currentScreen === 'pengeluaran_medis') && (
        <FormulirInputKas onNavigate={handleNavigate} />
      )}
      {(currentScreen === 'kirim_laporan_wa' || currentScreen === 'kirim_laporan_wa_v2' || currentScreen === 'kirim_laporan_wa_mowtitis' || currentScreen === 'kirim_rekap_wa_kawanan') && (
        <KirimLaporanWA onNavigate={handleNavigate} />
      )}

      {/* 4. Notifikasi & Unduhan */}
      {(currentScreen === 'sukses_wa' || currentScreen === 'notifikasi_wa' || currentScreen === 'sukses_wa_mowtitis' || currentScreen === 'sukses_wa_rekap_kawanan' || currentScreen === 'notifikasi_wa_sapi07') && (
        <SuksesKirimWA onNavigate={handleNavigate} />
      )}
      {(currentScreen === 'unduh_kas' || currentScreen === 'unduh_dan_cetak_laporan' || currentScreen === 'unduh_laporan_kas_mowtitis' || currentScreen === 'unduh_rekap_produksi_kawanan') && (
        <UnduhCetakLaporan onNavigate={handleNavigate} />
      )}

      {/* 5. Kawanan Ternak */}
      {currentScreen === 'katalog' && (
        <KatalogKawanan onNavigate={handleNavigate} />
      )}
      {currentScreen === 'ringkasan_produksi_kawanan' && (
        <RingkasanProduksiKawanan onNavigate={handleNavigate} />
      )}

      {/* 6. AI Deteksi Mastitis YOLO v26 & RFID */}
      {(currentScreen === 'deteksi' || currentScreen === 'deteksi_mastitis_cnn_inspeksi' || currentScreen === 'deteksi_mastitis_yolo_sapi12') && (
        <DeteksiCNN onNavigate={handleNavigate} />
      )}
      {currentScreen === 'pilih_sapi_deteksi_cnn' && (
        <PilihSapiDeteksiCNN onNavigate={handleNavigate} />
      )}
      {(currentScreen === 'hasil_deteksi_mastitis' || currentScreen === 'hasil_cnn_sapi12' || currentScreen === 'rescan_mastitis') && (
        <HasilDeteksiMastitis
          onBack={() => handleNavigate('deteksi_mastitis_cnn_inspeksi')}
          onNavigate={handleNavigate}
        />
      )}
      {(currentScreen === 'pemindai_rfid' || currentScreen === 'pemindai_rfid_siaga' || currentScreen === 'tap_rfid_sapi12' || currentScreen === 'pindai_rfid_yolo' || currentScreen === 'pindai_rfid_sapi18') && (
        <PemindaiRFID onNavigate={handleNavigate} />
      )}
      {(currentScreen === 'ketik_manual_eartag' || currentScreen === 'ketik_eartag_sapi07') && (
        <KetikManualEartag onNavigate={handleNavigate} />
      )}
      {(currentScreen === 'telemetri_rutin' || currentScreen === 'telemetri_rutin_sapi12') && (
        <TelemetriRutin onNavigate={handleNavigate} />
      )}

      {/* 7. Prediksi Laktasi & Simulasi Pakan */}
      {(currentScreen === 'prediksi' || currentScreen === 'prediksi_ann_sapi07' || currentScreen === 'prediksi_xgboost_sapi12') && (
        <PrediksiLaktasiPakan onNavigate={handleNavigate} />
      )}
      {(currentScreen === 'simulasi_whatif' || currentScreen === 'simulasi_whatif_sapi12' || currentScreen === 'simulasi_hemat_sapi12' || currentScreen === 'aplikasi_formula_pakan_sapi07' || currentScreen === 'aplikasi_pakan_sapi12' || currentScreen === 'pakan_selesai_sapi07') && (
        <SimulasiPakanWhatIf
          onBack={() => handleNavigate('prediksi')}
          onNavigate={handleNavigate}
        />
      )}

      {/* 8. Pemerahan Susu */}
      {(currentScreen === 'pemerahan' || currentScreen === 'sesi_pemerahan_sore_sapi07' || currentScreen === 'sesi_pemerahan_sapi18') && (
        <SesiPemerahanSusu onNavigate={handleNavigate} />
      )}

      {/* 9. Pengobatan & Rekam Medis */}
      {currentScreen === 'pasca_pemulihan' && (
        <DashboardPascaPemulihan onNavigate={handleNavigate} />
      )}
      {(currentScreen === 'catat_pengobatan' || currentScreen === 'catat_salep_tube_2' || currentScreen === 'catat_salep_tube_3') && (
        <CatatPengobatanMastitis onNavigate={handleNavigate} />
      )}
      {(currentScreen === 'profil_sapi' || currentScreen === 'profil_rekam_medis' || currentScreen === 'profil_rekam_medis_tube3' || currentScreen === 'profil_rekam_medis_rescan2' || currentScreen === 'profil_rekam_medis_tube2' || currentScreen === 'profil_rekam_medis_awal') && (
        <ProfilRekamMedisSapi onNavigate={handleNavigate} />
      )}
      {currentScreen === 'rapid_test' && (
        <RapidTestSCC onNavigate={handleNavigate} />
      )}
    </div>
  );
}
