import { useState } from 'react';
import type { ScreenType } from '../App.tsx';
import { useCashflow, type CashTransaction } from '../hooks/useSupabaseData';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../components/Navigation';

interface BukuKasMikroMowtitisProps {
  onNavigate?: (screen: ScreenType) => void;
}

export default function BukuKasMikroMowtitis({ onNavigate }: BukuKasMikroMowtitisProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSyncBanner, setShowSyncBanner] = useState(true);
  const [activeTab, setActiveTab] = useState<'semua' | 'pemasukan' | 'pengeluaran'>('semua');

  const { transactions: dbTransactions, totalBalance, todayIncome, todayExpense } = useCashflow();

  const defaultTransactions: CashTransaction[] = [
    {
      id: 'TRX-01',
      dbId: 1,
      title: 'Penjualan Susu Sore Line 05 (Sapi #07 Cantik)',
      category: 'Pemasukan Otomatis',
      amount: '+Rp 101.500',
      rawAmount: 101500,
      time: '16:30 WIB • 14.50 Liter',
      date: 'Hari ini',
      isIncome: true,
      badge: 'IoT Verified'
    },
    {
      id: 'TRX-02',
      dbId: 2,
      title: 'Beli Konsentrat Ransum Sore 3 Sak (KUD Rembangan)',
      category: 'Operasional Pakan',
      amount: '-Rp 450.000',
      rawAmount: 450000,
      time: '14:15 WIB • Kasir KUD',
      date: 'Hari ini',
      isIncome: false,
      badge: 'Nota #8821'
    },
    {
      id: 'TRX-03',
      dbId: 3,
      title: 'Penjualan Susu Pagi Seluruh Stall (Line 01-08)',
      category: 'Pemasukan BMC-01',
      amount: '+Rp 1.799.700',
      rawAmount: 1799700,
      time: '07:15 WIB • 128.55 Liter',
      date: 'Hari ini',
      isIncome: true,
      badge: 'Bank Jatim QRIS'
    },
    {
      id: 'TRX-04',
      dbId: 4,
      title: 'Salep Intramamari Mastitis Tube #3 (Sapi #04 Mawar)',
      category: 'Medis Karantina',
      amount: '-Rp 68.000',
      rawAmount: 68000,
      time: 'Kemarin • drh. Farhan',
      date: 'Kemarin',
      isIncome: false,
      badge: 'Selesai Terapi'
    }
  ];

  const activeTransactions = dbTransactions.length > 0 ? dbTransactions : defaultTransactions;

  const filteredTrx = activeTransactions.filter(t => {
    if (activeTab === 'pemasukan') return t.isIncome;
    if (activeTab === 'pengeluaran') return !t.isIncome;
    return true;
  });

  const displayTotal = totalBalance;
  const displayIncome = todayIncome > 0 ? todayIncome : 1901200;
  const displayExpense = todayExpense > 0 ? todayExpense : 450000;
  const displayIofc = Math.max(0, displayIncome - displayExpense);

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen antialiased flex flex-col lg:flex-row">
      {/* DESKTOP SIDEBAR */}
      <DesktopSidebar currentScreen="kas" onNavigate={onNavigate} />

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
                className="w-9 h-9 rounded-xl object-contain shadow-sm"
                src="https://lh3.googleusercontent.com/aida/AEtjO1W5nB4jArKPK4MCNelmdZzLGguf2j8AY-pqGYV_gppCDNVvxWfCjdqmVBQSmbS_iBV0jI0tUpQin5_W3Jd8KH3zeo4voWenuA_lG-0HV2gsHEA2x_oZwr5oZBjv_Ng6IQR6K45v4Ka5gNXYtxNq3Z1O1-7f3DRSlgJtsgluIRYqxVS14WvFBbv5vG9ZVOieckywoa14wTOmpo45JGSJpdYN_ltvPkd7hg44sMMrVJa9qkUo3kzVvhtCNCI"
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-base text-[#111c2d] leading-tight">Mowtitis</span>
                  <span className="bg-[#acf4a4] text-[#002203] px-1.5 py-0.2 rounded-full text-[10px] font-extrabold uppercase">AI BIO</span>
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCn3kRgbAx07X77LMnuqcwbQC7BrG-fmY-mSukU217UIhHqJ3dLDWHrOAl2mbn6u7-hdo3MMuzWKdRzDRUvroVvZkstq_mT3OwIFVuR4bm67kfE2X5cVxoDGkklIOXdApAkboytBZ5HjMSTGireDwYVZdJ5MgkRC4OrheTKI43vlFt1v5K4D923Hm4T3r8MRZxlROIaTdyjRYY6ApXYOeQeQe6eiWyaoB8Hsv6tIcodjXzLRJM0pgU"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col relative w-full pt-4 pb-28 lg:pb-12 max-w-4xl mx-auto px-4">
        {/* Sync Toast Notification */}
        {showSyncBanner && (
          <div className="pt-4 pb-2">
            <div className="bg-[#8df5e4]/50 border border-[#8df5e4] text-[#00201c] rounded-2xl p-4 shadow-sm relative">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#00450d] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-[#00450d]">Pemasukan Otomatis Tersinkron! 🥛✨</span>
                    <span className="text-[10px] font-bold bg-white text-[#00450d] px-2 py-0.5 rounded-full">
                      Line 05 Parlor
                    </span>
                  </div>
                  <p className="text-xs text-[#005048] mt-1 leading-relaxed">
                    15 Mar 2025 • 16:30 WIB. Hasil perahan sore <strong>Sapi #07 Cantik</strong> (14.50 L • Rp 101.500) otomatis dibukukan ke Kas Penjualan Susu BMC-01 Rembangan.
                  </p>
                </div>
                <button 
                  onClick={() => setShowSyncBanner(false)}
                  className="absolute top-3 right-3 text-[#005048] hover:text-[#00201c] p-1 rounded-full hover:bg-white/40"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saldo Kas Aktif Kandang */}
        <div className="py-2">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#dee8ff] space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e7eeff] text-[#111c2d]">
                <span className="material-symbols-outlined text-[16px] text-[#00450d]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                <span className="text-xs font-bold uppercase tracking-wider">Buku Kas Mikro Kandang</span>
              </div>
              <span className="text-[11px] font-bold text-[#006b5f] bg-[#8df5e4]/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006b5f] animate-pulse"></span> Live Cloud Sync
              </span>
            </div>

            <div>
              <span className="text-xs text-[#717a6d] block font-medium">Saldo Kas Aktif Kandang</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl md:text-3xl font-extrabold text-[#111c2d] tracking-tight">
                  Rp {displayTotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#acf4a4] text-[#002203] text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +Rp {displayIncome.toLocaleString('id-ID')} sesi hari ini
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#dee8ff] text-[#111c2d] text-xs font-semibold">
                  +15.4% vs bulan lalu
                </span>
              </div>
            </div>

            {/* Grid Pemasukan & Pengeluaran */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="bg-[#f0f3ff] p-3.5 rounded-xl border border-[#dee8ff]">
                <div className="flex items-center gap-1 text-[#006b5f]">
                  <span className="material-symbols-outlined text-[16px]">arrow_downward_alt</span>
                  <span className="text-[11px] font-bold">Pemasukan Hari Ini</span>
                </div>
                <p className="text-base font-bold text-[#00450d] mt-1">Rp {displayIncome.toLocaleString('id-ID')}</p>
                <p className="text-[11px] text-[#717a6d]">Hasil susu & kas masuk</p>
              </div>

              <div className="bg-[#f0f3ff] p-3.5 rounded-xl border border-[#dee8ff]">
                <div className="flex items-center gap-1 text-[#6c2200]">
                  <span className="material-symbols-outlined text-[16px]">arrow_upward_alt</span>
                  <span className="text-[11px] font-bold">Pengeluaran Hari Ini</span>
                </div>
                <p className="text-base font-bold text-[#6c2200] mt-1">Rp {displayExpense.toLocaleString('id-ID')}</p>
                <p className="text-[11px] text-[#717a6d]">Pakan & operasional</p>
              </div>
            </div>

            {/* Banner IOFC */}
            <div className="bg-gradient-to-r from-[#e7eeff] to-[#dee8ff] p-3.5 rounded-xl flex items-center justify-between border border-[#dee8ff]">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#41493e]">
                    Marjin Pakan (IOFC) Hari Ini
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#1b5e20] text-white text-[10px] font-bold">
                    Net Surplus Aktif
                  </span>
                </div>
                <p className="text-base font-bold text-[#00450d]">Rp {displayIofc.toLocaleString('id-ID')}</p>
                <p className="text-[11px] text-[#717a6d] truncate">Parlor A & Line 05 Rembangan Dairy</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white text-[#00450d] flex items-center justify-center shrink-0 shadow-xs ml-2">
                <span className="material-symbols-outlined text-[20px]">savings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performer Card (Sapi #07 Cantik) */}
        <div className="py-2">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee8ff] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00450d] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>award_star</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00450d]">Top Performer Sesi Sore</span>
              </div>
              <span className="text-[10px] bg-[#acf4a4] text-[#002203] px-2.5 py-0.5 rounded-full font-bold">
                Laktasi 3 (Peak)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img 
                  alt="Sapi Cantik 07"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-xs" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbRFr9JUo0u3i9xbyhMo6KkHGYveZJ809KdSCRsqqb5dEECfQ3Qk79MRWeCaWZ5_Hot3KRJqRSQ3r08SiWU5nkR--RA0Nw5hn-PPW7ueVvzabPUYqdsxNbw3wrTiyH6dsfa4HMj-FMrDsUPpWkbxJW1j_T1jxzKCNud-SepGnAvAEzv2Oc6q3JHiQZrvWPIhLPZPXJVwIiM5X2hRFX3doiAdNjdBGhldVnnVEUjNzm2G4rzdgYvMvL" 
                />
                <div className="absolute -bottom-1 -right-1 bg-[#8df5e4] text-[#007165] text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                  #07
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-base text-[#111c2d]">Cantik (#07)</h4>
                <p className="text-xs text-[#717a6d]">FH Murni • Sesi Sore 14.50 L (Target 100%)</p>
                <p className="text-[11px] text-[#006b5f] font-semibold mt-0.5">Grade A+ SNI • SCC 115k • Fat 4.3%</p>
              </div>
            </div>

            {/* Financial Details Sapi #07 */}
            <div className="bg-[#f0f3ff] p-3 rounded-xl space-y-1.5 border border-[#dee8ff]">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#717a6d]">Omzet Harian (26.5 L total)</span>
                <span className="font-bold text-[#00450d]">Rp 185.500</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#717a6d]">Biaya Ransum Konsentrat</span>
                <span className="font-bold text-[#6c2200]">Rp 52.200</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-[#dee8ff]">
                <span className="font-bold text-[#111c2d]">Margin IOFC Sapi #07</span>
                <span className="font-bold text-[#00450d] text-sm">Rp 133.300 / hari</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Hub */}
        <div className="py-2 flex flex-col gap-2.5">
          <button 
            onClick={() => onNavigate?.('unduh_laporan_kas_mowtitis')}
            className="w-full h-12 rounded-full bg-[#00450d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-[#1b5e20] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Unduh & Cetak Laporan Kas (PDF)</span>
          </button>

          <button 
            onClick={() => onNavigate?.('kirim_laporan_wa_mowtitis')}
            className="w-full h-12 rounded-full bg-white border border-[#dee8ff] text-[#111c2d] hover:bg-[#f0f3ff] font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[#006b5f]">send</span>
            <span>Kirim Laporan PDF ke WhatsApp Koperasi</span>
          </button>

          <button 
            onClick={() => onNavigate?.('form_input_kas')}
            className="w-full py-2 text-center text-[#006b5f] text-xs font-bold hover:underline"
          >
            + Catat Pemasukan / Pengeluaran Kas Baru
          </button>
        </div>

        {/* Transaction History Filter & List */}
        <div className="py-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#111c2d]">Riwayat Transaksi Terkini</h3>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setActiveTab('semua')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'semua' ? 'bg-[#00450d] text-white' : 'bg-[#dee8ff] text-[#111c2d]'
                }`}
              >
                Semua
              </button>
              <button 
                onClick={() => setActiveTab('pemasukan')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'pemasukan' ? 'bg-[#00450d] text-white' : 'bg-[#dee8ff] text-[#111c2d]'
                }`}
              >
                Masuk
              </button>
              <button 
                onClick={() => setActiveTab('pengeluaran')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'pengeluaran' ? 'bg-[#00450d] text-white' : 'bg-[#dee8ff] text-[#111c2d]'
                }`}
              >
                Keluar
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {filteredTrx.map((trx) => (
              <div 
                key={trx.id}
                className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#dee8ff] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    trx.isIncome ? 'bg-[#acf4a4] text-[#002203]' : 'bg-[#dee8ff] text-[#6c2200]'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {trx.isIncome ? 'trending_up' : 'trending_down'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#111c2d] truncate">{trx.title}</p>
                    <p className="text-[11px] text-[#717a6d] mt-0.5">{trx.time}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs font-bold ${trx.isIncome ? 'text-[#00450d]' : 'text-[#6c2200]'}`}>
                    {trx.amount}
                  </span>
                  <span className="block text-[10px] text-[#717a6d] font-semibold mt-0.5">{trx.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeScreen="kas"
        onNavigate={onNavigate}
      />

      {/* Persistent Bottom Nav */}
      <MobileBottomNav activeScreen="kas" onNavigate={onNavigate} />
    </div>
  );
}
