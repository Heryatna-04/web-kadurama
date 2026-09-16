"use client";

import React, { useState } from "react";
import Link from "next/link";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import { DAFTAR_LAYANAN_SURAT } from "@/data/layananData";
import {
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Download,
  HelpCircle,
  PhoneCall,
  Search,
} from "lucide-react";

export default function LayananKatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState<string>("Semua");

  const categories = ["Semua", "Kependudukan", "Kesejahteraan", "Usaha", "Pertanahan", "Umum"];

  const filteredServices = DAFTAR_LAYANAN_SURAT.filter((s) => {
    const matchesSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedKategori === "Semua" || s.kategori === selectedKategori;
    return matchesSearch && matchesCat;
  });

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
              <span className="text-white font-semibold">Layanan Mandiri Warga</span>
            </div>

            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                Standar Operasional Prosedur (SOP) Desa
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Layanan Administrasi & Surat Warga
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Panduan resmi persyaratan dokumen dan alur pengesahan berkas oleh Kepala Desa dan jajaran Pemerintah Desa Kadurama.
              </p>
            </div>

            {/* Informasi Lokasi Pelayanan Langsung */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-[#002825] border border-emerald-400/40 text-white font-bold text-xs shadow-md">
                <ShieldCheck className="w-4 h-4 text-[#eda50c]" />
                <span>Pengurusan Berkas Langsung di Loket Pelayanan Balai Desa</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-200">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Jam Pelayanan: Senin - Jumat (08.00 - 15.00 WIB)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {/* Search & Categories Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari surat (SKTM, SKU, Kematian, Lahir, Tanah, Domisili, Haji, Waris)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#009388]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedKategori(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedKategori === cat
                      ? "bg-[#003733] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards Grid - Compact 3-Column Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-emerald-300/80 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#e6f7f5] text-[#003733] border border-[#009388]/30">
                      {service.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {service.kategori}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#005851] transition-colors">
                    {service.nama}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal line-clamp-2">
                    {service.deskripsi}
                  </p>

                  {/* Requirements List */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Syarat Berkas:
                    </div>
                    <ul className="space-y-1">
                      {service.persyaratan.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-tight">
                          <CheckCircle2 className="w-3 h-3 text-[#009388] flex-shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Info Pengurusan di Balai Desa */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="text-[10px] text-slate-500">Lokasi: <strong className="text-slate-700 font-medium">Balai Desa</strong></span>
                  <span className="font-semibold text-[#009388] flex items-center gap-1 text-[11px]">
                    <span>Bawa Berkas Fisik</span>
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
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
