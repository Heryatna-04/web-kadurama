"use client";

import React, { useRef } from "react";
import Image from "next/image";
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
  ChevronLeft,
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
  GraduationCap,
  Award,
  Trees,
  HeartHandshake,
  Landmark,
  ArrowRight,
  Quote,
  Lightbulb,
  FileCheck,
  Layers,
} from "lucide-react";

export default function SejarahVisiMisiPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll handler untuk timeline horizontal
  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 360;
      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Membalik daftar silsilah kuwu: Periode paling baru (Kuwu Petahana) di depan, paling lama di akhir scroll
  const reversedKuwuList = [...KUWU_HISTORY_LIST].map((item, originalIndex) => ({
    ...item,
    originalOrder: originalIndex + 1,
  })).reverse();

  // Helper era historis berdasarkan tahun
  const getEraBadge = (period: string) => {
    if (period.includes("2019") || period.includes("2020") || period.includes("2027")) {
      return { label: "Era Petahana Aktif", color: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" };
    }
    if (period.includes("199") || period.includes("200") || period.includes("201")) {
      return { label: "Era Reformasi & Modern", color: "bg-cyan-50 text-cyan-800 border-cyan-200" };
    }
    if (period.includes("197") || period.includes("198") || period.includes("196")) {
      return { label: "Era Orde Baru & Transisi", color: "bg-amber-50 text-amber-800 border-amber-200" };
    }
    if (period.includes("193") || period.includes("194") || period.includes("195")) {
      return { label: "Era Pasca Kemerdekaan", color: "bg-rose-50 text-rose-800 border-rose-200" };
    }
    return { label: "Era Pra-Kemerdekaan / Hindia", color: "bg-slate-100 text-slate-700 border-slate-200" };
  };

  // Pengelompokan 9 Butir Misi ke dalam 3 Pilar Strategis
  const pilarList = [
    {
      pilarNumber: "PILAR I",
      pilarTitle: "Tata Kelola Pemerintahan & Akuntabilitas Terarah",
      pilarDesc: "Mewujudkan birokrasi desa yang bersih, transparan, terencana, dan menjunjung tinggi musyawarah mufakat bersama warga.",
      pilarTheme: "border-[#009388] bg-emerald-950/5",
      badgeColor: "bg-[#009388] text-white",
      items: VISI_MISI_DATA.misiList.filter((m) => ["A", "B", "H"].includes(m.code.toUpperCase())),
    },
    {
      pilarNumber: "PILAR II",
      pilarTitle: "Kualitas Pelayanan, Kapasitas SDM & Budaya Ramah",
      pilarDesc: "Mempersiapkan aparatur yang berintelektual dan berakhlak, mengutamakan kepuasan pelayanan, serta memupuk etika masyarakat ramah.",
      pilarTheme: "border-[#eda50c] bg-amber-950/5",
      badgeColor: "bg-[#eda50c] text-slate-950",
      items: VISI_MISI_DATA.misiList.filter((m) => ["C", "D", "F", "G"].includes(m.code.toUpperCase())),
    },
    {
      pilarNumber: "PILAR III",
      pilarTitle: "Ketahanan Ekonomi Pertanian & Sinergi Daerah",
      pilarDesc: "Memperkuat fondasi pertanian sebagai urat nadi ekonomi desa serta menyelaraskan kebijakan dengan visi besar Kabupaten Kuningan.",
      pilarTheme: "border-teal-600 bg-teal-950/5",
      badgeColor: "bg-teal-700 text-white",
      items: VISI_MISI_DATA.misiList.filter((m) => ["E", "I"].includes(m.code.toUpperCase())),
    },
  ];

  // Helper ikon spesifik tiap butir misi
  const getMisiIcon = (code: string) => {
    switch (code.toUpperCase()) {
      case "A":
        return <ShieldCheck className="w-5 h-5 text-[#009388]" />;
      case "B":
        return <Users className="w-5 h-5 text-emerald-600" />;
      case "C":
        return <HeartHandshake className="w-5 h-5 text-rose-500" />;
      case "D":
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case "E":
        return <MapPin className="w-5 h-5 text-amber-600" />;
      case "F":
        return <Sparkles className="w-5 h-5 text-[#eda50c]" />;
      case "G":
        return <Compass className="w-5 h-5 text-cyan-600" />;
      case "H":
        return <Building2 className="w-5 h-5 text-teal-600" />;
      case "I":
        return <Trees className="w-5 h-5 text-green-600" />;
      default:
        return <Award className="w-5 h-5 text-[#009388]" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      <CivicNavbar />

      <main className="flex-1 pb-24">
        {/* =================================================================== */}
        {/* SECTION 1: BANNER HERO RESMI DESA                                   */}
        {/* =================================================================== */}
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
                Sejarah, Kepemimpinan & Visi Misi
              </span>
            </div>

            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                <History className="w-3.5 h-3.5 text-[#eda50c]" />
                Jatidiri, Rekam Jejak & Arah Kebijakan Desa
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Sejarah, Kepemimpinan & Visi Misi Desa Kadurama
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Menelusuri sejarah autentik Desa Kadurama sejak 1805, kesinambungan estafet kepemimpinan 15 Kuwu, serta komitmen Dekrit Visi Misi Kepala Desa menuju tata kelola yang transparan dan sejahtera.
              </p>
            </div>

            {/* 4 KPI Ringkasan Historis */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-[11px] font-bold text-[#eda50c] uppercase tracking-wider font-mono">
                  Sejarah Sejak
                </div>
                <div className="text-2xl font-black text-white font-mono mt-0.5">Tahun 1805</div>
                <div className="text-[11px] text-slate-300 mt-0.5">221+ tahun riwayat kepemimpinan</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider font-mono">
                  Silsilah Kuwu
                </div>
                <div className="text-2xl font-black text-white font-mono mt-0.5">15 Periode</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Estafet kepemimpinan desa</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider font-mono">
                  Teritorial Desa
                </div>
                <div className="text-2xl font-black text-white font-mono mt-0.5">89 Hektar</div>
                <div className="text-[11px] text-slate-300 mt-0.5">3 Dusun: Pahing, Wage, Manis</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider font-mono">
                  Agenda Kebijakan
                </div>
                <div className="text-2xl font-black text-white font-mono mt-0.5">9 Butir Misi</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Dikelompokkan dalam 3 pilar</div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
          {/* =================================================================== */}
          {/* SECTION 2: SEJARAH DESA DENGAN FOTO KUWU DI SEBELAH KANAN           */}
          {/* =================================================================== */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Kolom Kiri: Narasi Sejarah Desa (7 Kolom) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-[#009388] text-xs font-extrabold uppercase tracking-wider border border-emerald-200/80 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Asal Usul & Dinamika Waktu
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Kecamatan Ciawigebang</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {DESA_SEJARAH_DATA.title}
                </h2>

                <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
                  <p className="first-letter:text-4xl first-letter:font-black first-letter:text-[#009388] first-letter:mr-2 first-letter:float-left">
                    {DESA_SEJARAH_DATA.overview}
                  </p>
                  <p>
                    Sebagai bagian integral dari Kabupaten Kuningan yang berdekatan langsung dengan pusat Kecamatan Ciawigebang, Desa Kadurama bertumbuh di lereng timur Gunung Ciremai dengan keasrian alam, tanah persawahan subur, serta harmoni kebersamaan warganya yang senantiasa terjaga dari generasi ke generasi.
                  </p>
                </div>

                {/* Kotak Tradisi Lisan */}
                <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs sm:text-sm text-amber-950 leading-relaxed flex items-start gap-3.5">
                  <Quote className="w-5 h-5 text-[#eda50c] shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-extrabold text-amber-950 block mb-1">
                      Tutur Tradisi Lisan Masyarakat:
                    </strong>
                    {DESA_SEJARAH_DATA.originStory}
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Potret Resmi Kuwu Petahana (5 Kolom) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#003733] to-[#002220] p-6 text-white shadow-xl border border-[#009388]/40 relative overflow-hidden group">
                  {/* Decorative ambient aura */}
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-[#009388]/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-[#eda50c]/15 rounded-full blur-2xl pointer-events-none" />

                  {/* Frame Potret Foto Kuwu */}
                  <div className="relative mx-auto w-48 h-64 sm:w-52 sm:h-68 rounded-2xl overflow-hidden border-2 border-[#eda50c]/80 shadow-lg bg-slate-900">
                    <img
                      src="/kuwu.png"
                      alt="Foto Resmi Kuwu Desa Kadurama - Samir Syarifudin"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2 text-center">
                      <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-wider">
                        Kuwu Petahana
                      </span>
                    </div>
                  </div>

                  {/* Keterangan Jabatan & Nama Kuwu */}
                  <div className="mt-5 text-center space-y-1.5 relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eda50c] text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs">
                      <Award className="w-3.5 h-3.5" />
                      Periode 2019 – 2027
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight pt-1">
                      Samir Syarifudin
                    </h3>
                    <p className="text-xs text-emerald-200/90 font-medium">
                      Kepala Desa (Kuwu) Desa Kadurama
                    </p>
                  </div>

                  {/* Kutipan Refleksi Sejarah */}
                  <div className="mt-4 pt-4 border-t border-white/15 text-[11px] text-slate-300 italic text-center leading-relaxed">
                    &ldquo;Mengenali jejak masa lalu adalah pijakan untuk melayani masa kini dan membangun masa depan Kadurama yang aman, transparan, dan sejahtera.&rdquo;
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================== */}
          {/* SECTION 3: SILSILAH KUWU (HORIZONTAL TIMELINE KRONOLOGIS)           */}
          {/* =================================================================== */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#009388] flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#eda50c]" />
                  Garis Masa Estafet Kepemimpinan Desa
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                  Silsilah Kuwu Desa Kadurama (1805 – Sekarang)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Disusun kronologis dengan periode terbaru di awal. Geser ke kanan untuk menelusuri riwayat para pendahulu.
                </p>
              </div>

              {/* Navigation Scroll Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleScroll("left")}
                  aria-label="Geser Timeline ke Kiri"
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#009388] hover:text-white hover:border-[#009388] flex items-center justify-center transition shadow-2xs"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleScroll("right")}
                  aria-label="Geser Timeline ke Kanan"
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#009388] hover:text-white hover:border-[#009388] flex items-center justify-center transition shadow-2xs"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Horizontal Timeline Track */}
            <div className="relative">
              {/* Running Horizontal Track Bar */}
              <div
                ref={scrollRef}
                className="flex items-stretch gap-5 overflow-x-auto pb-6 pt-2 scroll-smooth no-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {reversedKuwuList.map((kuwu, idx) => {
                  const era = getEraBadge(kuwu.period);
                  const isCurrent = kuwu.isCurrent;

                  return (
                    <div
                      key={idx}
                      className={`w-[290px] sm:w-[320px] flex-shrink-0 rounded-2xl p-5 border transition-all flex flex-col justify-between relative ${
                        isCurrent
                          ? "bg-gradient-to-br from-[#003733] to-[#002825] text-white border-[#009388] shadow-lg ring-2 ring-[#009388]/40"
                          : "bg-white text-slate-900 border-slate-200 hover:border-[#009388]/50 hover:shadow-md"
                      }`}
                    >
                      {/* Top Meta Line: Era Badge & Sequence Number */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              isCurrent ? "bg-[#eda50c] text-slate-950 border-[#eda50c]" : era.color
                            }`}
                          >
                            {isCurrent ? "Menjabat (Aktif)" : era.label}
                          </span>
                          <span
                            className={`font-mono text-xs font-black px-2 py-0.5 rounded-md ${
                              isCurrent
                                ? "bg-white/10 text-emerald-300"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            #{kuwu.originalOrder}
                          </span>
                        </div>

                        {/* Masa Bakti / Periode */}
                        <div className="pt-1">
                          <div
                            className={`text-xs font-mono font-black uppercase tracking-wider ${
                              isCurrent ? "text-[#eda50c]" : "text-[#009388]"
                            }`}
                          >
                            Periode Masa Jabatan
                          </div>
                          <div className="text-xl font-black font-mono tracking-tight mt-0.5">
                            {kuwu.period}
                          </div>
                        </div>

                        {/* Nama Kuwu */}
                        <div className="pt-2 border-t border-slate-100/20">
                          <div
                            className={`text-[11px] font-medium ${
                              isCurrent ? "text-emerald-200/80" : "text-slate-400"
                            }`}
                          >
                            Kuwu Terpilih
                          </div>
                          <h4
                            className={`text-lg font-black uppercase tracking-tight leading-snug mt-0.5 ${
                              isCurrent ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {kuwu.name}
                          </h4>
                        </div>
                      </div>

                      {/* Bottom Footer Item Status */}
                      <div
                        className={`mt-6 pt-3 border-t text-[11px] font-medium flex items-center justify-between ${
                          isCurrent
                            ? "border-white/15 text-emerald-300"
                            : "border-slate-100 text-slate-400"
                        }`}
                      >
                        <span>{isCurrent ? "Kuwu Petahana ke-15" : `Pemimpin ke-${kuwu.originalOrder}`}</span>
                        {isCurrent ? (
                          <CheckCircle2 className="w-4 h-4 text-[#eda50c]" />
                        ) : (
                          <span className="font-mono text-[10px] text-slate-400">Arsip Desa</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =================================================================== */}
          {/* SECTION 4: VISI & 3 PILAR STRATEGIS 9 MISI (BUKAN CARD BIASA)       */}
          {/* =================================================================== */}
          <section className="space-y-10">
            {/* Header Naskah Dekrit Visi Kepala Desa */}
            <div className="bg-gradient-to-br from-[#003733] via-[#004d47] to-[#002522] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#009388]/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-[#009388]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 bg-[#eda50c]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-4xl space-y-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eda50c] text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm">
                    <Target className="w-4 h-4" />
                    Naskah Dekrit Visi Pembangunan Desa
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/10 text-emerald-200 text-xs font-mono border border-white/15">
                    Kepemimpinan Kuwu Kadurama
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-emerald-300 text-xs uppercase font-mono tracking-widest">
                    Visi Resmi Pembangunan Desa:
                  </div>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                    &ldquo;{VISI_MISI_DATA.visi}&rdquo;
                  </h2>
                </div>

                <div className="p-5 rounded-2xl bg-black/25 border border-white/15 backdrop-blur-xs text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  <strong className="text-white font-extrabold block mb-1">
                    Esensi & Makna Strategis Visi:
                  </strong>
                  {VISI_MISI_DATA.visiPenjelasan}
                </div>
              </div>
            </div>

            {/* 3 Pilar Strategis Terkoneksi (9 Butir Misi Berstruktur) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#009388] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#eda50c]" />
                    Struktur Rencana Kebijakan
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                    3 Pilar Strategis Menuju Kadurama Mandiri
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    9 butir misi operasional dikelompokkan secara terarah dalam tiga pilar pembangunan utama desa.
                  </p>
                </div>
                <div className="text-xs text-slate-500 font-mono bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  Total: <strong className="text-slate-900">9 Butir Misi (A – I)</strong>
                </div>
              </div>

              {/* Grid 3 Pilar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {pilarList.map((pilar, pIdx) => (
                  <div
                    key={pIdx}
                    className={`rounded-3xl border-2 p-6 sm:p-7 space-y-6 flex flex-col justify-between ${pilar.pilarTheme} bg-white shadow-xs`}
                  >
                    {/* Header Pilar */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${pilar.badgeColor}`}>
                          {pilar.pilarNumber}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          {pilar.items.length} Agenda Aksi
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 leading-snug">
                        {pilar.pilarTitle}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed border-b border-slate-200 pb-4">
                        {pilar.pilarDesc}
                      </p>

                      {/* Items / Butir Misi di dalam Pilar */}
                      <div className="space-y-4 pt-1">
                        {pilar.items.map((misi, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#009388] transition space-y-2 group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs group-hover:bg-[#009388] group-hover:text-white transition">
                                  {getMisiIcon(misi.code)}
                                </div>
                                <span className="font-extrabold text-slate-900 text-sm">
                                  {misi.title}
                                </span>
                              </div>
                              <span className="font-mono font-black text-xs text-[#009388] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Butir {misi.code}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed pl-1">
                              {misi.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Pilar Tag */}
                    <div className="pt-4 border-t border-slate-200 text-[11px] font-bold text-[#009388] flex items-center justify-between">
                      <span>Program Prioritas Desa</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =================================================================== */}
          {/* SECTION 5: GEOGRAFI, KEWILAYAHAN & AKSESIBILITAS                    */}
          {/* =================================================================== */}
          <section className="space-y-6 pt-4 border-t border-slate-200">
            <div className="border-b border-slate-200 pb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[#009388] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#eda50c]" />
                Monografi Teritorial
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                Letak Geografis & Batas Wilayah Desa Kadurama
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Kondisi biofisik, elevasi tanah, batas administratif, dan jarak aksesibilitas ke pusat kegiatan wilayah.
              </p>
            </div>

            {/* 4 Cards Indikator Geografis */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Kecamatan</div>
                <div className="text-lg font-black text-slate-900 mt-1">Ciawigebang</div>
                <div className="text-[11px] text-slate-500 mt-0.5">1 Km dari pusat kota kec.</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Topografi / Ketinggian</div>
                <div className="text-lg font-black text-slate-900 mt-1">550 mdpl</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Dataran rendah lereng Ciremai</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Curah Hujan</div>
                <div className="text-lg font-black text-slate-900 mt-1">2.124 Mm/Thn</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Iklim tropis subur pertanian</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Luas Total Wilayah</div>
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
                  Struktur Teritorial Wilayah
                </div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  Kawasan Terbagi Menjadi 3 Dusun, 3 RW, dan 8 RT
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {DESA_SEJARAH_DATA.geografi.pembagianWilayah.dusunList.map((dsn, idx) => (
                  <Link
                    key={idx}
                    href={`/dusun/${dsn.name.toLowerCase().replace("dusun ", "")}`}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:border-[#009388] hover:text-[#009388] transition shadow-2xs"
                  >
                    {dsn.name} &rarr;
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <CivicFooter />
    </div>
  );
}
