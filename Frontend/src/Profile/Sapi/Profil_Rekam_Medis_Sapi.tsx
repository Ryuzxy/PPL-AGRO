import { useState } from 'react';
import type { ScreenType } from '../../App.tsx';
import { useCows } from '../../hooks/useSupabaseData';

interface ProfilRekamMedisSapiProps {
  onNavigate?: (screen: ScreenType) => void;
  cowId?: string;
  cowName?: string;
}

export default function ProfilRekamMedisSapi({
  onNavigate,
  cowId = '04',
  cowName = 'Mawar',
}: ProfilRekamMedisSapiProps) {
  const [activeTab, setActiveTab] = useState<'rekam_medis' | 'profil_fisik' | 'produksi'>('rekam_medis');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { cows: dbCows } = useCows();
  const currentCow = dbCows.find((c) => c.number === `#${cowId}` || c.id === cowId) || dbCows[0];

  const displayName = currentCow?.name || cowName;
  const displayTag = currentCow?.number || `#${cowId}`;
  const displayWeight = currentCow?.raw.berat_badan ? `${Number(currentCow.raw.berat_badan).toFixed(0)} kg` : '485 kg';
  const displayBcs = currentCow?.raw.skor_bcs || '3.20';
  const displayYield = currentCow?.raw.rerata_produksi_harian ? `${Number(currentCow.raw.rerata_produksi_harian).toFixed(1)} L` : '18.2 L';
  const displayStatus = currentCow?.raw.status_kesehatan || 'Sehat Produktif';
  const displayNotes = currentCow?.raw.catatan || 'Tidak ada catatan klinis tambahan.';
  const displayBreed = currentCow?.raw.ras || 'Friesian Holstein (FH)';
  const displayBarn = currentCow?.raw.lokasi_kandang || 'Kandang Laktasi A';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#263143] text-[#ecf1ff] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm z-50 animate-bounce">
          <span className="material-symbols-outlined text-[#8df5e4] text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff] px-4 py-3 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate?.('katalog')}
              className="w-10 h-10 rounded-full bg-white border border-[#dee8ff] flex items-center justify-center text-[#111c2d] hover:bg-[#f0f3ff] transition-transform active:scale-95 shadow-xs"
              title="Kembali ke Katalog"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-[#111c2d]">Profil &amp; Rekam Medis</h1>
              <span className="text-xs text-[#006b5f] font-semibold">
                Sapi {displayTag} {displayName} • {displayBarn}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => showToast('Tautan kartu medis berhasil disalin!')}
              className="w-9 h-9 rounded-full bg-[#e7eeff] flex items-center justify-center text-[#111c2d] hover:bg-[#dee8ff] transition-colors"
              title="Bagikan"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
            <button
              onClick={() => onNavigate?.('unduh_kas')}
              className="w-9 h-9 rounded-full bg-[#e7eeff] flex items-center justify-center text-[#111c2d] hover:bg-[#dee8ff] transition-colors"
              title="Unduh Kartu Medis"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-20 pb-32 flex flex-col gap-4">
        {/* Celebration Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#acf4a4] to-[#8df5e4] p-4 shadow-sm text-[#002203]">
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-[#00450d] flex items-center justify-center text-white shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-wide bg-[#00450d]/20 text-[#002203] px-2 py-0.5 rounded-full font-extrabold">
                  Status: {displayStatus}
                </span>
                <span className="text-[11px] text-[#0c5216] font-semibold">Supabase Synchronized</span>
              </div>
              <h2 className="text-base font-extrabold text-[#002203] mt-0.5">
                Kondisi Sapi {displayName} ({displayTag})
              </h2>
              <p className="text-xs text-[#0c5216] mt-0.5 leading-relaxed">
                {displayNotes}
              </p>
            </div>
          </div>
        </div>

        {/* Identity & Vitals Quick Strip */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white p-3 rounded-2xl border border-[#dee8ff] text-center shadow-xs">
            <span className="text-[10px] text-[#717a6d] font-bold block">Bobot</span>
            <span className="text-sm font-extrabold text-[#111c2d]">{displayWeight}</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-[#dee8ff] text-center shadow-xs">
            <span className="text-[10px] text-[#717a6d] font-bold block">BCS</span>
            <span className="text-sm font-extrabold text-[#111c2d]">{displayBcs}</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-[#dee8ff] text-center shadow-xs">
            <span className="text-[10px] text-[#717a6d] font-bold block">Produksi</span>
            <span className="text-sm font-extrabold text-[#006b5f]">{displayYield}</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-[#dee8ff] text-center shadow-xs">
            <span className="text-[10px] text-[#717a6d] font-bold block">Fase</span>
            <span className="text-sm font-extrabold text-[#111c2d] truncate">
              {currentCow?.raw.fase_laktasi || 'Laktasi'}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-xl bg-white p-1 border border-[#dee8ff] shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('rekam_medis')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'rekam_medis' ? 'bg-[#1b5e20] text-white shadow-xs' : 'text-[#41493e] hover:bg-[#f0f3ff]'
            }`}
          >
            Kronologi Terapi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profil_fisik')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'profil_fisik' ? 'bg-[#1b5e20] text-white shadow-xs' : 'text-[#41493e] hover:bg-[#f0f3ff]'
            }`}
          >
            Data Ternak &amp; Silsilah
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('produksi')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'produksi' ? 'bg-[#1b5e20] text-white shadow-xs' : 'text-[#41493e] hover:bg-[#f0f3ff]'
            }`}
          >
            Histori Susu
          </button>
        </div>

        {/* TAB 1: KRONOLOGI TERAPI */}
        {activeTab === 'rekam_medis' && (
          <div className="bg-white rounded-2xl p-5 border border-[#dee8ff] shadow-xs flex flex-col gap-4">
            <span className="text-xs font-bold text-[#111c2d] uppercase tracking-wider">
              Linimasa Penanganan Medis Mastitis
            </span>

            {/* Timeline Item 4 (Most Recent) */}
            <div className="flex gap-3 relative pb-4">
              <div className="w-8 h-8 rounded-full bg-[#acf4a4] text-[#002203] flex items-center justify-center shrink-0 shadow-xs z-10">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="flex flex-col flex-1 border-b border-[#f0f3ff] pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#00450d]">Status Terkini: {displayStatus}</span>
                  <span className="text-[10px] text-[#717a6d]">Terakhir update</span>
                </div>
                <p className="text-xs text-[#41493e] mt-1 leading-relaxed">
                  {displayNotes}
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex gap-3 relative pb-4">
              <div className="w-8 h-8 rounded-full bg-[#e7eeff] text-[#00450d] flex items-center justify-center shrink-0 shadow-xs z-10">
                <span className="material-symbols-outlined text-[16px]">medication</span>
              </div>
              <div className="flex flex-col flex-1 border-b border-[#f0f3ff] pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111c2d]">Terapi Salep Intramammar</span>
                  <span className="text-[10px] text-[#717a6d]">Pemberian Salep</span>
                </div>
                <p className="text-xs text-[#41493e] mt-1">
                  Aplikasi tube mastitis. Bengkak ambing kanan belakang dipantau mereda. Operator: Pak Hafid.
                </p>
              </div>
            </div>

            {/* Timeline Item 1 */}
            <div className="flex gap-3 relative">
              <div className="w-8 h-8 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 shadow-xs z-10">
                <span className="material-symbols-outlined text-[16px]">warning</span>
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#ba1a1a]">Deteksi Mastitis Awal (CNN &amp; Sensor)</span>
                  <span className="text-[10px] text-[#717a6d]">Skrining Ambing</span>
                </div>
                <p className="text-xs text-[#41493e] mt-1">
                  Pemeriksaan visual kuartir ambing dengan deteksi deep learning MowTitis.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFIL FISIK */}
        {activeTab === 'profil_fisik' && (
          <div className="bg-white rounded-2xl p-5 border border-[#dee8ff] shadow-xs flex flex-col gap-4">
            <span className="text-xs font-bold text-[#111c2d] uppercase tracking-wider">
              Data Fisik &amp; Identitas Ternak
            </span>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#f0f3ff]">
                <span className="text-[#717a6d]">Ear Tag ID</span>
                <span className="font-bold text-[#111c2d]">{displayTag}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f0f3ff]">
                <span className="text-[#717a6d]">Nama Sapi</span>
                <span className="font-bold text-[#111c2d]">{displayName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f0f3ff]">
                <span className="text-[#717a6d]">Ras / Bangsa</span>
                <span className="font-bold text-[#111c2d]">{displayBreed}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f0f3ff]">
                <span className="text-[#717a6d]">Lokasi Kandang</span>
                <span className="font-bold text-[#006b5f]">{displayBarn}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f0f3ff]">
                <span className="text-[#717a6d]">Skor Kondisi Tubuh (BCS)</span>
                <span className="font-bold text-[#00450d]">{displayBcs} / 5.0</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#717a6d]">Berat Badan</span>
                <span className="font-bold text-[#111c2d]">{displayWeight}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HISTORI SUSU */}
        {activeTab === 'produksi' && (
          <div className="bg-white rounded-2xl p-5 border border-[#dee8ff] shadow-xs flex flex-col gap-4">
            <span className="text-xs font-bold text-[#111c2d] uppercase tracking-wider">
              Performa Produksi Susu Harian
            </span>
            <div className="bg-[#f0f3ff] p-4 rounded-xl flex items-center justify-between border border-[#dee8ff]">
              <div>
                <span className="text-xs text-[#717a6d]">Rata-rata Harian</span>
                <p className="text-xl font-black text-[#00450d] mt-0.5">{displayYield} / Hari</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#acf4a4] text-[#002203] text-xs font-bold">
                Grade A SNI
              </span>
            </div>
            <p className="text-xs text-[#717a6d]">
              Susu dipantau oleh sensor flowmeter kandang dan tervalidasi secara otomatis ke buku kas mikro.
            </p>
          </div>
        )}

        {/* Quick Action Footer */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate?.('catat_pengobatan')}
            className="py-3 px-3 rounded-xl bg-white border border-[#dee8ff] text-[#111c2d] hover:bg-[#f0f3ff] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add_notes</span>
            <span>Tambah Catatan Terapi</span>
          </button>

          <button
            onClick={() => onNavigate?.('pemerahan')}
            className="py-3 px-3 rounded-xl bg-[#1b5e20] hover:bg-[#00450d] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">sensors</span>
            <span>Mulai Perah Sore</span>
          </button>
        </div>
      </main>
    </div>
  );
}
