import { useEffect, useState, useCallback } from 'react';
import { supabase, type Sapi, type Pemasukan, type Pengeluaran, type HistoriSusu } from '../lib/supabase';

// Type representing a cow for the UI with both DB and display fields
export interface UICow {
  id: string;
  dbId: number;
  rawId: number;
  number: string;
  name: string;
  tag: string;
  eartag: string;
  rfid: string;
  stall: string;
  breed: string;
  age: string;
  dim: number;
  weight: number;
  milkYield: number;
  status: string;
  statusLabel: string;
  healthStatus: string;
  cnnStatus: string;
  temp: number | string;
  photoUrl: string;
  scheduleText: string;
  scheduleWarning?: boolean;
  isHealthy: boolean;
  metric1Label: string;
  metric1Val: string;
  metric2Label: string;
  metric2Val: string;
  image: string;
  kategori: 'semua' | 'kandang_a' | 'kandang_b' | 'perlu_cek';
  raw: Sapi;
}

export interface CashTransaction {
  id: string;
  dbId: number;
  title: string;
  category: string;
  amount: string;
  rawAmount: number;
  time: string;
  date: string;
  isIncome: boolean;
  type: 'income' | 'expense' | 'pemasukan' | 'pengeluaran';
  keterangan: string;
  badge: string;
  notes?: string;
}

// Fallback images in case DB image isn't set yet
const DEFAULT_COW_IMAGES: Record<string, string> = {
  'Cantik': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSPOprSbV4tXxwlGCW9eZ8NXQ75ku0vyBtEWoqXuVW9GI-JUyx8b4nRo7bnOEIkiTOueP2KWJoXhaS6u2Dsk576BwSyDkRQRTz-Lt4csMW0FAUzLbDLuEkZKiUts5nR8AQEIqwI91zTSkt7VZZj5wmDqrotp-ygxtafrKezUz4T5SVD3vQwrpXeuLcqjQpsJPk5Iv6f4Glo4L_d7T-I4oL1Ero-Bpp-vGegCSWCUsyttFpJeh0DZXw',
  'Sekar': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7EvobBWcbpU-4fA6c4j0EMD7VO_6XweeX2EJKQ7KRcW2h3lCWAJ1Wt126zgRwG3Fw7JBawHHCv4rzm6XwnDAdK739UrxZQsN7i7Vjyn0Hb9IH8zZJjl9EwOMbtCFEL9FL5EVKscfSSdh4mCI2rnuO2ltQ8hxaHN3dCQGTEhMU4S6GMwNCFYgxgp8z5i_17ZjmMO6n0Cw4PfxH3FOM4eS4RpQkqNS-1No1hwpPEDk21dbYIFAw2NqJ',
  'Melati': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfrE1eDrWFkuHXMJa7twfmYy1OPpAX1dzP-O19Etd7D-c_5uHjzzlihyuYyTpx2DyOdey9FKCUp2VVAVbb9wrRYGd14wsPReEvb_th7N3cQf8qk2QIeKLdDAkxEHIniUsKaU6nG-zxJs8s64FFgpa9ofwvPW0RWhfK8G4AEdKIQ9TvpuqdGQji1MWXWXsAET-MGsV_XEm4lyWSE9e_NZT5QqI2oOeB0wrLv5Tow3jmmpnP7h4anQHC',
  'Mawar': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCn3kRgbAx07X77LMnuqcwbQC7BrG-fmY-mSukU217UIhHqJ3dLDWHrOAl2mbn6u7-hdo3MMuzWKdRzDRUvroVvZkstq_mT3OwIFVuR4bm67kfE2X5cVxoDGkklIOXdApAkboytBZ5HjMSTGireDwYVZdJ5MgkRC4OrheTKI43vlFt1v5K4D923Hm4T3r8MRZxlROIaTdyjRYY6ApXYOeQeQe6eiWyaoB8Hsv6tIcodjXzLRJM0pgU',
  'Kenanga': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbRFr9JUo0u3i9xbyhMo6KkHGYveZJ809KdSCRsqqb5dEECfQ3Qk79MRWeCaWZ5_Hot3KRJqRSQ3r08SiWU5nkR--RA0Nw5hn-PPW7ueVvzabPUYqdsxNbw3wrTiyH6dsfa4HMj-FMrDsUPpWkbxJW1j_T1jxzKCNud-SepGnAvAEzv2Oc6q3JHiQZrvWPIhLPZPXJVwIiM5X2hRFX3doiAdNjdBGhldVnnVEUjNzm2G4rzdgYvMvL',
};

// 1. Hook for Cows
export function useCows() {
  const [cows, setCows] = useState<UICow[]>([]);
  const [archivedCows, setArchivedCows] = useState<UICow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapSapiToUICow = (s: Sapi): UICow => {
    const idStr = String(s.id).padStart(2, '0');
    const isHealthy = s.status_kesehatan === 'Sehat';
    const isKandangA = s.lokasi_kandang?.toLowerCase().includes('a') ?? false;
    const isKandangB = s.lokasi_kandang?.toLowerCase().includes('b') ?? false;
    
    let kategori: 'semua' | 'kandang_a' | 'kandang_b' | 'perlu_cek' = 'semua';
    if (!isHealthy) kategori = 'perlu_cek';
    else if (isKandangA) kategori = 'kandang_a';
    else if (isKandangB) kategori = 'kandang_b';

    const photoUrl = s.foto_profil_url || DEFAULT_COW_IMAGES[s.nama] || DEFAULT_COW_IMAGES['Cantik'];
    const milkYield = Number(s.rerata_produksi_harian) || 16.5;
    const weight = Number(s.berat_badan) || 510;

    // Compute Days In Milk (DIM) or realistic baseline
    let dim = 115;
    if (s.tanggal_melahirkan) {
      const birthDiff = Math.floor((Date.now() - new Date(s.tanggal_melahirkan).getTime()) / (1000 * 60 * 60 * 24));
      if (birthDiff > 0 && birthDiff < 600) dim = birthDiff;
    }

    // Age display
    let age = '3.5';
    if (s.tanggal_lahir) {
      const ageYears = (Date.now() - new Date(s.tanggal_lahir).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (ageYears > 0) age = ageYears.toFixed(1);
    }

    const status = s.fase_laktasi || (isHealthy ? 'Laktasi' : 'Karantina');
    const statusLabel = isHealthy ? 'Sehat Produktif' : (s.status_kesehatan || 'Karantina Mastitis');
    const cnnStatus = isHealthy ? 'Normal / Sehat' : 'Subklinis Kuartir';

    return {
      id: `#${idStr}`,
      dbId: s.id,
      rawId: s.id,
      number: `#${idStr}`,
      name: s.nama,
      tag: `${s.fase_laktasi || 'Laktasi'} • ${s.lokasi_kandang || 'Kandang'}`,
      eartag: s.eartag,
      rfid: s.eartag,
      stall: s.lokasi_kandang || `Stall #${idStr}`,
      breed: s.ras || 'Friesian Holstein (FH)',
      age,
      dim,
      weight,
      milkYield,
      status,
      statusLabel,
      healthStatus: isHealthy ? '100% Sehat' : (s.status_kesehatan || 'Perlu Cek'),
      cnnStatus,
      temp: '38.4',
      photoUrl,
      scheduleText: isHealthy ? 'Jadwal Rutin Pemerahan' : 'Perlu Evaluasi Khusus',
      scheduleWarning: !isHealthy,
      isHealthy,
      metric1Label: isHealthy ? 'Rerata Produksi' : 'Kondisi Ambing',
      metric1Val: isHealthy ? `${milkYield} L / Hari` : 'Kuartir Sensitif',
      metric2Label: 'Skor BCS',
      metric2Val: `${s.skor_bcs || 3.25} / 5.0`,
      image: photoUrl,
      kategori,
      raw: s,
    };
  };

  const fetchCows = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('sapi')
        .select('*')
        .order('id', { ascending: true });

      if (err) throw err;

      if (data && data.length > 0) {
        const active = data.filter((s: Sapi) => !s.is_deleted).map(mapSapiToUICow);
        const archived = data.filter((s: Sapi) => !!s.is_deleted).map(mapSapiToUICow);
        setCows(active);
        setArchivedCows(archived);
      } else {
        setCows([]);
        setArchivedCows([]);
      }
    } catch (e: any) {
      console.error('Error fetching cows from Supabase:', e);
      setError(e.message || 'Gagal memuat data sapi');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCow = async (cowData: {
    nama: string;
    eartag: string;
    ras?: string;
    fase_laktasi?: string;
    lokasi_kandang?: string;
    status_kesehatan?: string;
    berat_badan?: number;
    skor_bcs?: number;
    rerata_produksi_harian?: number;
    catatan?: string;
    foto_profil_url?: string;
  }) => {
    const { data, error } = await supabase.from('sapi').insert([{
      nama: cowData.nama,
      eartag: cowData.eartag,
      ras: cowData.ras || 'Friesian Holstein (FH)',
      fase_laktasi: cowData.fase_laktasi || 'Laktasi',
      lokasi_kandang: cowData.lokasi_kandang || 'Kandang A-01',
      status_kesehatan: cowData.status_kesehatan || 'Sehat',
      berat_badan: cowData.berat_badan ?? 500,
      skor_bcs: cowData.skor_bcs ?? 3.25,
      rerata_produksi_harian: cowData.rerata_produksi_harian ?? 18.0,
      catatan: cowData.catatan || null,
      foto_profil_url: cowData.foto_profil_url || null,
      is_deleted: false,
    }]).select();

    if (error) throw error;
    await fetchCows();
    return data;
  };

  const deleteCow = async (id: number) => {
    // Soft delete: set is_deleted to true
    const { error } = await supabase
      .from('sapi')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) throw error;
    await fetchCows();
  };

  const restoreCow = async (id: number) => {
    const { error } = await supabase
      .from('sapi')
      .update({ is_deleted: false })
      .eq('id', id);

    if (error) throw error;
    await fetchCows();
  };

  useEffect(() => {
    fetchCows();

    // Subscribe to realtime changes on sapi table
    const channel = supabase
      .channel('realtime_sapi')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sapi' },
        () => {
          fetchCows();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCows]);

  return { cows, archivedCows, loading, error, refetch: fetchCows, addCow, deleteCow, restoreCow };
}

// 2. Hook for Cash Flow
export function useCashflow() {
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [archivedTransactions, setArchivedTransactions] = useState<CashTransaction[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(18946900); // Baseline start
  const [todayIncome, setTodayIncome] = useState<number>(0);
  const [todayExpense, setTodayExpense] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const [incomesRes, expensesRes] = await Promise.all([
        supabase
          .from('pemasukan')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('pengeluaran')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      if (incomesRes.error) throw incomesRes.error;
      if (expensesRes.error) throw expensesRes.error;

      const incData: Pemasukan[] = incomesRes.data || [];
      const expData: Pengeluaran[] = expensesRes.data || [];

      let sumIncome = 0;
      let sumExpense = 0;

      const activeList: CashTransaction[] = [];
      const archivedList: CashTransaction[] = [];

      incData.forEach((inc) => {
        const isDel = !!inc.is_deleted;
        if (!isDel) {
          sumIncome += inc.jumlah;
        }
        const d = inc.tanggal ? new Date(inc.tanggal) : (inc.created_at ? new Date(inc.created_at) : new Date());
        const item: CashTransaction = {
          id: `INC-${inc.id}`,
          dbId: inc.id,
          title: inc.keterangan || `Pemasukan #${inc.id}`,
          category: inc.kategori || 'Pemasukan Kas',
          amount: `+Rp ${inc.jumlah.toLocaleString('id-ID')}`,
          rawAmount: inc.jumlah,
          time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          isIncome: true,
          type: 'income',
          keterangan: inc.keterangan || inc.kategori || 'Pemasukan Kas',
          badge: inc.volume_liter ? `${inc.volume_liter} L Susu` : 'Kas Masuk',
          notes: inc.nomor_rekap_wa || undefined,
        };

        if (isDel) {
          archivedList.push(item);
        } else {
          activeList.push(item);
        }
      });

      expData.forEach((exp) => {
        const isDel = !!exp.is_deleted;
        if (!isDel) {
          sumExpense += exp.jumlah;
        }
        const d = exp.tanggal ? new Date(exp.tanggal) : (exp.created_at ? new Date(exp.created_at) : new Date());
        const item: CashTransaction = {
          id: `EXP-${exp.id}`,
          dbId: exp.id,
          title: exp.keterangan || `Pengeluaran #${exp.id}`,
          category: exp.kategori || 'Pengeluaran Kas',
          amount: `-Rp ${exp.jumlah.toLocaleString('id-ID')}`,
          rawAmount: exp.jumlah,
          time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          isIncome: false,
          type: 'expense',
          keterangan: exp.keterangan || exp.kategori || 'Pengeluaran Kas',
          badge: exp.kategori || 'Beban Kas',
          notes: exp.bukti_transaksi_url || undefined,
        };

        if (isDel) {
          archivedList.push(item);
        } else {
          activeList.push(item);
        }
      });

      // Sort all combined transactions by dbId desc
      activeList.sort((a, b) => b.dbId - a.dbId);
      archivedList.sort((a, b) => b.dbId - a.dbId);

      // Starting reserve balance + sum of new dynamic cashflows
      const baseReserve = 17500000;
      setTotalBalance(baseReserve + sumIncome - sumExpense);
      setTodayIncome(sumIncome);
      setTodayExpense(sumExpense);
      setTransactions(activeList);
      setArchivedTransactions(archivedList);
    } catch (e: any) {
      console.error('Error fetching cashflow from Supabase:', e);
      setError(e.message || 'Gagal memuat kas');
    } finally {
      setLoading(false);
    }
  }, []);

  const addIncome = async (params: {
    jumlah: number;
    kategori?: string;
    keterangan?: string;
    volume_liter?: number;
    sapi_id?: number;
    nomor_rekap_wa?: string;
  }) => {
    const { data, error } = await supabase.from('pemasukan').insert([{
      jumlah: params.jumlah,
      kategori: params.kategori || 'Susu Segar (Koperasi)',
      keterangan: params.keterangan || 'Penjualan Susu',
      volume_liter: params.volume_liter || null,
      sapi_id: params.sapi_id || null,
      nomor_rekap_wa: params.nomor_rekap_wa || null,
      tanggal: new Date().toISOString().split('T')[0],
      is_deleted: false,
    }]).select();

    if (error) throw error;
    await fetchTransactions();
    return data;
  };

  const addExpense = async (params: {
    jumlah: number;
    kategori?: string;
    keterangan?: string;
    sapi_id?: number;
    pakan_id?: number;
    bukti_transaksi_url?: string;
  }) => {
    const { data, error } = await supabase.from('pengeluaran').insert([{
      jumlah: params.jumlah,
      kategori: params.kategori || 'Operasional Pakan',
      keterangan: params.keterangan || 'Pengeluaran Kas',
      sapi_id: params.sapi_id || null,
      pakan_id: params.pakan_id || null,
      bukti_transaksi_url: params.bukti_transaksi_url || null,
      tanggal: new Date().toISOString().split('T')[0],
      is_deleted: false,
    }]).select();

    if (error) throw error;
    await fetchTransactions();
    return data;
  };

  useEffect(() => {
    fetchTransactions();

    const channel1 = supabase
      .channel('realtime_pemasukan')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pemasukan' }, () => {
        fetchTransactions();
      })
      .subscribe();

    const channel2 = supabase
      .channel('realtime_pengeluaran')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengeluaran' }, () => {
        fetchTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, [fetchTransactions]);

  const deleteTransaction = async (dbId: number, isIncome: boolean) => {
    const targetTable = isIncome ? 'pemasukan' : 'pengeluaran';
    const { error } = await supabase
      .from(targetTable)
      .update({ is_deleted: true })
      .eq('id', dbId);

    if (error) throw error;
    await fetchTransactions();
  };

  const restoreTransaction = async (dbId: number, isIncome: boolean) => {
    const targetTable = isIncome ? 'pemasukan' : 'pengeluaran';
    const { error } = await supabase
      .from(targetTable)
      .update({ is_deleted: false })
      .eq('id', dbId);

    if (error) throw error;
    await fetchTransactions();
  };

  const iofc = todayIncome > 0 
    ? Math.max(0, todayIncome - Math.round(todayExpense * 0.7)) 
    : 702400;

  return {
    transactions,
    archivedTransactions,
    totalBalance,
    todayIncome,
    todayExpense,
    iofc,
    loading,
    error,
    refetch: fetchTransactions,
    addIncome,
    addExpense,
    deleteTransaction,
    restoreTransaction,
  };
}

// 3. Hook for Milk Telemetry
export function useMilkTelemetry() {
  const [history, setHistory] = useState<HistoriSusu[]>([]);
  const [totalToday, setTotalToday] = useState<number>(142.8);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('histori_produksi_susu')
        .select('*')
        .order('tanggal', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setHistory(data);
        const sum = data.reduce((acc, curr) => acc + (curr.jumlah_liter || 0), 0);
        if (sum > 0) setTotalToday(Number(sum.toFixed(1)));
      }
    } catch (e: any) {
      console.error('Error fetching milk telemetry:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  return { history, totalToday, loading, refetch: fetchTelemetry };
}
