"use client";

import React from "react";
import Link from "next/link";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import { PAMONG_LIST } from "@/data/pamongData";
import {
  Building2,
  Users,
  ChevronRight,
  ShieldCheck,
  Award,
  Layers,
  MapPin,
  FileText,
} from "lucide-react";

export default function PemerintahanPage() {
  const kuwu = PAMONG_LIST.find((p) => p.role.includes("Kuwu")) || PAMONG_LIST[0];
  const bpdList = PAMONG_LIST.filter((p) => p.category === "BPD");
  const sekretariatList = PAMONG_LIST.filter((p) => p.category === "Sekretariat" && !p.role.includes("Kuwu"));
  const teknisList = PAMONG_LIST.filter((p) => p.category === "Pelaksana Teknis");
  const kewilayahanList = PAMONG_LIST.filter((p) => p.category === "Kewilayahan");

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
                Struktur Pemerintahan Desa Kadurama
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Bagan struktural dan hierarki penyelenggaraan pemerintahan Desa Kadurama periode 2021–2027 berdasarkan Peraturan Daerah Kabupaten Kuningan dan Undang-Undang Desa.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section: Hierarki Struktural Lengkap */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
          {/* TINGKAT 1: KEPALA DESA (KUWU) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#eda50c] text-slate-950 font-bold flex items-center justify-center text-xs">
                I
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                  Pimpinan Pemerintah Desa (Kuwu)
                </h2>
                <p className="text-xs text-slate-500">Penanggung jawab utama penyelenggaraan pemerintahan, pembangunan, dan kemasyarakatan</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#003733] via-[#005851] to-[#009388] text-white rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
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
                    Kepala Pemerintahan Desa Kadurama
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 uppercase">
                    {kuwu.name}
                  </h3>
                  {kuwu.nip && (
                    <p className="text-xs font-mono text-emerald-200 mt-0.5">NIP. {kuwu.nip}</p>
                  )}
                </div>

                <blockquote className="text-sm sm:text-base text-emerald-100 italic border-l-2 border-[#eda50c] pl-4 py-1 leading-relaxed">
                  "{kuwu.bio}"
                </blockquote>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/15 text-xs text-emerald-100">
                  <div>
                    <span className="text-emerald-300 block text-[11px]">Kedudukan</span>
                    <span className="font-semibold text-white">Pemegang Kuasa Pengelolaan APBDes</span>
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
          </div>

          {/* TINGKAT 2: BADAN PERMUSYAWARATAN DESA (BPD) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#009388] text-white font-bold flex items-center justify-center text-xs">
                II
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                  Badan Permusyawaratan Desa (BPD)
                </h2>
                <p className="text-xs text-slate-500">Lembaga legislasi desa, penampung aspirasi masyarakat, dan pengawas kinerja Kuwu</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bpdList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-[#009388] transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                        {item.role}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-[#009388]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{item.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.bio}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                    Fungsi: Pengawasan & Regulasi Perdes
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TINGKAT 3: SEKRETARIAT DESA */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#003733] text-white font-bold flex items-center justify-center text-xs">
                III
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                  Sekretariat Desa (Staf Penyelenggara & Administrasi)
                </h2>
                <p className="text-xs text-slate-500">Unsur staf pembantu Kepala Desa yang dipimpin oleh Sekretaris Desa</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sekretariatList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#009388] transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-56 bg-slate-800 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-[#003733] px-2.5 py-0.5 rounded">
                          Sekretariat
                        </span>
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-sm uppercase leading-snug">{item.name}</h4>
                      <div className="text-xs font-semibold text-[#009388]">{item.role}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.bio}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                      Kantor Balai Desa Kadurama
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TINGKAT 4: PELAKSANA TEKNIS & URUSAN */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-700 text-white font-bold flex items-center justify-center text-xs">
                IV
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                  Pelaksana Teknis (Kepala Seksi)
                </h2>
                <p className="text-xs text-slate-500">Unsur pembantu Kepala Desa sebagai pelaksana tugas operasional per bidang</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teknisList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#009388] transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-56 bg-slate-800 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-cyan-700 px-2.5 py-0.5 rounded">
                          Seksi Operasional
                        </span>
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-sm uppercase leading-snug">{item.name}</h4>
                      <div className="text-xs font-semibold text-[#009388]">{item.role}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.bio}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                      Pelayanan Publik Balai Desa
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TINGKAT 5: PELAKSANA KEWILAYAHAN (KEPALA DUSUN) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                V
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                  Pelaksana Kewilayahan (Kepala Dusun)
                </h2>
                <p className="text-xs text-slate-500">Unsur pembantu Kuwu di wilayah kerja 3 dusun: Dusun Manis, Dusun Pahing, dan Dusun Wage</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kewilayahanList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#009388] transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-60 bg-slate-800 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-emerald-600 px-2.5 py-0.5 rounded shadow-xs">
                          {item.role}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-base uppercase leading-snug">{item.name}</h4>
                      <div className="text-xs font-semibold text-[#009388]">{item.workArea}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.bio}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      {item.dusun && (
                        <Link
                          href={`/dusun/${item.dusun.toLowerCase()}`}
                          className="font-bold text-[#009388] hover:underline"
                        >
                          Halaman Dusun {item.dusun} &rarr;
                        </Link>
                      )}
                    </div>
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
