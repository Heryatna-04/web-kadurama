"use client";

import React, { useState } from "react";
import Link from "next/link";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import {
  KUWU_HISTORY_LIST,
  DESA_SEJARAH_DATA,
  VISI_MISI_DATA,
} from "@/data/sejarahVisiMisiData";
import {
  BookOpen,
  Target,
  History,
  ChevronRight,
  Compass,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  CloudRain,
  Mountain,
  Navigation,
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
} from "lucide-react";

export default function SejarahVisiMisiPage() {
  const [activeTab, setActiveTab] = useState<"sejarah" | "visimisi">("sejarah");

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      <CivicNavbar />

      <main className="flex-1 pb-24">
        {/* Banner Hero */}
        <section className="bg-gradient-to-b from-[#003733] to-[#002825] text-white pt-12 pb-16 border-b border-[#005851] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#009388_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-2 text-xs text-emerald-200/80 mb-4 font-mono">
              <Link href="/" className="hover:text-white transition">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white font-semibold">Profil Desa</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">
                Sejarah, Visi & Misi
              </span>
            </div>

            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                <History className="w-3.5 h-3.5 text-[#eda50c]" />
                Jatidiri & Arah Kebijakan Desa Kadurama
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Sejarah, Visi & Misi Desa
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Mengenal rekam jejak kepemimpinan Kuwu sejak tahun 1805, kondisi kewilayahan, serta komitmen Visi Misi pembangunan Kepala Desa Kadurama.
              </p>
            </div>

            {/* Segmented Tab Controller */}
            <div className="mt-8 flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/20 w-fit backdrop-blur-md">
              <button
                onClick={() => setActiveTab("sejarah")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab === "sejarah"
                    ? "bg-[#eda50c] text-slate-950 shadow-md"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Sejarah & Rekam Jejak Kuwu</span>
              </button>
              <button
                onClick={() => setActiveTab("visimisi")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab === "visimisi"
                    ? "bg-[#009388] text-white shadow-md"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Target className="w-4 h-4" />
                <span>Visi & Misi Kepala Desa</span>
              </button>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {/* TAB 1: SEJARAH DESA */}
          {activeTab === "sejarah" && (
            <div className="space-y-12">
              {/* Narasi Pengantar Sejarah */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#009388]" />
                <div className="max-w-3xl space-y-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#009388]">
                    Asal Usul & Dinamika Waktu
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {DESA_SEJARAH_DATA.title}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {DESA_SEJARAH_DATA.overview}
                  </p>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 leading-relaxed flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#eda50c] shrink-0 mt-0.5" />
                    <div>
                      <strong>Tutur Tradisi Lisan:</strong> {DESA_SEJARAH_DATA.originStory}
                    </div>
                  </div>
                </div>
              </div>

              {/* Garis Masa / Silsilah Kuwu Desa Kadurama */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#009388]">
                      Kronologi Kepemimpinan
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      Silsilah Kuwu Desa Kadurama (1805 – Sekarang)
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Total 15 Periode Kepemimpinan
                  </div>
                </div>

                {/* Timeline Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {KUWU_HISTORY_LIST.map((kuwu, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                        kuwu.isCurrent
                          ? "bg-gradient-to-br from-[#003733] to-[#002825] text-white border-[#009388] shadow-lg ring-2 ring-[#009388]/30"
                          : "bg-white text-slate-900 border-slate-200 hover:border-[#009388]/40 hover:shadow-xs"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          kuwu.isCurrent
                            ? "bg-[#eda50c] text-slate-950 shadow-md"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {idx + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-mono font-bold ${
                              kuwu.isCurrent ? "text-[#eda50c]" : "text-[#009388]"
                            }`}
                          >
                            {kuwu.period}
                          </span>
                          {kuwu.isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-bold uppercase">
                              Menjabat
                            </span>
                          )}
                        </div>
                        <h4
                          className={`font-extrabold text-base uppercase leading-tight ${
                            kuwu.isCurrent ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {kuwu.name}
                        </h4>
                        <div
                          className={`text-[11px] ${
                            kuwu.isCurrent ? "text-emerald-200/80" : "text-slate-400"
                          }`}
                        >
                          Kuwu Desa Kadurama
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Letak Geografis & Batas Wilayah */}
              <div className="space-y-6 pt-4">
                <div className="border-b border-slate-200 pb-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#009388]">
                    Kondisi Wilayah & Aksesibilitas
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Letak Geografis & Batas Wilayah Desa
                  </h3>
                </div>

                {/* 4 Cards Indikator Geografis */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200">
                    <div className="text-xs text-slate-400 font-bold uppercase">Kecamatan</div>
                    <div className="text-lg font-black text-slate-900 mt-1">Ciawigebang</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">1 Km dari pusat kota kec.</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200">
                    <div className="text-xs text-slate-400 font-bold uppercase">Topografi / Ketinggian</div>
                    <div className="text-lg font-black text-slate-900 mt-1">550 mdpl</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Dataran rendah lereng</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200">
                    <div className="text-xs text-slate-400 font-bold uppercase">Curah Hujan</div>
                    <div className="text-lg font-black text-slate-900 mt-1">2.124 Mm/Thn</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Subur untuk pertanian</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200">
                    <div className="text-xs text-slate-400 font-bold uppercase">Luas Total Wilayah</div>
                    <div className="text-lg font-black text-[#009388] mt-1">89 Hektar</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Termasuk tanah perhutani</div>
                  </div>
                </div>

                {/* Grid Batas Wilayah & Jarak Tempuh */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Batas 4 Mata Angin */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Compass className="w-4 h-4 text-[#009388]" />
                      <span>Batas Wilayah Administratif Desa</span>
                    </div>

                    <div className="space-y-3">
                      {DESA_SEJARAH_DATA.geografi.batasWilayah.map((batas, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        >
                          <span className="font-bold text-slate-600">{batas.arah}</span>
                          <span className="font-extrabold text-[#003733] text-sm">
                            {batas.berbatasanDengan}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Jarak Tempuh ke Pusat Kegiatan */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Navigation className="w-4 h-4 text-[#eda50c]" />
                      <span>Jarak Tempuh Antar-Wilayah Luar Desa</span>
                    </div>

                    <div className="space-y-3">
                      {DESA_SEJARAH_DATA.geografi.jarakTempuh.map((jarak, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        >
                          <span className="font-medium text-slate-700">{jarak.tujuan}</span>
                          <span className="font-mono font-bold text-[#009388] text-sm bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                            {jarak.jarak}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pembagian Wilayah 3 Dusun */}
                <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Struktur Teritorial Desa
                    </div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">
                      Wilayah Terbagi Atas 3 Dusun, 3 RW, dan 8 RT
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {DESA_SEJARAH_DATA.geografi.pembagianWilayah.dusunList.map((dsn, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs"
                      >
                        {dsn.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VISI & MISI */}
          {activeTab === "visimisi" && (
            <div className="space-y-12">
              {/* Box Visi Kepala Desa */}
              <div className="bg-gradient-to-br from-[#003733] via-[#005851] to-[#009388] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-4xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eda50c] text-slate-950 font-bold text-xs uppercase tracking-wider">
                    <Target className="w-3.5 h-3.5" />
                    Visi Pembangunan Desa Kadurama
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                    &ldquo;{VISI_MISI_DATA.visi}&rdquo;
                  </h2>

                  <div className="pt-4 border-t border-white/20 text-xs sm:text-sm text-emerald-50 leading-relaxed font-normal">
                    {VISI_MISI_DATA.visiPenjelasan}
                  </div>
                </div>
              </div>

              {/* 9 Butir Misi Desa */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#009388]">
                      Agenda Strategis
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      9 Butir Misi Pembangunan Desa
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500">
                    Arah implementasi kebijakan untuk seluruh warga desa
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {VISI_MISI_DATA.misiList.map((misi, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-[#009388] hover:shadow-md transition flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="w-9 h-9 rounded-xl bg-[#e6f7f5] text-[#009388] font-black text-sm flex items-center justify-center border border-[#009388]/20 group-hover:bg-[#009388] group-hover:text-white transition">
                          {misi.code}
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                          {misi.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {misi.desc}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-[#009388]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Misi Butir ({misi.code.toLowerCase()})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tautan Cepat ke Dokumen Terkait */}
              <div className="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/profil/pemerintahan"
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#009388] transition shadow-2xs group"
                >
                  <Building2 className="w-5 h-5 text-[#009388] mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-sm text-slate-900">Struktur Pamong Desa</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Kuwu, BPD, Sekretariat, dan Kadus &rarr;</div>
                </Link>

                <Link
                  href="/transparansi/apbdes"
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#009388] transition shadow-2xs group"
                >
                  <ShieldCheck className="w-5 h-5 text-[#eda50c] mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-sm text-slate-900">Transparansi APBDes</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Realisasi 5 bidang anggaran desa &rarr;</div>
                </Link>

                <Link
                  href="/layanan"
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#009388] transition shadow-2xs group"
                >
                  <Users className="w-5 h-5 text-cyan-600 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-sm text-slate-900">Layanan Warga & Surat</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">10 SOP pengurusan dokumen fisik &rarr;</div>
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <CivicFooter />
    </div>
  );
}
