"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ShieldCheck, Heart } from "lucide-react";

export default function CivicFooter() {
  return (
    <footer className="no-print bg-[#011715] text-white pt-16 pb-12 border-t border-[#005851]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Kolom 1: Profil Desa */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center bg-white/10 rounded-xl p-1 border border-white/20">
                <Image
                  src="/logo-kuningan.png"
                  alt="Logo Kabupaten Kuningan"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-extrabold text-base tracking-tight text-white uppercase">
                  DESA KADURAMA
                </div>
                <div className="text-[11px] text-emerald-300 font-mono">
                  Kode Desa: 32.08.15.2001
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Portal Geospasial dan Administrasi Resmi Pemerintah Desa Kadurama, Kecamatan Ciawigebang, Kabupaten Kuningan, Jawa Barat 45591.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-[#eda50c]" />
              <span>Keterbukaan Informasi Publik (UU KIP No. 14/2008)</span>
            </div>
          </div>

          {/* Kolom 2: Navigasi Wilayah */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Wilayah Dusun
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/dusun/pahing" className="hover:text-emerald-300 transition flex items-center justify-between">
                  <span>Dusun I • Pahing</span>
                  <span className="text-[10px] text-slate-400">Olahraga & Padi</span>
                </Link>
              </li>
              <li>
                <Link href="/dusun/wage" className="hover:text-emerald-300 transition flex items-center justify-between">
                  <span>Dusun II • Wage</span>
                  <span className="text-[10px] text-slate-400">Religi & Air</span>
                </Link>
              </li>
              <li>
                <Link href="/dusun/manis" className="hover:text-emerald-300 transition flex items-center justify-between">
                  <span>Dusun III • Manis</span>
                  <span className="text-[10px] text-slate-400">KUA & Pendidikan</span>
                </Link>
              </li>
              <li className="pt-2 border-t border-white/10">
                <Link href="/peta" className="text-[#eda50c] font-bold hover:underline">
                  Buka Peta Satelit GIS Desa &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Layanan Publik & Dokumen */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Layanan & Transparansi
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/layanan" className="hover:text-emerald-300 transition">
                  Informasi Persyaratan Dokumen Surat
                </Link>
              </li>
              <li>
                <Link href="/layanan" className="hover:text-emerald-300 transition">
                  Standar Pelayanan (SOP) Balai Desa
                </Link>
              </li>
              <li>
                <Link href="/transparansi/apbdes" className="hover:text-emerald-300 transition">
                  Transparansi APBDes 2026
                </Link>
              </li>
              <li>
                <Link href="/profil/sejarah-visi-misi" className="hover:text-emerald-300 transition">
                  Sejarah, Visi & Misi Desa
                </Link>
              </li>
              <li>
                <Link href="/profil/pemerintahan" className="hover:text-emerald-300 transition">
                  Struktur Pamong & Perangkat Desa
                </Link>
              </li>
              <li>
                <Link href="/pengumuman" className="hover:text-emerald-300 transition">
                  Pengumuman Resmi & Edaran
                </Link>
              </li>
              <li className="pt-2 border-t border-white/10">
                <Link href="/master" className="text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1.5">
                  <span>Panel Master Data Desa</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white">Internal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Balai Desa & Kontak */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Kontak Balai Desa
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#009388] flex-shrink-0 mt-0.5" />
                <span>Jl. Raya Kadurama No. 01, Dusun Manis, Ciawigebang, Kuningan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#009388] flex-shrink-0" />
                <span>+62 821-2345-6789 (WhatsApp)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#009388] flex-shrink-0" />
                <span>pemdes@kadurama.desa.id</span>
              </div>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-lg bg-white/10 text-[11px] text-emerald-200 border border-white/10">
                  Pelayanan: Senin - Jumat (08.00 - 15.00 WIB)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Baris Bawah */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Pemerintah Desa Kadurama. Seluruh hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Portal Resmi Pemerintahan Desa</span>
            <span>•</span>
            <span>Kabupaten Kuningan Asri</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
