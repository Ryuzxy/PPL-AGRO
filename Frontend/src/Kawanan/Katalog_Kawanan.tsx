import { useState, useMemo } from 'react';
import type { ScreenType } from '../App.tsx';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../components/Navigation';

interface KatalogKawananProps {
  onNavigate?: (screen: ScreenType, cowId?: string) => void;
}

interface CowRecord {
  id: string;
  dbId: number;
  rfid: string;
  name: string;
  breed: string;
  barn: string;
  stall: string;
  status: 'Laktasi' | 'Bunting' | 'Kering' | 'Karantina';
  statusLabel: string;
  dim: number;
  dimLabel: string;
  weight: number;
  bcs: number;
  milkYield: number;
  morningYield: number;
  afternoonYield: number;
  cnnStatus: string;
  cnnAccuracy: string;
  iofc: number;
  iofcSurplus: string;
  photoUrl: string;
}

import { useCows } from '../hooks/useSupabaseData';

export default function KatalogKawanan({ onNavigate }: KatalogKawananProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'Semua' | 'Laktasi' | 'Bunting' | 'Kering' | 'Karantina' | 'Arsip'>('Semua');

  const { cows: dbCows, archivedCows, loading, addCow, deleteCow, restoreCow } = useCows();

  // Modals & form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [cowToDelete, setCowToDelete] = useState<CowRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [newCow, setNewCow] = useState({
    nama: '',
    eartag: '',
    ras: 'Friesian Holstein (FH)',
    lokasi_kandang: 'Kandang A-01',
    fase_laktasi: 'Laktasi',
    status_kesehatan: 'Sehat',
    berat_badan: '510',
    skor_bcs: '3.25',
    rerata_produksi_harian: '18.5',
    catatan: '',
    foto_profil_url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const mapCowToRecord = (c: any): CowRecord => {
    const s = c.raw;
    const weight = Number(s.berat_badan) || 500;
    const bcs = Number(s.skor_bcs) || 3.2;
    const milkYield = Number(s.rerata_produksi_harian) || 0;
    const morningYield = Number((milkYield * 0.55).toFixed(1));
    const afternoonYield = Number((milkYield * 0.45).toFixed(1));
    
    const fase = (s.fase_laktasi || '').toLowerCase();
    let status: 'Laktasi' | 'Bunting' | 'Kering' | 'Karantina' = 'Laktasi';
    if (fase.includes('kering')) status = 'Kering';
    else if (fase.includes('bunting')) status = 'Bunting';
    else if ((s.status_kesehatan || '').toLowerCase().includes('karantina') || (s.lokasi_kandang || '').toLowerCase().includes('karantina')) {
      status = 'Karantina';
    }

    const iofc = Math.max(0, Math.round(milkYield * 14000 - 52000));

    return {
      id: c.number,
      dbId: c.dbId,
      rfid: `RF-${c.id.replace('#', '').padStart(3, '0')}`,
      name: c.name,
      breed: s.ras || 'Friesian Holstein (FH)',
      barn: s.lokasi_kandang || 'Kandang A',
      stall: `Stall Palungan ${c.id}`,
      status,
      statusLabel: s.fase_laktasi || 'Laktasi Aktif',
      dim: 65,
      dimLabel: s.status_kesehatan || 'Sehat Prima',
      weight,
      bcs,
      milkYield,
      morningYield,
      afternoonYield,
      cnnStatus: c.isHealthy ? 'Normal / Sehat' : (s.status_kesehatan || 'Perlu Cek'),
      cnnAccuracy: c.isHealthy ? '98.9%' : 'Observasi',
      iofc,
      iofcSurplus: iofc > 150000 ? 'Surplus Optimal' : 'Stabil',
      photoUrl: c.image,
    };
  };

  const herdData: CowRecord[] = useMemo(() => {
    return dbCows.map(mapCowToRecord);
  }, [dbCows]);

  const archivedHerdData: CowRecord[] = useMemo(() => {
    return archivedCows.map(mapCowToRecord);
  }, [archivedCows]);

  const filteredCattle = useMemo(() => {
    const source = activeCategory === 'Arsip' ? archivedHerdData : herdData;
    return source.filter((cow) => {
      const matchesCategory =
        activeCategory === 'Semua' || activeCategory === 'Arsip' ? true : cow.status === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cow.name.toLowerCase().includes(q) ||
        cow.id.toLowerCase().includes(q) ||
        cow.rfid.toLowerCase().includes(q) ||
        cow.barn.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [herdData, archivedHerdData, searchQuery, activeCategory]);

  return (
    <div className="bg-[#f9f9ff] font-sans text-[#111c2d] min-h-screen antialiased flex flex-col lg:flex-row">
      {/* DESKTOP SIDEBAR */}
      <DesktopSidebar currentScreen="katalog" onNavigate={onNavigate} />

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 lg:pl-72 w-full flex flex-col">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-40 h-16 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile Hamburger Button */}
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
              onClick={() => alert('IoT Sensors: 28 RFID Transponder Aktif di Kandang')}
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
              <span>Ekspor PDF</span>
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

        {/* WORKSPACE MAIN */}
        <main className="w-full flex-col pb-28 lg:pb-12 px-4 sm:px-8 py-6 max-w-[1440px] mx-auto">
          {/* Top Search & Action Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 mb-6">
            <div className="flex flex-1 items-center gap-2.5 bg-[#f0f3ff] px-4 py-2 rounded-full border border-slate-200/60 min-w-0">
              <span className="material-symbols-outlined text-[#717a6d] text-[22px]">search</span>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari No. Ear Tag, RFID, Nama Sapi, atau Kandang..."
                className="w-full bg-transparent border-0 outline-none text-[#111c2d] placeholder:text-[#717a6d] text-[14px]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button 
                onClick={() => alert('Pilih file Excel / CSV data RFID sapi untuk diimpor')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] transition-colors text-[13px] font-semibold border border-slate-200"
              >
                <span className="material-symbols-outlined text-[18px] text-[#006b5f]">file_upload</span>
                <span>Impor RFID</span>
              </button>

              <button 
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] transition-colors text-[13px] font-semibold border border-slate-200"
              >
                <span className="material-symbols-outlined text-[18px] text-[#41493e]">picture_as_pdf</span>
                <span>Ekspor PDF</span>
              </button>

              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1b5e20] text-white hover:bg-[#00450d] transition-transform active:scale-95 text-[13px] font-bold shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                <span>+ Tambah Sapi Baru</span>
              </button>
            </div>
          </div>

          {/* Herd Segmentation & Stats Bar */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
            {/* Category Filter Tabs */}
            <div className="xl:col-span-7 flex flex-col justify-between bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006b5f] text-[20px]">dataset</span>
                  <span className="text-[12px] font-bold text-[#41493e] uppercase tracking-wider">Segmentasi Kawanan Ternak</span>
                </div>
                <span className="text-[12px] text-[#717a6d]">Database Sinkron: <strong>{herdData.length} Ekor</strong></span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button 
                  onClick={() => setActiveCategory('Semua')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                    activeCategory === 'Semua' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                  }`}
                >
                  <span>Semua</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeCategory === 'Semua' ? 'bg-white/20' : 'bg-slate-200'}`}>{herdData.length}</span>
                </button>

                <button 
                  onClick={() => setActiveCategory('Laktasi')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                    activeCategory === 'Laktasi' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                  }`}
                >
                  <span>Laktasi Aktif</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeCategory === 'Laktasi' ? 'bg-white/20' : 'bg-slate-200'}`}>
                    {herdData.filter(c => c.status === 'Laktasi').length}
                  </span>
                </button>

                <button 
                  onClick={() => setActiveCategory('Bunting')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                    activeCategory === 'Bunting' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                  }`}
                >
                  <span>Bunting</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeCategory === 'Bunting' ? 'bg-white/20' : 'bg-slate-200'}`}>
                    {herdData.filter(c => c.status === 'Bunting').length}
                  </span>
                </button>

                <button 
                  onClick={() => setActiveCategory('Kering')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                    activeCategory === 'Kering' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                  }`}
                >
                  <span>Kering / Dara</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeCategory === 'Kering' ? 'bg-white/20' : 'bg-slate-200'}`}>
                    {herdData.filter(c => c.status === 'Kering').length}
                  </span>
                </button>

                <button 
                  onClick={() => setActiveCategory('Karantina')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                    activeCategory === 'Karantina' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                  }`}
                >
                  <span>Karantina</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeCategory === 'Karantina' ? 'bg-white/20' : 'bg-slate-200'}`}>
                    {herdData.filter(c => c.status === 'Karantina').length}
                  </span>
                </button>

                <button 
                  onClick={() => setActiveCategory('Arsip')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                    activeCategory === 'Arsip' ? 'bg-[#ba1a1a] text-white shadow-sm' : 'bg-[#ffdad6]/60 text-[#ba1a1a] hover:bg-[#ffdad6]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">archive</span>
                  <span>Arsip / Terhapus</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeCategory === 'Arsip' ? 'bg-white/20' : 'bg-red-200/60'}`}>
                    {archivedHerdData.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Clinical & Production Stats Banner */}
            <div className="xl:col-span-5 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#41493e] uppercase tracking-wider">Statistik Ringkas Kawanan</span>
                <span className="flex items-center gap-1 text-[11px] bg-[#8df5e4] text-[#00201c] px-2.5 py-0.5 rounded-full font-bold">
                  <span className="material-symbols-outlined text-[13px]">verified</span> Supabase Sync
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200/50 flex flex-col">
                  <span className="text-[10px] text-[#717a6d]">Distribusi Klinis</span>
                  <span className="text-[16px] text-[#00450d] font-black mt-0.5">100% Bebas</span>
                  <span className="text-[10px] text-[#006b5f] font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span> 0 Kasus
                  </span>
                </div>

                <div className="bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200/50 flex flex-col">
                  <span className="text-[10px] text-[#717a6d]">Rata-rata BCS</span>
                  <span className="text-[16px] text-[#111c2d] font-black mt-0.5">
                    {herdData.length > 0 ? (herdData.reduce((acc, c) => acc + c.bcs, 0) / herdData.length).toFixed(2) : '3.20'} <span className="text-[10px] font-normal text-slate-400">/ 5</span>
                  </span>
                  <span className="text-[10px] text-[#00450d] font-bold">Ideal</span>
                </div>

                <div className="bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200/50 flex flex-col">
                  <span className="text-[10px] text-[#717a6d]">Rata-rata Susu</span>
                  <span className="text-[16px] text-[#006b5f] font-black mt-0.5">
                    {herdData.length > 0 ? (herdData.reduce((acc, c) => acc + c.milkYield, 0) / herdData.length).toFixed(1) : '18.2'} L
                  </span>
                  <span className="text-[10px] text-[#717a6d]">ekor / hari</span>
                </div>
              </div>

              {/* Multi-segment Health Bar */}
              <div className="w-full flex flex-col gap-1">
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="h-full bg-[#1b5e20]" style={{ width: '85%' }} title="Sehat Prima (85%)"></div>
                  <div className="h-full bg-[#70d8c8]" style={{ width: '15%' }} title="Observasi/Transisi (15%)"></div>
                  <div className="h-full bg-[#ba1a1a]" style={{ width: '0%' }} title="Mastitis (0%)"></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#717a6d] font-semibold px-0.5">
                  <span className="flex items-center gap-1 text-[#00450d]"><span className="w-2 h-2 rounded-full bg-[#1b5e20] inline-block"></span> Sehat (24)</span>
                  <span className="flex items-center gap-1 text-[#006b5f]"><span className="w-2 h-2 rounded-full bg-[#70d8c8] inline-block"></span> Kering / Dara (4)</span>
                  <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-300 inline-block"></span> Isolasi (0)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Data Grid Table */}
          <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
            <div className="p-4 bg-[#f0f3ff] border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#00450d] text-[24px]">grid_view</span>
                <div>
                  <span className="text-[16px] font-bold text-[#111c2d]">Data Induk Ternak &amp; Telemetri ERD</span>
                  <span className="block text-[11px] text-[#717a6d]">Pembaruan real-time dari pos pemerah &amp; IoT RFID transponder</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="bg-white px-3 py-1 rounded-md font-semibold text-[#41493e] border border-slate-200">
                  Menampilkan {filteredCattle.length} dari {herdData.length} Ekor
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[#41493e] text-[11px] font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-4">Ear Tag / ID</th>
                    <th className="py-3 px-4">Foto &amp; Nama Sapi</th>
                    <th className="py-3 px-4">Kandang</th>
                    <th className="py-3 px-4">Status Fisiologis</th>
                    <th className="py-3 px-4">Hari Laktasi</th>
                    <th className="py-3 px-4 text-center">Bobot (kg)</th>
                    <th className="py-3 px-4 text-center">BCS</th>
                    <th className="py-3 px-4 text-center">Produksi (L)</th>
                    <th className="py-3 px-4">Status Ambing (CNN)</th>
                    <th className="py-3 px-4 text-right">Marjin IOFC</th>
                    <th className="py-3 px-4 text-center">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px]">
                  {loading ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-[#717a6d]">
                        <span className="material-symbols-outlined text-[32px] animate-spin text-[#006b5f]">progress_activity</span>
                        <p className="text-xs mt-2 font-semibold">Memuat kawanan sapi dari Supabase...</p>
                      </td>
                    </tr>
                  ) : filteredCattle.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-[#717a6d]">
                        <span className="material-symbols-outlined text-[36px] text-[#717a6d]">cruelty_free</span>
                        <p className="text-xs font-bold text-[#111c2d] mt-2">Tidak ada sapi ditemukan</p>
                        <p className="text-[11px] text-[#717a6d]">Coba ganti filter kategori atau kata kunci pencarian.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCattle.map((cow) => (
                    <tr key={cow.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 align-middle">
                        <div className="flex flex-col">
                          <span className="text-[16px] font-black text-[#00450d]">{cow.id}</span>
                          <div className="flex items-center gap-1 text-[11px] font-mono text-[#717a6d]">
                            <span className="material-symbols-outlined text-[13px]">nfc</span>
                            <span>{cow.rfid}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 align-middle">
                        <div 
                          onClick={() => onNavigate?.('profil_sapi', cow.id.replace('#', ''))}
                          className="flex items-center gap-3 min-w-0 cursor-pointer group"
                          title={`Buka Profil Lengkap Sapi ${cow.name} (${cow.id})`}
                        >
                          <img 
                            src={cow.photoUrl} 
                            alt={cow.name}
                            className="w-11 h-11 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0 group-hover:ring-2 group-hover:ring-[#006b5f] transition-all"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-[14px] text-[#111c2d] group-hover:text-[#00450d] transition-colors truncate">{cow.name}</span>
                            <span className="text-[11px] text-[#41493e] truncate">{cow.breed}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 align-middle">
                        <div className="flex items-center gap-1 text-[12px] font-bold text-[#111c2d]">
                          <span className="material-symbols-outlined text-[15px] text-[#006b5f]">warehouse</span>
                          <span>{cow.barn}</span>
                        </div>
                        <span className="text-[11px] text-[#717a6d]">{cow.stall}</span>
                      </td>

                      <td className="py-3 px-4 align-middle">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          cow.status === 'Laktasi'
                            ? 'bg-[#8df5e4] text-[#00201c]'
                            : cow.status === 'Bunting'
                            ? 'bg-[#dee8ff] text-[#006b5f]'
                            : 'bg-slate-100 text-[#41493e]'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1b5e20]"></span>
                          {cow.statusLabel}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#111c2d]">H-{cow.dim}</span>
                          <span className="text-[11px] text-[#717a6d]">{cow.dimLabel}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 align-middle text-center">
                        <span className="font-bold text-[#111c2d]">{cow.weight}</span>
                      </td>

                      <td className="py-3 px-4 align-middle text-center">
                        <span className="inline-block px-2 py-0.5 rounded bg-[#f0f3ff] text-[#00450d] font-bold">
                          {cow.bcs.toFixed(2)}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-middle text-center">
                        <span className="text-[15px] text-[#006b5f] font-black">{cow.milkYield} L</span>
                        <span className="text-[10px] text-[#717a6d] block">Pagi: {cow.morningYield} • Sore: {cow.afternoonYield}</span>
                      </td>

                      <td className="py-3 px-4 align-middle">
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#acf4a4]/40 text-[#0c5216] text-[11px] font-bold w-fit">
                            <span className="material-symbols-outlined text-[13px]">check_circle</span>
                            {cow.cnnStatus}
                          </span>
                          <span className="text-[10px] text-[#717a6d]">{cow.cnnAccuracy}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 align-middle text-right">
                        <span className="font-extrabold text-[#00450d] text-[14px]">
                          Rp {cow.iofc.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-[#717a6d] block">{cow.iofcSurplus}</span>
                      </td>

                      <td className="py-3 px-4 align-middle text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <button 
                            onClick={() => onNavigate?.('profil_sapi', cow.id.replace('#', ''))}
                            className="px-2.5 py-1 rounded-full bg-[#8df5e4] hover:bg-[#70d8c8] text-[#00201c] text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            title={`Buka Profil Sapi ${cow.name} (${cow.id})`}
                          >
                            <span className="material-symbols-outlined text-[13px]">badge</span> Profil
                          </button>

                          <button 
                            onClick={() => onNavigate?.('riwayat_sapi', cow.id.replace('#', ''))}
                            className="px-2.5 py-1 rounded-full bg-[#dee8ff] hover:bg-[#c6d7ff] text-[#00450d] text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            title={`Buka Riwayat Rekam Medis & Laktasi Sapi ${cow.name} (${cow.id})`}
                          >
                            <span className="material-symbols-outlined text-[13px]">history</span> Riwayat
                          </button>

                          <button 
                            onClick={() => onNavigate?.('deteksi', cow.id.replace('#', ''))}
                            className="px-2.5 py-1 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] text-[11px] font-bold transition-colors border border-slate-200 cursor-pointer flex items-center gap-1"
                            title={`Skrining Mastitis AI Sapi ${cow.name} (${cow.id})`}
                          >
                            <span className="material-symbols-outlined text-[13px] text-[#006b5f]">photo_camera</span> Ambing
                          </button>

                          <button 
                            onClick={() => onNavigate?.('prediksi', cow.id.replace('#', ''))}
                            className="px-2.5 py-1 rounded-full bg-[#1b5e20] text-white hover:bg-[#00450d] text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                            title={`Hitung Kebutuhan Nutrisi & Pakan AI Sapi ${cow.name} (${cow.id})`}
                          >
                            <span className="material-symbols-outlined text-[13px]">psychology</span> Pakan
                          </button>

                          {activeCategory === 'Arsip' ? (
                            <button 
                              onClick={async () => {
                                try {
                                  await restoreCow(cow.dbId);
                                  showToast(`Sapi ${cow.name} (${cow.id}) berhasil dipulihkan ke kawanan aktif!`);
                                } catch (err: any) {
                                  showToast('Gagal memulihkan: ' + (err.message || 'Error'));
                                }
                              }}
                              className="px-2.5 py-1 rounded-full bg-[#acf4a4] hover:bg-[#8ee485] text-[#002203] text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                              title={`Pulihkan Sapi ${cow.name} (${cow.id}) ke Kawanan Aktif`}
                            >
                              <span className="material-symbols-outlined text-[14px]">unarchive</span> Pulihkan
                            </button>
                          ) : (
                            <button 
                              onClick={() => setCowToDelete(cow)}
                              className="p-1.5 rounded-full hover:bg-[#ffdad6] text-[#ba1a1a] transition-colors border border-transparent hover:border-[#ffdad6] cursor-pointer"
                              title={`Arsipkan Sapi ${cow.name} (${cow.id})`}
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-24 lg:bottom-10 right-6 z-50 bg-[#111c2d] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom duration-200">
          <span className="material-symbols-outlined text-[#8df5e4] text-[20px]">check_circle</span>
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* MODAL INPUT TAMBAH SAPI BARU (SUPABASE PERSISTENCE) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#acf4a4]/40 text-[#00450d] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">add_circle</span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#111c2d]">Tambah Sapi Baru</h3>
                  <p className="text-xs text-[#717a6d]">Data langsung tersimpan di cloud Supabase</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newCow.nama || !newCow.eartag) {
                  showToast('Nama sapi dan nomor eartag wajib diisi!');
                  return;
                }
                setIsSubmitting(true);
                try {
                  await addCow({
                    nama: newCow.nama,
                    eartag: newCow.eartag,
                    ras: newCow.ras,
                    lokasi_kandang: newCow.lokasi_kandang,
                    fase_laktasi: newCow.fase_laktasi,
                    status_kesehatan: newCow.status_kesehatan,
                    berat_badan: Number(newCow.berat_badan) || 500,
                    skor_bcs: Number(newCow.skor_bcs) || 3.25,
                    rerata_produksi_harian: Number(newCow.rerata_produksi_harian) || 18.0,
                    catatan: newCow.catatan || 'Sapi baru didaftarkan ke kawanan.',
                    foto_profil_url: newCow.foto_profil_url,
                  });
                  showToast(`Sapi ${newCow.nama} (#${newCow.eartag}) berhasil didaftarkan ke Supabase!`);
                  setShowAddModal(false);
                  setNewCow({
                    nama: '',
                    eartag: '',
                    ras: 'Friesian Holstein (FH)',
                    lokasi_kandang: 'Kandang Laktasi A',
                    fase_laktasi: 'Laktasi',
                    status_kesehatan: 'Sehat',
                    berat_badan: '510',
                    skor_bcs: '3.25',
                    rerata_produksi_harian: '18.5',
                    catatan: '',
                    foto_profil_url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80',
                  });
                } catch (err: any) {
                  showToast('Gagal menyimpan sapi: ' + (err.message || 'Error'));
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="p-5 flex flex-col gap-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#111c2d]">Nama Sapi <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newCow.nama}
                    onChange={(e) => setNewCow({ ...newCow, nama: e.target.value })}
                    placeholder="Contoh: Rembulan"
                    className="p-2.5 rounded-xl border border-slate-200 focus:border-[#00450d] outline-none text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#111c2d]">Nomor Eartag / ID <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newCow.eartag}
                    onChange={(e) => setNewCow({ ...newCow, eartag: e.target.value })}
                    placeholder="Contoh: 30"
                    className="p-2.5 rounded-xl border border-slate-200 focus:border-[#00450d] outline-none text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#111c2d]">Ras Sapi</label>
                  <select
                    value={newCow.ras}
                    onChange={(e) => setNewCow({ ...newCow, ras: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 focus:border-[#00450d] outline-none text-xs bg-white"
                  >
                    <option value="Friesian Holstein (FH)">Friesian Holstein (FH)</option>
                    <option value="FH Cross Lokal">FH Cross Lokal</option>
                    <option value="Jersey Murni">Jersey Murni</option>
                    <option value="Peranakan Ongole">Peranakan Ongole</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#111c2d]">Lokasi Kandang</label>
                  <select
                    value={newCow.lokasi_kandang}
                    onChange={(e) => setNewCow({ ...newCow, lokasi_kandang: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 focus:border-[#00450d] outline-none text-xs bg-white"
                  >
                    <option value="Kandang Laktasi A">Kandang Laktasi A</option>
                    <option value="Kandang Laktasi B">Kandang Laktasi B</option>
                    <option value="Kandang Karantina Blok B">Kandang Karantina Blok B</option>
                    <option value="Kandang Dara & Kering">Kandang Dara &amp; Kering</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#111c2d]">Fase Fisiologis</label>
                  <select
                    value={newCow.fase_laktasi}
                    onChange={(e) => setNewCow({ ...newCow, fase_laktasi: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 focus:border-[#00450d] outline-none text-xs bg-white"
                  >
                    <option value="Laktasi">Laktasi Aktif</option>
                    <option value="Bunting">Bunting</option>
                    <option value="Periode Kering">Periode Kering</option>
                    <option value="Dara">Dara</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#111c2d]">Status Kesehatan</label>
                  <select
                    value={newCow.status_kesehatan}
                    onChange={(e) => setNewCow({ ...newCow, status_kesehatan: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 focus:border-[#00450d] outline-none text-xs bg-white"
                  >
                    <option value="Sehat">100% Sehat (Grade A)</option>
                    <option value="Observasi">Observasi Rutin</option>
                    <option value="Karantina Mastitis">Karantina Mastitis</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#111c2d]">Bobot (kg)</label>
                  <input
                    type="number"
                    value={newCow.berat_badan}
                    onChange={(e) => setNewCow({ ...newCow, berat_badan: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 focus:border-[#00450d] outline-none text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#111c2d]">Produksi (L/hari)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCow.rerata_produksi_harian}
                    onChange={(e) => setNewCow({ ...newCow, rerata_produksi_harian: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 focus:border-[#00450d] outline-none text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#111c2d]">Skor BCS (1-5)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newCow.skor_bcs}
                    onChange={(e) => setNewCow({ ...newCow, skor_bcs: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 focus:border-[#00450d] outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#111c2d]">Catatan Khusus</label>
                <textarea
                  value={newCow.catatan}
                  onChange={(e) => setNewCow({ ...newCow, catatan: e.target.value })}
                  placeholder="Keterangan silsilah, riwayat vaksin, atau pola pakan khusus..."
                  rows={2}
                  className="p-2.5 rounded-xl border border-slate-200 focus:border-[#00450d] outline-none text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#00450d] hover:bg-[#1b5e20] text-white font-bold shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>{isSubmitting ? 'Menyimpan...' : 'Simpan ke Supabase'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI SOFT DELETE SAPI */}
      {cowToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">archive</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#111c2d]">Arsipkan Sapi {cowToDelete.name} ({cowToDelete.id})?</h3>
              <p className="text-xs text-[#717a6d] mt-1.5 leading-relaxed">
                Sapi ini akan <strong>disembunyikan dari kawanan aktif (soft delete)</strong>. Semua riwayat perahan, rekam medis, dan transaksi kas di Supabase <strong>tetap tersimpan aman</strong> dan tidak akan hilang permanen.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCowToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await deleteCow(cowToDelete.dbId);
                    showToast(`Sapi ${cowToDelete.name} (${cowToDelete.id}) berhasil diarsipkan.`);
                    setCowToDelete(null);
                  } catch (e: any) {
                    showToast('Gagal mengarsipkan: ' + (e.message || 'Error'));
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#ba1a1a] hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Ya, Arsipkan Sapi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeScreen="katalog"
        onNavigate={onNavigate}
      />

      {/* Persistent Bottom Nav for Mobile */}
      <MobileBottomNav activeScreen="katalog" onNavigate={onNavigate} />
    </div>
  );
}
