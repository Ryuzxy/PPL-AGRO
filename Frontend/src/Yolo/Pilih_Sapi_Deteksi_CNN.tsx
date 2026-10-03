import { useState } from 'react';
import type { ScreenType } from '../App.tsx';
import { useCows, type UICow } from '../hooks/useSupabaseData';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../components/Navigation';

interface PilihSapiDeteksiCNNProps {
  onNavigate?: (screen: ScreenType) => void;
}

export default function PilihSapiDeteksiCNN({ onNavigate }: PilihSapiDeteksiCNNProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'semua' | 'kandang_a' | 'kandang_b' | 'perlu_cek'>('semua');
  const [rfidActive, setRfidActive] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { cows: dbCows } = useCows();

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const defaultCows: UICow[] = [
    {
      id: '07',
      dbId: 7,
      number: '#07',
      name: 'Cantik',
      tag: 'Dara • B-05',
      eartag: 'ID-ET-07-JKT',
      stall: 'Stall B-05',
      scheduleText: 'Jadwal Rutin Sore Ini',
      healthStatus: '99.1% Sehat',
      isHealthy: true,
      metric1Label: 'Kondisi Terakhir',
      metric1Val: 'Grade A (3 hari lalu)',
      metric2Label: 'Target Ambing',
      metric2Val: '4 Kuartir Simetris',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSPOprSbV4tXxwlGCW9eZ8NXQ75ku0vyBtEWoqXuVW9GI-JUyx8b4nRo7bnOEIkiTOueP2KWJoXhaS6u2Dsk576BwSyDkRQRTz-Lt4csMW0FAUzLbDLuEkZKiUts5nR8AQEIqwI91zTSkt7VZZj5wmDqrotp-ygxtafrKezUz4T5SVD3vQwrpXeuLcqjQpsJPk5Iv6f4Glo4L_d7T-I4oL1Ero-Bpp-vGegCSWCUsyttFpJeh0DZXw',
      kategori: 'kandang_b',
      raw: {} as any
    },
    {
      id: '18',
      dbId: 18,
      number: '#18',
      name: 'Sekar',
      tag: 'Laktasi 2 • H-110',
      eartag: 'ID-ET-18-RMB',
      stall: 'Line 04 Parlor A',
      scheduleText: 'Evaluasi Kuartir Kiri Depan',
      scheduleWarning: true,
      healthStatus: '38.6°C Temp',
      isHealthy: false,
      metric1Label: 'CNN Confidence',
      metric1Val: '97.4% Normal',
      metric2Label: 'Status Jaringan Ambing',
      metric2Val: 'Kemerahan Minor',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7EvobBWcbpU-4fA6c4j0EMD7VO_6XweeX2EJKQ7KRcW2h3lCWAJ1Wt126zgRwG3Fw7JBawHHCv4rzm6XwnDAdK739UrxZQsN7i7Vjyn0Hb9IH8zZJjl9EwOMbtCFEL9FL5EVKscfSSdh4mCI2rnuO2ltQ8hxaHN3dCQGTEhMU4S6GMwNCFYgxgp8z5i_17ZjmMO6n0Cw4PfxH3FOM4eS4RpQkqNS-1No1hwpPEDk21dbYIFAw2NqJ',
      kategori: 'perlu_cek',
      raw: {} as any
    },
    {
      id: '12',
      dbId: 12,
      number: '#12',
      name: 'Melati',
      tag: 'Laktasi 2 • H-94',
      eartag: 'ID-ET-12-RMB',
      stall: 'Stall A-14',
      scheduleText: 'Jadwal Sore Ini (Prioritas)',
      scheduleWarning: true,
      healthStatus: 'Perlu Cek',
      isHealthy: false,
      metric1Label: 'Pembengkakan Ambing',
      metric1Val: 'Kuadran Kiri-Belakang',
      metric2Label: 'Produksi Terakhir',
      metric2Val: '21.4 L / Hari',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfrE1eDrWFkuHXMJa7twfmYy1OPpAX1dzP-O19Etd7D-c_5uHjzzlihyuYyTpx2DyOdey9FKCUp2VVAVbb9wrRYGd14wsPReEvb_th7N3cQf8qk2QIeKLdDAkxEHIniUsKaU6nG-zxJs8s64FFgpa9ofwvPW0RWhfK8G4AEdKIQ9TvpuqdGQji1MWXWXsAET-MGsV_XEm4lyWSE9e_NZT5QqI2oOeB0wrLv5Tow3jmmpnP7h4anQHC',
      kategori: 'kandang_a',
      raw: {} as any
    },
    {
      id: '04',
      dbId: 4,
      number: '#04',
      name: 'Mawar',
      tag: 'Pasca Terapi Tube 3',
      eartag: 'ID-ET-04-KRG',
      stall: 'Kandang Laktasi A-04',
      scheduleText: 'Evaluasi Pemulihan Total',
      healthStatus: 'Grade A Sembuh',
      isHealthy: true,
      metric1Label: 'Hasil Rapid SCC',
      metric1Val: '185.000 sel/mL (Negatif)',
      metric2Label: 'Kuartir Kanan-Depan',
      metric2Val: 'Tekstur Normal Kenyal',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCn3kRgbAx07X77LMnuqcwbQC7BrG-fmY-mSukU217UIhHqJ3dLDWHrOAl2mbn6u7-hdo3MMuzWKdRzDRUvroVvZkstq_mT3OwIFVuR4bm67kfE2X5cVxoDGkklIOXdApAkboytBZ5HjMSTGireDwYVZdJ5MgkRC4OrheTKI43vlFt1v5K4D923Hm4T3r8MRZxlROIaTdyjRYY6ApXYOeQeQe6eiWyaoB8Hsv6tIcodjXzLRJM0pgU',
      kategori: 'kandang_a',
      raw: {} as any
    },
    {
      id: '21',
      dbId: 21,
      number: '#21',
      name: 'Kenanga',
      tag: 'Dara Laktasi 1 • Baru',
      eartag: 'ID-ET-21-RMB',
      stall: 'Kandang B-02',
      scheduleText: 'Baseline Ambing Perdana',
      healthStatus: 'Belum Baseline',
      isHealthy: true,
      metric1Label: 'Status Baseline',
      metric1Val: 'Perlu Foto Standar',
      metric2Label: 'Bobot Badan',
      metric2Val: '440 kg',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSPOprSbV4tXxwlGCW9eZ8NXQ75ku0vyBtEWoqXuVW9GI-JUyx8b4nRo7bnOEIkiTOueP2KWJoXhaS6u2Dsk576BwSyDkRQRTz-Lt4csMW0FAUzLbDLuEkZKiUts5nR8AQEIqwI91zTSkt7VZZj5wmDqrotp-ygxtafrKezUz4T5SVD3vQwrpXeuLcqjQpsJPk5Iv6f4Glo4L_d7T-I4oL1Ero-Bpp-vGegCSWCUsyttFpJeh0DZXw',
      kategori: 'kandang_b',
      raw: {} as any
    }
  ];

  const activeCows = dbCows.length > 0 ? dbCows : defaultCows;

  const filteredCows = activeCows.filter(cow => {
    const matchesSearch = 
      cow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cow.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cow.eartag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cow.stall.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'semua') return true;
    if (activeFilter === 'kandang_a') return cow.kategori === 'kandang_a';
    if (activeFilter === 'kandang_b') return cow.kategori === 'kandang_b';
    if (activeFilter === 'perlu_cek') return cow.kategori === 'perlu_cek' || cow.scheduleWarning;
    return true;
  });

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen antialiased flex flex-col lg:flex-row">
      {/* DESKTOP SIDEBAR */}
      <DesktopSidebar currentScreen="deteksi" onNavigate={onNavigate} />

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
                className="w-8 h-8 rounded-xl object-contain shadow-sm"
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
        {/* Sub-Header Context Bar */}
        <div className="pt-4 pb-2 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onNavigate?.('dashboard')}
              className="inline-flex items-center gap-1 text-[#41493e] hover:text-[#00450d] transition-colors py-1 text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Beranda</span>
            </button>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#dee8ff] text-[#111c2d]">
              <span className="w-2 h-2 rounded-full bg-[#00450d] animate-pulse"></span>
              <span className="text-[11px] font-bold">Model CNN v4.2 Aktif</span>
            </div>
          </div>

          <div className="mt-1">
            <h1 className="text-xl md:text-2xl font-extrabold text-[#111c2d] tracking-tight">
              Deteksi Mastitis CNN
            </h1>
            <p className="text-xs text-[#41493e]">
              Rembangan Dairy Farm • Arjasa, Jember
            </p>
          </div>
        </div>

        {/* RFID Pairing Banner */}
        <div className="py-2">
          <div className="relative overflow-hidden rounded-2xl bg-[#f0f3ff] shadow-sm p-4 border border-[#dee8ff]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 transition-colors ${
                  rfidActive ? 'bg-[#1b5e20]' : 'bg-[#00450d]'
                }`}>
                  <span className={`material-symbols-outlined text-[24px] ${rfidActive ? 'animate-spin' : 'animate-pulse'}`}>
                    contactless
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#111c2d] truncate">Tap RFID Scanner</span>
                    <span className="bg-[#8df5e4] text-[#007165] px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                      {rfidActive ? 'SCANNING' : 'READY'}
                    </span>
                  </div>
                  <span className="text-xs text-[#41493e] truncate">Sensor Siaga di Milking Parlor Stall 01-08</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setRfidActive(!rfidActive);
                  showToast(rfidActive ? 'Scanner RFID Dinonaktifkan' : 'RFID Siaga Menunggu Tap Eartag...');
                }}
                className="shrink-0 h-10 px-4 rounded-full bg-[#1b5e20] text-white text-xs font-bold inline-flex items-center gap-1.5 active:scale-95 transition-transform shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">sensors</span>
                <span>{rfidActive ? 'Standby' : 'Aktifkan'}</span>
              </button>
            </div>

            <div className="mt-3 pt-2.5 flex items-center justify-between bg-white/80 rounded-xl px-3 py-1.5 border border-[#dee8ff]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#006b5f]"></span>
                <span className="text-[11px] text-[#41493e]">NFC/UHF Reader 920MHz Sinkron</span>
              </div>
              <button 
                onClick={() => onNavigate?.('pemindai_rfid_siaga')}
                className="text-[11px] text-[#006b5f] font-bold hover:underline"
              >
                Buka Layar Scanner →
              </button>
            </div>
          </div>
        </div>

        {/* Search & Fast Filter Bar */}
        <div className="pt-2 pb-3 flex flex-col gap-2.5">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#717a6d]">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-10 rounded-xl bg-white text-[#111c2d] placeholder:text-[#717a6d] text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20] border border-[#dee8ff] shadow-xs"
              placeholder="Cari No. Eartag, Nama Sapi, atau Kandang..." 
              type="search"
            />
            {searchQuery ? (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#717a6d] hover:text-[#111c2d]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            ) : (
              <button 
                onClick={() => onNavigate?.('ketik_manual_eartag')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#717a6d] hover:text-[#00450d]"
                title="Ketik Manual Numpad"
              >
                <span className="material-symbols-outlined text-[20px]">keyboard</span>
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button 
              onClick={() => setActiveFilter('semua')}
              className={`shrink-0 h-8 px-3.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                activeFilter === 'semua'
                  ? 'bg-[#00450d] text-white'
                  : 'bg-[#dee8ff] text-[#111c2d] hover:bg-[#d8e3fb]'
              }`}
            >
              Semua ({activeCows.length})
            </button>
            <button 
              onClick={() => setActiveFilter('kandang_a')}
              className={`shrink-0 h-8 px-3.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                activeFilter === 'kandang_a'
                  ? 'bg-[#00450d] text-white'
                  : 'bg-[#dee8ff] text-[#111c2d] hover:bg-[#d8e3fb]'
              }`}
            >
              Kandang A ({activeCows.filter(c => c.kategori === 'kandang_a').length})
            </button>
            <button 
              onClick={() => setActiveFilter('kandang_b')}
              className={`shrink-0 h-8 px-3.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                activeFilter === 'kandang_b'
                  ? 'bg-[#00450d] text-white'
                  : 'bg-[#dee8ff] text-[#111c2d] hover:bg-[#d8e3fb]'
              }`}
            >
              Kandang B ({activeCows.filter(c => c.kategori === 'kandang_b').length})
            </button>
            <button 
              onClick={() => setActiveFilter('perlu_cek')}
              className={`shrink-0 h-8 px-3.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                activeFilter === 'perlu_cek'
                  ? 'bg-[#00450d] text-white'
                  : 'bg-[#dee8ff] text-[#111c2d] hover:bg-[#d8e3fb]'
              }`}
            >
              Perlu Cek ({activeCows.filter(c => c.kategori === 'perlu_cek' || c.scheduleWarning).length})
            </button>
          </div>
        </div>

        {/* Section Header */}
        <div className="pt-1 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-[#111c2d]">Antrean Inspeksi Lapangan</span>
            <span className="w-5 h-5 rounded-full bg-[#d8e3fb] text-[#111c2d] text-xs flex items-center justify-center font-bold">
              {filteredCows.length}
            </span>
          </div>
          <span className="text-xs text-[#717a6d]">Urut: Prioritas Cek</span>
        </div>

        {/* Herd Inspection Cards */}
        <div className="flex flex-col gap-3 pb-8">
          {filteredCows.map((cow) => (
            <div 
              key={cow.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee8ff] flex flex-col gap-3 hover:border-[#1b5e20]/50 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#e7eeff] border border-slate-100">
                    <img 
                      alt={`Sapi ${cow.name} ${cow.number}`} 
                      className="w-full h-full object-cover" 
                      src={cow.image}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-[#263143]/70 py-0.5 text-center">
                      <span className="text-[10px] font-bold text-white font-mono">{cow.number}</span>
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="font-bold text-base text-[#111c2d] leading-tight truncate">{cow.name}</h2>
                      <span className="px-2 py-0.5 rounded-full bg-[#dee8ff] text-[#111c2d] text-[10px] font-bold">
                        {cow.tag}
                      </span>
                    </div>
                    <span className="text-xs text-[#717a6d] truncate">Eartag: {cow.eartag}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`material-symbols-outlined text-[15px] ${
                        cow.scheduleWarning ? 'text-[#6c2200]' : 'text-[#00450d]'
                      }`}>
                        {cow.scheduleWarning ? 'warning' : 'schedule'}
                      </span>
                      <span className={`text-[11px] font-semibold ${
                        cow.scheduleWarning ? 'text-[#6c2200]' : 'text-[#00450d]'
                      }`}>
                        {cow.scheduleText}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                  cow.isHealthy ? 'bg-[#8df5e4]/50 text-[#007165]' : 'bg-[#dee8ff] text-[#111c2d]'
                }`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {cow.isHealthy ? 'verified' : 'device_thermostat'}
                  </span>
                  <span>{cow.healthStatus}</span>
                </span>
              </div>

              {/* Telemetry Row */}
              <div className="grid grid-cols-2 gap-2 bg-[#f0f3ff] rounded-xl p-2.5 border border-[#dee8ff]">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#717a6d]">{cow.metric1Label}</span>
                  <span className="text-xs font-bold text-[#111c2d] mt-0.5">{cow.metric1Val}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#717a6d]">{cow.metric2Label}</span>
                  <span className="text-xs font-bold text-[#111c2d] mt-0.5">{cow.metric2Val}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button 
                  onClick={() => onNavigate?.('deteksi_mastitis_cnn_inspeksi')}
                  className="w-full h-11 rounded-full bg-[#1b5e20] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#00450d] active:scale-[0.98] transition-all"
                  title="Buka pemindai kamera langsung"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  <span>Buka Kamera Langsung ({cow.name})</span>
                </button>
                <button 
                  onClick={() => onNavigate?.('deteksi')}
                  className="w-full h-11 rounded-full bg-[#dee8ff] text-[#00450d] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#d8e3fb] active:scale-[0.98] transition-all"
                  title="Buka konsol diagnostik klinik desktop"
                >
                  <span className="material-symbols-outlined text-[18px]">monitor</span>
                  <span>Konsol Diagnostik</span>
                </button>
              </div>
            </div>
          ))}

          {filteredCows.length === 0 && (
            <div className="bg-white rounded-2xl p-6 text-center border border-dashed border-[#dee8ff]">
              <span className="material-symbols-outlined text-4xl text-[#717a6d]">search_off</span>
              <p className="text-sm font-bold text-[#111c2d] mt-2">Tidak Ditemukan Sapi</p>
              <p className="text-xs text-[#717a6d] mt-1">Coba gunakan kata kunci nomor eartag atau filter kandang lainnya.</p>
            </div>
          )}
        </div>
      </main>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeScreen="deteksi"
        onNavigate={onNavigate}
      />

      {/* Persistent Bottom Nav */}
      <MobileBottomNav activeScreen="deteksi" onNavigate={onNavigate} />
    </div>
  );
}
