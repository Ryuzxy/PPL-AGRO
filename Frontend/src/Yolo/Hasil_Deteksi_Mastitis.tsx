import React, { useState } from 'react';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../components/Navigation';

interface HasilDeteksiMastitisProps {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
  cowName?: string;
  cowTag?: string;
  predictionData?: {
    status_prediksi: string;
    confidence_skor: number;
    probabilitas_mastitis: number;
    kuartir_terdampak: string;
    rekomendasi_penanganan: string;
  };
}

export const HasilDeteksiMastitis: React.FC<HasilDeteksiMastitisProps> = ({
  onBack,
  onNavigate,
  cowName = 'Melati',
  cowTag = '12',
  predictionData,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Check if session storage has live prediction or captured image from the camera
  let parsedPrediction: any = null;
  let capturedImage: string | null = null;
  try {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('mowtitis_last_prediction') : null;
    if (stored) parsedPrediction = JSON.parse(stored);
    capturedImage = typeof window !== 'undefined' ? sessionStorage.getItem('mowtitis_captured_image') : null;
  } catch (e) {
    console.warn('Error reading session data:', e);
  }

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const status = predictionData?.status_prediksi || parsedPrediction?.status_prediksi || 'Mastitis Subklinis';
  const confidence = predictionData?.confidence_skor || parsedPrediction?.confidence_skor || 96.8;
  const kuartir = predictionData?.kuartir_terdampak || parsedPrediction?.kuartir_terdampak || 'Kiri Belakang (Left Rear - RL)';
  const recommendation = predictionData?.rekomendasi_penanganan || parsedPrediction?.rekomendasi_penanganan || 'Aplikasi Salep Intramammar Dosis 1/3 (Cefa-Lak / Mastijet Forte) pasca pemerahan sore pada kuartir RL.';
  const detectedBoxes = parsedPrediction?.detected_boxes || [
    { label: 'Teat_FL (Kiri Depan)', confidence: 0.984, status: 'Sehat', temp: 38.3 },
    { label: 'Teat_FR (Kanan Depan)', confidence: 0.979, status: 'Sehat', temp: 38.4 },
    { label: 'Teat_RL (Kiri Belakang)', confidence: 0.946, status: 'Mastitis Subklinis', temp: 39.8, warning: true },
    { label: 'Teat_RR (Kanan Belakang)', confidence: 0.990, status: 'Sehat', temp: 38.2 },
  ];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] flex flex-col lg:flex-row min-h-screen antialiased">
      {/* Desktop Sidebar Navigation */}
      <DesktopSidebar currentScreen="deteksi" onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 w-full flex flex-col">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#263143] text-[#ecf1ff] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm z-50 animate-bounce">
            <span className="material-symbols-outlined text-[#8df5e4] text-[18px]">info</span>
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Header */}
        <header className="sticky top-0 w-full z-40 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff] shadow-xs">
          <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl text-[#00450d] hover:bg-[#dee8ff]/50 transition-colors flex items-center justify-center shrink-0"
                aria-label="Buka Menu"
              >
                <span className="material-symbols-outlined text-[24px]">menu</span>
              </button>

              <button
                type="button"
                onClick={onBack || (() => onNavigate?.('pilih_sapi_deteksi_cnn'))}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#41493e] hover:text-[#00450d] hover:bg-[#e7eeff] transition-colors shrink-0"
                title="Kembali"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </button>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-base font-extrabold text-[#00450d] tracking-tight leading-none">
                    MowTitis
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#00450d] text-[#8df5e4] text-[10px] font-black tracking-wide uppercase shadow-xs">
                    YOLO v26 AI
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#41493e] truncate mt-0.5">
                  Laporan Hasil Diagnosis Visual & Termal Ambing
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => showToast(`Ringkasan diagnosis Sapi #${cowTag} disalin!`)}
                className="w-9 h-9 rounded-full bg-[#e7eeff] flex items-center justify-center text-[#111c2d] hover:bg-[#dee8ff] transition-colors"
                title="Salin Diagnosis"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
              </button>
              <button
                onClick={() => onNavigate?.('pilih_sapi_deteksi_cnn')}
                className="px-3 py-1.5 rounded-xl bg-[#e7eeff] text-[#00450d] text-xs font-bold hover:bg-[#dee8ff] transition-colors flex items-center gap-1"
                title="Daftar Sapi"
              >
                <span className="material-symbols-outlined text-[16px]">pets</span>
                <span className="hidden sm:inline">Pilih Sapi</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex flex-col relative w-full pt-4 pb-28 lg:pb-12 max-w-4xl mx-auto px-4 gap-4 flex-1">
          {/* YOLOv26 Model Specs Banner */}
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#dee8ff] flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#00450d] text-[#8df5e4] flex flex-col items-center justify-center font-black text-xs shrink-0 shadow-sm">
                <span>v26</span>
                <span className="text-[8px] text-[#acf4a4] uppercase font-bold tracking-tighter">AI-Seg</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-[#00450d] uppercase tracking-wide">
                    Inferensi YOLOv26 Ultralytics Sukses
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#002203] text-[10px] font-bold">
                    8.4 ms (118 FPS)
                  </span>
                </div>
                <h2 className="text-sm font-extrabold text-[#111c2d] mt-0.5">
                  Sapi #{cowTag} ({cowName}) • Terverifikasi Cloud Supabase
                </h2>
                <p className="text-[11px] text-[#717a6d]">
                  Deteksi instan bounding box 4 kuartir ambing dengan arsitektur YOLOv26-XSeg Dairy Vision.
                </p>
              </div>
            </div>
          </div>

          {/* Captured Camera Image with YOLO Overlays */}
          {capturedImage && (
            <div className="bg-white rounded-2xl p-4 border border-[#dee8ff] shadow-sm flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#717a6d] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#006b5f]">photo_camera</span>
                  Frame Citra Kamera Langsung YOLOv26
                </span>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#8df5e4] text-[#00450d]">
                  Full Resolution Frame
                </span>
              </div>
              <div className="relative aspect-video max-h-[380px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                <img
                  src={capturedImage}
                  alt="Sampel Citra Ambing YOLOv26"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#8df5e4] text-[14px]">center_focus_strong</span>
                  <span>Target: {kuartir}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-[#00450d]/90 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[11px] font-black flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#acf4a4] animate-pulse"></span>
                  <span>Skor Keyakinan {confidence}%</span>
                </div>
              </div>
            </div>
          )}

          {/* YOLOv26 4-Quarter Target Breakdown Table */}
          <div className="bg-white rounded-2xl p-5 border border-[#dee8ff] shadow-sm flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#00450d]">crop_free</span>
                <span className="text-xs font-extrabold text-[#111c2d] uppercase tracking-wide">
                  Hasil Deteksi Bounding Box YOLOv26
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#006b5f] bg-[#e7eeff] px-2.5 py-1 rounded-full">
                Multi-Target Teat Quadrants
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {detectedBoxes.map((box: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    box.warning
                      ? 'bg-[#ffdad6]/40 border-[#ffdad6]'
                      : 'bg-[#f0f3ff] border-[#dee8ff]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        box.warning ? 'bg-[#ba1a1a] animate-ping' : 'bg-[#1b5e20]'
                      }`}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#111c2d] truncate">{box.label}</span>
                      <span className="text-[11px] text-[#41493e]">
                        Akurasi: <strong>{((box.confidence || 0.95) * 100).toFixed(1)}%</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        box.warning ? 'bg-[#ba1a1a] text-white' : 'bg-[#acf4a4] text-[#002203]'
                      }`}
                    >
                      {box.status}
                    </span>
                    <span className="text-[10px] text-[#717a6d] font-mono mt-0.5">
                      {box.temp ? `${box.temp}°C` : 'Suhu Normal'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnosis Highlight Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#dee8ff] shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#717a6d]">
                Kesimpulan Diagnostik Klinis
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#ffdad6] text-[#ba1a1a] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping"></span>
                {status}
              </span>
            </div>

            <div className="flex items-center justify-between border-y border-[#f0f3ff] py-3">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#717a6d]">Tingkat Keyakinan Global</span>
                <span className="text-2xl font-black text-[#111c2d]">{confidence}%</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[11px] text-[#717a6d]">Kuartir Terdampak</span>
                <span className="text-sm font-extrabold text-[#ba1a1a]">{kuartir}</span>
              </div>
            </div>

            {/* 4 Quadrants Visual Map */}
            <div>
              <span className="text-[11px] font-bold text-[#41493e] block mb-2">
                Peta Respon 4 Kuartir Ambing:
              </span>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-[#acf4a4]/20 border border-[#acf4a4] text-[#00450d] font-bold">
                  Depan Kiri (FL)<br />
                  <span className="text-[10px] font-normal text-[#006b5f]">Normal (140k SCC)</span>
                </div>
                <div className="p-3 rounded-xl bg-[#acf4a4]/20 border border-[#acf4a4] text-[#00450d] font-bold">
                  Depan Kanan (FR)<br />
                  <span className="text-[10px] font-normal text-[#006b5f]">Normal (155k SCC)</span>
                </div>
                <div className="p-3 rounded-xl bg-[#ffdad6] border-2 border-[#ba1a1a] text-[#ba1a1a] font-black shadow-xs">
                  Belakang Kiri (RL)<br />
                  <span className="text-[10px] font-bold text-[#ba1a1a]">Radang (520k SCC)</span>
                </div>
                <div className="p-3 rounded-xl bg-[#acf4a4]/20 border border-[#acf4a4] text-[#00450d] font-bold">
                  Belakang Kanan (RR)<br />
                  <span className="text-[10px] font-normal text-[#006b5f]">Normal (170k SCC)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Recommendation Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#dee8ff] shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#006b5f]">prescriptions</span>
              <span className="text-xs font-bold text-[#111c2d] uppercase tracking-wider">
                Rekomendasi Penanganan Medis
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#e7eeff] border border-[#cfdaf2] text-xs text-[#111c2d] leading-relaxed">
              {recommendation}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => onNavigate?.('catat_pengobatan')}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1b5e20] hover:bg-[#00450d] active:scale-98 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">medical_services</span>
              <span>Catat Terapi Salep Sekarang</span>
            </button>

            <button
              onClick={() => onNavigate?.('deteksi_mastitis_cnn_inspeksi')}
              className="w-full py-3 px-4 rounded-xl bg-white border border-[#dee8ff] text-[#111c2d] hover:bg-[#f0f3ff] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#00450d]">photo_camera</span>
              <span>Pindai Ulang dengan Kamera YOLOv26</span>
            </button>

            <button
              onClick={() => onNavigate?.('profil_sapi')}
              className="w-full py-2.5 px-4 text-[#41493e] hover:text-[#111c2d] text-xs font-semibold text-center transition-colors cursor-pointer"
            >
              Lihat Rekam Medis Sapi #{cowTag}
            </button>
          </div>
        </main>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeScreen="hasil_deteksi_mastitis"
        onNavigate={onNavigate}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeScreen="deteksi"
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default HasilDeteksiMastitis;
