"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import { createClient } from "@/lib/supabase/client";
import { KEADAAN_WILAYAH_KADURAMA } from "@/data/dusunData";
import {
  Users,
  ChevronRight,
  TrendingUp,
  PieChart,
  Home,
  Briefcase,
  ShieldCheck,
  RefreshCw,
  Info,
  Layers,
  MapPin,
  Landmark,
  Trees,
  CheckCircle2,
  BarChart3,
  Filter,
} from "lucide-react";

interface Resident {
  nik: string;
  nama: string;
  dusun: string;
  jenis_kelamin: string;
  pekerjaan: string;
}

interface SensusKK {
  no_kk: string;
  dusun: string;
  jumlah_anggota?: number;
}

export default function DemografiPage() {
  const [loading, setLoading] = useState(true);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [kkList, setKkList] = useState<SensusKK[]>([]);
  const [jobFilter, setJobFilter] = useState<"top10" | "all" | "produktif" | "domestik">("top10");
  const [hoveredJob, setHoveredJob] = useState<{ bidang: string; count: number; persen: number } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        
        // Helper untuk fetch seluruh baris melebihi default limit 1000 PostgREST
        async function fetchAllRows(tableName: string, selectCols: string) {
          const allRows: any[] = [];
          const pageSize = 1000;
          let from = 0;
          let hasMore = true;

          while (hasMore) {
            const { data, error } = await supabase
              .from(tableName)
              .select(selectCols)
              .eq("is_deleted", false)
              .range(from, from + pageSize - 1);

            if (error) {
              console.error(`Error fetching ${tableName}:`, error.message);
              break;
            }

            if (data && data.length > 0) {
              allRows.push(...data);
              if (data.length < pageSize) {
                hasMore = false;
              } else {
                from += pageSize;
              }
            } else {
              hasMore = false;
            }
          }
          return allRows;
        }

        const [resData, kkData] = await Promise.all([
          fetchAllRows("residents", "nik, nama, dusun, jenis_kelamin, pekerjaan"),
          fetchAllRows("sensus_kk", "no_kk, dusun, jumlah_anggota"),
        ]);

        if (resData) setResidents(resData);
        if (kkData) setKkList(kkData);
      } catch (err) {
        console.error("Gagal memuat data demografi:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalPenduduk = residents.length;
  const totalKK = kkList.length;

  const totalLaki = residents.filter((r) =>
    r.jenis_kelamin?.toLowerCase().includes("laki")
  ).length;
  const totalPerempuan = residents.filter((r) =>
    r.jenis_kelamin?.toLowerCase().includes("perempuan")
  ).length;

  const persenLaki = totalPenduduk > 0 ? ((totalLaki / totalPenduduk) * 100).toFixed(1) : "0";
  const persenPerempuan = totalPenduduk > 0 ? ((totalPerempuan / totalPenduduk) * 100).toFixed(1) : "0";

  const dusunDefs = [
    {
      key: "pahing",
      name: "Dusun I Pahing",
      slug: "pahing",
      area: "± 27 Ha",
      rtRw: "3 RT / 1 RW",
      role: "Luas wilayah ± 27 Ha (3 RT / 1 RW). Memiliki fasilitas lapangan sepakbola, 2 mushola, SD, TK, dan Posyandu.",
    },
    {
      key: "wage",
      name: "Dusun II Wage",
      slug: "wage",
      area: "± 23 Ha",
      rtRw: "2 RT / 1 RW",
      role: "Luas wilayah ± 23 Ha (2 RT / 1 RW). Memiliki fasilitas 1 masjid, 1 mushola, pondok pesantren, PAUD, dan Posyandu.",
    },
    {
      key: "manis",
      name: "Dusun III Manis",
      slug: "manis",
      area: "± 39 Ha",
      rtRw: "3 RT / 1 RW",
      role: "Luas wilayah ± 39 Ha (3 RT / 1 RW). Memiliki fasilitas KUA, gedung SD, 4 mushola, 1 pesantren, dan Posyandu.",
    },
  ];

  const dusunStats = dusunDefs.map((def) => {
    const jiwa = residents.filter((r) =>
      r.dusun?.toLowerCase().includes(def.key)
    ).length;
    const kk = kkList.filter((k) =>
      k.dusun?.toLowerCase().includes(def.key)
    ).length;
    const porsi = totalPenduduk > 0 ? ((jiwa / totalPenduduk) * 100).toFixed(1) : "0";

    return {
      ...def,
      jiwa,
      kk,
      porsi: `${porsi}%`,
    };
  });

  // Normalisasi & Analisis Pekerjaan
  const normalizeJobTitle = (raw?: string | null): string => {
    if (!raw || !raw.trim()) return "Belum / Tidak Bekerja";
    const s = raw.trim().toLowerCase();
    if (s.includes("belum/tidak bekerja / pelajar") || s.includes("belum / tidak bekerja / pelajar")) return "Belum Bekerja / Pelajar";
    if (s.includes("belum") && s.includes("bekerja")) return "Belum / Tidak Bekerja";
    if (s.includes("pelajar") || s.includes("mahasiswa")) return "Pelajar / Mahasiswa";
    if (s.includes("mengurus rumah tangga") || s.includes("irt")) return "Mengurus Rumah Tangga";
    if (s.includes("buruh harian") || s.includes("buruh lepas")) return "Buruh Harian Lepas";
    if (s.includes("buruh tani") || s.includes("buruh perkebunan")) return "Buruh Tani / Perkebunan";
    if (s.includes("petani") || s.includes("pekebun")) return "Petani / Pekebun";
    if (s.includes("karyawanswasta") || s.includes("karyawan swasta")) return "Karyawan Swasta";
    if (s.includes("karyawan bumn") || s.includes("bumn")) return "Karyawan BUMN";
    if (s.includes("karyawan honorer") || s.includes("honorer")) return "Tenaga Honorer";
    if (s.includes("wiraswasta") || s.includes("wirausaha")) return "Wiraswasta";
    if (s.includes("pedagang") || s.includes("perdagangan")) return "Pedagang";
    if (s.includes("pns") || s.includes("pegawai negeri")) return "Pegawai Negeri Sipil (PNS)";
    if (s.includes("guru") || s.includes("dosen")) return "Guru / Tenaga Pendidik";
    if (s.includes("pensiunan")) return "Pensiunan";
    if (s.includes("sopir") || s.includes("supir")) return "Sopir / Pengemudi";
    if (s.includes("perangkat desa")) return "Perangkat Desa";
    if (s.includes("tni") || s.includes("polri") || s.includes("polisi")) return "TNI / Polri";
    if (s.includes("tukang")) return "Tukang Bangunan / Kayu";
    return raw.trim().replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
  };

  const jobMap: Record<string, number> = {};
  residents.forEach((r) => {
    const job = normalizeJobTitle(r.pekerjaan);
    jobMap[job] = (jobMap[job] || 0) + 1;
  });

  const pekerjaanStats = Object.entries(jobMap)
    .map(([bidang, count]) => ({
      bidang,
      count,
      jumlah: `${count.toLocaleString("id-ID")} Jiwa`,
      persen: totalPenduduk > 0 ? Number(((count / totalPenduduk) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Sektor Produktif & Statistik Rata-rata Ketenagakerjaan
  const totalKategoriPekerjaan = pekerjaanStats.length;
  const nonProductiveKeys = ["Belum / Tidak Bekerja", "Belum Bekerja / Pelajar", "Pelajar / Mahasiswa", "Mengurus Rumah Tangga"];
  const totalBekerja = pekerjaanStats
    .filter((p) => !nonProductiveKeys.includes(p.bidang))
    .reduce((acc, curr) => acc + curr.count, 0);
  const persenBekerja = totalPenduduk > 0 ? ((totalBekerja / totalPenduduk) * 100).toFixed(1) : "0";

  const totalDomestikPelajar = pekerjaanStats
    .filter((p) => ["Mengurus Rumah Tangga", "Pelajar / Mahasiswa", "Belum Bekerja / Pelajar"].includes(p.bidang))
    .reduce((acc, curr) => acc + curr.count, 0);
  const persenDomestikPelajar = totalPenduduk > 0 ? ((totalDomestikPelajar / totalPenduduk) * 100).toFixed(1) : "0";

  const rataRataJiwaPerPekerjaan = totalKategoriPekerjaan > 0 ? Math.round(totalPenduduk / totalKategoriPekerjaan) : 0;
  const rasioGenderBps = totalPerempuan > 0 ? ((totalLaki / totalPerempuan) * 100).toFixed(1) : "100";

  const displayedPekerjaan = React.useMemo(() => {
    if (jobFilter === "top10") return pekerjaanStats.slice(0, 10);
    if (jobFilter === "produktif") return pekerjaanStats.filter((p) => !nonProductiveKeys.includes(p.bidang));
    if (jobFilter === "domestik") return pekerjaanStats.filter((p) => nonProductiveKeys.includes(p.bidang));
    return pekerjaanStats;
  }, [jobFilter, pekerjaanStats]);

  // Segmentasi Donut Chart Pekerjaan (Top 7 Kategori + Lainnya)
  const jobDonutSegments = React.useMemo(() => {
    if (pekerjaanStats.length === 0 || totalPenduduk === 0) return [];
    const top7 = pekerjaanStats.slice(0, 7);
    const othersCount = pekerjaanStats.slice(7).reduce((acc, curr) => acc + curr.count, 0);
    const othersPct = totalPenduduk > 0 ? Number(((othersCount / totalPenduduk) * 100).toFixed(1)) : 0;

    const colors = [
      "#009388", // Teal Primary
      "#0891b2", // Cyan
      "#10b981", // Emerald
      "#eda50c", // Gold / Amber
      "#6366f1", // Indigo
      "#f43f5e", // Rose
      "#8b5cf6", // Violet
      "#64748b", // Slate for Lainnya
    ];

    const all = top7.map((item, idx) => ({
      ...item,
      color: colors[idx],
    }));

    if (othersCount > 0) {
      all.push({
        bidang: "Kategori Lainnya",
        count: othersCount,
        jumlah: `${othersCount.toLocaleString("id-ID")} Jiwa`,
        persen: othersPct,
        color: colors[7],
      });
    }

    const circumference = 251.327;
    let accumulated = 0;

    return all.map((seg) => {
      const strokeLength = (seg.count / totalPenduduk) * circumference;
      const strokeOffset = -accumulated;
      accumulated += strokeLength;
      return {
        ...seg,
        strokeLength,
        strokeOffset,
      };
    });
  }, [pekerjaanStats, totalPenduduk]);

  const stats = [
    {
      label: "Total Penduduk",
      value: loading ? "..." : totalPenduduk.toLocaleString("id-ID"),
      sub: "Jiwa Warga Terdaftar",
    },
    {
      label: "Kepala Keluarga",
      value: loading ? "..." : totalKK.toLocaleString("id-ID"),
      sub: "Kepala Keluarga (KK)",
    },
    {
      label: "Laki-Laki",
      value: loading ? "..." : totalLaki.toLocaleString("id-ID"),
      sub: `${persenLaki}% dari total`,
    },
    {
      label: "Perempuan",
      value: loading ? "..." : totalPerempuan.toLocaleString("id-ID"),
      sub: `${persenPerempuan}% dari total`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      <CivicNavbar />

      <main className="flex-1 pb-24">
        {/* Banner Section */}
        <section className="bg-gradient-to-b from-[#003733] to-[#002825] text-white pt-12 pb-16 border-b border-[#005851] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#009388_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-2 text-xs text-emerald-200/80 mb-4 font-mono">
              <Link href="/" className="hover:text-white transition">Beranda</Link>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              <Link href="/profil/pemerintahan" className="hover:text-white transition">Profil Desa</Link>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white font-semibold">Demografi & Statistik</span>
            </div>

            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5" />
                  Pusat Data Kependudukan
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Sinkronisasi Realtime Supabase
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Demografi & Kependudukan
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Visualisasi data agregat penduduk Desa Kadurama yang bersumber langsung dari database induk kependudukan desa. Data terhitung dinamis sesuai warga yang telah terdata.
              </p>
            </div>

            {/* Quick KPI Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
              {stats.map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15">
                  <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                    {item.label}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {item.value}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
          {/* Status info bar */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <Info className="w-4 h-4 text-[#009388] shrink-0" />
            <span>
              <strong>Pembaruan Otomatis:</strong> Data statistik ini dihitung dinamis secara real-time dari {totalPenduduk} warga ({totalKK} KK) yang telah terverifikasi dalam database kependudukan Desa Kadurama.
            </span>
          </div>

          {/* Komparasi Statistik Gender (Laki-laki vs Perempuan) DENGAN DONUT CHART SVG */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-bold text-[#009388] uppercase tracking-wider flex items-center gap-2">
                  <PieChart className="w-3.5 h-3.5" />
                  Visualisasi Komposisi Jenis Kelamin
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Statistik & Rasio Gender Warga Desa Kadurama
                </h3>
              </div>
              <div className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                Total: <strong className="text-slate-900">{loading ? "..." : totalPenduduk.toLocaleString("id-ID")}</strong> Jiwa
              </div>
            </div>

            {/* Visual Donut Chart + Detail Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Donut Chart SVG (40%) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <div className="relative w-52 h-52 sm:w-56 sm:h-56 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#e2e8f0"
                      strokeWidth="12"
                    />
                    {/* Segment Laki-laki (Cyan) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#0891b2"
                      strokeWidth="12"
                      strokeDasharray={`${totalPenduduk > 0 ? (totalLaki / totalPenduduk) * 251.327 : 125.66} 251.327`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    {/* Segment Perempuan (Rose) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#f43f5e"
                      strokeWidth="12"
                      strokeDasharray={`${totalPenduduk > 0 ? (totalPerempuan / totalPenduduk) * 251.327 : 125.66} 251.327`}
                      strokeDashoffset={`-${totalPenduduk > 0 ? (totalLaki / totalPenduduk) * 251.327 : 125.66}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  {/* Donut Center Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                      Total Warga
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono leading-tight">
                      {loading ? "..." : totalPenduduk.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                      100% Sensus
                    </span>
                  </div>
                </div>

                {/* Legend Chips Under Chart */}
                <div className="flex items-center gap-4 mt-5 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-cyan-600 ring-2 ring-cyan-200" />
                    <span className="text-slate-700">Laki-Laki ({persenLaki}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                    <span className="text-slate-700">Perempuan ({persenPerempuan}%)</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Comparative Metric Cards & Progress Bars (60%) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Laki-Laki Card */}
                <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                        L
                      </span>
                      <div>
                        <div className="text-xs font-bold text-cyan-950 uppercase tracking-wider">
                          Warga Laki-Laki
                        </div>
                        <div className="text-[11px] text-cyan-700">
                          Populasi pria terdaftar di seluruh 3 dusun
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-cyan-950 font-mono">
                        {loading ? "..." : totalLaki.toLocaleString("id-ID")} <span className="text-xs font-sans font-normal text-cyan-700">Jiwa</span>
                      </div>
                      <span className="text-xs font-bold text-cyan-800 bg-cyan-100/80 px-2 py-0.5 rounded-md border border-cyan-200">
                        {persenLaki}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-cyan-200/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${persenLaki}%` }}
                    />
                  </div>
                </div>

                {/* Perempuan Card */}
                <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-rose-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
                        P
                      </span>
                      <div>
                        <div className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                          Warga Perempuan
                        </div>
                        <div className="text-[11px] text-rose-700">
                          Populasi wanita terdaftar di seluruh 3 dusun
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-rose-950 font-mono">
                        {loading ? "..." : totalPerempuan.toLocaleString("id-ID")} <span className="text-xs font-sans font-normal text-rose-700">Jiwa</span>
                      </div>
                      <span className="text-xs font-bold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded-md border border-rose-200">
                        {persenPerempuan}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-rose-200/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${persenPerempuan}%` }}
                    />
                  </div>
                </div>

                {/* Rasio Gender BPS Note */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-2 font-medium">
                    <TrendingUp className="w-4 h-4 text-[#009388]" />
                    <span>Rasio Jenis Kelamin (Sex Ratio BPS):</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {rasioGenderBps} Laki-laki / 100 Perempuan
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dusun Breakdown with Population Proportion Share Chart */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-bold text-[#009388] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Distribusi Proporsi Kewilayahan
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Proporsi Sebaran Penduduk Antar 3 Dusun
                </h3>
              </div>
              <div className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                Total Populasi: <strong className="text-slate-900">{totalPenduduk.toLocaleString("id-ID")}</strong> Jiwa
              </div>
            </div>

            {/* Visual Stacked Proportion Bar */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Porsi Populasi Warga (% dari Total 2.481 Jiwa)</span>
                <span className="font-mono text-slate-500">100% Sensus Terdata</span>
              </div>

              {/* Tri-Color Stacked Percentage Bar */}
              <div className="w-full h-5 rounded-full overflow-hidden flex bg-slate-200 p-0.5 border border-slate-200 shadow-inner">
                <div
                  className="h-full rounded-l-full bg-teal-600 transition-all duration-700"
                  style={{ width: `${totalPenduduk > 0 ? (dusunStats[0]?.jiwa / totalPenduduk) * 100 : 33.3}%` }}
                  title={`Dusun Pahing: ${dusunStats[0]?.jiwa} Jiwa (${dusunStats[0]?.porsi})`}
                />
                <div
                  className="h-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${totalPenduduk > 0 ? (dusunStats[1]?.jiwa / totalPenduduk) * 100 : 33.1}%` }}
                  title={`Dusun Wage: ${dusunStats[1]?.jiwa} Jiwa (${dusunStats[1]?.porsi})`}
                />
                <div
                  className="h-full rounded-r-full bg-[#eda50c] transition-all duration-700"
                  style={{ width: `${totalPenduduk > 0 ? (dusunStats[2]?.jiwa / totalPenduduk) * 100 : 33.6}%` }}
                  title={`Dusun Manis: ${dusunStats[2]?.jiwa} Jiwa (${dusunStats[2]?.porsi})`}
                />
              </div>

              {/* Legend Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-teal-600 shrink-0" />
                  <span className="font-bold text-slate-800">Dusun I Pahing:</span>
                  <span className="font-mono text-slate-600">{dusunStats[0]?.jiwa} Jiwa ({dusunStats[0]?.porsi})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-bold text-slate-800">Dusun II Wage:</span>
                  <span className="font-mono text-slate-600">{dusunStats[1]?.jiwa} Jiwa ({dusunStats[1]?.porsi})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#eda50c] shrink-0" />
                  <span className="font-bold text-slate-800">Dusun III Manis:</span>
                  <span className="font-mono text-slate-600">{dusunStats[2]?.jiwa} Jiwa ({dusunStats[2]?.porsi})</span>
                </div>
              </div>
            </div>

            {/* Dusun 3 Cards Details with clean companion metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dusunStats.map((dsn, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#009388] uppercase tracking-wider">
                        {dsn.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {dsn.area}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      {loading ? "..." : dsn.jiwa.toLocaleString("id-ID")} <span className="text-xs font-normal text-slate-500">Jiwa</span>
                    </div>
                    <div className="text-xs text-slate-600 font-mono mt-0.5 flex items-center gap-2">
                      <span className="font-bold text-[#009388] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {dsn.porsi} Porsi
                      </span>
                      <span>•</span>
                      <span>{dsn.kk} KK</span>
                      <span>•</span>
                      <span>{dsn.rtRw}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {dsn.role}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <Link
                      href={`/dusun/${dsn.slug}`}
                      className="text-xs font-bold text-[#009388] hover:underline flex items-center justify-between"
                    >
                      <span>Buka Profil {dsn.name}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keadaan Wilayah & Luas Tanah Berdasarkan Peruntukan */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#009388] text-xs font-bold uppercase tracking-wider border border-emerald-200/60 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Monografi Wilayah Resmi
                </span>
                <span className="text-xs text-slate-400 font-mono">KODE DESA: 32.08.10.2002</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Keadaan Wilayah & Luas Tanah Berdasarkan Peruntukan
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
                Rincian autentik keadaan wilayah Desa Kadurama seluas 89 Ha (termasuk tanah perhutani), pembagian tanah sawah dan tanah darat, serta peruntukan hak kepemilikan tanah kas desa dan tanah hak milik warga.
              </p>
            </div>

            {/* 3 Core Spatial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white relative overflow-hidden">
                <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  Total Luas Desa
                </div>
                <div className="text-3xl font-black font-mono mt-1 text-white">
                  89 <span className="text-lg font-sans font-medium text-emerald-200">Ha</span>
                </div>
                <div className="text-xs text-emerald-100/80 mt-1">
                  Termasuk Tanah Perhutani
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-slate-300">
                  Cakupan teritorial definitif batas desa
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Luas Tanah Sawah
                </div>
                <div className="text-3xl font-black font-mono mt-1 text-slate-900">
                  42 <span className="text-lg font-sans font-medium text-slate-500">Ha</span>
                </div>
                <div className="text-xs text-[#009388] font-bold mt-1">
                  47,2% Porsi Total Wilayah
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500">
                  Lahan pertanian basah, sawah irigasi teknis & tadah hujan
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Luas Tanah Darat
                </div>
                <div className="text-3xl font-black font-mono mt-1 text-slate-900">
                  47 <span className="text-lg font-sans font-medium text-slate-500">Ha</span>
                </div>
                <div className="text-xs text-[#eda50c] font-bold mt-1">
                  52,8% Porsi Total Wilayah
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500">
                  Permukiman warga, pekarangan, fasilitas umum & perhutani
                </div>
              </div>
            </div>

            {/* Rincian Luas Tanah Berdasarkan Peruntukan */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    Rincian Peruntukan Tanah Desa Kadurama
                  </h4>
                  <p className="text-xs text-slate-500">
                    Klasifikasi legalitas kepemilikan dan penggunaan fungsi tanah desa.
                  </p>
                </div>
                <span className="hidden sm:inline-flex text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  Standar Pencatatan Buku Monografi Desa
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bagian 1: Tanah Kas Desa (TKD) */}
                <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold text-[#009388] uppercase tracking-wider flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5" />
                      Tanah Kas Desa (TKD) & Fasilitas Umum
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      3 Objek Aset
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-slate-900">Luas Tanah Ex Bengkok</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Tanah kas desa eks-bengkok pamong desa
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-extrabold text-sm text-[#009388]">11,076 Ha</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-slate-900">Luas Tanah Kuburan</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Area tempat pemakaman umum (TPU) warga desa
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-extrabold text-sm text-[#009388]">1 Ha</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-slate-900">Luas TKD Lainnya (Fasum)</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Gedung balai desa, gedung sekolah, lapang olahraga & gedung/fasum lainnya
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-extrabold text-sm text-[#009388]">0,96 Ha</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bagian 2: Tanah Hak Milik Warga */}
                <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5" />
                      Luas Tanah Hak Milik Warga
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      3 Kategori Hak Milik
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-slate-900">Tanah Sawah Hak Milik</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Sawah produktif bersertifikat hak milik warga
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-extrabold text-sm text-amber-700">10,5 Ha</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-slate-900">Tanah Darat / Tegalan Hak Milik</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Lahan tegalan, kebun produktif & palawija milik warga
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-extrabold text-sm text-amber-700">23 Ha</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-slate-900">Tanah Permukiman / Pekarangan</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Kawasan tapak permukiman perumahan & pekarangan warga 3 dusun
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-extrabold text-sm text-amber-700">45 Ha</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pekerjaan Stats & Dashboard Ketenagakerjaan */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-bold text-[#009388] uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" />
                  Struktur Mata Pencaharian & Ketenagakerjaan
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Statistik Distribusi Profesi Warga Desa Kadurama
                </h3>
              </div>
              <div className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                Total: <strong className="text-slate-900">{totalKategoriPekerjaan}</strong> Klasifikasi Profesi
              </div>
            </div>

            {/* 3 Metric Card Statistik Pekerjaan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Sektor Produktif / Bekerja
                  </div>
                  <Briefcase className="w-4 h-4 text-[#009388]" />
                </div>
                <div className="text-2xl font-black text-emerald-950 mt-1">
                  {loading ? "..." : totalBekerja.toLocaleString("id-ID")} <span className="text-xs font-normal text-emerald-700">Jiwa</span>
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                  {persenBekerja}% dari total populasi terdata (Buruh, Swasta, Wiraswasta, Petani, Pedagang, PNS)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    Domestik & Pelajar
                  </div>
                  <Home className="w-4 h-4 text-amber-700" />
                </div>
                <div className="text-2xl font-black text-amber-950 mt-1">
                  {loading ? "..." : totalDomestikPelajar.toLocaleString("id-ID")} <span className="text-xs font-normal text-amber-700">Jiwa</span>
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5 font-medium">
                  {persenDomestikPelajar}% porsi Ibu Rumah Tangga (IRT) dan Pelajar/Mahasiswa
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Rata-Rata per Profesi
                  </div>
                  <TrendingUp className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  ~{loading ? "..." : rataRataJiwaPerPekerjaan} <span className="text-xs font-normal text-slate-500">Jiwa / Bidang</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                  Rata-rata sebaran warga pada {totalKategoriPekerjaan} klasifikasi lapangan usaha
                </div>
              </div>
            </div>

            {/* Donut Chart Pekerjaan Interaktif (Bisa di-hover persentasenya) */}
            {jobDonutSegments.length > 0 && (
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-5 border border-slate-800 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      <PieChart className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Grafik Lingkaran Struktur Mata Pencaharian (Interaktif)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Arahkan kursor ke lingkaran untuk melihat detail & persentase
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Lingkaran Donut SVG Interaktif (5 Kolom) */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center">
                    <div className="relative w-56 h-56 sm:w-60 sm:h-60 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background Base Ring */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#1e293b"
                          strokeWidth="12"
                        />
                        {/* Slices */}
                        {jobDonutSegments.map((seg, idx) => {
                          const isHovered = hoveredJob?.bidang === seg.bidang;
                          return (
                            <circle
                              key={idx}
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke={seg.color}
                              strokeWidth={isHovered ? 15 : 12}
                              strokeDasharray={`${seg.strokeLength} 251.327`}
                              strokeDashoffset={seg.strokeOffset}
                              strokeLinecap="round"
                              className="transition-all duration-300 cursor-pointer hover:opacity-90"
                              onMouseEnter={() =>
                                setHoveredJob({ bidang: seg.bidang, count: seg.count, persen: seg.persen })
                              }
                              onMouseLeave={() => setHoveredJob(null)}
                            />
                          );
                        })}
                      </svg>

                      {/* Center Hover Label Dynamic */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 pointer-events-none">
                        {hoveredJob ? (
                          <>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 font-sans truncate max-w-[130px]">
                              {hoveredJob.bidang}
                            </span>
                            <span className="text-3xl font-black text-white font-mono mt-0.5 leading-none">
                              {hoveredJob.persen}%
                            </span>
                            <span className="text-[11px] text-slate-300 font-mono mt-1">
                              {hoveredJob.count.toLocaleString("id-ID")} Jiwa
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                              Total Klasifikasi
                            </span>
                            <span className="text-2xl font-black text-white font-mono mt-0.5">
                              {totalKategoriPekerjaan} Profesi
                            </span>
                            <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/20 px-2 py-0.5 rounded-full mt-1 border border-emerald-400/30">
                              Hover Lingkaran
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Legenda & Ranking Sektor (7 Kolom) */}
                  <div className="lg:col-span-7 space-y-2.5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Komposisi Persentase Sektor Pekerjaan Terbesar:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {jobDonutSegments.map((seg, idx) => {
                        const isHovered = hoveredJob?.bidang === seg.bidang;
                        return (
                          <div
                            key={idx}
                            onMouseEnter={() =>
                              setHoveredJob({ bidang: seg.bidang, count: seg.count, persen: seg.persen })
                            }
                            onMouseLeave={() => setHoveredJob(null)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isHovered
                                ? "bg-slate-800 border-emerald-400 shadow-md ring-1 ring-emerald-400/30"
                                : "bg-slate-800/60 border-slate-700/60 hover:bg-slate-800"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: seg.color }}
                              />
                              <span className="text-xs font-bold text-slate-200 truncate">
                                {seg.bidang}
                              </span>
                            </div>
                            <div className="font-mono text-xs font-extrabold text-right shrink-0 pl-2">
                              <span className="text-white">{seg.persen}%</span>
                              <span className="text-[10px] text-slate-400 block font-normal">
                                {seg.count} org
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Tabs & List Distribusi Pekerjaan */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    Filter:
                  </span>
                  <button
                    onClick={() => setJobFilter("top10")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      jobFilter === "top10"
                        ? "bg-[#009388] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    10 Besar Profesi
                  </button>
                  <button
                    onClick={() => setJobFilter("produktif")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      jobFilter === "produktif"
                        ? "bg-[#009388] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Sektor Produktif ({pekerjaanStats.filter((p) => !nonProductiveKeys.includes(p.bidang)).length})
                  </button>
                  <button
                    onClick={() => setJobFilter("domestik")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      jobFilter === "domestik"
                        ? "bg-[#009388] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Domestik & Pelajar ({pekerjaanStats.filter((p) => nonProductiveKeys.includes(p.bidang)).length})
                  </button>
                  <button
                    onClick={() => setJobFilter("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      jobFilter === "all"
                        ? "bg-[#009388] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Semua ({totalKategoriPekerjaan})
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 font-mono text-right">
                  Menampilkan <strong>{displayedPekerjaan.length}</strong> dari {totalKategoriPekerjaan} kategori
                </div>
              </div>

              {displayedPekerjaan.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  Tidak ada data profesi pada kategori ini.
                </p>
              ) : (
                <div className="space-y-3">
                  {displayedPekerjaan.map((pek, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-300 transition-colors space-y-2"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 font-mono text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-slate-800 text-sm">{pek.bidang}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-extrabold text-slate-900">{pek.jumlah}</span>
                          <span className="text-xs font-bold text-[#009388] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {pek.persen}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#009388] to-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(pek.persen, 1.5)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <CivicFooter />
    </div>
  );
}
