import type { ScreenType } from '../App.tsx';

interface SuksesKirimWAProps {
  onNavigate?: (screen: ScreenType) => void;
  reportTitle?: string;
  recipient?: string;
  timestamp?: string;
}

export default function SuksesKirimWA({
  onNavigate,
  reportTitle = 'Laporan Kas Mikro & Rekapitulasi Produksi Susu',
  recipient = 'Pak Bambang (KUD Argopuro Jaya / Koperasi Rembangan)',
  timestamp = '15 Maret 2025 • 17:35 WIB',
}: SuksesKirimWAProps) {
  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen flex flex-col antialiased">
      {/* Top Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#00450d] flex items-center justify-center text-[#8df5e4] shadow-xs">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-[#00450d] leading-none">Mowtitis</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#acf4a4] text-[#002203] leading-none">Status</span>
              </div>
              <span className="text-[11px] text-[#006b5f] leading-none mt-0.5">Konfirmasi Transmisi Data</span>
            </div>
          </div>

          <button 
            onClick={() => onNavigate?.('buku_kas_mikro_mowtitis')}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#41493e] hover:bg-[#e7eeff] transition-colors"
            title="Tutup"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center relative w-full pt-20 pb-28 max-w-md mx-auto px-4 flex-1">
        {/* Animated Checkmark Circle */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-[#acf4a4]/40 flex items-center justify-center animate-ping absolute inset-0 opacity-75"></div>
          <div className="w-24 h-24 rounded-full bg-[#1b5e20] text-white flex items-center justify-center shadow-lg relative z-10">
            <span className="material-symbols-outlined text-[48px]">check</span>
          </div>
        </div>

        {/* Title & Status */}
        <h1 className="text-2xl font-black text-[#111c2d] text-center tracking-tight mb-1">
          Laporan Berhasil Terkirim!
        </h1>
        <p className="text-xs text-[#41493e] text-center max-w-xs mb-6">
          Pesan dan lampiran dokumen PDF resmi telah berhasil diteruskan ke WhatsApp Koperasi dan tersinkronisasi ke Cloud.
        </p>

        {/* Transmission Metadata Card */}
        <div className="w-full bg-white rounded-2xl p-5 border border-[#dee8ff] shadow-xs mb-6 flex flex-col gap-3.5">
          <div className="flex items-start justify-between border-b border-[#f0f3ff] pb-3">
            <span className="text-xs text-[#717a6d]">Dokumen</span>
            <span className="text-xs font-bold text-[#111c2d] text-right max-w-[200px] truncate">{reportTitle}</span>
          </div>

          <div className="flex items-start justify-between border-b border-[#f0f3ff] pb-3">
            <span className="text-xs text-[#717a6d]">Penerima</span>
            <span className="text-xs font-bold text-[#006b5f] text-right max-w-[200px]">{recipient}</span>
          </div>

          <div className="flex items-start justify-between border-b border-[#f0f3ff] pb-3">
            <span className="text-xs text-[#717a6d]">Waktu Transmisi</span>
            <span className="text-xs font-medium text-[#111c2d]">{timestamp}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#717a6d]">Status Verifikasi</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#007165] bg-[#8df5e4]/50 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007165]"></span>
              200 OK • Terverifikasi
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={() => onNavigate?.('buku_kas_mikro_mowtitis')}
            className="w-full py-3.5 px-4 rounded-xl bg-[#1b5e20] hover:bg-[#00450d] text-white font-bold text-sm shadow-md transition-all text-center flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            <span>Kembali ke Buku Kas</span>
          </button>

          <button
            onClick={() => onNavigate?.('unduh_kas')}
            className="w-full py-3 px-4 rounded-xl bg-white border border-[#dee8ff] text-[#111c2d] hover:bg-[#f0f3ff] font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Unduh Salinan PDF</span>
          </button>

          <button
            onClick={() => onNavigate?.('dashboard')}
            className="w-full py-2.5 px-4 text-[#41493e] hover:text-[#111c2d] text-xs font-semibold text-center transition-colors"
          >
            Kembali ke Beranda Utama
          </button>
        </div>
      </main>
    </div>
  );
}
