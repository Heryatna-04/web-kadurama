"use client";

import React, { useState } from "react";
import Link from "next/link";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import { PAMONG_LIST } from "@/data/pamongData";
import {
  Building2,
  Users,
  Award,
  ChevronRight,
  ShieldCheck,
  Mail,
  MapPin,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

export default function PemerintahanPage() {
  const [activeTab, setActiveTab] = useState<string>("Semua");

  const categories = ["Semua", "Pimpinan", "Sekretariat", "Kewilayahan", "Pelaksana Teknis", "BPD"];

  const filteredPamong = PAMONG_LIST.filter(
    (p) => activeTab === "Semua" || p.category === activeTab
  );

  const kuwu = PAMONG_LIST.find((p) => p.role.includes("Kuwu"));

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
              <span className="text-white font-semibold">Pemerintahan & Pamong Desa</span>
            </div>

            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                Struktur Organisasi & Tata Kerja (SOTK)
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Pamong & Perangkat Desa
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Jajaran aparatur Pemerintah Desa Kadurama yang berintegritas dan siap melayani 1.768 jiwa warga di Dusun Manis, Dusun Pahing, dan Dusun Wage.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === cat
                      ? "bg-[#eda50c] text-slate-950 shadow-md"
                      : "bg-white/10 text-emerald-100 hover:bg-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {/* Spotlight Kepala Desa */}
          {kuwu && activeTab === "Semua" && (
            <div className="mb-12 bg-gradient-to-r from-[#003733] via-[#005851] to-[#009388] text-white rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border-2 border-[#eda50c]/60 shadow-2xl group bg-slate-800">
                  <img
                    src={kuwu.imageUrl}
                    alt={kuwu.name}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#eda50c] text-slate-950 uppercase tracking-wider">
                      Kepala Desa (Kuwu)
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div>
                  <div className="text-[#eda50c] text-xs font-bold uppercase tracking-wider">
                    Pimpinan Pemerintah Desa Kadurama
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 uppercase">
                    {kuwu.name}
                  </h2>
                  {kuwu.nip && (
                    <p className="text-xs font-mono text-emerald-200 mt-0.5">NIP. {kuwu.nip}</p>
                  )}
                </div>

                <blockquote className="text-sm sm:text-base text-emerald-100 italic border-l-2 border-[#eda50c] pl-4 py-1 leading-relaxed">
                  "{kuwu.bio}"
                </blockquote>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/15 text-xs text-emerald-100">
                  <div>
                    <span className="text-emerald-300 block text-[11px]">Tupoksi Pokok</span>
                    <span className="font-semibold text-white">Penyelenggaraan Pemdes</span>
                  </div>
                  <div>
                    <span className="text-emerald-300 block text-[11px]">Ruang Kerja</span>
                    <span className="font-semibold text-white">Balai Desa Kadurama</span>
                  </div>
                  <div>
                    <span className="text-emerald-300 block text-[11px]">Wilayah Koordinasi</span>
                    <span className="font-semibold text-[#eda50c]">3 Dusun & 21 RT</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid Pamong Lainnya */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPamong
              .filter((p) => activeTab !== "Semua" || p.id !== "PAMONG-001")
              .map((pamong) => (
                <div
                  key={pamong.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#009388] transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-64 bg-slate-800 overflow-hidden">
                      <img
                        src={pamong.imageUrl}
                        alt={pamong.name}
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-[#009388] px-2.5 py-0.5 rounded shadow-xs">
                          {pamong.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="font-extrabold text-slate-900 text-base uppercase leading-snug">
                        {pamong.name}
                      </h3>
                      <div className="text-xs font-semibold text-[#009388]">
                        {pamong.role}
                      </div>
                      {pamong.workArea && (
                        <div className="text-[11px] font-mono text-slate-500">
                          {pamong.workArea}
                        </div>
                      )}
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {pamong.bio}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      {pamong.dusun ? (
                        <Link
                          href={`/dusun/${pamong.dusun.toLowerCase()}`}
                          className="font-bold text-[#009388] hover:underline"
                        >
                          Halaman Dusun &rarr;
                        </Link>
                      ) : (
                        <span className="text-[11px]">Balai Desa Kadurama</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>

      <CivicFooter />
    </div>
  );
}
