import React from 'react';
import { useWeather } from '../../hooks/useWeather';
import { WindyWeatherModal, WindyWeatherWidget } from '../Weather';

interface DesktopSidebarProps {
  currentScreen: string;
  onNavigate?: (screen: any) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const weatherHook = useWeather();

  const isScreenActive = (id: string, related: string[] = []) => {
    return currentScreen === id || related.includes(currentScreen);
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex-col justify-between overflow-y-auto border-r border-slate-100">
      <div className="flex flex-col">
        {/* Brand Logo */}
        <div
          className="p-6 flex items-center gap-2 bg-white cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => onNavigate?.('opening')}
          title="Kembali ke Layar Pembuka"
        >
          <div className="w-10 h-10 rounded-xl bg-[#00450d] flex items-center justify-center text-[#8df5e4] shadow-sm">
            <span className="material-symbols-outlined text-[24px]">pets</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[18px] text-[#00450d] tracking-tight leading-none">
              MowTitis
            </span>
            <span className="text-[11px] font-bold text-[#41493e] truncate uppercase">
              Rembangan Dairy Farm
            </span>
          </div>
        </div>

        <div className="px-4 py-1">
          <div className="text-[11px] font-extrabold text-[#717a6d] uppercase px-2 py-1 tracking-wider">
            Navigasi Sistem
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-4">
          <button
            onClick={() => onNavigate?.('dashboard')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all text-left ${
              isScreenActive('dashboard', ['dashboard_kandang_mowtitis', 'dashboard_mobile'])
                ? 'bg-[#1b5e20] text-white font-bold shadow-sm'
                : 'text-[#41493e] hover:bg-[#dee8ff] hover:text-[#111c2d] font-semibold text-[14px]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span>Beranda</span>
          </button>

          <button
            onClick={() => onNavigate?.('deteksi')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all text-left ${
              isScreenActive('deteksi', [
                'pilih_sapi_deteksi_cnn',
                'deteksi_mastitis_cnn_inspeksi',
                'hasil_deteksi_mastitis',
                'pemindai_rfid',
                'telemetri_rutin',
              ])
                ? 'bg-[#1b5e20] text-white font-bold shadow-sm'
                : 'text-[#41493e] hover:bg-[#dee8ff] hover:text-[#111c2d] font-semibold text-[14px]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            <span>Deteksi YOLO v26</span>
          </button>

          <button
            onClick={() => onNavigate?.('prediksi')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all text-left ${
              isScreenActive('prediksi', ['simulasi_whatif'])
                ? 'bg-[#1b5e20] text-white font-bold shadow-sm'
                : 'text-[#41493e] hover:bg-[#dee8ff] hover:text-[#111c2d] font-semibold text-[14px]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">trending_up</span>
            <span>Prediksi XGBoost</span>
          </button>

          <button
            onClick={() => onNavigate?.('katalog')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all text-left ${
              isScreenActive('katalog', ['ringkasan_produksi_kawanan', 'profil_sapi'])
                ? 'bg-[#1b5e20] text-white font-bold shadow-sm'
                : 'text-[#41493e] hover:bg-[#dee8ff] hover:text-[#111c2d] font-semibold text-[14px]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">pets</span>
            <span>Katalog Ternak</span>
          </button>

          <button
            onClick={() => onNavigate?.('kas')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all text-left ${
              isScreenActive('kas', ['buku_kas_mikro_mowtitis', 'riwayat_kas', 'form_input_kas', 'kirim_laporan_wa'])
                ? 'bg-[#1b5e20] text-white font-bold shadow-sm'
                : 'text-[#41493e] hover:bg-[#dee8ff] hover:text-[#111c2d] font-semibold text-[14px]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            <span>Buku Kas Mikro</span>
          </button>
        </nav>

        {/* Clinical Quick Access for Desktop */}
        <div className="px-4 pt-4 mt-2">
          <div className="text-[11px] font-extrabold text-[#717a6d] uppercase px-2 py-1 tracking-wider">
            Aksi Cepat Medis
          </div>
          <div className="flex flex-col gap-0.5 mt-1">
            <button
              onClick={() => onNavigate?.('pemerahan')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs transition-colors ${
                currentScreen === 'pemerahan' ? 'bg-[#dee8ff] text-[#00450d] font-bold' : 'text-[#41493e] hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[17px] text-[#006b5f]">water_drop</span>
              <span>Sesi Pemerahan</span>
            </button>
            <button
              onClick={() => onNavigate?.('catat_pengobatan')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs transition-colors ${
                currentScreen === 'catat_pengobatan' ? 'bg-[#dee8ff] text-[#00450d] font-bold' : 'text-[#41493e] hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[17px] text-[#ba1a1a]">medical_services</span>
              <span>Terapi Mastitis</span>
            </button>
            <button
              onClick={() => onNavigate?.('rapid_test')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs transition-colors ${
                currentScreen === 'rapid_test' ? 'bg-[#dee8ff] text-[#00450d] font-bold' : 'text-[#41493e] hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[17px] text-[#007165]">biotech</span>
              <span>Rapid Test SCC</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Status Widget */}
      <div className="p-4 flex flex-col gap-2 bg-white border-t border-slate-100">
        <div className="bg-[#f0f3ff] p-3 rounded-lg flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#41493e] uppercase tracking-wide">
              Status Dual-AI Engine
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006b5f] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1b5e20]"></span>
            </span>
          </div>
          <span className="text-[12px] text-[#111c2d] font-bold">YOLOv26 + XGBoost v2.4</span>
          <div className="flex items-center gap-1 text-[#1b5e20] text-[12px] font-semibold">
            <span className="material-symbols-outlined text-[15px]">sync_saved_locally</span>
            <span>Live Synced Rembangan</span>
          </div>
        </div>

        {/* Live Weather & Windy Radar Widget */}
        <WindyWeatherWidget weatherHook={weatherHook} variant="sidebar" />
      </div>

      {/* Interactive Windy Weather & Maps Modal */}
      <WindyWeatherModal weatherHook={weatherHook} />
    </aside>
  );
};

export default DesktopSidebar;
