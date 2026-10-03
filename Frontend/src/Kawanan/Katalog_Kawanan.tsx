import { useState, useMemo } from 'react';
import type { ScreenType } from '../App.tsx';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../components/Navigation';

interface KatalogKawananProps {
  onNavigate?: (screen: ScreenType) => void;
}

interface CowRecord {
  id: string;
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

const INITIAL_HERD_DATA: CowRecord[] = [
  {
    id: '#12',
    rfid: 'RF-012',
    name: 'Melati',
    breed: 'FH Murni • Rembangan',
    barn: 'Kandang A-04',
    stall: 'Stall Palungan 04',
    status: 'Laktasi',
    statusLabel: 'Laktasi Peak',
    dim: 42,
    dimLabel: 'Periode Awal',
    weight: 545,
    bcs: 3.25,
    milkYield: 16.4,
    morningYield: 9.1,
    afternoonYield: 7.3,
    cnnStatus: 'Normal / Sehat',
    cnnAccuracy: '98.9%',
    iofc: 181100,
    iofcSurplus: 'Surplus +14%',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGfiaudLbxFA6x52WZVpYpLFM5NeNnCFy3zJrRs5EVAVtvQEddWySvEb-oQmg6Jw2ogxy6Wxz4Z7yZsTn9q2Vi3_4IagNmrd6B_fXI_svoZsV-52TBlo2cxWnWMGL7kBPiYd3rG3FXmd7H7l_oKxuN8YWe_rsaB--bQ-Wg54lbbk1euLjInKZ9jT_b8QIs0FbUqgkITi3dixcTFS4b9d2KqPiJ_0QwOAk2iUUBeyg7ysHLmHom5Ugk'
  },
  {
    id: '#04',
    rfid: 'RF-004',
    name: 'Mawar',
    breed: 'FH Grade-A • Laktasi 3',
    barn: 'Kandang A-02',
    stall: 'Stall Palungan 02',
    status: 'Laktasi',
    statusLabel: 'Laktasi 3',
    dim: 142,
    dimLabel: 'Fase Pertengahan',
    weight: 520,
    bcs: 3.10,
    milkYield: 18.6,
    morningYield: 10.2,
    afternoonYield: 8.4,
    cnnStatus: 'Pulih Total / Negatif',
    cnnAccuracy: 'CMT: Normal',
    iofc: 192000,
    iofcSurplus: 'Surplus +18%',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFK4CwEbDpfw56ZBVQgw1xB1Dal0yUv8nZmXhx9mXxJlhErqfetLBkroqT8_JhP2tz5QBSNJdZk5iqsK1M5a36_bx6eKw4qhJB9MI_eMaMKEXPc1XBRXx2SZZzM4QnZM4WNFNXUhIqHK0nwJJm9vVXKUsUNbhnI_1zS_2GF00UZb2R2PWEgbk-edolueyE2Kxmw2bwcHlcb6vCPLzb7aKbJMmtC_LKPcx_EBMToxct32SP4jCXdeFe'
  },
  {
    id: '#07',
    rfid: 'RF-019',
    name: 'Cantik',
    breed: 'FH Indukan Dara • Prime',
    barn: 'Kandang A-08',
    stall: 'Stall Palungan 08',
    status: 'Laktasi',
    statusLabel: 'Laktasi 1 Peak',
    dim: 45,
    dimLabel: 'Yield Tertinggi',
    weight: 510,
    bcs: 3.00,
    milkYield: 19.2,
    morningYield: 10.8,
    afternoonYield: 8.4,
    cnnStatus: 'Sehat Prima',
    cnnAccuracy: '99.1%',
    iofc: 195400,
    iofcSurplus: 'Top Performer',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOAHyJDLBaYxkUFsG17hubwvL2zhDHvyf35dkX5xW6dLcIW1Ac0pVKvabrEh3zNqZQMf97dAEVWMDa3YuM24zWsPOOW2D_iUm7KFwRPJU861DCL6Rhvb9i_WG00c4dXZ1_kMcY_hzzPJxM7ZkrMw2zAovJUtgz3M5FtzqY42cCf5bkaRIOGCUql1fkOwWcJMJKuWwODZPtrce-1IHaJxk4-ct7XKJjZ8LXTXMvYaQvvwdOmO0_z4Tb'
  },
  {
    id: '#18',
    rfid: 'RF-018',
    name: 'Sekar',
    breed: 'FH Murni • Rembangan',
    barn: 'Kandang A-06',
    stall: 'Stall Palungan 06',
    status: 'Laktasi',
    statusLabel: 'Laktasi 2',
    dim: 98,
    dimLabel: 'Fase Awal',
    weight: 530,
    bcs: 3.20,
    milkYield: 17.5,
    morningYield: 9.6,
    afternoonYield: 7.9,
    cnnStatus: 'Normal (SCC < 110k)',
    cnnAccuracy: '98.5%',
    iofc: 176000,
    iofcSurplus: 'Optimal',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJeeagUTxManEPE90Mm61v2lavowmVFMmcYo9U93IvVDAgNSarfNFX52H7gMQuYTd5DqOdxKTEo_K-0dbyPjKs4JWAs9RdeCMwaq4KeH-ieC1FzNayHt0FqGkhmGXYwIy7HHE3TvsKSgd9-GBGwX_YkQLAg4D2VuQIIx9QqAIp_G2p-_z0jg3XToVNQp5tOGOrN56s_9K4mgBtcACuf6zKww6Sel2Wh_8v3Nk9WQVRq6am5HA51eFN'
  },
  {
    id: '#21',
    rfid: 'RF-021',
    name: 'Bunga',
    breed: 'FH Silangan • Bunting',
    barn: 'Kandang B-02',
    stall: 'Stall Khusus 02',
    status: 'Bunting',
    statusLabel: 'Bunting 7 Bulan',
    dim: 260,
    dimLabel: 'Fase Akhir',
    weight: 560,
    bcs: 3.40,
    milkYield: 11.2,
    morningYield: 6.2,
    afternoonYield: 5.0,
    cnnStatus: 'Transisi Kering',
    cnnAccuracy: '98.0%',
    iofc: 124000,
    iofcSurplus: 'Fase Pemulihan',
    photoUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '#25',
    rfid: 'RF-025',
    name: 'Srikandi',
    breed: 'FH Indukan • Pra-Lahir',
    barn: 'Kandang B-05',
    stall: 'Stall Bersalin 05',
    status: 'Kering',
    statusLabel: 'Kering Kandang',
    dim: 300,
    dimLabel: 'Periode Kering',
    weight: 585,
    bcs: 3.50,
    milkYield: 0,
    morningYield: 0,
    afternoonYield: 0,
    cnnStatus: 'Sehat (Dry Cow)',
    cnnAccuracy: '100%',
    iofc: 0,
    iofcSurplus: 'Persiapan Partus',
    photoUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=200&q=80'
  }
];

export default function KatalogKawanan({ onNavigate }: KatalogKawananProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'Semua' | 'Laktasi' | 'Bunting' | 'Kering' | 'Karantina'>('Semua');

  const filteredCattle = useMemo(() => {
    return INITIAL_HERD_DATA.filter((cow) => {
      const matchesCategory =
        activeCategory === 'Semua' ? true : cow.status === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cow.name.toLowerCase().includes(q) ||
        cow.id.toLowerCase().includes(q) ||
        cow.rfid.toLowerCase().includes(q) ||
        cow.barn.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

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
                onClick={() => alert('Formulir Pendaftaran Sapi Baru (Ear Tag & RFID) akan dibuka')}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1b5e20] text-white hover:bg-[#00450d] transition-transform active:scale-95 text-[13px] font-bold shadow-sm"
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
                <span className="text-[12px] text-[#717a6d]">Database Sinkron: <strong>28 Ekor</strong></span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button 
                  onClick={() => setActiveCategory('Semua')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                    activeCategory === 'Semua' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                  }`}
                >
                  <span>Semua</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeCategory === 'Semua' ? 'bg-white/20' : 'bg-slate-200'}`}>28</span>
                </button>

                <button 
                  onClick={() => setActiveCategory('Laktasi')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                    activeCategory === 'Laktasi' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                  }`}
                >
                  <span>Laktasi Aktif</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeCategory === 'Laktasi' ? 'bg-white/20' : 'bg-slate-200'}`}>18</span>
                </button>

                <button 
                  onClick={() => setActiveCategory('Bunting')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                    activeCategory === 'Bunting' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                  }`}
                >
                  <span>Bunting</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeCategory === 'Bunting' ? 'bg-white/20' : 'bg-slate-200'}`}>4</span>
                </button>

                <button 
                  onClick={() => setActiveCategory('Kering')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                    activeCategory === 'Kering' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                  }`}
                >
                  <span>Kering / Dara</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeCategory === 'Kering' ? 'bg-white/20' : 'bg-slate-200'}`}>6</span>
                </button>

                <button 
                  onClick={() => setActiveCategory('Karantina')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                    activeCategory === 'Karantina' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                  }`}
                >
                  <span>Karantina</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeCategory === 'Karantina' ? 'bg-white/20' : 'bg-slate-200'}`}>0</span>
                </button>
              </div>
            </div>

            {/* Quick Clinical & Production Stats Banner */}
            <div className="xl:col-span-5 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#41493e] uppercase tracking-wider">Statistik Ringkas Kawanan</span>
                <span className="flex items-center gap-1 text-[11px] bg-[#8df5e4] text-[#00201c] px-2.5 py-0.5 rounded-full font-bold">
                  <span className="material-symbols-outlined text-[13px]">verified</span> Rembangan Valid
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
                  <span className="text-[16px] text-[#111c2d] font-black mt-0.5">3.18 <span className="text-[10px] font-normal text-slate-400">/ 5</span></span>
                  <span className="text-[10px] text-[#00450d] font-bold">Ideal</span>
                </div>

                <div className="bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200/50 flex flex-col">
                  <span className="text-[10px] text-[#717a6d]">Rata-rata Susu</span>
                  <span className="text-[16px] text-[#006b5f] font-black mt-0.5">15.8 L</span>
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
                  Menampilkan {filteredCattle.length} dari 28 Ekor
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
                  {filteredCattle.map((cow) => (
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
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={cow.photoUrl} 
                            alt={cow.name}
                            className="w-11 h-11 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-[14px] text-[#111c2d] truncate">{cow.name}</span>
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
                        <div className="flex items-center justify-center gap-1.5">
                          {cow.id === '#04' && (
                            <button 
                              onClick={() => onNavigate?.('profil_sapi')}
                              className="px-2.5 py-1 rounded-full bg-[#8df5e4] hover:bg-[#70d8c8] text-[#00201c] text-[11px] font-bold transition-all shadow-xs flex items-center gap-1"
                              title="Lihat Profil Sapi Mawar"
                            >
                              <span className="material-symbols-outlined text-[13px]">badge</span> Profil
                            </button>
                          )}
                          <button 
                            onClick={() => onNavigate?.('deteksi')}
                            className="px-2.5 py-1 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] text-[11px] font-bold transition-colors border border-slate-200"
                            title="Buka Pemeriksaan Ambing CNN"
                          >
                            Ambing
                          </button>
                          <button 
                            onClick={() => onNavigate?.('prediksi')}
                            className="px-2.5 py-1 rounded-full bg-[#1b5e20] text-white hover:bg-[#00450d] text-[11px] font-bold transition-all shadow-sm flex items-center gap-1"
                            title="Buka Model Pakan XGBoost"
                          >
                            <span className="material-symbols-outlined text-[13px]">psychology</span> Pakan
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

      {/* Persistent Bottom Nav for Mobile */}
      <MobileBottomNav activeScreen="katalog" onNavigate={onNavigate} />
    </div>
  );
}
