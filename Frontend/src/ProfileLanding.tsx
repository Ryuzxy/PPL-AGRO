import { useMemo } from 'react';
import { ArrowRight, LogOut, ShieldCheck, Sprout, UserRound } from 'lucide-react';
import { supabase } from './lib/supabase';
import { recordActivity, type AppUser } from './auth';
import './ProfileLanding.css';

interface ProfileLandingProps {
  user: AppUser;
  onContinue: () => void;
  onSignedOut: () => void;
}

export default function ProfileLanding({ user, onContinue, onSignedOut }: ProfileLandingProps) {
  const name = useMemo(() => user.email.split('@')[0] || 'Pengguna', [user.email]);
  const isOwner = user.role === 'owner';

  async function handleSignOut() {
    await recordActivity(user.id, 'logout');
    await supabase.auth.signOut();
    onSignedOut();
  }

  return (
    <main className="profile-landing">
      <section className="profile-hero">
        <div className="profile-topline"><span className="profile-mark"><UserRound size={22} /></span><b>MowTitis</b><span className="profile-farm">Rembangan Dairy Farm</span></div>
        <div className="profile-avatar">{name.slice(0, 1).toUpperCase()}</div>
        <p className="profile-kicker">SELAMAT DATANG KEMBALI</p>
        <h1>{name}</h1>
        <p className="profile-email">{user.email}</p>
        <span className={`profile-role ${isOwner ? 'owner' : 'farmer'}`}>{isOwner ? <ShieldCheck size={15} /> : <Sprout size={15} />}{isOwner ? 'Owner · Akses penuh' : 'Farmer · Operasional kandang'}</span>

        <div className="profile-summary">
          <div><strong>{isOwner ? 'Semua modul' : 'Modul lapangan'}</strong><span>{isOwner ? 'Dashboard, kas, laporan, konfigurasi' : 'Sapi, pemerahan, kesehatan, AI'}</span></div>
          <div><strong>Database aktif</strong><span>Aktivitas akun tercatat otomatis</span></div>
        </div>
        <div className="profile-actions"><button className="profile-primary" onClick={onContinue}>Masuk ke dashboard <ArrowRight size={18} /></button><button className="profile-secondary" onClick={handleSignOut}><LogOut size={16} /> Keluar</button></div>
      </section>
    </main>
  );
}
