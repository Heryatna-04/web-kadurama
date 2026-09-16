"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useParams, notFound } from "next/navigation";
import { DUSUN_DETAILS } from "@/data/dusunData";
import { createClient } from "@/lib/supabase/client";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import {
  MapPin,
  Mountain,
  Users,
  Building2,
  Wheat,
  Droplets,
  Award,
  ShieldCheck,
  Phone,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Lock,
  Menu,
  X,
  Clock,
  Home as HomeIcon,
  CheckCircle2,
} from "lucide-react";

// Dynamic import for Leaflet GIS Map (SSR False)
const CivicGisMap = dynamic(() => import("@/components/CivicGisMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-8 h-8 border-2 border-[#009388] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono">Memuat Citra Satelit Dusun...</span>
    </div>
  ),
});

export default function DusunDetailPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "manis";
  const slug = (rawSlug === "puhun" ? "wage" : rawSlug.toLowerCase()) as "manis" | "pahing" | "wage";

  const dusun = DUSUN_DETAILS[slug];

  // If slug is not found
  if (!dusun) {
    notFound();
  }

  // Navbar local states (to match 2-tier header)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const dusunOrder: ("pahing" | "wage" | "manis")[] = ["pahing", "wage", "manis"];
  const currentIndex = dusunOrder.indexOf(slug);
  const prevSlug = dusunOrder[(currentIndex - 1 + dusunOrder.length) % dusunOrder.length];
  const nextSlug = dusunOrder[(currentIndex + 1) % dusunOrder.length];
  const prevDusun = DUSUN_DETAILS[prevSlug];
  const nextDusun = DUSUN_DETAILS[nextSlug];

  // Dynamic Resident & KK State with Supabase Sync
  const [liveStats, setLiveStats] = useState({
    residentCount: dusun.residentCount,
    kkCount: dusun.kkCount,
  });

  useEffect(() => {
    const fetchDusunLive = async () => {
      try {
        const supabase = createClient();
        const [{ count: rCount }, { count: kCount }] = await Promise.all([
          supabase.from("residents").select("*", { count: "exact", head: true }).ilike("dusun", `%${slug}%`),
          supabase.from("sensus_kk").select("*", { count: "exact", head: true }).ilike("dusun", `%${slug}%`),
        ]);
        if (rCount !== null && rCount > 0) {
          setLiveStats({
            residentCount: rCount,
            kkCount: kCount ?? dusun.kkCount,
          });
        }
      } catch (err) {
        console.warn("Gagal memuat live dusun counts:", err);
      }
    };
    fetchDusunLive();
  }, [slug, dusun.residentCount, dusun.kkCount]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      
      <CivicNavbar />

      {/* =================================================================== */}
      {/* HERO SECTION DUSUN SPESIFIK (PANORAMA DUSUN RESOLUSI TINGGI)         */}
      {/* =================================================================== */}
      <section className="relative min-h-[460px] sm:min-h-[520px] flex flex-col justify-between overflow-hidden bg-slate-950 text-white">
        <img
          src={dusun.photoUrl}
          alt={`Panorama ${dusun.name}`}
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.75] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#011715] via-[#011715]/60 to-black/30 z-0" />

        {/* Top Breadcrumb Header */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-emerald-200/90 font-medium">
              <Link href="/" className="hover:text-white transition">Beranda</Link>
              <span>/</span>
              <Link href="/#profil-dusun" className="hover:text-white transition">Profil 3 Dusun</Link>
              <span>/</span>
              <span className="text-white font-bold">{dusun.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-mono border border-white/20">
                KODE WILAYAH: 32.08.10.2002
              </span>
              <span className="px-3 py-1 rounded-full bg-[#eda50c] text-slate-950 text-xs font-bold uppercase tracking-wider">
                {dusun.number}
              </span>
              {liveStats.residentCount === 0 && (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                  Data Belum Lengkap
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Middle Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto py-8 w-full">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#009388]/80 backdrop-blur-xs text-white text-xs font-bold">
              <Mountain className="w-3.5 h-3.5 text-[#eda50c]" />
              <span>Elevasi {dusun.elevation} • {dusun.titleTag}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {dusun.name}
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
              {dusun.tagline}
            </p>
          </div>
        </div>

        {/* Bottom Horizon Statistics Bar Dusun */}
        <div className="relative z-10 w-full bg-[#002b27]/85 border-t border-white/15 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/15 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#009388]/30 border border-[#009388]/40 flex items-center justify-center text-white flex-shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">{liveStats.kkCount} KK</div>
                  <div className="text-[11px] font-sans text-slate-300">Kepala Keluarga</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4">
                <div className="w-10 h-10 rounded-xl bg-[#eda50c]/30 border border-[#eda50c]/40 flex items-center justify-center text-[#eda50c] flex-shrink-0">
                  <span className="font-bold text-sm">JIWA</span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#eda50c]">{liveStats.residentCount.toLocaleString("id-ID")}</div>
                  <div className="text-[11px] font-sans text-slate-300">Total Warga Terdata</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0">
                  <span className="font-bold text-sm">HA</span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-300">{dusun.areaHa}</div>
                  <div className="text-[11px] font-sans text-slate-300">{dusun.villageShare} Porsi Desa</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/30 border border-sky-400/40 flex items-center justify-center text-sky-300 flex-shrink-0">
                  <span className="font-bold text-sm">RT</span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">{dusun.rtRwInfo}</div>
                  <div className="text-[11px] font-sans text-slate-300">Rukun Tetangga & RW</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* BODY KONTEN DETAIL DUSUN (MONOGRAFI, KADUS, PETA GIS, POTENSI)      */}
      {/* =================================================================== */}
      <main className="flex-1 py-14 space-y-16">
        
        {/* SECTION 1: PROFIL WILAYAH & KEPALA DUSUN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Kolom Kiri (7 Cols): Narasi Karakteristik Wilayah */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Karakteristik & Profil Monografi {dusun.name}
                </h2>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {dusun.description}
                </p>
              </div>

              {/* Ringkasan Potensi Strategis */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Potensi Unggulan & Sumber Daya Dusun:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {dusun.potentials.map((pot, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#009388]">
                        {pot.category}
                      </div>
                      <div className="text-lg font-black text-slate-900 font-mono mt-1">
                        {pot.metric}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                        {pot.metricLabel}
                      </div>
                      <div className="font-bold text-xs text-slate-800 mt-2">
                        {pot.title}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {pot.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Kolom Kanan (5 Cols): Kartu Pejabat Kepala Dusun */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-[#009388] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                    Aparatur Pemdes
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                    Kepala Dusun Penanggung Jawab
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#eda50c]">{dusun.number}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-24 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0 shadow-sm">
                  <img
                    src={dusun.kadusPhotoUrl}
                    alt={dusun.kadusName}
                    className="w-full h-full object-cover contrast-110"
                  />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 uppercase">
                    Bpk. {dusun.kadusName}
                  </div>
                  <div className="text-xs font-semibold text-[#009388] mt-0.5">
                    Kepala {dusun.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Wilayah Kerja: {dusun.rtRwInfo}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status Koordinasi:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Aktif Siaga</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Kontak Pelayanan (WhatsApp):</span>
                  <a
                    href={`https://wa.me/${dusun.kadusPhone.replace(/^0/, "62")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono font-bold text-[#009388] hover:underline"
                  >
                    {dusun.kadusPhone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Titik Koordinat Pusat:</span>
                  <span className="font-mono text-slate-700">{dusun.coordinates}</span>
                </div>
              </div>

              <div className="pt-3">
                <a
                  href={`https://wa.me/${dusun.kadusPhone.replace(/^0/, "62")}?text=Halo%20Kepala%20${encodeURIComponent(dusun.name)},%20saya%20warga%20Kadurama`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Hubungi Kadus via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: PETA GEOSPASIAL SATELIT & DAFTAR FASILITAS DUSUN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Peta Batas Geospasial & Fasilitas {dusun.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Citra satelit resolusi tinggi yang menampilkan batas poligon resmi dan sebaran titik layanan publik di {dusun.name}.
                </p>
              </div>

              <a
                href={`https://maps.google.com/?q=${dusun.coordinates}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex-shrink-0 shadow-xs"
              >
                <span>Buka Rute di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

            {/* Map Frame (Leaflet Satelit Focused on this Dusun) */}
            <div className="w-full h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border border-slate-200 relative">
              <CivicGisMap
                selectedDusun={slug}
                selectedPoiId={null}
                showOuterBoundary={false}
                showDusunBoundaries={false}
                showWaterways={true}
                onSelectDusun={() => {}}
                onSelectPoi={() => {}}
              />
            </div>

            {/* Daftar Fasilitas Publik di Dusun Ini */}
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Titik Pelayanan & Fasilitas Publik di {dusun.name}:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {dusun.facilities.map((fac, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#009388] uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                          {fac.category}
                        </span>
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm mt-2">
                        {fac.name}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {fac.address}
                      </p>
                    </div>

                    <a
                      href={`https://maps.google.com/?q=${fac.coords}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#009388] hover:text-[#005851] transition"
                    >
                      <span>Navigasi Presisi</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: SWITCHER ANTAR DUSUN (NAVIGASI SEAMLESS) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#eda50c]">
                Jelajahi Wilayah Lainnya
              </div>
              <h3 className="text-xl font-extrabold text-white mt-1">
                Eksplorasi Dusun Tetangga di Desa Kadurama
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Pilih dusun lain untuk melihat karakteristik komplementer dan persebaran potensinya.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href={`/dusun/${prevSlug}`}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{prevDusun.name}</span>
              </Link>
              <Link
                href={`/dusun/${nextSlug}`}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{nextDusun.name}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <CivicFooter />
    </div>
  );
}
