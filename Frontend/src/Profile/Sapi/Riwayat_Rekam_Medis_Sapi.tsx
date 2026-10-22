import { useState, useMemo } from 'react';
import type { ScreenType } from '../../App.tsx';
import { useCows } from '../../hooks/useSupabaseData';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../../components/Navigation';

interface RiwayatRekamMedisSapiProps {
  onNavigate?: (screen: ScreenType, cowId?: string) => void;
  cowId?: string;
}

export default function RiwayatRekamMedisSapi({
  onNavigate,
  cowId = '07',
}: RiwayatRekamMedisSapiProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'mastitis' | 'susu' | 'reproduksi'>('mastitis');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { cows: dbCows } = useCows();

  const selectedCow = useMemo(() => {
    if (!dbCows || dbCows.length === 0) return null;
    const cleanId = cowId.replace('#', '').trim();
    return (
      dbCows.find((c) => c.number.replace('#', '').trim() === cleanId || String(c.dbId) === cleanId) ||
      dbCows[0]
    );
  }, [dbCows, cowId]);

  const name = selectedCow?.name || 'Sapi Perah';
  const tag = selectedCow?.number || `#${cowId}`;
  const barn = selectedCow?.raw.lokasi_kandang || 'Kandang Laktasi A';
  const photo = selectedCow?.photoUrl || selectedCow?.image || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80';
  const statusKesehatan = selectedCow?.raw.status_kesehatan || 'Sehat Produktif';
  const isHealthy = statusKesehatan.toLowerCase().includes('sehat') || statusKesehatan.toLowerCase().includes('sembuh');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Distinct clinical & milking history per cow
  const isCowMawar = tag.includes('04');
  const isCowCantik = tag.includes('07');
  const isCowMelati = tag.includes('12');
  const isCowSekar = tag.includes('18');

  // Realistic Mastitis Clinical Logs
  const mastitisLogs = useMemo(() => {
    if (isCowMawar) {
      return [
        {
          id: 1,
          date: '20 Okt 2026 • 16:30 WIB',
          engine: 'MobileNetV2 + Heatmap v2.4',
          status: 'Sembuh Total / Bebas Mastitis',
          confidence: '98.7%',
          grade: 'Grade A',
          quarter: 'Semua Kuartir Normal & Kenyal',
          notes: 'Evaluasi akhir pasca 3 tube intramamari. Tidak ada gumpalan susu, SCC turun ke 115k. Sapi siap perah reguler.',
          actionBadge: 'Sembuh Total',
          isDanger: false,
        },
        {
          id: 2,
          date: '15 Okt 2026 • 09:00 WIB',
          engine: 'Evaluasi Klinis Lapangan',
          status: 'Terapi Salep Tube Ke-3',
          confidence: '94.2%',
          grade: 'Grade B (Pemulihan)',
          quarter: 'Kanan Belakang (Bengkak Berkurang 85%)',
          notes: 'Aplikasi salep intramamari Mastijet Forte tube #3. Dipping iodin 1% konsisten.',
          actionBadge: 'Terapi Medis',
          isDanger: false,
        },
        {
          id: 3,
          date: '10 Okt 2026 • 15:45 WIB',
          engine: 'MobileNetV2 CNN Inspeksi Ambing',
          status: 'Terindikasi Mastitis Subklinis',
          confidence: '96.5%',
          grade: 'Grade C',
          quarter: 'Kanan Belakang (Eritema & Hangat)',
          notes: 'Terdeteksi eritema ambing kanan belakang. SCC 480k, konduktivitas listrik 6.4 mS/cm. Karantina dilakukan.',
          actionBadge: 'Deteksi Radang',
          isDanger: true,
        },
      ];
    } else if (isCowCantik) {
      return [
        {
          id: 1,
          date: '22 Okt 2026 • 08:30 WIB',
          engine: 'CNN MobileNetV2 Real-Time',
          status: 'Bebas Mastitis (Grade A+)',
          confidence: '99.1%',
          grade: 'Grade A+ SNI',
          quarter: 'Kuartir Depan & Belakang Simetris',
          notes: 'Puting elastis sempurna, tidak ada luka atau lesi. SCC sangat rendah (92k sel/mL). Top performer parlour.',
          actionBadge: 'Prima Grade A+',
          isDanger: false,
        },
        {
          id: 2,
          date: '12 Okt 2026 • 07:15 WIB',
          engine: 'Skrining Rutin AI YOLOv26-XSeg',
          status: 'Normal / Sehat Prima',
          confidence: '98.8%',
          grade: 'Grade A',
          quarter: 'Semua Kuartir Simetris',
          notes: 'Lolos uji inspeksi citra dan sensor flowmeter perahan pagi.',
          actionBadge: 'Normal',
          isDanger: false,
        },
      ];
    } else if (isCowMelati) {
      return [
        {
          id: 1,
          date: '21 Okt 2026 • 07:45 WIB',
          engine: 'CNN MobileNetV2 Real-Time',
          status: 'Normal / Laktasi Awal Optimal',
          confidence: '98.4%',
          grade: 'Grade A',
          quarter: 'Semua Kuartir Bersih & Simetris',
          notes: 'Pemeriksaan rutin H-42 laktasi awal. SCC 142k, konduktivitas 5.1 mS/cm. Kelenjar mamae berkembang prima.',
          actionBadge: 'Optimal Laktasi Awal',
          isDanger: false,
        },
        {
          id: 2,
          date: '14 Okt 2026 • 16:15 WIB',
          engine: 'Evaluasi Citra Ambing AI',
          status: 'Bebas Gejala Mastitis',
          confidence: '97.9%',
          grade: 'Grade A',
          quarter: 'Ambing Kanan & Kiri Normal',
          notes: 'Tidak ditemukan pembengkakan atau eritema. Aliran susu lancar 16.4 L/hari.',
          actionBadge: 'Sehat & Normal',
          isDanger: false,
        },
      ];
    } else if (isCowSekar) {
      return [
        {
          id: 1,
          date: '21 Okt 2026 • 16:00 WIB',
          engine: 'MobileNetV2 + Heatmap v2.4',
          status: 'Mulai Ada Radang Susu Subklinis',
          confidence: '96.8%',
          grade: 'Grade C',
          quarter: 'Kiri Depan (Sedikit Keras)',
          notes: 'Oleskan salep antiseptik herbal / mastitis setelah selesai perah sore pada puting kiri depan. Pantau suhu perahan.',
          actionBadge: 'Observasi Radang',
          isDanger: true,
        },
        {
          id: 2,
          date: '14 Okt 2026 • 08:30 WIB',
          engine: 'Sensor Fisikokimia Susu',
          status: 'SCC Sedikit Meningkat (285k)',
          confidence: '92.0%',
          grade: 'Grade B',
          quarter: 'Kiri Depan',
          notes: 'Kenaikan konduktivitas listrik terdeteksi oleh sensor milking parlor.',
          actionBadge: 'Perhatian Khusus',
          isDanger: false,
        },
      ];
    } else {
      return [
        {
          id: 1,
          date: '21 Okt 2026 • 08:00 WIB',
          engine: 'CNN MobileNetV2 Real-Time',
          status: 'Bebas Mastitis',
          confidence: '98.6%',
          grade: 'Grade A',
          quarter: 'Semua Kuartir Simetris & Higienis',
          notes: 'Kondisi ambing sehat dan elastis. Lanjutkan SOP dipping iodin sebelum dan sesudah perah.',
          actionBadge: 'Sehat & Normal',
          isDanger: false,
        },
      ];
    }
  }, [isCowMawar, isCowCantik, isCowMelati, isCowSekar]);

  // Realistic Milking Telemetry Logs
  const milkingLogs = useMemo(() => {
    const baseYield = Number(selectedCow?.raw.rerata_produksi_harian) || 18.0;
    const mornings = [0.55, 0.54, 0.56, 0.53, 0.55, 0.57, 0.54];
    const days = ['21 Okt', '20 Okt', '19 Okt', '18 Okt', '17 Okt', '16 Okt', '15 Okt'];

    return days.map((day, idx) => {
      const total = Number((baseYield * (1 + (idx % 2 === 0 ? 0.04 : -0.03))).toFixed(1));
      const morning = Number((total * mornings[idx]).toFixed(1));
      const afternoon = Number((total - morning).toFixed(1));
      return {
        date: day,
        morning,
        afternoon,
        total,
        temp: (38.1 + (idx % 3) * 0.1).toFixed(1),
        ph: (6.60 + (idx % 2) * 0.02).toFixed(2),
        scc: isCowSekar ? 245 + idx * 8 : isCowMawar ? 135 - idx * 4 : 95 + idx * 3,
        grade: isCowSekar ? 'Grade B+' : 'Grade A+ SNI',
      };
    });
  }, [selectedCow, isCowSekar, isCowMawar]);

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen antialiased flex flex-col lg:flex-row">
      {/* DESKTOP SIDEBAR */}
      <DesktopSidebar currentScreen="katalog" onNavigate={(screen) => onNavigate?.(screen)} />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 lg:bottom-10 right-6 z-50 bg-[#111c2d] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom duration-200">
          <span className="material-symbols-outlined text-[#8df5e4] text-[20px]">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 lg:pl-72 w-full flex flex-col">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-40 h-16 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => onNavigate?.('profil_sapi', tag.replace('#', ''))}
              className="w-10 h-10 rounded-full bg-white border border-[#dee8ff] flex items-center justify-center text-[#111c2d] hover:bg-[#dee8ff]/50 transition-colors shadow-xs"
              title="Kembali ke Profil Sapi"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[#111c2d] truncate">Riwayat &amp; Rekam Medis: {name} ({tag})</h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isHealthy ? 'bg-[#acf4a4] text-[#002203]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                }`}>
                  {statusKesehatan}
                </span>
              </div>
              <span className="text-xs text-[#006b5f] font-medium truncate">
                {barn} • Arsip Rekam Medis Cloud Supabase
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate?.('profil_sapi', tag.replace('#', ''))}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#dee8ff] text-[#111c2d] text-xs font-bold hover:bg-[#f0f3ff] transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#006b5f]">badge</span>
              <span className="hidden sm:inline">Lihat Profil Utama</span>
            </button>
            <button
              onClick={() => onNavigate?.('catat_pengobatan')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1b5e20] hover:bg-[#00450d] text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_notes</span>
              <span className="hidden sm:inline">+ Catat Terapi / Obat</span>
              <span className="sm:hidden">+ Terapi</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <main className="w-full flex-col pb-28 lg:pb-12 px-4 sm:px-8 py-6 max-w-5xl mx-auto space-y-5">
          {/* 1. HORIZONTAL COW QUICK SWITCHER */}
          <div className="bg-white p-3 rounded-2xl border border-[#dee8ff] shadow-xs">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-[#41493e] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#006b5f]">switch_account</span>
                Pilih Sapi untuk Melihat Riwayat:
              </span>
              <span className="text-[11px] text-[#717a6d]">Sapi Aktif: {name} ({tag})</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {dbCows.map((c) => {
                const isSelected = c.number.replace('#', '') === tag.replace('#', '');
                return (
                  <button
                    key={c.id}
                    onClick={() => onNavigate?.('riwayat_sapi', c.number.replace('#', ''))}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-[#1b5e20] text-white border-[#1b5e20] shadow-sm scale-105'
                        : 'bg-[#f0f3ff] text-[#111c2d] border-[#dee8ff] hover:bg-[#dee8ff]'
                    }`}
                  >
                    <img
                      src={c.photoUrl || c.image}
                      alt={c.name}
                      className="w-5 h-5 rounded-full object-cover border border-white/40"
                    />
                    <span>{c.number} {c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. HISTORY HEADER CARD */}
          <div className="bg-gradient-to-r from-white via-white to-[#f0f3ff] rounded-3xl p-5 sm:p-6 border border-[#dee8ff] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={photo}
                alt={name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-extrabold text-[#111c2d]">{name} ({tag})</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8df5e4] text-[#00201c]">
                    Histori Terverifikasi
                  </span>
                </div>
                <p className="text-xs text-[#717a6d] mt-1">
                  Seluruh linimasa medis, grafik perahan susu harian, dan siklus reproduksi tercatat permanen di cloud.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Riwayat rekam medis berhasil diekspor ke PDF!')}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#dee8ff] hover:bg-[#dee8ff] text-[#111c2d] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#006b5f]">download</span>
                <span>Unduh PDF</span>
              </button>
              <button
                onClick={() => onNavigate?.('profil_sapi', tag.replace('#', ''))}
                className="px-4 py-2 rounded-xl bg-[#00450d] text-white text-xs font-bold hover:bg-[#1b5e20] transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Buka Profil Sapi
              </button>
            </div>
          </div>

          {/* 3. TABS NAVIGATION */}
          <div className="flex rounded-2xl bg-white p-1.5 border border-[#dee8ff] shadow-xs">
            <button
              onClick={() => setActiveTab('mastitis')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'mastitis' ? 'bg-[#00450d] text-white shadow-sm' : 'text-[#41493e] hover:bg-[#f0f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">medical_services</span>
              <span>Linimasa Mastitis &amp; Terapi ({mastitisLogs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('susu')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'susu' ? 'bg-[#00450d] text-white shadow-sm' : 'text-[#41493e] hover:bg-[#f0f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">water_drop</span>
              <span>Histori Produksi Susu (14 Hari)</span>
            </button>
            <button
              onClick={() => setActiveTab('reproduksi')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'reproduksi' ? 'bg-[#00450d] text-white shadow-sm' : 'text-[#41493e] hover:bg-[#f0f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">event_repeat</span>
              <span>Siklus Reproduksi &amp; Vaksin</span>
            </button>
          </div>

          {/* TAB 1: LINIMASA MASTITIS & REKAM MEDIS */}
          {activeTab === 'mastitis' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dee8ff] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-extrabold text-[#111c2d]">Kronologi Pemeriksaan Mastitis &amp; Penanganan Medis</h3>
                  <p className="text-xs text-[#717a6d]">Hasil inferensi MobileNetV2 CNN &amp; catatan dokter hewan</p>
                </div>
                <button
                  onClick={() => onNavigate?.('deteksi', tag.replace('#', ''))}
                  className="px-3.5 py-1.5 rounded-xl bg-[#8df5e4] hover:bg-[#70d8c8] text-[#00201c] text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">camera_alt</span>
                  <span>Skrining Sekarang</span>
                </button>
              </div>

              <div className="space-y-4 pt-1">
                {mastitisLogs.map((log, index) => (
                  <div key={log.id} className="flex gap-4 relative">
                    {/* Timeline Line */}
                    {index < mastitisLogs.length - 1 && (
                      <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-slate-200"></div>
                    )}

                    {/* Timeline Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 shadow-xs ${
                      log.isDanger ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#acf4a4] text-[#002203]'
                    }`}>
                      <span className="material-symbols-outlined text-[16px]">
                        {log.isDanger ? 'warning' : 'verified'}
                      </span>
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 bg-[#f9f9ff] p-4 rounded-2xl border border-[#dee8ff] space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-[#111c2d]">{log.status}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.isDanger ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#acf4a4] text-[#002203]'
                          }`}>
                            {log.actionBadge}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#717a6d]">{log.date}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-[#717a6d] block">Model Engine AI</span>
                          <span className="font-bold text-[#006b5f]">{log.engine}</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-[#717a6d] block">Tingkat Keyakinan (Confidence)</span>
                          <span className="font-bold text-[#111c2d]">{log.confidence}</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-[#717a6d] block">Kuartir Ambing</span>
                          <span className="font-bold text-[#111c2d]">{log.quarter}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#41493e] leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                        <strong>Catatan SOP:</strong> {log.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HISTORI PRODUKSI SUSU */}
          {activeTab === 'susu' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dee8ff] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-[#111c2d]">Kurva Produksi Susu 14 Hari Terakhir</h3>
                  <p className="text-xs text-[#717a6d]">Data telemetri sensor flowmeter perahan kandang</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#8df5e4]/40 text-[#00201c] text-xs font-bold">
                    Rata-rata: {selectedCow?.raw.rerata_produksi_harian || 18.5} L / Hari
                  </span>
                </div>
              </div>

              {/* Visual Lactation Trend Chart (Pure SVG) */}
              <div className="bg-[#f0f3ff] p-4 rounded-2xl border border-[#dee8ff]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#41493e] uppercase tracking-wider">Grafik Fluktuasi Harian (Liter)</span>
                  <span className="text-[11px] text-[#006b5f] font-semibold">Terkalibrasi Otomatis</span>
                </div>
                <div className="h-36 w-full flex items-end justify-between gap-2 pt-4 px-2">
                  {milkingLogs.map((log) => {
                    const maxYield = 28;
                    const heightPct = Math.min(100, Math.max(25, (log.total / maxYield) * 100));
                    return (
                      <div key={log.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[10px] font-extrabold text-[#00450d] opacity-0 group-hover:opacity-100 transition-opacity">
                          {log.total}L
                        </span>
                        <div
                          style={{ height: `${heightPct}%` }}
                          className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-[#00450d] to-[#8df5e4] group-hover:to-[#acf4a4] transition-all shadow-xs"
                        ></div>
                        <span className="text-[10px] text-[#717a6d] font-bold">{log.date.split(' ')[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Session Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#dee8ff] text-[#717a6d] font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Tanggal</th>
                      <th className="py-2.5 px-3">Sesi Pagi</th>
                      <th className="py-2.5 px-3">Sesi Sore</th>
                      <th className="py-2.5 px-3">Total Harian</th>
                      <th className="py-2.5 px-3">Suhu Susu</th>
                      <th className="py-2.5 px-3">pH</th>
                      <th className="py-2.5 px-3">SCC (x10³)</th>
                      <th className="py-2.5 px-3">Standar SNI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {milkingLogs.map((row) => (
                      <tr key={row.date} className="hover:bg-[#f0f3ff]/50 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-[#111c2d]">{row.date}</td>
                        <td className="py-2.5 px-3 text-[#006b5f] font-semibold">{row.morning} L</td>
                        <td className="py-2.5 px-3 text-[#006b5f] font-semibold">{row.afternoon} L</td>
                        <td className="py-2.5 px-3 font-black text-[#00450d]">{row.total} L</td>
                        <td className="py-2.5 px-3 text-[#41493e]">{row.temp} °C</td>
                        <td className="py-2.5 px-3 text-[#41493e]">{row.ph}</td>
                        <td className="py-2.5 px-3 font-bold text-[#111c2d]">{row.scc}k</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#002203] text-[10px] font-bold">
                            {row.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: REPRODUKSI & VAKSINASI */}
          {activeTab === 'reproduksi' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dee8ff] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-extrabold text-[#111c2d]">Riwayat Inseminasi Buatan, Kebuntingan &amp; Vaksinasi</h3>
                  <p className="text-xs text-[#717a6d]">Manajemen breeding &amp; imunisasi sapi perah</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Reproduction Card */}
                <div className="bg-[#f0f3ff] p-4 rounded-2xl border border-[#dee8ff] space-y-3">
                  <div className="flex items-center gap-2 text-[#00450d] font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">pregnant_woman</span>
                    <span>Status Kebuntingan &amp; Calving</span>
                  </div>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between py-1 border-b border-white">
                      <span className="text-[#717a6d]">Status Terkini</span>
                      <span className="font-bold text-[#00450d]">{isCowMawar ? 'Laktasi Aktif (Post-Partum)' : 'Bunting Terkonfirmasi (USG)'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white">
                      <span className="text-[#717a6d]">Tanggal Inseminasi Terakhir</span>
                      <span className="font-bold text-[#111c2d]">12 Agustus 2026</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white">
                      <span className="text-[#717a6d]">Kode Semen Pejantan</span>
                      <span className="font-mono font-bold text-[#006b5f]">FH-BULL-09 (BIB Lembang)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#717a6d]">Perkiraan Tanggal Melahirkan</span>
                      <span className="font-bold text-[#111c2d]">18 Mei 2027</span>
                    </div>
                  </div>
                </div>

                {/* Vaccination Card */}
                <div className="bg-[#f0f3ff] p-4 rounded-2xl border border-[#dee8ff] space-y-3">
                  <div className="flex items-center gap-2 text-[#00450d] font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">vaccines</span>
                    <span>Riwayat Imunisasi &amp; Obat Cacing</span>
                  </div>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between py-1 border-b border-white">
                      <span className="text-[#717a6d]">Vaksin PMK (Penyakit Mulut &amp; Kuku)</span>
                      <span className="font-bold text-[#00450d]">Lengkap (Dosis Booster 2)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white">
                      <span className="text-[#717a6d]">Vaksin Anthrax &amp; Brucellosis</span>
                      <span className="font-bold text-[#00450d]">Negatif / Terproteksi</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white">
                      <span className="text-[#717a6d]">Pemberian Obat Cacing (Albendazole)</span>
                      <span className="font-bold text-[#111c2d]">01 September 2026</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#717a6d]">Jadwal Booster Berikutnya</span>
                      <span className="font-bold text-[#006b5f]">Maret 2027</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeScreen="katalog"
        onNavigate={(screen) => onNavigate?.(screen)}
      />

      {/* Persistent Bottom Nav for Mobile */}
      <MobileBottomNav activeScreen="katalog" onNavigate={(screen) => onNavigate?.(screen)} />
    </div>
  );
}
