import { useState } from 'react';
import type { ScreenType } from '../App.tsx';

interface RapidTestSCCProps {
  onNavigate?: (screen: ScreenType) => void;
}

export default function RapidTestSCC({ onNavigate }: RapidTestSCCProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [released, setReleased] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleConfirmRelease = () => {
    setReleased(true);
    showToast('Pelepasan resmi dikonfirmasi! Sapi Mawar dipindahkan ke Kandang A.');
    setTimeout(() => {
      onNavigate?.('profil_sapi');
    }, 1200);
  };

  const handlePrintCertificate = () => {
    showToast('Membuka dialog cetak Surat Keterangan Sehat (SKKH)...');
    setTimeout(() => {
      window.print();
    }, 600);
  };

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#263143] text-[#ecf1ff] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm z-50 animate-bounce">
          <span className="material-symbols-outlined text-[#8df5e4] text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff] px-4 py-3 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button 
              onClick={() => onNavigate?.('profil_sapi')}
              className="w-10 h-10 rounded-full bg-white border border-[#dee8ff] flex items-center justify-center text-[#111c2d] hover:bg-[#f0f3ff] transition-colors shrink-0 shadow-xs"
              title="Kembali ke Profil Sapi"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="flex flex-col min-w-0">
              <h1 className="text-base font-bold text-[#111c2d] truncate">Uji Bebas & Pelepasan</h1>
              <span className="text-xs text-[#41493e] truncate">Kandang B-02 • Rembangan, Jember</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8df5e4] text-[#00201c] text-xs font-bold shrink-0 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00450d] animate-ping"></span>
            05:30 WIB • Bebas Residu
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-4 pb-28 flex flex-col gap-4">
        {/* Hero Celebration & Release Ready Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00450d] via-[#1b5e20] to-[#2a6b2c] p-5 text-white shadow-lg">
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-[#acf4a4]/20 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
                <span className="material-symbols-outlined text-[16px] text-[#acf4a4]">verified</span>
                Karantina Selesai • Siap Pelepasan
              </div>
              <span className="text-2xl select-none">🎉</span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-md bg-white border border-white/20">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEw-5M13qtgkk3YGzgfEWarMzg4mtxik0H7vvsLhGpgJnDioA5DS_DWMNwrD7HQT6OZj1s3KlJOj34Cdokk4hHEUePOj4ohV4Y4VyGWxXUMne3H-Ui0aeuVN6ZqpoHckEHprV2hRtWZRdMMKglGgnMEWnTXgSbWTCHH3dlylCaPbaXXxApXRqL_DcQCoasv4YmhjNX1-puBzizU7D3Hdj_ieyn03VUa7cMARVfzFQMb_XJXmFoYD6H" 
                  alt="Sapi Mawar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold truncate text-white">Sapi #04 Mawar</h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#002203] text-[10px] font-extrabold">FH</span>
                </div>
                <p className="text-xs text-[#90d689] truncate">RFID: 360-9821-440 • Laktasi 2</p>
                <div className="flex items-center gap-3 mt-1 text-white">
                  <span className="text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">scale</span> 522 kg <strong className="text-[#acf4a4]">(+6 kg)</strong>
                  </span>
                  <span className="text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">vital_signs</span> Kondisi Prima
                  </span>
                </div>
              </div>
            </div>

            {/* Transfer Pathway Banner */}
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 flex items-center justify-between gap-2 text-white border border-white/15">
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#acf4a4] font-bold uppercase opacity-90">Lokasi Asal</span>
                <span className="text-sm font-bold truncate">Karantina B-02</span>
              </div>
              <div className="flex items-center px-2">
                <span className="material-symbols-outlined text-[24px] text-[#acf4a4] animate-pulse">trending_flat</span>
              </div>
              <div className="flex flex-col text-right min-w-0">
                <span className="text-[10px] text-[#acf4a4] font-bold uppercase opacity-90">Tujuan Pelepasan</span>
                <span className="text-sm font-bold truncate text-[#acf4a4]">Kandang Laktasi A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Lab & Rapid Test Section */}
        <div className="bg-white rounded-2xl border border-[#dee8ff] p-4 shadow-sm flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#dee8ff] flex items-center justify-center text-[#00450d]">
                <span className="material-symbols-outlined text-[20px]">science</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111c2d]">Hasil Uji Rapid Lab & Residu</h3>
                <p className="text-[11px] text-[#41493e]">Rapid SCC • CMT Diagnostic Kit</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#8df5e4] text-[#00201c] text-xs font-bold">
              Grade A Super
            </span>
          </div>

          {/* SCC Main Gauge Box */}
          <div className="bg-[#f0f3ff] rounded-xl p-4 border border-[#dee8ff] flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#717a6d] uppercase tracking-wider block">Somatic Cell Count (SCC)</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-extrabold text-[#00450d] tracking-tight">175.000</span>
                  <span className="text-xs text-[#41493e] font-semibold">sel/mL</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#717a6d] uppercase block">Batas Aman SNI</span>
                <span className="text-xs font-bold text-[#41493e]">&lt; 400.000 sel/mL</span>
              </div>
            </div>

            <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-[#dee8ff]">
              <div className="bg-[#1b5e20] h-full rounded-full" style={{ width: '43.7%' }}></div>
            </div>

            <span className="text-[11px] text-[#006b5f] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              Kondisi ambing sangat sehat, turun drastis 78% dari masa infeksi awal.
            </span>
          </div>

          {/* 4-Quarter CMT Rapid Matrix */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#111c2d]">Uji California Mastitis Test (CMT) Tiap Kuartir</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#f0f3ff] border border-[#dee8ff] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#111c2d] block">Depan Kiri (FL)</span>
                  <span className="text-[10px] text-[#006b5f] font-semibold">SCC 160.000</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#002203] text-[10px] font-extrabold">Negatif</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#f0f3ff] border border-[#dee8ff] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#111c2d] block">Depan Kanan (FR)</span>
                  <span className="text-[10px] text-[#006b5f] font-semibold">SCC 170.000</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#002203] text-[10px] font-extrabold">Negatif</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#8df5e4]/30 border border-[#8df5e4] flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs font-bold text-[#00201c] block">Belakang Kanan (RL)</span>
                  <span className="text-[10px] text-[#005048] font-semibold">Ex-Mastitis • 180k</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#002203] text-[10px] font-extrabold">Negatif</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#f0f3ff] border border-[#dee8ff] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#111c2d] block">Belakang Kiri (RR)</span>
                  <span className="text-[10px] text-[#006b5f] font-semibold">SCC 165.000</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#002203] text-[10px] font-extrabold">Negatif</span>
              </div>
            </div>
          </div>

          {/* Antibiotic Residue Strip */}
          <div className="p-3 rounded-xl bg-[#f0f3ff] border border-[#dee8ff] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#00450d] text-[22px]">medication</span>
              <div>
                <span className="text-xs font-bold text-[#111c2d] block">Uji Residu Antibiotik (Beta-Laktam Strip)</span>
                <span className="text-[10px] text-[#41493e]">Lolos masa penahanan 72 jam bebas residu Cefquinome</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#acf4a4] text-[#002203] text-xs font-extrabold">
              0.00 ppm (Bebas)
            </span>
          </div>

          {/* Digital Signatures Verification */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#dee8ff]">
            <div className="text-center p-2 rounded-xl bg-[#f9f9ff] border border-[#dee8ff]">
              <span className="text-[9px] font-bold text-[#717a6d] block uppercase">DIPERIKSA OLEH</span>
              <span className="font-serif italic font-bold text-[#00450d] text-base block my-0.5">Sutrisno</span>
              <span className="text-[11px] font-bold text-[#111c2d] block">Mantri Sutrisno, A.Md.Vet</span>
              <span className="text-[9px] text-[#717a6d] block">SIP: 524.3/2021/JBR</span>
            </div>

            <div className="text-center p-2 rounded-xl bg-[#f9f9ff] border border-[#dee8ff]">
              <span className="text-[9px] font-bold text-[#717a6d] block uppercase">DISETUJUI OLEH</span>
              <span className="font-serif italic font-bold text-[#006b5f] text-base block my-0.5">Hafid</span>
              <span className="text-[11px] font-bold text-[#111c2d] block">Pak Hafid</span>
              <span className="text-[9px] text-[#717a6d] block">Pengelola Kandang</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2.5 mt-2">
          <button 
            onClick={handleConfirmRelease}
            disabled={released}
            className="w-full h-12 rounded-full bg-[#1b5e20] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#00450d] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">transfer_within_a_station</span>
            <span>{released ? 'Telah Dipindahkan ke Kandang A' : 'Konfirmasi Pelepasan ke Kandang A'}</span>
          </button>

          <button 
            onClick={handlePrintCertificate}
            className="w-full h-11 rounded-full bg-white border border-[#dee8ff] text-[#111c2d] font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-[#f0f3ff] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[#006b5f] text-[18px]">print</span>
            <span>Cetak Surat Keterangan Sehat (SKKH)</span>
          </button>
        </div>
      </main>
    </div>
  );
}
