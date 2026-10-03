import { useState } from 'react';
import type { ScreenType } from '../App.tsx';
import { useCows, useCashflow, useMilkTelemetry } from '../hooks/useSupabaseData';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../components/Navigation';
import { useWeather } from '../hooks/useWeather';
import { WindyWeatherModal } from '../components/Weather';

interface DashboardKandangMowtitisProps {
  onNavigate?: (screen: ScreenType) => void;
}

export default function DashboardKandangMowtitis({ onNavigate }: DashboardKandangMowtitisProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const weatherHook = useWeather();

  const { cows } = useCows();
  const { todayIncome, todayExpense } = useCashflow();
  const { totalToday } = useMilkTelemetry();

  const healthyCowsCount = cows.length > 0 ? cows.filter(c => c.isHealthy).length : 18;
  const totalCowsCount = cows.length > 0 ? cows.length : 18;
  const displayIofc = todayIncome > todayExpense ? (todayIncome - todayExpense) : 702400;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const daysData = [
    { day: 'Sen', liters: 138, height: '65%' },
    { day: 'Sel', liters: 140, height: '70%' },
    { day: 'Rab', liters: 139, height: '68%' },
    { day: 'Kam', liters: 144, height: '82%' },
    { day: 'Jum', liters: 141, height: '74%' },
    { day: 'Sab', liters: 145, height: '85%' },
    { day: 'Min', liters: 143, height: '78%', current: true },
  ];

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen antialiased flex flex-col lg:flex-row">
      {/* DESKTOP SIDEBAR */}
      <DesktopSidebar currentScreen="dashboard" onNavigate={onNavigate} />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#263143] text-[#ecf1ff] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm z-50 animate-bounce">
          <span className="material-symbols-outlined text-[#8df5e4] text-[18px]">info</span>
          <span>{toastMsg}</span>
        </div>
      )}

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
                alt="MowTitis App Icon" 
                className="w-9 h-9 rounded-xl object-contain shadow-sm"
                src="https://lh3.googleusercontent.com/aida/AEtjO1W5nB4jArKPK4MCNelmdZzLGguf2j8AY-pqGYV_gppCDNVvxWfCjdqmVBQSmbS_iBV0jI0tUpQin5_W3Jd8KH3zeo4voWenuA_lG-0HV2gsHEA2x_oZwr5oZBjv_Ng6IQR6K45v4Ka5gNXYtxNq3Z1O1-7f3DRSlgJtsgluIRYqxVS14WvFBbv5vG9ZVOieckywoa14wTOmpo45JGSJpdYN_ltvPkd7hg44sMMrVJa9qkUo3kzVvhtCNCI"
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-base text-[#111c2d] leading-tight">Mowtitis</span>
                  <span className="bg-[#8df5e4] text-[#007165] px-1.5 py-0.2 rounded-full text-[10px] font-extrabold uppercase">AI BIO</span>
                </div>
                <span className="text-[11px] text-[#41493e]">Rembangan Dairy Farm</span>
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
                src="https://lh3.googleusercontent.com/aida/AEtjO1Xb5fxsabZVOrkLezw9_9LMT_t_QIdwJe8ytO5LdYIWKyBqRGn14YxMRpiYEkOQZUB9GI94nv_gyju_QzqnJEISBmzpQ5lU1zqfdJ_fD4c8RgrBZwAc5z66CEbl_XrMVw7tZACoismGqe7o5TuX4lWfVdC8bg-tAbSxsRds1KBTsVvJ4FcqrYQF_ZiFLUGba-xh36fjPV_qv1RQ7fZuXexktXeNXT7bCcaQdK_8zsHLdFgmzEeYNTitnIE"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col relative w-full pt-4 pb-28 lg:pb-12 max-w-4xl mx-auto px-4">
        {/* Farm Welcome & Climate Card */}
        <div className="pt-4 pb-2">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee8ff]">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00450d] animate-pulse"></span>
                  <span className="text-[11px] font-bold text-[#00450d] uppercase tracking-wide">
                    Dual-AI Engine Aktif
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold text-[#111c2d] tracking-tight">
                  Selamat Datang, Pak Hafid
                </h1>
                <p className="text-xs text-[#41493e] mt-0.5">
                  Kandang Laktasi A & B • Rembangan, Arjasa
                </p>
              </div>

              <div 
                onClick={weatherHook.openModal}
                className="flex flex-col items-end shrink-0 bg-[#f0f3ff] px-3 py-1.5 rounded-xl border border-[#dee8ff] cursor-pointer hover:bg-[#dee8ff] transition-all group"
                title="Buka Radar Cuaca & Suhu Windy"
              >
                <div className="flex items-center gap-1 text-[#00450d]">
                  <span className="material-symbols-outlined text-[18px]">
                    {weatherHook.weatherData?.iconName || 'thermostat'}
                  </span>
                  <span className="text-sm font-bold">
                    {weatherHook.weatherData ? `${weatherHook.weatherData.temperature.toFixed(1)}°C` : '24°C'}
                  </span>
                </div>
                <span className="text-[10px] text-[#41493e]">
                  RH {weatherHook.weatherData ? `${weatherHook.weatherData.humidity}%` : '78%'} • {weatherHook.weatherData?.thiStatus || 'Nyaman'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#f0f3ff] rounded-xl px-3 py-2 border border-[#dee8ff]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#006b5f] text-[18px] shrink-0">neurology</span>
                <span className="text-xs text-[#111c2d] font-semibold truncate">
                  CNN v4.2 (Ambing) + XGBoost v2.4 (Laktasi)
                </span>
              </div>
              <span className="bg-[#8df5e4] text-[#007165] px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap">
                Live Synced
              </span>
            </div>
          </div>
        </div>

        {/* Operational Quick Actions (4-Grid Glove Friendly) */}
        <div className="py-2">
          <div className="grid grid-cols-2 gap-2.5">
            <button 
              onClick={() => onNavigate?.('pilih_sapi_deteksi_cnn')}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#00450d] text-white shadow-sm hover:bg-[#1b5e20] active:scale-[0.98] transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">document_scanner</span>
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold block leading-tight">Scan CNN</span>
                <span className="text-[11px] text-[#acf4a4] truncate block">Kamera Ambing</span>
              </div>
            </button>

            <button 
              onClick={() => onNavigate?.('prediksi')}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-white text-[#111c2d] border border-[#dee8ff] shadow-sm hover:bg-[#f0f3ff] active:scale-[0.98] transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-[#8df5e4]/50 text-[#007165] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">monitoring</span>
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold block leading-tight">Prediksi AI</span>
                <span className="text-[11px] text-[#717a6d] truncate block">Simulasi Ransum</span>
              </div>
            </button>

            <button 
              onClick={() => onNavigate?.('pemerahan')}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-white text-[#111c2d] border border-[#dee8ff] shadow-sm hover:bg-[#f0f3ff] active:scale-[0.98] transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-[#dee8ff] text-[#00450d] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">water_drop</span>
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold block leading-tight">Catat Susu</span>
                <span className="text-[11px] text-[#717a6d] truncate block">Sesi Sore Parlor</span>
              </div>
            </button>

            <button 
              onClick={() => onNavigate?.('kas')}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-white text-[#111c2d] border border-[#dee8ff] shadow-sm hover:bg-[#f0f3ff] active:scale-[0.98] transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-[#dee8ff] text-[#006b5f] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold block leading-tight">Buku Kas</span>
                <span className="text-[11px] text-[#717a6d] truncate block">Setor KUD Rembangan</span>
              </div>
            </button>
          </div>
        </div>

        {/* AI Notification Banner */}
        <div className="py-2">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee8ff] relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#8df5e4]/30 pointer-events-none"></div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#acf4a4] text-[#002203] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#00450d] text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                    Rekomendasi Ransum
                  </span>
                  <span className="text-[10px] text-[#717a6d]">Baru Saja</span>
                </div>
                <h2 className="text-sm font-bold text-[#111c2d] leading-snug">
                  Optimalisasi Ransum Sore Sapi #12 Melati
                </h2>
                <p className="text-xs text-[#41493e] mt-1 leading-relaxed">
                  Model XGBoost mendeteksi puncak laktasi hari ke-85. Tambahkan 0.4 kg bungkil kedelai guna mengamankan target marjin harian <strong className="text-[#111c2d]">Rp 105.100</strong>.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button 
                    onClick={() => {
                      showToast('Ransum diterapkan di Palungan A-02');
                    }}
                    className="bg-[#00450d] text-white px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-[#1b5e20] active:scale-95 transition-all shadow-xs"
                  >
                    Terapkan di Palungan A-02
                  </button>
                  <button 
                    onClick={() => onNavigate?.('prediksi')}
                    className="bg-[#dee8ff] text-[#111c2d] px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#d8e3fb] transition-all"
                  >
                    Simulasi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrik Kandang KPI */}
        <div className="py-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#111c2d]">Ringkasan Metrik Kandang</h3>
            <span className="text-xs text-[#717a6d]">Update: 16:30 WIB</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Metric 1: Milk Yield */}
            <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#dee8ff] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#717a6d]">Produksi Susu</span>
                  <span className="material-symbols-outlined text-[#006b5f] text-[18px]">local_drink</span>
                </div>
                <div className="text-xl md:text-2xl font-extrabold text-[#111c2d] leading-none">
                  {totalToday} <span className="text-sm font-bold text-[#717a6d]">L</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[#00450d]">
                  <span className="material-symbols-outlined text-[14px] font-bold">trending_up</span>
                  <span className="text-[11px] font-bold">Live Supabase Sync</span>
                </div>
              </div>
              <div className="mt-3 pt-2 bg-[#f0f3ff] -mx-3.5 -mb-3.5 px-3.5 py-1.5 rounded-b-2xl border-t border-[#dee8ff]">
                <span className="text-[10px] text-[#717a6d] block truncate">
                  Pagi: {(totalToday * 0.52).toFixed(1)} L • Sore: {(totalToday * 0.48).toFixed(1)} L
                </span>
              </div>
            </div>

            {/* Metric 2: Mastitis Status */}
            <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#dee8ff] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#717a6d]">Kesehatan Ambing</span>
                  <span className="material-symbols-outlined text-[#00450d] text-[18px]">verified</span>
                </div>
                <div className="text-xl md:text-2xl font-extrabold text-[#00450d] leading-none">
                  {healthyCowsCount}/{totalCowsCount}
                </div>
                <div className="inline-flex items-center gap-1 mt-1 bg-[#acf4a4] text-[#002203] px-1.5 py-0.5 rounded text-[10px] font-bold">
                  {healthyCowsCount === totalCowsCount ? 'Grade A • 100% Sehat' : `${totalCowsCount - healthyCowsCount} Perlu Cek`}
                </div>
              </div>
              <div className="mt-3 pt-2 bg-[#f0f3ff] -mx-3.5 -mb-3.5 px-3.5 py-1.5 rounded-b-2xl border-t border-[#dee8ff]">
                <span className="text-[10px] text-[#111c2d] truncate block font-medium">
                  {healthyCowsCount === totalCowsCount ? '#04 Mawar tuntas karantina' : 'Evaluasi karantina aktif'}
                </span>
              </div>
            </div>

            {/* Metric 3: IOFC */}
            <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#dee8ff] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#717a6d]">IOFC (Marjin Pakan)</span>
                  <span className="material-symbols-outlined text-[#933100] text-[18px]">payments</span>
                </div>
                <div className="text-base md:text-lg font-extrabold text-[#111c2d] leading-none">
                  Rp {(displayIofc / 1000).toFixed(1)}k
                </div>
                <span className="text-[11px] text-[#717a6d] mt-1 block">
                  Rp {Math.round(displayIofc / (totalCowsCount || 1)).toLocaleString('id-ID')}/ekor laktasi
                </span>
              </div>
              <div className="mt-3 pt-2 bg-[#f0f3ff] -mx-3.5 -mb-3.5 px-3.5 py-1.5 rounded-b-2xl border-t border-[#dee8ff]">
                <span className="text-[10px] text-[#00450d] font-bold block truncate">
                  Efisiensi Pakan 94.8%
                </span>
              </div>
            </div>

            {/* Metric 4: AI Model Accuracy */}
            <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#dee8ff] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#717a6d]">Akurasi Validasi AI</span>
                  <span className="material-symbols-outlined text-[#006b5f] text-[18px]">auto_awesome</span>
                </div>
                <div className="text-xl md:text-2xl font-extrabold text-[#111c2d] leading-none">
                  96.2<span className="text-sm font-bold text-[#717a6d]">%</span>
                </div>
                <span className="text-[11px] text-[#006b5f] font-bold mt-1 block truncate">
                  CNN 98.9% • XGB 94.2%
                </span>
              </div>
              <div className="mt-3 pt-2 bg-[#f0f3ff] -mx-3.5 -mb-3.5 px-3.5 py-1.5 rounded-b-2xl border-t border-[#dee8ff]">
                <span className="text-[10px] text-[#717a6d] block truncate">
                  Sampel SCC Terverifikasi
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Production Visualizer */}
        <div className="py-2">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee8ff]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#111c2d] leading-tight">
                  Tren Produksi Susu 7 Hari
                </h3>
                <span className="text-xs text-[#717a6d]">
                  Harga Terima KUD: Rp 7.000 / Liter
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#00450d]">Total 993 L</span>
                <p className="text-[10px] text-[#717a6d]">Rp 6.951.000</p>
              </div>
            </div>

            {/* Micro Bar Chart */}
            <div className="h-28 flex items-end justify-between gap-2 pt-4 pb-2 px-1">
              {daysData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-bold text-[#717a6d]">{d.liters}</span>
                  <div 
                    style={{ height: d.height }}
                    className={`w-full rounded-t-md transition-all ${
                      d.current ? 'bg-[#00450d]' : 'bg-[#dee8ff] hover:bg-[#8df5e4]'
                    }`}
                  ></div>
                  <span className={`text-[10px] font-semibold ${d.current ? 'text-[#00450d] font-bold' : 'text-[#717a6d]'}`}>
                    {d.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-[#dee8ff] flex items-center justify-between">
              <button 
                onClick={() => onNavigate?.('ringkasan_produksi_kawanan')}
                className="text-xs text-[#006b5f] font-bold hover:underline flex items-center gap-1"
              >
                <span>Lihat Laporan Lengkap Kawanan</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
              <button 
                onClick={() => onNavigate?.('unduh_rekap_produksi_kawanan')}
                className="px-3 py-1 rounded-full bg-[#dee8ff] text-[#111c2d] hover:bg-[#d8e3fb] text-[11px] font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeScreen="dashboard"
        onNavigate={onNavigate}
      />

      {/* Persistent Bottom Navigation */}
      <MobileBottomNav activeScreen="dashboard" onNavigate={onNavigate} />

      {/* Windy Weather Radar Modal */}
      <WindyWeatherModal weatherHook={weatherHook} />
    </div>
  );
}
