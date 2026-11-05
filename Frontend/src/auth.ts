import { supabase } from './lib/supabase';
import type { Json } from './types/supabase';

export type UserRole = 'owner' | 'farmer';

export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
}

export const FARMER_SCREENS = new Set([
  'dashboard',
  'dashboard_kandang_mowtitis',
  // Udder checks only.
  'deteksi',
  'pilih_sapi_deteksi_cnn',
  'deteksi_mastitis_cnn_inspeksi',
  'hasil_deteksi_mastitis',
  'pemindai_rfid',
  'ketik_manual_eartag',
  'telemetri_rutin',
  // Feed estimation: view/select, not financial application.
  'prediksi',
  'simulasi_whatif',
  // Cattle read-only views.
  'katalog',
  'profil_sapi',
  'riwayat_sapi',
  // Cash: view and add only.
  'kas',
  'buku_kas_mikro_mowtitis',
  'riwayat_kas',
  'form_input_kas',
  'form_input_pengeluaran',
  'input_pengeluaran_medis',
  'pengeluaran_medis',
]);

export function canAccessScreen(role: UserRole, screen: string) {
  return role === 'owner' || FARMER_SCREENS.has(screen);
}

export function setActiveRole(role: UserRole | null) {
  if (role) sessionStorage.setItem('mowtitis-role', role);
  else sessionStorage.removeItem('mowtitis-role');
}

export function isFarmerSession() {
  return sessionStorage.getItem('mowtitis-role') === 'farmer';
}

export async function getCurrentAppUser(): Promise<AppUser | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (error || !data || (data.role !== 'owner' && data.role !== 'farmer')) {
    await supabase.auth.signOut();
    return null;
  }

  setActiveRole(data.role);
  return { id: session.user.id, email: session.user.email ?? '', role: data.role };
}

export async function recordActivity(userId: string, action: string, metadata: { [key: string]: Json | undefined } = {}) {
  const { error } = await supabase.from('activity_logs').insert({
    user_id: userId,
    action,
    metadata,
  });
  if (error) throw error;
}

export async function signIn(email: string, password: string, selectedRole: UserRole) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Akun tidak ditemukan.');

  const appUser = await getCurrentAppUser();
  if (!appUser) throw new Error('Profil pengguna belum memiliki peran.');
  if (appUser.role !== selectedRole) {
    await supabase.auth.signOut();
    throw new Error(`Akun ini terdaftar sebagai ${appUser.role === 'owner' ? 'owner' : 'farmer'}.`);
  }

  await recordActivity(appUser.id, 'login', { role: appUser.role });
  return appUser;
}
