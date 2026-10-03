import { useState, useEffect } from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';
import './Opening.css';
import mowtitisIcon from './assets/mowtitis_icon.png';

interface OpeningProps {
  onNavigateToDashboard?: () => void;
}

export default function Opening({ onNavigateToDashboard }: OpeningProps) {
  const [splashExiting, setSplashExiting] = useState(false);

  useEffect(() => {
    // Stage 1: Play pulse & loading bar for 1.8s
    const exitTimer = setTimeout(() => {
      setSplashExiting(true);
    }, 1800);

    // Stage 2: After fade-out animation (0.5s), transition directly to Dashboard Web
    const navTimer = setTimeout(() => {
      onNavigateToDashboard?.();
    }, 2350);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(navTimer);
    };
  }, [onNavigateToDashboard]);

  return (
    <div
      id="splash-screen"
      className={`stitch-splash-overlay ${splashExiting ? 'splash-exit' : ''}`}
      aria-label="MowTitis Entrance Transition"
      onClick={() => onNavigateToDashboard?.()}
      style={{ cursor: 'pointer' }}
    >
      {/* Ambient background glows */}
      <div className="splash-ambient-glow glow-top-left" />
      <div className="splash-ambient-glow glow-bottom-right" />
      <div className="splash-ambient-glow glow-center" />

      {/* Top Status Bar */}
      <div className="splash-top-bar">
        <div className="iot-status">
          <span className="status-ping" />
          <span>IOT SENSOR ONLINE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="farm-hub-tag">REMBANGAN HUB</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigateToDashboard?.();
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#8df5e4] text-[11px] font-semibold transition-colors backdrop-blur-md"
            title="Langsung Masuk ke Dashboard"
          >
            <span>Lewati</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Central Logo, Branding & Pulse Radar */}
      <div className="splash-center-content">
        <div className="splash-logo-box">
          <div className="pulse-ring-effect" />
          <div className="splash-app-badge">
            <img
              src={mowtitisIcon}
              alt="MowTitis Logo"
              className="splash-logo-img"
            />
          </div>
          <span className="splash-badge-corner">AI BIO</span>
        </div>

        <div className="splash-title-row">
          <h1 className="splash-title">MowTitis</h1>
          <span className="version-pill">v4.2</span>
        </div>
        <p className="splash-subtitle">Smart Dairy &amp; Herd AI System</p>

        {/* Radar Loading Progress Bar */}
        <div className="splash-progress-wrapper">
          <div className="splash-progress-track">
            <div className="splash-progress-bar" />
          </div>
          <div className="splash-loading-text">
            <RefreshCw size={13} className="spin-icon text-[#8df5e4]" />
            <span>Menghubungkan ke IoT Rembangan Farm...</span>
          </div>
        </div>
      </div>

      {/* Bottom Footprint */}
      <div className="splash-footer">
        <p>Kandang Laktasi Percontohan • CNN &amp; XGBoost</p>
      </div>
    </div>
  );
}
