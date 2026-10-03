import { useState } from 'react';
import type { ScreenType } from '../App.tsx';

interface KirimLaporanWAProps {
  onNavigate?: (screen: ScreenType) => void;
  initialReportType?: 'kas_harian' | 'rekap_kawanan' | 'pasca_medis';
}

export default function KirimLaporanWA({ onNavigate, initialReportType = 'kas_harian' }: KirimLaporanWAProps) {
  const [reportType, setReportType] = useState<'kas_harian' | 'rekap_kawanan' | 'pasca_medis'>(initialReportType);
  const [phone, setPhone] = useState('6281234567890');
  const [recipientName, setRecipientName] = useState('Pak Bambang (KUD Argopuro Jaya / Koperasi Rembangan)');
  const [isSending, setIsSending] = useState(false);

  // Pre-configured message templates
  const templates = {
    kas_harian: `*Yth. ${recipientName}*\n\nBerikut terlampir *Laporan Buku Kas Mikro Kandang & IOFC*:\n\n📅 *Periode:* 15 Maret 2025 (Shift Sore)\n🥛 *Total Susu:* 143.05 Liter (Grade A SNI)\n💵 *Omzet Susu:* Rp 1.001.350\n🌾 *Biaya Pakan:* Rp 245.000\n📈 *Marjin IOFC:* Rp 756.350 (75.5%)\n\nDokumen resmi telah tervalidasi sensor IoT Timbangan & RFID Eartag Mowtitis AI. Mohon diproses untuk pencairan setoran KUD.\n\n_Salam hormat,_\n*Pak Hafid - Kandang Rembangan*`,
    rekap_kawanan: `*Yth. Pengurus Koperasi Susu Rembangan*\n\nBerikut terlampir *Rekapitulasi Produksi Kawanan Sapi Perah (18 Ekor)*:\n\n📅 *Tanggal:* 15 Maret 2025\n🥛 *Produksi Harian:* 382.4 Liter (Rata-rata 21.2 L/ekor)\n🟢 *Sapi Sehat Produktif:* 17 Ekor (94.4%)\n🟡 *Karantina / Pemulihan:* 1 Ekor (#04 Mawar)\n🧪 *Rata-rata SCC Kawanan:* 185.000 sel/mL (Kategori Bebas Mastitis)\n\nTerlampir file PDF resmi tersertifikasi MowTitis AI System.`,
    pasca_medis: `*Yth. Tim Medis Veteriner & Koperasi*\n\nUpdate *Pasca Pemulihan Mastitis Sapi #04 (Mawar)*:\n\n💉 *Terapi:* Salep Intramammar (Tube 3/3 Tuntas)\n⏱️ *Masa Withdrawal:* Selesai (24 Jam)\n🔬 *Hasil Rapid Test SCC:* 145.000 sel/mL (Negatif / Sehat)\n✅ *Rekomendasi:* Sapi layak dikembalikan ke Milk Parlor Utama besok pagi.\n\n_Salam hormat,_\n*Mantri Ternak Rembangan*`
  };

  const [message, setMessage] = useState(templates[reportType]);

  const handleSwitchTemplate = (type: 'kas_harian' | 'rekap_kawanan' | 'pasca_medis') => {
    setReportType(type);
    setMessage(templates[type]);
  };

  const handleSendWA = () => {
    setIsSending(true);
    // Construct WhatsApp Click-to-Chat URL
    const encodedText = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=${phone.replace(/\D/g, '')}&text=${encodedText}`;
    
    // Open WhatsApp in new tab
    window.open(waUrl, '_blank');

    setTimeout(() => {
      setIsSending(false);
      onNavigate?.('sukses_wa');
    }, 1000);
  };

  return (
    <div className="bg-[#f9f9ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#111c2d] min-h-screen flex flex-col antialiased">
      {/* Top Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#dee8ff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#00450d] flex items-center justify-center text-[#8df5e4] shadow-xs">
              <span className="material-symbols-outlined text-[20px]">send_to_mobile</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-[#00450d] leading-none">Mowtitis</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#acf4a4] text-[#002203] leading-none">WA Gateway</span>
              </div>
              <span className="text-[11px] text-[#006b5f] leading-none mt-0.5">Kirim Laporan Resmi Koperasi</span>
            </div>
          </div>

          <button 
            onClick={() => onNavigate?.('buku_kas_mikro_mowtitis')}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#41493e] hover:bg-[#e7eeff] transition-colors"
            title="Tutup"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col relative w-full pt-20 pb-28 max-w-2xl mx-auto px-4">
        {/* Template Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3">
          <button
            onClick={() => handleSwitchTemplate('kas_harian')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              reportType === 'kas_harian'
                ? 'bg-[#1b5e20] text-white shadow-sm'
                : 'bg-white border border-[#dee8ff] text-[#41493e] hover:bg-[#f0f3ff]'
            }`}
          >
            💰 Kas Mikro & IOFC
          </button>
          <button
            onClick={() => handleSwitchTemplate('rekap_kawanan')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              reportType === 'rekap_kawanan'
                ? 'bg-[#1b5e20] text-white shadow-sm'
                : 'bg-white border border-[#dee8ff] text-[#41493e] hover:bg-[#f0f3ff]'
            }`}
          >
            🥛 Rekapitulasi Kawanan
          </button>
          <button
            onClick={() => handleSwitchTemplate('pasca_medis')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              reportType === 'pasca_medis'
                ? 'bg-[#1b5e20] text-white shadow-sm'
                : 'bg-white border border-[#dee8ff] text-[#41493e] hover:bg-[#f0f3ff]'
            }`}
          >
            🩺 Pasca Medis & SCC
          </button>
        </div>

        {/* Recipient Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#dee8ff] shadow-xs mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#717a6d] mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#006b5f]">contact_phone</span>
            Tujuan Pengiriman
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <label className="text-[11px] font-semibold text-[#41493e]">Nama Kontak / Instansi</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-[#dee8ff] bg-[#f9f9ff] focus:outline-none focus:border-[#1b5e20] font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#41493e]">Nomor WhatsApp (dengan kode 62)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="6281234567890"
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-[#dee8ff] bg-[#f9f9ff] focus:outline-none focus:border-[#1b5e20] font-mono"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Chat Preview Simulation */}
        <div className="bg-[#e5ddd5] rounded-2xl p-4 border border-[#cfdaf2] shadow-sm relative overflow-hidden mb-4">
          {/* WA Chat Bubble Header */}
          <div className="flex items-center gap-2.5 pb-3 border-b border-black/10 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#25d366] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-[#111c2d] truncate">{recipientName}</span>
              <span className="text-[10px] text-[#41493e]">WhatsApp Business • Terhubung</span>
            </div>
          </div>

          {/* Chat Message Bubble */}
          <div className="bg-white rounded-xl rounded-tr-xs p-3.5 shadow-xs text-xs text-[#111c2d] whitespace-pre-wrap leading-relaxed font-sans border-l-4 border-[#25d366]">
            {message}
            <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-gray-400">
              <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-[#25d366] font-bold">✓✓</span>
            </div>
          </div>

          {/* Editable Textarea for Customization */}
          <div className="mt-3">
            <label className="text-[11px] font-semibold text-[#41493e] mb-1 block">Edit Pesan Sebelum Mengirim:</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-white bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#25d366] text-[#111c2d]"
            />
          </div>
        </div>

        {/* Attachment Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#dee8ff] shadow-xs flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#111c2d]">
                {reportType === 'kas_harian' ? 'Laporan_Kas_Rembangan_15Mar2025.pdf' : reportType === 'rekap_kawanan' ? 'Rekap_Kawanan_Produksi_Susu.pdf' : 'Laporan_Medis_SCC_Sapi04.pdf'}
              </span>
              <span className="text-[10px] text-[#717a6d]">Tersertifikasi MowTitis AI • 1.2 MB</span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#006b5f] bg-[#8df5e4]/40 px-2 py-1 rounded-md">Siap Terlampir</span>
        </div>
      </main>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#dee8ff] p-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => onNavigate?.('buku_kas_mikro_mowtitis')}
            className="flex-1 py-3 px-4 rounded-xl border border-[#dee8ff] text-[#41493e] font-bold text-sm hover:bg-[#f0f3ff] transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSendWA}
            disabled={isSending}
            className="flex-2 py-3 px-6 rounded-xl bg-[#25d366] hover:bg-[#20ba59] active:scale-98 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSending ? (
              <>
                <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                <span>Membuka WhatsApp...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>Kirim via WhatsApp</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
