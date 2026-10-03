import { useState } from 'react';
import type { ScreenType } from '../App.tsx';
import { useCashflow, useCows } from '../hooks/useSupabaseData';

interface FormulirInputKasProps {
  onNavigate?: (screen: ScreenType) => void;
  defaultTab?: 'pemasukan' | 'pengeluaran' | 'medis';
}

export default function FormulirInputKas({ onNavigate, defaultTab = 'pemasukan' }: FormulirInputKasProps) {
  const [activeTab, setActiveTab] = useState<'pemasukan' | 'pengeluaran' | 'medis'>(defaultTab);
  
  // Pemasukan state
  const [pemasukanCategory, setPemasukanCategory] = useState('Susu Segar (Koperasi)');
  const [volume, setVolume] = useState('54.0');
  const [pricePerLiter, setPricePerLiter] = useState(14000);
  
  // Pengeluaran Operasional state
  const [expenseCategory, setExpenseCategory] = useState('Pakan Konsentrat');
  const [expenseAmount, setExpenseAmount] = useState('245000');
  
  // Pengeluaran Medis state
  const [selectedCowId, setSelectedCowId] = useState('04');
  const [medicineName, setMedicineName] = useState('Salep Intramammar (Mastijet Forte / Cefa-Lak)');
  const [medicalCost, setMedicalCost] = useState('45000');
  const [dosage, setDosage] = useState('1 Tube (10ml)');

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addIncome, addExpense } = useCashflow();
  const { cows } = useCows();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (activeTab === 'pemasukan') {
        const nominal = Math.round((parseFloat(volume) || 0) * pricePerLiter);
        await addIncome({
          jumlah: nominal,
          kategori: pemasukanCategory,
          keterangan: notes || `Setoran ${volume}L @ Rp ${pricePerLiter.toLocaleString('id-ID')}`,
          volume_liter: parseFloat(volume) || undefined,
        });
        showToast(`Pemasukan Rp ${nominal.toLocaleString('id-ID')} berhasil tersimpan!`);
      } else if (activeTab === 'pengeluaran') {
        const nominal = parseInt(expenseAmount, 10) || 0;
        await addExpense({
          jumlah: nominal,
          kategori: expenseCategory,
          keterangan: notes || `Pengeluaran ${expenseCategory}`,
        });
        showToast(`Pengeluaran Rp ${nominal.toLocaleString('id-ID')} berhasil tersimpan!`);
      } else {
        // Medis
        const nominal = parseInt(medicalCost, 10) || 0;
        await addExpense({
          jumlah: nominal,
          kategori: 'Medis & Obat',
          keterangan: notes || `Obat: ${medicineName} (${dosage}) untuk Sapi #${selectedCowId}`,
        });
        showToast(`Biaya Medis Sapi #${selectedCowId} Rp ${nominal.toLocaleString('id-ID')} tersimpan!`);
      }

      setTimeout(() => {
        onNavigate?.('buku_kas_mikro_mowtitis');
      }, 1000);
    } catch (err: any) {
      console.error('Error saving transaction:', err);
      showToast(`Gagal menyimpan: ${err.message || 'Error koneksi'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#263143] text-[#ecf1ff] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm z-50 animate-bounce">
          <span className="material-symbols-outlined text-[#8df5e4] text-[18px]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff] px-4 py-3 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => onNavigate?.('buku_kas_mikro_mowtitis')}
              className="w-10 h-10 rounded-full bg-white border border-[#dee8ff] flex items-center justify-center text-[#111c2d] hover:bg-[#f0f3ff] transition-transform active:scale-95 shadow-xs"
              title="Kembali"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-[#111c2d]">Catat Transaksi Kas</h1>
              <span className="text-xs text-[#006b5f] font-semibold">Buku Kas Mikro Kandang</span>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#002203]">
            Supabase Live
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-20 pb-28 flex flex-col gap-4">
        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-white p-1 border border-[#dee8ff] shadow-xs">
          <button 
            type="button"
            onClick={() => setActiveTab('pemasukan')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pemasukan' ? 'bg-[#1b5e20] text-white shadow-xs' : 'text-[#41493e] hover:bg-[#f0f3ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
            <span>Pemasukan</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('pengeluaran')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pengeluaran' ? 'bg-[#ba1a1a] text-white shadow-xs' : 'text-[#41493e] hover:bg-[#f0f3ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            <span>Pengeluaran</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('medis')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'medis' ? 'bg-[#006b5f] text-white shadow-xs' : 'text-[#41493e] hover:bg-[#f0f3ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">medical_services</span>
            <span>Biaya Medis</span>
          </button>
        </div>

        {/* Transaction Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* TAB 1: PEMASUKAN */}
          {activeTab === 'pemasukan' && (
            <div className="bg-white rounded-2xl p-5 border border-[#dee8ff] shadow-xs flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-[#41493e] block mb-1.5">Kategori Pemasukan</label>
                <select
                  value={pemasukanCategory}
                  onChange={(e) => setPemasukanCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#dee8ff] bg-[#f9f9ff] font-medium focus:outline-none focus:border-[#1b5e20]"
                >
                  <option value="Susu Segar (Koperasi)">Setor Susu Segar ke KUD / Koperasi</option>
                  <option value="Susu Pasteurisasi Retail">Penjualan Susu Botol Retail / Konsumen</option>
                  <option value="Pupuk Kandang (Biourine)">Penjualan Pupuk Kandang & Biogas</option>
                  <option value="Lainnya">Pemasukan Lain-lain</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#41493e] block mb-1.5">Volume (Liter)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#dee8ff] bg-[#f9f9ff] font-bold focus:outline-none focus:border-[#1b5e20]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#41493e] block mb-1.5">Harga per Liter (Rp)</label>
                  <input
                    type="number"
                    value={pricePerLiter}
                    onChange={(e) => setPricePerLiter(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#dee8ff] bg-[#f9f9ff] font-bold focus:outline-none focus:border-[#1b5e20]"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#acf4a4]/30 border border-[#acf4a4] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#00450d]">Total Nominal Diterima:</span>
                <span className="text-base font-black text-[#00450d]">
                  Rp {Math.round((parseFloat(volume) || 0) * pricePerLiter).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: PENGELUARAN OPERASIONAL */}
          {activeTab === 'pengeluaran' && (
            <div className="bg-white rounded-2xl p-5 border border-[#dee8ff] shadow-xs flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-[#41493e] block mb-1.5">Kategori Pengeluaran</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#dee8ff] bg-[#f9f9ff] font-medium focus:outline-none focus:border-[#ba1a1a]"
                >
                  <option value="Pakan Konsentrat">Pakan Konsentrat Komersial (Pelet)</option>
                  <option value="Hijauan & Rumput Gajah">Hijauan Segar / Rumput Gajah</option>
                  <option value="Ampas Tahu & Konsentrat Basah">Ampas Tahu / Bahan Baku Protein</option>
                  <option value="Premiks & Mineral">Premiks Mineral, Garam &amp; Vitamin</option>
                  <option value="Listrik & Sanitasi">Listrik Pompa, Air &amp; Sanitasi</option>
                  <option value="Upah Tenaga Kerja">Upah Tenaga Perah / Harian</option>
                  <option value="Lainnya">Operasional Lainnya</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#41493e] block mb-1.5">Nominal Biaya (Rp)</label>
                <input
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="245000"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#dee8ff] bg-[#f9f9ff] font-bold text-[#ba1a1a] focus:outline-none focus:border-[#ba1a1a]"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 3: BIAYA MEDIS */}
          {activeTab === 'medis' && (
            <div className="bg-white rounded-2xl p-5 border border-[#dee8ff] shadow-xs flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-[#41493e] block mb-1.5">Pilih Sapi yang Diobati</label>
                <select
                  value={selectedCowId}
                  onChange={(e) => setSelectedCowId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#dee8ff] bg-[#f9f9ff] font-medium focus:outline-none focus:border-[#006b5f]"
                >
                  {cows.length > 0 ? (
                    cows.map((c) => (
                      <option key={c.id} value={c.number}>
                        Sapi #{c.number} - {c.name} ({c.stall || 'Kandang A'})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="04">Sapi #04 - Mawar (Kandang Karantina)</option>
                      <option value="07">Sapi #07 - Cantik (Line 05 Parlor A)</option>
                      <option value="12">Sapi #12 - Melati (Kandang A-14)</option>
                      <option value="18">Sapi #18 - Sekar (Line 04 Parlor A)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#41493e] block mb-1.5">Nama Obat / Terapi</label>
                <input
                  type="text"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#dee8ff] bg-[#f9f9ff] font-medium focus:outline-none focus:border-[#006b5f]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#41493e] block mb-1.5">Dosis / Jumlah</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#dee8ff] bg-[#f9f9ff] font-medium focus:outline-none focus:border-[#006b5f]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#41493e] block mb-1.5">Biaya Obat (Rp)</label>
                  <input
                    type="number"
                    value={medicalCost}
                    onChange={(e) => setMedicalCost(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#dee8ff] bg-[#f9f9ff] font-bold text-[#ba1a1a] focus:outline-none focus:border-[#006b5f]"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Common Notes Field */}
          <div className="bg-white rounded-2xl p-5 border border-[#dee8ff] shadow-xs">
            <label className="text-xs font-bold text-[#41493e] block mb-1.5">Keterangan / Catatan Tambahan</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Tangki A2 sore, suplier KUD, atau kondisi klinis sapi..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#dee8ff] bg-[#f9f9ff] focus:outline-none focus:border-[#1b5e20]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-[#1b5e20] hover:bg-[#00450d] active:scale-98 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                <span>Menyimpan ke Supabase...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Simpan Transaksi Kas</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
