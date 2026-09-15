"use client";

import React, { useState } from "react";
import Link from "next/link";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import { AGENDA_LIST } from "@/data/newsData";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Filter,
  CheckCircle2,
} from "lucide-react";

export default function AgendaPage() {
  const [dusunFilter, setDusunFilter] = useState<string>("Semua");

  const filteredAgenda = AGENDA_LIST.filter(
    (item) => dusunFilter === "Semua" || item.dusun === dusunFilter
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
              <span className="text-white font-semibold">Agenda Kegiatan Desa</span>
            </div>

            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                <CalendarIcon className="w-3.5 h-3.5" />
                Kalender Musyawarah & Kegiatan Warga
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Agenda Pemerintah & Warga
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Jadwal rapat evaluasi APBDes bersama BPD, jadwal posyandu balita & posbindu lansia, kerja bakti lingkungan, serta pelatihan UMKM di 3 dusun.
              </p>
            </div>

            {/* Filter by Dusun */}
            <div className="mt-8 flex flex-wrap gap-2">
              {["Semua", "Dusun Manis", "Dusun Pahing", "Dusun Wage"].map((dsn) => (
                <button
                  key={dsn}
                  onClick={() => setDusunFilter(dsn)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    dusunFilter === dsn
                      ? "bg-[#eda50c] text-slate-950 shadow-md"
                      : "bg-white/10 text-emerald-100 hover:bg-white/20"
                  }`}
                >
                  {dsn}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAgenda.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#e6f7f5] text-[#003733] border border-[#009388]/30 text-xs font-bold">
                      {item.dusun}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-[#009388] transition leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2.5">
                      <CalendarIcon className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span className="font-semibold text-slate-800">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>Penyelenggara: <strong className="text-slate-800">{item.organizer}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Terbuka untuk warga terkait</span>
                  <button
                    onClick={() => alert(`Jadwal "${item.title}" ditambahkan ke pengingat.`)}
                    className="font-bold text-[#009388] hover:underline"
                  >
                    Simpan Pengingat &rarr;
                  </button>
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
