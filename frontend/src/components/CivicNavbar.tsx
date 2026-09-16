"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home as HomeIcon,
  ChevronDown,
  Search,
  Lock,
  Menu,
  X,
  Clock,
  MapPin,
  FileText,
  Building2,
  Users,
  PieChart,
  Newspaper,
  Bell,
  Calendar,
  ShieldAlert,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface CivicNavbarProps {
  onOpenAdminLogin?: () => void;
}

export default function CivicNavbar({ onOpenAdminLogin }: CivicNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Close dropdown on mouse leave with grace period
  const handleDropdownEnter = (key: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(key);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const isDusunActive = pathname?.startsWith("/dusun");
  const isProfilActive = pathname?.startsWith("/profil") || isDusunActive;
  const isLayananActive = pathname?.startsWith("/layanan");
  const isTransparansiActive = pathname?.startsWith("/transparansi");
  const isPetaActive = pathname === "/peta";
  const isBeritaActive =
    pathname?.startsWith("/berita") ||
    pathname?.startsWith("/pengumuman") ||
    pathname?.startsWith("/agenda");

  return (
    <header className="no-print sticky top-0 z-50 shadow-sm transition-all duration-200">
      {/* ================================================================= */}
      {/* BARIS 1: TOP HEADER BAR (Putih Bersih - Identitas Resmi Desa)     */}
      {/* ================================================================= */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand & Identitas Resmi Desa */}
          <Link href="/" className="flex items-center gap-3.5 min-w-0 group">
            <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/logo-kuningan.png"
                alt="Logo Kabupaten Kuningan"
                width={40}
                height={40}
                className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#003733] truncate uppercase">
                  DESA KADURAMA
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-[#e6f7f5] text-[#009388] rounded-full border border-[#009388]/30">
                  Kuningan Asri
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate">
                Kecamatan Ciawigebang, Kabupaten Kuningan • Jawa Barat
              </p>
            </div>
          </Link>

          {/* Sisi Kanan Baris 1: Pencarian & Tombol Akses Portal */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Search Input Ringkas */}
            <div className="relative hidden md:block w-56 lg:w-68">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari surat, dusun, APBDes..."
                className="w-full pl-8 pr-3 py-1.5 rounded-full border border-slate-300 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#009388] focus:border-transparent transition"
              />
            </div>

            {/* Tombol Akses Aparatur: HANYA ICON GEMBOK */}
            {/* Tombol Akses Aparatur: Direct Link ke /master */}
            <div className="hidden md:flex items-center">
              <Link
                href="/master"
                title="Masuk ke Panel Master Aparatur Desa"
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#e6f7f5] text-[#003733] hover:text-[#009388] hover:border-[#009388]/40 transition shadow-2xs group flex items-center justify-center"
                aria-label="Panel Master Aparatur"
              >
                <Lock className="w-4 h-4 text-[#009388] group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            {/* Hamburger Menu untuk Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* BARIS 2: SUB-NAVBAR KATEGORI (Dark Emerald Kuningan #003733)      */}
      {/* ================================================================= */}
      <div className="hidden md:block bg-[#003733] text-white border-b border-[#005851]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between text-xs font-semibold tracking-wide">
          <nav className="flex items-center gap-1">
            {/* 1. BERANDA: ICON HOME */}
            <Link
              href="/"
              title="Beranda Utama"
              className={`p-2 rounded-lg transition flex items-center justify-center ${
                pathname === "/"
                  ? "text-white bg-[#005851]"
                  : "text-emerald-100 hover:text-white hover:bg-[#005851]"
              }`}
            >
              <HomeIcon className="w-4 h-4" />
            </Link>

            <span className="text-emerald-500/50">|</span>

            {/* 2. PROFIL DESA DROPDOWN */}
            <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("profil")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => setActiveDropdown("profil")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                      activeDropdown === "profil"
                        ? "text-white bg-[#005851]"
                        : "text-emerald-100 hover:text-white hover:bg-[#005851]"
                    }`}
                  >
                    <span>Profil Desa</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === "profil" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === "profil" && (
                    <div
                      className="absolute top-full left-0 pt-2 w-72 z-50 select-none before:content-[''] before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:bg-transparent"
                      onMouseEnter={() => handleDropdownEnter("profil")}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="relative bg-white text-slate-800 rounded-2xl p-2.5 shadow-2xl border border-slate-200 animate-in fade-in-50 zoom-in-95 duration-150">
                        <div className="absolute -top-1.5 left-5 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45 pointer-events-none" />
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Pemerintahan & Wilayah
                        </div>
                        <a
                          href="/profil/sejarah-visi-misi"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#e6f7f5] hover:text-[#009388] transition"
                        >
                          <BookOpen className="w-4 h-4 text-[#009388]" />
                          <div>
                            <div className="font-bold">Sejarah, Visi & Misi</div>
                            <div className="text-[11px] text-slate-500 font-normal">Silsilah Kuwu & Visi Pembangunan</div>
                          </div>
                        </a>
                        <a
                          href="/profil/pemerintahan"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#e6f7f5] hover:text-[#009388] transition"
                        >
                          <Building2 className="w-4 h-4 text-[#009388]" />
                          <div>
                            <div className="font-bold">Pemerintahan & Pamong</div>
                            <div className="text-[11px] text-slate-500 font-normal">Struktur Kuwu, BPD, dan Pamong</div>
                          </div>
                        </a>
                        <a
                          href="/profil/demografi"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#e6f7f5] hover:text-[#009388] transition"
                        >
                          <Users className="w-4 h-4 text-[#eda50c]" />
                          <div>
                            <div className="font-bold">Demografi & Statistik</div>
                            <div className="text-[11px] text-slate-500 font-normal">Populasi, pekerjaan, dan desil</div>
                          </div>
                        </a>
                        <div className="my-1.5 border-t border-slate-100" />
                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Halaman Khusus Dusun
                        </div>
                        <a
                          href="/dusun/pahing"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50 hover:text-[#009388] transition"
                        >
                          <span>Dusun I • Pahing</span>
                          <span className="text-[10px] text-slate-400 font-mono">Olahraga & Padi &rarr;</span>
                        </a>
                        <a
                          href="/dusun/wage"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50 hover:text-[#009388] transition"
                        >
                          <span>Dusun II • Wage</span>
                          <span className="text-[10px] text-slate-400 font-mono">Religi & Air &rarr;</span>
                        </a>
                        <a
                          href="/dusun/manis"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50 hover:text-[#009388] transition"
                        >
                          <span>Dusun III • Manis</span>
                          <span className="text-[10px] text-slate-400 font-mono">KUA & Pendidikan &rarr;</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

            {/* 3. LAYANAN WARGA (INFORMASI PERSYARATAN & SOP LOKET) */}
            <Link
              href="/layanan"
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                isLayananActive
                  ? "text-white bg-[#005851]"
                  : "text-emerald-100 hover:text-white hover:bg-[#005851]"
              }`}
            >
              <span>Layanan Warga</span>
            </Link>

            {/* 4. TRANSPARANSI APBDES (Direct Link - Tanpa Dropdown) */}
            <Link
              href="/transparansi/apbdes"
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                isTransparansiActive
                  ? "text-white bg-[#005851]"
                  : "text-emerald-100 hover:text-white hover:bg-[#005851]"
              }`}
            >
              <span>Transparansi APBDes</span>
            </Link>

            {/* 5. PETA GIS WILAYAH (Direct Link Halaman Khusus - Tanpa Icon) */}
            <Link
              href="/peta"
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                isPetaActive
                  ? "text-white bg-[#005851]"
                  : "text-emerald-100 hover:text-white hover:bg-[#005851]"
              }`}
            >
              <span>Peta Wilayah</span>
            </Link>

            {/* 6. KABAR & INFORMASI DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter("kabar")}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === "kabar" ? null : "kabar")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  isBeritaActive || activeDropdown === "kabar"
                    ? "text-white bg-[#005851]"
                    : "text-emerald-100 hover:text-white hover:bg-[#005851]"
                }`}
              >
                <span>Kabar & Warta</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "kabar" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === "kabar" && (
                <div
                  className="absolute top-full left-0 pt-2 w-72 z-50 select-none before:content-[''] before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:bg-transparent"
                  onMouseEnter={() => handleDropdownEnter("kabar")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="relative bg-white text-slate-800 rounded-2xl p-2.5 shadow-2xl border border-slate-200 animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="absolute -top-1.5 left-5 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45 pointer-events-none" />
                    
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Pusat Informasi Publik
                    </div>
                    <Link
                      href="/berita"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#e6f7f5] hover:text-[#009388] transition"
                    >
                      <Newspaper className="w-4 h-4 text-[#009388]" />
                      <div>
                        <div className="font-bold">Berita Desa</div>
                        <div className="text-[11px] text-slate-500 font-normal">Liputan kegiatan, pembangunan & tani</div>
                      </div>
                    </Link>
                    <Link
                      href="/pengumuman"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#e6f7f5] hover:text-[#009388] transition"
                    >
                      <Bell className="w-4 h-4 text-[#eda50c]" />
                      <div>
                        <div className="font-bold">Pengumuman Resmi</div>
                        <div className="text-[11px] text-slate-500 font-normal">Edaran Kuwu, jadwal PBB & bansos</div>
                      </div>
                    </Link>
                    <Link
                      href="/agenda"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#e6f7f5] hover:text-[#009388] transition"
                    >
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-bold">Agenda Kegiatan</div>
                        <div className="text-[11px] text-slate-500 font-normal">Kalender kegiatan pemdes & posyandu</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Sisi Kanan Baris 2: Jam Pelayanan Balai Desa */}
          <div className="flex items-center gap-2 text-emerald-200/90 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-[#eda50c]" />
            <span>Pelayanan Balai Desa: 08.00 - 15.00 WIB</span>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* MOBILE DRAWER ACCORDION MENU                                      */}
      {/* ================================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 text-xs shadow-lg animate-in slide-in-from-top duration-150 max-h-[85vh] overflow-y-auto">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388]"
          >
            Beranda Utama
          </Link>

          {/* Profil Dusun Quick Grid */}
          <div className="border-t border-slate-100 pt-2 pb-1 px-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Wilayah 3 Dusun:</span>
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              <Link
                href="/dusun/pahing"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2 text-center text-xs font-bold rounded-lg border bg-slate-50 text-slate-700 border-slate-200 hover:bg-[#e6f7f5] hover:text-[#009388]"
              >
                Pahing
              </Link>
              <Link
                href="/dusun/wage"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2 text-center text-xs font-bold rounded-lg border bg-slate-50 text-slate-700 border-slate-200 hover:bg-[#e6f7f5] hover:text-[#009388]"
              >
                Wage
              </Link>
              <Link
                href="/dusun/manis"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2 text-center text-xs font-bold rounded-lg border bg-slate-50 text-slate-700 border-slate-200 hover:bg-[#e6f7f5] hover:text-[#009388]"
              >
                Manis
              </Link>
            </div>
          </div>

          <Link
            href="/profil/sejarah-visi-misi"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388]"
          >
            Sejarah, Visi & Misi Desa
          </Link>

          <Link
            href="/profil/pemerintahan"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388]"
          >
            Pemerintahan & Pamong Desa
          </Link>

          <Link
            href="/layanan"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388]"
          >
            Informasi Persyaratan & SOP Layanan
          </Link>

          <Link
            href="/transparansi/apbdes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388]"
          >
            Transparansi APBDes 2026
          </Link>

          <Link
            href="/peta"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388]"
          >
            Peta Geospasial GIS Desa
          </Link>

          <div className="border-t border-slate-100 pt-2 px-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kabar Desa:</span>
            <div className="space-y-1 mt-1">
              <Link
                href="/berita"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-slate-700 font-medium hover:text-[#009388]"
              >
                Berita Kegiatan
              </Link>
              <Link
                href="/pengumuman"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-slate-700 font-medium hover:text-[#009388]"
              >
                Pengumuman Resmi
              </Link>
              <Link
                href="/agenda"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-slate-700 font-medium hover:text-[#009388]"
              >
                Agenda Kegiatan
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2 px-3">
            <Link
              href="/master"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-xs font-bold text-[#003733] hover:text-[#009388]"
            >
              <Lock className="w-3.5 h-3.5 text-[#009388]" />
              <span>Panel Master Data Aparatur</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
