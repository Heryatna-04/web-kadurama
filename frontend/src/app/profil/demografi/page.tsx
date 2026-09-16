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

          {/* Komparasi Statistik Gender (Laki-laki vs Perempuan) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-bold text-[#009388] uppercase tracking-wider">
                  Komposisi Kependudukan Berdasarkan Jenis Kelamin
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Statistik Rasio Gender Warga Desa Kadurama
                </h3>
              </div>
              <div className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                Total: <strong className="text-slate-900">{loading ? "..." : totalPenduduk.toLocaleString("id-ID")}</strong> Jiwa
              </div>
            </div>

            {/* Bar Visual Progress Rasio Gender */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2 text-cyan-800">
                  <span className="w-3 h-3 rounded-full bg-cyan-600" />
                  <span>Laki-Laki: {loading ? "..." : totalLaki.toLocaleString("id-ID")} Jiwa ({persenLaki}%)</span>
                </div>
                <div className="flex items-center gap-2 text-rose-800">
                  <span>Perempuan: {loading ? "..." : totalPerempuan.toLocaleString("id-ID")} Jiwa ({persenPerempuan}%)</span>
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                </div>
              </div>

              {/* Stacked Percentage Bar */}
              <div className="w-full h-5 rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200 shadow-inner">
                <div
                  className="h-full rounded-l-full bg-gradient-to-r from-cyan-600 to-cyan-500 transition-all duration-700 relative group"
                  style={{ width: `${persenLaki}%` }}
                  title={`Laki-laki: ${totalLaki} Jiwa (${persenLaki}%)`}
                />
                <div
                  className="h-full rounded-r-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-700 relative group"
                  style={{ width: `${persenPerempuan}%` }}
                  title={`Perempuan: ${totalPerempuan} Jiwa (${persenPerempuan}%)`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>0% Laki-laki</span>
                <span className="text-slate-600 font-bold bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                  Rasio Gender: {rasioGenderBps} Laki-laki per 100 Perempuan
                </span>
                <span>100% Perempuan</span>
              </div>
            </div>

            {/* Grid 2 Card Detail Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">Populasi Laki-Laki</div>
                  <div className="text-2xl font-black text-cyan-950 mt-0.5">
                    {loading ? "..." : totalLaki.toLocaleString("id-ID")} <span className="text-xs font-normal text-cyan-700">Jiwa</span>
                  </div>
                  <div className="text-[11px] text-cyan-700 mt-0.5 font-medium">Porsi {persenLaki}% dari total warga terdata</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-cyan-600/20">
                  L
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Populasi Perempuan</div>
                  <div className="text-2xl font-black text-rose-950 mt-0.5">
                    {loading ? "..." : totalPerempuan.toLocaleString("id-ID")} <span className="text-xs font-normal text-rose-700">Jiwa</span>
                  </div>
                  <div className="text-[11px] text-rose-700 mt-0.5 font-medium">Porsi {persenPerempuan}% dari total warga terdata</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-rose-500/20">
                  P
                </div>
              </div>
            </div>
          </div>

          {/* Dusun Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Distribusi Kependudukan per Dusun
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Rincian jumlah kepala keluarga dan populasi jiwa yang terdaftar pada 3 wilayah dusun di Desa Kadurama.
            </p>

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
                        {dsn.jiwa === 0 && !loading && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            Data Belum Lengkap
                          </span>
                        )}
                        <span className="text-[11px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {dsn.area}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      {loading ? "..." : dsn.jiwa} <span className="text-xs font-normal text-slate-500">Jiwa</span>
                    </div>
                    <div className="text-xs text-slate-600 font-mono mt-0.5">
                      {loading ? "..." : dsn.kk} KK • {dsn.rtRw} • Porsi {dsn.porsi}
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
                      <span>Buka Halaman {dsn.name}</span>
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

            {/* List Distribusi Lengkap Pekerjaan */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Peringkat & Persentase Profesi Terdaftar</span>
                <span className="text-[11px] text-slate-400 font-normal">Urutan berdasarkan frekuensi terbanyak</span>
              </div>

              {pekerjaanStats.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada data mata pencaharian terdata.</p>
              ) : (
                <div className="space-y-3.5">
                  {pekerjaanStats.map((pek, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-300 transition-colors space-y-2">
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
