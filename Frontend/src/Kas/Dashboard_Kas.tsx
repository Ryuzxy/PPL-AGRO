import { useState, useMemo } from 'react';
import type { ScreenType } from '../App.tsx';
import { useCashflow } from '../hooks/useSupabaseData';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../components/Navigation';

interface DashboardKasProps {
  onNavigate?: (screen: ScreenType) => void;
}

interface Transaction {
  id: string;
  date: string;
  time: string;
  category: 'pemasukan' | 'pakan' | 'medis' | 'operasional';
  categoryLabel: string;
  subject: string;
  subtext: string;
  tag?: string;
  tagColor?: string;
  quantity: string;
  amount: number;
  status: string;
  receiptNumber: string;
  verifiedBy?: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-01',
    date: '15 Mar 2025',
    time: '16:42 WIB',
    category: 'pemasukan',
    categoryLabel: 'Setor Susu',
    subject: 'Sapi #04 "Mawar"',
    subtext: 'Pemerahan sore stasiun parlor A2',
    tag: 'Kuartir RL Pulih',
    tagColor: 'bg-[#d8e3fb] text-[#006b5f]',
    quantity: '6.85 Liter',
    amount: 95900,
    status: 'Lunas Rek. KUD',
    receiptNumber: '#0419'
  },
  {
    id: 'TX-02',
    date: '15 Mar 2025',
    time: '16:15 WIB',
    category: 'pemasukan',
    categoryLabel: 'Setor Susu',
    subject: 'Setor BMC Parlor A Kolektif',
    subtext: 'Cooling tank batch #02 (KUD Rembangan)',
    quantity: '48.20 Liter',
    amount: 674800,
    status: 'Tervalidasi BMC',
    receiptNumber: '#882'
  },
  {
    id: 'TX-03',
    date: '15 Mar 2025',
    time: '11:20 WIB',
    category: 'pakan',
    categoryLabel: 'Beban Pakan',
    subject: 'Pakan Konsentrat Pokphand PK 18%',
    subtext: 'Toko Tani Arjasa (DO-AJM/891)',
    quantity: '2 Sak (100 kg)',
    amount: -450000,
    status: 'Lunas Kasir',
    receiptNumber: 'AJM-891'
  },
  {
    id: 'TX-04',
    date: '14 Mar 2025',
    time: '09:10 WIB',
    category: 'medis',
    categoryLabel: 'Medis Mastitis',
    subject: 'Terapi Cloxacillin Intramammary',
    subtext: '3 Tube + Teat Dip • Cegah afkir Rp 2.400.000',
    tag: 'ROI 16.5x',
    tagColor: 'bg-[#acf4a4] text-[#0c5216]',
    quantity: '1 Paket Dosis',
    amount: -145000,
    status: 'Resep Mantri Sutrisno',
    receiptNumber: 'MED-04'
  },
  {
    id: 'TX-05',
    date: '14 Mar 2025',
    time: '06:30 WIB',
    category: 'pemasukan',
    categoryLabel: 'Setor Susu',
    subject: 'Penjualan Susu Pagi Kawanan Kandang A',
    subtext: 'Kadar lemak 4.1% • Lolos uji CMT mandiri',
    quantity: '73.50 Liter',
    amount: 1029000,
    status: 'Lunas Transfer KUD',
    receiptNumber: '#9102'
  },
  {
    id: 'TX-06',
    date: '13 Mar 2025',
    time: '14:00 WIB',
    category: 'pakan',
    categoryLabel: 'Beban Pakan',
    subject: 'Rumput Gajah / Odot Petani Mitra',
    subtext: '500 kg hijauan segar Rembangan',
    quantity: '500 kg',
    amount: -150000,
    status: 'Lunas Tunai',
    receiptNumber: 'HG-130'
  },
  {
    id: 'TX-07',
    date: '12 Mar 2025',
    time: '10:00 WIB',
    category: 'medis',
    categoryLabel: 'Medis Mastitis',
    subject: 'Teat Dip Sanitasi Iodine 5L',
    subtext: 'Antiseptik celup puting pasca perah',
    quantity: '1 Galon 5L',
    amount: -150000,
    status: 'Lunas Toko Medika',
    receiptNumber: 'MED-12'
  }
];

export default function DashboardKas({ onNavigate }: DashboardKasProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [period, setPeriod] = useState<'Bulan Ini' | 'Hari Ini' | '7 Hari'>('Bulan Ini');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pemasukan' | 'pakan' | 'medis'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [modalPemasukanOpen, setModalPemasukanOpen] = useState(false);
  const [modalPengeluaranOpen, setModalPengeluaranOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  // New milk entry form state
  const [milkSubject, setMilkSubject] = useState('Sapi #04 "Mawar" (Kuartir RL Pulih)');
  const [milkVolume, setMilkVolume] = useState('7.20');
  const [milkPrice, setMilkPrice] = useState('14000');

  // New expense entry form state
  const [expCategory, setExpCategory] = useState<'pakan' | 'medis' | 'operasional'>('pakan');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expReceipt, setExpReceipt] = useState('');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { addIncome, addExpense } = useCashflow();

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchCategory =
        activeFilter === 'all' ? true : tx.category === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        tx.subject.toLowerCase().includes(q) ||
        tx.receiptNumber.toLowerCase().includes(q) ||
        tx.subtext.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  }, [transactions, activeFilter, searchQuery]);

  const handleSubmitPemasukan = async (e: React.FormEvent) => {
    e.preventDefault();
    const vol = parseFloat(milkVolume) || 0;
    const price = parseInt(milkPrice) || 14000;
    const total = Math.round(vol * price);

    const newTx: Transaction = {
      id: `TX-${Date.now()}`,
      date: '15 Mar 2025',
      time: 'Baru saja',
      category: 'pemasukan',
      categoryLabel: 'Setor Susu',
      subject: milkSubject,
      subtext: `Setoran baru ${vol.toFixed(2)} Liter @Rp ${price.toLocaleString('id-ID')}`,
      quantity: `${vol.toFixed(2)} Liter`,
      amount: total,
      status: 'Tervalidasi BMC',
      receiptNumber: `#${Math.floor(1000 + Math.random() * 9000)}`
    };

    setTransactions([newTx, ...transactions]);
    setModalPemasukanOpen(false);
    showToast(`Setor Susu ${vol} L (+Rp ${total.toLocaleString('id-ID')}) berhasil dicatat & disinkronkan ke Supabase!`);

    try {
      await addIncome({
        jumlah: total,
        kategori: 'Susu Segar (Koperasi)',
        keterangan: `${milkSubject} - Setor ${vol} Liter`,
        volume_liter: vol,
      });
    } catch (err) {
      console.warn('Supabase sync warning:', err);
    }
  };

  const handleSubmitPengeluaran = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseInt(expAmount) || 0;

    const newTx: Transaction = {
      id: `TX-${Date.now()}`,
      date: '15 Mar 2025',
      time: 'Baru saja',
      category: expCategory,
      categoryLabel: expCategory === 'pakan' ? 'Beban Pakan' : expCategory === 'medis' ? 'Medis Mastitis' : 'Operasional',
      subject: expDesc || 'Beban Operasional Kandang',
      subtext: 'Pencatatan kas keluar manual',
      quantity: '1 Item',
      amount: -Math.abs(amountVal),
      status: 'Lunas Kas',
      receiptNumber: expReceipt || `KAS-${Math.floor(100 + Math.random() * 900)}`
    };

    setTransactions([newTx, ...transactions]);
    setModalPengeluaranOpen(false);
    showToast(`Pengeluaran Rp ${amountVal.toLocaleString('id-ID')} berhasil dicatat & disinkronkan ke Supabase!`);

    try {
      await addExpense({
        jumlah: amountVal,
        kategori: expCategory === 'pakan' ? 'Beban Pakan' : expCategory === 'medis' ? 'Medis Mastitis' : 'Operasional',
        keterangan: expDesc || 'Pengeluaran Kas Kandang',
      });
    } catch (err) {
      console.warn('Supabase sync warning:', err);
    }
  };

  return (
    <div className="bg-[#f9f9ff] font-sans text-[#111c2d] min-h-screen antialiased flex flex-col lg:flex-row">
      {/* DESKTOP SIDEBAR */}
      <DesktopSidebar currentScreen="kas" onNavigate={onNavigate} />

      {/* MAIN CONTAINER */}
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
            <span className="text-[13px] sm:text-[14px] text-[#41493e] truncate hidden sm:inline">Kandang Laktasi A &amp; B</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => showToast('Sensor IoT Kandang Rembangan berhasil disinkronisasi!')}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e7eeff] text-[#111c2d] hover:bg-[#dee8ff] transition-colors text-[13px] font-semibold"
            >
              <span className="material-symbols-outlined text-[17px] text-[#006b5f]">sensors</span>
              <span>Sync IoT Sensor</span>
            </button>

            <button 
              onClick={() => onNavigate?.('unduh_kas')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e7eeff] text-[#111c2d] hover:bg-[#dee8ff] transition-colors text-[13px] font-semibold"
            >
              <span className="material-symbols-outlined text-[17px] text-[#41493e]">file_download</span>
              <span>Download Laporan PDF</span>
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

        {/* WORKSPACE CONTENT */}
        <main className="w-full flex-col pb-28 lg:pb-12 px-4 sm:px-8 py-6 max-w-[1560px] mx-auto">
          {/* Header Section with Badges & Rapid Actions */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 mb-6">
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f3ff] text-[#006b5f] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006b5f] animate-pulse"></span>
                  BMC-01 &amp; KUD REMBANGAN REALTIME
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8df5e4]/50 text-[#00201c] font-bold">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Buku Kas Ter-Audit ISO
                </span>
              </div>

              <h1 className="text-[22px] sm:text-[28px] font-black text-[#00450d] tracking-tight">
                Buku Kas Mikro &amp; Rekonsiliasi Finansial
              </h1>
              <p className="text-[13px] text-[#41493e]">
                Pusat integrasi neraca penjualan susu laktasi, pengadaan pakan konsentrat, dan audit kalkulasi ROI medikasi mastitis Rembangan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Date Selector Pills */}
              <div className="inline-flex bg-[#f0f3ff] p-1 rounded-full text-[#41493e] text-[12px] font-bold border border-slate-200/60">
                <button 
                  onClick={() => setPeriod('Bulan Ini')}
                  className={`px-3 py-1.5 rounded-full transition-all ${period === 'Bulan Ini' ? 'bg-white text-[#00450d] shadow-sm' : 'hover:text-[#111c2d]'}`}
                >
                  Bulan Ini (Mar 2025)
                </button>
                <button 
                  onClick={() => setPeriod('Hari Ini')}
                  className={`px-3 py-1.5 rounded-full transition-all ${period === 'Hari Ini' ? 'bg-white text-[#00450d] shadow-sm' : 'hover:text-[#111c2d]'}`}
                >
                  Hari Ini (15 Mar)
                </button>
                <button 
                  onClick={() => setPeriod('7 Hari')}
                  className={`px-3 py-1.5 rounded-full transition-all ${period === '7 Hari' ? 'bg-white text-[#00450d] shadow-sm' : 'hover:text-[#111c2d]'}`}
                >
                  7 Hari
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setModalPemasukanOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1b5e20] text-white text-[13px] font-bold shadow hover:bg-[#00450d] active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>+ Setor Susu</span>
                </button>

                <button 
                  onClick={() => setModalPengeluaranOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#dee8ff] text-[#111c2d] hover:bg-[#d8e3fb] text-[13px] font-bold active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#6c2200]">receipt_long</span>
                  <span>+ Biaya/Medis</span>
                </button>

                <a 
                  href="https://wa.me/?text=Laporan%20Rekonsiliasi%20Buku%20Kas%20Rembangan%20Dairy%20Farm%20-%20Total%20Surplus%20Bersih:%20Rp%2018.845.400" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#006b5f] transition-all border border-slate-200" 
                  title="Bagikan ke WA KUD"
                >
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </a>
              </div>
            </div>
          </div>

          {/* 4 Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Card 1: Surplus Bersih */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#717a6d] uppercase tracking-wider">Surplus Bersih (Net Margin)</span>
                  <span className="text-[26px] sm:text-[30px] font-black text-[#00450d] mt-1 leading-tight">Rp 18.845.400</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#acf4a4]/40 text-[#00450d]">
                  <span className="material-symbols-outlined text-[24px]">savings</span>
                </div>
              </div>
              <div className="mt-4 pt-1 flex items-center justify-between bg-[#f0f3ff] px-3 py-1.5 rounded-xl border border-slate-200/50">
                <div className="flex items-center gap-1 text-[#1b5e20] text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  <span>+14.8% vs Feb</span>
                </div>
                <span className="text-[11px] text-[#41493e]">Surplus Sehat</span>
              </div>
            </div>

            {/* Card 2: Total Pemasukan Susu */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#717a6d] uppercase tracking-wider">Total Pemasukan Susu</span>
                  <span className="text-[26px] sm:text-[30px] font-black text-[#111c2d] mt-1 leading-tight">Rp 34.720.000</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#8df5e4]/50 text-[#00201c]">
                  <span className="material-symbols-outlined text-[24px]">water_drop</span>
                </div>
              </div>
              <div className="mt-4 pt-1 flex flex-col gap-1.5">
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#41493e]">Total Volume Setor</span>
                  <span className="font-bold text-[#111c2d]">2.480 L @Rp 14.000</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#006b5f] h-full rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>

            {/* Card 3: Total Beban Kandang */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#717a6d] uppercase tracking-wider">Total Beban Kandang</span>
                  <span className="text-[26px] sm:text-[30px] font-black text-[#6c2200] mt-1 leading-tight">Rp 15.874.600</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#ffdbcf] text-[#802a00]">
                  <span className="material-symbols-outlined text-[24px]">payments</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-[#41493e] text-[11px] font-semibold">
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#6c2200]"></span> Pakan 68%</span>
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span> Medis 18%</span>
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Sanitasi 14%</span>
              </div>
            </div>

            {/* Card 4: IOFC Harian */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#717a6d] uppercase tracking-wider">Marjin Pakan (IOFC)</span>
                  <span className="text-[24px] sm:text-[28px] font-black text-[#00450d] mt-1 leading-tight">
                    Rp 1.349.700 <span className="text-[12px] text-[#41493e] font-normal">/hari</span>
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#dee8ff] text-[#006b5f]">
                  <span className="material-symbols-outlined text-[24px]">monitoring</span>
                </div>
              </div>
              <div className="mt-4 pt-1 flex items-center justify-between bg-[#f0f3ff] px-3 py-1.5 rounded-xl border border-slate-200/50">
                <span className="text-[12px] text-[#111c2d] font-bold">Rp 9.800 / L Susu</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#acf4a4] text-[#0c5216] font-bold">75% Efisiensi</span>
              </div>
            </div>
          </div>

          {/* Dual Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Ledger Table & Medical ROI (8 cols) */}
            <div className="xl:col-span-8 flex flex-col gap-6">
              {/* Milk Allocation & Health Triage Bar */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00450d] text-[22px]">stacked_bar_chart</span>
                    <span className="text-[15px] text-[#111c2d] font-bold">Alokasi &amp; Tingkat Kesehatan Susu Harian (15 Mar 2025)</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#41493e] bg-[#f0f3ff] px-3 py-1 rounded-full border border-slate-200">
                    Total: 128.55 Liter
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="bg-[#1b5e20] h-full" style={{ width: '82%' }} title="Lolos KUD (Grade A): 105.4 L (82%)"></div>
                    <div className="bg-[#006b5f] h-full" style={{ width: '14%' }} title="Sembuh Klinis: 18.0 L (14%)"></div>
                    <div className="bg-[#ba1a1a] h-full" style={{ width: '4%' }} title="Afkir Residu Mastitis: 5.15 L (4%)"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1b5e20]"></span>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#111c2d]">Lolos KUD (Grade A)</span>
                        <span className="text-[11px] text-[#41493e]">105.4 L • Rp 1.475.600</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#006b5f]"></span>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#111c2d]">Sembuh Klinis (Monitoring)</span>
                        <span className="text-[11px] text-[#41493e]">18.0 L • Rp 252.000</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#ba1a1a]">Afkir Antibiotik (Dibuang)</span>
                        <span className="text-[11px] text-[#ba1a1a] font-medium">5.15 L (Residu Mastitis)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ledger Table Module */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
                {/* Table Filter Tabs and Search Bar */}
                <div className="p-4 bg-white border-b border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => setActiveFilter('all')}
                      className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                        activeFilter === 'all' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                      }`}
                    >
                      Semua Entri ({transactions.length})
                    </button>
                    <button 
                      onClick={() => setActiveFilter('pemasukan')}
                      className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                        activeFilter === 'pemasukan' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                      }`}
                    >
                      Pemasukan Susu ({transactions.filter(t => t.category === 'pemasukan').length})
                    </button>
                    <button 
                      onClick={() => setActiveFilter('pakan')}
                      className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                        activeFilter === 'pakan' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                      }`}
                    >
                      Beban Pakan ({transactions.filter(t => t.category === 'pakan').length})
                    </button>
                    <button 
                      onClick={() => setActiveFilter('medis')}
                      className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                        activeFilter === 'medis' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-[#f0f3ff] text-[#41493e] hover:bg-[#dee8ff]'
                      }`}
                    >
                      Medis Mastitis ({transactions.filter(t => t.category === 'medis').length})
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2 text-[#717a6d] text-[18px]">search</span>
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari transaksi, nota, RFID..."
                        className="pl-9 pr-3 py-1.5 bg-[#f0f3ff] rounded-full text-[13px] text-[#111c2d] outline-none border border-slate-200 w-52 focus:w-64 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[750px]">
                    <thead>
                      <tr className="bg-slate-50 text-[#717a6d] text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
                        <th className="py-3 px-4">Waktu &amp; Tanggal</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Rincian / Subjek</th>
                        <th className="py-3 px-4">Volume / Qty</th>
                        <th className="py-3 px-4 text-right">Nominal</th>
                        <th className="py-3 px-4">Status &amp; Dokumen</th>
                        <th className="py-3 px-4 text-center">Nota</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[13px]">
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-bold text-[#111c2d]">{tx.date}</span>
                              <span className="text-[11px] text-[#717a6d]">{tx.time}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              tx.category === 'pemasukan'
                                ? 'bg-[#acf4a4] text-[#0c5216]'
                                : tx.category === 'pakan'
                                ? 'bg-[#ffdbcf] text-[#802a00]'
                                : 'bg-[#ffdad6] text-[#93000a]'
                            }`}>
                              <span className="material-symbols-outlined text-[13px]">
                                {tx.category === 'pemasukan' ? 'south_west' : 'north_east'}
                              </span>
                              {tx.categoryLabel}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5 font-bold text-[#111c2d]">
                                <span>{tx.subject}</span>
                                {tx.tag && (
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${tx.tagColor || 'bg-slate-200'}`}>
                                    {tx.tag}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-[#41493e]">{tx.subtext}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap text-[#111c2d] font-semibold">
                            {tx.quantity}
                          </td>

                          <td className={`py-3 px-4 whitespace-nowrap text-right font-extrabold text-[15px] ${
                            tx.amount > 0 ? 'text-[#00450d]' : 'text-[#6c2200]'
                          }`}>
                            {tx.amount > 0 ? `+Rp ${tx.amount.toLocaleString('id-ID')}` : `-Rp ${Math.abs(tx.amount).toLocaleString('id-ID')}`}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${tx.amount > 0 ? 'bg-[#1b5e20]' : 'bg-[#006b5f]'}`}></span>
                              <span className="text-[12px] font-semibold text-[#111c2d]">{tx.status}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap text-center">
                            <button 
                              onClick={() => setSelectedReceipt(tx)}
                              className="p-1.5 rounded-lg bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#006b5f] transition-colors border border-slate-200"
                              title="Lihat Bukti Nota"
                            >
                              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[12px] text-[#717a6d]">
                  <span>Menampilkan {filteredTransactions.length} dari {transactions.length} mutasi terverifikasi</span>
                  <div className="flex items-center gap-1">
                    <span className="px-2.5 py-1 rounded bg-[#1b5e20] text-white font-bold">1</span>
                  </div>
                </div>
              </div>

              {/* Medical ROI Audit Module */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006b5f] text-[24px]">troubleshoot</span>
                    <div>
                      <h3 className="text-[16px] text-[#111c2d] font-bold">Audit Pengembalian Investasi Medis (ROI Mastitis MowTitis)</h3>
                      <p className="text-[11px] text-[#41493e]">Model pencegahan kerugian finansial berbasis deteksi dini CNN &amp; XGBoost</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#acf4a4] text-[#0c5216] text-[11px] font-bold self-start sm:self-auto">
                    Total Safe Guard: Rp 4.850.000
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="bg-[#f0f3ff] p-4 rounded-xl border border-slate-200/50 flex flex-col gap-1">
                    <span className="text-[11px] text-[#717a6d] uppercase font-bold">Biaya Intervensi Medis</span>
                    <span className="text-[20px] font-black text-[#6c2200]">Rp 295.000</span>
                    <span className="text-[11px] text-[#41493e]">2 sapi laktasi (Mawar #04 &amp; Melati #11)</span>
                  </div>

                  <div className="bg-[#f0f3ff] p-4 rounded-xl border border-slate-200/50 flex flex-col gap-1">
                    <span className="text-[11px] text-[#717a6d] uppercase font-bold">Potensi Kerugian Dihindari</span>
                    <span className="text-[20px] font-black text-[#00450d]">Rp 4.850.000</span>
                    <span className="text-[11px] text-[#41493e]">346 Liter susu terlindungi dari afkir</span>
                  </div>

                  <div className="bg-[#f0f3ff] p-4 rounded-xl border border-slate-200/50 flex flex-col gap-1">
                    <span className="text-[11px] text-[#717a6d] uppercase font-bold">Rasio Efektivitas Finansial</span>
                    <span className="text-[20px] font-black text-[#006b5f]">16.4x Lipat</span>
                    <span className="text-[11px] text-[#00450d] font-semibold">Tingkat keberhasilan terapi 100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: A4 PDF Preview & WhatsApp KUD Gateway (4 cols) */}
            <div className="xl:col-span-4 flex flex-col gap-6">
              {/* Printable A4 PDF Report Preview Card */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00450d] text-[22px]">picture_as_pdf</span>
                    <span className="text-[15px] font-bold text-[#111c2d]">Pratinjau Lembar Kas A4</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#f0f3ff] text-[#717a6d] text-[11px] font-bold">248 KB</span>
                </div>

                {/* Stylized Paper Sheet A4 */}
                <div className="bg-[#f9f9ff] p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                  {/* Doc Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 bg-white p-2.5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1b5e20] flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[17px]">agriculture</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] text-[#00450d] font-black uppercase leading-tight">KUD ARGOPURO JAYA</span>
                        <span className="text-[9px] text-[#41493e] leading-tight">Unit Agribisnis Rembangan</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#111c2d] font-bold block">MAR-2025/KAS</span>
                      <span className="text-[8px] text-[#717a6d] block">Lembar Rekonsiliasi</span>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-[9px] text-[#717a6d] uppercase block">Penerimaan Susu</span>
                      <span className="text-[14px] text-[#00450d] font-extrabold">Rp 34.720.000</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#717a6d] uppercase block">Beban Pakan + Medis</span>
                      <span className="text-[14px] text-[#6c2200] font-extrabold">Rp 15.874.600</span>
                    </div>
                  </div>

                  {/* Mini Ledger */}
                  <div className="flex flex-col gap-1 text-[10px] text-[#41493e] bg-white p-2.5 rounded-lg border border-slate-100">
                    <div className="flex justify-between py-0.5">
                      <span>Setor Susu BMC (2.480 L)</span>
                      <span className="font-bold text-[#00450d]">+34.720.000</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>Beban Konsentrat Pokphand</span>
                      <span className="font-bold text-[#6c2200]">-10.794.700</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>Beban Medis &amp; Salep Mastitis</span>
                      <span className="font-bold text-[#6c2200]">-2.857.400</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>Biaya Listrik &amp; Air Kandang</span>
                      <span className="font-bold text-[#6c2200]">-2.222.500</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-100 font-bold">
                      <span className="text-[#00450d]">Saldo Bersih Tersimpan</span>
                      <span className="text-[#00450d] font-black">Rp 18.845.400</span>
                    </div>
                  </div>

                  {/* QR & Stamp */}
                  <div className="pt-1 flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[28px] text-[#00450d]">qr_code_2</span>
                      <div className="flex flex-col text-[8px] text-[#717a6d] leading-tight">
                        <span className="font-bold text-[#111c2d]">Validasi SHA-256</span>
                        <span>Otorisasi Digital KUD</span>
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded bg-[#8df5e4]/50 text-[#00201c] text-center transform -rotate-3 border border-[#8df5e4]">
                      <span className="text-[9px] font-black uppercase tracking-tight block">KUD REMBANGAN</span>
                      <span className="text-[7px] block">15 MAR 2025</span>
                    </div>
                  </div>
                </div>

                {/* PDF Actions */}
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#1b5e20] text-white text-[13px] font-bold shadow hover:bg-[#00450d] active:scale-98 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    <span>Unduh Lembar PDF (248 KB)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => showToast('Mencetak struk thermal kasir...')}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] text-[12px] font-semibold border border-slate-200"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#006b5f]">print</span>
                      <span>Print Thermal</span>
                    </button>

                    <button 
                      onClick={() => showToast('Buku kas tersinkronisasi ke Google Drive Cadangan!')}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] text-[12px] font-semibold border border-slate-200"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#41493e]">backup</span>
                      <span>Backup Cloud</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Integrated WhatsApp KUD Gateway */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006b5f] text-[22px]">send</span>
                    <span className="text-[15px] font-bold text-[#111c2d]">WhatsApp Gateway KUD</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#00450d] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#1b5e20] animate-ping"></span>
                    API Siap
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 bg-[#f0f3ff] p-3.5 rounded-xl border border-slate-200/50">
                  {/* Recipient 1: Bu Wahyu */}
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#8df5e4] text-[#00201c] flex items-center justify-center font-bold text-[11px]">
                        BW
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-[#111c2d] leading-tight">Bu Wahyu (Bendahara KUD)</span>
                        <span className="text-[11px] text-[#717a6d] leading-tight">+62 812-4912-XXXX</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#00450d]">
                      <span className="material-symbols-outlined text-[16px]">done_all</span>
                      <span className="text-[10px] font-bold">Terkirim</span>
                    </div>
                  </div>

                  {/* Recipient 2: Grup Pengurus */}
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#acf4a4] text-[#0c5216] flex items-center justify-center font-bold text-[11px]">
                        KD
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-[#111c2d] leading-tight">Pengurus Harian KUD Rembangan</span>
                        <span className="text-[11px] text-[#717a6d] leading-tight">Grup Resmi Argopuro Jaya</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#00450d]">
                      <span className="material-symbols-outlined text-[16px]">done_all</span>
                      <span className="text-[10px] font-bold">Dibaca</span>
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="p-2.5 bg-white rounded-xl text-[11px] text-[#41493e] italic border border-slate-100">
                    "Laporan Buku Kas &amp; Volume Susu 15 Mar 2025 telah direkonsiliasi. Total Setor: 128.55 L, Surplus Bersih: Rp 18.845.400. File PDF terlampir."
                  </div>
                </div>

                <a 
                  href="https://wa.me/?text=Laporan%20Rekonsiliasi%20Buku%20Kas%20Rembangan%20Dairy%20Farm%20-%20Total%20Setor:%20128.55L,%20Surplus%20Bersih:%20Rp%2018.845.400"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#006b5f] text-white text-[13px] font-bold hover:bg-[#005048] active:scale-98 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">sync</span>
                  <span>Kirim Ulang Rekap via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal 1: Catat Setoran Susu Baru */}
      {modalPemasukanOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1b5e20] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">water_drop</span>
                </div>
                <span className="text-[18px] text-[#00450d] font-bold">Catat Setoran Susu Baru</span>
              </div>
              <button onClick={() => setModalPemasukanOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitPemasukan} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#717a6d] uppercase mb-1">Subjek Sapi / Batch</label>
                <select 
                  value={milkSubject}
                  onChange={(e) => setMilkSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f0f3ff] rounded-xl text-[13px] text-[#111c2d] outline-none border border-slate-200"
                >
                  <option value='Sapi #04 "Mawar" (Kuartir RL Pulih)'>Sapi #04 "Mawar" (Kuartir RL Pulih)</option>
                  <option value='Sapi #12 "Melati" (Laktasi Peak)'>Sapi #12 "Melati" (Laktasi Peak)</option>
                  <option value='Sapi #07 "Cantik" (Prime)'>Sapi #07 "Cantik" (Prime)</option>
                  <option value='Setoran Kolektif Parlor A (Cooling Tank)'>Setoran Kolektif Parlor A (Cooling Tank)</option>
                  <option value='Setoran Kolektif Parlor B (Susu Pagi)'>Setoran Kolektif Parlor B (Susu Pagi)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#717a6d] uppercase mb-1">Volume Susu (Liter)</label>
                  <input 
                    type="number"
                    step="0.05"
                    value={milkVolume}
                    onChange={(e) => setMilkVolume(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f0f3ff] rounded-xl text-[13px] text-[#111c2d] outline-none border border-slate-200 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#717a6d] uppercase mb-1">Harga KUD (/Liter)</label>
                  <input 
                    type="number"
                    value={milkPrice}
                    onChange={(e) => setMilkPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f0f3ff] rounded-xl text-[13px] text-[#111c2d] outline-none border border-slate-200 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-[#f0f3ff] rounded-xl flex items-center justify-between border border-slate-200/50">
                <span className="text-[12px] font-bold text-[#41493e]">Estimasi Penerimaan:</span>
                <span className="text-[16px] font-black text-[#00450d]">
                  Rp {Math.round((parseFloat(milkVolume) || 0) * (parseInt(milkPrice) || 0)).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setModalPemasukanOpen(false)}
                  className="px-4 py-2 rounded-full hover:bg-slate-100 text-[13px] font-bold text-[#41493e]"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1b5e20] text-white text-[13px] font-bold shadow hover:bg-[#00450d]"
                >
                  Simpan &amp; Verifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Catat Beban / Medis */}
      {modalPengeluaranOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ffdbcf] text-[#802a00] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                </div>
                <span className="text-[18px] text-[#6c2200] font-bold">Catat Beban Operasional / Medis</span>
              </div>
              <button onClick={() => setModalPengeluaranOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitPengeluaran} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#717a6d] uppercase mb-1">Kategori Beban</label>
                <select 
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-[#f0f3ff] rounded-xl text-[13px] text-[#111c2d] outline-none border border-slate-200"
                >
                  <option value="pakan">Pengadaan Pakan Hijauan / Konsentrat</option>
                  <option value="medis">Medis Mastitis (Antibiotik / Salep / Teat Dip)</option>
                  <option value="operasional">Sanitasi &amp; Utilitas Kandang</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#717a6d] uppercase mb-1">Keterangan Transaksi &amp; Vendor</label>
                <input 
                  type="text"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="Contoh: Konsentrat Pokphand 100 kg / Salep Cloxacillin"
                  className="w-full px-4 py-2.5 bg-[#f0f3ff] rounded-xl text-[13px] text-[#111c2d] outline-none border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#717a6d] uppercase mb-1">Nominal (Rupiah)</label>
                  <input 
                    type="number"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    placeholder="150000"
                    className="w-full px-4 py-2.5 bg-[#f0f3ff] rounded-xl text-[13px] text-[#111c2d] outline-none border border-slate-200 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#717a6d] uppercase mb-1">No. Bukti / Nota</label>
                  <input 
                    type="text"
                    value={expReceipt}
                    onChange={(e) => setExpReceipt(e.target.value)}
                    placeholder="Contoh: NOTA-MED-22"
                    className="w-full px-4 py-2.5 bg-[#f0f3ff] rounded-xl text-[13px] text-[#111c2d] outline-none border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setModalPengeluaranOpen(false)}
                  className="px-4 py-2 rounded-full hover:bg-slate-100 text-[13px] font-bold text-[#41493e]"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#6c2200] text-white text-[13px] font-bold shadow hover:bg-[#802a00]"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Pratinjau Nota */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00450d] text-[20px]">receipt_long</span>
                <span className="text-[16px] font-bold text-[#111c2d]">Bukti Transaksi {selectedReceipt.receiptNumber}</span>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="bg-[#f0f3ff] p-4 rounded-xl flex flex-col gap-2 text-[12px] border border-slate-200/50">
              <div className="flex justify-between">
                <span className="text-[#717a6d]">Waktu:</span>
                <span className="font-bold text-[#111c2d]">{selectedReceipt.date} • {selectedReceipt.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717a6d]">Subjek:</span>
                <span className="font-bold text-[#111c2d]">{selectedReceipt.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717a6d]">Kuantitas:</span>
                <span className="font-bold text-[#111c2d]">{selectedReceipt.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717a6d]">Status:</span>
                <span className="font-bold text-[#00450d]">{selectedReceipt.status}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-[14px]">
                <span className="font-bold text-[#111c2d]">Total Nominal:</span>
                <span className={`font-black ${selectedReceipt.amount > 0 ? 'text-[#00450d]' : 'text-[#6c2200]'}`}>
                  {selectedReceipt.amount > 0 ? `+Rp ${selectedReceipt.amount.toLocaleString('id-ID')}` : `-Rp ${Math.abs(selectedReceipt.amount).toLocaleString('id-ID')}`}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 rounded-full bg-[#1b5e20] text-white font-bold text-[13px]"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#263143] text-white px-5 py-3 rounded-xl shadow-2xl animate-bounce">
          <span className="material-symbols-outlined text-[#8df5e4] text-[20px]">check_circle</span>
          <span className="text-[13px] font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeScreen="kas"
        onNavigate={onNavigate}
      />

      {/* Persistent Bottom Nav for Mobile */}
      <MobileBottomNav activeScreen="kas" onNavigate={onNavigate} />
    </div>
  );
}
