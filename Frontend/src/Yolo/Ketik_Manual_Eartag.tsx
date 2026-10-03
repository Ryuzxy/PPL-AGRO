import React, { useState } from 'react';

interface Props {
  onNavigate?: (screen: string) => void;
}

interface CowData {
  id: string;
  name: string;
  breed: string;
  gender: string;
  age: string;
  lactation: string;
  rfid: string;
  stall: string;
  weight: string;
  yesterdayMilk: string;
  warning?: {
    title: string;
    desc: string;
  };
  image: string;
}

const cowDatabase: Record<string, CowData> = {
  '360-001928472910': {
    id: '#12',
    name: 'Melati (#12)',
    breed: 'FH Cross',
    gender: 'Betina',
    age: '3.5 Th',
    lactation: 'Laktasi-2',
    rfid: '360-001928472910',
    stall: 'Kandang A-14',
    weight: '485 kg',
    yesterdayMilk: '21.4 L',
    warning: {
      title: 'Perlu Scan Mastitis (Jadwal Sore Ini)',
      desc: 'Pemeriksaan ambing kuadran kiri-belakang terindikasi pembengkakan ringan pada pemerahan pagi.',
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfrE1eDrWFkuHXMJa7twfmYy1OPpAX1dzP-O19Etd7D-c_5uHjzzlihyuYyTpx2DyOdey9FKCUp2VVAVbb9wrRYGd14wsPReEvb_th7N3cQf8qk2QIeKLdDAkxEHIniUsKaU6nG-zxJs8s64FFgpa9ofwvPW0RWhfK8G4AEdKIQ9TvpuqdGQji1MWXWXsAET-MGsV_XEm4lyWSE9e_NZT5QqI2oOeB0wrLv5Tow3jmmpnP7h4anQHC',
  },
  '360-001928472907': {
    id: '#07',
    name: 'Cantik (#07)',
    breed: 'FH Murni',
    gender: 'Betina',
    age: '4.0 Th',
    lactation: 'Laktasi-3 (Peak)',
    rfid: '360-001928472907',
    stall: 'Line 05 Parlor A',
    weight: '520 kg',
    yesterdayMilk: '28.6 L',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCn3kRgbAx07X77LMnuqcwbQC7BrG-fmY-mSukU217UIhHqJ3dLDWHrOAl2mbn6u7-hdo3MMuzWKdRzDRUvroVvZkstq_mT3OwIFVuR4bm67kfE2X5cVxoDGkklIOXdApAkboytBZ5HjMSTGireDwYVZdJ5MgkRC4OrheTKI43vlFt1v5K4D923Hm4T3r8MRZxlROIaTdyjRYY6ApXYOeQeQe6eiWyaoB8Hsv6tIcodjXzLRJM0pgU',
  },
  '360-001928472918': {
    id: '#18',
    name: 'Sekar (#18)',
    breed: 'FH Laktasi',
    gender: 'Betina',
    age: '2.8 Th',
    lactation: 'Laktasi-1',
    rfid: '360-001928472918',
    stall: 'Line 04 Parlor A',
    weight: '445 kg',
    yesterdayMilk: '18.2 L',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfrE1eDrWFkuHXMJa7twfmYy1OPpAX1dzP-O19Etd7D-c_5uHjzzlihyuYyTpx2DyOdey9FKCUp2VVAVbb9wrRYGd14wsPReEvb_th7N3cQf8qk2QIeKLdDAkxEHIniUsKaU6nG-zxJs8s64FFgpa9ofwvPW0RWhfK8G4AEdKIQ9TvpuqdGQji1MWXWXsAET-MGsV_XEm4lyWSE9e_NZT5QqI2oOeB0wrLv5Tow3jmmpnP7h4anQHC',
  },
  '360-001928472904': {
    id: '#04',
    name: 'Mawar (#04)',
    breed: 'FH Murni',
    gender: 'Betina',
    age: '4.2 Th',
    lactation: 'Laktasi-3 (Pasca Karantina)',
    rfid: '360-001928472904',
    stall: 'Kandang Laktasi A-04',
    weight: '505 kg',
    yesterdayMilk: '22.0 L',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCn3kRgbAx07X77LMnuqcwbQC7BrG-fmY-mSukU217UIhHqJ3dLDWHrOAl2mbn6u7-hdo3MMuzWKdRzDRUvroVvZkstq_mT3OwIFVuR4bm67kfE2X5cVxoDGkklIOXdApAkboytBZ5HjMSTGireDwYVZdJ5MgkRC4OrheTKI43vlFt1v5K4D923Hm4T3r8MRZxlROIaTdyjRYY6ApXYOeQeQe6eiWyaoB8Hsv6tIcodjXzLRJM0pgU',
  },
};

export const KetikManualEartag: React.FC<Props> = ({ onNavigate }) => {
  const [eartag, setEartag] = useState('360-001928472910');

  // Find match or default to Melati if contains 12 or 928472910
  const matchedCow: CowData | undefined =
    cowDatabase[eartag] ||
    (eartag.includes('12') || eartag.includes('910') ? cowDatabase['360-001928472910'] : undefined) ||
    (eartag.includes('07') || eartag.includes('907') ? cowDatabase['360-001928472907'] : undefined) ||
    (eartag.includes('18') || eartag.includes('918') ? cowDatabase['360-001928472918'] : undefined) ||
    (eartag.includes('04') || eartag.includes('904') ? cowDatabase['360-001928472904'] : undefined);

  const handleKeyPress = (val: string) => {
    if (eartag === '—' || eartag === '') {
      setEartag(val);
    } else {
      setEartag(prev => prev + val);
    }
  };

  const handleBackspace = () => {
    if (eartag.length > 0 && eartag !== '—') {
      const next = eartag.slice(0, -1);
      setEartag(next.length === 0 ? '—' : next);
    }
  };

  const handleClear = () => {
    setEartag('—');
  };

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] flex flex-col min-h-screen antialiased select-none">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#f9f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 md:h-20 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              alt="MowTitis App Logo"
              className="h-7 md:h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1W5nB4jArKPK4MCNelmdZzLGguf2j8AY-pqGYV_gppCDNVvxWfCjdqmVBQSmbS_iBV0jI0tUpQin5_W3Jd8KH3zeo4voWenuA_lG-0HV2gsHEA2x_oZwr5oZBjv_Ng6IQR6K45v4Ka5gNXYtxNq3Z1O1-7f3DRSlgJtsgluIRYqxVS14WvFBbv5vG9ZVOieckywoa14wTOmpo45JGSJpdYN_ltvPkd7hg44sMMrVJa9qkUo3kzVvhtCNCI"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg tracking-tight text-[#00450d] leading-none">MowTitis</span>
              <span className="text-[11px] font-bold text-[#006b5f] leading-none mt-0.5">Rembangan Dairy Farm</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigate?.('notifikasi_wa')}
              aria-label="Notifikasi Peringatan Kandang"
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#41493e] hover:text-[#111c2d] relative transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#f9f9ff]"></span>
            </button>
            <div className="flex items-center pl-1">
              <img
                alt="Profile Avatar"
                className="w-8 h-8 rounded-full object-cover border border-[#c0c9bb]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCn3kRgbAx07X77LMnuqcwbQC7BrG-fmY-mSukU217UIhHqJ3dLDWHrOAl2mbn6u7-hdo3MMuzWKdRzDRUvroVvZkstq_mT3OwIFVuR4bm67kfE2X5cVxoDGkklIOXdApAkboytBZ5HjMSTGireDwYVZdJ5MgkRC4OrheTKI43vlFt1v5K4D923Hm4T3r8MRZxlROIaTdyjRYY6ApXYOeQeQe6eiWyaoB8Hsv6tIcodjXzLRJM0pgU"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col relative w-full pt-16 md:pt-20 pb-28">
        <div className="max-w-xl mx-auto w-full px-4 pt-2">
          {/* Top Bar Actions */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => onNavigate?.('pemindai_rfid_siaga')}
              className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#e7eeff] text-[#111c2d] hover:bg-[#dee8ff] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="text-xs font-bold">Scanner RFID</span>
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8df5e4]/40 text-[#007165]">
              <span className="w-2 h-2 rounded-full bg-[#006b5f] animate-pulse"></span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Input Manual Siaga</span>
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-[#111c2d]">Ketik No. Eartag</h1>
            <p className="text-xs font-medium text-[#41493e]">Rembangan Dairy Farm • Database 35 Ekor Terverifikasi</p>
          </div>

          {/* Input Display Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee8ff]/50 mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-extrabold text-[#41493e] uppercase tracking-wider">
                Nomor Eartag atau ID Ternak
              </label>
              <span className="text-[11px] font-bold text-[#006b5f] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">tune</span> ISO 11784/85
              </span>
            </div>

            <div className="relative flex items-center bg-[#f0f3ff] rounded-xl p-2.5">
              <span className="material-symbols-outlined text-[#00450d] text-[26px] ml-1">sell</span>
              <div className="flex-1 px-2.5 font-bold text-lg md:text-xl text-[#00450d] tracking-wider font-mono select-all flex items-center overflow-x-auto whitespace-nowrap">
                <span>{eartag}</span>
                <span className="inline-block w-0.5 h-5 bg-[#00450d] ml-1 animate-[pulse_1s_infinite]"></span>
              </div>
              <button
                onClick={handleClear}
                aria-label="Hapus nomor eartag"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#41493e] hover:text-[#ba1a1a] hover:bg-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">cancel</span>
              </button>
            </div>

            {/* Quick Preset Chips */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setEartag('360-001928472910')}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full font-bold text-xs transition-transform active:scale-95 flex items-center gap-1 ${
                  eartag === '360-001928472910'
                    ? 'bg-[#1b5e20] text-[#acf4a4]'
                    : 'bg-[#e7eeff] text-[#41493e] hover:bg-[#dee8ff]'
                }`}
              >
                {eartag === '360-001928472910' && (
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                )}
                Allflex (360-xxx)
              </button>

              <button
                onClick={() => setEartag('360-001928472910')}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#e7eeff] text-[#41493e] hover:bg-[#dee8ff] font-bold text-xs active:scale-95 transition-transform"
              >
                ID #12 (Melati)
              </button>

              <button
                onClick={() => {
                  setEartag('360-001928472907');
                  onNavigate?.('ketik_eartag_sapi07');
                }}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#e7eeff] text-[#41493e] hover:bg-[#dee8ff] font-bold text-xs active:scale-95 transition-transform"
              >
                ID #07 (Cantik)
              </button>

              <button
                onClick={() => setEartag('360-001928472910')}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#e7eeff] text-[#41493e] hover:bg-[#dee8ff] font-bold text-xs active:scale-95 transition-transform"
              >
                Stall 14 (Line Sore)
              </button>
            </div>
          </div>

          {/* Matched Cow Card */}
          {matchedCow ? (
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#acf4a4] text-[#002203]">
                  <span className="material-symbols-outlined text-[16px] text-[#00450d]">verified</span>
                  <span className="text-[11px] font-extrabold">1 Ternak Ditemukan Cocok (100% Match)</span>
                </div>
                <span className="text-[11px] font-bold text-[#41493e]">Line Sore A</span>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#dee8ff]/50">
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#e7eeff] shrink-0 border border-slate-100">
                      <img
                        className="w-full h-full object-cover"
                        src={matchedCow.image}
                        alt={`Sapi ${matchedCow.name}`}
                      />
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-white/95 text-[10px] font-bold font-mono text-[#00450d] shadow-xs">
                        {matchedCow.id}
                      </span>
                    </div>

                    <div className="flex flex-col flex-1 min-w-0 justify-center">
                      <h2 className="font-bold text-base md:text-lg text-[#111c2d] leading-tight truncate">
                        {matchedCow.name}
                      </h2>
                      <p className="text-xs text-[#41493e] mt-0.5">
                        {matchedCow.breed} • {matchedCow.gender} • {matchedCow.age} • {matchedCow.lactation}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-[#41493e]">
                        <span className="material-symbols-outlined text-[16px] text-[#006b5f]">memory</span>
                        <span className="text-xs font-mono font-semibold text-[#111c2d] truncate">
                          {matchedCow.rfid}
                        </span>
                      </div>
                    </div>
                  </div>

                  {matchedCow.warning && (
                    <div className="rounded-xl bg-[#ffdbcf]/60 border border-[#ffb59a]/50 text-[#380d00] p-3 flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[20px] text-[#933100] shrink-0 mt-0.5">
                        warning
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#6c2200] leading-tight">{matchedCow.warning.title}</p>
                        <p className="text-[11px] text-[#802a00] mt-0.5 leading-relaxed">
                          {matchedCow.warning.desc}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 py-1">
                    <div className="bg-[#f0f3ff] rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] font-semibold text-[#41493e]">Posisi Stall</span>
                      <span className="text-sm font-bold text-[#111c2d] mt-0.5 truncate">{matchedCow.stall}</span>
                    </div>
                    <div className="bg-[#f0f3ff] rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] font-semibold text-[#41493e]">Bobot Badan</span>
                      <span className="text-sm font-bold text-[#111c2d] mt-0.5">{matchedCow.weight}</span>
                    </div>
                    <div className="bg-[#f0f3ff] rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] font-semibold text-[#41493e]">Susu Kemarin</span>
                      <span className="text-sm font-bold text-[#00450d] mt-0.5">{matchedCow.yesterdayMilk}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate?.('deteksi_mastitis_cnn_inspeksi')}
                    className="w-full py-3.5 px-4 rounded-full bg-[#1b5e20] text-white font-bold text-sm shadow-md hover:bg-[#00450d] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                    <span>Pilih Sapi Ini & Buka Kamera YOLO v26</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-dashed border-[#c0c9bb] mb-4">
              <span className="material-symbols-outlined text-4xl text-[#717a6d]">search_off</span>
              <p className="text-sm font-bold text-[#111c2d] mt-2">Tidak Ada Data Ternak</p>
              <p className="text-xs text-[#41493e] mt-1">
                Ketik nomor eartag lengkap atau pilih salah satu sapi prioritas di bawah.
              </p>
            </div>
          )}

          {/* Prioritas Sapi Sore Ini */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#41493e] uppercase tracking-wider">
                Pencarian Prioritas Sore Ini
              </span>
              <span className="text-[11px] font-bold text-[#006b5f]">Jadwal Perah 15:30</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setEartag('360-001928472907');
                  onNavigate?.('ketik_eartag_sapi07');
                }}
                className="bg-white rounded-xl p-2.5 flex flex-col items-start gap-1 text-left shadow-xs border border-slate-100 hover:bg-[#dee8ff]/30 transition-colors"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-[#111c2d]">#07 Cantik</span>
                  <span className="w-2 h-2 rounded-full bg-[#006b5f]"></span>
                </div>
                <span className="text-[10px] text-[#41493e]">Line 05 • Peak</span>
                <span className="text-[10px] font-mono font-bold text-[#00450d] truncate w-full">...72907</span>
              </button>

              <button
                onClick={() => setEartag('360-001928472918')}
                className="bg-white rounded-xl p-2.5 flex flex-col items-start gap-1 text-left shadow-xs border border-slate-100 hover:bg-[#dee8ff]/30 transition-colors"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-[#111c2d]">#18 Sekar</span>
                  <span className="w-2 h-2 rounded-full bg-[#91d78a]"></span>
                </div>
                <span className="text-[10px] text-[#41493e]">Line 04 • Lakt-1</span>
                <span className="text-[10px] font-mono font-bold text-[#00450d] truncate w-full">...72918</span>
              </button>

              <button
                onClick={() => {
                  setEartag('360-001928472904');
                  onNavigate?.('profil_sapi');
                }}
                className="bg-white rounded-xl p-2.5 flex flex-col items-start gap-1 text-left shadow-xs border border-slate-100 hover:bg-[#dee8ff]/30 transition-colors"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-[#111c2d]">#04 Mawar</span>
                  <span className="w-2 h-2 rounded-full bg-[#6c2200]"></span>
                </div>
                <span className="text-[10px] text-[#41493e]">Kandang A • Pasca</span>
                <span className="text-[10px] font-mono font-bold text-[#00450d] truncate w-full">...72904</span>
              </button>
            </div>
          </div>

          {/* Virtual Numeric Keypad */}
          <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-[#dee8ff]/50 mb-2">
            <div className="grid grid-cols-3 gap-1.5 mb-1.5">
              {['1', '2', '3'].map(num => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="h-11 rounded-xl bg-[#f0f3ff] text-[#111c2d] font-bold text-lg font-mono hover:bg-[#dee8ff] active:scale-95 transition-all flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5 mb-1.5">
              {['4', '5', '6'].map(num => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="h-11 rounded-xl bg-[#f0f3ff] text-[#111c2d] font-bold text-lg font-mono hover:bg-[#dee8ff] active:scale-95 transition-all flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5 mb-1.5">
              {['7', '8', '9'].map(num => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="h-11 rounded-xl bg-[#f0f3ff] text-[#111c2d] font-bold text-lg font-mono hover:bg-[#dee8ff] active:scale-95 transition-all flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleKeyPress('-')}
                className="h-11 rounded-xl bg-[#e7eeff] text-[#41493e] font-bold text-lg font-mono hover:bg-[#dee8ff] active:scale-95 transition-all flex items-center justify-center"
              >
                -
              </button>
              <button
                onClick={() => handleKeyPress('0')}
                className="h-11 rounded-xl bg-[#f0f3ff] text-[#111c2d] font-bold text-lg font-mono hover:bg-[#dee8ff] active:scale-95 transition-all flex items-center justify-center"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                aria-label="Hapus digit terakhir"
                className="h-11 rounded-xl bg-[#e7eeff] text-[#111c2d] hover:bg-[#dee8ff] active:scale-95 transition-all flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[22px]">backspace</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#f9f9ff]/90 backdrop-blur-xl border-t border-[#dee8ff]/60 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
          <button
            onClick={() => onNavigate?.('kandang_recovery')}
            className="flex flex-col items-center justify-center gap-1 text-[#41493e] hover:text-[#00450d] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">dashboard</span>
            <span className="text-[10px] font-bold">Kandang</span>
          </button>
          <button
            onClick={() => onNavigate?.('pemindai_rfid_siaga')}
            className="flex flex-col items-center justify-center gap-1 text-[#00450d]"
          >
            <span className="material-symbols-outlined text-[22px] font-variation-fill">sensors</span>
            <span className="text-[10px] font-extrabold">RFID & AI</span>
          </button>
          <button
            onClick={() => onNavigate?.('prediksi_laktasi_sapi07')}
            className="flex flex-col items-center justify-center gap-1 text-[#41493e] hover:text-[#00450d] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">psychology</span>
            <span className="text-[10px] font-bold">Nutrisi</span>
          </button>
          <button
            onClick={() => onNavigate?.('buku_kas')}
            className="flex flex-col items-center justify-center gap-1 text-[#41493e] hover:text-[#00450d] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">payments</span>
            <span className="text-[10px] font-bold">Kas Mikro</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default KetikManualEartag;
