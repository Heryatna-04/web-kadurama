"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FileText,
  Clock,
  MapPin,
  Phone,
  Mail,
  Search,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Download,
} from "lucide-react";

// Mock Resident Data for Loket Generator
interface Resident {
  nik: string;
  nama: string;
  ttl: string;
  pekerjaan: string;
  alamat: string;
  status: string;
}

const RESIDENTS_DATA: Record<string, Resident> = {
  "3208152405900001": {
    nik: "3208152405900001",
    nama: "Asep Saepuloh",
    ttl: "Kuningan, 24 Mei 1990",
    pekerjaan: "Wiraswasta",
    alamat: "Dusun Manis RT 02 / RW 01, Desa Kadurama",
    status: "Warga Tetap",
  },
  "3208156108950002": {
    nik: "3208156108950002",
    nama: "Siti Aminah",
    ttl: "Kuningan, 18 Agustus 1995",
    pekerjaan: "Mengurus Rumah Tangga",
    alamat: "Dusun Pahing RT 05 / RW 02, Desa Kadurama",
    status: "Warga Tetap",
  },
  "3208151201880003": {
    nik: "3208151201880003",
    nama: "Udi Hermanto",
    ttl: "Kuningan, 12 Januari 1988",
    pekerjaan: "Petani / Pekebun",
    alamat: "Dusun Kliwon RT 09 / RW 04, Desa Kadurama",
    status: "Warga Tetap",
  },
};

export default function Home() {
  const [view, setView] = useState<"public" | "admin">("public");
  const [searchQuery, setSearchQuery] = useState("3208152405900001");
  const [selectedResident, setSelectedResident] = useState<Resident>(
    RESIDENTS_DATA["3208152405900001"]
  );
  const [letterType, setLetterType] = useState<"SKU" | "SKTM" | "SKCK" | "DOMISILI">("SKU");
  const [businessName, setBusinessName] = useState("Warung Sembako & Barokah Snack");
  const [businessField, setBusinessField] = useState("Perdagangan Kebutuhan Pokok dan Makanan Ringan");
  const [businessLocation, setBusinessLocation] = useState("Dusun Manis RT 02 / RW 01, Desa Kadurama");
  const [letterPurpose, setLetterPurpose] = useState("Kelengkapan Administrasi Permohonan Kredit Usaha Rakyat (KUR) BRI");
  const [selectedOfficial, setSelectedOfficial] = useState<"kades" | "sekdes">("kades");
  const [apbdesFilter, setApbdesFilter] = useState<"all" | "pendapatan" | "belanja">("all");

  const handleSearchResident = (val: string) => {
    setSearchQuery(val);
    const trimmed = val.trim();
    if (RESIDENTS_DATA[trimmed]) {
      setSelectedResident(RESIDENTS_DATA[trimmed]);
      return;
    }
    const found = Object.values(RESIDENTS_DATA).find((r) =>
      r.nama.toLowerCase().includes(trimmed.toLowerCase())
    );
    if (found) {
      setSelectedResident(found);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* =================================================================== */}
      {/* SINGLE UNIFIED NAVBAR (Tidak Bertumpuk - Brand Kuningan) */}
      {/* =================================================================== */}
      <header className="no-print sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Kuningan & Desa Kadurama */}
          <a href="#beranda" className="flex items-center gap-3 group">
            <div className="h-12 w-12 relative flex items-center justify-center">
              <Image
                src="/kuningan-logo.png"
                alt="Logo Kuningan"
                width={48}
                height={48}
                className="object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="border-l border-slate-300 pl-3">
              <div className="font-extrabold text-slate-900 text-sm tracking-wide leading-tight uppercase group-hover:text-[#009388] transition-colors">
                Desa Kadurama
              </div>
              <div className="text-[11px] text-[#009388] font-semibold">
                Kec. Ciawigebang, Kab. Kuningan
              </div>
            </div>
          </a>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <button
              onClick={() => {
                setView("public");
                window.location.hash = "#beranda";
              }}
              className="text-[#009388] hover:text-[#007b71] transition"
            >
              Beranda
            </button>
            <a href="#layanan-surat" className="hover:text-[#009388] transition">
              Syarat Surat
            </a>
            <a href="#statistik" className="hover:text-[#009388] transition">
              Statistik Warga
            </a>
            <a href="#perangkat-desa" className="hover:text-[#009388] transition">
              Aparatur Desa
            </a>
            <a href="#apbdes" className="hover:text-[#009388] transition">
              APBDes 2026
            </a>
            <a href="#berita" className="hover:text-[#009388] transition">
              Kabar Desa
            </a>
            <a href="#lokasi-kantor" className="hover:text-[#009388] transition">
              Lokasi & Jam Buka
            </a>
          </nav>

          {/* Akses Petugas Loket Button */}
          <div className="flex items-center gap-3">
            {view === "public" ? (
              <button
                onClick={() => setView("admin")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white text-xs font-bold shadow-md shadow-[#009388]/20 transition-all hover:-translate-y-0.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Akses Petugas Loket</span>
              </button>
            ) : (
              <button
                onClick={() => setView("public")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-sm transition"
              >
                <span>Lihat Laman Publik</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* VIEW 1: PORTAL PUBLIK DESA KADURAMA */}
      {/* =================================================================== */}
      {view === "public" ? (
        <main className="flex-1">
          {/* HERO SECTION */}
          <section
            id="beranda"
            className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center bg-gradient-to-br from-[#003733] via-[#005851] to-[#009388] text-white py-16 sm:py-24 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute -right-20 -bottom-20 w-[500px] h-[500px] bg-[#eda50c]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Kolom Teks Hero (Khusus Warga) */}
                <div className="lg:col-span-8">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#eda50c] text-xs font-bold tracking-wide uppercase mb-6">
                    <span className="w-2 h-2 rounded-full bg-[#eda50c]" />
                    <span>Portal Resmi Informasi & Panduan Layanan Warga</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6 text-white">
                    Pemerintahan Terbuka & Pelayanan Tertib Desa Kadurama
                  </h1>

                  <p className="text-base sm:text-lg text-emerald-50/90 leading-relaxed mb-8 max-w-2xl font-normal">
                    Informasi terpadu seputar kelengkapan dokumen surat administrasi, akuntabilitas anggaran APBDes, serta kabar kegiatan pembangunan di wilayah Desa Kadurama.
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href="#layanan-surat"
                      className="px-6 py-3.5 rounded-xl bg-[#eda50c] hover:bg-[#d99407] text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-950/20 transition-transform hover:scale-105"
                    >
                      Cek Persyaratan Berkas Surat
                    </a>
                    <a
                      href="#lokasi-kantor"
                      className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs sm:text-sm backdrop-blur-sm transition"
                    >
                      Jadwal & Lokasi Kantor Desa
                    </a>
                  </div>
                </div>

                {/* Highlight Kuningan & Info Pelayanan */}
                <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 text-white">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/15">
                    <div className="w-10 h-10 rounded-xl bg-[#eda50c] text-slate-950 flex items-center justify-center font-extrabold text-sm">
                      KD
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#eda50c]">Pemerintah Desa</div>
                      <div className="text-sm font-extrabold">Kadurama, Ciawigebang</div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3.5 text-xs text-emerald-50">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#eda50c] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white">Layanan Langsung di Loket Kantor</div>
                        <div className="text-[11px] text-emerald-100/80 mt-0.5">
                          Warga datang langsung membawa syarat berkas asli dan fotokopi ke kantor desa.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#eda50c] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white">Jam Buka Loket Kantor</div>
                        <div className="text-[11px] text-emerald-100/80 mt-0.5">
                          Senin - Jumat pukul 07.30 - 15.00 WIB (Sabtu dan Minggu libur).
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#eda50c] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white">Semboyan Kuningan</div>
                        <div className="text-[11px] text-[#eda50c] italic mt-0.5">
                          &quot;Melesat Ngudag Jaman, Ngakar Kuat Purwadaksi&quot;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 1: PANDUAN SYARAT DOKUMEN SURAT */}
          {/* =============================================================== */}
          <section id="layanan-surat" className="py-20 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3 py-1 rounded-full border border-[#009388]/20">
                  Pelayanan Administrasi Loket
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                  Panduan Syarat Berkas Surat Desa
                </h2>
                <p className="text-sm text-slate-600 mt-2">
                  Surat dibuat dan dicetak langsung oleh petugas di kantor desa. Pastikan Anda telah melengkapi berkas persyaratan berikut sebelum hadir di loket:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* SKU */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 hover:border-[#009388] hover:bg-white hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center mb-4">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Ket. Usaha (SKU)</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Untuk pinjaman perbankan KUR atau izin operasional usaha mikro.
                  </p>
                  <div className="text-xs font-semibold text-slate-700 mb-2">Berkas Wajib:</div>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li className="flex items-center gap-2"><span className="text-[#009388] font-bold">•</span> KTP & KK Asli / Fotokopi</li>
                    <li className="flex items-center gap-2"><span className="text-[#009388] font-bold">•</span> Pengantar Ketua RT / RW</li>
                    <li className="flex items-center gap-2"><span className="text-[#009388] font-bold">•</span> Keterangan alamat lokasi usaha</li>
                  </ul>
                </div>

                {/* SKTM */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 hover:border-[#009388] hover:bg-white hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center mb-4">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Ket. Tidak Mampu (SKTM)</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Untuk keringanan biaya sekolah, beasiswa KIP, atau RSUD.
                  </p>
                  <div className="text-xs font-semibold text-slate-700 mb-2">Berkas Wajib:</div>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li className="flex items-center gap-2"><span className="text-[#009388] font-bold">•</span> Fotokopi KTP & Kartu Keluarga</li>
                    <li className="flex items-center gap-2"><span className="text-[#009388] font-bold">•</span> Surat Pengantar RT / RW</li>
                    <li className="flex items-center gap-2"><span className="text-[#009388] font-bold">•</span> Surat tujuan instansi/sekolah</li>
                  </ul>
                </div>

                {/* SKCK */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 hover:border-[#009388] hover:bg-white hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Pengantar SKCK Polsek</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Pengantar desa untuk penerbitan SKCK di Polsek Ciawigebang.
                  </p>
                  <div className="text-xs font-semibold text-slate-700 mb-2">Berkas Wajib:</div>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li className="flex items-center gap-2"><span className="text-[#009388] font-bold">•</span> Fotokopi KTP & KK pemohon</li>
                    <li className="flex items-center gap-2"><span className="text-[#009388] font-bold">•</span> Surat Pengantar RT / RW</li>
                    <li className="flex items-center gap-2"><span className="text-[#009388] font-bold">•</span> Pasfoto 4x6 latar merah (2 lbr)</li>
                  </ul>
                </div>

                {/* Domisili */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 hover:border-[#009388] hover:bg-white hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center mb-4">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Keterangan Domisili</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Keterangan sah tempat tinggal menetap warga di Desa Kadurama.
                  </p>
                  <div className="text-xs font-semibold text-slate-700 mb-2">Berkas Wajib:</div>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li className="flex items-center gap-2"><span className="text-[#009388] font-bold">•</span> Fotokopi KTP dan Kartu Keluarga</li>
                    <li className="flex items-center gap-2"><span className="text-[#009388] font-bold">•</span> Keterangan domisili RT / RW</li>
                    <li className="flex items-center gap-2"><span className="text-[#009388] font-bold">•</span> Surat pindah bagi warga baru</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 2: DATA & STATISTIK KEPENDUDUKAN (SECTION TERSENDIRI) */}
          {/* =============================================================== */}
          <section id="statistik" className="py-20 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3 py-1 rounded-full border border-[#009388]/20">
                    Statistik Kependudukan
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                    Profil Demografi & Data Warga Desa
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 max-w-xl">
                    Data agregat kependudukan Desa Kadurama yang diperbarui secara berkala berdasarkan pencatatan administrasi desa.
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
                  Total Warga: <span className="text-[#009388] font-bold">3.428 Jiwa</span> • <span className="text-[#eda50c] font-bold">1.042 KK</span>
                </div>
              </div>

              {/* Bento Grid Statistik Lengkap */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* 5 Dusun Tradisional Kuningan */}
                <div className="md:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span>Distribusi Penduduk Per Dusun</span>
                    <span className="text-xs font-normal text-slate-500">5 Wilayah Dusun</span>
                  </h3>
                  <div className="mt-5 space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold text-slate-800 mb-1">
                        <span>Dusun Manis (RT 01 - RT 03)</span>
                        <span className="font-bold text-[#009388]">820 Jiwa (23.9%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#009388] h-2.5 rounded-full" style={{ width: "23.9%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-slate-800 mb-1">
                        <span>Dusun Pahing (RT 04 - RT 06)</span>
                        <span className="font-bold text-[#009388]">765 Jiwa (22.3%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#009388] h-2.5 rounded-full" style={{ width: "22.3%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-slate-800 mb-1">
                        <span>Dusun Puhun (RT 07 - RT 09)</span>
                        <span className="font-bold text-[#009388]">698 Jiwa (20.4%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#009388] h-2.5 rounded-full" style={{ width: "20.4%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-slate-800 mb-1">
                        <span>Dusun Wage (RT 10 - RT 11)</span>
                        <span className="font-bold text-[#009388]">615 Jiwa (17.9%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#009388] h-2.5 rounded-full" style={{ width: "17.9%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-slate-800 mb-1">
                        <span>Dusun Kliwon (RT 12)</span>
                        <span className="font-bold text-[#009388]">530 Jiwa (15.5%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#009388] h-2.5 rounded-full" style={{ width: "15.5%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Komposisi Gender */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100">
                      Komposisi Jenis Kelamin
                    </h3>
                    <div className="mt-6 space-y-4">
                      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                        <div className="text-xs text-blue-700 font-semibold">Laki-Laki</div>
                        <div className="text-2xl font-black text-slate-900 mt-1">1.740 Jiwa</div>
                        <div className="text-[11px] text-blue-600 mt-0.5 font-medium">50.8% dari total penduduk</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
                        <div className="text-xs text-rose-700 font-semibold">Perempuan</div>
                        <div className="text-2xl font-black text-slate-900 mt-1">1.688 Jiwa</div>
                        <div className="text-[11px] text-rose-600 mt-0.5 font-medium">49.2% dari total penduduk</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100 text-center">
                    Rasio: 103 Laki-laki per 100 Perempuan
                  </div>
                </div>

                {/* Kelompok Usia */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100">
                      Kelompok Usia Penduduk
                    </h3>
                    <div className="mt-4 space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between font-medium text-slate-700 mb-1">
                          <span>0 - 14 Th (Anak/Balita)</span>
                          <span className="font-bold text-slate-900">712 Jiwa</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full">
                          <div className="bg-[#eda50c] h-2 rounded-full" style={{ width: "21%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-medium text-slate-700 mb-1">
                          <span>15 - 64 Th (Produktif)</span>
                          <span className="font-bold text-[#009388]">2.348 Jiwa</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full">
                          <div className="bg-[#009388] h-2 rounded-full" style={{ width: "68%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-medium text-slate-700 mb-1">
                          <span>65+ Th (Lansia)</span>
                          <span className="font-bold text-slate-900">368 Jiwa</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full">
                          <div className="bg-slate-400 h-2 rounded-full" style={{ width: "11%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-[#e6f7f5] text-[#005851] text-[11px] font-medium text-center">
                    68.5% penduduk berada pada usia produktif.
                  </div>
                </div>

                {/* Mata Pencaharian */}
                <div className="md:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span>Mata Pencaharian Utama Warga</span>
                    <span className="text-xs font-normal text-slate-500">Sektor Ekonomi</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 text-[11px]">Petani / Pekebun</div>
                      <div className="text-base font-bold text-slate-900 mt-1">42%</div>
                      <div className="text-[10px] text-[#009388] font-semibold mt-0.5">Sektor Dominan</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 text-[11px]">Wiraswasta / Dagang</div>
                      <div className="text-base font-bold text-slate-900 mt-1">24%</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">UMKM & Kelontong</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 text-[11px]">Buruh Harian Lepas</div>
                      <div className="text-base font-bold text-slate-900 mt-1">16%</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">Konstruksi & Jasa</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 text-[11px]">Karyawan Swasta</div>
                      <div className="text-base font-bold text-slate-900 mt-1">11%</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">Pabrik & Kantor</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 text-[11px]">PNS / TNI / Polri / Guru</div>
                      <div className="text-base font-bold text-slate-900 mt-1">4%</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">Aparatur Negara</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 text-[11px]">Lainnya</div>
                      <div className="text-base font-bold text-slate-900 mt-1">3%</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">Pensiunan & Jasa</div>
                    </div>
                  </div>
                </div>

                {/* Pendidikan */}
                <div className="md:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span>Tingkat Pendidikan Warga</span>
                    <span className="text-xs font-normal text-slate-500">Pendidikan Terakhir</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-slate-500 text-[11px]">SD / Sederajat</div>
                      <div className="text-base font-bold text-slate-900 mt-1">28%</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-slate-500 text-[11px]">SMP / MTs</div>
                      <div className="text-base font-bold text-slate-900 mt-1">34%</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-slate-500 text-[11px]">SMA / SMK / MA</div>
                      <div className="text-base font-bold text-[#009388] mt-1">31%</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-slate-500 text-[11px]">Diploma & Sarjana</div>
                      <div className="text-base font-bold text-[#eda50c] mt-1">7%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 3: APARATUR PEMERINTAHAN DESA (LARGE PORTRAITS) */}
          {/* =============================================================== */}
          <section id="perangkat-desa" className="py-20 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3 py-1 rounded-full border border-[#009388]/20">
                    Pamong & Aparatur
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                    Perangkat Pemerintahan Desa Kadurama
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 max-w-xl">
                    Jajaran pengurus desa yang berdedikasi melayani kepentingan masyarakat dan memajukan Desa Kadurama.
                  </p>
                </div>
                <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                  Kecamatan Ciawigebang, Kabupaten Kuningan
                </div>
              </div>

              {/* Spotlight Kepala Desa */}
              <div className="mb-10 bg-gradient-to-r from-[#003733] via-[#005851] to-[#009388] text-white rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border-2 border-[#eda50c]/60 shadow-2xl group bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                      alt="Kepala Desa Kadurama"
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#eda50c] text-slate-950 uppercase tracking-wider">
                        Kepala Desa
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <div>
                    <div className="text-[#eda50c] text-xs font-bold uppercase tracking-wider">Pimpinan Pemerintah Desa</div>
                    <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 uppercase">SUHENDRA, S.Sos</h3>
                    <p className="text-xs font-mono text-emerald-200 mt-0.5">NIP. 19780412 200501 1 008</p>
                  </div>

                  <blockquote className="text-sm sm:text-base text-emerald-100 italic border-l-2 border-[#eda50c] pl-4 py-1 leading-relaxed">
                    &quot;Kami berkomitmen melayani warga Kadurama dengan tulus, transparan dalam pengelolaan dana APBDes, dan mempermudah seluruh urusan administrasi persuratan warga.&quot;
                  </blockquote>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/15 text-xs text-emerald-100">
                    <div>
                      <span className="text-emerald-300 block text-[11px]">Tupoksi</span>
                      <span className="font-semibold text-white">Penyelenggaraan Pemdes</span>
                    </div>
                    <div>
                      <span className="text-emerald-300 block text-[11px]">Lokasi Kerja</span>
                      <span className="font-semibold text-white">Kantor Desa Kadurama</span>
                    </div>
                    <div>
                      <span className="text-emerald-300 block text-[11px]">Wilayah Koordinasi</span>
                      <span className="font-semibold text-[#eda50c]">5 Dusun & 12 RT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perangkat Sekretariat & Pelaksana Teknis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Sekdes */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:border-[#009388] hover:shadow-lg transition">
                  <div className="relative h-72 overflow-hidden bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
                      alt="Sekretaris Desa"
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-[#009388] px-2.5 py-0.5 rounded">
                        Sekretariat
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-extrabold text-slate-900 text-base uppercase">DADANG KURNIA</h4>
                    <div className="text-xs font-semibold text-[#009388] mt-0.5">Sekretaris Desa</div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Koordinator administrasi umum, kearsipan persuratan, dan penyusunan regulasi desa.
                    </p>
                  </div>
                </div>

                {/* Kasi Pelayanan */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:border-[#009388] hover:shadow-lg transition">
                  <div className="relative h-72 overflow-hidden bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80"
                      alt="Kasi Pelayanan"
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-bold text-slate-950 uppercase tracking-wider bg-[#eda50c] px-2.5 py-0.5 rounded">
                        Loket Pelayanan
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-extrabold text-slate-900 text-base uppercase">BUDI SANTOSO</h4>
                    <div className="text-xs font-semibold text-[#009388] mt-0.5">Kasi Pelayanan Umum</div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Petugas loket penerbitan surat keterangan kependudukan dan pencatatan warga.
                    </p>
                  </div>
                </div>

                {/* Kasi Pemerintahan */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:border-[#009388] hover:shadow-lg transition">
                  <div className="relative h-72 overflow-hidden bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80"
                      alt="Kasi Pemerintahan"
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-slate-700 px-2.5 py-0.5 rounded">
                        Tata Praja
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-extrabold text-slate-900 text-base uppercase">IWAN RIDWAN</h4>
                    <div className="text-xs font-semibold text-[#009388] mt-0.5">Kasi Pemerintahan</div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Pengelolaan administrasi data warga, batas wilayah desa, dan ketentraman warga.
                    </p>
                  </div>
                </div>

                {/* Kaur Keuangan */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:border-[#009388] hover:shadow-lg transition">
                  <div className="relative h-72 overflow-hidden bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80"
                      alt="Kaur Keuangan"
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-slate-700 px-2.5 py-0.5 rounded">
                        Bendahara
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-extrabold text-slate-900 text-base uppercase">M. SIGAP, S.Kom</h4>
                    <div className="text-xs font-semibold text-[#009388] mt-0.5">Kaur Keuangan (Bendahara)</div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Pencatatan kas masuk dan keluar serta pembukuan realisasi APBDes 2026.
                    </p>
                  </div>
                </div>
              </div>

              {/* 5 Dusun Pamong Wilayah */}
              <div className="mt-8 p-6 rounded-3xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-[#009388] uppercase tracking-wider mb-4">
                  Kepala Dusun (Pamong Kewilayahan Desa Kadurama)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="font-bold text-slate-900 text-sm">Heryadi J.</div>
                    <div className="text-[#009388] text-[11px] font-semibold">Kadus Manis</div>
                    <div className="text-slate-500 text-[10px] mt-1">RT 01 - RT 03 / RW 01</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="font-bold text-slate-900 text-sm">Abdul Azis</div>
                    <div className="text-[#009388] text-[11px] font-semibold">Kadus Pahing</div>
                    <div className="text-slate-500 text-[10px] mt-1">RT 04 - RT 06 / RW 02</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="font-bold text-slate-900 text-sm">Holiludin</div>
                    <div className="text-[#009388] text-[11px] font-semibold">Kadus Puhun</div>
                    <div className="text-slate-500 text-[10px] mt-1">RT 07 - RT 09 / RW 03</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="font-bold text-slate-900 text-sm">Risnayadi</div>
                    <div className="text-[#009388] text-[11px] font-semibold">Kadus Wage</div>
                    <div className="text-slate-500 text-[10px] mt-1">RT 10 - RT 11 / RW 04</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="font-bold text-slate-900 text-sm">Udi Hermanto</div>
                    <div className="text-[#009388] text-[11px] font-semibold">Kadus Kliwon</div>
                    <div className="text-slate-500 text-[10px] mt-1">RT 12 / RW 04</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 4: TRANSPARANSI APBDES 2026 */}
          {/* =============================================================== */}
          <section id="apbdes" className="py-20 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3 py-1 rounded-full border border-[#009388]/20">
                    Transparansi Anggaran
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                    Realisasi APBDes Tahun Anggaran 2026
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 max-w-xl">
                    Publikasi resmi penerimaan dan pembelanjaan anggaran dana desa untuk memastikan akuntabilitas pembangunan.
                  </p>
                </div>

                {/* Filter Tab */}
                <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl text-xs shadow-sm">
                  <button
                    onClick={() => setApbdesFilter("all")}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                      apbdesFilter === "all"
                        ? "bg-[#009388] text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Semua Pos
                  </button>
                  <button
                    onClick={() => setApbdesFilter("pendapatan")}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                      apbdesFilter === "pendapatan"
                        ? "bg-[#009388] text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Pendapatan
                  </button>
                  <button
                    onClick={() => setApbdesFilter("belanja")}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                      apbdesFilter === "belanja"
                        ? "bg-[#009388] text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    5 Bidang Belanja
                  </button>
                </div>
              </div>

              {/* 3 Kartu Cockpit */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Pagu Pendapatan */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pagu Pendapatan</div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Rp 1.485.200.000</div>
                    <p className="text-xs text-slate-600 mt-2">
                      Terdiri atas Dana Desa (DD APBN), ADD Kabupaten Kuningan, dan Pendapatan Asli Desa (PADes).
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Dasar Perdes:</span>
                    <span className="font-bold text-[#009388]">Perdes No. 02/2026</span>
                  </div>
                </div>

                {/* Tingkat Realisasi */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#003733] to-[#005851] text-white shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#eda50c] uppercase tracking-wider">Penyerapan Anggaran</div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl sm:text-4xl font-black text-white">82.4%</span>
                      <span className="text-xs text-emerald-200 font-medium">Realisasi Sehat</span>
                    </div>
                    <div className="w-full bg-slate-900/40 h-2.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-[#eda50c] h-2.5 rounded-full" style={{ width: "82.4%" }} />
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-emerald-200">Realisasi Kas:</span>
                    <span className="font-bold text-white">Rp 1.223.804.800</span>
                  </div>
                </div>

                {/* Pembiayaan & Silpa */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pembiayaan & BUMDes</div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Rp 72.400.000</div>
                    <p className="text-xs text-slate-600 mt-2">
                      Alokasi penguatan permodalan BUMDes Barokah dan cadangan anggaran darurat kebencanaan.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Status Pencairan:</span>
                    <span className="font-bold text-[#009388]">100% Terealisasi</span>
                  </div>
                </div>
              </div>

              {/* Rincian 5 Bidang Belanja */}
              {(apbdesFilter === "all" || apbdesFilter === "belanja") && (
                <div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                    Rincian Serapan 5 Bidang Belanja Wajib
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-[#009388] uppercase bg-[#e6f7f5] px-2 py-0.5 rounded">Bidang 1</span>
                        <span className="text-xs font-bold text-[#009388]">85% Terpakai</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-2">Penyelenggaraan Pemdes</h4>
                      <p className="text-xs text-slate-500 mt-1">Penghasilan tetap aparatur, operasional loket kantor desa, dan inventaris.</p>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                        <span className="text-slate-500">Pagu:</span>
                        <span className="font-bold text-slate-900">Rp 420.000.000</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-[#009388] uppercase bg-[#e6f7f5] px-2 py-0.5 rounded">Bidang 2</span>
                        <span className="text-xs font-bold text-[#009388]">78% Terpakai</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-2">Pembangunan Desa</h4>
                      <p className="text-xs text-slate-500 mt-1">Peningkatan jalan usaha tani Dusun Puhun, rabat beton, dan perbaikan drainase.</p>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                        <span className="text-slate-500">Pagu:</span>
                        <span className="font-bold text-slate-900">Rp 610.000.000</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-[#009388] uppercase bg-[#e6f7f5] px-2 py-0.5 rounded">Bidang 3</span>
                        <span className="text-xs font-bold text-[#009388]">72% Terpakai</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-2">Pembinaan Kemasyarakatan</h4>
                      <p className="text-xs text-slate-500 mt-1">Pembinaan Karang Taruna, Linmas, kerukunan warga, dan lembaga adat.</p>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                        <span className="text-slate-500">Pagu:</span>
                        <span className="font-bold text-slate-900">Rp 145.000.000</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-[#009388] uppercase bg-[#e6f7f5] px-2 py-0.5 rounded">Bidang 4</span>
                        <span className="text-xs font-bold text-[#009388]">80% Terpakai</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-2">Pemberdayaan Masyarakat</h4>
                      <p className="text-xs text-slate-500 mt-1">Pelatihan kelompok tani, ketahanan pangan hewani, dan pendampingan UMKM.</p>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                        <span className="text-slate-500">Pagu:</span>
                        <span className="font-bold text-slate-900">Rp 180.000.000</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-[#009388] uppercase bg-[#e6f7f5] px-2 py-0.5 rounded">Bidang 5</span>
                        <span className="text-xs font-bold text-[#009388]">90% Terpakai</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-2">Bencana & Bantuan Mendesak</h4>
                      <p className="text-xs text-slate-500 mt-1">Penyaluran BLT Dana Desa (BLT-DD) bagi keluarga penerima manfaat.</p>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                        <span className="text-slate-500">Pagu:</span>
                        <span className="font-bold text-slate-900">Rp 57.800.000</span>
                      </div>
                    </div>

                    {/* Download PDF Trigger */}
                    <div className="p-5 rounded-2xl bg-[#003733] text-white flex flex-col justify-between shadow-sm">
                      <div>
                        <span className="text-[10px] font-bold text-[#eda50c] uppercase tracking-wider">Dokumen Publik</span>
                        <h4 className="font-bold text-white text-sm mt-1">Salinan Perdes APBDes 2026</h4>
                        <p className="text-xs text-emerald-100/80 mt-1">Unduh berkas PDF resmi rincian anggaran yang disahkan BPD.</p>
                      </div>
                      <button
                        onClick={() => alert("Mengunduh salinan dokumen resmi Perdes APBDes Kadurama 2026 format PDF...")}
                        className="mt-4 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white text-xs font-bold transition"
                      >
                        <Download className="w-4 h-4" />
                        <span>Unduh Dokumen PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 5: KABAR & BERITA DESA KADURAMA */}
          {/* =============================================================== */}
          <section id="berita" className="py-20 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3 py-1 rounded-full border border-[#009388]/20">
                    Informasi Terkini
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                    Kabar & Berita Kegiatan Desa
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 max-w-xl">
                    Informasi resmi kegiatan pemerintah desa, musyawarah warga, agenda pembangunan, serta penyaluran bantuan masyarakat.
                  </p>
                </div>
                <a href="#berita" className="text-xs font-bold text-[#009388] hover:text-[#005851] flex items-center gap-1">
                  <span>Lihat Semua Berita</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Berita 1 */}
                <article className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden hover:shadow-md transition group">
                  <div className="h-48 bg-slate-200 overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80"
                      alt="Musdes Kadurama"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#009388] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                      Pemerintahan
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-[11px] text-slate-500 mb-2">12 September 2026 • Balai Desa</div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-[#009388] transition line-clamp-2">
                      Musyawarah Rencana Kerja Pemerintah Desa (RKPDes) Tahun 2027 Berjalan Lancar
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                      Kepala Desa bersama BPD dan tokoh masyarakat dari 5 dusun menyepakati prioritas pembangunan jalan tani dan drainase lingkungan untuk tahun depan.
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs font-semibold text-[#009388]">
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </article>

                {/* Berita 2 */}
                <article className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden hover:shadow-md transition group">
                  <div className="h-48 bg-slate-200 overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80"
                      alt="Penyaluran BLT"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#eda50c] text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                      Bansos
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-[11px] text-slate-500 mb-2">08 September 2026 • Loket Kantor</div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-[#009388] transition line-clamp-2">
                      Penyaluran BLT Dana Desa Tahap III Bagi 48 Keluarga Penerima Manfaat
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                      Pemerintah Desa Kadurama menyalurkan bantuan langsung tunai dana desa dengan tertib dan tepat sasaran disaksikan langsung oleh BPD dan Babinsa.
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs font-semibold text-[#009388]">
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </article>

                {/* Berita 3 */}
                <article className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden hover:shadow-md transition group">
                  <div className="h-48 bg-slate-200 overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80"
                      alt="Pertanian Dusun"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#009388] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                      Pertanian
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-[11px] text-slate-500 mb-2">02 September 2026 • Dusun Manis</div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-[#009388] transition line-clamp-2">
                      Kelompok Tani Sri Rejeki Panen Perdana Beras Organik dengan Hasil Memuaskan
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                      Program ketahanan pangan desa berhasil meningkatkan produktivitas gabah kelompok tani Dusun Manis melalui metode pemupukan organik terpadu.
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs font-semibold text-[#009388]">
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 6: JADWAL & LOKASI KANTOR DESA */}
          {/* =============================================================== */}
          <section id="lokasi-kantor" className="py-20 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3 py-1 rounded-full border border-[#009388]/20">
                    Pelayanan Langsung
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-3">Kantor Pemerintahan Desa Kadurama</h3>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    Loket persuratan kami melayani warga langsung dengan ramah, cepat, dan tanpa biaya pungutan liar.
                  </p>
                  <div className="mt-6 space-y-2.5 text-xs text-slate-600">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#009388] shrink-0 mt-0.5" />
                      <span>Jl. Raya Desa Kadurama No. 12, Kec. Ciawigebang, Kab. Kuningan 45591</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#009388] shrink-0" />
                      <span>pemdes@kadurama.desa.id</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#009388] shrink-0" />
                      <span>+62 821-2345-6789</span>
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#009388]" />
                    Jadwal Loket Pelayanan Desa
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-600">Senin - Kamis</span>
                      <span className="font-bold text-slate-900">07.30 - 15.00 WIB</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-600">Jumat</span>
                      <span className="font-bold text-slate-900">07.30 - 15.00 WIB</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-600">Istirahat Siang</span>
                      <span className="font-semibold text-slate-700">11.45 - 13.00 WIB</span>
                    </div>
                    <div className="flex justify-between text-rose-700 font-medium">
                      <span>Sabtu dan Minggu</span>
                      <span className="font-bold">Libur (Piket Darurat)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#003733] to-[#005851] text-white p-6 rounded-2xl flex flex-col justify-between h-full">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#eda50c]">Layanan Warga</div>
                    <h4 className="text-lg font-bold mt-1 text-white">Datang Langsung ke Loket</h4>
                    <p className="text-xs text-emerald-100/90 mt-2 leading-relaxed">
                      Petugas loket akan langsung mencocokkan identitas NIK Anda pada sistem kependudukan desa dan mencetak surat resmi seketika.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 text-xs text-emerald-200">
                    Disarankan membawa fotokopi KTP dan KK rangkap dua.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER RESMI */}
          <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3 text-white font-extrabold text-sm mb-3 uppercase">
                    <Image
                      src="/kuningan-logo.png"
                      alt="Logo Kuningan"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                    <span>Pemerintah Desa Kadurama</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Kecamatan Ciawigebang, Kabupaten Kuningan, Jawa Barat 45591.<br />
                    Pos-el: pemdes@kadurama.desa.id | WhatsApp: +62 821-2345-6789
                  </p>
                </div>
                <div>
                  <h5 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Akses Halaman</h5>
                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    <a href="#beranda" className="hover:text-[#eda50c]">Beranda</a>
                    <a href="#layanan-surat" className="hover:text-[#eda50c]">Syarat Surat</a>
                    <a href="#statistik" className="hover:text-[#eda50c]">Statistik Warga</a>
                    <a href="#perangkat-desa" className="hover:text-[#eda50c]">Aparatur Desa</a>
                    <a href="#apbdes" className="hover:text-[#eda50c]">APBDes 2026</a>
                    <a href="#berita" className="hover:text-[#eda50c]">Kabar Desa</a>
                  </div>
                </div>
                <div>
                  <h5 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Petugas Loket Kantor</h5>
                  <p className="text-slate-400 mb-3">
                    Sistem loket internal aparatur desa untuk pelayanan cetak surat resmi dan kependudukan.
                  </p>
                  <button
                    onClick={() => setView("admin")}
                    className="px-4 py-2 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs transition"
                  >
                    Buka Backpanel Pelayanan Loket
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
                <div>(c) 2026 Pemerintah Desa Kadurama, Kabupaten Kuningan. Seluruh hak cipta dilindungi.</div>
                <div className="italic">Melesat Ngudag Jaman, Ngakar Kuat Purwadaksi</div>
              </div>
            </div>
          </footer>
        </main>
      ) : (
        <div className="flex-1 bg-slate-100 flex">
          {/* VIEW 2: BACKPANEL LOKET PERSURATAN (CETAK A4 RESMI SIAP PITCH) */ }
          {/* Sidebar Backpanel */}
          <aside className="no-print w-64 bg-[#003733] text-white flex-shrink-0 min-h-screen flex flex-col justify-between border-r border-[#005851]">
            <div>
              <div className="p-5 border-b border-[#005851] flex items-center gap-3">
                <Image src="/kuningan-logo.png" alt="Logo" width={32} height={32} className="object-contain" />
                <div>
                  <div className="font-bold text-sm leading-tight text-white">Loket Pemdes</div>
                  <div className="text-[11px] text-[#eda50c]">Desa Kadurama • Kuningan</div>
                </div>
              </div>

              <div className="p-3 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/70 px-3 py-2">
                  Pelayanan Administrasi
                </div>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#009388] text-white font-semibold text-xs shadow-sm text-left">
                  <FileText className="w-4 h-4" />
                  <span>Buat dan Cetak Surat</span>
                </button>
                <button
                  onClick={() => alert("Fitur database kependudukan lengkap akan aktif saat deal dengan client.")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-emerald-100 hover:bg-[#005851] text-xs font-medium transition text-left"
                >
                  <Users className="w-4 h-4" />
                  <span>Data Kependudukan</span>
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-[#005851]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#eda50c] text-slate-950 font-bold flex items-center justify-center text-xs">
                  BS
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Budi Santoso</div>
                  <div className="text-[10px] text-emerald-300">Kasi Pelayanan Loket</div>
                </div>
              </div>
              <button
                onClick={() => setView("public")}
                className="mt-3 w-full py-1.5 rounded-lg bg-[#005851] hover:bg-[#004741] text-emerald-100 text-[11px] font-medium transition"
              >
                Lihat Laman Publik Warga
              </button>
            </div>
          </aside>

          {/* Main Area Generator Surat */}
          <main className="flex-1 p-6 lg:p-8 max-w-[1400px]">
            <div className="no-print flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Pelayanan & Generator Surat Warga di Loket</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Cari data NIK warga terdaftar, tentukan jenis surat dan parameter, lalu pratinjau dokumen resmi A4 siap cetak.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-[#009388] hover:bg-[#007b71] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen Resmi (PDF / Print)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Kolom Input (5 Cols) */}
              <div className="no-print xl:col-span-5 space-y-5">
                {/* Cari Warga */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    1. Cari Data Warga (NIK / Nama Lengkap)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchResident(e.target.value)}
                      placeholder="Ketik NIK 16 digit atau Nama (contoh: Asep / Siti / Udi)"
                      className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009388] focus:border-[#009388] bg-slate-50"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>

                  <div className="mt-4 p-3.5 bg-[#e6f7f5] border border-[#009388]/30 rounded-xl text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-950">{selectedResident.nama}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#009388] text-white">
                        {selectedResident.status}
                      </span>
                    </div>
                    <div className="text-slate-600 flex justify-between">
                      <span>NIK:</span>
                      <span className="font-mono font-semibold text-slate-900">{selectedResident.nik}</span>
                    </div>
                    <div className="text-slate-600 flex justify-between">
                      <span>Tempat, Tgl Lahir:</span>
                      <span className="font-medium text-slate-900">{selectedResident.ttl}</span>
                    </div>
                    <div className="text-slate-600 flex justify-between">
                      <span>Pekerjaan:</span>
                      <span className="font-medium text-slate-900">{selectedResident.pekerjaan}</span>
                    </div>
                    <div className="text-slate-600 flex justify-between">
                      <span>Alamat:</span>
                      <span className="font-medium text-slate-900 text-right">{selectedResident.alamat}</span>
                    </div>
                  </div>
                </div>

                {/* Template Surat */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      2. Pilih Template Surat
                    </label>
                    <select
                      value={letterType}
                      onChange={(e) => setLetterType(e.target.value as any)}
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#009388] font-medium text-slate-800"
                    >
                      <option value="SKU">Surat Keterangan Usaha (SKU)</option>
                      <option value="SKTM">Surat Keterangan Tidak Mampu (SKTM)</option>
                      <option value="SKCK">Surat Pengantar Catatan Kepolisian (SKCK)</option>
                      <option value="DOMISILI">Surat Keterangan Domisili</option>
                    </select>
                  </div>

                  {letterType === "SKU" && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-800">Parameter Usaha:</div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">Nama Usaha</label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">Bidang Usaha</label>
                        <input
                          type="text"
                          value={businessField}
                          onChange={(e) => setBusinessField(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">Lokasi Usaha</label>
                        <input
                          type="text"
                          value={businessLocation}
                          onChange={(e) => setBusinessLocation(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Keperluan Surat</label>
                    <input
                      type="text"
                      value={letterPurpose}
                      onChange={(e) => setLetterPurpose(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Pejabat Penandatangan</label>
                    <select
                      value={selectedOfficial}
                      onChange={(e) => setSelectedOfficial(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800"
                    >
                      <option value="kades">Kepala Desa - SUHENDRA, S.Sos</option>
                      <option value="sekdes">Sekretaris Desa - DADANG KURNIA</option>
                    </select>
                  </div>

                  <button
                    onClick={() =>
                      alert("Surat berhasil diregistrasi ke agenda loket! Klik tombol 'Cetak Dokumen Resmi' untuk mencetak ke kertas A4.")
                    }
                    className="w-full py-2.5 px-4 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm transition"
                  >
                    Registrasi ke Agenda & Siapkan Cetak
                  </button>
                </div>
              </div>

              {/* Kolom Preview Kertas A4 (7 Cols) */}
              <div className="xl:col-span-7">
                <div className="no-print mb-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">Pratinjau Kertas Format Resmi (Standar F4/A4)</span>
                  <span>Kop Pemdes Kadurama • Skala 100%</span>
                </div>

                <div
                  id="print-area"
                  className="bg-white text-black p-8 sm:p-12 rounded-lg border border-slate-300 shadow-xl max-w-[760px] mx-auto min-h-[960px] font-serif leading-relaxed text-sm"
                >
                  {/* Kop Surat */}
                  <div className="border-b-4 border-double border-black pb-4 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-16 h-16 border-2 border-black rounded flex items-center justify-center font-sans font-bold text-xs text-center leading-tight">
                        KAB.<br />KUNINGAN
                      </div>
                      <div className="flex-1 font-sans">
                        <div className="text-base font-bold tracking-wide uppercase">Pemerintah Kabupaten Kuningan</div>
                        <div className="text-sm font-bold uppercase">Kecamatan Ciawigebang</div>
                        <div className="text-xl font-extrabold tracking-wider uppercase text-slate-950">
                          Pemerintah Desa Kadurama
                        </div>
                        <div className="text-[11px] text-slate-800 mt-1">
                          Jl. Raya Desa Kadurama No. 12, Kec. Ciawigebang, Kode Pos 45591<br />
                          Laman Resmi: kadurama.desa.id | Pos-el: pemdes@kadurama.desa.id
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Judul & Nomor */}
                  <div className="text-center my-6">
                    <div className="font-sans font-bold text-base underline uppercase tracking-wide">
                      {letterType === "SKU" && "Surat Keterangan Usaha"}
                      {letterType === "SKTM" && "Surat Keterangan Tidak Mampu"}
                      {letterType === "SKCK" && "Surat Pengantar Catatan Kepolisian"}
                      {letterType === "DOMISILI" && "Surat Keterangan Domisili"}
                    </div>
                    <div className="text-xs font-sans mt-0.5">
                      Nomor: 503 / 048 / Pem / IX / 2026
                    </div>
                  </div>

                  <p className="text-justify text-xs mb-4">
                    Yang bertanda tangan di bawah ini, Kepala Desa Kadurama, Kecamatan Ciawigebang, Kabupaten Kuningan, Provinsi Jawa Barat, dengan ini menerangkan bahwa:
                  </p>

                  {/* Biodata */}
                  <div className="space-y-1.5 text-xs ml-4 mb-4">
                    <div className="grid grid-cols-12">
                      <div className="col-span-4 text-slate-700">Nama Lengkap</div>
                      <div className="col-span-8 font-bold uppercase">: {selectedResident.nama}</div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-4 text-slate-700">NIK</div>
                      <div className="col-span-8 font-mono">: {selectedResident.nik}</div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-4 text-slate-700">Tempat, Tgl. Lahir</div>
                      <div className="col-span-8">: {selectedResident.ttl}</div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-4 text-slate-700">Pekerjaan</div>
                      <div className="col-span-8">: {selectedResident.pekerjaan}</div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-4 text-slate-700">Alamat KTP</div>
                      <div className="col-span-8">: {selectedResident.alamat}</div>
                    </div>
                  </div>

                  {/* Isi Keterangan */}
                  <div className="text-justify text-xs space-y-2 mb-6">
                    {letterType === "SKU" && (
                      <>
                        <p>
                          Menerangkan dengan sebenarnya bahwa orang yang bersangkutan adalah benar warga yang berdomisili di Desa Kadurama dan sepanjang pengamatan kami memiliki dan menjalankan usaha:
                        </p>
                        <div className="ml-4 space-y-1 bg-slate-50 p-2.5 border border-slate-200 rounded">
                          <div className="grid grid-cols-12">
                            <div className="col-span-4 font-semibold">Nama Usaha</div>
                            <div className="col-span-8">: <span className="font-bold">{businessName}</span></div>
                          </div>
                          <div className="grid grid-cols-12">
                            <div className="col-span-4 font-semibold">Bidang Usaha</div>
                            <div className="col-span-8">: {businessField}</div>
                          </div>
                          <div className="grid grid-cols-12">
                            <div className="col-span-4 font-semibold">Alamat Usaha</div>
                            <div className="col-span-8">: {businessLocation}</div>
                          </div>
                        </div>
                      </>
                    )}

                    {letterType === "SKTM" && (
                      <p>
                        Menerangkan dengan sebenarnya bahwa orang tersebut di atas adalah benar-benar warga Desa Kadurama yang tergolong dalam keluarga pra-sejahtera dan membutuhkan keringanan bantuan.
                      </p>
                    )}

                    {letterType === "SKCK" && (
                      <p>
                        Menerangkan dengan sebenarnya bahwa orang tersebut di atas adalah warga yang berkelakuan baik, tidak sedang menjalani proses pidana ataupun terlibat perkara kepolisian di wilayah kami.
                      </p>
                    )}

                    {letterType === "DOMISILI" && (
                      <p>
                        Menerangkan dengan sebenarnya bahwa nama tersebut di atas benar berdomisili dan bertempat tinggal pada alamat yang tercantum di atas sejak tahun 2018 sampai dengan sekarang.
                      </p>
                    )}

                    <p>
                      Surat Keterangan ini dibuat dan diberikan kepada yang bersangkutan untuk keperluan: <strong>{letterPurpose}</strong>.
                    </p>
                  </div>

                  <p className="text-justify text-xs mb-8">
                    Demikian surat keterangan ini kami buat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya oleh pihak yang berkepentingan.
                  </p>

                  {/* TTD & Barcode */}
                  <div className="grid grid-cols-12 items-end pt-4 font-sans text-xs">
                    <div className="col-span-5 text-center">
                      <div className="border border-slate-300 p-2 rounded inline-block bg-slate-50 mb-1">
                        <div className="w-20 h-20 bg-slate-900 text-white flex items-center justify-center text-[9px] font-mono text-center p-1">
                          KADURAMA<br />VERIFIED<br />#048-IX-26
                        </div>
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono">Scan verifikasi keabsahan surat</div>
                    </div>

                    <div className="col-span-7 text-center">
                      <div>Kadurama, 13 September 2026</div>
                      <div className="font-bold uppercase mt-1">
                        {selectedOfficial === "kades" ? "Kepala Desa Kadurama" : "a.n. Kepala Desa Kadurama\nSekretaris Desa"}
                      </div>
                      <div className="h-20 flex items-center justify-center text-slate-400 italic text-[11px]">
                        (Tanda Tangan dan Cap Stempel Basah)
                      </div>
                      <div className="font-bold underline uppercase">
                        {selectedOfficial === "kades" ? "SUHENDRA, S.Sos" : "DADANG KURNIA"}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {selectedOfficial === "kades" ? "NIP. 19780412 200501 1 008" : "NIP. 19820719 200902 1 003"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
