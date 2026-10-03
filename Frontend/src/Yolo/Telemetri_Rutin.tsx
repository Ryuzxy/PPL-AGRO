import { useState } from 'react';
import type { ScreenType } from '../App.tsx';

interface TelemetriRutinProps {
  onNavigate?: (screen: ScreenType) => void;
}

export default function TelemetriRutin({ onNavigate }: TelemetriRutinProps) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#263143] text-[#ecf1ff] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm z-50 animate-bounce">
          <span className="material-symbols-outlined text-[#8df5e4] text-[18px]">verified</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff] px-4 py-3 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => onNavigate?.('deteksi')}
              className="w-10 h-10 rounded-full bg-white border border-[#dee8ff] flex items-center justify-center text-[#111c2d] hover:bg-[#f0f3ff] transition-transform active:scale-95 shadow-xs"
              title="Kembali"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-[#111c2d]">Telemetri Rutin Tersimpan</h1>
              <span className="text-xs text-[#006b5f] font-semibold">Sapi #12 Melati • Kandang Laktasi</span>
            </div>
          </div>

          <button 
            onClick={() => showToast('Tautan telemetri berhasil disalin!')}
            className="w-9 h-9 rounded-full bg-[#e7eeff] flex items-center justify-center text-[#00450d] hover:bg-[#dee8ff] transition-colors"
            title="Bagikan"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-20 pb-28 flex flex-col gap-4">
        {/* Saved Alert Banner */}
        <section className="pt-1">
          <div className="w-full bg-[#1b5e20] text-white rounded-2xl p-4 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#acf4a4] text-[#002203] flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#acf4a4]">
                  Tersimpan & Sinkronisasi Cloud
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/15 text-white">
                #LOG-TEL-20250315-012
              </span>
            </div>
            <div className="relative z-10 mt-0.5">
              <h2 className="text-base font-bold text-white leading-tight">
                Telemetri Rutin Melati Berhasil Disimpan
              </h2>
              <div className="flex items-center gap-2 mt-1 text-[#90d689] text-xs">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                <span>15 Mar 2025 • 16:15 WIB</span>
                <span>•</span>
                <span>Operator: Peternak Hafid</span>
              </div>
            </div>
          </div>
        </section>

        {/* Snapshot Visual YOLO & Thermal Diagnostics */}
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#dee8ff] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006b5f] text-[20px]">center_focus_strong</span>
              <span className="text-xs font-bold text-[#111c2d]">Visual YOLOv26 Snapshot</span>
            </div>
            <span className="text-[10px] font-bold text-[#006b5f] bg-[#8df5e4]/40 px-2 py-0.5 rounded-full">
              Cloud HD Sync
            </span>
          </div>

          {/* Camera Feed Image */}
          <div className="relative w-full h-52 rounded-xl overflow-hidden bg-[#e7eeff] shadow-inner border border-[#dee8ff]">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6TEXEsqP4gnGVDUdn6JZ8DMUeENpAEq-sHytaEYB6ANPmWCK-3zsefUwuFQBXP64w9Af8c0h19SOqnMhmPOSp20Y0AUUa5J4mfNot-RuFeDb3LZ13WFjJCiJ7BRW1k8dnSkmpdu5EgwYTDDvsC2XWt7FnRoFhk3AdEySM8u3m2Nh2pETJD_utpIO3dyzHVQ63JK4xLkL-zJOmnYVWkwUCPKfQEIBFoPXQgZhlerUuyHWSdyQ0p7P8" 
              alt="Visual YOLOv26 Snapshot Sapi Melati"
              className="w-full h-full object-cover"
            />
            {/* YOLOv26 Bounding Box Overlay */}
            <div className="absolute inset-4 rounded-xl border-2 border-dashed border-[#acf4a4] pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold bg-[#00450d]/90 text-white px-2 py-0.5 rounded shadow-sm backdrop-blur-md">
                  Ambing Depan: Sehat (98.4%)
                </span>
                <span className="text-[10px] font-bold bg-white/95 text-[#111c2d] px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#006b5f] animate-pulse"></span> 37.8°C
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-mono text-white bg-black/60 px-1.5 py-0.5 rounded">
                  Bounding Box #01
                </span>
                <span className="text-[10px] font-bold bg-[#00450d]/90 text-white px-2 py-0.5 rounded shadow-sm backdrop-blur-md">
                  Kuartir Belakang: 97.9% Stabil
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Cow Identity & Physical Status */}
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#dee8ff] space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#111c2d]">#12 Melati</h3>
                <span className="text-[10px] font-mono font-bold bg-[#f0f3ff] text-[#717a6d] px-2 py-0.5 rounded-full">
                  RMB-LK-012
                </span>
              </div>
              <p className="text-xs text-[#717a6d] mt-0.5">
                Friesian Holstein • Laktasi 1 (Hari 45) • Bobot: 485 kg (+2kg)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#acf4a4] text-[#002203] text-xs font-bold">
              Kondisi Prima
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-[#f0f3ff] flex flex-col">
              <span className="text-[10px] text-[#717a6d]">Status Mastitis</span>
              <span className="text-xs font-bold text-[#00450d] mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                Negatif (Bebas)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#f0f3ff] flex flex-col">
              <span className="text-[10px] text-[#717a6d]">Somatic Cell Count (SCC)</span>
              <span className="text-xs font-bold text-[#006b5f] mt-0.5">
                95.000 sel/mL (Grade A+)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#f0f3ff] flex flex-col">
              <span className="text-[10px] text-[#717a6d]">Simetri Kuartir</span>
              <span className="text-xs font-bold text-[#111c2d] mt-0.5">
                99.1% Sangat Seimbang
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#f0f3ff] flex flex-col">
              <span className="text-[10px] text-[#717a6d]">Suhu Termal Rata-rata</span>
              <span className="text-xs font-bold text-[#111c2d] mt-0.5">
                37.9°C (Normal)
              </span>
            </div>
          </div>
        </section>

        {/* Action Controls */}
        <div className="w-full space-y-2 pt-1">
          <button 
            type="button"
            onClick={() => onNavigate?.('deteksi')}
            className="w-full min-h-[50px] px-6 rounded-full bg-[#00450d] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#1b5e20] active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">document_scanner</span>
            <span>Lanjut Pindai Sapi Berikutnya</span>
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              type="button"
              onClick={() => onNavigate?.('katalog')}
              className="min-h-[44px] px-3 rounded-full bg-white border border-[#dee8ff] text-[#111c2d] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#f0f3ff] transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-[#006b5f]">format_list_bulleted</span>
              Lihat Katalog Sapi
            </button>
            <button 
              type="button"
              onClick={() => onNavigate?.('kas')}
              className="min-h-[44px] px-3 rounded-full bg-white border border-[#dee8ff] text-[#111c2d] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#f0f3ff] transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-[#00450d]">account_balance_wallet</span>
              Buka Buku Kas
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
