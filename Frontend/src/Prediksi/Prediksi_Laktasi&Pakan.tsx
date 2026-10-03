import { useState } from 'react';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../components/Navigation';

interface PrediksiLaktasiPakanProps {
  onNavigate?: (screen: 'dashboard' | 'deteksi' | 'prediksi' | 'katalog' | 'kas' | 'opening') => void;
}

export default function PrediksiLaktasiPakan({ onNavigate }: PrediksiLaktasiPakanProps) {
  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // What-If Sliders state
  const [grass, setGrass] = useState<number>(35.0);
  const [concentrate, setConcentrate] = useState<number>(7.5);
  const [sbm, setSbm] = useState<number>(0.4);
  const [premix, setPremix] = useState<number>(150);

  // Selected scenario ('A' | 'B' | 'C')
  const [activeScenario, setActiveScenario] = useState<'A' | 'B' | 'C'>('B');

  // Applied toast state
  const [showToast, setShowToast] = useState(false);

  // Dynamic calculations based on sliders:
  // Base yield around 16.4 L with responsive formula
  const calculatedYield = (
    12.0 +
    (grass - 25) * 0.08 +
    (concentrate - 4) * 0.52 +
    sbm * 2.2 +
    (premix - 50) * 0.003
  ).toFixed(1);

  // Feed Cost calculation:
  // Grass Rp 300/kg, Conc Rp 4000/kg, SBM Rp 11000/kg, Premix Rp 24/g
  const feedCost = Math.round(
    grass * 300 + concentrate * 4000 + sbm * 11000 + premix * 24
  );

  // Milk Revenue @ Rp 14.000 / Liter
  const milkRevenue = Math.round(parseFloat(calculatedYield) * 14000);
  const netIOFC = milkRevenue - feedCost;

  const handleReset = () => {
    setGrass(35.0);
    setConcentrate(7.5);
    setSbm(0.4);
    setPremix(150);
    setActiveScenario('B');
  };

  const handleApply = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  return (
    <div className="bg-[#f9f9ff] font-sans text-[#111c2d] min-h-screen antialiased flex flex-col lg:flex-row">
      {/* DESKTOP SIDEBAR */}
      <DesktopSidebar currentScreen="prediksi" onNavigate={onNavigate} />

      {/* MAIN CONTAINER */}
      <div className="flex-1 lg:pl-72 w-full flex flex-col">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-40 h-16 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2 min-w-0">
            {/* Hamburger button on mobile */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-[#00450d] hover:bg-[#dee8ff]/50 transition-colors flex items-center justify-center"
              aria-label="Buka Menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <span className="material-symbols-outlined text-[#006b5f] text-[22px]">agriculture</span>
            <span className="text-[15px] sm:text-[16px] text-[#111c2d] font-bold truncate">Rembangan Dairy Farm</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-[13px] sm:text-[14px] text-[#41493e] truncate hidden sm:inline">Kandang Laktasi A & B</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert('IoT Sensors: Suhu 24°C, Kelembaban 78%, Palungan A-02 tersambung!')}
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

        {/* WORKSPACE CONTENT */}
        <main className="w-full flex-col pb-28 lg:pb-12 px-4 sm:px-8 py-6 max-w-[1440px] mx-auto">
          {/* Top Cattle Selector & Model Telemetry Header */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center border border-slate-200">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8TCZKPzc5fw-wXzsxXtevt2Amche1K_arWzrA36uNyFGoib3Q9dTwTPi2ZU2xb6lnSS0exsVRtWwEMKA22CpqAzCS3pPZ5tBkBCaVgsL9V7yg33k_-Pk3dUWw4029zJqyPqnYRmoY-NoVSepXxxZI7_c7aHKRWEqR57LQYjxiX_38RsAC-EOXRVSVey2HOCIu_BzI5XEKa09E5PwrWkG2Kxb56f3wixlvNdiDAMWTYfvPa9V2Q4M8" 
                    alt="Sapi Melati"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#00450d] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow">A-02</span>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[20px] sm:text-[22px] text-[#111c2d] font-extrabold tracking-tight">Sapi #12 — Melati</span>
                  <span className="bg-[#dee8ff] text-[#006b5f] text-[11px] px-2.5 py-0.5 rounded-full font-bold">Friesian Holstein Murni</span>
                  <span className="bg-[#acf4a4] text-[#0c5216] text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">verified</span> Fase Laktasi Awal
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1 text-[13px] text-[#41493e]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">scale</span> Bobot Hidup: <strong className="text-[#111c2d]">545 kg</strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#00450d]">calendar_month</span> Hari Laktasi (DIM): <strong className="text-[#00450d]">Hari ke-42</strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#006b5f]">monitor_weight</span> Target BCS: <strong className="text-[#111c2d]">3.25 / 5.0</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* AI Spec Badge */}
            <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
              <div className="bg-[#f0f3ff] px-4 py-2 rounded-xl border border-slate-200/60 flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[#00450d]">
                  <span className="material-symbols-outlined text-[18px]">memory</span>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold">XGBoost Regressor v2.4</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[#41493e] mt-0.5">
                  <span>R²: <strong className="text-[#111c2d]">0.88</strong> (High Conf.)</span>
                  <span>•</span>
                  <span>MAE: <strong className="text-[#111c2d]">±0.52 Liter</strong></span>
                </div>
              </div>

              <button 
                onClick={() => onNavigate?.('katalog')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e7eeff] text-[#111c2d] hover:bg-[#dee8ff] transition-colors text-[13px] font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                <span>Ganti Ternak</span>
              </button>
            </div>
          </section>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: 60% (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* 305-Day Wood's Lactation Model Chart */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00450d] text-[22px]">show_chart</span>
                      <h2 className="text-[18px] text-[#111c2d] font-bold">Kurva Siklus Laktasi 305 Hari</h2>
                    </div>
                    <p className="text-[12px] text-[#41493e] mt-0.5">
                      Wood's Lactation Model: <span className="font-mono text-slate-500">y(t) = a·t^b·e^(-ct)</span> disesuaikan sensor milking parlor Rembangan
                    </p>
                  </div>
                  <div className="flex items-center gap-1 self-start sm:self-auto">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b5e20]/10 text-[#00450d] text-[11px] font-extrabold">
                      <span className="w-2 h-2 rounded-full bg-[#1b5e20] animate-pulse"></span> Hari Ke-42 (Aktif)
                    </span>
                  </div>
                </div>

                {/* Wood's Model SVG Visualizer */}
                <div className="relative w-full bg-[#f0f3ff] rounded-xl p-4 overflow-hidden border border-slate-200/50">
                  <div className="flex items-center justify-between text-[#717a6d] text-[11px] font-bold mb-2 px-1">
                    <span>Produksi (Liter/Hari)</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-1 bg-[#00450d] inline-block rounded-full"></span> Model Prediksi XGBoost
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-[#006b5f] inline-block border-b-2 border-dashed border-[#006b5f]"></span> Historis Aktual
                      </span>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="relative w-full h-56">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 240">
                      <defs>
                        <linearGradient id="curveGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#1b5e20" stopOpacity="0.32" />
                          <stop offset="100%" stopColor="#1b5e20" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Gridlines */}
                      <line x1="40" y1="20" x2="680" y2="20" stroke="#dee8ff" strokeDasharray="3 3" strokeWidth="1" />
                      <line x1="40" y1="65" x2="680" y2="65" stroke="#dee8ff" strokeDasharray="3 3" strokeWidth="1" />
                      <line x1="40" y1="110" x2="680" y2="110" stroke="#dee8ff" strokeDasharray="3 3" strokeWidth="1" />
                      <line x1="40" y1="155" x2="680" y2="155" stroke="#dee8ff" strokeDasharray="3 3" strokeWidth="1" />
                      <line x1="40" y1="200" x2="680" y2="200" stroke="#c0c9bb" strokeWidth="1.5" />

                      {/* Phase Zone Backgrounds */}
                      <rect x="40" y="20" width="210" height="180" fill="#acf4a4" fillOpacity="0.12" />
                      <rect x="250" y="20" width="220" height="180" fill="#e7eeff" fillOpacity="0.25" />
                      <rect x="470" y="20" width="210" height="180" fill="#d8e3fb" fillOpacity="0.2" />

                      {/* Vertical Division Lines */}
                      <line x1="250" y1="20" x2="250" y2="200" stroke="#90d689" strokeDasharray="4 2" strokeWidth="1" />
                      <line x1="470" y1="20" x2="470" y2="200" stroke="#c0c9bb" strokeDasharray="4 2" strokeWidth="1" />

                      {/* Y-Axis Labels */}
                      <text x="32" y="24" textAnchor="end" fill="#717a6d" fontSize="10" fontFamily="Plus Jakarta Sans">20 L</text>
                      <text x="32" y="69" textAnchor="end" fill="#717a6d" fontSize="10" fontFamily="Plus Jakarta Sans">16 L</text>
                      <text x="32" y="114" textAnchor="end" fill="#717a6d" fontSize="10" fontFamily="Plus Jakarta Sans">12 L</text>
                      <text x="32" y="159" textAnchor="end" fill="#717a6d" fontSize="10" fontFamily="Plus Jakarta Sans">8 L</text>
                      <text x="32" y="204" textAnchor="end" fill="#717a6d" fontSize="10" fontFamily="Plus Jakarta Sans">0 L</text>

                      {/* Shaded Area under Curve */}
                      <path d="M 40,160 Q 95,80 166,42 Q 250,70 360,105 Q 470,135 600,170 L 680,186 L 680,200 L 40,200 Z" fill="url(#curveGradient)" />

                      {/* Predicted Curve */}
                      <path d="M 40,160 Q 95,80 166,42 Q 250,70 360,105 Q 470,135 600,170 L 680,186" fill="none" stroke="#00450d" strokeWidth="3.5" strokeLinecap="round" />

                      {/* Historical Actual line up to day 42 */}
                      <path d="M 40,165 L 60,145 L 80,120 L 100,98 L 120,78 L 128,61" fill="none" stroke="#006b5f" strokeWidth="2.5" strokeDasharray="4 2" />

                      {/* Current Day Marker (Day 42) */}
                      <line x1="128" y1="20" x2="128" y2="200" stroke="#ba1a1a" strokeDasharray="3 3" strokeWidth="1.5" />
                      <circle cx="128" cy="61" r="6" fill="#1b5e20" stroke="#ffffff" strokeWidth="2.5" />

                      {/* Peak Marker (Day 60) */}
                      <circle cx="166" cy="42" r="5" fill="#8df5e4" stroke="#006b5f" strokeWidth="2" />
                      <line x1="166" y1="42" x2="166" y2="200" stroke="#006b5f" strokeDasharray="2 2" strokeWidth="1" />

                      {/* Tooltip for Current Day */}
                      <g transform="translate(95, 18)">
                        <rect x="-4" y="-12" width="75" height="24" rx="6" fill="#111c2d" />
                        <text x="33" y="4" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">H-42: {calculatedYield} L</text>
                      </g>

                      {/* Tooltip for Peak */}
                      <g transform="translate(180, 28)">
                        <rect x="-4" y="-12" width="84" height="24" rx="6" fill="#e7eeff" />
                        <text x="38" y="4" fill="#00450d" fontSize="10" fontWeight="700" textAnchor="middle">Puncak (H-60): 18.2 L</text>
                      </g>

                      {/* X-Axis Day Markers */}
                      <text x="40" y="218" textAnchor="middle" fill="#717a6d" fontSize="10">H-0</text>
                      <text x="128" y="218" textAnchor="middle" fill="#ba1a1a" fontSize="10" fontWeight="700">H-42</text>
                      <text x="166" y="218" textAnchor="middle" fill="#006b5f" fontSize="10" fontWeight="700">H-60</text>
                      <text x="250" y="218" textAnchor="middle" fill="#717a6d" fontSize="10">H-100</text>
                      <text x="470" y="218" textAnchor="middle" fill="#717a6d" fontSize="10">H-200</text>
                      <text x="680" y="218" textAnchor="middle" fill="#717a6d" fontSize="10">H-305 (Kering)</text>
                    </svg>
                  </div>

                  {/* Phases Legend Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-200/60">
                    <div className="p-2.5 rounded-lg bg-white flex flex-col border border-slate-200/60">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00450d]"></span>
                        <span className="text-[12px] text-[#111c2d] font-bold">Fase Awal (0 - 100 Hari)</span>
                      </div>
                      <span className="text-[11px] text-[#41493e] mt-1">Mengejar Peak Yield (~18.2 L). Defisit energi normal; butuh TDN tinggi.</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white flex flex-col border border-slate-200/60">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#006b5f]"></span>
                        <span className="text-[12px] text-[#111c2d] font-bold">Fase Pertengahan (101 - 200)</span>
                      </div>
                      <span className="text-[11px] text-[#41493e] mt-1">Persistensi produksi optimal, menjaga kestabilan bobot &amp; laktasi stabil.</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white flex flex-col border border-slate-200/60">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                        <span className="text-[12px] text-[#111c2d] font-bold">Fase Akhir (201 - 305)</span>
                      </div>
                      <span className="text-[11px] text-[#41493e] mt-1">Penurunan bertahap, pemulihan BCS menjelang periode sapi bunting/kering.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* What-If Interactive Sliders & Scenarios */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006b5f] text-[22px]">tune</span>
                      <h3 className="text-[18px] text-[#111c2d] font-bold">Laboratorium Simulasi Variasi Pakan (What-If)</h3>
                    </div>
                    <p className="text-[12px] text-[#41493e]">Geser variabel nutrisi untuk menghitung ulang proyeksi XGBoost secara instan</p>
                  </div>
                  <button 
                    onClick={handleReset}
                    className="text-[#006b5f] hover:text-[#00450d] text-[12px] font-bold flex items-center gap-1 transition-colors self-start sm:self-auto"
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span> Reset Presisi
                  </button>
                </div>

                {/* 4 Sliders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f0f3ff] p-4 rounded-xl border border-slate-200/50">
                  {/* Slider 1: Rumput Hijauan */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[13px] font-bold text-[#111c2d] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[17px] text-[#00450d]">eco</span> Rumput Gajah / Odot Segar
                      </label>
                      <span className="text-[15px] text-[#00450d] font-extrabold">{grass.toFixed(1)} kg</span>
                    </div>
                    <input 
                      type="range"
                      min={25}
                      max={45}
                      step={0.5}
                      value={grass}
                      onChange={(e) => setGrass(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1b5e20]"
                    />
                    <div className="flex justify-between text-[#717a6d] text-[10px]">
                      <span>25 kg (Min)</span>
                      <span className="text-[#41493e] font-medium">Kadar Air ~82%</span>
                      <span>45 kg (Kenyang)</span>
                    </div>
                  </div>

                  {/* Slider 2: Konsentrat */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[13px] font-bold text-[#111c2d] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[17px] text-[#006b5f]">grain</span> Konsentrat Laktasi Komersial
                      </label>
                      <span className="text-[15px] text-[#006b5f] font-extrabold">{concentrate.toFixed(1)} kg</span>
                    </div>
                    <input 
                      type="range"
                      min={4}
                      max={11}
                      step={0.25}
                      value={concentrate}
                      onChange={(e) => setConcentrate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#006b5f]"
                    />
                    <div className="flex justify-between text-[#717a6d] text-[10px]">
                      <span>4.0 kg</span>
                      <span className="text-[#41493e] font-medium">Protein Kasar 18%</span>
                      <span>11.0 kg (Maks)</span>
                    </div>
                  </div>

                  {/* Slider 3: Bungkil Kedelai */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[13px] font-bold text-[#111c2d] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[17px] text-[#6c2200]">science</span> Bungkil Kedelai (SBM Ekstra)
                      </label>
                      <span className="text-[15px] text-[#6c2200] font-extrabold">+{sbm.toFixed(2)} kg</span>
                    </div>
                    <input 
                      type="range"
                      min={0}
                      max={1.5}
                      step={0.05}
                      value={sbm}
                      onChange={(e) => setSbm(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#933100]"
                    />
                    <div className="flex justify-between text-[#717a6d] text-[10px]">
                      <span>0.0 kg</span>
                      <span className="text-[#41493e] font-medium">Asam Amino Lisin</span>
                      <span>1.5 kg</span>
                    </div>
                  </div>

                  {/* Slider 4: Premix Buffer */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[13px] font-bold text-[#111c2d] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[17px] text-[#41493e]">medication</span> Premix Buffer NaHCO3
                      </label>
                      <span className="text-[15px] text-[#111c2d] font-extrabold">{premix} g</span>
                    </div>
                    <input 
                      type="range"
                      min={50}
                      max={300}
                      step={10}
                      value={premix}
                      onChange={(e) => setPremix(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1b5e20]"
                    />
                    <div className="flex justify-between text-[#717a6d] text-[10px]">
                      <span>50 g</span>
                      <span className="text-[#41493e] font-medium">Pencegah Asidosis</span>
                      <span>300 g</span>
                    </div>
                  </div>
                </div>

                {/* Scenario Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
                  {/* Scenario A */}
                  <div 
                    onClick={() => {
                      setActiveScenario('A');
                      setGrass(32.0);
                      setConcentrate(6.5);
                      setSbm(0.2);
                      setPremix(100);
                    }}
                    className={`p-4 rounded-xl flex flex-col justify-between cursor-pointer transition-all border ${
                      activeScenario === 'A' ? 'bg-[#dee8ff] border-[#006b5f] shadow-sm' : 'bg-[#f0f3ff] border-transparent hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#717a6d]">Skenario A</span>
                      <h4 className="text-[14px] font-bold text-[#111c2d]">Ransum Standar</h4>
                      <div className="mt-2 text-[#00450d] text-[22px] font-extrabold leading-tight">
                        15.1 L<span className="text-[12px] font-normal text-[#41493e]">/hari</span>
                      </div>
                      <p className="text-[11px] text-[#41493e] mt-1">Biaya: Rp 42.000/hari</p>
                      <p className="text-[11px] text-[#41493e]">IOFC: <strong className="text-[#111c2d]">Rp 169.400</strong></p>
                    </div>
                    <button className="mt-3 w-full py-1.5 rounded-lg bg-white text-[#111c2d] text-[11px] font-bold border border-slate-200">
                      {activeScenario === 'A' ? '✓ Terpilih' : 'Pilih Skenario'}
                    </button>
                  </div>

                  {/* Scenario B: Recommended */}
                  <div 
                    onClick={() => {
                      setActiveScenario('B');
                      setGrass(35.0);
                      setConcentrate(7.5);
                      setSbm(0.4);
                      setPremix(150);
                    }}
                    className={`p-4 rounded-xl flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden shadow-md ${
                      activeScenario === 'B' ? 'bg-[#1b5e20] text-white ring-2 ring-[#8df5e4]' : 'bg-[#1b5e20]/90 text-white'
                    }`}
                  >
                    <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-lg pointer-events-none"></div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-[#acf4a4] font-black">Skenario B • Rekomendasi</span>
                        <span className="material-symbols-outlined text-[16px] text-[#acf4a4]">auto_awesome</span>
                      </div>
                      <h4 className="text-[14px] font-bold text-white mt-0.5">Booster Menuju Puncak</h4>
                      <div className="mt-2 text-white text-[24px] font-black leading-tight">
                        16.4 L<span className="text-[12px] font-normal text-[#acf4a4]">/hari</span>
                      </div>
                      <p className="text-[11px] text-white/80 mt-1">Biaya: Rp 48.500/hari</p>
                      <p className="text-[11px] text-white/90">IOFC: <strong className="text-white">Rp 181.100</strong> <span className="text-[#acf4a4] font-bold">(+Rp 11.7k)</span></p>
                    </div>
                    <button className="mt-3 w-full py-1.5 rounded-lg bg-white text-[#00450d] text-[11px] font-extrabold shadow">
                      {activeScenario === 'B' ? '★ Sedang Aktif' : 'Pilih Skenario'}
                    </button>
                  </div>

                  {/* Scenario C */}
                  <div 
                    onClick={() => {
                      setActiveScenario('C');
                      setGrass(38.0);
                      setConcentrate(5.5);
                      setSbm(0.0);
                      setPremix(100);
                    }}
                    className={`p-4 rounded-xl flex flex-col justify-between cursor-pointer transition-all border ${
                      activeScenario === 'C' ? 'bg-[#dee8ff] border-[#006b5f] shadow-sm' : 'bg-[#f0f3ff] border-transparent hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#717a6d]">Skenario C</span>
                      <h4 className="text-[14px] font-bold text-[#111c2d]">Efisiensi Ransum</h4>
                      <div className="mt-2 text-[#006b5f] text-[22px] font-extrabold leading-tight">
                        14.8 L<span className="text-[12px] font-normal text-[#41493e]">/hari</span>
                      </div>
                      <p className="text-[11px] text-[#41493e] mt-1">Biaya: Rp 37.800/hari</p>
                      <p className="text-[11px] text-[#41493e]">IOFC: <strong className="text-[#111c2d]">Rp 169.400</strong></p>
                    </div>
                    <button className="mt-3 w-full py-1.5 rounded-lg bg-white text-[#111c2d] text-[11px] font-bold border border-slate-200">
                      {activeScenario === 'C' ? '✓ Terpilih' : 'Pilih Skenario'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: 40% (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Precision Feed Formula Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00450d] text-[22px]">restaurant</span>
                    <h3 className="text-[18px] text-[#111c2d] font-bold">Formula Pakan Presisi Hari Ini</h3>
                  </div>
                  <span className="text-[11px] bg-[#f0f3ff] px-2 py-0.5 rounded text-[#717a6d] font-mono font-bold">
                    FORM-MLT-42
                  </span>
                </div>

                {/* Nutrition Summary Pills */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200/50">
                    <span className="text-[10px] text-[#41493e] font-bold uppercase">BK (Bahan Kering)</span>
                    <div className="text-[15px] font-extrabold text-[#111c2d] mt-0.5">14.2 kg</div>
                    <span className="text-[10px] text-[#717a6d]">2.6% BB</span>
                  </div>
                  <div className="bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200/50">
                    <span className="text-[10px] text-[#41493e] font-bold uppercase">PK (Protein)</span>
                    <div className="text-[15px] font-extrabold text-[#00450d] mt-0.5">17.8%</div>
                    <span className="text-[10px] text-[#00450d] font-semibold">Target 17.5-18%</span>
                  </div>
                  <div className="bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200/50">
                    <span className="text-[10px] text-[#41493e] font-bold uppercase">TDN (Energi)</span>
                    <div className="text-[15px] font-extrabold text-[#006b5f] mt-0.5">68.4%</div>
                    <span className="text-[10px] text-[#006b5f] font-semibold">High Density</span>
                  </div>
                </div>

                {/* Feed Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[12px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[#717a6d] text-[11px] font-bold uppercase">
                        <th className="py-2 pr-2">Bahan Ransum</th>
                        <th className="py-2 px-2 text-right">As-Fed</th>
                        <th className="py-2 px-2 text-right">BK</th>
                        <th className="py-2 pl-2 text-right">Biaya</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2 pr-2 font-medium text-[#111c2d] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#00450d]"></span>
                          <span>Rumput Odot Rembangan</span>
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-[#111c2d]">{grass.toFixed(1)} kg</td>
                        <td className="py-2 px-2 text-right text-[#41493e]">{(grass * 0.18).toFixed(1)} kg</td>
                        <td className="py-2 pl-2 text-right text-[#111c2d]">Rp {(grass * 300).toLocaleString('id-ID')}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-2 font-medium text-[#111c2d] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#006b5f]"></span>
                          <span>Konsentrat Laktasi KUD</span>
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-[#111c2d]">{concentrate.toFixed(1)} kg</td>
                        <td className="py-2 px-2 text-right text-[#41493e]">{(concentrate * 0.88).toFixed(1)} kg</td>
                        <td className="py-2 pl-2 text-right text-[#111c2d]">Rp {(concentrate * 4000).toLocaleString('id-ID')}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-2 font-medium text-[#111c2d] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#6c2200]"></span>
                          <span>Bungkil Kedelai Murni</span>
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-[#111c2d]">{sbm.toFixed(2)} kg</td>
                        <td className="py-2 px-2 text-right text-[#41493e]">{(sbm * 0.9).toFixed(2)} kg</td>
                        <td className="py-2 pl-2 text-right text-[#111c2d]">Rp {Math.round(sbm * 11000).toLocaleString('id-ID')}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-2 font-medium text-[#111c2d] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                          <span>Premix Buffer Mineral</span>
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-[#111c2d]">{(premix / 1000).toFixed(2)} kg</td>
                        <td className="py-2 px-2 text-right text-[#41493e]">{(premix * 0.00095).toFixed(2)} kg</td>
                        <td className="py-2 pl-2 text-right text-[#111c2d]">Rp {Math.round(premix * 24).toLocaleString('id-ID')}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="font-bold text-[#111c2d] bg-[#f0f3ff]">
                        <td className="py-2.5 px-2">Total Harian</td>
                        <td className="py-2.5 px-2 text-right">{(grass + concentrate + sbm + premix / 1000).toFixed(2)} kg</td>
                        <td className="py-2.5 px-2 text-right">{(grass * 0.18 + concentrate * 0.88 + sbm * 0.9).toFixed(1)} kg</td>
                        <td className="py-2.5 pl-2 text-right text-[#00450d] font-black">Rp {feedCost.toLocaleString('id-ID')}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <span className="material-symbols-outlined text-[15px]">info</span>
                  <span>Pemberian dibagi 2 sesi: Pukul 06.00 WIB (Pagi) &amp; 15.00 WIB (Sore) pasca perah.</span>
                </div>
              </div>

              {/* Financial IOFC Margin Analysis */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00450d] text-[22px]">payments</span>
                    <h3 className="text-[18px] text-[#111c2d] font-bold">Analisis Marjin IOFC Harian</h3>
                  </div>
                  <span className="text-[11px] bg-[#acf4a4] text-[#0c5216] px-2.5 py-0.5 rounded-full font-bold">
                    +18.4% Feed Efficiency
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 bg-[#f0f3ff] p-4 rounded-xl border border-slate-200/50">
                  {/* Revenue */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#00450d] shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">local_drink</span>
                      </span>
                      <div>
                        <div className="text-[13px] font-bold text-[#111c2d]">Estimasi Pendapatan Susu</div>
                        <div className="text-[11px] text-[#41493e]">{calculatedYield} L @ Rp 14.000 / Liter (Grade A)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[14px] text-[#00450d] font-black">+Rp {milkRevenue.toLocaleString('id-ID')}</span>
                      <div className="text-[10px] text-[#00450d] font-semibold">Per Hari</div>
                    </div>
                  </div>

                  {/* Feed Cost */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-[#ffdad6] flex items-center justify-center text-[#93000a] shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                      </span>
                      <div>
                        <div className="text-[13px] font-bold text-[#111c2d]">Biaya Ransum Pakan (Cost)</div>
                        <div className="text-[11px] text-[#41493e]">Hijauan + konsentrat + suplemen</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[14px] text-[#ba1a1a] font-black">-Rp {feedCost.toLocaleString('id-ID')}</span>
                      <div className="text-[10px] text-[#ba1a1a] font-semibold">Per Hari</div>
                    </div>
                  </div>

                  {/* Net Margin Box */}
                  <div className="mt-2 p-3.5 rounded-xl bg-[#00450d] text-white flex items-center justify-between shadow-inner">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#acf4a4]">Marjin IOFC Bersih (Net Margin)</span>
                      <span className="text-[11px] text-white/80">Pendapatan susu di atas beban pakan</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[22px] font-black text-white leading-none">Rp {netIOFC.toLocaleString('id-ID')}</div>
                      <span className="text-[10px] text-[#acf4a4]">~Rp {(netIOFC * 30).toLocaleString('id-ID')} / Bulan</span>
                    </div>
                  </div>
                </div>

                {/* Insight Callout */}
                <div className="bg-[#dee8ff]/60 p-3 rounded-xl flex items-start gap-2 border border-[#dee8ff]">
                  <span className="material-symbols-outlined text-[#006b5f] text-[20px] shrink-0 mt-0.5">tips_and_updates</span>
                  <p className="text-[12px] text-[#41493e] leading-relaxed">
                    Optimalisasi formulasi XGBoost menjaga rasio pakan berada di <strong className="text-[#111c2d]">{((feedCost / milkRevenue) * 100).toFixed(1)}% dari total omzet</strong>, jauh lebih hemat dibanding batas toleransi industri susu (35%).
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-1">
                  <button 
                    onClick={handleApply}
                    className="w-full py-3 px-4 rounded-full bg-[#1b5e20] text-white font-bold text-[13px] shadow hover:bg-[#00450d] active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                    <span>Terapkan Formula ke Palungan A-02</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => window.print()}
                      className="py-2 px-3 rounded-full bg-[#e7eeff] text-[#111c2d] hover:bg-[#dee8ff] transition-colors text-[12px] font-semibold flex items-center justify-center gap-1.5 border border-slate-200"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#006b5f]">print</span>
                      <span>Cetak Lembar Timbang</span>
                    </button>

                    <button 
                      onClick={() => alert('Rencana nutrisi harian telah diekspor sebagai file CSV/PDF')}
                      className="py-2 px-3 rounded-full bg-[#e7eeff] text-[#111c2d] hover:bg-[#dee8ff] transition-colors text-[12px] font-semibold flex items-center justify-center gap-1.5 border border-slate-200"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#006b5f]">download</span>
                      <span>Ekspor Rencana</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Applied Formula Toast */}
      {showToast && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 bg-[#263143] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <span className="material-symbols-outlined text-[#8df5e4] text-[24px]">check_circle</span>
          <div className="flex flex-col text-left">
            <span className="text-[13px] font-bold">Instruksi Berhasil Dikirim ke Kandang</span>
            <span className="text-[11px] text-slate-300">Ransum palungan A-02 diperbarui pada terminal staf kandang.</span>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeScreen="prediksi"
        onNavigate={onNavigate}
      />

      {/* Persistent Bottom Nav for Mobile */}
      <MobileBottomNav activeScreen="prediksi" onNavigate={onNavigate} />
    </div>
  );
}
