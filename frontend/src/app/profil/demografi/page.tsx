"use client";

import React from "react";
import Link from "next/link";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import {
  Users,
  ChevronRight,
  TrendingUp,
  PieChart,
  Home,
  GraduationCap,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

export default function DemografiPage() {
  const stats = [
    { label: "Total Penduduk", value: "1.768", sub: "Jiwa Warga" },
    { label: "Kepala Keluarga", value: "522", sub: "Kepala Keluarga (KK)" },
    { label: "Laki-Laki", value: "894", sub: "50.6% dari total" },
    { label: "Perempuan", value: "874", sub: "49.4% dari total" },
  ];

  const dusunStats = [
    { dusun: "Dusun I Manis", kk: 184, jiwa: 620, porsi: "35.1%", role: "Pusat Pemerintahan & Usaha Olahan Pangan" },
    { dusun: "Dusun II Pahing", kk: 192, jiwa: 656, porsi: "37.1%", role: "Lumbung Padi Organik 28 Ha & Gelora Olahraga" },
    { dusun: "Dusun III Wage", kk: 146, jiwa: 492, porsi: "27.8%", role: "Mata Air Cikaduran 45 L/s & Agrowisata Ubi" },
  ];

  const pekerjaanStats = [
    { bidang: "Petani & Buruh Tani", jumlah: "612 Jiwa", persen: 46.2 },
    { bidang: "Wiraswasta / UMKM Pangan", jumlah: "248 Jiwa", persen: 18.7 },
    { bidang: "Karyawan Swasta / Jasa", jumlah: "195 Jiwa", persen: 14.7 },
    { bidang: "PNS, Guru, & TNI/Polri", jumlah: "86 Jiwa", persen: 6.5 },
    { bidang: "Lainnya / Pelajar / Mahasiswa", jumlah: "184 Jiwa", persen: 13.9 },
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
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                Monografi Kependudukan
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Demografi & Kependudukan
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Visualisasi data agregat penduduk Desa Kadurama berbasis sensus SDGs desa 2026. Mencakup proporsi wilayah 3 dusun, struktur usia, dan mata pencaharian utama warga.
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
          {/* Dusun Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Distribusi Kependudukan per Dusun
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Rincian jumlah kepala keluarga dan populasi jiwa yang tersebar di 21 RT pada 3 wilayah dusun.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dusunStats.map((dsn, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-[#009388] uppercase tracking-wider">
                      {dsn.dusun}
                    </span>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      {dsn.jiwa} <span className="text-xs font-normal text-slate-500">Jiwa</span>
                    </div>
                    <div className="text-xs text-slate-600 font-mono mt-0.5">
                      {dsn.kk} Kepala Keluarga • Porsi {dsn.porsi}
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {dsn.role}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <Link
                      href={`/dusun/${dsn.dusun.split(" ")[2].toLowerCase()}`}
                      className="text-xs font-bold text-[#009388] hover:underline flex items-center justify-between"
                    >
                      <span>Buka Halaman {dsn.dusun}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pekerjaan Stats */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Mata Pencaharian Utama Warga
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Mayoritas penduduk berprofesi di sektor pertanian padi organik dan perkebunan ubi jalar lereng Ciremai.
            </p>

            <div className="space-y-4">
              {pekerjaanStats.map((pek, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{pek.bidang}</span>
                    <span className="font-mono text-slate-600 font-bold">
                      {pek.jumlah} ({pek.persen}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#009388] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pek.persen}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <CivicFooter />
    </div>
  );
}
