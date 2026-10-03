import { useState } from 'react';
import type { ScreenType } from '../App.tsx';
import { useCows } from '../hooks/useSupabaseData';

interface PemindaiRFIDProps {
  onNavigate?: (screen: ScreenType) => void;
}

export default function PemindaiRFID({ onNavigate }: PemindaiRFIDProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const { cows } = useCows();

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSimulateTap = (cowTag: string, cowName: string) => {
    setIsScanning(true);
    showToast(`Membaca RFID Tag 360-0019284729${cowTag}...`);
    setTimeout(() => {
      setIsScanning(false);
      showToast(`Sapi #${cowTag} (${cowName}) Terverifikasi! Membuka inspeksi...`);
      setTimeout(() => {
        onNavigate?.('deteksi_mastitis_cnn_inspeksi');
      }, 700);
    }, 1000);
  };

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#263143] text-[#ecf1ff] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm z-50 animate-bounce">
          <span className="material-symbols-outlined text-[#8df5e4] text-[18px]">contactless</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff] px-4 py-3 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate?.('dashboard')}
              className="w-10 h-10 rounded-full bg-white border border-[#dee8ff] flex items-center justify-center text-[#111c2d] hover:bg-[#f0f3ff] transition-transform active:scale-95 shadow-xs"
              title="Kembali"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-[#111c2d]">Pemindai RFID Siaga</h1>
              <span className="text-xs text-[#006b5f] font-semibold">134.2 kHz ISO FDX-B • Sensor Aktif</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8df5e4]/40 text-[#007165] text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#006b5f] animate-ping"></span>
            <span>Mencari Sinyal</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-20 pb-28 flex flex-col gap-5">
        {/* Instruction Header */}
        <div className="flex flex-col gap-1 text-center mt-2">
          <h2 className="text-lg font-black text-[#111c2d]">Dekatkan Eartag Sapi ke Pemindai</h2>
          <p className="text-xs text-[#41493e]">
            Arahkan antena genggam RFID MowTitis pada telinga sapi untuk membaca identitas digital seketika.
          </p>
        </div>

        {/* Radar Antenna Visualizer */}
        <div className="relative flex flex-col items-center justify-center py-8">
          <div className={`w-44 h-44 rounded-full border-2 border-dashed ${isScanning ? 'border-[#007165] animate-spin' : 'border-[#1b5e20]/30'} flex items-center justify-center relative`}>
            <div className="w-32 h-32 rounded-full bg-[#acf4a4]/20 flex items-center justify-center">
              <button
                onClick={() => handleSimulateTap('12', 'Melati')}
                className="w-20 h-20 rounded-full bg-[#1b5e20] text-white flex flex-col items-center justify-center shadow-lg hover:bg-[#00450d] transition-transform active:scale-95 cursor-pointer"
                title="Tap untuk simulasi scan RFID"
              >
                <span className="material-symbols-outlined text-[36px]">contactless</span>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Tap RFID</span>
              </button>
            </div>
            {/* Ripple rings */}
            <span className="absolute inset-0 rounded-full border border-[#006b5f]/40 animate-ping opacity-75 pointer-events-none"></span>
          </div>
          <span className="text-[11px] font-bold text-[#006b5f] mt-4 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006b5f] animate-pulse"></span>
            Antena RFID Siaga (Radius Deteksi: 30 cm)
          </span>
        </div>

        {/* Quick Selection / Antrean Pemeriksaan */}
        <div className="bg-white rounded-2xl p-4 border border-[#dee8ff] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#111c2d] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#1b5e20]">format_list_bulleted</span>
              Pilih Cepat Sapi Antrean Kandang
            </span>
            <span className="text-[10px] text-[#717a6d] font-semibold">{cows.length > 0 ? cows.length : 18} Ekor Terdaftar</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleSimulateTap('12', 'Melati')}
              className="p-3 rounded-xl border border-[#dee8ff] bg-[#f9f9ff] hover:bg-[#e7eeff] transition-all text-left flex items-center gap-3 active:scale-98"
            >
              <div className="w-9 h-9 rounded-lg bg-[#acf4a4] text-[#002203] flex items-center justify-center font-black text-sm">
                #12
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#111c2d] truncate">Melati</span>
                <span className="text-[10px] text-[#ba1a1a] font-semibold">Jadwal Scan Sore</span>
              </div>
            </button>

            <button
              onClick={() => handleSimulateTap('07', 'Cantik')}
              className="p-3 rounded-xl border border-[#dee8ff] bg-[#f9f9ff] hover:bg-[#e7eeff] transition-all text-left flex items-center gap-3 active:scale-98"
            >
              <div className="w-9 h-9 rounded-lg bg-[#acf4a4] text-[#002203] flex items-center justify-center font-black text-sm">
                #07
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#111c2d] truncate">Cantik</span>
                <span className="text-[10px] text-[#006b5f] font-semibold">Line 05 Parlor A</span>
              </div>
            </button>

            <button
              onClick={() => handleSimulateTap('18', 'Sekar')}
              className="p-3 rounded-xl border border-[#dee8ff] bg-[#f9f9ff] hover:bg-[#e7eeff] transition-all text-left flex items-center gap-3 active:scale-98"
            >
              <div className="w-9 h-9 rounded-lg bg-[#acf4a4] text-[#002203] flex items-center justify-center font-black text-sm">
                #18
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#111c2d] truncate">Sekar</span>
                <span className="text-[10px] text-[#006b5f] font-semibold">Line 04 Parlor A</span>
              </div>
            </button>

            <button
              onClick={() => handleSimulateTap('04', 'Mawar')}
              className="p-3 rounded-xl border border-[#dee8ff] bg-[#f9f9ff] hover:bg-[#e7eeff] transition-all text-left flex items-center gap-3 active:scale-98"
            >
              <div className="w-9 h-9 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center font-black text-sm">
                #04
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#111c2d] truncate">Mawar</span>
                <span className="text-[10px] text-[#007165] font-semibold">Pasca Terapi Tube 3</span>
              </div>
            </button>
          </div>
        </div>

        {/* Alternative: Ketik Manual Eartag */}
        <button
          onClick={() => onNavigate?.('ketik_manual_eartag')}
          className="w-full py-3.5 px-4 rounded-xl border-2 border-dashed border-[#dee8ff] bg-white hover:bg-[#f0f3ff] text-[#41493e] hover:text-[#111c2d] font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">keyboard</span>
          <span>Eartag Rusak / Tidak Terbaca? Ketik Manual Nomor Sapi</span>
        </button>
      </main>
    </div>
  );
}
