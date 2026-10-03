import React from 'react';

interface MobileBottomNavProps {
  activeScreen: string;
  onNavigate?: (screen: any) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeScreen,
  onNavigate,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Beranda',
      icon: 'dashboard',
      activeScreens: ['dashboard', 'dashboard_kandang_mowtitis', 'dashboard_mobile'],
    },
    {
      id: 'deteksi',
      label: 'YOLO v26',
      icon: 'photo_camera',
      activeScreens: [
        'deteksi',
        'pilih_sapi_deteksi_cnn',
        'deteksi_mastitis_cnn_inspeksi',
        'hasil_deteksi_mastitis',
        'pemindai_rfid',
        'telemetri_rutin',
      ],
    },
    {
      id: 'prediksi',
      label: 'Prediksi',
      icon: 'trending_up',
      activeScreens: ['prediksi', 'simulasi_whatif'],
    },
    {
      id: 'katalog',
      label: 'Kawanan',
      icon: 'pets',
      activeScreens: ['katalog', 'ringkasan_produksi_kawanan', 'profil_sapi'],
    },
    {
      id: 'kas',
      label: 'Kas Mikro',
      icon: 'account_balance_wallet',
      activeScreens: [
        'kas',
        'buku_kas_mikro_mowtitis',
        'riwayat_kas',
        'form_input_kas',
        'kirim_laporan_wa',
      ],
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#f9f9ff]/95 backdrop-blur-xl border-t border-[#dee8ff] py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = item.activeScreens.includes(activeScreen) || activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] transition-all relative ${
                isActive ? 'text-[#00450d]' : 'text-[#41493e] hover:text-[#111c2d]'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-0.5 bg-[#1b5e20] rounded-full"></span>
              )}
              <span
                className={`material-symbols-outlined text-[22px] transition-transform ${
                  isActive ? 'scale-110 font-bold' : ''
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span
                className={`text-[10px] sm:text-[11px] mt-0.5 tracking-tight ${
                  isActive ? 'font-black' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
