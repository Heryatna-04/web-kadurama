"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import {
  MapPin,
  Layers,
  ChevronRight,
  ShieldCheck,
  Building2,
  Activity,
  GraduationCap,
  Sparkles,
  Droplets,
  ExternalLink,
} from "lucide-react";

// Dynamic import for Leaflet GIS Map (SSR safe)
const CivicGisMap = dynamic(() => import("@/components/CivicGisMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[580px] bg-slate-900 rounded-3xl flex flex-col items-center justify-center text-emerald-400 gap-3">
      <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono tracking-wider">Memuat Citra Satelit & Poligon GIS...</span>
    </div>
  ),
});

export default function PetaPage() {
  const [selectedDusun, setSelectedDusun] = useState<"all" | "manis" | "pahing" | "wage">("all");
  const [selectedPoiId, setSelectedPoiId] = useState<number | null>(null);

  const FACILITIES = [
    {
      id: 1,
      name: "Kantor Balai Desa Kadurama & Pendopo",
      dusun: "Manis",
      type: "Pemerintahan",
      coord: [-6.9754, 108.5422] as [number, number],
      address: "Jl. Desa Kadurama No. 01, Dusun Manis RT 02 / RW 01",
      desc: "Pusat pelayanan administrasi warga, kantor Kuwu, ruang kerja BPD, dan aula musyawarah desa.",
    },
    {
      id: 2,
      name: "Puskesmas Pembantu (Pustu) Kadurama",
      dusun: "Manis",
      type: "Kesehatan",
      coord: [-6.9745, 108.541] as [number, number],
      address: "Jl. Balai Desa RT 03 Dusun Manis",
      desc: "Pelayanan kesehatan tingkat pertama, pos siaga medis 24 jam, dan konsultasi gizi balita.",
    },
    {
      id: 3,
      name: "SD Negeri 1 Kadurama",
      dusun: "Manis",
      type: "Pendidikan",
      coord: [-6.9762, 108.543] as [number, number],
      address: "Dusun Manis RT 04 / RW 02",
      desc: "Lembaga pendidikan dasar terakreditasi A dengan 12 ruang kelas dan lapangan upacara.",
    },
    {
      id: 4,
      name: "Gelora Olahraga Kadurama",
      dusun: "Pahing",
      type: "Olahraga",
      coord: [-6.972, 108.5465] as [number, number],
      address: "Dusun Pahing RT 03 / RW 02",
      desc: "Lapangan sepak bola rumput alami, lapangan bola voli, dan tribun serbaguna kegiatan pemuda.",
    },
    {
      id: 5,
      name: "Posyandu Melati I Dusun Pahing",
      dusun: "Pahing",
      type: "Kesehatan",
      coord: [-6.9712, 108.545] as [number, number],
      address: "Dusun Pahing RT 01 / RW 01",
      desc: "Sentra pemantauan gizi anak, imunisasi, dan penimbangan balita terintegrasi Dusun Pahing.",
    },
    {
      id: 6,
      name: "Mata Air Purba Cikaduran",
      dusun: "Wage",
      type: "Sumber Daya Air",
      coord: [-6.968, 108.539] as [number, number],
      address: "Dusun Wage RT 02 / RW 01",
      desc: "Sumber mata air alami pegunungan Ciremai dengan debit 45 liter/detik untuk konsumsi warga & irigasi.",
    },
    {
      id: 7,
      name: "Posyandu Melati II Dusun Wage",
      dusun: "Wage",
      type: "Kesehatan",
      coord: [-6.967, 108.5375] as [number, number],
      address: "Dusun Wage RT 04 / RW 02",
      desc: "Layanan posyandu keluarga lansia dan balita di elevasi 340 mdpl kawasan perbukitan.",
    },
  ];

  const filteredFacilities = FACILITIES.filter(
    (f) => selectedDusun === "all" || f.dusun.toLowerCase() === selectedDusun
  );

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
              <span className="text-white font-semibold">Peta Geospasial GIS</span>
            </div>

            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                Sistem Informasi Geografis (SIG) Desa
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Peta Satelit & Tata Ruang Desa
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Peta geospasial resmi Desa Kadurama berbasis citra satelit resolusi tinggi. Dilengkapi delineasi batas wilayah 3 dusun, zonasi sawah organik, jalur irigasi, dan titik fasilitas umum.
              </p>
            </div>

            {/* Filter Dusun Pills */}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-xs text-emerald-200 font-semibold mr-1">Fokus Wilayah:</span>
              {[
                { key: "all", label: "Seluruh Desa Kadurama" },
                { key: "pahing", label: "Dusun I Pahing" },
                { key: "wage", label: "Dusun II Wage" },
                { key: "manis", label: "Dusun III Manis" },
              ].map((pill) => (
                <button
                  key={pill.key}
                  onClick={() => setSelectedDusun(pill.key as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedDusun === pill.key
                      ? "bg-[#009388] text-white shadow-sm"
                      : "bg-white/10 text-emerald-100 hover:bg-white/20"
                  }`}
                >
                  <span>{pill.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Map & Facility Directory Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="space-y-8">
            {/* The GIS Map Container */}
            <div className="bg-white rounded-3xl border border-slate-200 p-3 sm:p-4 shadow-sm">
              <div className="w-full h-[500px] sm:h-[600px] rounded-2xl overflow-hidden border border-slate-200">
                <CivicGisMap
                  selectedDusun={selectedDusun}
                  selectedPoiId={selectedPoiId}
                  onSelectDusun={(d) => setSelectedDusun(d)}
                  onSelectPoi={(poi) => setSelectedPoiId(poi ? poi.id : null)}
                  showOuterBoundary={false}
                  showDusunBoundaries={false}
                  showWaterways={true}
                />
              </div>
            </div>

            {/* Directory of POIs */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Direktori Fasilitas Publik ({filteredFacilities.length} Titik)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Klik nama fasilitas untuk menyorot posisinya di peta satelit di atas.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredFacilities.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => {
                      setSelectedPoiId(f.id);
                      window.scrollTo({ top: 380, behavior: "smooth" });
                    }}
                    className={`bg-white rounded-2xl border p-5 transition cursor-pointer flex flex-col justify-between ${
                      selectedPoiId === f.id
                        ? "border-[#009388] ring-2 ring-[#009388]/30 shadow-md"
                        : "border-slate-200 hover:border-[#009388]/60 hover:shadow-xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#e6f7f5] text-[#003733]">
                          Dusun {f.dusun}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{f.type}</span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                        {f.name}
                      </h4>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {f.address}
                      </span>
                      <a
                        href={`https://maps.google.com/?q=${f.coord[0]},${f.coord[1]}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 font-bold text-[#009388] hover:underline"
                      >
                        <span>Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <CivicFooter />
    </div>
  );
}
