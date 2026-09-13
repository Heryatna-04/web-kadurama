"use client";

import { useState, useEffect } from "react";
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
  ChevronDown,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Download,
  Lock,
  LogOut,
  Menu,
  X,
  Eye,
  Plus,
  Upload,
  Filter,
  BookOpen,
  Home as HomeIcon,
  Check,
  AlertCircle,
  FileCheck2,
  Inbox,
  Send,
  Building,
  Calendar,
} from "lucide-react";

// Mock Resident Data for Loket Generator & Master Data
interface Resident {
  nik: string;
  noKk: string;
  nama: string;
  ttl: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  pekerjaan: string;
  agama: string;
  statusPerkawinan: string;
  hubunganKeluarga: string;
  dusun: "Manis" | "Pahing" | "Puhun" | "Wage" | "Kliwon";
  rt: string;
  rw: string;
  alamat: string;
  status: string;
}

const RESIDENTS_DATA: Record<string, Resident> = {
  "3208152405900001": {
    nik: "3208152405900001",
    noKk: "3208150102030001",
    nama: "Asep Saepuloh",
    ttl: "Kuningan, 24 Mei 1990",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Wiraswasta",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Manis",
    rt: "02",
    rw: "01",
    alamat: "Dusun Manis RT 02 / RW 01, Desa Kadurama",
    status: "Warga Tetap",
  },
  "3208156108950002": {
    nik: "3208156108950002",
    noKk: "3208150102030002",
    nama: "Siti Aminah",
    ttl: "Kuningan, 18 Agustus 1995",
    jenisKelamin: "Perempuan",
    pekerjaan: "Mengurus Rumah Tangga",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Istri",
    dusun: "Pahing",
    rt: "05",
    rw: "02",
    alamat: "Dusun Pahing RT 05 / RW 02, Desa Kadurama",
    status: "Warga Tetap",
  },
  "3208151201880003": {
    nik: "3208151201880003",
    noKk: "3208150102030003",
    nama: "Udi Hermanto",
    ttl: "Kuningan, 12 Januari 1988",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Petani / Pekebun",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Kliwon",
    rt: "09",
    rw: "04",
    alamat: "Dusun Kliwon RT 09 / RW 04, Desa Kadurama",
    status: "Warga Tetap",
  },
  "3208152504010004": {
    nik: "3208152504010004",
    noKk: "3208150102030001",
    nama: "Rizky Ramdani",
    ttl: "Kuningan, 25 April 2001",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Pelajar / Mahasiswa",
    agama: "Islam",
    statusPerkawinan: "Belum Kawin",
    hubunganKeluarga: "Anak",
    dusun: "Manis",
    rt: "02",
    rw: "01",
    alamat: "Dusun Manis RT 02 / RW 01, Desa Kadurama",
    status: "Warga Tetap",
  },
  "3208151111920005": {
    nik: "3208151111920005",
    noKk: "3208150102030004",
    nama: "Maman Suherman",
    ttl: "Kuningan, 11 November 1992",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Pedagang",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Puhun",
    rt: "03",
    rw: "03",
    alamat: "Dusun Puhun RT 03 / RW 03, Desa Kadurama",
    status: "Warga Tetap",
  },
  "3208155502940006": {
    nik: "3208155502940006",
    noKk: "3208150102030005",
    nama: "Neneng Hasanah",
    ttl: "Kuningan, 15 Februari 1994",
    jenisKelamin: "Perempuan",
    pekerjaan: "Guru Honorer",
    agama: "Islam",
    statusPerkawinan: "Belum Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Wage",
    rt: "07",
    rw: "03",
    alamat: "Dusun Wage RT 07 / RW 03, Desa Kadurama",
    status: "Warga Tetap",
  },
};

// Initial Integrated Agenda Records (Surat Masuk & Keluar)
interface AgendaRecord {
  id: string;
  tipe: "keluar" | "masuk";
  nomorSurat: string;
  tanggal: string;
  perihal: string;
  pihakTerkait: string;
  pejabatAtauPenerima: string;
  status: "Terbit" | "Terarsip" | "Disposisi Kades";
}

const INITIAL_AGENDA: AgendaRecord[] = [
  {
    id: "AG-K-001",
    tipe: "keluar",
    nomorSurat: "503/048/Pem/IX/2026",
    tanggal: "13 Sep 2026",
    perihal: "Surat Keterangan Usaha (SKU) - Warung Sembako Barokah",
    pihakTerkait: "Asep Saepuloh (NIK: 3208152405900001)",
    pejabatAtauPenerima: "Kades Suhendra, S.Sos",
    status: "Terbit",
  },
  {
    id: "AG-K-002",
    tipe: "keluar",
    nomorSurat: "401/049/Kesra/IX/2026",
    tanggal: "12 Sep 2026",
    perihal: "Surat Keterangan Tidak Mampu (SKTM) - Bantuan KIP Kuliah",
    pihakTerkait: "Siti Aminah (NIK: 3208156108950002)",
    pejabatAtauPenerima: "Sekdes Dadang Kurnia",
    status: "Terbit",
  },
  {
    id: "AG-M-001",
    tipe: "masuk",
    nomorSurat: "005/312/Kec.Cwg/2026",
    tanggal: "11 Sep 2026",
    perihal: "Undangan Rapat Koordinasi Evaluasi APBDes Tingkat Kecamatan",
    pihakTerkait: "Kantor Camat Ciawigebang",
    pejabatAtauPenerima: "Kades & Sekdes Kadurama",
    status: "Disposisi Kades",
  },
  {
    id: "AG-M-002",
    tipe: "masuk",
    nomorSurat: "470/118/Disdukcapil/2026",
    tanggal: "09 Sep 2026",
    perihal: "Pemberitahuan Jadwal Perekaman KTP-El Keliling di Balai Desa",
    pihakTerkait: "Disdukcapil Kabupaten Kuningan",
    pejabatAtauPenerima: "Kasi Pelayanan Loket",
    status: "Terarsip",
  },
  {
    id: "AG-K-003",
    tipe: "keluar",
    nomorSurat: "470/050/Pem/IX/2026",
    tanggal: "08 Sep 2026",
    perihal: "Surat Keterangan Domisili Warga Tinggal",
    pihakTerkait: "Udi Hermanto (NIK: 3208151201880003)",
    pejabatAtauPenerima: "Kades Suhendra, S.Sos",
    status: "Terbit",
  },
];

export default function Home() {
  // Navigation & View States
  const [view, setView] = useState<"public" | "admin">("public");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(null);

  // Search & Public Filter
  const [siteSearchQuery, setSiteSearchQuery] = useState("");
  const [apbdesFilter, setApbdesFilter] = useState<"all" | "pendapatan" | "belanja">("all");

  // Admin Panel States
  const [adminTab, setAdminTab] = useState<"generator" | "agenda" | "residents">("generator");
  const [paperSize, setPaperSize] = useState<"F4" | "A4">("F4");
  const [authMode, setAuthMode] = useState<"wet" | "digital" | "scanned">("wet");

  // Generator Loket States (HANYA 3 JENIS SURAT SEMENTARA: SKU, SKTM, DOMISILI)
  const [searchQuery, setSearchQuery] = useState("3208152405900001");
  const [selectedResident, setSelectedResident] = useState<Resident>(RESIDENTS_DATA["3208152405900001"]);
  const [letterType, setLetterType] = useState<"SKU" | "SKTM" | "DOMISILI">("SKU");
  const [businessName, setBusinessName] = useState("Warung Sembako Barokah");
  const [businessField, setBusinessField] = useState("Perdagangan Kebutuhan Pokok dan Makanan Ringan");
  const [businessLocation, setBusinessLocation] = useState("Dusun Manis RT 02 / RW 01, Desa Kadurama");
  const [letterPurpose, setLetterPurpose] = useState("Kelengkapan Administrasi Permohonan Kredit Usaha Rakyat (KUR) BRI");
  const [selectedOfficial, setSelectedOfficial] = useState<"kades" | "sekdes">("kades");

  // Agenda & Residents States
  const [agendaList, setAgendaList] = useState<AgendaRecord[]>(INITIAL_AGENDA);
  const [agendaFilter, setAgendaFilter] = useState<"all" | "keluar" | "masuk">("all");
  const [residentDusunFilter, setResidentDusunFilter] = useState<string>("all");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // GSAP Animations Effect
  useEffect(() => {
    let ctx: any;
    const initGsap = async () => {
      try {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          // Hero Timeline Entrance
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.fromTo(
            "#hero-badge",
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.7 }
          )
            .fromTo(
              "#hero-title",
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8 },
              "-=0.4"
            )
            .fromTo(
              "#hero-desc",
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.7 },
              "-=0.5"
            )
            .fromTo(
              "#hero-actions",
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.7 },
              "-=0.5"
            )
            .fromTo(
              "#hero-gate-card",
              { opacity: 0, scale: 0.94, y: 30 },
              { opacity: 1, scale: 1, y: 0, duration: 1 },
              "-=0.6"
            );

          // APBDes ScrollTrigger Animation
          const apbdesEl = document.getElementById("apbdes");
          if (apbdesEl) {
            ScrollTrigger.create({
              trigger: apbdesEl,
              start: "top 75%",
              once: true,
              onEnter: () => {
                // Animate progress bar
                gsap.fromTo(
                  "#apbdes-progress-bar",
                  { width: "0%" },
                  { width: "82.4%", duration: 1.6, ease: "power2.out" }
                );

                // Animate numbers
                const pObj = { val: 0 };
                gsap.to(pObj, {
                  val: 1485240000,
                  duration: 2,
                  ease: "power2.out",
                  onUpdate: () => {
                    const el = document.getElementById("apbdes-pendapatan-val");
                    if (el) el.innerText = "Rp " + Math.floor(pObj.val).toLocaleString("id-ID");
                  },
                });

                const bObj = { val: 0 };
                gsap.to(bObj, {
                  val: 1462800000,
                  duration: 2,
                  ease: "power2.out",
                  onUpdate: () => {
                    const el = document.getElementById("apbdes-belanja-val");
                    if (el) el.innerText = "Rp " + Math.floor(bObj.val).toLocaleString("id-ID");
                  },
                });

                const sObj = { val: 0 };
                gsap.to(sObj, {
                  val: 82.4,
                  duration: 2,
                  ease: "power2.out",
                  onUpdate: () => {
                    const el = document.getElementById("apbdes-serapan-val");
                    if (el) el.innerText = sObj.val.toFixed(1) + "%";
                  },
                });

                // Animate 5 bidang cards
                gsap.fromTo(
                  ".apbdes-bidang-card",
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power2.out" }
                );
              },
            });
          }
        });
      } catch (err) {
        console.error("GSAP load error:", err);
      }
    };

    initGsap();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  // Handlers
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

  const handleLoginDemo = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    setView("admin");
  };

  const handleRegisterLetter = () => {
    const newRecord: AgendaRecord = {
      id: `AG-K-00${agendaList.length + 1}`,
      tipe: "keluar",
      nomorSurat:
        letterType === "SKU"
          ? "503/052/Pem/IX/2026"
          : letterType === "SKTM"
          ? "401/053/Kesra/IX/2026"
          : "470/055/Pem/IX/2026",
      tanggal: "13 Sep 2026",
      perihal: `Surat ${letterType} - ${selectedResident.nama}`,
      pihakTerkait: `${selectedResident.nama} (NIK: ${selectedResident.nik})`,
      pejabatAtauPenerima:
        selectedOfficial === "kades" ? "Kades Suhendra, S.Sos" : "Sekdes Dadang Kurnia",
      status: "Terbit",
    };
    setAgendaList([newRecord, ...agendaList]);
    alert(
      `Surat berhasil diregistrasi ke Buku Agenda!\nNomor Surat: ${newRecord.nomorSurat}\nSilakan klik "Cetak Dokumen Resmi" untuk mencetak ke kertas ${paperSize}.`
    );
  };

  const filteredAgenda = agendaList.filter((item) => {
    if (agendaFilter === "all") return true;
    return item.tipe === agendaFilter;
  });

  const filteredResidents = Object.values(RESIDENTS_DATA).filter((res) => {
    if (residentDusunFilter === "all") return true;
    return res.dusun === residentDusunFilter;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      {/* =================================================================== */}
      {/* NAVBAR 2-BARIS (SEJAJAR & RATA PRESISI, HOME ICON ONLY, SINGLE-LINE) */}
      {/* =================================================================== */}
      <header className="no-print sticky top-0 z-50 shadow-sm transition-all duration-200">
        {/* BARIS 1: TOP HEADER BAR (Putih Bersih - Presisi Max-W 7XL) */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
            {/* Logo & Identitas Desa */}
            <a href="#beranda" className="flex items-center gap-3 group flex-shrink-0">
              <div className="h-11 w-11 relative flex items-center justify-center flex-shrink-0">
                <Image
                  src="/kuningan-logo.png"
                  alt="Logo Kabupaten Kuningan"
                  width={44}
                  height={44}
                  className="object-contain drop-shadow-xs"
                  priority
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold uppercase tracking-wide text-[#003733] group-hover:text-[#009388] transition">
                    Pemerintah Desa Kadurama
                  </span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f7f5] text-[#009388] border border-[#009388]/20">
                    Mandiri
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Kecamatan Ciawigebang, Kabupaten Kuningan, Jawa Barat
                </div>
              </div>
            </a>

            {/* Sisi Kanan: Search Bar, Status Loket, dan Icon Login (Tanpa Text!) */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative hidden md:block w-64 lg:w-72">
                <input
                  type="text"
                  placeholder="Cari berita atau informasi..."
                  value={siteSearchQuery}
                  onChange={(e) => setSiteSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3.5 py-2 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#009388] bg-slate-50 text-slate-800"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

              {/* Status Loket */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e6f7f5] border border-[#009388]/20 text-[11px] text-[#005851] font-semibold whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[#009388] animate-pulse"></span>
                <span>Loket: 08.00 - 15.00 WIB</span>
              </div>

              {/* Icon Akses Admin (HANYA ICON TANPA TEKS, KHUSUS DESKTOP) */}
              <button
                onClick={() => setIsLoginModalOpen(true)}
                title="Akses Sistem Pelayanan Loket (Khusus Aparatur)"
                className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-[#e6f7f5] text-slate-600 hover:text-[#009388] transition border border-slate-200 hover:border-[#009388]/30 shadow-2xs"
              >
                <Lock className="w-4 h-4" />
              </button>

              {/* Mobile Hamburger Toggle (Tanpa Akses Login di Mobile) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                aria-label="Toggle menu mobile"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* BARIS 2: MAIN NAVIGATION BAR (Kuningan Teal - Presisi Max-W 7XL & Sebaris) */}
        <div className="bg-[#009388] text-white hidden lg:block border-t border-[#007b71]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between h-11 text-xs font-semibold whitespace-nowrap">
              <div className="flex items-center space-x-1">
                {/* Home: HANYA ICON RUMAH TANPA TEXT */}
                <a
                  href="#beranda"
                  title="Beranda"
                  className="px-3 py-2 rounded-md hover:bg-[#007b71] transition flex items-center justify-center"
                >
                  <HomeIcon className="w-4 h-4 text-[#eda50c]" />
                </a>

                {/* Dropdown 1: Profil Desa */}
                <div className="relative group">
                  <button className="px-3.5 py-2 rounded-md hover:bg-[#007b71] transition flex items-center gap-1 uppercase tracking-wider text-[11px] font-bold">
                    <span>PROFIL DESA</span>
                    <ChevronDown className="w-3 h-3 text-[#eda50c] group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  {/* Wrapper Bridge untuk Menghilangkan Deadzone Gap */}
                  <div className="absolute left-0 top-full pt-1.5 hidden group-hover:block z-50">
                    <div className="w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
                      <a href="#profil" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Sejarah Desa Kadurama
                      </a>
                      <a href="#profil" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Visi & Misi Kepala Desa
                      </a>
                      <a href="#lokasi-kantor" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Kondisi Geografis & Wilayah
                      </a>
                      <a href="#perangkat-desa" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Struktur Organisasi Pemdes
                      </a>
                      <a href="#apbdes" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Program Kerja Prioritas
                      </a>
                    </div>
                  </div>
                </div>

                {/* Dropdown 2: Pemerintahan */}
                <div className="relative group">
                  <button className="px-3.5 py-2 rounded-md hover:bg-[#007b71] transition flex items-center gap-1 uppercase tracking-wider text-[11px] font-bold">
                    <span>PEMERINTAHAN</span>
                    <ChevronDown className="w-3 h-3 text-[#eda50c] group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute left-0 top-full pt-1.5 hidden group-hover:block z-50">
                    <div className="w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
                      <a href="#perangkat-desa" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Pemerintahan Desa (Pamong)
                      </a>
                      <a href="#perangkat-desa" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Badan Permusyawaratan Desa (BPD)
                      </a>
                      <a href="#perangkat-desa" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Lembaga Pemberdayaan (LPM)
                      </a>
                      <a href="#perangkat-desa" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Tim Penggerak PKK Desa
                      </a>
                      <a href="#perangkat-desa" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs font-semibold text-[#009388]">
                        5 Kepala Dusun Kadurama
                      </a>
                    </div>
                  </div>
                </div>

                {/* Dropdown 3: LAYANAN (Disederhanakan dari Layanan Surat) */}
                <div className="relative group">
                  <button className="px-3.5 py-2 rounded-md hover:bg-[#007b71] transition flex items-center gap-1 uppercase tracking-wider text-[11px] font-bold">
                    <span>LAYANAN</span>
                    <ChevronDown className="w-3 h-3 text-[#eda50c] group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute left-0 top-full pt-1.5 hidden group-hover:block z-50">
                    <div className="w-60 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
                      <a href="#layanan-surat" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Surat Keterangan Usaha (SKU)
                      </a>
                      <a href="#layanan-surat" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Surat Keterangan Tidak Mampu (SKTM)
                      </a>
                      <a href="#layanan-surat" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Surat Keterangan Domisili
                      </a>
                      <div className="border-t border-slate-100 my-1"></div>
                      <a href="#layanan-surat" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs font-semibold text-[#009388]">
                        Alur 4 Langkah di Kantor Desa
                      </a>
                    </div>
                  </div>
                </div>

                {/* Dropdown 4: Statistik */}
                <div className="relative group">
                  <button className="px-3.5 py-2 rounded-md hover:bg-[#007b71] transition flex items-center gap-1 uppercase tracking-wider text-[11px] font-bold">
                    <span>STATISTIK</span>
                    <ChevronDown className="w-3 h-3 text-[#eda50c] group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute left-0 top-full pt-1.5 hidden group-hover:block z-50">
                    <div className="w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
                      <a href="#statistik" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Demografi 5 Dusun Kadurama
                      </a>
                      <a href="#statistik" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Perbandingan Jenis Kelamin
                      </a>
                      <a href="#statistik" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Kelompok Usia Penduduk
                      </a>
                      <a href="#statistik" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Mata Pencaharian Utama
                      </a>
                    </div>
                  </div>
                </div>

                {/* Dropdown 5: Transparansi APBDes */}
                <div className="relative group">
                  <button className="px-3.5 py-2 rounded-md hover:bg-[#007b71] transition flex items-center gap-1 uppercase tracking-wider text-[11px] font-bold">
                    <span>APBDES 2026</span>
                    <ChevronDown className="w-3 h-3 text-[#eda50c] group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute left-0 top-full pt-1.5 hidden group-hover:block z-50">
                    <div className="w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
                      <a href="#apbdes" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs font-semibold text-[#009388]">
                        Realisasi Serapan Anggaran 82.4%
                      </a>
                      <a href="#apbdes" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Penyelenggaraan Pemerintahan Desa
                      </a>
                      <a href="#apbdes" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Pelaksanaan Pembangunan Desa
                      </a>
                      <a href="#apbdes" className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs">
                        Pembinaan & Pemberdayaan Warga
                      </a>
                    </div>
                  </div>
                </div>

                {/* Link Berita */}
                <a
                  href="#berita"
                  className="px-3.5 py-2 rounded-md hover:bg-[#007b71] transition uppercase tracking-wider text-[11px] font-bold"
                >
                  KABAR DESA
                </a>

                {/* Link Kontak */}
                <a
                  href="#lokasi-kantor"
                  className="px-3.5 py-2 rounded-md hover:bg-[#007b71] transition uppercase tracking-wider text-[11px] font-bold"
                >
                  KONTAK
                </a>
              </div>

              <div className="text-[11px] text-[#eda50c] font-bold flex items-center gap-1.5">
                <span>Melesat Ngudag Jaman, Ngakar Kuat Purwadaksi</span>
              </div>
            </nav>
          </div>
        </div>

        {/* MOBILE DRAWER (Hanya Kanal Informasi Publik, TIDAK ADA AKSES ADMIN) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <a
              href="#beranda"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388] text-sm"
            >
              Beranda
            </a>

            <div>
              <button
                onClick={() =>
                  setActiveMobileSubmenu(activeMobileSubmenu === "profil" ? null : "profil")
                }
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] text-sm text-left"
              >
                <span>Profil Desa</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeMobileSubmenu === "profil" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeMobileSubmenu === "profil" && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg text-xs">
                  <a
                    href="#profil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-[#009388]"
                  >
                    Sejarah & Visi Misi
                  </a>
                  <a
                    href="#lokasi-kantor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-[#009388]"
                  >
                    Kondisi Geografis & Wilayah
                  </a>
                  <a
                    href="#perangkat-desa"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-[#009388]"
                  >
                    Struktur Organisasi Pemdes
                  </a>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() =>
                  setActiveMobileSubmenu(activeMobileSubmenu === "layanan" ? null : "layanan")
                }
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] text-sm text-left"
              >
                <span>Layanan</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeMobileSubmenu === "layanan" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeMobileSubmenu === "layanan" && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg text-xs">
                  <a
                    href="#layanan-surat"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-[#009388]"
                  >
                    Surat Keterangan Usaha (SKU)
                  </a>
                  <a
                    href="#layanan-surat"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-[#009388]"
                  >
                    Surat Keterangan Tidak Mampu (SKTM)
                  </a>
                  <a
                    href="#layanan-surat"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-[#009388]"
                  >
                    Surat Keterangan Domisili
                  </a>
                </div>
              )}
            </div>

            <a
              href="#statistik"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388] text-sm"
            >
              Statistik Kependudukan
            </a>
            <a
              href="#perangkat-desa"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388] text-sm"
            >
              Pamong & Aparatur Desa
            </a>
            <a
              href="#apbdes"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388] text-sm"
            >
              Transparansi APBDes 2026
            </a>
            <a
              href="#berita"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388] text-sm"
            >
              Kabar Desa
            </a>
            <a
              href="#lokasi-kantor"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388] text-sm"
            >
              Kontak & Lokasi Kantor
            </a>
          </div>
        )}
      </header>

      {/* =================================================================== */}
      {/* MODAL LOGIN APARATUR DESA (DESKTOP ONLY)                           */}
      {/* =================================================================== */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    Otentikasi Aparatur Pemdes
                  </h3>
                  <p className="text-[11px] text-slate-500">Panel Pelayanan Loket & Buku Agenda</p>
                </div>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  NIP / Nama Pengguna Operator
                </label>
                <input
                  type="text"
                  defaultValue="19820719 200902 1 003"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Jabatan Loket
                </label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]">
                  <option value="kasi">Kasi Pelayanan Loket - Budi Santoso</option>
                  <option value="sekdes">Sekretaris Desa - Dadang Kurnia</option>
                  <option value="kades">Kepala Desa - Suhendra, S.Sos</option>
                </select>
              </div>

              <div className="p-3 bg-[#e6f7f5] rounded-xl border border-[#009388]/20 flex items-start gap-2.5 text-[11px] text-[#005851]">
                <ShieldCheck className="w-4 h-4 text-[#009388] flex-shrink-0 mt-0.5" />
                <span>
                  Akses ini khusus aparatur loket kantor desa Kadurama untuk membuat surat keterangan resmi dan mengelola buku agenda terpadu.
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
              >
                Batal
              </button>
              <button
                onClick={handleLoginDemo}
                className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
              >
                <span>Masuk Cepat Demo Loket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW 1: PORTAL PUBLIK DESA KADURAMA                                */}
      {/* =================================================================== */}
      {view === "public" ? (
        <main className="flex-1">
          {/* HERO SECTION DENGAN ORNAMEN GERBANG KUNINGAN & NARASI ELEGAN */}
          <section
            id="beranda"
            className="min-h-[calc(100vh-120px)] flex items-center relative overflow-hidden bg-gradient-to-b from-slate-900 via-[#003733] to-[#002220] text-white py-16 lg:py-20"
          >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#eda50c_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

            {/* Subtle Watermark Gerbang Kuningan di Background Pojok Kanan Bawah */}
            <div className="absolute -right-10 -bottom-8 opacity-10 pointer-events-none hidden xl:block w-[540px] h-[200px] select-none">
              <Image
                src="/kuningan-gate-transparent.png"
                alt="Watermark Gerbang Kuningan"
                width={540}
                height={200}
                className="object-contain filter brightness-150"
              />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                {/* Kolom Kiri: Narasi Kepemimpinan & Pelayanan (Col 7) */}
                <div className="lg:col-span-7">
                  {/* Badge Identitas */}
                  <div
                    id="hero-badge"
                    className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#009388]/30 border border-[#009388]/40 text-[#eda50c] text-xs font-bold mb-6"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#eda50c]" />
                    <span>Portal Resmi Desa Kadurama • Kecamatan Ciawigebang</span>
                  </div>

                  {/* Headline Utama */}
                  <h1
                    id="hero-title"
                    className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
                  >
                    Tata Kelola Desa Modern, <br className="hidden sm:inline" />
                    <span className="text-[#eda50c]">Layanan Berintegritas</span> & Transparan
                  </h1>

                  {/* Subtext Ringkas */}
                  <p
                    id="hero-desc"
                    className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed"
                  >
                    Pusat keterbukaan informasi publik, transparansi anggaran APBDes, profil kepemimpinan desa, dan panduan lengkap persyaratan pengurusan berkas administrasi langsung di kantor balai desa.
                  </p>

                  {/* Tombol Aksi Hero */}
                  <div id="hero-actions" className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                      href="#layanan-surat"
                      className="px-6 py-3.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-sm transition shadow-lg shadow-[#009388]/20 flex items-center justify-center gap-2 group"
                    >
                      <span>Lihat Syarat Berkas Layanan</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                      href="#apbdes"
                      className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition flex items-center justify-center gap-2"
                    >
                      <Building2 className="w-4 h-4 text-[#eda50c]" />
                      <span>Transparansi APBDes 2026</span>
                    </a>
                  </div>

                  {/* Notice Box Wajib Datang Langsung ke Balai Desa */}
                  <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5 max-w-xl">
                    <Clock className="w-5 h-5 text-[#eda50c] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-white">Pelayanan Langsung di Kantor Desa:</strong> Warga tetap dilayani langsung di Balai Desa Kadurama. Silakan cek syarat dokumen di bawah agar berkas lengkap dalam satu kali kunjungan.
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Card Showcase Ornamen Gerbang Kuningan Asri (Col 5) */}
                <div className="lg:col-span-5 relative" id="hero-gate-card">
                  {/* Subtle Ambient Glow */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#009388]/30 via-[#eda50c]/20 to-transparent rounded-3xl blur-2xl pointer-events-none"></div>

                  <div className="relative bg-gradient-to-b from-white/15 via-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/20 shadow-2xl overflow-hidden group">
                    {/* Top Status Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#eda50c] animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#eda50c]">
                          Status IDM: Desa Mandiri
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                        Skor 0.8942
                      </span>
                    </div>

                    {/* Landmark Gate Illustration with Golden Horses (Cropped & Precise) */}
                    <div className="my-5 relative flex items-center justify-center overflow-hidden rounded-2xl bg-white/5 p-3 border border-white/10">
                      <Image
                        src="/kuningan-gate-transparent.png"
                        alt="Gerbang Kehormatan Kuda Kuningan Asri"
                        width={480}
                        height={175}
                        className="object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700"
                        priority
                      />
                    </div>

                    {/* Card Footer Narrative */}
                    <div className="pt-3 border-t border-white/10 text-center">
                      <div className="text-xs font-bold text-white uppercase tracking-wider">
                        Gerbang Kehormatan Kuningan Asri
                      </div>
                      <div className="text-[11px] text-[#eda50c] font-semibold mt-0.5 italic">
                        "Melesat Ngudag Jaman, Ngakar Kuat Purwadaksi"
                      </div>
                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                        Simbol keteguhan dan kegigihan masyarakat Desa Kadurama dalam membangun kemandirian ekonomi dan pelayanan publik terdepan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 1: PANDUAN SYARAT LAYANAN (3 JENIS SURAT SEMENTARA)     */}
          {/* =============================================================== */}
          <section id="layanan-surat" className="py-20 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3 py-1 rounded-full border border-[#009388]/20">
                  Pelayanan Administrasi Loket
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                  Panduan Persyaratan Berkas Surat Resmi
                </h2>
                <p className="text-sm text-slate-600 mt-2">
                  Pastikan membawa dokumen pendukung berikut saat datang ke kantor Balai Desa Kadurama agar proses penerbitan surat selesai dalam waktu singkat.
                </p>
              </div>

              {/* 3 Jenis Surat Utama: SKU, SKTM, DOMISILI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* SKU */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#009388]/50 transition-all hover:shadow-md">
                  <div className="w-11 h-11 rounded-2xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center font-bold text-sm mb-4">
                    SKU
                  </div>
                  <h3 className="font-bold text-slate-950 text-lg">Surat Keterangan Usaha</h3>
                  <p className="text-xs text-slate-600 mt-1 mb-5">
                    Keperluan perbankan, pengajuan KUR, izin usaha mikro, atau bantuan modal UMKM.
                  </p>
                  <div className="text-xs space-y-2.5 border-t border-slate-200 pt-5">
                    <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Syarat Dokumen:</div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Fotokopi KTP Pemohon</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Fotokopi Kartu Keluarga (KK)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Pengantar RT & RW Setempat</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Foto Bukti Kegiatan Usaha</span>
                    </div>
                  </div>
                </div>

                {/* SKTM */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#009388]/50 transition-all hover:shadow-md">
                  <div className="w-11 h-11 rounded-2xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center font-bold text-sm mb-4">
                    SKTM
                  </div>
                  <h3 className="font-bold text-slate-950 text-lg">Surat Keterangan Tidak Mampu</h3>
                  <p className="text-xs text-slate-600 mt-1 mb-5">
                    Keperluan beasiswa KIP Kuliah, keringanan biaya RS, atau pengajuan bantuan DTKS.
                  </p>
                  <div className="text-xs space-y-2.5 border-t border-slate-200 pt-5">
                    <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Syarat Dokumen:</div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>KTP & KK Pemohon Asli/Copy</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Pengantar RT & RW Kategori Pra-KS</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Surat Pernyataan Tidak Mampu</span>
                    </div>
                  </div>
                </div>

                {/* DOMISILI */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#009388]/50 transition-all hover:shadow-md">
                  <div className="w-11 h-11 rounded-2xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center font-bold text-sm mb-4">
                    DOM
                  </div>
                  <h3 className="font-bold text-slate-950 text-lg">Keterangan Domisili</h3>
                  <p className="text-xs text-slate-600 mt-1 mb-5">
                    Bukti bertempat tinggal untuk warga tetap maupun warga tinggal sementara.
                  </p>
                  <div className="text-xs space-y-2.5 border-t border-slate-200 pt-5">
                    <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Syarat Dokumen:</div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Fotokopi KTP & KK Asal</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Pengantar RT & RW Dusun Setempat</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Surat Bukti Sewa / Pernyataan Tinggal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alur 4 Langkah di Balai Desa */}
              <div className="mt-12 bg-gradient-to-r from-slate-900 to-[#003733] text-white rounded-3xl p-8 sm:p-10">
                <h3 className="text-lg sm:text-xl font-extrabold text-white mb-6">
                  Alur 4 Langkah Pelayanan Surat di Kantor Balai Desa Kadurama
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#eda50c] text-slate-950 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Bawa Berkas</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Siapkan fotokopi KTP, KK, dan pengantar RT/RW sesuai jenis surat.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#eda50c] text-slate-950 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Verifikasi NIK</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Petugas loket memindai NIK di sistem terpadu kependudukan desa.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#eda50c] text-slate-950 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Cetak Instan</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Surat digenerate dengan nomor register resmi dan ditandatangani.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#eda50c] text-slate-950 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Selesai & Legal</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Dokumen berstempel resmi dan QR code keabsahan siap digunakan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 2: DATA & STATISTIK KEPENDUDUKAN (SECTION TERSENDIRI)  */}
          {/* =============================================================== */}
          <section id="statistik" className="py-20 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3 py-1 rounded-full border border-[#009388]/20">
                    Statistik Kependudukan
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                    Demografi Penduduk Desa Kadurama
                  </h2>
                  <p className="text-sm text-slate-600 mt-2">
                    Distribusi kependudukan resmi berdasarkan pendataan semester berjalan 2026.
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs">
                  Pembaruan Terakhir: September 2026
                </div>
              </div>

              {/* 4 Kartu Metrik Utama */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Total Penduduk
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#003733] mt-2">3.842</div>
                  <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#009388]" />
                    <span>Jiwa tercatat aktif</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Kepala Keluarga (KK)
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#009388] mt-2">1.185</div>
                  <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#009388]" />
                    <span>Terdata di Disdukcapil</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Laki-Laki
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">1.948</div>
                  <div className="text-xs text-slate-500 mt-2">50.7% proporsi total</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Perempuan
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">1.894</div>
                  <div className="text-xs text-slate-500 mt-2">49.3% proporsi total</div>
                </div>
              </div>

              {/* Distribusi 5 Dusun Kuningan */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-950">
                      Sebaran Penduduk per Dusun Tradisional
                    </h3>
                    <p className="text-xs text-slate-500">
                      Desa Kadurama terdiri dari 5 dusun dengan karakteristik dan potensi agraris masing-masing.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-[#009388] bg-[#e6f7f5] px-3 py-1.5 rounded-lg">
                    5 Dusun • 18 RT • 4 RW
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <span>Dusun Manis (Pusat Pemerintahan & Pasar)</span>
                      <span>920 Jiwa (24%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#009388] rounded-full" style={{ width: "24%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <span>Dusun Pahing (Pertanian Padi & Hortikultura)</span>
                      <span>845 Jiwa (22%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#009388] rounded-full" style={{ width: "22%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <span>Dusun Puhun (Perkebunan & Kerajinan)</span>
                      <span>735 Jiwa (19%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#009388] rounded-full" style={{ width: "19%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <span>Dusun Wage (Kawasan Pemukiman & Pendidikan)</span>
                      <span>680 Jiwa (18%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#009388] rounded-full" style={{ width: "18%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <span>Dusun Kliwon (Peternakan Rakyat & Perikanan)</span>
                      <span>662 Jiwa (17%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#009388] rounded-full" style={{ width: "17%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 3: APARATUR PEMERINTAHAN DESA (PERSIS DARI INDEX.HTML)  */}
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
                <div className="text-xs text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200">
                  Kecamatan Ciawigebang, Kabupaten Kuningan
                </div>
              </div>

              {/* Spotlight Kepala Desa (Large Portrait Horizontal Bento) */}
              <div className="mb-10 bg-gradient-to-r from-[#003733] via-[#005851] to-[#009388] text-white rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border-2 border-[#eda50c]/60 shadow-2xl group bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                      alt="Kepala Desa Kadurama"
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#eda50c] text-slate-950 uppercase tracking-wider">
                        Kepala Desa
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <div>
                    <div className="text-[#eda50c] text-xs font-bold uppercase tracking-wider">
                      Pimpinan Pemerintah Desa
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 uppercase">
                      SUHENDRA, S.Sos
                    </h3>
                    <p className="text-xs font-mono text-emerald-200 mt-0.5">NIP. 19780412 200501 1 008</p>
                  </div>

                  <blockquote className="text-sm sm:text-base text-emerald-100 italic border-l-2 border-[#eda50c] pl-4 py-1 leading-relaxed">
                    "Kami berkomitmen melayani warga Kadurama dengan tulus, transparan dalam pengelolaan dana APBDes, dan mempermudah seluruh urusan administrasi persuratan warga."
                  </blockquote>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/15 text-xs text-emerald-100">
                    <div>
                      <span className="text-emerald-300 block text-[11px]">Tupoksi</span>
                      <span className="font-semibold text-white">Penyelenggaraan Pemdes</span>
                    </div>
                    <div>
                      <span className="text-emerald-300 block text-[11px]">Lokasi Kerja</span>
                      <span className="font-semibold text-white">Kantor Balai Desa</span>
                    </div>
                    <div>
                      <span className="text-emerald-300 block text-[11px]">Wilayah Koordinasi</span>
                      <span className="font-semibold text-[#eda50c]">5 Dusun & 18 RT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perangkat Sekretariat & Pelaksana Teknis (Large Portrait Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card Sekdes */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:border-[#009388] hover:shadow-lg transition">
                  <div className="relative h-72 overflow-hidden bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
                      alt="Sekretaris Desa"
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-[#009388] px-2.5 py-0.5 rounded">
                        Sekretariat
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-extrabold text-slate-900 text-base uppercase">DADANG KURNIA</h4>
                    <div className="text-xs font-semibold text-[#009388] mt-0.5">Sekretaris Desa</div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Koordinator administrasi umum, kearsipan persuratan, dan penyusunan regulasi desa.
                    </p>
                  </div>
                </div>

                {/* Card Kasi Pelayanan */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:border-[#009388] hover:shadow-lg transition">
                  <div className="relative h-72 overflow-hidden bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80"
                      alt="Kasi Pelayanan"
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-bold text-slate-950 uppercase tracking-wider bg-[#eda50c] px-2.5 py-0.5 rounded">
                        Loket Pelayanan
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-extrabold text-slate-900 text-base uppercase">BUDI SANTOSO</h4>
                    <div className="text-xs font-semibold text-[#009388] mt-0.5">Kasi Pelayanan Umum</div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Petugas loket penerbitan surat keterangan kependudukan dan pencatatan warga.
                    </p>
                  </div>
                </div>

                {/* Card Kasi Pemerintahan */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:border-[#009388] hover:shadow-lg transition">
                  <div className="relative h-72 overflow-hidden bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80"
                      alt="Kasi Pemerintahan"
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-slate-700 px-2.5 py-0.5 rounded">
                        Tata Praja
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-extrabold text-slate-900 text-base uppercase">IWAN RIDWAN</h4>
                    <div className="text-xs font-semibold text-[#009388] mt-0.5">Kasi Pemerintahan</div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Pengelolaan administrasi data warga, batas wilayah desa, dan ketentraman warga.
                    </p>
                  </div>
                </div>

                {/* Card Kaur Keuangan */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:border-[#009388] hover:shadow-lg transition">
                  <div className="relative h-72 overflow-hidden bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80"
                      alt="Kaur Keuangan"
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-slate-700 px-2.5 py-0.5 rounded">
                        Bendahara
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-extrabold text-slate-900 text-base uppercase">M. SIGAP, S.Kom</h4>
                    <div className="text-xs font-semibold text-[#009388] mt-0.5">Kaur Keuangan (Bendahara)</div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
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
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="font-bold text-slate-900 text-sm">Heryadi J.</div>
                    <div className="text-[#009388] text-[11px] font-semibold">Kadus Manis</div>
                    <div className="text-slate-500 text-[10px] mt-1">RT 01 - RT 03 / RW 01</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="font-bold text-slate-900 text-sm">Abdul Azis</div>
                    <div className="text-[#009388] text-[11px] font-semibold">Kadus Pahing</div>
                    <div className="text-slate-500 text-[10px] mt-1">RT 04 - RT 06 / RW 02</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="font-bold text-slate-900 text-sm">Holiludin</div>
                    <div className="text-[#009388] text-[11px] font-semibold">Kadus Puhun</div>
                    <div className="text-slate-500 text-[10px] mt-1">RT 07 - RT 09 / RW 03</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="font-bold text-slate-900 text-sm">Risnayadi</div>
                    <div className="text-[#009388] text-[11px] font-semibold">Kadus Wage</div>
                    <div className="text-slate-500 text-[10px] mt-1">RT 10 - RT 11 / RW 04</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="font-bold text-slate-900 text-sm">Udi Hermanto</div>
                    <div className="text-[#009388] text-[11px] font-semibold">Kadus Kliwon</div>
                    <div className="text-slate-500 text-[10px] mt-1">RT 12 / RW 04</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 4: TRANSPARANSI APBDES 2026 (DENGAN ANIMASI GSAP)      */}
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
                  <p className="text-sm text-slate-600 mt-2">
                    Laporan serapan pendapatan, belanja, dan pembiayaan desa untuk mewujudkan tata kelola akuntabel.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs">
                  <button
                    onClick={() => setApbdesFilter("all")}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                      apbdesFilter === "all"
                        ? "bg-[#009388] text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Semua
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
                    Belanja
                  </button>
                </div>
              </div>

              {/* 3 Cockpit Cards Utama (GSAP Animated) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#009388]">
                    Total Pendapatan Desa
                  </div>
                  <div
                    id="apbdes-pendapatan-val"
                    className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2 font-mono"
                  >
                    Rp 1.485.240.000
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Dana Desa (DD), ADD, PADes, dan Bagi Hasil Pajak.
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#eda50c]">
                    Total Belanja Desa
                  </div>
                  <div
                    id="apbdes-belanja-val"
                    className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2 font-mono"
                  >
                    Rp 1.462.800.000
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Realisasi serapan belanja per triwulan III berjalan.
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Persentase Serapan
                  </div>
                  <div
                    id="apbdes-serapan-val"
                    className="text-2xl sm:text-3xl font-extrabold text-[#009388] mt-2 font-mono"
                  >
                    82.4%
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3 overflow-hidden">
                    <div
                      id="apbdes-progress-bar"
                      className="bg-[#009388] h-2.5 rounded-full transition-all"
                      style={{ width: "82.4%" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Grid 5 Bidang Belanja & Unduh PDF (Sesuai index.html & Staggered GSAP) */}
              {(apbdesFilter === "all" || apbdesFilter === "belanja") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Bidang 1 */}
                  <div className="apbdes-bidang-card p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#009388] uppercase bg-[#e6f7f5] px-2 py-0.5 rounded">
                        Bidang 1
                      </span>
                      <span className="text-xs font-bold text-[#009388]">85% Terpakai</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-2">Penyelenggaraan Pemdes</h4>
                    <p className="text-xs text-slate-500 mt-1">Siltap pamong, operasional kantor balai desa, kearsipan, dan BPD.</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                      <span className="text-slate-500">Pagu:</span>
                      <span className="font-bold text-slate-900">Rp 485.600.000</span>
                    </div>
                  </div>

                  {/* Bidang 2 */}
                  <div className="apbdes-bidang-card p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#009388] uppercase bg-[#e6f7f5] px-2 py-0.5 rounded">
                        Bidang 2
                      </span>
                      <span className="text-xs font-bold text-[#009388]">78% Terpakai</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-2">Pelaksanaan Pembangunan</h4>
                    <p className="text-xs text-slate-500 mt-1">Rabat beton jalan Dusun Pahing, drainase pemukiman, dan posyandu.</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                      <span className="text-slate-500">Pagu:</span>
                      <span className="font-bold text-slate-900">Rp 562.400.000</span>
                    </div>
                  </div>

                  {/* Bidang 3 */}
                  <div className="apbdes-bidang-card p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#009388] uppercase bg-[#e6f7f5] px-2 py-0.5 rounded">
                        Bidang 3
                      </span>
                      <span className="text-xs font-bold text-[#009388]">72% Terpakai</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-2">Pembinaan Kemasyarakatan</h4>
                    <p className="text-xs text-slate-500 mt-1">Pembinaan Karang Taruna, Linmas, keagamaan, dan kerukunan warga.</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                      <span className="text-slate-500">Pagu:</span>
                      <span className="font-bold text-slate-900">Rp 148.200.000</span>
                    </div>
                  </div>

                  {/* Bidang 4 */}
                  <div className="apbdes-bidang-card p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#009388] uppercase bg-[#e6f7f5] px-2 py-0.5 rounded">
                        Bidang 4
                      </span>
                      <span className="text-xs font-bold text-[#009388]">80% Terpakai</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-2">Pemberdayaan Masyarakat</h4>
                    <p className="text-xs text-slate-500 mt-1">Pelatihan kelompok tani, ketahanan pangan hewani, dan BUMDes.</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                      <span className="text-slate-500">Pagu:</span>
                      <span className="font-bold text-slate-900">Rp 195.600.000</span>
                    </div>
                  </div>

                  {/* Bidang 5 */}
                  <div className="apbdes-bidang-card p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#009388] uppercase bg-[#e6f7f5] px-2 py-0.5 rounded">
                        Bidang 5
                      </span>
                      <span className="text-xs font-bold text-[#009388]">90% Terpakai</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-2">Bencana & Mendesak</h4>
                    <p className="text-xs text-slate-500 mt-1">Penyaluran BLT Dana Desa (BLT-DD) bagi keluarga pra-sejahtera.</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                      <span className="text-slate-500">Pagu:</span>
                      <span className="font-bold text-slate-900">Rp 71.000.000</span>
                    </div>
                  </div>

                  {/* Unduh Dokumen PDF */}
                  <div className="apbdes-bidang-card p-5 rounded-2xl bg-[#003733] text-white flex flex-col justify-between shadow-2xs">
                    <div>
                      <span className="text-[10px] font-bold text-[#eda50c] uppercase tracking-wider">
                        Dokumen Publik
                      </span>
                      <h4 className="font-bold text-white text-sm mt-1">Salinan Perdes APBDes 2026</h4>
                      <p className="text-xs text-emerald-100/80 mt-1">
                        Unduh berkas PDF resmi rincian anggaran yang disahkan BPD.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        alert("Mengunduh salinan resmi Perdes APBDes Kadurama 2026 format PDF...")
                      }
                      className="mt-4 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white text-xs font-bold transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Dokumen PDF</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 5: KABAR & BERITA DESA KADURAMA (SESUAI INDEX.HTML)     */}
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
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      Kepala Desa bersama BPD dan tokoh masyarakat dari 5 dusun menyepakati prioritas pembangunan jalan tani dan drainase lingkungan untuk tahun depan.
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs font-semibold text-[#009388]">
                      <span>Baca Selengkapnya</span>
                      <span>→</span>
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
                    <div className="text-[11px] text-slate-500 mb-2">08 September 2026 • Pendopo Desa</div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-[#009388] transition line-clamp-2">
                      Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Triwulan III Tepat Sasaran
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      Sebanyak 65 Keluarga Penerima Manfaat (KPM) dari lima dusun menerima bantuan tunai untuk pemenuhan kebutuhan pokok keluarga.
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs font-semibold text-[#009388]">
                      <span>Baca Selengkapnya</span>
                      <span>→</span>
                    </div>
                  </div>
                </article>

                {/* Berita 3 */}
                <article className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden hover:shadow-md transition group">
                  <div className="h-48 bg-slate-200 overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80"
                      alt="Panen Raya"
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
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      Program ketahanan pangan desa berhasil meningkatkan produktivitas gabah kelompok tani Dusun Manis melalui metode pemupukan organik terpadu.
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs font-semibold text-[#009388]">
                      <span>Baca Selengkapnya</span>
                      <span>→</span>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 6: JADWAL & LOKASI KANTOR DESA (SESUAI INDEX.HTML)      */}
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
                      <span className="font-bold text-slate-800">Alamat:</span>
                      <span>Jl. Raya Desa Kadurama No. 12, Kec. Ciawigebang, Kab. Kuningan 45591</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">Email:</span>
                      <span>pemdes@kadurama.desa.id</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">WhatsApp:</span>
                      <span>+62 821-2345-6789</span>
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#009388]"></span>
                    <span>Jadwal Loket Pelayanan Desa</span>
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

          {/* =============================================================== */}
          {/* FOOTER RESMI (3-KOLOM SESUAI INDEX.HTML & TASTE SKILL)          */}
          {/* =============================================================== */}
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
                    Kecamatan Ciawigebang, Kabupaten Kuningan, Jawa Barat 45591.
                    <br />
                    Pos-el: pemdes@kadurama.desa.id | WhatsApp: +62 821-2345-6789
                  </p>
                </div>

                <div>
                  <h5 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">
                    Akses Halaman
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    <a href="#beranda" className="hover:text-[#eda50c] transition">Beranda</a>
                    <a href="#layanan-surat" className="hover:text-[#eda50c] transition">Syarat Layanan</a>
                    <a href="#statistik" className="hover:text-[#eda50c] transition">Statistik Warga</a>
                    <a href="#perangkat-desa" className="hover:text-[#eda50c] transition">Aparatur Desa</a>
                    <a href="#apbdes" className="hover:text-[#eda50c] transition">APBDes 2026</a>
                    <a href="#berita" className="hover:text-[#eda50c] transition">Kabar Desa</a>
                  </div>
                </div>

                <div>
                  <h5 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">
                    Pelayanan Kantor Balai Desa
                  </h5>
                  <p className="text-slate-400 leading-relaxed mb-3">
                    Pelayanan tatap muka ramah warga, terintegrasi dengan basis data kependudukan 5 dusun, dan penomoran surat resmi otomatis.
                  </p>
                  <div className="text-[11px] text-[#eda50c] font-semibold">
                    Senin - Jumat: 08.00 - 15.00 WIB
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
                <div>(c) 2026 Pemerintah Desa Kadurama, Kabupaten Kuningan. Seluruh hak cipta dilindungi.</div>
                <div className="italic text-[#eda50c]">Melesat Ngudag Jaman, Ngakar Kuat Purwadaksi</div>
              </div>
            </div>
          </footer>
        </main>
      ) : (
        /* =================================================================== */
        /* VIEW 2: BACKPANEL LOKET PERSURATAN & BUKU AGENDA (DESKTOP PANEL)   */
        /* =================================================================== */
        <div className="flex-1 bg-slate-100 flex">
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
                  Navigasi Pelayanan
                </div>

                <button
                  onClick={() => setAdminTab("generator")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                    adminTab === "generator"
                      ? "bg-[#009388] text-white shadow-sm"
                      : "text-emerald-100 hover:bg-[#005851]"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Buat & Cetak Surat</span>
                </button>

                <button
                  onClick={() => setAdminTab("agenda")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                    adminTab === "agenda"
                      ? "bg-[#009388] text-white shadow-sm"
                      : "text-emerald-100 hover:bg-[#005851]"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Buku Agenda (Masuk/Keluar)</span>
                </button>

                <button
                  onClick={() => setAdminTab("residents")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                    adminTab === "residents"
                      ? "bg-[#009388] text-white shadow-sm"
                      : "text-emerald-100 hover:bg-[#005851]"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Data Kependudukan (5 Dusun)</span>
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
                className="mt-3 w-full py-2 rounded-xl bg-[#005851] hover:bg-[#004741] text-emerald-100 hover:text-white text-[11px] font-bold transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Kembali ke Portal Warga</span>
              </button>
            </div>
          </aside>

          {/* Konten Utama Backpanel */}
          <main className="flex-1 p-6 lg:p-8 max-w-[1400px]">
            {/* ============================================================ */}
            {/* TAB 1: GENERATOR PERSURATAN (3 SURAT SEMENTARA: SKU, SKTM, DOM) */}
            {/* ============================================================ */}
            {adminTab === "generator" && (
              <>
                <div className="no-print flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Pelayanan & Generator Surat Warga di Loket
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Cari data NIK warga terdaftar, tentukan jenis surat (SKU / SKTM / Domisili), pilih format kertas (F4/A4), dan mode otorisasi.
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

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Form Panel (5 Cols) */}
                  <div className="no-print xl:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                    {/* Pencarian NIK */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        1. Cari Warga Berdasarkan NIK atau Nama
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => handleSearchResident(e.target.value)}
                          placeholder="Ketik NIK 16 digit atau Nama (Asep / Siti / Udi)"
                          className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                      </div>
                    </div>

                    {/* Informasi Warga Terpilih */}
                    <div className="p-3.5 bg-[#e6f7f5] border border-[#009388]/30 rounded-xl text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-950">{selectedResident.nama}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#009388] text-white">
                          Dusun {selectedResident.dusun}
                        </span>
                      </div>
                      <div className="text-slate-600 flex justify-between">
                        <span>NIK:</span>
                        <span className="font-mono text-slate-900">{selectedResident.nik}</span>
                      </div>
                      <div className="text-slate-600 flex justify-between">
                        <span>No. KK:</span>
                        <span className="font-mono text-slate-900">{selectedResident.noKk}</span>
                      </div>
                      <div className="text-slate-600 flex justify-between">
                        <span>Pekerjaan:</span>
                        <span className="text-slate-900">{selectedResident.pekerjaan}</span>
                      </div>
                      <div className="text-slate-600 flex justify-between">
                        <span>Alamat:</span>
                        <span className="text-slate-900">{selectedResident.alamat}</span>
                      </div>
                    </div>

                    {/* Template Surat (3 SURAT SEMENTARA: SKU, SKTM, DOMISILI) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        2. Pilih Template Surat (3 Jenis Sementara)
                      </label>
                      <select
                        value={letterType}
                        onChange={(e) => setLetterType(e.target.value as any)}
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                      >
                        <option value="SKU">Surat Keterangan Usaha (SKU)</option>
                        <option value="SKTM">Surat Keterangan Tidak Mampu (SKTM)</option>
                        <option value="DOMISILI">Surat Keterangan Domisili</option>
                      </select>
                    </div>

                    {/* Toggle Ukuran Kertas: F4 vs A4 */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        3. Ukuran Kertas Printer Loket
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaperSize("F4")}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                            paperSize === "F4"
                              ? "bg-[#009388] text-white border-[#009388] shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>F4 / Folio (215 x 330 mm)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaperSize("A4")}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                            paperSize === "A4"
                              ? "bg-[#009388] text-white border-[#009388] shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>A4 Standar (210 x 297 mm)</span>
                        </button>
                      </div>
                    </div>

                    {/* Pilihan Otorisasi & Format */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        4. Mode Otorisasi Dokumen
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] font-semibold">
                        <button
                          type="button"
                          onClick={() => setAuthMode("wet")}
                          className={`p-2 rounded-xl border transition ${
                            authMode === "wet"
                              ? "bg-[#003733] text-white border-[#003733]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          TTD Basah
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuthMode("digital")}
                          className={`p-2 rounded-xl border transition ${
                            authMode === "digital"
                              ? "bg-[#003733] text-white border-[#003733]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          TTD Digital
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuthMode("scanned")}
                          className={`p-2 rounded-xl border transition ${
                            authMode === "scanned"
                              ? "bg-[#003733] text-white border-[#003733]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          Arsip Mode Scan
                        </button>
                      </div>
                    </div>

                    {/* Parameter Dinamis SKU */}
                    {letterType === "SKU" && (
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Nama Usaha Warga
                          </label>
                          <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Bidang / Jenis Usaha
                          </label>
                          <input
                            type="text"
                            value={businessField}
                            onChange={(e) => setBusinessField(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Lokasi Tempat Usaha
                          </label>
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
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Keperluan Pengurusan Surat
                      </label>
                      <input
                        type="text"
                        value={letterPurpose}
                        onChange={(e) => setLetterPurpose(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Pejabat Penandatangan
                      </label>
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
                      onClick={handleRegisterLetter}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm transition"
                    >
                      Registrasi ke Agenda & Siapkan Cetak
                    </button>
                  </div>

                  {/* Kolom Preview Kertas F4 / A4 (7 Cols) */}
                  <div className="xl:col-span-7">
                    <div className="no-print mb-2 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">
                        Pratinjau Kertas Format Resmi (Kertas {paperSize} • Skala 100%)
                      </span>
                      <span>
                        Mode: {authMode === "wet" ? "TTD Basah" : authMode === "digital" ? "TTD Digital" : "Arsip Scan Realistis"}
                      </span>
                    </div>

                    {/* The Printable Sheet */}
                    <div
                      id="print-area"
                      className={`bg-white text-black p-8 sm:p-12 rounded-lg border border-slate-300 shadow-xl max-w-[760px] mx-auto font-serif leading-relaxed text-sm ${
                        paperSize === "F4" ? "min-h-[1050px]" : "min-h-[960px]"
                      } ${authMode === "scanned" ? "scan-effect" : ""}`}
                    >
                      {/* Watermark Bar khusus Mode Scan */}
                      {authMode === "scanned" && (
                        <div className="text-center pb-2 mb-4 border-b border-slate-300 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                          *** ARSIP RESMI DIGITAL PEMDES KADURAMA • TERCATAT PADA BUKU AGENDA DESA ***
                        </div>
                      )}

                      {/* Kop Surat Resmi */}
                      <div className="border-b-4 border-double border-black pb-4 text-center">
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-16 h-16 border-2 border-black rounded flex items-center justify-center font-sans font-bold text-xs text-center leading-tight">
                            KAB.
                            <br />
                            KUNINGAN
                          </div>
                          <div className="flex-1 font-sans">
                            <div className="text-base font-bold tracking-wide uppercase">
                              Pemerintah Kabupaten Kuningan
                            </div>
                            <div className="text-sm font-bold uppercase">Kecamatan Ciawigebang</div>
                            <div className="text-xl font-extrabold tracking-wider uppercase text-slate-950">
                              Pemerintah Desa Kadurama
                            </div>
                            <div className="text-[11px] text-slate-800 mt-1">
                              Jl. Raya Desa Kadurama No. 12, Kec. Ciawigebang, Kode Pos 45591
                              <br />
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
                          {letterType === "DOMISILI" && "Surat Keterangan Domisili"}
                        </div>
                        <div className="text-xs font-sans mt-1 text-slate-800">
                          {letterType === "SKU" && "Nomor: 503 / 048 / Pem / IX / 2026"}
                          {letterType === "SKTM" && "Nomor: 401 / 049 / Kesra / IX / 2026"}
                          {letterType === "DOMISILI" && "Nomor: 470 / 051 / Pem / IX / 2026"}
                        </div>
                      </div>

                      {/* Paragraf Pembuka */}
                      <p className="mb-4 text-justify">
                        Yang bertanda tangan di bawah ini, Kepala Desa Kadurama, Kecamatan Ciawigebang, Kabupaten Kuningan, Jawa Barat, dengan ini menerangkan bahwa:
                      </p>

                      {/* Biodata Warga Pemohon */}
                      <table className="w-full text-xs mb-6 border-collapse">
                        <tbody>
                          <tr>
                            <td className="py-1 w-44 font-semibold">Nama Lengkap</td>
                            <td className="py-1 w-4">:</td>
                            <td className="py-1 font-bold uppercase">{selectedResident.nama}</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-semibold">NIK (Nomor Induk Kependudukan)</td>
                            <td className="py-1">:</td>
                            <td className="py-1 font-mono font-bold">{selectedResident.nik}</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-semibold">Nomor Kartu Keluarga</td>
                            <td className="py-1">:</td>
                            <td className="py-1 font-mono">{selectedResident.noKk}</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-semibold">Tempat / Tanggal Lahir</td>
                            <td className="py-1">:</td>
                            <td className="py-1">{selectedResident.ttl}</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-semibold">Jenis Kelamin</td>
                            <td className="py-1">:</td>
                            <td className="py-1">{selectedResident.jenisKelamin}</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-semibold">Agama / Status</td>
                            <td className="py-1">:</td>
                            <td className="py-1">
                              {selectedResident.agama} / {selectedResident.statusPerkawinan}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1 font-semibold">Pekerjaan</td>
                            <td className="py-1">:</td>
                            <td className="py-1">{selectedResident.pekerjaan}</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-semibold">Alamat / Domisili</td>
                            <td className="py-1">:</td>
                            <td className="py-1">{selectedResident.alamat}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Paragraf Keterangan Khusus Berdasarkan Jenis Surat */}
                      {letterType === "SKU" && (
                        <div className="mb-4 space-y-2 text-justify">
                          <p>
                            Menerangkan dengan sebenarnya bahwa orang tersebut di atas adalah benar penduduk Desa Kadurama yang memiliki dan menjalankan kegiatan usaha sebagai berikut:
                          </p>
                          <div className="bg-slate-50/80 p-3 rounded border border-slate-200 text-xs space-y-1 my-2">
                            <div className="grid grid-cols-12">
                              <span className="col-span-4 font-semibold">Nama Usaha:</span>
                              <span className="col-span-8 font-bold">{businessName}</span>
                            </div>
                            <div className="grid grid-cols-12">
                              <span className="col-span-4 font-semibold">Bidang Usaha:</span>
                              <span className="col-span-8">{businessField}</span>
                            </div>
                            <div className="grid grid-cols-12">
                              <span className="col-span-4 font-semibold">Alamat Usaha:</span>
                              <span className="col-span-8">{businessLocation}</span>
                            </div>
                          </div>
                          <p>
                            Surat Keterangan Usaha ini diberikan kepada yang bersangkutan untuk keperluan:{" "}
                            <strong>{letterPurpose}</strong>.
                          </p>
                        </div>
                      )}

                      {letterType === "SKTM" && (
                        <div className="mb-4 space-y-2 text-justify">
                          <p>
                            Menerangkan dengan sebenarnya bahwa orang tersebut di atas adalah benar penduduk Desa Kadurama yang tergolong dalam keluarga pra-sejahtera dan membutuhkan keringanan bantuan sosial atau pembiayaan.
                          </p>
                          <p>
                            Surat Keterangan Tidak Mampu ini dibuat untuk keperluan:{" "}
                            <strong>{letterPurpose}</strong>.
                          </p>
                        </div>
                      )}

                      {letterType === "DOMISILI" && (
                        <div className="mb-4 space-y-2 text-justify">
                          <p>
                            Menerangkan dengan sebenarnya bahwa nama tersebut di atas benar berdomisili dan bertempat tinggal pada alamat yang tercantum di atas sampai dengan saat surat ini dikeluarkan.
                          </p>
                          <p>
                            Surat Keterangan Domisili ini dibuat untuk keperluan: <strong>{letterPurpose}</strong>.
                          </p>
                        </div>
                      )}

                      {/* Paragraf Penutup */}
                      <p className="mb-8 text-justify">
                        Demikian surat keterangan ini kami buat dengan sebenarnya dan penuh rasa tanggung jawab agar dapat dipergunakan sebagaimana mestinya oleh pihak yang berkepentingan.
                      </p>

                      {/* Bagian Tanda Tangan & QR Verifikasi */}
                      <div className="grid grid-cols-12 items-end pt-4 font-sans text-xs">
                        <div className="col-span-5 text-center">
                          <div className="w-24 h-24 mx-auto border border-slate-400 p-1 rounded bg-slate-50 flex flex-col items-center justify-center">
                            <div className="text-[9px] font-mono text-center font-bold leading-tight text-slate-800">
                              KADURAMA
                              <br />
                              VERIFIED
                              <br />
                              QR DOKUMEN
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-600 mt-2">
                            Pindai untuk validasi keaslian surat
                          </div>
                        </div>

                        <div className="col-span-2"></div>

                        <div className="col-span-5 text-center">
                          <div className="mb-1">Kadurama, 13 September 2026</div>
                          <div className="font-bold mb-4">
                            {selectedOfficial === "kades"
                              ? "Kepala Desa Kadurama"
                              : "a.n. Kepala Desa Kadurama\nSekretaris Desa"}
                          </div>

                          {/* RENDERING OPSI OTORISASI */}
                          {authMode === "wet" && (
                            <div className="h-20 flex items-center justify-center text-slate-400 italic text-[11px]">
                              (Tanda Tangan & Cap Stempel Basah)
                            </div>
                          )}

                          {authMode === "digital" && (
                            <div className="h-20 relative flex items-center justify-center">
                              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#009388] text-[#009388] flex items-center justify-center font-bold text-[10px] opacity-80 rotate-12">
                                CAP RESMI
                                <br />
                                KADURAMA
                              </div>
                              <div className="absolute font-serif italic text-lg text-slate-800 rotate-[-8deg]">
                                {selectedOfficial === "kades" ? "Suhendra" : "Dadang K."}
                              </div>
                            </div>
                          )}

                          {authMode === "scanned" && (
                            <div className="h-20 relative flex items-center justify-center">
                              <div className="w-18 h-18 rounded-full border-2 border-indigo-700 text-indigo-700 flex items-center justify-center font-bold text-[10px] opacity-90 rotate-[-6deg]">
                                PEMDES KADURAMA
                                <br />
                                TERCATAT
                              </div>
                              <div className="absolute font-serif italic text-xl text-indigo-900 rotate-[-5deg]">
                                {selectedOfficial === "kades" ? "Suhendra" : "Dadang K."}
                              </div>
                            </div>
                          )}

                          <div className="font-bold underline uppercase mt-2">
                            {selectedOfficial === "kades" ? "SUHENDRA, S.Sos" : "DADANG KURNIA"}
                          </div>
                          <div className="text-[11px] text-slate-700">
                            {selectedOfficial === "kades"
                              ? "NIP. 19780412 200501 1 008"
                              : "NIP. 19820719 200902 1 003"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ============================================================ */}
            {/* TAB 2: BUKU AGENDA SURAT MASUK & KELUAR                     */}
            {/* ============================================================ */}
            {adminTab === "agenda" && (
              <div className="no-print space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Buku Agenda Terpadu (Surat Masuk & Surat Keluar)
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Pencatatan nomor surat resmi desa, riwayat pemohon, asal surat, dan status disposisi kearsipan.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAdminTab("generator")}
                      className="px-4 py-2 bg-[#009388] hover:bg-[#007b71] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Buat Surat Baru</span>
                    </button>
                  </div>
                </div>

                {/* Filter Agenda */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAgendaFilter("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        agendaFilter === "all"
                          ? "bg-[#009388] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Semua ({agendaList.length})
                    </button>
                    <button
                      onClick={() => setAgendaFilter("keluar")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        agendaFilter === "keluar"
                          ? "bg-[#009388] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      <span>Surat Keluar ({agendaList.filter((a) => a.tipe === "keluar").length})</span>
                    </button>
                    <button
                      onClick={() => setAgendaFilter("masuk")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        agendaFilter === "masuk"
                          ? "bg-[#009388] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <Inbox className="w-3 h-3" />
                      <span>Surat Masuk ({agendaList.filter((a) => a.tipe === "masuk").length})</span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 font-medium">
                    Tahun Anggaran 2026 • Arsip Pemdes Kadurama
                  </div>
                </div>

                {/* Tabel Agenda */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">No. Reg</th>
                          <th className="px-4 py-3.5">Tanggal</th>
                          <th className="px-4 py-3.5">Jenis / Arah</th>
                          <th className="px-4 py-3.5">Nomor Surat</th>
                          <th className="px-4 py-3.5">Perihal</th>
                          <th className="px-4 py-3.5">Pihak Terkait (Warga / Dinas)</th>
                          <th className="px-4 py-3.5">Status</th>
                          <th className="px-4 py-3.5 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAgenda.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3 font-mono font-bold text-[#009388]">{item.id}</td>
                            <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{item.tanggal}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  item.tipe === "keluar"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {item.tipe === "keluar" ? "Surat Keluar" : "Surat Masuk"}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono font-semibold text-slate-900 whitespace-nowrap">
                              {item.nomorSurat}
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-800 max-w-xs">{item.perihal}</td>
                            <td className="px-4 py-3 text-slate-600">{item.pihakTerkait}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => {
                                  setAdminTab("generator");
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#e6f7f5] text-slate-700 hover:text-[#009388] font-bold text-[11px] transition"
                              >
                                Cetak Salinan
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 3: DATA KEPENDUDUKAN (5 DUSUN & KK)                     */}
            {/* ============================================================ */}
            {adminTab === "residents" && (
              <div className="no-print space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Master Data Kependudukan Desa Kadurama
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Dikelompokkan berdasarkan 5 Dusun tradisional Kuningan, rincian Kartu Keluarga (KK), dan RT/RW.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsImportModalOpen(true)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition"
                    >
                      <Upload className="w-4 h-4 text-[#eda50c]" />
                      <span>Bulk Import (Excel / CSV / SIAK)</span>
                    </button>
                  </div>
                </div>

                {/* Filter Wilayah 5 Dusun */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-700 mr-2 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5 text-[#009388]" />
                      <span>Filter Dusun:</span>
                    </span>
                    <button
                      onClick={() => setResidentDusunFilter("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        residentDusunFilter === "all"
                          ? "bg-[#009388] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Semua Dusun
                    </button>
                    {["Manis", "Pahing", "Puhun", "Wage", "Kliwon"].map((dusun) => (
                      <button
                        key={dusun}
                        onClick={() => setResidentDusunFilter(dusun)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          residentDusunFilter === dusun
                            ? "bg-[#009388] text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        Dusun {dusun}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-slate-500">
                    Menampilkan <strong>{filteredResidents.length}</strong> data warga contoh
                  </div>
                </div>

                {/* Tabel Data Warga */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">NIK / No. KK</th>
                          <th className="px-4 py-3.5">Nama Lengkap</th>
                          <th className="px-4 py-3.5">Hubungan KK</th>
                          <th className="px-4 py-3.5">Dusun & RT/RW</th>
                          <th className="px-4 py-3.5">Tempat & Tanggal Lahir</th>
                          <th className="px-4 py-3.5">Pekerjaan</th>
                          <th className="px-4 py-3.5 text-right">Aksi Loket</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredResidents.map((res) => (
                          <tr key={res.nik} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3">
                              <div className="font-mono font-bold text-slate-900">{res.nik}</div>
                              <div className="font-mono text-[11px] text-slate-500">KK: {res.noKk}</div>
                            </td>
                            <td className="px-4 py-3 font-bold text-[#003733]">{res.nama}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                                {res.hubunganKeluarga}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-semibold text-slate-800">Dusun {res.dusun}</div>
                              <div className="text-[11px] text-slate-500">
                                RT {res.rt} / RW {res.rw}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{res.ttl}</td>
                            <td className="px-4 py-3 text-slate-600">{res.pekerjaan}</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedResident(res);
                                  setSearchQuery(res.nik);
                                  setAdminTab("generator");
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#009388] hover:bg-[#007b71] text-white font-bold text-[11px] transition shadow-2xs"
                              >
                                Buat Surat
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Modal Simulasi Bulk Import */}
                {isImportModalOpen && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-slate-900">
                              Import Master Data Kependudukan
                            </h3>
                            <p className="text-[11px] text-slate-500">Format Excel (.xlsx), CSV, atau Export SIAK</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsImportModalOpen(false)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-4 space-y-4 text-xs">
                        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-[#009388] transition cursor-pointer bg-slate-50">
                          <Upload className="w-8 h-8 text-[#009388] mx-auto mb-2" />
                          <div className="font-bold text-slate-800">Tarik & Lepas Berkas Excel/CSV di Sini</div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            Mendukung file dari SIAK, Prodeskel, SDGs Desa, atau DPT
                          </div>
                        </div>

                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-600">
                          <div className="font-bold text-slate-800">Kolom yang Terbaca Otomatis:</div>
                          <div>• NIK (16 digit) & No. KK (16 digit)</div>
                          <div>• Nama Lengkap, Tempat & Tanggal Lahir</div>
                          <div>• Dusun (Manis, Pahing, Puhun, Wage, Kliwon)</div>
                          <div>• RT, RW, dan Alamat Lengkap</div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => setIsImportModalOpen(false)}
                          className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
                        >
                          Tutup
                        </button>
                        <button
                          onClick={() => {
                            alert("Simulasi impor berhasil! Database kependudukan Supabase akan memproses sinkronisasi saat integrasi database diaktifkan.");
                            setIsImportModalOpen(false);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm transition"
                        >
                          Mulai Proses Import
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
