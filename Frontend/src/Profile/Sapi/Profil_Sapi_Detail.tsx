import { useState, useMemo } from 'react';
import type { ScreenType } from '../../App.tsx';
import { useCows } from '../../hooks/useSupabaseData';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../../components/Navigation';

interface ProfilSapiDetailProps {
  onNavigate?: (screen: ScreenType, cowId?: string) => void;
  cowId?: string;
}

export default function ProfilSapiDetail({
  onNavigate,
  cowId = '07',
}: ProfilSapiDetailProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'bio' | 'kandang' | 'nutrisi'>('bio');

  const { cows: dbCows, loading } = useCows();

  // Find selected cow from Supabase or fallback
  const selectedCow = useMemo(() => {
    if (!dbCows || dbCows.length === 0) return null;
    const cleanId = cowId.replace('#', '').trim();
    return (
      dbCows.find((c) => c.number.replace('#', '').trim() === cleanId || String(c.dbId) === cleanId) ||
      dbCows[0]
    );
  }, [dbCows, cowId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  if (loading && !selectedCow) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen flex items-center justify-center font-sans text-[#111c2d]">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[36px] animate-spin text-[#006b5f]">progress_activity</span>
          <p className="text-sm font-bold text-[#717a6d]">Memuat profil sapi dari Supabase...</p>
        </div>
      </div>
    );
  }

  const s = selectedCow?.raw;
  const name = selectedCow?.name || 'Sapi Perah';
  const tag = selectedCow?.number || `#${cowId}`;
  const rfid = `RF-${tag.replace('#', '').padStart(3, '0')}`;
  const breed = s?.ras || 'Friesian Holstein (FH)';
  const barn = s?.lokasi_kandang || 'Kandang Laktasi A';
  const weight = s?.berat_badan ? `${Number(s.berat_badan).toFixed(0)} kg` : '510 kg';
  const bcs = Number(s?.skor_bcs) || 3.25;
  const yieldDaily = s?.rerata_produksi_harian ? `${Number(s.rerata_produksi_harian).toFixed(1)} L/hari` : '18.5 L/hari';
  const statusKesehatan = s?.status_kesehatan || 'Sehat Produktif';
  const fase = s?.fase_laktasi || 'Laktasi Aktif';
  const photo = selectedCow?.photoUrl || selectedCow?.image || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80';
  const notes = s?.catatan || 'Sapi laktasi aktif produktif di Rembangan Dairy Farm.';
  const isHealthy = statusKesehatan.toLowerCase().includes('sehat') || statusKesehatan.toLowerCase().includes('sembuh');

  // Specific cow extra clinical & genetic traits based on ID
  const isCowMawar = tag.includes('04');
  const isCowCantik = tag.includes('07');
  const isCowMelati = tag.includes('12');
  const isCowSekar = tag.includes('18');
  const isCowSrikandi = tag.includes('25');

  const damInfo = isCowCantik ? 'Cantik Sr. (FH Murni Belanda)' : isCowMelati ? 'Melati Induk-02' : isCowMawar ? 'Mawar Sr. (KUD Rembangan)' : 'FH Unggul Lokal';
  const sireInfo = isCowCantik ? 'Bull Semen Straw FH-09 Super' : isCowMelati ? 'Sire Semen Holstein-04' : 'Straw Inseminasi Buatan BIB';
  const dimVal = isCowCantik ? 65 : isCowMelati ? 85 : isCowMawar ? 110 : isCowSekar ? 140 : isCowSrikandi ? 280 : 75;

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
              onClick={() => onNavigate?.('katalog')}
              className="w-10 h-10 rounded-full bg-white border border-[#dee8ff] flex items-center justify-center text-[#111c2d] hover:bg-[#dee8ff]/50 transition-colors shadow-xs"
              title="Kembali ke Katalog Kawanan"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[#111c2d] truncate">Profil Sapi {name} ({tag})</h1>
                <button
                  onClick={() => {
                    if (navigator.clipboard?.writeText) {
                      navigator.clipboard.writeText(rfid);
                    }
                    showToast(`Nomor RFID ${rfid} disalin ke clipboard!`);
                  }}
                  className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#acf4a4] hover:bg-[#8ee485] text-[#002203] transition-colors cursor-pointer flex items-center gap-1"
                  title="Salin Kode RFID"
                >
                  <span className="material-symbols-outlined text-[12px]">content_copy</span>
                  {rfid}
                </button>
              </div>
              <span className="text-xs text-[#006b5f] font-medium truncate">
                {barn} • Rembangan Dairy Farm
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate?.('riwayat_sapi', tag.replace('#', ''))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1b5e20] hover:bg-[#00450d] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">history_edu</span>
              <span className="hidden sm:inline">Buka Riwayat &amp; Rekam Medis</span>
              <span className="sm:hidden">Riwayat</span>
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
                Pilih Sapi Lain di Kawanan:
              </span>
              <span className="text-[11px] text-[#717a6d]">Total {dbCows.length} Ekor Terdaftar</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {dbCows.map((c) => {
                const isSelected = c.number.replace('#', '') === tag.replace('#', '');
                return (
                  <button
                    key={c.id}
                    onClick={() => onNavigate?.('profil_sapi', c.number.replace('#', ''))}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-[#00450d] text-white border-[#00450d] shadow-sm scale-105'
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

          {/* 2. HERO PROFILE BANNER */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dee8ff] shadow-sm flex flex-col md:flex-row gap-6 items-start">
            {/* Cow Photo with Status overlay */}
            <div className="relative shrink-0 w-full md:w-56 h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <img
                src={photo}
                alt={name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8df5e4] animate-pulse"></span>
                <span>{rfid}</span>
              </div>
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/60 shadow-sm flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#111c2d]">{tag}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isHealthy ? 'bg-[#acf4a4] text-[#002203]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                }`}>
                  {statusKesehatan}
                </span>
              </div>
            </div>

            {/* Hero Profile Specs */}
            <div className="flex-1 w-full flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#dee8ff] text-[#00450d] text-xs font-bold">
                    {breed}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#e7eeff] text-[#41493e] text-xs font-semibold">
                    {barn}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#acf4a4]/60 text-[#002203] text-xs font-semibold">
                    Days In Milk: {dimVal} Hari
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111c2d] tracking-tight">
                  {name} <span className="text-slate-400 font-medium text-lg">({tag})</span>
                </h2>
                <p className="text-xs text-[#41493e] mt-1 leading-relaxed">
                  {notes}
                </p>
              </div>

              {/* 4 Quick Indicator Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-[#f0f3ff] p-3 rounded-2xl border border-[#dee8ff] text-center">
                  <span className="text-[10px] text-[#717a6d] font-bold block">Bobot Tubuh</span>
                  <span className="text-base font-extrabold text-[#111c2d]">{weight}</span>
                  <span className="text-[10px] text-[#006b5f] block font-semibold">Ideal Standar FH</span>
                </div>
                <div className="bg-[#f0f3ff] p-3 rounded-2xl border border-[#dee8ff] text-center">
                  <span className="text-[10px] text-[#717a6d] font-bold block">Skor BCS (1-5)</span>
                  <span className="text-base font-extrabold text-[#00450d]">{bcs.toFixed(2)}</span>
                  <span className="text-[10px] text-[#006b5f] block font-semibold">{bcs >= 3.0 ? 'Optimal Laktasi' : 'Perlu Tambah Ransum'}</span>
                </div>
                <div className="bg-[#f0f3ff] p-3 rounded-2xl border border-[#dee8ff] text-center">
                  <span className="text-[10px] text-[#717a6d] font-bold block">Produksi Susu</span>
                  <span className="text-base font-extrabold text-[#00450d]">{yieldDaily}</span>
                  <span className="text-[10px] text-[#006b5f] block font-semibold">Grade A+ SNI</span>
                </div>
                <div className="bg-[#f0f3ff] p-3 rounded-2xl border border-[#dee8ff] text-center">
                  <span className="text-[10px] text-[#717a6d] font-bold block">Fase Laktasi</span>
                  <span className="text-sm font-extrabold text-[#111c2d] truncate block">{fase}</span>
                  <span className="text-[10px] text-[#717a6d] block font-semibold">H-{dimVal} Periode</span>
                </div>
              </div>

              {/* Action Quick Bar */}
              <div className="flex items-center gap-2.5 pt-2 flex-wrap">
                <button
                  onClick={() => onNavigate?.('riwayat_sapi', tag.replace('#', ''))}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-[#dee8ff] hover:bg-[#f0f3ff] text-[#111c2d] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#006b5f]">menu_book</span>
                  <span>Buka Riwayat Medis</span>
                </button>
                <button
                  onClick={() => onNavigate?.('deteksi', tag.replace('#', ''))}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#00450d] hover:bg-[#1b5e20] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                  <span>Skrining Mastitis AI</span>
                </button>
                <button
                  onClick={() => onNavigate?.('prediksi', tag.replace('#', ''))}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#acf4a4] hover:bg-[#8ee485] text-[#002203] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  <span>Hitung Pakan AI</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. PROFILE SUB-SECTIONS (Bio, Kandang, Nutrisi) */}
          <div className="bg-white rounded-3xl p-5 border border-[#dee8ff] shadow-sm space-y-4">
            <div className="flex border-b border-[#dee8ff] pb-2 gap-2">
              <button
                onClick={() => setActiveSubTab('bio')}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === 'bio' ? 'bg-[#00450d] text-white' : 'text-[#41493e] hover:bg-[#f0f3ff]'
                }`}
              >
                Data Genetik &amp; Silsilah
              </button>
              <button
                onClick={() => setActiveSubTab('kandang')}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === 'kandang' ? 'bg-[#00450d] text-white' : 'text-[#41493e] hover:bg-[#f0f3ff]'
                }`}
              >
                Fasilitas Kandang &amp; Palungan
              </button>
              <button
                onClick={() => setActiveSubTab('nutrisi')}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === 'nutrisi' ? 'bg-[#00450d] text-white' : 'text-[#41493e] hover:bg-[#f0f3ff]'
                }`}
              >
                Pola Pakan &amp; Kebutuhan Ransum
              </button>
            </div>

            {/* TAB: BIO & SILSILAH */}
            {activeSubTab === 'bio' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[#717a6d]">Nomor Ear Tag</span>
                    <span className="font-extrabold text-[#111c2d]">{tag}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[#717a6d]">Kode Transponder RFID</span>
                    <span className="font-mono font-bold text-[#006b5f]">{rfid}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[#717a6d]">Ras / Bangsa Ternak</span>
                    <span className="font-bold text-[#111c2d]">{breed}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[#717a6d]">Estimasi Umur</span>
                    <span className="font-bold text-[#111c2d]">{isCowSrikandi ? '5.5 Tahun' : isCowCantik ? '3.0 Tahun' : '3.8 Tahun'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[#717a6d]">Indukan (Dam)</span>
                    <span className="font-bold text-[#111c2d]">{damInfo}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[#717a6d]">Pejantan Straw (Sire)</span>
                    <span className="font-bold text-[#111c2d]">{sireInfo}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[#717a6d]">Status Reproduksi Terkini</span>
                    <span className="font-bold text-[#00450d]">{isCowSrikandi ? 'Kering Kandang (Bunting 8 Bulan)' : 'Laktasi Produktif Terbuntingkan'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[#717a6d]">Catatan Khusus Pemeliharaan</span>
                    <span className="font-medium text-[#41493e]">{notes}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: KANDANG */}
            {activeSubTab === 'kandang' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[#717a6d]">Lokasi Kandang</span>
                    <span className="font-extrabold text-[#00450d]">{barn}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[#717a6d]">Nomor Palungan / Stall</span>
                    <span className="font-bold text-[#111c2d]">Stall Palungan {tag}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[#717a6d]">Jalur Perahan (Milking Parlor)</span>
                    <span className="font-bold text-[#111c2d]">{isCowCantik ? 'Line 05 Parlor A' : 'Line 02 Parlor Utama'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[#717a6d]">Sensor IoT Terpasang</span>
                    <span className="font-bold text-[#006b5f]">Flowmeter Susu &amp; Eartag RFID</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[#717a6d]">Jadwal Pemerahan Rutin</span>
                    <span className="font-bold text-[#111c2d]">04:30 WIB (Pagi) &amp; 15:30 WIB (Sore)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[#717a6d]">Sanitasi Puting &amp; Ambing</span>
                    <span className="font-bold text-[#00450d]">Pre-dip &amp; Post-dip Iodin 0.5%</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: NUTRISI */}
            {activeSubTab === 'nutrisi' && (
              <div className="space-y-3 text-xs">
                <div className="bg-[#f0f3ff] p-4 rounded-2xl border border-[#dee8ff] flex items-center justify-between">
                  <div>
                    <span className="text-[#717a6d] font-bold block">Target Kebutuhan Bahan Kering (BK)</span>
                    <span className="text-lg font-black text-[#00450d]">{((Number(s?.berat_badan) || 500) * 0.032 + 1.8).toFixed(1)} kg / hari</span>
                  </div>
                  <button
                    onClick={() => onNavigate?.('prediksi', tag.replace('#', ''))}
                    className="px-3.5 py-1.5 rounded-xl bg-[#00450d] text-white text-xs font-bold hover:bg-[#1b5e20] transition-colors"
                  >
                    Buka Simulator Ransum
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[#717a6d] block text-[10px]">Konsentrat PK 18%</span>
                    <span className="font-bold text-[#111c2d] text-sm">7.5 kg</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[#717a6d] block text-[10px]">Rumput Odot Segar</span>
                    <span className="font-bold text-[#111c2d] text-sm">35.0 kg</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[#717a6d] block text-[10px]">Legum Indigofera</span>
                    <span className="font-bold text-[#111c2d] text-sm">5.0 kg</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[#717a6d] block text-[10px]">Ampas Tahu Matang</span>
                    <span className="font-bold text-[#111c2d] text-sm">4.0 kg</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 bg-[#111c2d] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce border border-slate-700">
          <span className="material-symbols-outlined text-[#8df5e4] text-[20px]">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

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
