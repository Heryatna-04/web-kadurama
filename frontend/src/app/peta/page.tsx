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
  const [selectedPoiId, setSelectedPoiId] = useState<string | number | null>("balai-desa");

  const FACILITIES = [
    {
      id: "balai-desa",
      name: "Kantor Balai Desa Kadurama",
      dusun: "Manis",
      type: "Pemerintahan",
      coord: [-6.974814, 108.597824] as [number, number],
      address: "Jl. Raya Kadurama, Kec. Ciawigebang, Kab. Kuningan 45591",
      desc: "Pusat pelayanan administrasi publik warga, kantor Kuwu Samir Syarifudin, ruang kerja pamong desa, dan aula pertemuan warga.",
    },
    {
      id: "dusun-manis",
      name: "Wilayah Dusun III Manis",
      dusun: "Manis",
      type: "Administratif",
      coord: [-6.9765, 108.5975] as [number, number],
      address: "Wilayah Kerja RT 01 s.d. RT 03 / RW 01",
      desc: "Sentra pemerintahan dan pelayanan warga, menaungi Balai Desa, KUA, SDN Kadurama, 4 unit mushola, dan Posyandu. Kepala Dusun: Bpk. Jamaludin.",
    },
    {
      id: "dusun-pahing",
      name: "Wilayah Dusun I Pahing",
      dusun: "Pahing",
      type: "Administratif",
      coord: [-6.9785, 108.6025] as [number, number],
      address: "Wilayah Kerja RT 01 s.d. RT 03 / RW 01",
      desc: "Lumbung pangan pertanian sawah produktif seluas ± 27 Ha, fasilitas pendidikan dasar, mushola, dan Posyandu. Kepala Dusun: Bpk. Trida Sentosa.",
    },
    {
      id: "dusun-wage",
      name: "Wilayah Dusun II Wage",
      dusun: "Wage",
      type: "Administratif",
      coord: [-6.9825, 108.5955] as [number, number],
      address: "Wilayah Kerja RT 01 s.d. RT 02 / RW 01",
      desc: "Kawasan lereng sejuk kaki Ciremai seluas ± 23 Ha dengan sarana ibadah masjid jami, mushola, pesantren, PAUD, dan Posyandu. Kepala Dusun: Bpk. Andri Rukmana.",
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
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Peta Citra Wilayah Desa Kadurama
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Peta geospasial resmi Desa Kadurama berbasis citra satelit resolusi tinggi dan peta jalan resmi. Menampilkan titik pusat koordinat Kantor Balai Desa dan 3 dusun administratif.
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
                  showOuterBoundary={true}
                  showDusunBoundaries={false}
                  showWaterways={false}
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
