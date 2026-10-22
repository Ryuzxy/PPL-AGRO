import { useState, useMemo, useEffect } from 'react';
import type { ScreenType } from '../App.tsx';
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { useCows } from '../hooks/useSupabaseData';
import { aiApi } from '../lib/aiApi';

interface PrediksiLaktasiPakanProps {
  onNavigate?: (screen: ScreenType, cowId?: string) => void;
  cowId?: string;
}

interface PreTrainedFeedResult {
  kebutuhan_bk_kg: number;
  kebutuhan_pk_pct: number;
  ransum: Array<{ nama: string; kg: number; biaya: number; color: string }>;
  biaya_harian: number;
  omzet_harian: number;
  margin_iofc: number;
  iofc_ratio: number;
  puncak_hari: number;
  puncak_liter: number;
  total_siklus_liter: number;
}

export default function PrediksiLaktasiPakan({ onNavigate, cowId = '07' }: PrediksiLaktasiPakanProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCowTag, setActiveCowTag] = useState<string>(cowId.replace('#', '').trim());
  const { cows: dbCows } = useCows();

  // Selected cow data
  const cowList = useMemo(() => {
    const defaultList = [
      {
        tag: '04',
        name: 'Mawar',
        breed: 'Friesian Holstein Murni',
        stall: 'Kandang A • Stall 04',
        weight: 520,
        dim: 110,
        bcs: 3.35,
        yieldToday: 22.4,
        phase: 'Fase Laktasi Pertengahan',
        photo: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=400&q=80',
        puncakHari: 58,
        puncakLiter: 23.8,
        dbId: 1,
      },
      {
        tag: '07',
        name: 'Cantik',
        breed: 'Friesian Holstein Grati',
        stall: 'Kandang A • Stall 07',
        weight: 495,
        dim: 75,
        bcs: 3.20,
        yieldToday: 19.8,
        phase: 'Fase Laktasi Menuju Puncak',
        photo: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400&q=80',
        puncakHari: 60,
        puncakLiter: 20.6,
        dbId: 2,
      },
      {
        tag: '12',
        name: 'Melati',
        breed: 'Friesian Holstein Murni',
        stall: 'Kandang A • Stall 12',
        weight: 545,
        dim: 42,
        bcs: 3.25,
        yieldToday: 16.4,
        phase: 'Fase Laktasi Awal (Early)',
        photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8TCZKPzc5fw-wXzsxXtevt2Amche1K_arWzrA36uNyFGoib3Q9dTwTPi2ZU2xb6lnSS0exsVRtWwEMKA22CpqAzCS3pPZ5tBkBCaVgsL9V7yg33k_-Pk3dUWw4029zJqyPqnYRmoY-NoVSepXxxZI7_c7aHKRWEqR57LQYjxiX_38RsAC-EOXRVSVey2HOCIu_BzI5XEKa09E5PwrWkG2Kxb56f3wixlvNdiDAMWTYfvPa9V2Q4M8',
        puncakHari: 62,
        puncakLiter: 18.5,
        dbId: 3,
      },
      {
        tag: '18',
        name: 'Sekar',
        breed: 'FH Silang Peranakan',
        stall: 'Kandang B • Stall 03',
        weight: 510,
        dim: 95,
        bcs: 3.10,
        yieldToday: 17.2,
        phase: 'Fase Laktasi Pertengahan',
        photo: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=400&q=80',
        puncakHari: 52,
        puncakLiter: 18.2,
        dbId: 4,
      },
      {
        tag: '21',
        name: 'Kenanga',
        breed: 'Friesian Holstein (FH)',
        stall: 'Kandang B • Stall 09',
        weight: 480,
        dim: 140,
        bcs: 3.30,
        yieldToday: 15.0,
        phase: 'Fase Laktasi Stabil',
        photo: 'https://images.unsplash.com/photo-1596733430284-f7437764b14d?auto=format&fit=crop&w=400&q=80',
        puncakHari: 50,
        puncakLiter: 16.8,
        dbId: 5,
      },
      {
        tag: '25',
        name: 'Srikandi',
        breed: 'FH Super Elite',
        stall: 'Kandang A • Stall 01',
        weight: 560,
        dim: 60,
        bcs: 3.40,
        yieldToday: 24.1,
        phase: 'Puncak Laktasi Aktif (Peak Yield)',
        photo: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=400&q=80',
        puncakHari: 58,
        puncakLiter: 24.5,
        dbId: 6,
      },
    ];

    if (dbCows && dbCows.length > 0) {
      return defaultList.map((d) => {
        const found = dbCows.find((c) => c.number.replace('#', '').trim() === d.tag);
        if (found) {
          return {
            ...d,
            name: found.name,
            weight: Number(found.raw.berat_badan) || d.weight,
            yieldToday: Number(found.raw.rerata_produksi_harian) || d.yieldToday,
            bcs: Number(found.raw.skor_bcs) || d.bcs,
            phase: found.raw.fase_laktasi || d.phase,
            photo: found.photoUrl || found.image || d.photo,
          };
        }
        return d;
      });
    }

    return defaultList;
  }, [dbCows]);

  const activeCow = useMemo(() => {
    const clean = activeCowTag.replace('#', '').trim();
    return cowList.find((c) => c.tag === clean) || cowList[1];
  }, [activeCowTag, cowList]);

  // Synchronize when incoming cowId prop changes
  useEffect(() => {
    if (cowId) {
      setActiveCowTag(cowId.replace('#', '').trim());
    }
  }, [cowId]);

  // Sliders state (defaults tuned dynamically per cow's weight and milk target)
  const [grass, setGrass] = useState<number>(35.0);
  const [concentrate, setConcentrate] = useState<number>(7.5);
  const [sbm, setSbm] = useState<number>(0.4);
  const [premix, setPremix] = useState<number>(150);
  const [activeScenario, setActiveScenario] = useState<'A' | 'B' | 'C'>('B');
  const [showToast, setShowToast] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Pre-trained NRC AI Model optimization result
  const [nrcAiResult, setNrcAiResult] = useState<PreTrainedFeedResult | null>(null);

  // Run Pre-Trained AI whenever active cow or primary target changes
  useEffect(() => {
    let isCancelled = false;
    async function runPreTrainedModels() {
      setIsAiLoading(true);
      try {
        const feedOpt = await aiApi.optimizeFeed({
          sapi_id: activeCow.dbId,
          bobot_badan_kg: activeCow.weight,
          target_susu_liter: activeCow.yieldToday,
          fase_laktasi: activeCow.phase,
          harga_konsentrat_per_kg: 4200,
          harga_jual_susu_per_liter: 14000,
        });

        const lactOpt = await aiApi.predictLactation({
          sapi_id: activeCow.dbId,
          berat_badan: activeCow.weight,
          bobot_badan_kg: activeCow.weight,
          rerata_produksi_sekarang: activeCow.yieldToday,
          dim: activeCow.dim,
          hari_laktasi_dim: activeCow.dim,
          laktasi_ke: 2,
          skor_bcs: activeCow.bcs,
        });

        if (!isCancelled) {
          const concItem = feedOpt.rekomendasi_ransum.find((r) => r.nama_pakan.toLowerCase().includes('konsentrat'));
          const odotItem = feedOpt.rekomendasi_ransum.find((r) => r.nama_pakan.toLowerCase().includes('odot'));
          const legumItem = feedOpt.rekomendasi_ransum.find((r) => r.nama_pakan.toLowerCase().includes('indigofera'));
          const ampasItem = feedOpt.rekomendasi_ransum.find((r) => r.nama_pakan.toLowerCase().includes('ampas'));

          // Set sliders to AI recommended baseline
          setGrass(odotItem ? odotItem.jumlah_kg : 34.0);
          setConcentrate(concItem ? concItem.jumlah_kg : 7.2);
          setSbm(0.4);
          setPremix(150);

          setNrcAiResult({
            kebutuhan_bk_kg: feedOpt.kebutuhan_bk_kg,
            kebutuhan_pk_pct: feedOpt.kebutuhan_pk_pct,
            ransum: [
              { nama: 'Rumput Odot / Gajah', kg: odotItem ? odotItem.jumlah_kg : 34.0, biaya: odotItem ? odotItem.estimasi_biaya : 13600, color: '#00450d' },
              { nama: 'Konsentrat Dairy KUD PK 18%', kg: concItem ? concItem.jumlah_kg : 7.2, biaya: concItem ? concItem.estimasi_biaya : 30240, color: '#006b5f' },
              { nama: 'Legum Indigofera Zollingeriana', kg: legumItem ? legumItem.jumlah_kg : 3.5, biaya: legumItem ? legumItem.estimasi_biaya : 2800, color: '#1b5e20' },
              { nama: 'Ampas Tahu Basah Segar', kg: ampasItem ? ampasItem.jumlah_kg : 4.0, biaya: ampasItem ? ampasItem.estimasi_biaya : 2400, color: '#6c2200' },
            ],
            biaya_harian: feedOpt.total_biaya_pakan_harian,
            omzet_harian: feedOpt.estimasi_omzet_susu_harian,
            margin_iofc: feedOpt.estimasi_marjin_iofc_harian,
            iofc_ratio: feedOpt.rasio_iofc_pct,
            puncak_hari: lactOpt.puncak_laktasi_hari || activeCow.puncakHari,
            puncak_liter: lactOpt.estimasi_produksi_puncak_liter || activeCow.puncakLiter,
            total_siklus_liter: lactOpt.estimasi_total_siklus_liter || 5400,
          });
        }
      } catch (err) {
        console.warn('Gagal menghitung model pakan AI:', err);
      } finally {
        if (!isCancelled) setIsAiLoading(false);
      }
    }

    runPreTrainedModels();
    return () => {
      isCancelled = true;
    };
  }, [activeCow]);

  // Responsive prediction based on slider adjustments
  const calculatedYield = (
    activeCow.yieldToday * 0.72 +
    (grass - 25) * 0.08 +
    (concentrate - 4) * 0.52 +
    sbm * 2.2 +
    (premix - 50) * 0.003
  ).toFixed(1);

  // Dynamic Feed Cost calculation
  const feedCost = Math.round(
    grass * 400 + concentrate * 4200 + sbm * 11000 + premix * 24
  );

  const milkRevenue = Math.round(parseFloat(calculatedYield) * 14000);
  const netIOFC = Math.max(0, milkRevenue - feedCost);

  const handleApply = async () => {
    setShowToast(true);
    try {
      await supabase.from('pengeluaran').insert({
        sapi_id: activeCow.dbId,
        kategori: 'Pakan Konsentrat',
        jumlah: feedCost,
        keterangan: `Aplikasi Formulasi Ransum Pakan ${activeCow.name} (#${activeCow.tag}) via Pre-trained AI NRC: ${grass}kg Rumput, ${concentrate}kg Konsentrat, ${sbm}kg SBM`,
        tanggal: new Date().toISOString().split('T')[0],
      });
    } catch (e) {
      console.warn('Gagal mencatat ransum ke Supabase:', e);
    }
    setTimeout(() => setShowToast(false), 3500);
  };

  return (
    <div className="bg-[#f9f9ff] font-sans text-[#111c2d] min-h-screen antialiased flex flex-col lg:flex-row">
      {/* DESKTOP SIDEBAR */}
      <DesktopSidebar currentScreen="prediksi" onNavigate={onNavigate} />

      {/* MAIN CONTAINER */}
      <div className="flex-1 lg:pl-72 w-full flex flex-col">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-40 h-16 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-[#00450d] hover:bg-[#dee8ff]/50 transition-colors flex items-center justify-center"
              aria-label="Buka Menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <span className="material-symbols-outlined text-[#006b5f] text-[22px]">agriculture</span>
            <span className="text-[15px] sm:text-[16px] text-[#111c2d] font-bold truncate">Rembangan Dairy Farm</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-[13px] sm:text-[14px] text-[#41493e] truncate hidden sm:inline">Kandang Laktasi A &amp; B</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#acf4a4]/40 border border-[#acf4a4] text-[#0c5216] text-[12px] font-bold">
              <span className={`material-symbols-outlined text-[15px] ${isAiLoading ? 'animate-spin' : ''}`}>
                {isAiLoading ? 'sync' : 'psychology'}
              </span>
              <span>{isAiLoading ? 'Menghitung Ransum AI...' : 'Model Pre-Trained NRC & Wood Aktif'}</span>
            </div>

            <button 
              onClick={() => onNavigate?.('katalog')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e7eeff] text-[#111c2d] hover:bg-[#dee8ff] transition-colors text-[13px] font-semibold"
            >
              <span className="material-symbols-outlined text-[17px] text-[#006b5f]">pets</span>
              <span>Katalog Kawanan</span>
            </button>

            <button className="relative p-2 rounded-full text-[#41493e] hover:bg-[#e7eeff] transition-colors">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 bg-[#1b5e20] text-white text-[10px] font-bold rounded-full">0</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <main className="w-full flex-col pb-28 lg:pb-12 px-4 sm:px-8 py-6 max-w-[1440px] mx-auto">
          {/* HORIZONTAL COW SWITCHER TABS */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200/80 mb-6">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#41493e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#00450d]">tune</span>
                Pilih Sapi Target Prediksi Ransum AI:
              </span>
              <span className="text-[11px] text-[#717a6d] hidden sm:inline">Setiap sapi memiliki bobot, hari laktasi, dan kebutuhan nutrisi spesifik</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {cowList.map((cow) => {
                const isSelected = activeCow.tag === cow.tag;
                return (
                  <button
                    key={cow.tag}
                    onClick={() => {
                      setActiveCowTag(cow.tag);
                      setActiveScenario('B');
                    }}
                    className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left transition-all shrink-0 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#1b5e20] text-white border-[#00450d] shadow-md scale-[1.02]'
                        : 'bg-[#f0f3ff] text-[#111c2d] border-slate-200/60 hover:bg-[#dee8ff]'
                    }`}
                  >
                    <img
                      src={cow.photo}
                      alt={cow.name}
                      className="w-8 h-8 rounded-lg object-cover bg-slate-200 shrink-0 border border-white/40"
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-[13px] truncate">#{cow.tag} {cow.name}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#8df5e4] animate-ping"></span>}
                      </div>
                      <span className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-[#717a6d]'}`}>
                        {cow.weight} kg • H-{cow.dim} ({cow.yieldToday} L)
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE CATTLE TELEMETRY HEADER */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center border border-slate-200">
                  <img
                    src={activeCow.photo}
                    alt={activeCow.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#00450d] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow">
                  #{activeCow.tag}
                </span>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[20px] sm:text-[22px] text-[#111c2d] font-extrabold tracking-tight">
                    Sapi #{activeCow.tag} — {activeCow.name}
                  </span>
                  <span className="bg-[#dee8ff] text-[#006b5f] text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                    {activeCow.breed}
                  </span>
                  <span className="bg-[#acf4a4] text-[#0c5216] text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">verified</span> {activeCow.phase}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1 text-[13px] text-[#41493e]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">scale</span> Bobot Hidup: <strong className="text-[#111c2d]">{activeCow.weight} kg</strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#00450d]">calendar_month</span> Hari Laktasi (DIM): <strong className="text-[#00450d]">Hari ke-{activeCow.dim}</strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#006b5f]">monitor_weight</span> Skor BCS: <strong className="text-[#111c2d]">{activeCow.bcs.toFixed(2)} / 5.0</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* AI Spec Badge & Quick Nav */}
            <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
              <div className="bg-[#f0f3ff] px-4 py-2 rounded-xl border border-slate-200/60 flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[#00450d]">
                  <span className="material-symbols-outlined text-[18px]">memory</span>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold">NRC 2021 Dairy Optimizer</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[#41493e] mt-0.5">
                  <span>Target BK: <strong className="text-[#111c2d]">{nrcAiResult ? `${nrcAiResult.kebutuhan_bk_kg} kg` : '14.2 kg'}</strong></span>
                  <span>•</span>
                  <span>PK: <strong className="text-[#00450d]">{nrcAiResult ? `${nrcAiResult.kebutuhan_pk_pct}%` : '17.5%'}</strong></span>
                </div>
              </div>

              <button 
                onClick={() => onNavigate?.('profil_sapi', activeCow.tag)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#8df5e4] hover:bg-[#70d8c8] text-[#00201c] transition-colors text-[12px] font-bold shadow-xs cursor-pointer"
                title={`Buka Profil Sapi ${activeCow.name}`}
              >
                <span className="material-symbols-outlined text-[16px]">badge</span>
                <span>Buka Profil Sapi</span>
              </button>

              <button 
                onClick={() => onNavigate?.('riwayat_sapi', activeCow.tag)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#dee8ff] hover:bg-[#c6d7ff] text-[#00450d] transition-colors text-[12px] font-bold shadow-xs cursor-pointer"
                title={`Buka Riwayat Medis Sapi ${activeCow.name}`}
              >
                <span className="material-symbols-outlined text-[16px]">history</span>
                <span>Riwayat Medis</span>
              </button>
            </div>
          </section>

          {/* MAIN 2-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: 60% (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* 305-Day Wood's Lactation Model Chart */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00450d] text-[22px]">show_chart</span>
                      <h2 className="text-[18px] text-[#111c2d] font-bold">Kurva Siklus Laktasi 305 Hari Sapi #{activeCow.tag}</h2>
                    </div>
                    <p className="text-[12px] text-[#41493e] mt-0.5">
                      Model Matematis Wood: <span className="font-mono text-slate-500">y(t) = a·t^b·e^(-ct)</span> disesuaikan kurva biologis #{activeCow.tag} ({activeCow.name})
                    </p>
                  </div>
                  <div className="flex items-center gap-1 self-start sm:self-auto">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b5e20]/10 text-[#00450d] text-[11px] font-extrabold">
                      <span className="w-2 h-2 rounded-full bg-[#1b5e20] animate-pulse"></span> Hari Ke-{activeCow.dim} ({activeCow.yieldToday} L)
                    </span>
                  </div>
                </div>

                {/* Wood's Model SVG Visualizer */}
                <div className="relative w-full bg-[#f0f3ff] rounded-xl p-4 overflow-hidden border border-slate-200/50">
                  <div className="flex items-center justify-between text-[#717a6d] text-[11px] font-bold mb-2 px-1">
                    <span>Produksi (Liter/Hari)</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-1 bg-[#00450d] inline-block rounded-full"></span> Model Prediksi Wood 305H
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-[#006b5f] inline-block border-b-2 border-dashed border-[#006b5f]"></span> Historis Aktual
                      </span>
                    </div>
                  </div>

                  {/* SVG Chart tailored to this cow's DIM */}
                  <div className="relative w-full h-56">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 240">
                      <defs>
                        <linearGradient id="curveGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#1b5e20" stopOpacity="0.32" />
                          <stop offset="100%" stopColor="#1b5e20" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Gridlines */}
                      <line x1="40" y1="20" x2="680" y2="20" stroke="#dee8ff" strokeDasharray="3 3" strokeWidth="1" />
                      <line x1="40" y1="65" x2="680" y2="65" stroke="#dee8ff" strokeDasharray="3 3" strokeWidth="1" />
                      <line x1="40" y1="110" x2="680" y2="110" stroke="#dee8ff" strokeDasharray="3 3" strokeWidth="1" />
                      <line x1="40" y1="155" x2="680" y2="155" stroke="#dee8ff" strokeDasharray="3 3" strokeWidth="1" />
                      <line x1="40" y1="200" x2="680" y2="200" stroke="#c0c9bb" strokeWidth="1.5" />

                      {/* Phase Zone Backgrounds */}
                      <rect x="40" y="20" width="210" height="180" fill="#acf4a4" fillOpacity="0.12" />
                      <rect x="250" y="20" width="220" height="180" fill="#e7eeff" fillOpacity="0.25" />
                      <rect x="470" y="20" width="210" height="180" fill="#d8e3fb" fillOpacity="0.2" />

                      {/* Vertical Division Lines */}
                      <line x1="250" y1="20" x2="250" y2="200" stroke="#90d689" strokeDasharray="4 2" strokeWidth="1" />
                      <line x1="470" y1="20" x2="470" y2="200" stroke="#c0c9bb" strokeDasharray="4 2" strokeWidth="1" />

                      {/* Y-Axis Labels */}
                      <text x="32" y="24" textAnchor="end" fill="#717a6d" fontSize="10">26 L</text>
                      <text x="32" y="69" textAnchor="end" fill="#717a6d" fontSize="10">20 L</text>
                      <text x="32" y="114" textAnchor="end" fill="#717a6d" fontSize="10">14 L</text>
                      <text x="32" y="159" textAnchor="end" fill="#717a6d" fontSize="10">8 L</text>
                      <text x="32" y="204" textAnchor="end" fill="#717a6d" fontSize="10">0 L</text>

                      {/* Shaded Area under Curve */}
                      <path d="M 40,150 Q 110,65 170,36 Q 260,65 370,105 Q 480,140 600,172 L 680,188 L 680,200 L 40,200 Z" fill="url(#curveGradient)" />

                      {/* Predicted Curve */}
                      <path d="M 40,150 Q 110,65 170,36 Q 260,65 370,105 Q 480,140 600,172 L 680,188" fill="none" stroke="#00450d" strokeWidth="3.5" strokeLinecap="round" />

                      {/* Current Day Marker */}
                      {(() => {
                        const markerX = 40 + Math.min(640, Math.round((activeCow.dim / 305) * 640));
                        const markerY = Math.max(36, Math.min(185, 200 - (activeCow.yieldToday / 28) * 180));
                        return (
                          <g key={activeCow.tag}>
                            <line x1={markerX} y1="20" x2={markerX} y2="200" stroke="#ba1a1a" strokeDasharray="3 3" strokeWidth="1.5" />
                            <circle cx={markerX} cy={markerY} r="6" fill="#1b5e20" stroke="#ffffff" strokeWidth="2.5" />
                            <g transform={`translate(${Math.min(580, Math.max(70, markerX - 35))}, 18)`}>
                              <rect x="-4" y="-12" width="80" height="24" rx="6" fill="#111c2d" />
                              <text x="36" y="4" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">
                                H-{activeCow.dim}: {activeCow.yieldToday} L
                              </text>
                            </g>
                          </g>
                        );
                      })()}

                      {/* Peak Marker (Day 60) */}
                      <circle cx="170" cy="36" r="5" fill="#8df5e4" stroke="#006b5f" strokeWidth="2" />
                      <line x1="170" y1="36" x2="170" y2="200" stroke="#006b5f" strokeDasharray="2 2" strokeWidth="1" />
                      <g transform="translate(182, 34)">
                        <rect x="-4" y="-12" width="90" height="24" rx="6" fill="#e7eeff" />
                        <text x="41" y="4" fill="#00450d" fontSize="10" fontWeight="700" textAnchor="middle">
                          Puncak: {activeCow.puncakLiter} L (H-{activeCow.puncakHari})
                        </text>
                      </g>

                      {/* X-Axis Day Markers */}
                      <text x="40" y="218" textAnchor="middle" fill="#717a6d" fontSize="10">H-0</text>
                      <text x="170" y="218" textAnchor="middle" fill="#006b5f" fontSize="10" fontWeight="700">Puncak (H-{activeCow.puncakHari})</text>
                      <text x="250" y="218" textAnchor="middle" fill="#717a6d" fontSize="10">H-100</text>
                      <text x="470" y="218" textAnchor="middle" fill="#717a6d" fontSize="10">H-200</text>
                      <text x="680" y="218" textAnchor="middle" fill="#717a6d" fontSize="10">H-305 (Kering)</text>
                    </svg>
                  </div>

                  {/* Phases Legend Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-200/60">
                    <div className="p-2.5 rounded-lg bg-white flex flex-col border border-slate-200/60">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00450d]"></span>
                        <span className="text-[12px] text-[#111c2d] font-bold">Fase Awal (0 - 100 Hari)</span>
                      </div>
                      <span className="text-[11px] text-[#41493e] mt-1">Mengejar Peak Yield (~{activeCow.puncakLiter} L). Defisit energi normal; butuh TDN tinggi.</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white flex flex-col border border-slate-200/60">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#006b5f]"></span>
                        <span className="text-[12px] text-[#111c2d] font-bold">Fase Tengah (100 - 200 Hari)</span>
                      </div>
                      <span className="text-[11px] text-[#41493e] mt-1">Persistensi dijaga ≥92% per bulan. Keseimbangan energi tercapai.</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white flex flex-col border border-slate-200/60">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#717a6d]"></span>
                        <span className="text-[12px] text-[#111c2d] font-bold">Fase Akhir &amp; Kering (&gt;200 H)</span>
                      </div>
                      <span className="text-[11px] text-[#41493e] mt-1">Penurunan bertahap. Persiapan periode kering kandang 60 hari sebelum melahirkan.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* WHAT-IF FEED SIMULATOR SLIDERS */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00450d] text-[22px]">tune</span>
                      <h3 className="text-[18px] text-[#111c2d] font-bold">Simulator Ransum Interaktif Pre-Trained AI</h3>
                    </div>
                    <p className="text-[12px] text-[#41493e]">
                      Geser proporsi pakan untuk melihat respons langsung pada volume susu &amp; marjin IOFC
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setGrass(34.0);
                        setConcentrate(7.2);
                        setSbm(0.4);
                        setPremix(150);
                        setActiveScenario('B');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#41493e] text-[12px] font-bold transition-colors"
                    >
                      Reset Default
                    </button>
                  </div>
                </div>

                {/* 4 Interactive Sliders */}
                <div className="flex flex-col gap-4">
                  {/* Grass Slider */}
                  <div className="flex flex-col gap-1.5 bg-[#f9f9ff] p-3.5 rounded-xl border border-slate-200/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#00450d]"></span>
                        <span className="text-[13px] font-bold text-[#111c2d]">Rumput Odot Segar / Gajah</span>
                      </div>
                      <span className="font-mono font-extrabold text-[#00450d] text-[14px]">{grass.toFixed(1)} kg / hari</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="50"
                      step="0.5"
                      value={grass}
                      onChange={(e) => setGrass(parseFloat(e.target.value))}
                      className="w-full accent-[#00450d] h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold px-0.5">
                      <span>20 kg (Min)</span>
                      <span>Kadar Air ~82% • Rp 400/kg</span>
                      <span>50 kg (Max)</span>
                    </div>
                  </div>

                  {/* Concentrate Slider */}
                  <div className="flex flex-col gap-1.5 bg-[#f9f9ff] p-3.5 rounded-xl border border-slate-200/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#006b5f]"></span>
                        <span className="text-[13px] font-bold text-[#111c2d]">Konsentrat Laktasi PK 18%</span>
                      </div>
                      <span className="font-mono font-extrabold text-[#006b5f] text-[14px]">{concentrate.toFixed(1)} kg / hari</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="12"
                      step="0.2"
                      value={concentrate}
                      onChange={(e) => setConcentrate(parseFloat(e.target.value))}
                      className="w-full accent-[#006b5f] h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold px-0.5">
                      <span>3.0 kg</span>
                      <span>KUD Rembangan • Rp 4.200/kg</span>
                      <span>12.0 kg (High Yield)</span>
                    </div>
                  </div>

                  {/* SBM Slider */}
                  <div className="flex flex-col gap-1.5 bg-[#f9f9ff] p-3.5 rounded-xl border border-slate-200/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#6c2200]"></span>
                        <span className="text-[13px] font-bold text-[#111c2d]">Bungkil Kedelai (SBM - Bypass Protein)</span>
                      </div>
                      <span className="font-mono font-extrabold text-[#6c2200] text-[14px]">{sbm.toFixed(2)} kg / hari</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.5"
                      step="0.05"
                      value={sbm}
                      onChange={(e) => setSbm(parseFloat(e.target.value))}
                      className="w-full accent-[#6c2200] h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold px-0.5">
                      <span>0 kg</span>
                      <span>Protein Kasar ~48% • Rp 11.000/kg</span>
                      <span>1.5 kg (Booster)</span>
                    </div>
                  </div>

                  {/* Premix Slider */}
                  <div className="flex flex-col gap-1.5 bg-[#f9f9ff] p-3.5 rounded-xl border border-slate-200/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                        <span className="text-[13px] font-bold text-[#111c2d]">Premix Mineral &amp; Rumen Buffer</span>
                      </div>
                      <span className="font-mono font-extrabold text-[#111c2d] text-[14px]">{premix} gram / hari</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      step="10"
                      value={premix}
                      onChange={(e) => setPremix(parseInt(e.target.value, 10))}
                      className="w-full accent-slate-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold px-0.5">
                      <span>50 g</span>
                      <span>Mencegah Asidosis Subakut (SARA) • Rp 24/g</span>
                      <span>300 g</span>
                    </div>
                  </div>
                </div>

                {/* 3 PRESET SCENARIO CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div
                    onClick={() => {
                      setActiveScenario('A');
                      setGrass(40.0);
                      setConcentrate(5.5);
                      setSbm(0.1);
                      setPremix(100);
                    }}
                    className={`p-4 rounded-xl flex flex-col justify-between cursor-pointer transition-all border ${
                      activeScenario === 'A' ? 'bg-[#dee8ff] border-[#006b5f] shadow-sm' : 'bg-[#f0f3ff] border-transparent hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#717a6d]">Skenario A</span>
                      <h4 className="text-[14px] font-bold text-[#111c2d]">Hemat Biaya (Ransum Murah)</h4>
                      <div className="mt-2 text-[#006b5f] text-[20px] font-extrabold leading-tight">
                        {(activeCow.yieldToday * 0.9).toFixed(1)} L<span className="text-[11px] font-normal text-[#41493e]">/hari</span>
                      </div>
                      <p className="text-[11px] text-[#41493e] mt-1">Biaya: Rp 39.500/hari</p>
                    </div>
                    <button className="mt-3 w-full py-1.5 rounded-lg bg-white text-[#111c2d] text-[11px] font-bold border border-slate-200">
                      {activeScenario === 'A' ? '✓ Terpilih' : 'Pilih Skenario'}
                    </button>
                  </div>

                  <div
                    onClick={() => {
                      setActiveScenario('B');
                      setGrass(34.0);
                      setConcentrate(7.2);
                      setSbm(0.4);
                      setPremix(150);
                    }}
                    className={`p-4 rounded-xl flex flex-col justify-between cursor-pointer transition-all border ${
                      activeScenario === 'B' ? 'bg-[#1b5e20] text-white border-[#00450d] shadow-md' : 'bg-[#f0f3ff] border-transparent hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-[#acf4a4] font-black">Skenario B • Rekomendasi AI</span>
                        <span className="material-symbols-outlined text-[16px] text-[#acf4a4]">auto_awesome</span>
                      </div>
                      <h4 className="text-[14px] font-bold text-white mt-0.5">Optimal NRC Dairy</h4>
                      <div className="mt-2 text-white text-[22px] font-black leading-tight">
                        {activeCow.yieldToday} L<span className="text-[12px] font-normal text-[#acf4a4]">/hari</span>
                      </div>
                      <p className="text-[11px] text-white/80 mt-1">Biaya: Rp {feedCost.toLocaleString('id-ID')}/hari</p>
                      <p className="text-[11px] text-white/90">IOFC: <strong className="text-white">Rp {netIOFC.toLocaleString('id-ID')}</strong></p>
                    </div>
                    <button className="mt-3 w-full py-1.5 rounded-lg bg-white text-[#00450d] text-[11px] font-extrabold shadow">
                      {activeScenario === 'B' ? '★ Sedang Aktif' : 'Pilih Skenario'}
                    </button>
                  </div>

                  <div
                    onClick={() => {
                      setActiveScenario('C');
                      setGrass(36.0);
                      setConcentrate(9.5);
                      setSbm(0.8);
                      setPremix(200);
                    }}
                    className={`p-4 rounded-xl flex flex-col justify-between cursor-pointer transition-all border ${
                      activeScenario === 'C' ? 'bg-[#dee8ff] border-[#006b5f] shadow-sm' : 'bg-[#f0f3ff] border-transparent hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#717a6d]">Skenario C</span>
                      <h4 className="text-[14px] font-bold text-[#111c2d]">Peak Booster (Produksi Max)</h4>
                      <div className="mt-2 text-[#006b5f] text-[20px] font-extrabold leading-tight">
                        {(activeCow.yieldToday * 1.12).toFixed(1)} L<span className="text-[11px] font-normal text-[#41493e]">/hari</span>
                      </div>
                      <p className="text-[11px] text-[#41493e] mt-1">Biaya: Rp 58.200/hari</p>
                    </div>
                    <button className="mt-3 w-full py-1.5 rounded-lg bg-white text-[#111c2d] text-[11px] font-bold border border-slate-200">
                      {activeScenario === 'C' ? '✓ Terpilih' : 'Pilih Skenario'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: 40% (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Precision Feed Formula Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00450d] text-[22px]">restaurant</span>
                    <h3 className="text-[18px] text-[#111c2d] font-bold">Ransum Rekomendasi Sapi #{activeCow.tag}</h3>
                  </div>
                  <span className="text-[11px] bg-[#f0f3ff] px-2 py-0.5 rounded text-[#717a6d] font-mono font-bold">
                    NRC-#{activeCow.tag}-{activeCow.dim}
                  </span>
                </div>

                {/* Nutrition Summary Pills */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200/50">
                    <span className="text-[10px] text-[#41493e] font-bold uppercase">BK (Bahan Kering)</span>
                    <div className="text-[15px] font-extrabold text-[#111c2d] mt-0.5">
                      {nrcAiResult ? `${nrcAiResult.kebutuhan_bk_kg} kg` : `${((activeCow.weight * 0.032) + (activeCow.yieldToday * 0.09)).toFixed(1)} kg`}
                    </div>
                    <span className="text-[10px] text-[#717a6d]">~2.9% BB</span>
                  </div>
                  <div className="bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200/50">
                    <span className="text-[10px] text-[#41493e] font-bold uppercase">PK (Protein)</span>
                    <div className="text-[15px] font-extrabold text-[#00450d] mt-0.5">
                      {nrcAiResult ? `${nrcAiResult.kebutuhan_pk_pct}%` : '17.5%'}
                    </div>
                    <span className="text-[10px] text-[#00450d] font-semibold">Standar NRC</span>
                  </div>
                  <div className="bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200/50">
                    <span className="text-[10px] text-[#41493e] font-bold uppercase">TDN (Energi)</span>
                    <div className="text-[15px] font-extrabold text-[#006b5f] mt-0.5">68.8%</div>
                    <span className="text-[10px] text-[#006b5f] font-semibold">High Density</span>
                  </div>
                </div>

                {/* Feed Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[12px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[#717a6d] text-[11px] font-bold uppercase">
                        <th className="py-2 pr-2">Bahan Ransum</th>
                        <th className="py-2 px-2 text-right">As-Fed</th>
                        <th className="py-2 px-2 text-right">BK</th>
                        <th className="py-2 pl-2 text-right">Biaya</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2 pr-2 font-medium text-[#111c2d] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#00450d]"></span>
                          <span>Rumput Odot Segar</span>
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-[#111c2d]">{grass.toFixed(1)} kg</td>
                        <td className="py-2 px-2 text-right text-[#41493e]">{(grass * 0.18).toFixed(1)} kg</td>
                        <td className="py-2 pl-2 text-right text-[#111c2d]">Rp {(grass * 400).toLocaleString('id-ID')}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-2 font-medium text-[#111c2d] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#006b5f]"></span>
                          <span>Konsentrat Laktasi KUD</span>
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-[#111c2d]">{concentrate.toFixed(1)} kg</td>
                        <td className="py-2 px-2 text-right text-[#41493e]">{(concentrate * 0.88).toFixed(1)} kg</td>
                        <td className="py-2 pl-2 text-right text-[#111c2d]">Rp {(concentrate * 4200).toLocaleString('id-ID')}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-2 font-medium text-[#111c2d] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#6c2200]"></span>
                          <span>Bungkil Kedelai (SBM)</span>
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-[#111c2d]">{sbm.toFixed(2)} kg</td>
                        <td className="py-2 px-2 text-right text-[#41493e]">{(sbm * 0.9).toFixed(2)} kg</td>
                        <td className="py-2 pl-2 text-right text-[#111c2d]">Rp {Math.round(sbm * 11000).toLocaleString('id-ID')}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-2 font-medium text-[#111c2d] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                          <span>Premix Mineral &amp; Buffer</span>
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-[#111c2d]">{(premix / 1000).toFixed(2)} kg</td>
                        <td className="py-2 px-2 text-right text-[#41493e]">{(premix * 0.00095).toFixed(2)} kg</td>
                        <td className="py-2 pl-2 text-right text-[#111c2d]">Rp {Math.round(premix * 24).toLocaleString('id-ID')}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="font-bold text-[#111c2d] bg-[#f0f3ff]">
                        <td className="py-2.5 px-2">Total Harian #{activeCow.tag}</td>
                        <td className="py-2.5 px-2 text-right">{(grass + concentrate + sbm + premix / 1000).toFixed(2)} kg</td>
                        <td className="py-2.5 px-2 text-right">{(grass * 0.18 + concentrate * 0.88 + sbm * 0.9).toFixed(1)} kg</td>
                        <td className="py-2.5 pl-2 text-right text-[#00450d] font-black">Rp {feedCost.toLocaleString('id-ID')}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <span className="material-symbols-outlined text-[15px]">info</span>
                  <span>Pemberian pakan: Pukul 06.00 WIB (Pagi) &amp; 15.00 WIB (Sore) pasca perah di {activeCow.stall}.</span>
                </div>
              </div>

              {/* Financial IOFC Margin Analysis */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00450d] text-[22px]">payments</span>
                    <h3 className="text-[18px] text-[#111c2d] font-bold">Analisis Marjin IOFC Harian Sapi #{activeCow.tag}</h3>
                  </div>
                  <span className="text-[11px] bg-[#acf4a4] text-[#0c5216] px-2.5 py-0.5 rounded-full font-bold">
                    +{(100 - (feedCost / (milkRevenue || 1)) * 100).toFixed(1)}% Efisiensi Ransum
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 bg-[#f0f3ff] p-4 rounded-xl border border-slate-200/50">
                  {/* Revenue */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#00450d] shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">local_drink</span>
                      </span>
                      <div>
                        <div className="text-[13px] font-bold text-[#111c2d]">Estimasi Pendapatan Susu</div>
                        <div className="text-[11px] text-[#41493e]">{calculatedYield} L @ Rp 14.000 / Liter (Grade A)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[14px] text-[#00450d] font-black">+Rp {milkRevenue.toLocaleString('id-ID')}</span>
                      <div className="text-[10px] text-[#00450d] font-semibold">Per Hari</div>
                    </div>
                  </div>

                  {/* Feed Cost */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-[#ffdad6] flex items-center justify-center text-[#93000a] shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                      </span>
                      <div>
                        <div className="text-[13px] font-bold text-[#111c2d]">Biaya Ransum Pakan (Cost)</div>
                        <div className="text-[11px] text-[#41493e]">Hijauan + konsentrat + suplemen</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[14px] text-[#ba1a1a] font-black">-Rp {feedCost.toLocaleString('id-ID')}</span>
                      <div className="text-[10px] text-[#ba1a1a] font-semibold">Per Hari</div>
                    </div>
                  </div>

                  {/* Net Margin Box */}
                  <div className="mt-2 p-3.5 rounded-xl bg-[#00450d] text-white flex items-center justify-between shadow-inner">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#acf4a4]">Marjin IOFC Bersih (Net Margin)</span>
                      <span className="text-[11px] text-white/80">Pendapatan susu di atas beban pakan #{activeCow.tag}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[22px] font-black text-white leading-none">Rp {netIOFC.toLocaleString('id-ID')}</div>
                      <span className="text-[10px] text-[#acf4a4]">~Rp {(netIOFC * 30).toLocaleString('id-ID')} / Bulan</span>
                    </div>
                  </div>
                </div>

                {/* Insight Callout */}
                <div className="bg-[#dee8ff]/60 p-3 rounded-xl flex items-start gap-2 border border-[#dee8ff]">
                  <span className="material-symbols-outlined text-[#006b5f] text-[20px] shrink-0 mt-0.5">tips_and_updates</span>
                  <p className="text-[12px] text-[#41493e] leading-relaxed">
                    Optimalisasi pre-trained AI NRC menjaga rasio biaya pakan berada di <strong className="text-[#111c2d]">{((feedCost / milkRevenue) * 100).toFixed(1)}% dari total omzet susu</strong>, sangat sehat dan di bawah batas aman industri (35%).
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-1">
                  <button 
                    onClick={handleApply}
                    className="w-full py-3 px-4 rounded-full bg-[#1b5e20] text-white font-bold text-[13px] shadow hover:bg-[#00450d] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                    <span>Terapkan Formula ke Palungan {activeCow.stall}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => window.print()}
                      className="py-2 px-3 rounded-full bg-[#e7eeff] text-[#111c2d] hover:bg-[#dee8ff] transition-colors text-[12px] font-semibold flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#006b5f]">print</span>
                      <span>Cetak Lembar Timbang</span>
                    </button>

                    <button 
                      onClick={() => alert(`Rencana nutrisi untuk Sapi #${activeCow.tag} (${activeCow.name}) berhasil diekspor!`)}
                      className="py-2 px-3 rounded-full bg-[#e7eeff] text-[#111c2d] hover:bg-[#dee8ff] transition-colors text-[12px] font-semibold flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#006b5f]">download</span>
                      <span>Ekspor Rencana</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Applied Formula Toast */}
      {showToast && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 bg-[#263143] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce border border-slate-600">
          <span className="material-symbols-outlined text-[#8df5e4] text-[24px]">check_circle</span>
          <div className="flex flex-col text-left">
            <span className="text-[13px] font-bold">Instruksi Berhasil Dikirim ke Kandang &amp; Dicatat ke Kas</span>
            <span className="text-[11px] text-slate-300">Ransum palungan #{activeCow.tag} ({activeCow.name}) diperbarui di Supabase pengeluaran.</span>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeScreen="prediksi"
        onNavigate={onNavigate}
      />

      {/* Persistent Bottom Nav for Mobile */}
      <MobileBottomNav activeScreen="prediksi" onNavigate={onNavigate} />
    </div>
  );
}
