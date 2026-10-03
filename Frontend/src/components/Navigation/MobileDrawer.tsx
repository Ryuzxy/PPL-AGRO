import React from 'react';
import { useWeather } from '../../hooks/useWeather';
import { WindyWeatherModal, WindyWeatherWidget } from '../Weather';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen?: string;
  activeScreen?: string;
  onNavigate?: (screen: any) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentScreen,
  activeScreen,
  onNavigate,
}) => {
  const weatherHook = useWeather();
  const active = activeScreen || currentScreen || '';
  if (!isOpen) return null;

  const handleNav = (screen: string) => {
    onNavigate?.(screen);
    onClose();
  };

  const mainModules = [
    { id: 'dashboard', label: 'Beranda Sistem', icon: 'dashboard', badge: 'Utama' },
    { id: 'deteksi', label: 'Kamera Deteksi YOLO v26', icon: 'photo_camera', badge: 'YOLOv26' },
    { id: 'prediksi', label: 'Prediksi Produksi XGBoost', icon: 'trending_up', badge: 'AI Susu' },
    { id: 'simulasi_whatif', label: 'Simulasi Nutrisi What-If', icon: 'calculate', badge: 'Pakan' },
    { id: 'katalog', label: 'Katalog Kawanan Sapi', icon: 'pets', badge: '18 Ekor' },
    { id: 'kas', label: 'Buku Kas Mikro Peternak', icon: 'account_balance_wallet', badge: 'Keuangan' },
    { id: 'riwayat_kas', label: 'Riwayat Transaksi Kas', icon: 'receipt_long', badge: 'Histori' },
  ];

  const clinicalModules = [
    { id: 'pemerahan', label: 'Sesi Pemerahan Susu', icon: 'water_drop' },
    { id: 'catat_pengobatan', label: 'Catat Terapi Mastitis', icon: 'medical_services' },
    { id: 'pasca_pemulihan', label: 'Dashboard Pasca Pemulihan', icon: 'healing' },
    { id: 'rapid_test', label: 'Rapid Test Uji SCC', icon: 'biotech' },
    { id: 'pemindai_rfid', label: 'Pemindai RFID Eartag', icon: 'contactless' },
    { id: 'unduh_kas', label: 'Unduh & Cetak PDF', icon: 'file_download' },
  ];

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-slide-right">
        <div className="flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 bg-[#f0f3ff] border-b border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#00450d] text-[#8df5e4] flex items-center justify-center font-bold shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[24px]">pets</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[17px] text-[#00450d] tracking-tight leading-none truncate">
                  MowTitis
                </span>
                <span className="text-[11px] font-bold text-[#717a6d] truncate uppercase mt-0.5">
                  Rembangan Dairy Farm
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#41493e] hover:bg-white transition-colors"
              title="Tutup Menu"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Section 1: Main Modules */}
          <div className="px-3 pt-3">
            <span className="text-[11px] font-extrabold text-[#717a6d] uppercase px-2 py-1 tracking-wider block">
              Menu Utama
            </span>
            <div className="flex flex-col gap-0.5 mt-1">
              {mainModules.map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-[#1b5e20] text-white font-bold shadow-xs'
                        : 'text-[#111c2d] hover:bg-[#dee8ff] font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#8df5e4]' : 'text-[#006b5f]'}`}>
                        {item.icon}
                      </span>
                      <span className="text-[13px] truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#e7eeff] text-[#006b5f]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Clinical & Field Tools */}
          <div className="px-3 pt-4 border-t border-slate-100 mt-3">
            <span className="text-[11px] font-extrabold text-[#717a6d] uppercase px-2 py-1 tracking-wider block">
              Alat Lapangan & Medis
            </span>
            <div className="flex flex-col gap-0.5 mt-1">
              {clinicalModules.map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-[#00450d] text-white font-bold'
                        : 'text-[#41493e] hover:bg-[#dee8ff] hover:text-[#111c2d] font-medium'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-[#8df5e4]' : 'text-[#41493e]'}`}>
                      {item.icon}
                    </span>
                    <span className="text-[12px] truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer & System Telemetry */}
        <div className="p-4 bg-[#f0f3ff] border-t border-slate-200/70 flex flex-col gap-2.5 mt-4">
          {/* Live Weather Widget */}
          <WindyWeatherWidget weatherHook={weatherHook} variant="sidebar" />

          <div className="flex items-center justify-between text-[11px] px-1">
            <span className="text-[#717a6d] font-bold">Dual AI Engine</span>
            <span className="text-[#00450d] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#1b5e20] animate-pulse"></span>
              YOLOv26 + XGBoost Siap
            </span>
          </div>
          <button
            onClick={() => handleNav('opening')}
            className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-100 text-[#ba1a1a] font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Kembali ke Layar Pembuka</span>
          </button>
        </div>
      </div>

      {/* Windy Weather Radar Modal */}
      <WindyWeatherModal weatherHook={weatherHook} />
    </div>
  );
};

export default MobileDrawer;
