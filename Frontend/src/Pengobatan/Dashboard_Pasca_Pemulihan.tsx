import { useState } from 'react';
import type { ScreenType } from '../App.tsx';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../components/Navigation';

interface DashboardPascaPemulihanProps {
  onNavigate?: (screen: ScreenType) => void;
}

export default function DashboardPascaPemulihan({ onNavigate }: DashboardPascaPemulihanProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen antialiased flex flex-col lg:flex-row">
      {/* DESKTOP SIDEBAR */}
      <DesktopSidebar currentScreen="dashboard" onNavigate={onNavigate} />

      {/* MAIN CONTAINER */}
      <div className="flex-1 lg:pl-72 w-full flex flex-col">
        {/* Header */}
        <header className="sticky top-0 w-full z-40 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff]/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="max-w-4xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl text-[#00450d] hover:bg-[#dee8ff]/50 transition-colors flex items-center justify-center"
                aria-label="Buka Menu"
              >
                <span className="material-symbols-outlined text-[24px]">menu</span>
              </button>
              <div 
                onClick={() => onNavigate?.('dashboard')}
                className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00450d] to-[#1b5e20] flex items-center justify-center text-white shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">local_florist</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-[#00450d] leading-none">MowTitis</span>
                  <span className="text-xs text-[#006b5f] font-semibold leading-none mt-1">Rembangan Dairy Farm</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => onNavigate?.('notifikasi_wa')}
                className="w-10 h-10 rounded-full bg-white border border-[#dee8ff] flex items-center justify-center text-[#41493e] hover:text-[#111c2d] relative transition-colors shadow-xs"
                title="Notifikasi"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#1b5e20]"></span>
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#8df5e4] shadow-xs">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCn3kRgbAx07X77LMnuqcwbQC7BrG-fmY-mSukU217UIhHqJ3dLDWHrOAl2mbn6u7-hdo3MMuzWKdRzDRUvroVvZkstq_mT3OwIFVuR4bm67kfE2X5cVxoDGkklIOXdApAkboytBZ5HjMSTGireDwYVZdJ5MgkRC4OrheTKI43vlFt1v5K4D923Hm4T3r8MRZxlROIaTdyjRYY6ApXYOeQeQe6eiWyaoB8Hsv6tIcodjXzLRJM0pgU" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-4 pb-28 lg:pb-12 flex flex-col gap-4">
        {/* Greeting Banner */}
        <section className="bg-white border border-[#dee8ff] rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#8df5e4]/30 blur-2xl pointer-events-none"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-[#111c2d] tracking-tight">
                Selamat Pagi, Pak Hafid 👋
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[#41493e]">
                <span className="material-symbols-outlined text-[16px] text-[#006b5f]">location_on</span>
                <span className="text-xs font-semibold">Kandang Rembangan, Arjasa - Jember</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f3ff] border border-[#dee8ff] text-[#00450d] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#00450d] animate-pulse"></span>
              <span className="text-xs font-bold">LIVE</span>
            </div>
          </div>

          <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0f3ff] border border-[#dee8ff] text-[#41493e] shadow-xs">
            <span className="material-symbols-outlined text-[16px] text-[#006b5f]">sensors</span>
            <span className="text-xs font-bold text-[#006b5f]">
              Online • Model YOLOv26 & ANN Aktif
            </span>
          </div>
        </section>

        {/* Critical Diagnostic Alert (Green Celebration) */}
        <section className="bg-[#acf4a4]/40 border border-[#acf4a4] rounded-2xl p-4 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#00450d] text-white flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[22px]">verified</span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#0c5216] font-extrabold">Status Medis Terkini</span>
              <span className="text-[10px] bg-[#00450d] text-white px-2.5 py-0.5 rounded-full font-bold">Kondisi Prima</span>
            </div>
            <p className="text-sm font-extrabold text-[#002203] mt-1">Status Kesehatan Kandang: Kondisi Prima</p>
            <span className="text-xs text-[#0c5216] mt-1 leading-relaxed">
              Sapi #04 Mawar sembuh tuntas dari mastitis & telah dipindahkan kembali ke Kandang A. Seluruh populasi laktasi aman tanpa residu obat.
            </span>
            <div className="mt-2 flex items-center gap-2">
              <button 
                onClick={() => onNavigate?.('profil_sapi')}
                className="text-xs font-bold text-[#00450d] hover:underline flex items-center gap-1"
              >
                <span>Lihat Profil Sapi Mawar</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Quick Metrics */}
        <section className="grid grid-cols-1 gap-3">
          {/* Milk Production Today */}
          <div className="bg-white border border-[#dee8ff] rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#8df5e4] text-[#007165] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">water_drop</span>
                </div>
                <span className="text-xs font-bold text-[#111c2d]">Produksi Susu Hari Ini</span>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#acf4a4] text-[#002203]">
                97.4% Tercapai
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#111c2d] tracking-tight">121.7</span>
              <span className="text-sm font-bold text-[#41493e]">/ 125 Liter</span>
            </div>

            <div className="w-full bg-[#f0f3ff] h-2.5 rounded-full mt-1 overflow-hidden border border-[#dee8ff]">
              <div className="bg-[#1b5e20] h-full rounded-full" style={{ width: '97.4%' }}></div>
            </div>

            <div className="mt-2 pt-2 border-t border-[#dee8ff] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-[#41493e]">
                <span className="material-symbols-outlined text-[16px] text-[#006b5f]">payments</span>
                <span>Estimasi Omzet:</span>
              </div>
              <span className="font-extrabold text-[#00450d]">
                Rp 1.703.800 <span className="font-normal text-[#41493e]">(@14k/L)</span>
              </span>
            </div>
          </div>

          {/* Herd Population Breakdown */}
          <div className="bg-white border border-[#dee8ff] rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#f0f3ff] border border-[#dee8ff] text-[#111c2d] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">pets</span>
                </div>
                <span className="text-xs font-bold text-[#111c2d]">Total Populasi Sapi</span>
              </div>
              <span className="text-base font-extrabold text-[#00450d]">28 Ekor</span>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-2">
              <div className="bg-[#f0f3ff] rounded-xl p-2.5 flex flex-col text-center border border-[#dee8ff]">
                <span className="text-[10px] text-[#41493e] font-semibold">Laktasi</span>
                <span className="text-base font-extrabold text-[#00450d] mt-0.5">9</span>
              </div>
              <div className="bg-[#f0f3ff] rounded-xl p-2.5 flex flex-col text-center border border-[#dee8ff]">
                <span className="text-[10px] text-[#41493e] font-semibold">Bunting</span>
                <span className="text-base font-extrabold text-[#006b5f] mt-0.5">4</span>
              </div>
              <div className="bg-[#f0f3ff] rounded-xl p-2.5 flex flex-col text-center border border-[#dee8ff]">
                <span className="text-[10px] text-[#41493e] font-semibold">Isolasi</span>
                <span className="text-base font-extrabold text-[#6c2200] mt-0.5">0</span>
              </div>
              <div className="bg-[#f0f3ff] rounded-xl p-2.5 flex flex-col text-center border border-[#dee8ff]">
                <span className="text-[10px] text-[#41493e] font-semibold">Dara/Kering</span>
                <span className="text-base font-extrabold text-[#111c2d] mt-0.5">15</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Action Field Triggers */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#111c2d] uppercase tracking-wide">
              Aksi Cepat Lapangan
            </span>
            <span className="text-[11px] text-[#717a6d]">4 Tombol Aktif</span>
          </div>

          {/* Primary Action Button */}
          <button 
            onClick={() => onNavigate?.('deteksi')}
            className="w-full h-13 py-3 rounded-full bg-[#00450d] text-white text-sm font-bold flex items-center justify-center gap-2.5 shadow-md hover:bg-[#1b5e20] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[24px]">center_focus_strong</span>
            <span>Pindai Mastitis (Kamera AI YOLO v26)</span>
          </button>

          {/* Sub Actions Grid */}
          <div className="grid grid-cols-3 gap-2 mt-1">
            <button 
              onClick={() => onNavigate?.('pemerahan')}
              className="bg-white border border-[#dee8ff] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs hover:bg-[#f0f3ff] active:scale-95 transition-all min-h-[76px]"
            >
              <div className="w-8 h-8 rounded-full bg-[#8df5e4] text-[#007165] flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
              </div>
              <span className="text-xs text-[#111c2d] font-bold">Catat Perah</span>
            </button>

            <button 
              onClick={() => onNavigate?.('katalog')}
              className="bg-white border border-[#dee8ff] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs hover:bg-[#f0f3ff] active:scale-95 transition-all min-h-[76px]"
            >
              <div className="w-8 h-8 rounded-full bg-[#dee8ff] text-[#00450d] flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
              </div>
              <span className="text-xs text-[#111c2d] font-bold">Sapi Baru</span>
            </button>

            <button 
              onClick={() => onNavigate?.('kas')}
              className="bg-white border border-[#dee8ff] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs hover:bg-[#f0f3ff] active:scale-95 transition-all min-h-[76px]"
            >
              <div className="w-8 h-8 rounded-full bg-[#f0f3ff] text-[#41493e] flex items-center justify-center mb-1 border border-[#dee8ff]">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </div>
              <span className="text-xs text-[#111c2d] font-bold">Kas & Pakan</span>
            </button>
          </div>
        </section>

        {/* 7-Day Production Mini Graph */}
        <section className="bg-white border border-[#dee8ff] rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#111c2d]">Riwayat Perah 7 Hari</span>
            <span className="text-xs font-bold text-[#00450d]">+12.4% vs Minggu Lalu</span>
          </div>

          <div className="h-28 flex items-end justify-between gap-2 pt-2 px-1">
            {[
              { day: 'Sen', val: 110, h: '65%' },
              { day: 'Sel', val: 112, h: '68%' },
              { day: 'Rab', val: 115, h: '75%' },
              { day: 'Kam', val: 118, h: '82%' },
              { day: 'Jum', val: 119, h: '85%' },
              { day: 'Sab', val: 120, h: '90%' },
              { day: 'Min', val: 121.7, h: '96%', active: true }
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-[#717a6d]">{item.val}</span>
                <div 
                  className={`w-full rounded-t-lg transition-all ${
                    item.active ? 'bg-[#1b5e20] shadow-sm' : 'bg-[#dee8ff]'
                  }`} 
                  style={{ height: item.h }}
                ></div>
                <span className="text-[10px] font-bold text-[#41493e]">{item.day}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeScreen="dashboard"
        onNavigate={onNavigate}
      />

      {/* Persistent Bottom Nav */}
      <MobileBottomNav activeScreen="dashboard" onNavigate={onNavigate} />
    </div>
  );
}
