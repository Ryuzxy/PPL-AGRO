import { useState } from 'react';
import type { ScreenType } from '../App.tsx';

interface CatatPengobatanMastitisProps {
  onNavigate?: (screen: ScreenType) => void;
  defaultDose?: number; // 1, 2, or 3
  cowTag?: string;
  cowName?: string;
}

export default function CatatPengobatanMastitis({
  onNavigate,
  defaultDose = 2,
  cowTag = '04',
  cowName = 'Mawar',
}: CatatPengobatanMastitisProps) {
  const [selectedDose, setSelectedDose] = useState<number>(defaultDose);
  const [operator, setOperator] = useState('Pak Hafid (Mantri Ternak)');
  const [medicine, setMedicine] = useState('Mastijet Forte / Cefa-Lak (10ml)');
  const [batchCode] = useState('LOT: CFQ-202503-A');
  const [checklist, setChecklist] = useState({
    perah: true,
    alkohol: true,
    infusi: true,
    dipping: true,
  });

  const [activeChips, setActiveChips] = useState<string[]>([
    'Ambing Lembut & Kenyal Normal',
    'Suhu Normal (38.5°C)',
    'Susu Bersih Tanpa Flakes',
    'Sapi Sangat Tenang & Lahap',
  ]);

  const [vetNotes, setVetNotes] = useState(
    'Ambing RL menunjukkan penurunan bengkak drastis. Susu bersih tanpa flokulasi. Nafsu makan normal.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleChip = (chip: string) => {
    setActiveChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (completedCount < 4) {
      showToast('Harap selesaikan seluruh 4 langkah SOP terlebih dahulu!');
      return;
    }
    setIsSubmitting(true);
    showToast(`Dosis Tube ${selectedDose}/3 berhasil disimpan ke Rekam Medis Sapi #${cowTag}!`);
    setTimeout(() => {
      setIsSubmitting(false);
      onNavigate?.('profil_sapi');
    }, 1200);
  };

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#263143] text-[#ecf1ff] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm z-50 animate-bounce">
          <span className="material-symbols-outlined text-[#8df5e4] text-[18px]">verified</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff] px-4 py-3 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate?.('profil_sapi')}
              className="w-10 h-10 rounded-full bg-white border border-[#dee8ff] flex items-center justify-center text-[#111c2d] hover:bg-[#f0f3ff] transition-transform active:scale-95 shadow-xs"
              title="Kembali"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-[#111c2d]">Catat Terapi Intramammar</h1>
              <span className="text-xs text-[#006b5f] font-semibold">
                Sapi #{cowTag} ({cowName}) • SOP Bebas Residu
              </span>
            </div>
          </div>

          <span className="text-xs font-bold text-[#1b5e20] bg-[#acf4a4]/40 px-2.5 py-1 rounded-full">
            Dosis {selectedDose}/3
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-20 pb-28 flex flex-col gap-4">
        {/* Dose Progress Picker */}
        <div className="bg-white rounded-2xl p-4 border border-[#dee8ff] shadow-xs">
          <span className="text-xs font-bold text-[#717a6d] uppercase tracking-wider block mb-2">
            Tahap Dosis Salep (Protokol 3 Hari):
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedDose(1)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedDose === 1
                  ? 'border-[#1b5e20] bg-[#acf4a4]/30 text-[#00450d] font-black shadow-xs'
                  : 'border-[#dee8ff] bg-[#f9f9ff] text-[#41493e]'
              }`}
            >
              <span className="text-xs block">Hari 1</span>
              <span className="text-[10px] font-semibold">Tube 1/3 (Inisiasi)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDose(2)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedDose === 2
                  ? 'border-[#1b5e20] bg-[#acf4a4]/30 text-[#00450d] font-black shadow-xs'
                  : 'border-[#dee8ff] bg-[#f9f9ff] text-[#41493e]'
              }`}
            >
              <span className="text-xs block">Hari 2</span>
              <span className="text-[10px] font-semibold">Tube 2/3 (Lanjutan)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDose(3)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedDose === 3
                  ? 'border-[#1b5e20] bg-[#acf4a4]/30 text-[#00450d] font-black shadow-xs'
                  : 'border-[#dee8ff] bg-[#f9f9ff] text-[#41493e]'
              }`}
            >
              <span className="text-xs block">Hari 3</span>
              <span className="text-[10px] font-semibold">Tube 3/3 (Pamungkas)</span>
            </button>
          </div>
        </div>

        {/* Medicine & Operator Info */}
        <div className="bg-white rounded-2xl p-4 border border-[#dee8ff] shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#f0f3ff] pb-2">
            <span className="text-xs font-bold text-[#111c2d] uppercase tracking-wider">Informasi Obat &amp; Petugas</span>
            <span className="text-[10px] font-mono text-[#006b5f] bg-[#8df5e4]/30 px-2 py-0.5 rounded-md">{batchCode}</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-[#41493e] block mb-1">Nama Sediaan Salep</label>
              <input
                type="text"
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-[#dee8ff] bg-[#f9f9ff] font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#41493e] block mb-1">Petugas / Operator</label>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-[#dee8ff] bg-[#f9f9ff] font-medium"
              />
            </div>
          </div>
        </div>

        {/* SOP Checklist */}
        <div className="bg-white rounded-2xl p-5 border border-[#dee8ff] shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#111c2d] uppercase tracking-wider">
              Langkah SOP Wajib Dilakukan
            </span>
            <span className="text-xs font-mono font-bold text-[#006b5f]">{completedCount}/4 Selesai</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#f9f9ff] border border-[#dee8ff] cursor-pointer hover:bg-[#f0f3ff]">
              <input
                type="checkbox"
                checked={checklist.perah}
                onChange={() => toggleCheck('perah')}
                className="w-4 h-4 rounded-md accent-[#1b5e20]"
              />
              <span className="text-xs font-semibold text-[#111c2d]">
                1. Perah tuntas susu dari kuartir radang sebelum infusi
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#f9f9ff] border border-[#dee8ff] cursor-pointer hover:bg-[#f0f3ff]">
              <input
                type="checkbox"
                checked={checklist.alkohol}
                onChange={() => toggleCheck('alkohol')}
                className="w-4 h-4 rounded-md accent-[#1b5e20]"
              />
              <span className="text-xs font-semibold text-[#111c2d]">
                2. Bersihkan ujung puting dengan kapas alkohol 70%
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#f9f9ff] border border-[#dee8ff] cursor-pointer hover:bg-[#f0f3ff]">
              <input
                type="checkbox"
                checked={checklist.infusi}
                onChange={() => toggleCheck('infusi')}
                className="w-4 h-4 rounded-md accent-[#1b5e20]"
              />
              <span className="text-xs font-semibold text-[#111c2d]">
                3. Masukkan kanula salep dan tekan perlahan hingga habis
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#f9f9ff] border border-[#dee8ff] cursor-pointer hover:bg-[#f0f3ff]">
              <input
                type="checkbox"
                checked={checklist.dipping}
                onChange={() => toggleCheck('dipping')}
                className="w-4 h-4 rounded-md accent-[#1b5e20]"
              />
              <span className="text-xs font-semibold text-[#111c2d]">
                4. Pijat ke atas (stripping) &amp; celup puting antiseptik (Post-Dipping)
              </span>
            </label>
          </div>
        </div>

        {/* Clinical Observations */}
        <div className="bg-white rounded-2xl p-5 border border-[#dee8ff] shadow-xs flex flex-col gap-3">
          <span className="text-xs font-bold text-[#111c2d] uppercase tracking-wider">
            Observasi Fisik Ambing Saat Aplikasi
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              'Ambing Lembut & Kenyal Normal',
              'Suhu Normal (38.5°C)',
              'Susu Bersih Tanpa Flakes',
              'Sapi Sangat Tenang & Lahap',
              'Bengkak Berkurang 70%',
              'Tidak Ada Rasa Sakit Ekstrem',
            ].map((chip) => {
              const active = activeChips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleChip(chip)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#1b5e20] text-white shadow-xs'
                      : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          <div className="mt-2">
            <label className="text-[11px] font-semibold text-[#41493e] block mb-1">Catatan Mantri Ternak:</label>
            <textarea
              rows={3}
              value={vetNotes}
              onChange={(e) => setVetNotes(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-[#dee8ff] bg-[#f9f9ff] focus:outline-none focus:border-[#1b5e20]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 px-4 rounded-xl bg-[#1b5e20] hover:bg-[#00450d] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Menyimpan ke Rekam Medis...</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">save</span>
              <span>Simpan Catatan Terapi Tube {selectedDose}/3</span>
            </>
          )}
        </button>
      </main>
    </div>
  );
}
