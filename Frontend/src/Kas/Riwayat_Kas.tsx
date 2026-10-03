import { useState } from 'react';
import type { ScreenType } from '../App.tsx';
import { useCashflow, type CashTransaction } from '../hooks/useSupabaseData';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../components/Navigation';

interface RiwayatKasProps {
  onNavigate?: (screen: ScreenType) => void;
}

export default function RiwayatKas({ onNavigate }: RiwayatKasProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showToast, setShowToast] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState<'bulan' | 'hari' | '7hari' | 'kustom'>('bulan');
  const [filterType, setFilterType] = useState<'semua' | 'pemasukan' | 'pengeluaran'>('semua');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { transactions: dbTransactions, totalBalance, todayIncome, todayExpense } = useCashflow();

  const defaultTransactions: CashTransaction[] = [
    {
      id: 'TRX-01',
      dbId: 1,
      title: 'Salep Mastitis & Iodin Teat Dip',
      category: 'Medis Mastitis',
      amount: '-Rp 145.000',
      rawAmount: 145000,
      time: '17:52 WIB',
      date: 'Hari Ini',
      isIncome: false,
      badge: 'BARU DICATAT',
      notes: 'Sapi #04 (Mawar - Karantina B-02)'
    },
    {
      id: 'TRX-02',
      dbId: 2,
      title: 'Setoran Susu Sore Parlor A',
      category: 'Pemasukan Kas',
      amount: '+Rp 529.200',
      rawAmount: 529200,
      time: '16:30 WIB',
      date: 'Hari Ini',
      isIncome: true,
      badge: '37.8 L Susu',
      notes: 'Koperasi Rembangan'
    },
    {
      id: 'TRX-03',
      dbId: 3,
      title: 'Pakan Konsentrat Starter 2 Karung',
      category: 'Operasional Pakan',
      amount: '-Rp 420.000',
      rawAmount: 420000,
      time: '10:15 WIB',
      date: 'Kemarin',
      isIncome: false,
      badge: 'Pakan Kawanan',
      notes: '100 kg Konsentrat 18%'
    },
    {
      id: 'TRX-04',
      dbId: 4,
      title: 'Setoran Susu Pagi & Sore',
      category: 'Pemasukan Kas',
      amount: '+Rp 1.120.000',
      rawAmount: 112000,
      time: '17:00 WIB',
      date: 'Kemarin',
      isIncome: true,
      badge: '80.0 L Susu',
      notes: 'Koperasi Rembangan'
    }
  ];

  const activeTransactions = dbTransactions.length > 0 ? dbTransactions : defaultTransactions;

  const filteredTrx = activeTransactions.filter(t => {
    if (filterType === 'pemasukan') return t.isIncome;
    if (filterType === 'pengeluaran') return !t.isIncome;
    return true;
  });

  const displayTotal = totalBalance;
  const displayIncome = todayIncome > 0 ? todayIncome : 34720000;
  const displayExpense = todayExpense > 0 ? todayExpense : 20015000;
  const netMargin = Math.max(0, displayIncome - displayExpense);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen antialiased flex flex-col lg:flex-row">
      {/* DESKTOP SIDEBAR */}
      <DesktopSidebar currentScreen="kas" onNavigate={onNavigate} />

      {/* Dynamic Pop Toast */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#263143] text-[#ecf1ff] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm z-50 animate-bounce">
          <span className="material-symbols-outlined text-[#8df5e4] text-[18px]">info</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 lg:pl-72 w-full flex flex-col">
        {/* Header */}
        <header className="sticky top-0 w-full z-40 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff] px-4 py-3 shadow-xs">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl text-[#00450d] hover:bg-[#dee8ff]/50 transition-colors flex items-center justify-center"
                aria-label="Buka Menu"
              >
                <span className="material-symbols-outlined text-[24px]">menu</span>
              </button>
              <button 
                onClick={() => onNavigate?.('kas')}
                className="w-10 h-10 rounded-full bg-white border border-[#dee8ff] flex items-center justify-center text-[#111c2d] hover:bg-[#f0f3ff] transition-transform active:scale-95 shadow-xs"
                title="Kembali ke Buku Kas"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <div className="flex flex-col">
                <h1 className="text-base font-bold text-[#111c2d]">Riwayat Kas Mikro</h1>
                <span className="text-xs text-[#006b5f] font-semibold">Pasca Pengeluaran Medis Mawar</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => triggerToast('Mencetak struk kas...')}
                className="w-9 h-9 rounded-full bg-[#e7eeff] flex items-center justify-center text-[#111c2d] hover:bg-[#dee8ff] transition-colors"
                title="Cetak Struk"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
              </button>
              <button 
                onClick={() => onNavigate?.('unduh_kas')}
                className="w-9 h-9 rounded-full bg-[#e7eeff] flex items-center justify-center text-[#00450d] hover:bg-[#dee8ff] transition-colors"
                title="Unduh Laporan PDF"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-4 pb-28 lg:pb-12 flex flex-col gap-4">
        {/* Realtime Success Feedback Notification */}
        {showToast && (
          <aside className="flex flex-col bg-white rounded-2xl p-4 shadow-sm border border-[#dee8ff] transition-all relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8df5e4]/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#006b5f] text-[24px]">verified</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[#111c2d]">Pengeluaran Medis Berhasil Dicatat</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8df5e4]/40 text-[#006b5f] uppercase">
                    Terbuku
                  </span>
                </div>
                <p className="text-xs text-[#41493e] mt-1 leading-relaxed">
                  Buku kas mikro & rekam medis klinis <span className="font-semibold text-[#111c2d]">Sapi #04 (Mawar)</span> otomatis diperbarui (<span className="text-[#933100] font-bold">-Rp 145.000</span>).
                </p>
              </div>
              <button 
                onClick={() => setShowToast(false)}
                className="absolute top-3 right-3 text-[#717a6d] hover:text-[#111c2d] w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f0f3ff]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#dee8ff]/60 flex items-center justify-between text-[#41493e]">
              <span className="text-xs flex items-center gap-1 font-mono">
                <span className="material-symbols-outlined text-[15px] text-[#006b5f]">sync_saved_locally</span>
                ID Log: RX-MST-2025-042 • Karantina B-02
              </span>
              <span className="text-xs text-[#006b5f] font-bold">17:52 WIB</span>
            </div>
          </aside>
        )}

        {/* Title & Quick Filter */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-[#006b5f] tracking-wider block">Buku Kas Peternakan</span>
              <h2 className="text-xl font-bold text-[#111c2d]">Arus Kas Mikro Kandang</h2>
            </div>
            <button 
              onClick={() => triggerToast('Periode aktif: Maret 2025')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#dee8ff] text-xs font-semibold text-[#111c2d] shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#006b5f]">calendar_today</span>
              <span>Mar 2025</span>
            </button>
          </div>

          {/* Time Range Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar text-xs">
            <button 
              onClick={() => setFilterPeriod('bulan')}
              className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                filterPeriod === 'bulan' ? 'bg-[#00450d] text-white shadow-xs' : 'bg-white border border-[#dee8ff] text-[#41493e]'
              }`}
            >
              Bulan Ini
            </button>
            <button 
              onClick={() => setFilterPeriod('hari')}
              className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                filterPeriod === 'hari' ? 'bg-[#00450d] text-white shadow-xs' : 'bg-white border border-[#dee8ff] text-[#41493e]'
              }`}
            >
              Hari Ini
            </button>
            <button 
              onClick={() => setFilterPeriod('7hari')}
              className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                filterPeriod === '7hari' ? 'bg-[#00450d] text-white shadow-xs' : 'bg-white border border-[#dee8ff] text-[#41493e]'
              }`}
            >
              7 Hari Terakhir
            </button>
            <button 
              onClick={() => setFilterPeriod('kustom')}
              className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                filterPeriod === 'kustom' ? 'bg-[#00450d] text-white shadow-xs' : 'bg-white border border-[#dee8ff] text-[#41493e]'
              }`}
            >
              Kustom
            </button>
          </div>
        </section>

        {/* Cashflow Summary Card */}
        <section className="flex flex-col bg-white rounded-2xl p-4 shadow-xs border border-[#dee8ff] gap-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase text-[#717a6d] font-semibold tracking-wider">Surplus Bersih (Net Margin)</span>
              <div className="text-2xl font-black text-[#00450d] mt-0.5 tracking-tight">Rp {netMargin.toLocaleString('id-ID')}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#002203] text-[11px] font-extrabold">
                  <span className="material-symbols-outlined text-[13px]">trending_up</span>
                  Live Cloud Sync
                </span>
                <span className="text-xs text-[#717a6d]">Saldo: Rp {displayTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#f0f3ff] flex items-center justify-center text-[#00450d]">
              <span className="material-symbols-outlined text-[22px]">account_balance</span>
            </div>
          </div>

          {/* Income & Expense Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col bg-[#f0f3ff] rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[#006b5f]">
                <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                <span className="text-[11px] font-bold uppercase">Pemasukan</span>
              </div>
              <span className="text-base font-black text-[#111c2d] mt-1">Rp {displayIncome.toLocaleString('id-ID')}</span>
              <span className="text-[11px] text-[#717a6d] mt-0.5">Penjualan Susu & BMC</span>
            </div>
            <div className="flex flex-col bg-[#f0f3ff] rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[#933100]">
                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                <span className="text-[11px] font-bold uppercase">Pengeluaran</span>
              </div>
              <span className="text-base font-black text-[#111c2d] mt-1">Rp {displayExpense.toLocaleString('id-ID')}</span>
              <span className="text-[11px] text-[#933100] font-semibold mt-0.5">Pakan & Medis Terbuku</span>
            </div>
          </div>

          {/* Triage Breakdown Bar */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] uppercase text-[#717a6d] font-semibold">Distribusi Beban Pengeluaran</span>
              <span className="text-[11px] text-[#00450d] font-bold">100% Terevaluasi</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#dee8ff] overflow-hidden flex">
              <div className="h-full bg-[#1b5e20]" style={{ width: '67%' }} title="Pakan Mandiri 67%"></div>
              <div className="h-full bg-[#933100]" style={{ width: '19%' }} title="Medis & Mastitis 19%"></div>
              <div className="h-full bg-[#006b5f]" style={{ width: '14%' }} title="Operasional 14%"></div>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-y-1 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1b5e20]"></span>
                <span className="text-[#41493e]">Pakan 67%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#933100]"></span>
                <span className="text-[#41493e]">Medis & Mastitis 19%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006b5f]"></span>
                <span className="text-[#41493e]">Operasional 14%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Transaction Action Buttons */}
        <section className="grid grid-cols-2 gap-2.5">
          <button 
            onClick={() => onNavigate?.('form_input_kas')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#00450d] text-white font-bold text-xs shadow-md active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Pemasukan</span>
          </button>
          <button 
            onClick={() => onNavigate?.('form_input_pengeluaran')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white border border-[#dee8ff] text-[#933100] font-bold text-xs shadow-xs hover:bg-[#f0f3ff] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">remove_circle_outline</span>
            <span>+ Pengeluaran</span>
          </button>
        </section>

        {/* IOFC Metric Card */}
        <section className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-xs border border-[#dee8ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0f3ff] flex items-center justify-center text-[#00450d] shrink-0">
              <span className="material-symbols-outlined text-[22px]">water_ec</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#111c2d]">Rasio IOFC Mandiri</span>
                <span className="px-2 py-0.5 rounded-full bg-[#8df5e4]/40 text-[#006b5f] text-[10px] font-bold">
                  OPTIMAL
                </span>
              </div>
              <span className="text-sm font-black text-[#00450d]">
                Rp 9.800 <span className="text-xs text-[#717a6d] font-normal">/ Liter Margin</span>
              </span>
            </div>
          </div>
          <button 
            onClick={() => triggerToast('Mengunduh laporan efisiensi IOFC...')}
            className="w-9 h-9 rounded-full bg-[#f0f3ff] text-[#717a6d] flex items-center justify-center hover:text-[#00450d] shadow-xs"
            title="Unduh Laporan"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
          </button>
        </section>

        {/* Transactions List */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111c2d]">Riwayat Transaksi</h3>
            <span className="text-[11px] text-[#006b5f] bg-[#8df5e4]/30 px-2.5 py-0.5 rounded-full font-bold">
              {filteredTrx.length} Transaksi Terbuku
            </span>
          </div>

          {/* Filter Tab */}
          <div className="flex bg-[#e7eeff] p-1 rounded-xl gap-1 text-xs">
            <button 
              onClick={() => setFilterType('semua')}
              className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                filterType === 'semua' ? 'bg-white text-[#111c2d] shadow-xs' : 'text-[#41493e]'
              }`}
            >
              Semua ({activeTransactions.length})
            </button>
            <button 
              onClick={() => setFilterType('pemasukan')}
              className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                filterType === 'pemasukan' ? 'bg-white text-[#006b5f] shadow-xs' : 'text-[#41493e]'
              }`}
            >
              Pemasukan ({activeTransactions.filter(t => t.isIncome).length})
            </button>
            <button 
              onClick={() => setFilterType('pengeluaran')}
              className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                filterType === 'pengeluaran' ? 'bg-white text-[#933100] shadow-xs' : 'text-[#41493e]'
              }`}
            >
              Pengeluaran ({activeTransactions.filter(t => !t.isIncome).length})
            </button>
          </div>

          {/* Dynamic Transactions List */}
          <div className="space-y-2 pt-1">
            {filteredTrx.map((trx) => (
              <article 
                key={trx.id}
                onClick={() => {
                  if (!trx.isIncome && trx.category.toLowerCase().includes('medis')) {
                    onNavigate?.('pengeluaran_medis');
                  }
                }}
                className={`flex flex-col bg-white rounded-2xl p-3.5 shadow-xs border transition-all ${
                  !trx.isIncome && trx.category.toLowerCase().includes('medis')
                    ? 'border-amber-200 hover:border-amber-300 cursor-pointer'
                    : 'border-[#dee8ff]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      trx.isIncome 
                        ? 'bg-[#acf4a4]/40 text-[#00450d]' 
                        : trx.category.toLowerCase().includes('medis')
                        ? 'bg-[#ffdad6] text-[#933100]'
                        : 'bg-[#e7eeff] text-[#111c2d]'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">
                        {trx.isIncome 
                          ? 'water_drop' 
                          : trx.category.toLowerCase().includes('medis') 
                          ? 'medical_services' 
                          : 'grass'}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-[#111c2d] truncate">{trx.title}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-[#f0f3ff] text-[#006b5f] text-[10px] font-extrabold">
                          {trx.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#717a6d] mt-0.5 truncate">
                        {trx.category} {trx.notes ? `• ${trx.notes}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-black whitespace-nowrap ${
                    trx.isIncome ? 'text-[#00450d]' : 'text-[#933100]'
                  }`}>
                    {trx.amount}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#dee8ff]/50 flex items-center justify-between text-[11px] text-[#717a6d]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#006b5f]">cloud_done</span>
                    Supabase Synced
                  </span>
                  <span>{trx.time} • {trx.date}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeScreen="kas"
        onNavigate={onNavigate}
      />

      {/* Persistent Bottom Navigation */}
      <MobileBottomNav activeScreen="kas" onNavigate={onNavigate} />
    </div>
  );
}
