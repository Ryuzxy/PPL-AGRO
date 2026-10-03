import { useState, useEffect } from 'react';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../components/Navigation';
import { useWeather } from '../hooks/useWeather';
import { WindyWeatherModal, WindyWeatherWidget } from '../components/Weather';

interface DashboardWebProps {
  onNavigate?: (screen: any) => void;
}

export default function DashboardWeb({ onNavigate }: DashboardWebProps) {
  const [clock, setClock] = useState('06:42:15 WIB');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const weatherHook = useWeather();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setClock(`${h}:${m}:${s} WIB`);
    };
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#f9f9ff] font-sans text-[#111c2d] min-h-screen antialiased flex flex-col lg:flex-row">
      {/* SIDEBAR NAVIGATION FOR DESKTOP */}
      <DesktopSidebar currentScreen="dashboard" onNavigate={onNavigate} />

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:pl-72 w-full flex flex-col">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 h-16 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex items-center justify-between px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-xl text-[#111c2d] hover:bg-[#dee8ff] active:scale-95 transition-all flex items-center justify-center shrink-0"
              title="Buka Menu Navigasi"
              aria-label="Buka Menu Navigasi"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[#006b5f] text-[20px] sm:text-[22px] shrink-0">agriculture</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] sm:text-[16px] text-[#111c2d] font-bold truncate leading-tight">Rembangan Dairy Farm</span>
                <span className="text-[11px] sm:text-[12px] text-[#41493e] truncate leading-tight hidden xs:block">Kandang Laktasi A & B</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert('Sensor IoT Kandang Rembangan berhasil disinkronisasi!')}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e7eeff] text-[#111c2d] hover:bg-[#dee8ff] transition-colors text-[13px] font-semibold"
            >
              <span className="material-symbols-outlined text-[17px] text-[#006b5f]">sensors</span>
              <span>Sync IoT Sensor</span>
            </button>

            <button 
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e7eeff] text-[#111c2d] hover:bg-[#dee8ff] transition-colors text-[13px] font-semibold"
            >
              <span className="material-symbols-outlined text-[17px] text-[#41493e]">file_download</span>
              <span>Download Laporan PDF</span>
            </button>

            <button className="relative p-2 rounded-full text-[#41493e] hover:bg-[#e7eeff] transition-colors">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 bg-[#1b5e20] text-white text-[10px] font-bold rounded-full">0</span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-2">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                alt="Pak Hafid"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[12px] font-bold text-[#111c2d] leading-tight">Pak Hafid</span>
                <span className="text-[11px] text-[#41493e] leading-tight">Kepala Peternakan</span>
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE */}
        <main className="w-full flex-col pb-28 lg:pb-12 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1440px] mx-auto">
          {/* Executive Greeting & Actions */}
          <section className="flex flex-col lg:flex-row items-stretch justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 mb-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8df5e4] text-[#00201c] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006b5f] animate-pulse"></span>
                  Dual-AI Engine Aktif: CNN v4.2 &amp; XGBoost v2.4
                </span>
                <span className="font-bold text-[#717a6d] uppercase tracking-wider">Arjasa, Jember</span>
              </div>

              <h1 className="text-[22px] sm:text-[28px] font-black text-[#00450d] tracking-tight">
                Selamat Datang di Command Center MowTitis, Pak Hafid
              </h1>

              <p className="text-[13px] text-[#41493e] flex items-center gap-2 flex-wrap">
                <span className="material-symbols-outlined text-[17px] text-[#006b5f]">calendar_today</span>
                <span>Kamis, 24 Oktober 2024</span>
                <span className="text-slate-300">•</span>
                <span className="font-bold text-[#111c2d] font-mono">{clock}</span>
                <span className="text-slate-300">•</span>
                <span className="text-[#00450d] font-semibold">Siklus Perah Pagi Tuntas (Laktasi A &amp; B)</span>
              </p>
            </div>

            {/* Quick Action Pill Buttons */}
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-end gap-2 self-start lg:self-auto">
              <button 
                onClick={() => onNavigate?.('deteksi')}
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-full bg-[#1b5e20] text-white text-[13px] font-bold hover:bg-[#00450d] active:scale-95 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                <span>Pindai Ambing CNN</span>
              </button>

              <button 
                onClick={() => onNavigate?.('prediksi')}
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-full bg-[#006b5f] text-white text-[13px] font-bold hover:bg-[#005048] active:scale-95 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">neurology</span>
                <span>Simulasi XGBoost</span>
              </button>

              <button 
                onClick={() => onNavigate?.('kas')}
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-full bg-[#f0f3ff] text-[#111c2d] hover:bg-[#dee8ff] transition-colors text-[13px] font-bold border border-slate-200"
              >
                <span className="material-symbols-outlined text-[18px] text-[#6c2200]">account_balance_wallet</span>
                <span>Buku Kas</span>
              </button>

              <a 
                href="https://wa.me/?text=Laporan%20Setoran%20Susu%20Rembangan%20Dairy%20Farm%20-%20Total:%20142.8L%20Grade%20A%20Bebas%20Mastitis" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-full bg-[#8df5e4] text-[#00201c] hover:bg-[#70d8c8] font-bold text-[13px] transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>WA Koperasi</span>
              </a>
            </div>
          </section>

          {/* Live Microclimate Weather & Windy Radar Card */}
          <div className="mb-6">
            <WindyWeatherWidget weatherHook={weatherHook} variant="dashboard" />
          </div>

          {/* 4 Top Bespoke KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* KPI 1 */}
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-white shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#f0f3ff] text-[#006b5f]">
                    <span className="material-symbols-outlined text-[22px]">water_bottle</span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#717a6d]">Total Produksi Hari Ini</span>
                </div>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#8df5e4] text-[#00201c] text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[13px]">trending_up</span>+3.2%
                </span>
              </div>

              <div className="my-3 flex items-baseline gap-1">
                <span className="text-[34px] font-black text-[#00450d] tracking-tight">142.8</span>
                <span className="text-[16px] text-[#41493e] font-bold">L</span>
                <span className="text-[11px] text-[#717a6d] ml-auto">Target: 145.0 L</span>
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
                  <div className="bg-[#00450d] h-full rounded-l-full" style={{ width: '52%' }}></div>
                  <div className="bg-[#70d8c8] h-full rounded-r-full" style={{ width: '48%' }}></div>
                </div>
                <div className="flex justify-between items-center text-[12px] text-[#41493e]">
                  <span>Pagi: <strong className="text-[#111c2d]">74.5 L</strong></span>
                  <span>Sore: <strong className="text-[#111c2d]">68.3 L</strong></span>
                </div>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-white shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#d8e3fb] text-[#1b5e20]">
                    <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#717a6d]">Bebas Mastitis CNN</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#0c5216] text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span> Grade A
                </span>
              </div>

              <div className="my-3 flex items-baseline gap-2">
                <span className="text-[34px] font-black text-[#00450d] tracking-tight">18/18</span>
                <span className="text-[14px] text-[#006b5f] font-bold">100% Sehat</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#f0f3ff] flex items-center justify-between border border-slate-200/50">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#1b5e20] shrink-0"></span>
                  <span className="text-[11px] text-[#111c2d] font-bold truncate">#04 Mawar Lolos Karantina</span>
                </div>
                <span className="text-[10px] text-[#717a6d] font-mono">SCC &lt; 85k</span>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-white shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#ffdbcf] text-[#802a00]">
                    <span className="material-symbols-outlined text-[22px]">monetization_on</span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#717a6d]">IOFC Harian</span>
                </div>
                <span className="text-[11px] text-[#006b5f] font-bold">Efisiensi 94.8%</span>
              </div>

              <div className="my-3 flex items-baseline gap-1">
                <span className="text-[26px] font-black text-[#111c2d]">Rp 702.400</span>
                <span className="text-[11px] text-[#717a6d]">/ hari</span>
              </div>

              <div className="flex justify-between items-center text-[#41493e] text-[12px] pt-1">
                <span>Rata-rata / ekor:</span>
                <span className="font-extrabold text-[#00450d]">Rp 39.022</span>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-white shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#f0f3ff] text-[#006b5f]">
                    <span className="material-symbols-outlined text-[22px]">fence</span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#717a6d]">Populasi Kandang</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f0f3ff] text-[#111c2d] text-[11px] font-bold border border-slate-200">
                  0 Karantina
                </span>
              </div>

              <div className="my-3 flex items-baseline gap-1">
                <span className="text-[34px] font-black text-[#111c2d] tracking-tight">28</span>
                <span className="text-[14px] text-[#717a6d] font-bold">Ekor Total</span>
              </div>

              <div className="grid grid-cols-3 gap-1 text-center text-[11px]">
                <div className="bg-[#f0f3ff] py-1 px-1 rounded-md text-[#00450d] font-bold">18 Laktasi</div>
                <div className="bg-[#f0f3ff] py-1 px-1 rounded-md text-[#006b5f] font-bold">4 Bunting</div>
                <div className="bg-[#f0f3ff] py-1 px-1 rounded-md text-[#717a6d] font-bold">6 Kering</div>
              </div>
            </div>
          </section>

          {/* Main Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: 60% (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* 14-Day Production Chart */}
              <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-[#006b5f] uppercase tracking-wider font-extrabold">Pemantauan Volume &amp; Valuasi</span>
                    <h2 className="text-[18px] text-[#111c2d] font-bold">Tren Produksi Susu 14 Hari Terakhir</h2>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#f0f3ff] px-3 py-1 rounded-full text-[#41493e] text-[12px] border border-slate-200">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#1b5e20]"></span>
                    <span>Harga KUD Argopuro: <strong>Rp 7.000 / L</strong></span>
                  </div>
                </div>

                {/* Metric Summary */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-[#f0f3ff] rounded-xl border border-slate-200/50 text-center sm:text-left">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#717a6d] uppercase font-bold">Total Mingguan</span>
                    <span className="text-[15px] font-black text-[#00450d]">983.4 L</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#717a6d] uppercase font-bold">Rata-rata Harian</span>
                    <span className="text-[15px] font-black text-[#111c2d]">140.5 L</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#717a6d] uppercase font-bold">Omset KUD (7H)</span>
                    <span className="text-[15px] font-black text-[#006b5f]">Rp 6.883.800</span>
                  </div>
                </div>

                {/* SVG Visualizer */}
                <div className="relative w-full h-56 bg-[#f9f9ff] rounded-xl p-3 flex flex-col justify-end border border-slate-200/50">
                  <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
                    <div className="border-b border-slate-300"></div>
                    <div className="border-b border-slate-300"></div>
                    <div className="border-b border-slate-300"></div>
                    <div className="border-b border-slate-300"></div>
                  </div>

                  <svg className="w-full h-40 overflow-visible" preserveAspectRatio="none" viewBox="0 0 650 160">
                    <defs>
                      <linearGradient id="milkGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#1b5e20" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#1b5e20" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <path 
                      d="M 0,110 L 50,105 L 100,112 L 150,98 L 200,90 L 250,85 L 300,95 L 350,80 L 400,75 L 450,70 L 500,55 L 550,58 L 600,42 L 650,38 L 650,160 L 0,160 Z" 
                      fill="url(#milkGradient)" 
                    />
                    <path 
                      d="M 0,110 L 50,105 L 100,112 L 150,98 L 200,90 L 250,85 L 300,95 L 350,80 L 400,75 L 450,70 L 500,55 L 550,58 L 600,42 L 650,38" 
                      fill="none" 
                      stroke="#1b5e20" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    <circle cx="500" cy="55" r="4.5" fill="#ffffff" stroke="#1b5e20" strokeWidth="3" />
                    <circle cx="600" cy="42" r="4.5" fill="#ffffff" stroke="#1b5e20" strokeWidth="3" />
                    <circle cx="650" cy="38" r="6" fill="#006b5f" stroke="#ffffff" strokeWidth="2.5" />
                  </svg>

                  <div className="flex justify-between items-center pt-2 px-1 text-[#717a6d] text-[11px] font-bold border-t border-slate-200">
                    <span>11 Okt (134L)</span>
                    <span>14 Okt (137L)</span>
                    <span>17 Okt (139L)</span>
                    <span>20 Okt (141L)</span>
                    <span>22 Okt (142L)</span>
                    <span className="text-[#00450d]">Hari Ini (142.8L)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[12px] text-[#41493e]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#006b5f]">insights</span>
                    <span>Rerata produksi per ekor laktasi: <strong>7.93 L / sesi</strong></span>
                  </span>
                  <button 
                    onClick={() => onNavigate?.('prediksi')}
                    className="text-[#006b5f] font-bold hover:underline flex items-center gap-1"
                  >
                    Lihat Analitik Lengkap <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </section>

              {/* Feed Recommendation Spotlight */}
              <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-[#f0f3ff] text-[#006b5f]">
                      <span className="material-symbols-outlined text-[24px]">auto_graph</span>
                    </span>
                    <div>
                      <span className="text-[11px] text-[#006b5f] uppercase tracking-wider font-extrabold">Preskripsi Nutrisi Dinamis</span>
                      <h3 className="text-[18px] text-[#111c2d] font-bold">Rekomendasi Pakan AI Terkini</h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#8df5e4] text-[#00201c] text-[11px] font-bold">
                    Model XGBoost v2.4 (96.1%)
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#f0f3ff] flex flex-col gap-3 border border-slate-200/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#1b5e20] text-white flex items-center justify-center text-[18px] font-black shadow-sm">
                        #12
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-[15px] font-bold text-[#111c2d]">Sapi Melati (Tag RMB-12)</h4>
                          <span className="px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#0c5216] text-[10px] font-bold">Puncak H-85</span>
                        </div>
                        <span className="text-[11px] text-[#41493e]">Bobot: 485 kg • Produksi: 21.4 L/hari • BCS: 3.25</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#717a6d] uppercase block font-bold">Potensi Marjin Tambahan</span>
                      <span className="text-[18px] text-[#00450d] font-black">+Rp 105.100 / mgg</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/70 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#00450d] text-[20px] shrink-0 mt-0.5">tips_and_updates</span>
                    <p className="text-[12px] text-[#111c2d] leading-relaxed">
                      <strong>Anjuran AI:</strong> XGBoost mendeteksi kurva produksi Melati mendekati plateau. Disarankan menambah konsentrat <strong className="text-[#00450d]">0.4 kg Bungkil Kedelai</strong> dan mengurangi silase rumput 1.2 kg per sesi. Estimasi respon produksi: <strong>+1.6 L/hari</strong>.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3 text-[11px] text-[#717a6d]">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[15px] text-[#006b5f]">check_circle</span> TDN: 68.2%</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[15px] text-[#006b5f]">check_circle</span> PK: 16.4%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onNavigate?.('prediksi')}
                        className="px-4 py-1.5 rounded-full bg-[#1b5e20] text-white text-[12px] font-bold hover:bg-[#00450d] active:scale-95 transition-all shadow-sm"
                      >
                        Terapkan ke Menu Ransum
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: 40% (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Radar Ambing 4 Sapi Utama */}
              <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] text-[#006b5f] uppercase tracking-wider font-extrabold">Pemeriksaan Visual CNN</span>
                    <h3 className="text-[18px] text-[#111c2d] font-bold">Radar Ambing 4 Sapi Utama</h3>
                  </div>
                  <button onClick={() => onNavigate?.('katalog')} className="text-[12px] font-bold text-[#00450d] hover:underline">
                    Semua (28)
                  </button>
                </div>

                {/* Sapi 1 */}
                <div 
                  onClick={() => onNavigate?.('deteksi')}
                  className="p-3 rounded-xl bg-[#f0f3ff] flex items-center justify-between gap-3 hover:bg-[#dee8ff]/60 transition-colors cursor-pointer border border-slate-200/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8piisY7iiz1LQ7mMjBl2krHzOyU4Q529-y-aHYAnhfs5pP3RdBil74HVZHZB3VbnVtGekzfmdUAtfznqZgWVHT-sdlBtnOxxstr513aWxMUH4RMSjhiugb1idhnzUvkifJ1R4OhlibInhgM1fIkP4YPIOyfRmWPQp2ItU1CAt2FdMCh-kSg8YXY2TOAOINaJ7dnlST4T0gJU4nb7W4EJ2sCqMmmOHU8MPF1CmIbffDA8VbhzuaaGJ" 
                      alt="Melati"
                      className="w-11 h-11 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-extrabold text-[#111c2d] truncate">Melati (#12)</span>
                        <span className="px-1.5 py-0.2 rounded bg-white text-[#00450d] text-[10px] font-bold border border-slate-200">21.4 L</span>
                      </div>
                      <span className="text-[11px] text-[#41493e] truncate">Ambing Simetris • Suhu 38.6°C</span>
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#0c5216] text-[10px] font-extrabold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">verified</span> SEHAT
                  </span>
                </div>

                {/* Sapi 2: Mawar Pulih */}
                <div 
                  onClick={() => onNavigate?.('deteksi')}
                  className="p-3 rounded-xl bg-[#8df5e4]/20 flex items-center justify-between gap-3 hover:bg-[#8df5e4]/30 transition-colors cursor-pointer border border-[#8df5e4]/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7ztQA4SHCr1ojt-NGvHVjWHWWAMj-xjEYilRHsbF3_mqW775wv9KSq67fHc4wM3DYR36p3OTIESo-AXGEgBVIyxUxCmSvtSKNllSLtVCAXT2koZ46qngxj2uPaxwqm2tgRtxyETbdQOQWmCmDFM9ubzwmIrhjsIMlZGn_KoTskvH_HteGlqbD4T296Ixk77QMPWmmNZ5NU4vwQk4B-K9Y_401AAS2Lddb22QIxYj71LbX3WMg-ag1" 
                      alt="Mawar"
                      className="w-11 h-11 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-extrabold text-[#111c2d] truncate">Mawar (#04)</span>
                        <span className="px-1.5 py-0.2 rounded bg-white text-[#006b5f] text-[10px] font-bold border border-slate-200">16.8 L</span>
                      </div>
                      <span className="text-[11px] text-[#41493e] truncate">Suhu 38.4°C • Tuntas Post-Mastitis</span>
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#8df5e4] text-[#00201c] text-[10px] font-extrabold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">health_and_safety</span> PULIH TOTAL
                  </span>
                </div>

                {/* Sapi 3 */}
                <div 
                  onClick={() => onNavigate?.('deteksi')}
                  className="p-3 rounded-xl bg-[#f0f3ff] flex items-center justify-between gap-3 hover:bg-[#dee8ff]/60 transition-colors cursor-pointer border border-slate-200/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWPg8eHYXmwW2fhbeId6mkoknXMaju_2-jj473r3Q17qcHVIZEVgTKdP3FDMUucsMp10WfbnW2cEVJHAKrWiw3MyUUAAlh-obwkEmymtgNyc01FYVJAoQdzt2-cxCXMXKh3D3zT0tcwQtx-TIVLmG6ifCXjjziBuXLN2Hr6BixUY2AmzuAu8d6DQJumKYUTgp2OXSavdddI7mzItreU3Dh6GeuTHJRiGqLnTr35xvWPlFWYOZiV5gn" 
                      alt="Cantik"
                      className="w-11 h-11 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-extrabold text-[#111c2d] truncate">Cantik (#07)</span>
                        <span className="px-1.5 py-0.2 rounded bg-white text-[#00450d] text-[10px] font-bold border border-slate-200">19.2 L</span>
                      </div>
                      <span className="text-[11px] text-[#41493e] truncate">Puting Kanan Bersih • pH 6.6</span>
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#0c5216] text-[10px] font-extrabold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">check</span> NORMAL
                  </span>
                </div>

                {/* Sapi 4 */}
                <div 
                  onClick={() => onNavigate?.('deteksi')}
                  className="p-3 rounded-xl bg-[#f0f3ff] flex items-center justify-between gap-3 hover:bg-[#dee8ff]/60 transition-colors cursor-pointer border border-slate-200/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJeeagUTxManEPE90Mm61v2lavowmVFMmcYo9U93IvVDAgNSarfNFX52H7gMQuYTd5DqOdxKTEo_K-0dbyPjKs4JWAs9RdeCMwaq4KeH-ieC1FzNayHt0FqGkhmGXYwIy7HHE3TvsKSgd9-GBGwX_YkQLAg4D2VuQIIx9QqAIp_G2p-_z0jg3XToVNQp5tOGOrN56s_9K4mgBtcACuf6zKww6Sel2Wh_8v3Nk9WQVRq6am5HA51eFN" 
                      alt="Sekar"
                      className="w-11 h-11 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-extrabold text-[#111c2d] truncate">Sekar (#18)</span>
                        <span className="px-1.5 py-0.2 rounded bg-white text-[#00450d] text-[10px] font-bold border border-slate-200">17.5 L</span>
                      </div>
                      <span className="text-[11px] text-[#41493e] truncate">SCC 110k • Laju Alir 2.8 L/mnt</span>
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#0c5216] text-[10px] font-extrabold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">check</span> NORMAL
                  </span>
                </div>
              </section>

              {/* Status Setor KUD Argopuro Jaya */}
              <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-[#f0f3ff] text-[#00450d]">
                      <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                    </span>
                    <div>
                      <span className="text-[11px] text-[#717a6d] uppercase tracking-wider font-extrabold">Kemitraan Distribusi</span>
                      <h3 className="text-[18px] text-[#111c2d] font-bold">KUD Argopuro Jaya</h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#acf4a4] text-[#0c5216] text-[11px] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#1b5e20] animate-pulse"></span> Terhubung Live
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#f0f3ff] flex flex-col gap-2.5 border border-slate-200/60">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                    <span className="text-[12px] text-[#41493e]">Kode Pengiriman Hari Ini</span>
                    <span className="text-[13px] text-[#111c2d] font-mono font-bold">#RMB-20241024-402</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#41493e]">Total Susu Disetor</span>
                    <span className="text-[16px] text-[#00450d] font-black">142.8 Liter</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#41493e]">Estimasi Nilai Cair (Bruto)</span>
                    <span className="text-[16px] text-[#111c2d] font-black">Rp 999.600</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#717a6d] pt-1">
                    <span>Uji Alkohol: <strong className="text-[#00450d]">Negatif (Lolos)</strong></span>
                    <span>BJ: <strong className="text-[#111c2d]">1.028 (Grade 1)</strong></span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <a 
                    href="https://wa.me/?text=Laporan%20Setoran%20Susu%20Rembangan%20Dairy%20Farm%20-%20Total:%20142.8L%20Grade%20A%20Bebas%20Mastitis" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#00450d] text-white hover:bg-[#1b5e20] font-bold text-[13px] transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>Kirim Rekap Otomatis ke WA Koperasi</span>
                  </a>
                  <p className="text-[11px] text-[#717a6d] text-center">
                    Sistem akan mengirimkan barcode RFID, BJ, dan verifikasi CNN Mastitis langsung ke Pengurus KUD.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentScreen="dashboard"
        onNavigate={onNavigate}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeScreen="dashboard"
        onNavigate={onNavigate}
      />

      {/* Windy Weather Radar Modal */}
      <WindyWeatherModal weatherHook={weatherHook} />
    </div>
  );
}
