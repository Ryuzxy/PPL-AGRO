import { useState, useEffect } from 'react';
import type { ScreenType } from '../App.tsx';
import { supabase } from '../lib/supabase';

import { useCows } from '../hooks/useSupabaseData';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../components/Navigation';

interface SesiPemerahanSusuProps {
  onNavigate?: (screen: ScreenType) => void;
  defaultCowId?: string;
}

export default function SesiPemerahanSusu({ onNavigate, defaultCowId = '18' }: SesiPemerahanSusuProps) {
  const [sessionTime, setSessionTime] = useState<'pagi' | 'sore'>('sore');
  const [selectedCowId, setSelectedCowId] = useState(defaultCowId);
  const [inputMode, setInputMode] = useState<'alat' | 'manual'>('alat');
  const [manualVolume, setManualVolume] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [volume, setVolume] = useState(0);
  const [flowRate, setFlowRate] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [temperature] = useState(38.4);
  const [conductivity] = useState(5.2);
  const [isFinished, setIsFinished] = useState(false);
  const [isPulsatorStopped, setIsPulsatorStopped] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { cows } = useCows();

  // Dynamic cows catalog from Supabase
  const parlorSlots = cows.length > 0 
    ? cows.map((c, idx) => ({
        id: c.id.replace('#', ''),
        rawId: c.rawId,
        line: c.stall || `Line 0${idx + 1}`,
        name: c.name,
        breed: c.breed,
        target: `${c.milkYield || 12} L`
      }))
    : [
        { id: '18', rawId: 4, line: 'Line 04', name: 'Sekar', breed: 'FH Laktasi-2', target: '13.5 L' },
        { id: '07', rawId: 2, line: 'Line 05', name: 'Cantik', breed: 'FH Murni', target: '14.8 L' },
        { id: '12', rawId: 3, line: 'Line 02', name: 'Melati', breed: 'FH Cross', target: '11.0 L' },
        { id: '04', rawId: 1, line: 'Line 01', name: 'Mawar', breed: 'FH Laktasi-1', target: '16.8 L' },
      ];

  const currentCow = parlorSlots.find((c) => c.id === selectedCowId) || parlorSlots[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  useEffect(() => {
    if (!isStarted || isFinished || isPulsatorStopped) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
      setVolume((prev) => +(prev + 0.02).toFixed(2));
      // subtle fluctuations for realism
      setFlowRate(+(2.1 + Math.random() * 0.4).toFixed(1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isStarted, isFinished, isPulsatorStopped]);

  const formatTimer = (totalSeconds: number) => {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `00:${mins}:${secs}`;
  };

  const handleTogglePulsator = () => {
    setIsPulsatorStopped((prev) => {
      const next = !prev;
      showToast(next ? 'Vakum pulsator dihentikan sementara' : 'Vakum pulsator dinyalakan kembali');
      return next;
    });
  };

  const handleFinish = async () => {
    const recordedVolume = inputMode === 'manual' ? Number(manualVolume) : volume;
    if (!Number.isFinite(recordedVolume) || recordedVolume <= 0) {
      showToast('Masukkan jumlah susu lebih dari 0 liter.');
      return;
    }
    setVolume(Number(recordedVolume.toFixed(2)));
    setIsFinished(true);
    showToast(`Pemerahan Sapi #${currentCow.id} (${recordedVolume} L) selesai! Menyimpan data ke Supabase...`);

    const rawSapiId = (currentCow as any)?.rawId || (currentCow.id === '04' ? 1 : currentCow.id === '07' ? 2 : currentCow.id === '12' ? 3 : currentCow.id === '18' ? 4 : currentCow.id === '21' ? 5 : 6);

    try {
      // 1. Simpan catatan hasil perah ke Supabase
      await supabase.from('histori_produksi_susu').insert({
        sapi_id: rawSapiId,
        jumlah_liter: recordedVolume,
        sesi: sessionTime,
        suhu_susu: temperature,
        konduktivitas: conductivity,
        kualitas_grade: 'A',
      });

      // 2. Simpan setoran pemasukan susu ke Supabase
      await supabase.from('pemasukan').insert({
        sapi_id: rawSapiId,
        kategori: 'Penjualan Susu KUD',
        jumlah: Math.round(recordedVolume * 7000),
        volume_liter: recordedVolume,
        keterangan: `Setoran Susu ${sessionTime === 'pagi' ? 'Pagi' : 'Sore'} Sapi #${currentCow.id} (${currentCow.name})`,
        tanggal: new Date().toISOString().split('T')[0]
      });

      showToast(`Data perah & kas setoran Rp ${Math.round(recordedVolume * 7000).toLocaleString('id-ID')} tersimpan di Supabase!`);
    } catch (e) {
      console.warn('Logging to Supabase skipped:', e);
    }

    setTimeout(() => {
      onNavigate?.('buku_kas_mikro_mowtitis');
    }, 1200);
  };

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen flex flex-col lg:flex-row antialiased">
      <DesktopSidebar currentScreen="pemerahan" onNavigate={onNavigate} />
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentScreen="pemerahan"
        onNavigate={onNavigate}
      />
      <div className="flex-1 lg:pl-72 w-full flex flex-col">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#263143] text-[#ecf1ff] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm z-50 animate-bounce">
          <span className="material-symbols-outlined text-[#8df5e4] text-[18px]">water_drop</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 w-full z-30 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff] px-4 py-3 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full bg-white border border-[#dee8ff] flex items-center justify-center text-[#111c2d] hover:bg-[#f0f3ff] transition-transform active:scale-95 shadow-xs"
              title="Buka menu"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-[#111c2d]">Sesi Pemerahan Susu</h1>
              <span className="text-xs text-[#006b5f] font-semibold">
                Milk Parlor Otomatis • {sessionTime === 'pagi' ? 'Shift Pagi (05:00)' : 'Shift Sore (15:30)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#dee8ff]/60 p-1 rounded-full">
            <button
              onClick={() => setSessionTime('pagi')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                sessionTime === 'pagi' ? 'bg-[#1b5e20] text-white shadow-xs' : 'text-[#41493e]'
              }`}
            >
              Pagi
            </button>
            <button
              onClick={() => setSessionTime('sore')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                sessionTime === 'sore' ? 'bg-[#1b5e20] text-white shadow-xs' : 'text-[#41493e]'
              }`}
            >
              Sore
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-5 pb-28 flex flex-col gap-4">
        {/* Parlor Slot Quick Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {parlorSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => setSelectedCowId(slot.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCowId === slot.id
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'bg-white border border-[#dee8ff] text-[#41493e] hover:bg-[#f0f3ff]'
              }`}
            >
              <span>{slot.line}:</span>
              <span>#{slot.id} {slot.name}</span>
            </button>
          ))}
        </div>

        {/* Milking input mode */}
        <div className="bg-white rounded-2xl p-4 border border-[#dee8ff] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717a6d]">Metode Pencatatan Susu</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => setInputMode('alat')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${inputMode === 'alat' ? 'bg-[#1b5e20] text-white' : 'bg-[#f0f3ff] text-[#41493e]'}`}
            >
              Pakai Alat Pemerahan
            </button>
            <button
              onClick={() => setInputMode('manual')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${inputMode === 'manual' ? 'bg-[#1b5e20] text-white' : 'bg-[#f0f3ff] text-[#41493e]'}`}
            >
              Input Manual
            </button>
          </div>
          {inputMode === 'manual' && (
            <label className="block mt-3 text-xs font-semibold text-[#41493e]">
              Jumlah susu hasil perahan (liter)
              <input
                type="number"
                min="0"
                step="0.01"
                value={manualVolume}
                onChange={(event) => setManualVolume(event.target.value)}
                placeholder="Contoh: 12.5"
                className="mt-1 w-full rounded-xl border border-[#dee8ff] bg-[#f9f9ff] px-3 py-2.5 text-sm font-bold outline-none focus:border-[#1b5e20]"
              />
            </label>
          )}
        </div>

        {/* Live Cow Info Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#dee8ff] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#00450d] text-[#8df5e4] flex items-center justify-center font-black text-base shadow-xs">
              #{currentCow.id}
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-[#111c2d]">{currentCow.name}</span>
              <span className="text-[11px] text-[#41493e]">{currentCow.breed} • {currentCow.line}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#717a6d] font-bold block">Target Perahan</span>
            <span className="text-sm font-extrabold text-[#006b5f]">{currentCow.target}</span>
          </div>
        </div>

        {/* Central Telemetry Gauge */}
        <div className="bg-white rounded-3xl p-6 border border-[#dee8ff] shadow-sm text-center flex flex-col items-center">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#717a6d] mb-2">
            <span className={`w-2 h-2 rounded-full ${isStarted ? 'bg-[#ba1a1a] animate-ping' : 'bg-slate-300'}`}></span>
            {isStarted ? 'PEMERAHAN BERLANGSUNG' : 'SIAP DIMULAI'} • DURASI: {formatTimer(seconds)}
          </div>
          {!isStarted && (
            <button
              onClick={() => setIsStarted(true)}
              className="mb-3 px-5 py-2.5 rounded-full bg-[#1b5e20] text-white text-xs font-bold shadow-sm hover:bg-[#00450d] active:scale-95 transition-all"
            >
              Mulai Pemerahan
            </button>
          )}

          {/* Volume Big Counter */}
          <div className="my-2">
            <span className="text-5xl font-black text-[#00450d] tracking-tight">{volume}</span>
            <span className="text-xl font-bold text-[#41493e] ml-1.5">Liter</span>
          </div>

          <span className="text-xs font-semibold text-[#006b5f] bg-[#8df5e4]/40 px-3 py-1 rounded-full mb-6">
            {isStarted ? `Laju Aliran: ${flowRate} L/menit • Tekanan Vakum Stabil` : 'Tekanan vakum belum aktif'}
          </span>

          {/* Inline Physicochemical Sensors */}
          <div className="w-full grid grid-cols-2 gap-3 pt-4 border-t border-[#f0f3ff]">
            <div className="p-3 rounded-xl bg-[#f9f9ff] border border-[#dee8ff]">
              <span className="text-[10px] text-[#717a6d] font-bold uppercase block">Suhu Susu Segar</span>
              <span className="text-base font-black text-[#111c2d]">{temperature} °C</span>
              <span className="text-[10px] text-[#006b5f] font-semibold block">Normal (38.0 - 39.0)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#f9f9ff] border border-[#dee8ff]">
              <span className="text-[10px] text-[#717a6d] font-bold uppercase block">Konduktivitas Listrik</span>
              <span className="text-base font-black text-[#111c2d]">{conductivity} mS/cm</span>
              <span className="text-[10px] text-[#006b5f] font-semibold block">Sehat (&lt; 5.5 mS/cm)</span>
            </div>
          </div>
        </div>

        {/* Pulsator & Operational Controls */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleTogglePulsator}
            className={`py-3.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 ${
              isPulsatorStopped
                ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ffdad6]'
                : 'bg-white text-[#41493e] border-[#dee8ff] hover:bg-[#f0f3ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPulsatorStopped ? 'play_arrow' : 'pause'}
            </span>
            <span>{isPulsatorStopped ? 'Lanjutkan Vakum' : 'Hentikan Vakum'}</span>
          </button>

          <button
            onClick={handleFinish}
            disabled={!isStarted || isFinished}
            className="py-3.5 px-4 rounded-xl bg-[#1b5e20] hover:bg-[#00450d] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Selesai &amp; Catat Susu</span>
          </button>
        </div>
      </main>
      <MobileBottomNav activeScreen="pemerahan" onNavigate={onNavigate} />
      </div>
    </div>
  );
}
