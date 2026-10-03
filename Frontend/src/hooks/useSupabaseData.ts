import { useEffect, useState, useCallback } from 'react';
import { supabase, type Sapi, type Pemasukan, type Pengeluaran, type HistoriSusu } from '../lib/supabase';

// Type representing a cow for the UI with both DB and display fields
export interface UICow {
  id: string;
  dbId: number;
  number: string;
  name: string;
  tag: string;
  eartag: string;
  stall: string;
  scheduleText: string;
  scheduleWarning?: boolean;
  healthStatus: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCows = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('sapi')
        .select('*')
        .order('id', { ascending: true });

      if (err) throw err;

      if (data && data.length > 0) {
        const mapped: UICow[] = data.map((s) => {
          const idStr = String(s.id).padStart(2, '0');
          const isHealthy = s.status_kesehatan === 'Sehat';
          const isKandangA = s.lokasi_kandang?.toLowerCase().includes('a') ?? false;
          const isKandangB = s.lokasi_kandang?.toLowerCase().includes('b') ?? false;
          
          let kategori: 'semua' | 'kandang_a' | 'kandang_b' | 'perlu_cek' = 'semua';
          if (!isHealthy) kategori = 'perlu_cek';
          else if (isKandangA) kategori = 'kandang_a';
          else if (isKandangB) kategori = 'kandang_b';

          return {
            id: idStr,
            dbId: s.id,
            number: `#${idStr}`,
            name: s.nama,
            tag: `${s.fase_laktasi || 'Laktasi'} • ${s.lokasi_kandang || 'Kandang'}`,
            eartag: s.eartag,
            stall: s.lokasi_kandang || `Stall #${idStr}`,
            scheduleText: isHealthy ? 'Jadwal Rutin Pemerahan' : 'Perlu Evaluasi Khusus',
            scheduleWarning: !isHealthy,
            healthStatus: isHealthy ? '100% Sehat' : (s.status_kesehatan || 'Perlu Cek'),
            isHealthy,
            metric1Label: isHealthy ? 'Rerata Produksi' : 'Kondisi Ambing',
            metric1Val: isHealthy ? `${s.rerata_produksi_harian || 18.5} L / Hari` : 'Kuartir Sensitif',
            metric2Label: 'Skor BCS',
            metric2Val: `${s.skor_bcs || 3.25} / 5.0`,
            image: s.foto_profil_url || DEFAULT_COW_IMAGES[s.nama] || DEFAULT_COW_IMAGES['Cantik'],
            kategori,
            raw: s,
          };
        });
        setCows(mapped);
      }
    } catch (e: any) {
      console.error('Error fetching cows from Supabase:', e);
      setError(e.message || 'Gagal memuat data sapi');
    } finally {
      setLoading(false);
    }
  }, []);

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

  return { cows, loading, error, refetch: fetchCows };
}

// 2. Hook for Cash Flow
export function useCashflow() {
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(18946900); // Baseline start
  const [todayIncome, setTodayIncome] = useState<number>(0);
  const [todayExpense, setTodayExpense] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const [incomesRes, expensesRes] = await Promise.all([
        supabase.from('pemasukan').select('*').order('created_at', { ascending: false }),
        supabase.from('pengeluaran').select('*').order('created_at', { ascending: false })
      ]);

      if (incomesRes.error) throw incomesRes.error;
      if (expensesRes.error) throw expensesRes.error;

      const incData: Pemasukan[] = incomesRes.data || [];
      const expData: Pengeluaran[] = expensesRes.data || [];

      let sumIncome = 0;
      let sumExpense = 0;

      const list: CashTransaction[] = [];

      incData.forEach((inc) => {
        sumIncome += inc.jumlah;
        const d = inc.tanggal ? new Date(inc.tanggal) : (inc.created_at ? new Date(inc.created_at) : new Date());
        list.push({
          id: `INC-${inc.id}`,
          dbId: inc.id,
          title: inc.keterangan || `Pemasukan #${inc.id}`,
          category: inc.kategori || 'Pemasukan Kas',
          amount: `+Rp ${inc.jumlah.toLocaleString('id-ID')}`,
          rawAmount: inc.jumlah,
          time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          isIncome: true,
          badge: inc.volume_liter ? `${inc.volume_liter} L Susu` : 'Kas Masuk',
          notes: inc.nomor_rekap_wa || undefined,
        });
      });

      expData.forEach((exp) => {
        sumExpense += exp.jumlah;
        const d = exp.tanggal ? new Date(exp.tanggal) : (exp.created_at ? new Date(exp.created_at) : new Date());
        list.push({
          id: `EXP-${exp.id}`,
          dbId: exp.id,
          title: exp.keterangan || `Pengeluaran #${exp.id}`,
          category: exp.kategori || 'Pengeluaran Kas',
          amount: `-Rp ${exp.jumlah.toLocaleString('id-ID')}`,
          rawAmount: exp.jumlah,
          time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          isIncome: false,
          badge: exp.kategori || 'Beban Kas',
          notes: exp.bukti_transaksi_url || undefined,
        });
      });

      // Sort all combined transactions by date desc
      list.sort((a, b) => b.dbId - a.dbId);

      // Starting reserve balance + sum of new dynamic cashflows
      const baseReserve = 17500000;
      setTotalBalance(baseReserve + sumIncome - sumExpense);
      setTodayIncome(sumIncome);
      setTodayExpense(sumExpense);
      setTransactions(list);
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

  return {
    transactions,
    totalBalance,
    todayIncome,
    todayExpense,
    loading,
    error,
    refetch: fetchTransactions,
    addIncome,
    addExpense,
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
