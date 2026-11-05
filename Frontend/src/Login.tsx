import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, LockKeyhole, ShieldCheck, Sprout } from 'lucide-react';
import { signIn, type AppUser, type UserRole } from './auth';
import './Login.css';

interface LoginProps {
  onAuthenticated: (user: AppUser) => void;
}

export default function Login({ onAuthenticated }: LoginProps) {
  const [role, setRole] = useState<UserRole>('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      onAuthenticated(await signIn(email.trim(), password, role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand"><span className="login-logo"><Sprout size={24} /></span><span>MowTitis</span></div>
        <p className="login-eyebrow">REMBANGAN DAIRY FARM</p>
        <h1 id="login-title">Masuk ke sistem peternakan</h1>
        <p className="login-description">Pilih peran akun. Hak akses ditentukan server melalui profil Supabase.</p>

        <div className="role-picker" aria-label="Jenis pengguna">
          <button type="button" className={role === 'farmer' ? 'role-option active' : 'role-option'} onClick={() => setRole('farmer')}>
            <Sprout size={18} /><span><b>Farmer</b><small>Operasional kandang</small></span>
          </button>
          <button type="button" className={role === 'owner' ? 'role-option active' : 'role-option'} onClick={() => setRole('owner')}>
            <ShieldCheck size={18} /><span><b>Owner</b><small>Akses penuh sistem</small></span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@farm.id" autoComplete="email" /></label>
          <label>Password<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password" autoComplete="current-password" /></label>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="login-submit" type="submit" disabled={busy}>{busy ? 'Memeriksa...' : `Masuk sebagai ${role === 'owner' ? 'Owner' : 'Farmer'}`}<ArrowRight size={18} /></button>
        </form>
        <p className="login-secure"><LockKeyhole size={14} /> Aktivitas login dicatat aman ke database</p>
      </section>
    </main>
  );
}
