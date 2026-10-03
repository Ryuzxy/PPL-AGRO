import React, { useState } from 'react';

interface SimulasiPakanWhatIfProps {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
  cowName?: string;
  cowTag?: string;
}

export const SimulasiPakanWhatIf: React.FC<SimulasiPakanWhatIfProps> = ({
  onBack,
  onNavigate,
  cowName = 'Melati',
  cowTag = '12',
}) => {
  const [konsentrat, setKonsentrat] = useState<number>(7.5);
  const [rumput, setRumput] = useState<number>(36.0);
  const [silase, setSilase] = useState<number>(9.0);
  const [ampas, setAmpas] = useState<number>(3.0);
  const [buffer, setBuffer] = useState<number>(180);
  const [activePreset, setActivePreset] = useState<'booster' | 'efficiency' | 'rumenSafe' | 'custom'>('custom');
  
  // Modal / Execution state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isAppliedSuccess, setIsAppliedSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Economic Baseline
  const baselineMilk = 21.4;
  const baselineCost = 48500;
  const baselineIofc = baselineMilk * 7000 - baselineCost;

  // Impact on milk prediction (XGBoost approximation)
  const milkPred = Number(
    (
      baselineMilk +
      (konsentrat - 6.5) * 0.85 +
      (silase - 8.0) * 0.25 +
      (ampas - 0.0) * 0.15 -
      Math.max(0, 38.0 - rumput) * 0.08
    ).toFixed(1)
  );

  const feedCost = Math.round(
    konsentrat * 4200 + rumput * 400 + silase * 950 + ampas * 600 + buffer * 15
  );

  const revenue = Math.round(milkPred * 7000);
  const iofc = revenue - feedCost;
  const iofcDiff = iofc - baselineIofc;
  const milkDiff = Number((milkPred - baselineMilk).toFixed(1));

  // Forage vs Concentrate Ratio
  const totalForage = rumput + silase;
  const totalConc = konsentrat + ampas;
  const totalRation = totalForage + totalConc || 1;
  const foragePct = Math.round((totalForage / totalRation) * 100);
  const concPct = 100 - foragePct;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const applyPreset = (preset: 'booster' | 'efficiency' | 'rumenSafe') => {
    setActivePreset(preset);
    if (preset === 'booster') {
      setKonsentrat(8.5);
      setRumput(34.0);
      setSilase(11.0);
      setAmpas(4.0);
      setBuffer(200);
      showToast('Preset Booster Produksi: Target +2.5L Susu / Hari');
    } else if (preset === 'efficiency') {
      setKonsentrat(6.0);
      setRumput(40.0);
      setSilase(8.0);
      setAmpas(2.5);
      setBuffer(150);
      showToast('Preset Efisiensi Hemat Biaya: Memaksimalkan Marjin IOFC');
    } else {
      setKonsentrat(6.8);
      setRumput(38.0);
      setSilase(10.0);
      setAmpas(3.0);
      setBuffer(220);
      showToast('Preset Rumen-Safe: Mencegah Asidosis Subakut');
    }
  };

  const handleConfirmApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setIsAppliedSuccess(true);
    }, 1200);
  };

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] flex flex-col min-h-screen antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#263143] text-[#ecf1ff] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm z-50 animate-bounce">
          <span className="material-symbols-outlined text-[#8df5e4] text-[18px]">tune</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff] px-4 py-3 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack || (() => onNavigate?.('prediksi'))}
              className="w-10 h-10 rounded-full bg-white border border-[#dee8ff] flex items-center justify-center text-[#111c2d] hover:bg-[#f0f3ff] transition-transform active:scale-95 shadow-xs"
              title="Kembali"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-[#111c2d]">Simulasi Pakan (What-If)</h1>
              <span className="text-xs text-[#006b5f] font-semibold">
                Sapi #{cowTag} ({cowName}) • XGBoost Nutrition Model
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#002203]">
            What-If Engine
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-20 pb-32 flex flex-col gap-4">
        {/* Preset Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => applyPreset('booster')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activePreset === 'booster' ? 'bg-[#1b5e20] text-white shadow-xs' : 'bg-white border border-[#dee8ff] text-[#41493e]'
            }`}
          >
            🚀 Booster Susu (+2.5L)
          </button>
          <button
            onClick={() => applyPreset('efficiency')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activePreset === 'efficiency' ? 'bg-[#1b5e20] text-white shadow-xs' : 'bg-white border border-[#dee8ff] text-[#41493e]'
            }`}
          >
            💰 Hemat Biaya (Max IOFC)
          </button>
          <button
            onClick={() => applyPreset('rumenSafe')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activePreset === 'rumenSafe' ? 'bg-[#1b5e20] text-white shadow-xs' : 'bg-white border border-[#dee8ff] text-[#41493e]'
            }`}
          >
            🛡️ Rumen-Safe (pH Normal)
          </button>
        </div>

        {/* Prediction Results Banner */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-3.5 rounded-2xl border border-[#dee8ff] shadow-xs text-center">
            <span className="text-[10px] text-[#717a6d] font-bold uppercase block">Prediksi Susu</span>
            <span className="text-xl font-black text-[#00450d]">{milkPred} L</span>
            <span className={`text-[10px] font-bold ${milkDiff >= 0 ? 'text-[#006b5f]' : 'text-[#ba1a1a]'}`}>
              {milkDiff >= 0 ? `+${milkDiff} L` : `${milkDiff} L`} vs base
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#dee8ff] shadow-xs text-center">
            <span className="text-[10px] text-[#717a6d] font-bold uppercase block">Biaya Pakan</span>
            <span className="text-sm font-extrabold text-[#ba1a1a] mt-1 block">Rp {feedCost.toLocaleString('id-ID')}</span>
            <span className="text-[10px] text-[#717a6d]">per hari/ekor</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#dee8ff] shadow-xs text-center">
            <span className="text-[10px] text-[#717a6d] font-bold uppercase block">Marjin IOFC</span>
            <span className="text-sm font-extrabold text-[#007165] mt-1 block">Rp {iofc.toLocaleString('id-ID')}</span>
            <span className={`text-[10px] font-bold ${iofcDiff >= 0 ? 'text-[#006b5f]' : 'text-[#ba1a1a]'}`}>
              {iofcDiff >= 0 ? `+Rp ${iofcDiff.toLocaleString('id-ID')}` : `-Rp ${Math.abs(iofcDiff).toLocaleString('id-ID')}`}
            </span>
          </div>
        </div>

        {/* Interactive Sliders Form */}
        <div className="bg-white rounded-2xl p-5 border border-[#dee8ff] shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#f0f3ff] pb-3">
            <span className="text-xs font-bold text-[#111c2d] uppercase tracking-wider">Komposisi Pakan Harian</span>
            <span className="text-xs font-mono font-bold text-[#006b5f]">
              Hijauan {foragePct}% : Konsentrat {concPct}%
            </span>
          </div>

          {/* Konsentrat Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Konsentrat Pelet (18% PK)</span>
              <span className="text-[#00450d] font-mono">{konsentrat} kg</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="11.0"
              step="0.5"
              value={konsentrat}
              onChange={(e) => {
                setKonsentrat(parseFloat(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full accent-[#1b5e20]"
            />
          </div>

          {/* Rumput Gajah Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Rumput Gajah / Odot</span>
              <span className="text-[#00450d] font-mono">{rumput} kg</span>
            </div>
            <input
              type="range"
              min="25.0"
              max="50.0"
              step="1.0"
              value={rumput}
              onChange={(e) => {
                setRumput(parseFloat(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full accent-[#1b5e20]"
            />
          </div>

          {/* Silase Jagung Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Silase Jagung Fermentasi</span>
              <span className="text-[#00450d] font-mono">{silase} kg</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="16.0"
              step="0.5"
              value={silase}
              onChange={(e) => {
                setSilase(parseFloat(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full accent-[#1b5e20]"
            />
          </div>

          {/* Ampas Tahu Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Ampas Tahu Segar</span>
              <span className="text-[#00450d] font-mono">{ampas} kg</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="8.0"
              step="0.5"
              value={ampas}
              onChange={(e) => {
                setAmpas(parseFloat(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full accent-[#1b5e20]"
            />
          </div>

          {/* Premiks Mineral */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Premiks Mineral &amp; Buffer Rumen</span>
              <span className="text-[#00450d] font-mono">{buffer} gram</span>
            </div>
            <input
              type="range"
              min="100"
              max="300"
              step="10"
              value={buffer}
              onChange={(e) => {
                setBuffer(parseInt(e.target.value, 10));
                setActivePreset('custom');
              }}
              className="w-full accent-[#1b5e20]"
            />
          </div>
        </div>

        {/* Action Button: Terapkan Formula */}
        <button
          onClick={() => setShowApplyModal(true)}
          className="w-full py-4 px-4 rounded-xl bg-[#1b5e20] hover:bg-[#00450d] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
          <span>Terapkan Formula Pakan Ini ke Kandang</span>
        </button>
      </main>

      {/* Confirmation & Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 text-center animate-in fade-in zoom-in-95 duration-200">
            {!isAppliedSuccess ? (
              <>
                <div className="w-14 h-14 rounded-full bg-[#e7eeff] text-[#00450d] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[32px]">soup_kitchen</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-[#111c2d]">Terapkan Formula Pakan?</h3>
                  <p className="text-xs text-[#41493e] mt-1">
                    Formula ini akan dikirim ke tim pakan kandang untuk Sapi #{cowTag} ({cowName}) dengan takaran:{' '}
                    <strong>{konsentrat} kg Konsentrat</strong>, <strong>{rumput} kg Rumput</strong>,{' '}
                    <strong>{silase} kg Silase</strong>.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 py-3 rounded-xl border border-[#dee8ff] text-[#41493e] font-bold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmApply}
                    disabled={isApplying}
                    className="flex-1 py-3 rounded-xl bg-[#1b5e20] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {isApplying ? 'Menerapkan...' : 'Ya, Terapkan!'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-[#acf4a4] text-[#002203] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[32px]">check_circle</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-[#111c2d]">Formula Berhasil Diterapkan!</h3>
                  <p className="text-xs text-[#006b5f] font-semibold mt-1">
                    Instruksi ransum telah dikirim ke Line Pakan. Estimasi kenaikan produksi susu: +{milkDiff} L/hari.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowApplyModal(false);
                    setIsAppliedSuccess(false);
                    onNavigate?.('prediksi');
                  }}
                  className="w-full py-3 rounded-xl bg-[#1b5e20] text-white font-bold text-xs shadow-sm"
                >
                  Kembali ke Prediksi Laktasi
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulasiPakanWhatIf;
