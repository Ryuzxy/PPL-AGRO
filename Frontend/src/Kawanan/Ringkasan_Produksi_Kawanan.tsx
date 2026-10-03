import { useState } from 'react';
import type { ScreenType } from '../App.tsx';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../components/Navigation';

interface RingkasanProduksiKawananProps {
  onNavigate?: (screen: ScreenType) => void;
}

export default function RingkasanProduksiKawanan({ onNavigate }: RingkasanProduksiKawananProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [period, setPeriod] = useState<'today' | '7days' | 'month' | 'lactation'>('today');

  const topCows = [
    {
      id: '07',
      name: 'Cantik (#07)',
      breed: 'FH Murni • Laktasi 3',
      stall: 'Line 05 Parlor A',
      liters: '26.50 L',
      percentage: '18.5%',
      status: 'Top Performer',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbRFr9JUo0u3i9xbyhMo6KkHGYveZJ809KdSCRsqqb5dEECfQ3Qk79MRWeCaWZ5_Hot3KRJqRSQ3r08SiWU5nkR--RA0Nw5hn-PPW7ueVvzabPUYqdsxNbw3wrTiyH6dsfa4HMj-FMrDsUPpWkbxJW1j_T1jxzKCNud-SepGnAvAEzv2Oc6q3JHiQZrvWPIhLPZPXJVwIiM5X2hRFX3doiAdNjdBGhldVnnVEUjNzm2G4rzdgYvMvL'
    },
    {
      id: '12',
      name: 'Melati (#12)',
      breed: 'FH Cross • Laktasi 2',
      stall: 'Line 02 Parlor A',
      liters: '21.40 L',
      percentage: '15.0%',
      status: 'Stabil',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfrE1eDrWFkuHXMJa7twfmYy1OPpAX1dzP-O19Etd7D-c_5uHjzzlihyuYyTpx2DyOdey9FKCUp2VVAVbb9wrRYGd14wsPReEvb_th7N3cQf8qk2QIeKLdDAkxEHIniUsKaU6nG-zxJs8s64FFgpa9ofwvPW0RWhfK8G4AEdKIQ9TvpuqdGQji1MWXWXsAET-MGsV_XEm4lyWSE9e_NZT5QqI2oOeB0wrLv5Tow3jmmpnP7h4anQHC'
    },
    {
      id: '18',
      name: 'Sekar (#18)',
      breed: 'FH Laktasi 1',
      stall: 'Line 04 Parlor A',
      liters: '18.20 L',
      percentage: '12.7%',
      status: 'Potensial',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7EvobBWcbpU-4fA6c4j0EMD7VO_6XweeX2EJKQ7KRcW2h3lCWAJ1Wt126zgRwG3Fw7JBawHHCv4rzm6XwnDAdK739UrxZQsN7i7Vjyn0Hb9IH8zZJjl9EwOMbtCFEL9FL5EVKscfSSdh4mCI2rnuO2ltQ8hxaHN3dCQGTEhMU4S6GMwNCFYgxgp8z5i_17ZjmMO6n0Cw4PfxH3FOM4eS4RpQkqNS-1No1hwpPEDk21dbYIFAw2NqJ'
    }
  ];

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen antialiased flex flex-col lg:flex-row">
      {/* DESKTOP SIDEBAR */}
      <DesktopSidebar currentScreen="katalog" onNavigate={onNavigate} />

      {/* MAIN CONTAINER */}
      <div className="flex-1 lg:pl-72 w-full flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl text-[#00450d] hover:bg-[#dee8ff]/50 transition-colors flex items-center justify-center"
                aria-label="Buka Menu"
              >
                <span className="material-symbols-outlined text-[24px]">menu</span>
              </button>
              <img 
                alt="Mowtitis App Logo" 
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD08e5QreFYl7RIvUgxCDpxUDEYjJ1rR0gt3qdu9AvQjCdk7o-MR3SSEhL75I619q9_hwjBOAoSf8tsihWKG9UH7asJGn9j3YLpbWTUGJKBi0YUJ9CwMCH03CfA5aksxZNbHxBUX2u28Kn6B9vmpKQyhl3rm1VvO2cLOBrv5_8lWQ1r3udNKM_OM200Jk-8O13SvY_sA03Vw9WX4JT3rtC3BeXFKkya9xHB7mVK9GTp9qv97zgk5gMN"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base text-[#00450d] leading-none">Mowtitis</span>
                <span className="text-[11px] text-[#006b5f] leading-none mt-0.5">Rembangan Dairy Farm</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => onNavigate?.('notifikasi_wa')}
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#41493e] hover:bg-[#e7eeff] transition-colors relative"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#f9f9ff]"></span>
              </button>
              <img 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#1b5e20]/20"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCn3kRgbAx07X77LMnuqcwbQC7BrG-fmY-mSukU217UIhHqJ3dLDWHrOAl2mbn6u7-hdo3MMuzWKdRzDRUvroVvZkstq_mT3OwIFVuR4bm67kfE2X5cVxoDGkklIOXdApAkboytBZ5HjMSTGireDwYVZdJ5MgkRC4OrheTKI43vlFt1v5K4D923Hm4T3r8MRZxlROIaTdyjRYY6ApXYOeQeQe6eiWyaoB8Hsv6tIcodjXzLRJM0pgU"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col relative w-full pt-4 pb-28 lg:pb-12 max-w-4xl mx-auto px-4">
        {/* Sub-Header Section */}
        <section className="pt-2 pb-2 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onNavigate?.('katalog')}
              className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#e7eeff] text-[#111c2d] hover:bg-[#dee8ff] transition-colors text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Katalog Kawanan</span>
            </button>
            <div className="flex items-center gap-1.5 text-[#006b5f] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span>Kecamatan Arjasa, Jember</span>
            </div>
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#111c2d] tracking-tight">
              Ringkasan Produksi Kawanan
            </h1>
            <p className="text-xs text-[#41493e]">
              Monitoring Agregat Hasil Perah Rembangan Dairy Farm
            </p>
          </div>

          {/* Live Sync Chip */}
          <div className="flex items-center justify-between bg-[#f0f3ff] px-3.5 py-2 rounded-full border border-[#dee8ff]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#91d78a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00450d]"></span>
              </span>
              <span className="text-xs font-bold text-[#111c2d]">IoT & Manual Sinkron</span>
            </div>
            <div className="flex items-center gap-1 text-[#00450d]">
              <span className="material-symbols-outlined text-[16px]">sensors</span>
              <span className="text-xs font-extrabold">35 Ekor Ternak</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button 
              onClick={() => setPeriod('today')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-xs ${
                period === 'today' ? 'bg-[#00450d] text-white' : 'bg-[#e7eeff] text-[#41493e] hover:bg-[#dee8ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">today</span>
              <span>Hari Ini (Pagi + Sore)</span>
            </button>
            <button 
              onClick={() => setPeriod('7days')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-xs ${
                period === '7days' ? 'bg-[#00450d] text-white' : 'bg-[#e7eeff] text-[#41493e] hover:bg-[#dee8ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">date_range</span>
              <span>7 Hari Terakhir</span>
            </button>
            <button 
              onClick={() => setPeriod('month')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-xs ${
                period === 'month' ? 'bg-[#00450d] text-white' : 'bg-[#e7eeff] text-[#41493e] hover:bg-[#dee8ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">calendar_month</span>
              <span>Bulan Ini</span>
            </button>
            <button 
              onClick={() => setPeriod('lactation')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-xs ${
                period === 'lactation' ? 'bg-[#00450d] text-white' : 'bg-[#e7eeff] text-[#41493e] hover:bg-[#dee8ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">cyclone</span>
              <span>Siklus Laktasi</span>
            </button>
          </div>
        </section>

        {/* Hero KPI: Total Produksi Hari Ini */}
        <section className="py-2">
          <div className="bg-[#00450d] text-white rounded-2xl p-5 shadow-md relative overflow-hidden flex flex-col gap-3">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#acf4a4] font-bold">
                  Total Produksi Hari Ini
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl md:text-4xl font-black tracking-tight">143.05</span>
                  <span className="text-base font-bold text-[#acf4a4]">Liter</span>
                </div>
              </div>
              <div className="bg-[#1b5e20] px-3 py-1.5 rounded-full flex items-center gap-1 text-[#acf4a4] text-xs font-bold shadow-inner">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>+5.2% vs Kmrn</span>
              </div>
            </div>

            {/* Target Progress Bar */}
            <div className="flex flex-col gap-1.5 relative z-10 pt-1">
              <div className="flex justify-between items-center text-xs text-[#acf4a4]">
                <span>Target Harian: 140.0 L</span>
                <span className="font-extrabold bg-white/20 px-2 py-0.5 rounded-md text-white">
                  102.2% Tercapai
                </span>
              </div>
              <div className="w-full h-2.5 bg-black/25 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-[#8df5e4] rounded-full transition-all duration-700" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* Sub Metric Tiles */}
            <div className="grid grid-cols-2 gap-2 pt-1 relative z-10">
              <div className="bg-black/20 rounded-xl p-3 flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-[#acf4a4] text-xs">
                  <span className="material-symbols-outlined text-[15px]">wb_twilight</span>
                  <span>Perahan Pagi (05-07)</span>
                </div>
                <span className="text-lg font-extrabold text-white">73.55 <span className="text-xs font-normal">L</span></span>
                <span className="text-[10px] text-[#91d78a]">~2.45 L/ekor laktasi</span>
              </div>

              <div className="bg-black/20 rounded-xl p-3 flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-[#8df5e4] text-xs">
                  <span className="material-symbols-outlined text-[15px]">wb_sunny</span>
                  <span>Perahan Sore (15-17)</span>
                </div>
                <span className="text-lg font-extrabold text-white">69.50 <span className="text-xs font-normal">L</span></span>
                <span className="text-[10px] text-[#70d8c8]">100% terserap kran</span>
              </div>
            </div>

            {/* Commercial Strip */}
            <div className="bg-white text-[#111c2d] rounded-xl p-3 flex items-center justify-between relative z-10 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#8df5e4]/50 flex items-center justify-center text-[#006b5f]">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#717a6d] uppercase font-bold">Estimasi Setor Koperasi</span>
                  <span className="text-base font-extrabold text-[#00450d]">Rp 1.001.350</span>
                </div>
              </div>
              <span className="text-xs text-[#006b5f] font-bold bg-[#f0f3ff] px-2.5 py-1 rounded-full border border-[#dee8ff]">
                @ Rp 7.000/L
              </span>
            </div>
          </div>
        </section>

        {/* Top Performer Cows */}
        <section className="py-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#111c2d]">Sapi Kontributor Teratas</h3>
            <span className="text-xs text-[#717a6d]">Top 3 Hari Ini</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {topCows.map((c, idx) => (
              <div 
                key={c.id}
                className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#dee8ff] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img 
                      alt={c.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100" 
                      src={c.image} 
                    />
                    <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#00450d] text-white text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#111c2d] truncate">{c.name}</h4>
                    <p className="text-[11px] text-[#717a6d]">{c.breed}</p>
                    <span className="text-[10px] text-[#006b5f] font-semibold">{c.stall}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-[#00450d]">{c.liters}</span>
                  <span className="block text-[10px] text-[#717a6d]">{c.percentage} kontribusi</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Button: Unduh PDF */}
        <div className="py-3">
          <button 
            onClick={() => onNavigate?.('unduh_rekap_produksi_kawanan')}
            className="w-full h-12 rounded-full bg-[#00450d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-[#1b5e20] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Unduh Rekap Laporan Produksi Kawanan (PDF)</span>
          </button>
        </div>
      </main>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeScreen="katalog"
        onNavigate={onNavigate}
      />

      {/* Persistent Bottom Nav */}
      <MobileBottomNav activeScreen="katalog" onNavigate={onNavigate} />
    </div>
  );
}
