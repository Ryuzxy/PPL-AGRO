import { AlertTriangle, ArrowLeft, Home, RefreshCw, ShieldAlert } from 'lucide-react';
import './ErrorPage.css';

export type ErrorCode = 400 | 401 | 403 | 404 | 500;

interface ErrorPageProps {
  code: ErrorCode;
  onHome?: () => void;
  onRetry?: () => void;
}

const ERROR_COPY: Record<ErrorCode, { title: string; description: string; action: string; icon: typeof AlertTriangle }> = {
  400: { title: 'Permintaan tidak valid', description: 'Data yang dikirim tidak dapat diproses. Periksa kembali lalu coba lagi.', action: 'Coba lagi', icon: AlertTriangle },
  401: { title: 'Sesi diperlukan', description: 'Sesi login tidak ditemukan atau sudah berakhir.', action: 'Kembali ke login', icon: ShieldAlert },
  403: { title: 'Akses dibatasi', description: 'Akun Anda tidak memiliki izin untuk membuka halaman ini.', action: 'Kembali ke dashboard', icon: ShieldAlert },
  404: { title: 'Halaman tidak ditemukan', description: 'Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.', action: 'Ke beranda', icon: Home },
  500: { title: 'Gangguan pada server', description: 'Terjadi masalah saat memproses permintaan. Data Anda tetap aman.', action: 'Muat ulang halaman', icon: RefreshCw },
};

export default function ErrorPage({ code, onHome, onRetry }: ErrorPageProps) {
  const copy = ERROR_COPY[code];
  const Icon = copy.icon;
  const primaryAction = code === 500 ? onRetry : onHome;

  return (
    <main className="error-page" role="main">
      <section className="error-card" aria-labelledby="error-title">
        <div className="error-brand"><span className="error-brand-mark">MT</span><span>MowTitis</span><small>Rembangan Dairy Farm</small></div>
        <div className="error-icon"><Icon size={28} /></div>
        <p className="error-code">ERROR {code}</p>
        <h1 id="error-title">{copy.title}</h1>
        <p className="error-description">{copy.description}</p>
        <div className="error-actions">
          {primaryAction && <button className="error-primary" onClick={primaryAction}>{code === 500 && <RefreshCw size={17} />}{copy.action}</button>}
          {onHome && code !== 404 && <button className="error-secondary" onClick={onHome}><ArrowLeft size={16} /> Ke dashboard</button>}
        </div>
        <p className="error-reference">Kode referensi: MT-{code}-{new Date().getFullYear()}</p>
      </section>
    </main>
  );
}
