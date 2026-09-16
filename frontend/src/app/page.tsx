"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { recordAuditLog } from "@/lib/supabase/audit";
import dynamic from "next/dynamic";
import { POI_POINTS, type POIItem } from "@/components/CivicGisMap";

const CivicGisMap = dynamic(() => import("@/components/CivicGisMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[480px] bg-slate-900 flex flex-col items-center justify-center text-slate-400 text-xs">
      <div className="w-6 h-6 border-2 border-[#009388] border-t-transparent rounded-full animate-spin mb-2" />
      <span>Memuat Citra Satelit Desa Kadurama...</span>
    </div>
  ),
});
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
  Home as HomeIcon,
  Check,
  AlertCircle,
  RefreshCw,
  Edit3,
  Trash2,
  Newspaper,
  PieChart,
  ChevronLeft,
  ClipboardCheck,
  FileSpreadsheet,
  Layers,
  Compass,
  Landmark,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Droplets,
  Zap,
  Bed,
  Activity,
  Info,
  Wheat,
  Mountain,
  Award,
  Sparkles,
  ExternalLink,
  Bell,
  Calendar,
} from "lucide-react";

// =========================================================================
// 1. DATA KEPENDUDUKAN (3 DUSUN KADURAMA: MANIS, PAHING, WAGE)
// =========================================================================
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
  dusun: "Manis" | "Pahing" | "Wage";
  rt: string;
  rw: string;
  alamat: string;
  status: string;
  syncStatus?: "Tersinkronisasi" | "Perlu Sinkronisasi" | "Diperbarui Internal";
}

const INITIAL_RESIDENTS_ARRAY: Resident[] = [
  {
    nik: "3208152405900001",
    noKk: "3208150102030001",
    nama: "Asep Saepuloh",
    ttl: "Kuningan, 24 Mei 1990",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Wiraswasta Warung",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Manis",
    rt: "02",
    rw: "01",
    alamat: "Dusun Manis RT 02 / RW 01, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208156108950002",
    noKk: "3208150102030001",
    nama: "Siti Aminah",
    ttl: "Kuningan, 18 Agustus 1995",
    jenisKelamin: "Perempuan",
    pekerjaan: "Mengurus Rumah Tangga",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Istri",
    dusun: "Manis",
    rt: "02",
    rw: "01",
    alamat: "Dusun Manis RT 02 / RW 01, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208151201880003",
    noKk: "3208150102030002",
    nama: "Udi Hermanto",
    ttl: "Kuningan, 12 Januari 1988",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Buruh Tani Harian",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Pahing",
    rt: "05",
    rw: "02",
    alamat: "Dusun Pahing RT 05 / RW 02, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
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
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208151111920005",
    noKk: "3208150102030003",
    nama: "Maman Suherman",
    ttl: "Kuningan, 11 November 1992",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Petani Ubi & Sayur",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Wage",
    rt: "03",
    rw: "03",
    alamat: "Dusun Wage RT 03 / RW 03, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208155502940006",
    noKk: "3208150102030004",
    nama: "Neneng Hasanah",
    ttl: "Kuningan, 15 Februari 1994",
    jenisKelamin: "Perempuan",
    pekerjaan: "Guru Honorer",
    agama: "Islam",
    statusPerkawinan: "Belum Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Manis",
    rt: "07",
    rw: "01",
    alamat: "Dusun Manis RT 07 / RW 01, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208150303850007",
    noKk: "3208150102030005",
    nama: "Dedi Suryadi",
    ttl: "Kuningan, 03 Maret 1985",
    jenisKelamin: "Laki-laki",
    pekerjaan: "PNS / Guru Sekolah",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Manis",
    rt: "01",
    rw: "01",
    alamat: "Dusun Manis RT 01 / RW 01, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208154407890008",
    noKk: "3208150102030005",
    nama: "Iis Rosita",
    ttl: "Kuningan, 04 Juli 1989",
    jenisKelamin: "Perempuan",
    pekerjaan: "Mengurus Rumah Tangga",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Istri",
    dusun: "Manis",
    rt: "01",
    rw: "01",
    alamat: "Dusun Manis RT 01 / RW 01, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208151909980009",
    noKk: "3208150102030006",
    nama: "Gilang Pratama",
    ttl: "Kuningan, 19 September 1998",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Karyawan Swasta",
    agama: "Islam",
    statusPerkawinan: "Belum Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Manis",
    rt: "03",
    rw: "01",
    alamat: "Dusun Manis RT 03 / RW 01, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208152106750010",
    noKk: "3208150102030007",
    nama: "Jaja Subagja",
    ttl: "Kuningan, 21 Juni 1975",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Pedagang Padi & Gabah",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Pahing",
    rt: "04",
    rw: "02",
    alamat: "Dusun Pahing RT 04 / RW 02, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208156612780011",
    noKk: "3208150102030007",
    nama: "Enok Komala",
    ttl: "Kuningan, 26 Desember 1978",
    jenisKelamin: "Perempuan",
    pekerjaan: "Pedagang Warung",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Istri",
    dusun: "Pahing",
    rt: "04",
    rw: "02",
    alamat: "Dusun Pahing RT 04 / RW 02, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208151408020012",
    noKk: "3208150102030007",
    nama: "Fajar Ramadhan",
    ttl: "Kuningan, 14 Agustus 2002",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Pelajar / Mahasiswa",
    agama: "Islam",
    statusPerkawinan: "Belum Kawin",
    hubunganKeluarga: "Anak",
    dusun: "Pahing",
    rt: "04",
    rw: "02",
    alamat: "Dusun Pahing RT 04 / RW 02, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208151004820013",
    noKk: "3208150102030008",
    nama: "Nana Sumarna",
    ttl: "Kuningan, 10 April 1982",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Buruh Harian Lepas",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Pahing",
    rt: "06",
    rw: "02",
    alamat: "Dusun Pahing RT 06 / RW 02, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208151508800014",
    noKk: "3208150102030009",
    nama: "Cecep Supriatna",
    ttl: "Kuningan, 15 Agustus 1980",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Peternak Sapi Perah",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Wage",
    rt: "01",
    rw: "03",
    alamat: "Dusun Wage RT 01 / RW 03, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208155209840015",
    noKk: "3208150102030009",
    nama: "Cucu Sumiati",
    ttl: "Kuningan, 12 September 1984",
    jenisKelamin: "Perempuan",
    pekerjaan: "Mengurus Rumah Tangga",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Istri",
    dusun: "Wage",
    rt: "01",
    rw: "03",
    alamat: "Dusun Wage RT 01 / RW 03, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208152802950016",
    noKk: "3208150102030010",
    nama: "Tatang Sutisna",
    ttl: "Kuningan, 28 Februari 1995",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Montir Bengkel Motor",
    agama: "Islam",
    statusPerkawinan: "Belum Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Wage",
    rt: "02",
    rw: "03",
    alamat: "Dusun Wage RT 02 / RW 03, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208151804700017",
    noKk: "3208150102030011",
    nama: "Kusnadi",
    ttl: "Kuningan, 18 April 1970",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Pencari Kayu & Buruh Kebun",
    agama: "Islam",
    statusPerkawinan: "Duda",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Wage",
    rt: "02",
    rw: "03",
    alamat: "Dusun Wage RT 02 / RW 03, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208150505870019",
    noKk: "3208150102030012",
    nama: "Ade Suhendar",
    ttl: "Kuningan, 05 Mei 1987",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Pengrajin Makanan Olahan",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Manis",
    rt: "03",
    rw: "01",
    alamat: "Dusun Manis RT 03 / RW 01, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208151206890022",
    noKk: "3208150102030013",
    nama: "Encep Lukman",
    ttl: "Kuningan, 12 Juni 1989",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Tukang Ojek Pangkalan",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Manis",
    rt: "04",
    rw: "01",
    alamat: "Dusun Manis RT 04 / RW 01, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208151408820023",
    noKk: "3208150102030014",
    nama: "Agus Komarudin",
    ttl: "Kuningan, 14 Agustus 1982",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Petani Padi Sawah",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Pahing",
    rt: "07",
    rw: "02",
    alamat: "Dusun Pahing RT 07 / RW 02, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208152504840024",
    noKk: "3208150102030015",
    nama: "Iwan Setiawan",
    ttl: "Kuningan, 25 April 1984",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Montir Bengkel Motor",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Wage",
    rt: "04",
    rw: "03",
    alamat: "Dusun Wage RT 04 / RW 03, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
];

const RESIDENTS_DATA: Record<string, Resident> = Object.fromEntries(
  INITIAL_RESIDENTS_ARRAY.map((r) => [r.nik, r])
);

// =========================================================================
// 2. DATA SENSUS KESEJAHTERAAN & SDGs KELUARGA (PER KK)
// =========================================================================
export interface SensusKK {
  id: string;
  noKk: string;
  nikKepalaKeluarga: string;
  namaKepalaKeluarga: string;
  dusun: "Manis" | "Pahing" | "Wage";
  rt: string;
  rw: string;
  alamat: string;
  jumlahAnggota: number;
  desil: 1 | 2 | 3 | 4; // 1: Sangat Miskin, 2: Miskin, 3: Hampir Miskin, 4: Rentan / Mampu
  statusPbb: "Lunas" | "Belum Lunas";
  tahunPbb: number;
  nominalPbb: number;
  kondisiRumah: "Layak Huni" | "RTLH";
  statusKepemilikanRumah: "Milik Sendiri" | "Menumpang Keluarga" | "Sewa / Kontrak";
  luasLantai: number;
  dinding: "Tembok Permanen" | "Setengah Tembok" | "Bilik Bambu / Papan";
  lantai: "Keramik / Granit" | "Semen Rata" | "Tanah";
  atap: "Genteng Baik" | "Seng / Asbes" | "Rumbia / Lapuk";
  jambanSanitasi: "Jamban Sendiri (Septic Tank)" | "Jamban Bersama" | "Tidak Ada (Numpang / Sungai)";
  sumberAir: "PDAM / Sumur Bor Bersih" | "Sumur Timba Gali" | "Mata Air Terbuka";
  dayaListrik: "450 VA" | "900 VA" | "1300 VA" | "Menumpang";
  pekerjaanUtama: string;
  penghasilanBulanan: "Dibawah Rp 1.000.000" | "Rp 1.000.000 - Rp 2.000.000" | "Rp 2.000.000 - Rp 4.000.000" | "Diatas Rp 4.000.000";
  kepemilikanLahan: "Lahan Sawah Sendiri" | "Petani Penggarap" | "Pekarangan Rumah Saja";
  kerentanan: {
    adaLansiaTunggal: boolean;
    adaBalitaStunting: boolean;
    adaDisabilitas: boolean;
    adaAnakPutusSekolah: boolean;
  };
  bansosAktif: "PKH" | "BPNT" | "BLT Dana Desa" | "Bansos Lansia" | "Tidak Ada (Non-Bansos)";
  surveyorKadus: string;
  tanggalSensus: string;
  catatanVerifikasi: string;
}

export const INITIAL_SENSUS_KK: SensusKK[] = [
  {
    id: "SN-001",
    noKk: "3208150102030001",
    nikKepalaKeluarga: "3208152405900001",
    namaKepalaKeluarga: "Asep Saepuloh",
    dusun: "Manis",
    rt: "02",
    rw: "01",
    alamat: "Dusun Manis RT 02 / RW 01, Desa Kadurama",
    jumlahAnggota: 4,
    desil: 3,
    statusPbb: "Lunas",
    tahunPbb: 2026,
    nominalPbb: 85000,
    kondisiRumah: "Layak Huni",
    statusKepemilikanRumah: "Milik Sendiri",
    luasLantai: 72,
    dinding: "Tembok Permanen",
    lantai: "Keramik / Granit",
    atap: "Genteng Baik",
    jambanSanitasi: "Jamban Sendiri (Septic Tank)",
    sumberAir: "PDAM / Sumur Bor Bersih",
    dayaListrik: "900 VA",
    pekerjaanUtama: "Wiraswasta Warung",
    penghasilanBulanan: "Rp 2.000.000 - Rp 4.000.000",
    kepemilikanLahan: "Pekarangan Rumah Saja",
    kerentanan: {
      adaLansiaTunggal: false,
      adaBalitaStunting: false,
      adaDisabilitas: false,
      adaAnakPutusSekolah: false,
    },
    bansosAktif: "Tidak Ada (Non-Bansos)",
    surveyorKadus: "Jamaludin (Kadus Manis)",
    tanggalSensus: "10 September 2026",
    catatanVerifikasi: "Kondisi ekonomi mandiri, aktif membayar PBB tahunan.",
  },
  {
    id: "SN-002",
    noKk: "3208150102030002",
    nikKepalaKeluarga: "3208151201880003",
    namaKepalaKeluarga: "Udi Hermanto",
    dusun: "Pahing",
    rt: "05",
    rw: "02",
    alamat: "Dusun Pahing RT 05 / RW 02, Desa Kadurama",
    jumlahAnggota: 5,
    desil: 2,
    statusPbb: "Belum Lunas",
    tahunPbb: 2026,
    nominalPbb: 45000,
    kondisiRumah: "RTLH",
    statusKepemilikanRumah: "Milik Sendiri",
    luasLantai: 48,
    dinding: "Setengah Tembok",
    lantai: "Tanah",
    atap: "Seng / Asbes",
    jambanSanitasi: "Jamban Bersama",
    sumberAir: "Sumur Timba Gali",
    dayaListrik: "450 VA",
    pekerjaanUtama: "Buruh Tani Harian",
    penghasilanBulanan: "Rp 1.000.000 - Rp 2.000.000",
    kepemilikanLahan: "Petani Penggarap",
    kerentanan: {
      adaLansiaTunggal: false,
      adaBalitaStunting: true,
      adaDisabilitas: false,
      adaAnakPutusSekolah: false,
    },
    bansosAktif: "BLT Dana Desa",
    surveyorKadus: "Trida Sentosa (Kadus Pahing)",
    tanggalSensus: "11 September 2026",
    catatanVerifikasi: "Lantai ruang tengah masih tanah merah, balita usia 2 tahun terindikasi berat badan kurang, perlu intervensi PMT Posyandu.",
  },
  {
    id: "SN-003",
    noKk: "3208150102030003",
    nikKepalaKeluarga: "3208151111920005",
    namaKepalaKeluarga: "Maman Suherman",
    dusun: "Wage",
    rt: "03",
    rw: "03",
    alamat: "Dusun Wage RT 03 / RW 03, Desa Kadurama",
    jumlahAnggota: 3,
    desil: 2,
    statusPbb: "Lunas",
    tahunPbb: 2026,
    nominalPbb: 55000,
    kondisiRumah: "Layak Huni",
    statusKepemilikanRumah: "Milik Sendiri",
    luasLantai: 60,
    dinding: "Tembok Permanen",
    lantai: "Semen Rata",
    atap: "Genteng Baik",
    jambanSanitasi: "Jamban Sendiri (Septic Tank)",
    sumberAir: "PDAM / Sumur Bor Bersih",
    dayaListrik: "450 VA",
    pekerjaanUtama: "Petani Ubi & Sayur",
    penghasilanBulanan: "Rp 1.000.000 - Rp 2.000.000",
    kepemilikanLahan: "Lahan Sawah Sendiri",
    kerentanan: {
      adaLansiaTunggal: false,
      adaBalitaStunting: false,
      adaDisabilitas: false,
      adaAnakPutusSekolah: false,
    },
    bansosAktif: "BPNT",
    surveyorKadus: "Andri Rukmana (Kadus Wage)",
    tanggalSensus: "09 September 2026",
    catatanVerifikasi: "Keluarga tertib pajak, menerima bantuan sembako rutin BPNT.",
  },
  {
    id: "SN-004",
    noKk: "3208150102030004",
    nikKepalaKeluarga: "3208150303850007",
    namaKepalaKeluarga: "Dedi Suryadi",
    dusun: "Manis",
    rt: "01",
    rw: "01",
    alamat: "Dusun Manis RT 01 / RW 01, Desa Kadurama",
    jumlahAnggota: 4,
    desil: 4,
    statusPbb: "Lunas",
    tahunPbb: 2026,
    nominalPbb: 120000,
    kondisiRumah: "Layak Huni",
    statusKepemilikanRumah: "Milik Sendiri",
    luasLantai: 90,
    dinding: "Tembok Permanen",
    lantai: "Keramik / Granit",
    atap: "Genteng Baik",
    jambanSanitasi: "Jamban Sendiri (Septic Tank)",
    sumberAir: "PDAM / Sumur Bor Bersih",
    dayaListrik: "1300 VA",
    pekerjaanUtama: "PNS / Guru Sekolah",
    penghasilanBulanan: "Diatas Rp 4.000.000",
    kepemilikanLahan: "Lahan Sawah Sendiri",
    kerentanan: {
      adaLansiaTunggal: false,
      adaBalitaStunting: false,
      adaDisabilitas: false,
      adaAnakPutusSekolah: false,
    },
    bansosAktif: "Tidak Ada (Non-Bansos)",
    surveyorKadus: "Jamaludin (Kadus Manis)",
    tanggalSensus: "08 September 2026",
    catatanVerifikasi: "Ekonomi mapan, rumah sangat layak dan sanitasi memenuhi standar kesehatan.",
  },
  {
    id: "SN-005",
    noKk: "3208150102030005",
    nikKepalaKeluarga: "3208152106750010",
    namaKepalaKeluarga: "Jaja Subagja",
    dusun: "Pahing",
    rt: "04",
    rw: "02",
    alamat: "Dusun Pahing RT 04 / RW 02, Desa Kadurama",
    jumlahAnggota: 4,
    desil: 3,
    statusPbb: "Lunas",
    tahunPbb: 2026,
    nominalPbb: 90000,
    kondisiRumah: "Layak Huni",
    statusKepemilikanRumah: "Milik Sendiri",
    luasLantai: 80,
    dinding: "Tembok Permanen",
    lantai: "Keramik / Granit",
    atap: "Genteng Baik",
    jambanSanitasi: "Jamban Sendiri (Septic Tank)",
    sumberAir: "PDAM / Sumur Bor Bersih",
    dayaListrik: "900 VA",
    pekerjaanUtama: "Pedagang Padi & Gabah",
    penghasilanBulanan: "Rp 2.000.000 - Rp 4.000.000",
    kepemilikanLahan: "Lahan Sawah Sendiri",
    kerentanan: {
      adaLansiaTunggal: false,
      adaBalitaStunting: false,
      adaDisabilitas: false,
      adaAnakPutusSekolah: false,
    },
    bansosAktif: "Tidak Ada (Non-Bansos)",
    surveyorKadus: "Trida Sentosa (Kadus Pahing)",
    tanggalSensus: "10 September 2026",
    catatanVerifikasi: "Kelompok tani mandiri, berkontribusi aktif dalam ketahanan pangan dusun.",
  },
  {
    id: "SN-006",
    noKk: "3208150102030006",
    nikKepalaKeluarga: "3208151004820013",
    namaKepalaKeluarga: "Nana Sumarna",
    dusun: "Pahing",
    rt: "06",
    rw: "02",
    alamat: "Dusun Pahing RT 06 / RW 02, Desa Kadurama",
    jumlahAnggota: 3,
    desil: 1,
    statusPbb: "Belum Lunas",
    tahunPbb: 2026,
    nominalPbb: 35000,
    kondisiRumah: "RTLH",
    statusKepemilikanRumah: "Menumpang Keluarga",
    luasLantai: 36,
    dinding: "Bilik Bambu / Papan",
    lantai: "Tanah",
    atap: "Rumbia / Lapuk",
    jambanSanitasi: "Tidak Ada (Numpang / Sungai)",
    sumberAir: "Sumur Timba Gali",
    dayaListrik: "Menumpang",
    pekerjaanUtama: "Buruh Harian Lepas",
    penghasilanBulanan: "Dibawah Rp 1.000.000",
    kepemilikanLahan: "Petani Penggarap",
    kerentanan: {
      adaLansiaTunggal: true,
      adaBalitaStunting: false,
      adaDisabilitas: false,
      adaAnakPutusSekolah: false,
    },
    bansosAktif: "PKH",
    surveyorKadus: "Trida Sentosa (Kadus Pahing)",
    tanggalSensus: "12 September 2026",
    catatanVerifikasi: "Prioritas tertinggi Bedah Rumah (RTLH). Tinggal bersama ibu lansia berusia 76 tahun dengan atap bocor parah dan sanitasi belum ada.",
  },
  {
    id: "SN-007",
    noKk: "3208150102030007",
    nikKepalaKeluarga: "3208151508800014",
    namaKepalaKeluarga: "Cecep Supriatna",
    dusun: "Wage",
    rt: "01",
    rw: "03",
    alamat: "Dusun Wage RT 01 / RW 03, Desa Kadurama",
    jumlahAnggota: 4,
    desil: 3,
    statusPbb: "Lunas",
    tahunPbb: 2026,
    nominalPbb: 75000,
    kondisiRumah: "Layak Huni",
    statusKepemilikanRumah: "Milik Sendiri",
    luasLantai: 70,
    dinding: "Tembok Permanen",
    lantai: "Semen Rata",
    atap: "Genteng Baik",
    jambanSanitasi: "Jamban Sendiri (Septic Tank)",
    sumberAir: "Mata Air Terbuka",
    dayaListrik: "900 VA",
    pekerjaanUtama: "Peternak Sapi Perah",
    penghasilanBulanan: "Rp 2.000.000 - Rp 4.000.000",
    kepemilikanLahan: "Pekarangan Rumah Saja",
    kerentanan: {
      adaLansiaTunggal: false,
      adaBalitaStunting: false,
      adaDisabilitas: false,
      adaAnakPutusSekolah: false,
    },
    bansosAktif: "Tidak Ada (Non-Bansos)",
    surveyorKadus: "Andri Rukmana (Kadus Wage)",
    tanggalSensus: "11 September 2026",
    catatanVerifikasi: "Memiliki 3 ekor sapi perah produktif, memanfaatkan air dari mata air Cikaduran.",
  },
  {
    id: "SN-008",
    noKk: "3208150102030008",
    nikKepalaKeluarga: "3208151804700017",
    namaKepalaKeluarga: "Kusnadi",
    dusun: "Wage",
    rt: "02",
    rw: "03",
    alamat: "Dusun Wage RT 02 / RW 03, Desa Kadurama",
    jumlahAnggota: 2,
    desil: 1,
    statusPbb: "Belum Lunas",
    tahunPbb: 2026,
    nominalPbb: 30000,
    kondisiRumah: "RTLH",
    statusKepemilikanRumah: "Milik Sendiri",
    luasLantai: 32,
    dinding: "Bilik Bambu / Papan",
    lantai: "Tanah",
    atap: "Seng / Asbes",
    jambanSanitasi: "Jamban Bersama",
    sumberAir: "Mata Air Terbuka",
    dayaListrik: "450 VA",
    pekerjaanUtama: "Pencari Kayu & Buruh Kebun",
    penghasilanBulanan: "Dibawah Rp 1.000.000",
    kepemilikanLahan: "Petani Penggarap",
    kerentanan: {
      adaLansiaTunggal: true,
      adaBalitaStunting: false,
      adaDisabilitas: true,
      adaAnakPutusSekolah: false,
    },
    bansosAktif: "Bansos Lansia",
    surveyorKadus: "Andri Rukmana (Kadus Wage)",
    tanggalSensus: "12 September 2026",
    catatanVerifikasi: "Kepala keluarga lansia usia 68 tahun dengan keterbatasan mobilitas fisik, rumah berdinding bilik bambu lapuk.",
  },
  {
    id: "SN-009",
    noKk: "3208150102030009",
    nikKepalaKeluarga: "3208150505870019",
    namaKepalaKeluarga: "Ade Suhendar",
    dusun: "Manis",
    rt: "03",
    rw: "01",
    alamat: "Dusun Manis RT 03 / RW 01, Desa Kadurama",
    jumlahAnggota: 4,
    desil: 3,
    statusPbb: "Lunas",
    tahunPbb: 2026,
    nominalPbb: 65000,
    kondisiRumah: "Layak Huni",
    statusKepemilikanRumah: "Milik Sendiri",
    luasLantai: 64,
    dinding: "Tembok Permanen",
    lantai: "Keramik / Granit",
    atap: "Genteng Baik",
    jambanSanitasi: "Jamban Sendiri (Septic Tank)",
    sumberAir: "PDAM / Sumur Bor Bersih",
    dayaListrik: "900 VA",
    pekerjaanUtama: "Pengrajin Makanan Olahan",
    penghasilanBulanan: "Rp 2.000.000 - Rp 4.000.000",
    kepemilikanLahan: "Pekarangan Rumah Saja",
    kerentanan: {
      adaLansiaTunggal: false,
      adaBalitaStunting: false,
      adaDisabilitas: false,
      adaAnakPutusSekolah: false,
    },
    bansosAktif: "Tidak Ada (Non-Bansos)",
    surveyorKadus: "Jamaludin (Kadus Manis)",
    tanggalSensus: "09 September 2026",
    catatanVerifikasi: "Pelaku UMKM rengginang & keripik ubi khas Kadurama.",
  },
  {
    id: "SN-010",
    noKk: "3208150102030010",
    nikKepalaKeluarga: "3208151206890022",
    namaKepalaKeluarga: "Encep Lukman",
    dusun: "Manis",
    rt: "04",
    rw: "01",
    alamat: "Dusun Manis RT 04 / RW 01, Desa Kadurama",
    jumlahAnggota: 5,
    desil: 2,
    statusPbb: "Belum Lunas",
    tahunPbb: 2026,
    nominalPbb: 48000,
    kondisiRumah: "RTLH",
    statusKepemilikanRumah: "Milik Sendiri",
    luasLantai: 50,
    dinding: "Setengah Tembok",
    lantai: "Semen Rata",
    atap: "Seng / Asbes",
    jambanSanitasi: "Jamban Bersama",
    sumberAir: "PDAM / Sumur Bor Bersih",
    dayaListrik: "450 VA",
    pekerjaanUtama: "Tukang Ojek Pangkalan",
    penghasilanBulanan: "Rp 1.000.000 - Rp 2.000.000",
    kepemilikanLahan: "Pekarangan Rumah Saja",
    kerentanan: {
      adaLansiaTunggal: false,
      adaBalitaStunting: true,
      adaDisabilitas: false,
      adaAnakPutusSekolah: false,
    },
    bansosAktif: "PKH",
    surveyorKadus: "Jamaludin (Kadus Manis)",
    tanggalSensus: "13 September 2026",
    catatanVerifikasi: "Atap seng bocor di bagian dapur, balita usia 18 bulan masuk pantauan posyandu dusun manis.",
  },
  {
    id: "SN-011",
    noKk: "3208150102030011",
    nikKepalaKeluarga: "3208151408820023",
    namaKepalaKeluarga: "Agus Komarudin",
    dusun: "Pahing",
    rt: "07",
    rw: "02",
    alamat: "Dusun Pahing RT 07 / RW 02, Desa Kadurama",
    jumlahAnggota: 4,
    desil: 3,
    statusPbb: "Lunas",
    tahunPbb: 2026,
    nominalPbb: 80000,
    kondisiRumah: "Layak Huni",
    statusKepemilikanRumah: "Milik Sendiri",
    luasLantai: 72,
    dinding: "Tembok Permanen",
    lantai: "Semen Rata",
    atap: "Genteng Baik",
    jambanSanitasi: "Jamban Sendiri (Septic Tank)",
    sumberAir: "Sumur Timba Gali",
    dayaListrik: "900 VA",
    pekerjaanUtama: "Petani Padi Sawah",
    penghasilanBulanan: "Rp 1.000.000 - Rp 2.000.000",
    kepemilikanLahan: "Lahan Sawah Sendiri",
    kerentanan: {
      adaLansiaTunggal: false,
      adaBalitaStunting: false,
      adaDisabilitas: false,
      adaAnakPutusSekolah: false,
    },
    bansosAktif: "Tidak Ada (Non-Bansos)",
    surveyorKadus: "Trida Sentosa (Kadus Pahing)",
    tanggalSensus: "08 September 2026",
    catatanVerifikasi: "Keluarga mandiri, mengelola sawah produktif seluas 140 bata.",
  },
  {
    id: "SN-012",
    noKk: "3208150102030012",
    nikKepalaKeluarga: "3208152504840024",
    namaKepalaKeluarga: "Iwan Setiawan",
    dusun: "Wage",
    rt: "04",
    rw: "03",
    alamat: "Dusun Wage RT 04 / RW 03, Desa Kadurama",
    jumlahAnggota: 3,
    desil: 2,
    statusPbb: "Lunas",
    tahunPbb: 2026,
    nominalPbb: 52000,
    kondisiRumah: "Layak Huni",
    statusKepemilikanRumah: "Milik Sendiri",
    luasLantai: 56,
    dinding: "Tembok Permanen",
    lantai: "Semen Rata",
    atap: "Genteng Baik",
    jambanSanitasi: "Jamban Sendiri (Septic Tank)",
    sumberAir: "Mata Air Terbuka",
    dayaListrik: "450 VA",
    pekerjaanUtama: "Montir Bengkel Motor",
    penghasilanBulanan: "Rp 1.000.000 - Rp 2.000.000",
    kepemilikanLahan: "Pekarangan Rumah Saja",
    kerentanan: {
      adaLansiaTunggal: false,
      adaBalitaStunting: false,
      adaDisabilitas: false,
      adaAnakPutusSekolah: false,
    },
    bansosAktif: "BPNT",
    surveyorKadus: "Andri Rukmana (Kadus Wage)",
    tanggalSensus: "10 September 2026",
    catatanVerifikasi: "Membuka bengkel tambal ban kecil di rumah, pembayaran PBB tertib.",
  },
];

// Helper auto-calculate Desil
export function calculateDesil(
  dinding: string,
  lantai: string,
  penghasilan: string,
  luasLantai: number,
  jumlahAnggota: number
): 1 | 2 | 3 | 4 {
  const luasPerKapita = luasLantai / Math.max(1, jumlahAnggota);
  if (
    lantai === "Tanah" ||
    (dinding === "Bilik Bambu / Papan" && penghasilan === "Dibawah Rp 1.000.000") ||
    luasPerKapita < 8
  ) {
    return 1; // Sangat Miskin
  }
  if (
    penghasilan === "Dibawah Rp 1.000.000" ||
    penghasilan === "Rp 1.000.000 - Rp 2.000.000" ||
    dinding === "Setengah Tembok" ||
    lantai === "Semen Rata"
  ) {
    return 2; // Miskin
  }
  if (penghasilan === "Rp 2.000.000 - Rp 4.000.000") {
    return 3; // Hampir Miskin
  }
  return 4; // Rentan / Mampu
}

// =========================================================================
// 3. TITIK SEBARAN FASILITAS PETA GEOGRAFIS DESA KADURAMA
// =========================================================================
export interface FacilityPoint {
  id: number;
  nama: string;
  kategori: "pemerintahan" | "kesehatan" | "pendidikan" | "ekonomi" | "alam";
  dusun: "Manis" | "Pahing" | "Wage";
  koordinat: string;
  elevasi: string;
  alamat: string;
  deskripsi: string;
  jamBuka: string;
  status: "Aktif Melayani" | "Fasilitas Umum";
  iconType: string;
}

export const VILLAGE_FACILITIES: FacilityPoint[] = [
  {
    id: 1,
    nama: "Kantor Balai Desa & Pendopo Kadurama",
    kategori: "pemerintahan",
    dusun: "Manis",
    koordinat: "6°59'42.4\"S 108°33'14.1\"E",
    elevasi: "295 mdpl",
    alamat: "Jl. Desa Kadurama No. 01, Dusun Manis",
    deskripsi: "Pusat administrasi pemerintahan desa, ruang pelayanan loket kependudukan, balai pertemuan musyawarah desa, dan kantor BPD.",
    jamBuka: "Senin - Jumat: 08.00 - 15.00 WIB",
    status: "Aktif Melayani",
    iconType: "Landmark",
  },
  {
    id: 2,
    nama: "Puskesmas Pembantu (Pustu) Kadurama",
    kategori: "kesehatan",
    dusun: "Manis",
    koordinat: "6°59'40.8\"S 108°33'16.5\"E",
    elevasi: "298 mdpl",
    alamat: "Jl. Kesehatan No. 04, Dusun Manis",
    deskripsi: "Fasilitas kesehatan primer pertama warga desa dengan tenaga perawat & bidan desa siaga 24 jam untuk pertolongan pertama dan persalinan.",
    jamBuka: "Senin - Sabtu: 08.00 - 14.00 WIB (Darurat 24 Jam)",
    status: "Aktif Melayani",
    iconType: "Activity",
  },
  {
    id: 3,
    nama: "SD Negeri 1 Kadurama",
    kategori: "pendidikan",
    dusun: "Manis",
    koordinat: "6°59'38.2\"S 108°33'10.9\"E",
    elevasi: "292 mdpl",
    alamat: "Dusun Manis RT 03 / RW 01",
    deskripsi: "Sekolah dasar negeri pusat pendidikan generasi muda desa dengan fasilitas laboratorium komputer dasar dan lapangan upacara.",
    jamBuka: "Senin - Sabtu: 07.00 - 12.30 WIB",
    status: "Aktif Melayani",
    iconType: "Building2",
  },
  {
    id: 4,
    nama: "Sentra BUMDes Bina Mandiri & Toko Tani",
    kategori: "ekonomi",
    dusun: "Manis",
    koordinat: "6°59'45.0\"S 108°33'18.2\"E",
    elevasi: "290 mdpl",
    alamat: "Kawasan Pasar Desa, Dusun Manis",
    deskripsi: "Pusat distribusi pupuk bersubsidi, pakan ternak, dan galeri penjualan produk UMKM olahan ubi jalar & rengginang khas warga.",
    jamBuka: "Setiap Hari: 07.30 - 17.00 WIB",
    status: "Aktif Melayani",
    iconType: "DollarSign",
  },
  {
    id: 5,
    nama: "Posyandu Melati I Dusun Pahing",
    kategori: "kesehatan",
    dusun: "Pahing",
    koordinat: "6°59'55.1\"S 108°33'05.4\"E",
    elevasi: "310 mdpl",
    alamat: "Balai Pertemuan Dusun Pahing RT 04 / RW 02",
    deskripsi: "Pos pelayanan terpadu bulanan balita, pencegahan stunting, penimbangan gizi, serta imunisasi lansia wilayah Dusun Pahing.",
    jamBuka: "Jumat Pertama Setiap Bulan (08.30 - 12.00 WIB)",
    status: "Aktif Melayani",
    iconType: "Activity",
  },
  {
    id: 6,
    nama: "Lumbung Pangan & Rice Milling Organik",
    kategori: "ekonomi",
    dusun: "Pahing",
    koordinat: "7°00'02.3\"S 108°32'58.7\"E",
    elevasi: "315 mdpl",
    alamat: "Area Persawahan Blok Pasir, Dusun Pahing",
    deskripsi: "Gudang cadangan pangan gabah desa dan fasilitas penggilingan beras organik milik gabungan kelompok tani (Gapoktan) Sri Rejeki.",
    jamBuka: "Senin - Sabtu: 07.00 - 16.00 WIB",
    status: "Fasilitas Umum",
    iconType: "Layers",
  },
  {
    id: 7,
    nama: "Lapangan Olahraga Gelora Kadurama",
    kategori: "pemerintahan",
    dusun: "Pahing",
    koordinat: "6°59'50.6\"S 108°33'02.1\"E",
    elevasi: "305 mdpl",
    alamat: "Dusun Pahing RT 02 / RW 02",
    deskripsi: "Sarana olahraga sepak bola dan ruang terbuka hijau publik untuk perhelatan upacara kemerdekaan dan turnamen antar-dusun.",
    jamBuka: "Terbuka untuk Umum",
    status: "Fasilitas Umum",
    iconType: "Landmark",
  },
  {
    id: 8,
    nama: "Mata Air Alami Cikaduran & Bak Konservasi",
    kategori: "alam",
    dusun: "Wage",
    koordinat: "7°00'15.4\"S 108°33'24.8\"E",
    elevasi: "338 mdpl",
    alamat: "Lereng Bukit Cikaduran, Dusun Wage",
    deskripsi: "Sumber mata air alami purba berkualitas tinggi dari resapan lereng Gunung Ciremai yang mengalirkan air bersih untuk kebutuhan 3 dusun desa.",
    jamBuka: "Kawasan Konservasi Air Bersih (24 Jam)",
    status: "Fasilitas Umum",
    iconType: "Droplets",
  },
  {
    id: 9,
    nama: "Posyandu Melati II Dusun Wage",
    kategori: "kesehatan",
    dusun: "Wage",
    koordinat: "7°00'10.2\"S 108°33'20.5\"E",
    elevasi: "325 mdpl",
    alamat: "Dusun Wage RT 02 / RW 03",
    deskripsi: "Pusat pemantauan kesehatan ibu hamil, pemeriksaan tensi lansia, dan skrining berkala gizi balita kawasan Dusun Wage.",
    jamBuka: "Senin Kedua Setiap Bulan (08.30 - 12.00 WIB)",
    status: "Aktif Melayani",
    iconType: "Activity",
  },
  {
    id: 10,
    nama: "Sentra Peternakan Sapi Rakyat Dusun Wage",
    kategori: "ekonomi",
    dusun: "Wage",
    koordinat: "7°00'20.1\"S 108°33'28.3\"E",
    elevasi: "340 mdpl",
    alamat: "Blok Pasir Kiara, Dusun Wage",
    deskripsi: "Kompleks kandang komunal peternakan sapi perah & potong terpadu binaan dinas peternakan dengan instalasi biogas ramah lingkungan.",
    jamBuka: "Setiap Hari: 06.00 - 17.30 WIB",
    status: "Aktif Melayani",
    iconType: "Layers",
  },
];

export const DUSUN_REGISTRY_DATA: Record<
  "all" | "manis" | "pahing" | "wage",
  {
    tag: string;
    name: string;
    sub: string;
    lead: string;
    leadRole: string;
    area: string;
    kk: string;
    pop: string;
    coords: string;
    desc: string;
    facilities: { name: string; dusun: string }[];
  }
> = {
  all: {
    tag: "Wilayah Administratif",
    name: "Desa Kadurama",
    sub: "Kecamatan Ciawigebang, Kabupaten Kuningan",
    lead: "Samir Syarifudin",
    leadRole: "Kepala Desa Kadurama",
    area: "89.0 Hektar",
    kk: "492 KK",
    pop: "1.720 Jiwa",
    coords: "-6.9782, 108.5982",
    desc: "Kawasan pedesaan agraris mandiri di lereng timur Gunung Ciremai seluas 89 Ha (termasuk tanah perhutani: 42 Ha Sawah & 47 Ha Darat) yang terbagi dalam 3 Dusun: Dusun I Pahing (27 Ha), Dusun II Wage (23 Ha), dan Dusun III Manis (39 Ha).",
    facilities: [
      { name: "Lapangan Sepakbola Gelora Kadurama", dusun: "Dusun I Pahing" },
      { name: "Mata Air Cikaduran, Masjid & Pesantren", dusun: "Dusun II Wage" },
      { name: "Kantor Balai Desa, KUA & SD", dusun: "Dusun III Manis" },
    ],
  },
  pahing: {
    tag: "Dusun I (Pertanian & Olahraga)",
    name: "Dusun Pahing",
    sub: "Lumbung Pangan & Gelora Olahraga Desa",
    lead: "Trida Sentosa",
    leadRole: "Kepala Dusun I Pahing",
    area: "27.0 Hektar",
    kk: "162 KK",
    pop: "548 Jiwa",
    coords: "-6.9785, 108.6020",
    desc: "Dusun pertama dengan luas wilayah ± 27 Ha (3 RT / 1 RW). Menjadi lumbung pangan padi sawah desa, lapangan sepakbola kebanggaan desa, 2 mushola, SD, TK, dan Posyandu.",
    facilities: [
      { name: "Lapangan Sepakbola Gelora Kadurama", dusun: "Dusun Pahing" },
      { name: "Gedung SD & TK Tunas Mandiri", dusun: "Dusun Pahing" },
      { name: "2 Mushola & Posyandu Dusun Pahing", dusun: "Dusun Pahing" },
    ],
  },
  wage: {
    tag: "Dusun II (Konservasi & Religi)",
    name: "Dusun Wage",
    sub: "Mata Air Cikaduran & Pendidikan Santri",
    lead: "Andri Rukmana",
    leadRole: "Kepala Dusun II Wage",
    area: "23.0 Hektar",
    kk: "146 KK",
    pop: "492 Jiwa",
    coords: "-6.9825, 108.5955",
    desc: "Dusun kedua dengan luas wilayah ± 23 Ha (2 RT / 1 RW). Zona konservasi mata air alami Cikaduran 45 L/dtk, dilengkapi fasilitas 1 masjid, 1 mushola, pondok pesantren, PAUD, dan Posyandu.",
    facilities: [
      { name: "Mata Air Alami Cikaduran 45 L/s", dusun: "Dusun Wage" },
      { name: "Masjid Baiturrahman & 1 Mushola", dusun: "Dusun Wage" },
      { name: "Pondok Pesantren, PAUD & Posyandu", dusun: "Dusun Wage" },
    ],
  },
  manis: {
    tag: "Dusun III (Pemerintahan & Pelayanan Publik)",
    name: "Dusun Manis",
    sub: "Pusat Pelayanan Publik, Balai Desa & KUA",
    lead: "Jamaludin",
    leadRole: "Kepala Dusun III Manis",
    area: "39.0 Hektar",
    kk: "184 KK",
    pop: "680 Jiwa",
    coords: "-6.9755, 108.5980",
    desc: "Dusun ketiga dengan luas wilayah terbesar ± 39 Ha (3 RT / 1 RW). Sentra administrasi Kantor Balai Desa, KUA, gedung SD, 4 mushola, 1 pesantren, dan Posyandu.",
    facilities: [
      { name: "Kantor Urusan Agama (KUA) & Balai Desa", dusun: "Dusun Manis" },
      { name: "Gedung SDN 1 Kadurama & 1 Pesantren", dusun: "Dusun Manis" },
      { name: "Jaringan 4 Unit Mushola & Posyandu", dusun: "Dusun Manis" },
    ],
  },
};

// =========================================================================
// 3B. PANDUAN LAYANAN & ADMINISTRASI WARGA (DATA DOSSIER RESMI)
// =========================================================================
export interface CivicServiceItem {
  id: string;
  code: string;
  title: string;
  category: string;
  badge: string;
  desc: string;
  steps: { step: string; title: string; desc: string }[];
  requirements: string[];
}

export const CIVIC_SERVICES_DATA: CivicServiceItem[] = [
  {
    id: "surat-sktm",
    code: "SKTM",
    title: "Surat Keterangan Tidak Mampu (SKTM)",
    category: "Kesejahteraan",
    badge: "Prioritas DTKS",
    desc: "Surat keterangan resmi keadaan ekonomi keluarga pemohon untuk pengajuan beasiswa (KIP Kuliah), keringanan biaya pendidikan, jaminan kesehatan, atau bantuan sosial.",
    steps: [
      { step: "1", title: "Persiapan Berkas", desc: "Siapkan fotokopi KK dan cantumkan maksud/tujuan pengajuan permohonan SKTM." },
      { step: "2", title: "Verifikasi Loket Balai Desa", desc: "Bawa berkas fisik ke loket Balai Desa Kadurama untuk verifikasi berkas." },
      { step: "3", title: "Pengesahan Kuwu", desc: "Surat resmi dicetak berkop desa dan disahkan Kepala Desa Kadurama beserta stempel basah." },
    ],
    requirements: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Maksud / Tujuan Permohonan",
    ],
  },
  {
    id: "surat-sku",
    code: "SKU",
    title: "Surat Keterangan Usaha (SKU)",
    category: "Usaha",
    badge: "Validasi Usaha",
    desc: "Keterangan legalitas kegiatan usaha warga di wilayah Desa Kadurama untuk permohonan Kredit Usaha Rakyat (KUR), izin edar, atau legalitas izin usaha UMKM.",
    steps: [
      { step: "1", title: "Persiapan Berkas", desc: "Bawa fotokopi KK dan cantumkan maksud/tujuan kegiatan usaha yang dijalankan." },
      { step: "2", title: "Verifikasi Loket", desc: "Petugas loket memverifikasi data kependudukan dan kegiatan usaha pemohon." },
      { step: "3", title: "Penerbitan Surat Resmi", desc: "Kasi Pelayanan mencetak SKU resmi bertandatangan Kepala Desa dan stempel basah." },
    ],
    requirements: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Maksud / Tujuan Usaha",
    ],
  },
  {
    id: "surat-kematian",
    code: "SK-Kematian",
    title: "Surat Keterangan Kematian",
    category: "Kependudukan",
    badge: "Tertib Administrasi",
    desc: "Surat keterangan resmi pencatatan peristiwa kematian warga di Desa Kadurama untuk dasar pembuatan Akta Kematian, perbankan, pensiun, atau hak waris.",
    steps: [
      { step: "1", title: "Lapor ke Balai Desa", desc: "Keluarga membawa KK almarhum dan menyampaikan rincian tanggal serta waktu wafat." },
      { step: "2", title: "Pencatatan Register", desc: "Petugas loket meregistrasi data peristiwa kematian ke buku register kependudukan desa." },
      { step: "3", title: "Penerbitan Surat", desc: "Surat Keterangan Kematian resmi diterbitkan dan disahkan Kepala Desa Kadurama." },
    ],
    requirements: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Tanggal Kematian",
      "Keterangan Waktu Kematian",
    ],
  },
  {
    id: "surat-kelahiran",
    code: "SK-Lahir",
    title: "Surat Keterangan Lahir",
    category: "Kependudukan",
    badge: "Pencatatan Sipil",
    desc: "Surat keterangan pencatatan kelahiran anak warga Desa Kadurama sebagai pengantar resmi pembuatan Akta Kelahiran dan penambahan anggota KK di Disdukcapil.",
    steps: [
      { step: "1", title: "Bawa Dokumen", desc: "Orang tua membawa KK, nama kedua orang tua kandung, serta tanggal dan waktu kelahiran bayi." },
      { step: "2", title: "Register Kelahiran", desc: "Petugas desa mencatat data kelahiran ke buku register kelahiran desa." },
      { step: "3", title: "Pengesahan Kuwu", desc: "Penerbitan surat pengantar kelahiran bertandatangan Kepala Desa Kadurama." },
    ],
    requirements: [
      "Fotokopi Kartu Keluarga (KK)",
      "Nama Ibu & Bapak Kandung",
      "Keterangan Tanggal Lahir",
      "Keterangan Waktu Lahir",
    ],
  },
  {
    id: "surat-tanah",
    code: "SK-Tanah",
    title: "Surat Keterangan Tanah",
    category: "Pertanahan",
    badge: "Letter C Desa",
    desc: "Surat keterangan resmi kepemilikan dan riwayat bidang tanah di Desa Kadurama untuk pensertifikatan, perbankan, atau urusan jual beli/hibah.",
    steps: [
      { step: "1", title: "Bawa Berkas Fisik", desc: "Bawa fotokopi KK, lembar SPPT PBB tahun berjalan, dan sampaikan maksud pengurusan tanah." },
      { step: "2", title: "Cek Buku Letter C", desc: "Pamong memeriksa kesesuaian nomor persil, luas tanah, dan riwayat kepemilikan di Buku C desa." },
      { step: "3", title: "Penerbitan Surat", desc: "Surat keterangan tanah resmi diterbitkan dan ditandatangani oleh Kepala Desa." },
    ],
    requirements: [
      "Fotokopi Kartu Keluarga (KK)",
      "Surat Pemberitahuan Pajak Terhutang (SPPT)",
      "Keterangan Tujuan / Maksud",
    ],
  },
  {
    id: "surat-domisili",
    code: "SK-Domisili",
    title: "Surat Keterangan Domisili",
    category: "Kependudukan",
    badge: "Verifikasi Wilayah",
    desc: "Keterangan domisili tempat tinggal resmi bagi warga di wilayah Desa Kadurama untuk kelengkapan administrasi perbankan, sekolah, atau kepegawaian.",
    steps: [
      { step: "1", title: "Bawa Berkas Identitas", desc: "Bawa fotokopi KK dan sebutkan alamat tinggal saat ini di wilayah Kadurama." },
      { step: "2", title: "Verifikasi Wilayah", desc: "Petugas loket memvalidasi alamat domisili pemohon sesuai RT/RW dan Dusun." },
      { step: "3", title: "Pengesahan Kuwu", desc: "Surat keterangan domisili diterbitkan dan disahkan langsung oleh Kepala Desa." },
    ],
    requirements: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Bersangkutan Tinggal di Mana",
    ],
  },
];

// =========================================================================
// 4. KABAR DESA & APBDES DATA
// =========================================================================
interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  category: "Pemerintahan" | "Bansos" | "Pembangunan" | "Kesehatan" | "Kegiatan";
  date: string;
  author: string;
  summary: string;
  status: "Terbit" | "Draf";
  imageUrl: string;
}

const INITIAL_NEWS: NewsItem[] = [
  {
    id: "NEWS-001",
    title: "Musyawarah Rencana Kerja Pemerintah Desa (RKPDes) Tahun 2027 Berjalan Lancar",
    category: "Pemerintahan",
    date: "12 September 2026",
    author: "Sekretaris Desa",
    summary: "Kepala Desa bersama BPD dan 3 Kepala Dusun menyepakati prioritas pembangunan jalan usaha tani dan penuntasan RTLH untuk tahun depan.",
    status: "Terbit",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "NEWS-002",
    title: "Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Triwulan III Tepat Sasaran",
    category: "Bansos",
    date: "08 September 2026",
    author: "Kasi Kesejahteraan",
    summary: "Sebanyak 45 Keluarga Penerima Manfaat (KPM) kategori Desil 1 & 2 dari Dusun Manis, Pahing, dan Wage menerima bantuan tunai.",
    status: "Terbit",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "NEWS-003",
    title: "Peningkatan Kapasitas Posyandu dan Skrining Gizi Balai Dusun Pahing",
    category: "Kesehatan",
    date: "03 September 2026",
    author: "Bidan Desa & Kader PKK",
    summary: "Pemerintah Desa Kadurama menggencarkan penimbangan balita dan pemberian makanan tambahan guna mempertahankan zero stunting.",
    status: "Terbit",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "NEWS-004",
    title: "Rehabilitasi Drainase Lingkungan Dusun Wage Memasuki Tahap Penyelesaian",
    category: "Pembangunan",
    date: "28 Agustus 2026",
    author: "Kaur Pembangunan",
    summary: "Pembangunan saluran drainase sepanjang 320 meter di Dusun Wage berhasil menuntaskan masalah limpasan air saat musim hujan.",
    status: "Terbit",
    imageUrl: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "NEWS-005",
    title: "Pelatihan Keterampilan Digital dan Pembukuan Bagi Pengrajin Olahan Ubi Kuningan",
    category: "Kegiatan",
    date: "22 Agustus 2026",
    author: "Pendamping Desa",
    summary: "Sebanyak 25 pelaku UMKM Desa Kadurama mendapatkan pelatihan pemasaran digital dan integrasi barcode QRIS untuk ekspansi usaha.",
    status: "Terbit",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "NEWS-006",
    title: "Rencana Pembentukan Pos Pelayanan Terpadu Bencana Tingkat Desa Kadurama",
    category: "Pemerintahan",
    date: "15 Agustus 2026",
    author: "Sekretaris Desa",
    summary: "Pemerintah desa mempersiapkan pos siaga bencana berbasis dusun untuk mitigasi dini terhadap potensi cuaca ekstrem lereng Ciremai.",
    status: "Draf",
    imageUrl: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80",
  },
];

interface APBDesBidang {
  id: number;
  nama: string;
  persen: number;
  pagu: number;
  realisasi: number;
  keterangan: string;
}

const INITIAL_APBDES_BIDANG: APBDesBidang[] = [
  {
    id: 1,
    nama: "Penyelenggaraan Pemdes",
    persen: 85,
    pagu: 485600000,
    realisasi: 412760000,
    keterangan: "Siltap pamong, operasional kantor balai desa, kearsipan, dan operasional BPD.",
  },
  {
    id: 2,
    nama: "Pelaksanaan Pembangunan",
    persen: 78,
    pagu: 562400000,
    realisasi: 438672000,
    keterangan: "Rabat beton jalan tani Dusun Pahing, drainase pemukiman, dan renovasi poskesdes.",
  },
  {
    id: 3,
    nama: "Pembinaan Kemasyarakatan",
    persen: 88,
    pagu: 145000000,
    realisasi: 127600000,
    keterangan: "Kegiatan keagamaan, pembinaan linmas desa, dan sarana olahraga Karang Taruna.",
  },
  {
    id: 4,
    nama: "Pemberdayaan Masyarakat",
    persen: 81,
    pagu: 185800000,
    realisasi: 150498000,
    keterangan: "Pelatihan UMKM olahan pangan lokal dan bantuan modal bibit sapi perah dusun wage.",
  },
  {
    id: 5,
    nama: "Penanggulangan Bencana & Darurat",
    persen: 75,
    pagu: 84000000,
    realisasi: 63000000,
    keterangan: "Bantuan darurat keluarga pra-sejahtera dan kesiapsiagaan mitigasi cuaca ekstrem.",
  },
];

// =========================================================================
// 5. REUSABLE PAGINATION COMPONENT
// =========================================================================
function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25],
}: {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white border-t border-slate-200 text-xs text-slate-600 rounded-b-2xl select-none">
      <div className="flex items-center gap-2">
        <span className="text-slate-500">Tampilkan:</span>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="px-2 py-1 rounded-lg border border-slate-300 bg-slate-50 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#009388]"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} baris
            </option>
          ))}
        </select>
        <span className="text-slate-300">|</span>
        <span>
          Menampilkan <strong className="text-slate-900">{startItem}</strong> -{" "}
          <strong className="text-slate-900">{endItem}</strong> dari{" "}
          <strong className="text-slate-900">{totalItems}</strong> data
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-[11px] flex items-center gap-1 transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Sebelumnya</span>
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition ${currentPage === p
                ? "bg-[#009388] text-white shadow-2xs"
                : "hover:bg-slate-100 text-slate-700"
                }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-[11px] flex items-center gap-1 transition"
        >
          <span>Selanjutnya</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}


// =========================================================================
// 6. MAIN HOME COMPONENT
// =========================================================================
export default function Home() {
  const router = useRouter();
  // Navigation & View States
  const [view, setView] = useState<"public" | "admin">("public");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(null);

  // Desktop Dropdown State with Intent-Aware Hover Timer
  const [siteSearchQuery, setSiteSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleDropdownEnter = (id: string) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setActiveDropdown(id);
  };

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleDropdownToggle = (id: string) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  // Public Dusun Showcase State (Infinite Seamless Carousel)
  const [dusunTrackIndex, setDusunTrackIndex] = useState(1); // 1 = Manis, 2 = Pahing, 3 = Wage (0 & 4 are clones)
  const [isDusunTransitioning, setIsDusunTransitioning] = useState(true);
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDusunHoveredRef = useRef(false);

  // Active Real Index (0 = Manis, 1 = Pahing, 2 = Wage)
  const currentDusunRealIndex =
    dusunTrackIndex === 0 ? 2 : dusunTrackIndex === 4 ? 0 : dusunTrackIndex - 1;

  // Function to start or reset the 5-second timer cleanly
  const resetAutoSlideTimer = useCallback(() => {
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
      autoSlideTimerRef.current = null;
    }
    // If currently hovered, do not set new interval (pause)
    if (isDusunHoveredRef.current) return;

    autoSlideTimerRef.current = setInterval(() => {
      if (!isDusunHoveredRef.current) {
        setIsDusunTransitioning(true);
        setDusunTrackIndex((prev) => (prev >= 4 ? 4 : prev + 1));
      }
    }, 5000);
  }, []);

  // When hovering starts: PAUSE timer immediately
  const handleCarouselMouseEnter = () => {
    isDusunHoveredRef.current = true;
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
      autoSlideTimerRef.current = null;
    }
  };

  // When hovering ends: RESUME timer fresh for full 5 seconds
  const handleCarouselMouseLeave = () => {
    isDusunHoveredRef.current = false;
    resetAutoSlideTimer();
  };

  const handleNextDusun = () => {
    if (dusunTrackIndex >= 4) return;
    setIsDusunTransitioning(true);
    setDusunTrackIndex((prev) => prev + 1);
    resetAutoSlideTimer();
  };

  const handlePrevDusun = () => {
    if (dusunTrackIndex <= 0) return;
    setIsDusunTransitioning(true);
    setDusunTrackIndex((prev) => prev - 1);
    resetAutoSlideTimer();
  };

  const handleDotClick = (realIdx: number) => {
    setIsDusunTransitioning(true);
    setDusunTrackIndex(realIdx + 1);
    resetAutoSlideTimer();
  };

  const handleDusunTransitionEnd = () => {
    if (dusunTrackIndex === 4) {
      setIsDusunTransitioning(false);
      setDusunTrackIndex(1);
    } else if (dusunTrackIndex === 0) {
      setIsDusunTransitioning(false);
      setDusunTrackIndex(3);
    }
  };

  // Re-enable smooth transition right after instant repositioning
  useEffect(() => {
    if (!isDusunTransitioning) {
      const timer = setTimeout(() => {
        setIsDusunTransitioning(true);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isDusunTransitioning]);

  // Safety fallback: if transitionEnd is delayed or missed by browser
  useEffect(() => {
    if (dusunTrackIndex === 4) {
      const safetyTimer = setTimeout(() => {
        setIsDusunTransitioning(false);
        setDusunTrackIndex(1);
      }, 650);
      return () => clearTimeout(safetyTimer);
    } else if (dusunTrackIndex === 0) {
      const safetyTimer = setTimeout(() => {
        setIsDusunTransitioning(false);
        setDusunTrackIndex(3);
      }, 650);
      return () => clearTimeout(safetyTimer);
    }
  }, [dusunTrackIndex]);

  // Initialize auto-slide timer on mount, clean up on unmount
  useEffect(() => {
    resetAutoSlideTimer();
    return () => {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
      }
    };
  }, [resetAutoSlideTimer]);

  // Public Map & Facility State
  const [activeFacilityId, setActiveFacilityId] = useState<number>(1);
  const [facilityCategoryFilter, setFacilityCategoryFilter] = useState<
    "all" | "pemerintahan" | "kesehatan" | "pendidikan" | "ekonomi" | "alam"
  >("all");
  const [apbdesFilter, setApbdesFilter] = useState<"all" | "pendapatan" | "belanja">("all");
  const [activeServiceKey, setActiveServiceKey] = useState<string>("surat-sktm");

  // Public GIS Map State (Satellite-Only with Official Boundaries)
  const [gisSelectedDusun, setGisSelectedDusun] = useState<"all" | "manis" | "pahing" | "wage">("all");
  const [gisSelectedPoiId, setGisSelectedPoiId] = useState<number | null>(null);
  const [gisShowOuter, setGisShowOuter] = useState<boolean>(false);
  const [gisShowDusuns, setGisShowDusuns] = useState<boolean>(false);
  const [gisShowWater, setGisShowWater] = useState<boolean>(true);

  // Admin Panel States
  const [adminTab, setAdminTab] = useState<
    "sensus" | "residents" | "berita" | "apbdes"
  >("sensus");
  const [adminKadusRole, setAdminKadusRole] = useState<"all" | "Manis" | "Pahing" | "Wage">("all");

  // Master Data Kependudukan States (3 Dusun)
  const [residentsList, setResidentsList] = useState<Resident[]>(INITIAL_RESIDENTS_ARRAY);
  const [residentDusunFilter, setResidentDusunFilter] = useState<string>("all");
  const [residentSearch, setResidentSearch] = useState("");
  const [residentCurrentPage, setResidentCurrentPage] = useState(1);
  const [residentPageSize, setResidentPageSize] = useState(10);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [isEditResidentModalOpen, setIsEditResidentModalOpen] = useState(false);
  const [syncNotification, setSyncNotification] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Sensus & SDGs Keluarga States
  const [sensusList, setSensusList] = useState<SensusKK[]>(INITIAL_SENSUS_KK);
  const [sensusDusunFilter, setSensusDusunFilter] = useState<string>("all");
  const [sensusDesilFilter, setSensusDesilFilter] = useState<string>("all");
  const [sensusPbbFilter, setSensusPbbFilter] = useState<string>("all");
  const [sensusProgramFilter, setSensusProgramFilter] = useState<string>("all");
  const [sensusSearch, setSensusSearch] = useState("");
  const [sensusCurrentPage, setSensusCurrentPage] = useState(1);
  const [sensusPageSize, setSensusPageSize] = useState(10);

  // Sensus Modals State
  const [selectedSensusForPdf, setSelectedSensusForPdf] = useState<SensusKK | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [editingSensus, setEditingSensus] = useState<SensusKK | null>(null);
  const [isSensusModalOpen, setIsSensusModalOpen] = useState(false);

  // Manajemen Kabar Desa States
  const [newsList, setNewsList] = useState<NewsItem[]>(INITIAL_NEWS);
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<string>("all");
  const [newsStatusFilter, setNewsStatusFilter] = useState<"all" | "Terbit" | "Draf">("all");
  const [newsCurrentPage, setNewsCurrentPage] = useState(1);
  const [newsPageSize, setNewsPageSize] = useState(10);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  // APBDes 2026 Transparansi States
  const [apbdesTotals, setApbdesTotals] = useState({
    pendapatan: 1485240000,
    belanja: 1462800000,
    serapan: 82.4,
  });
  const [apbdesBidangList, setApbdesBidangList] = useState<APBDesBidang[]>(INITIAL_APBDES_BIDANG);
  const [editingBidang, setEditingBidang] = useState<APBDesBidang | null>(null);
  const [isEditBidangModalOpen, setIsEditBidangModalOpen] = useState(false);
  const [isEditTotalsModalOpen, setIsEditTotalsModalOpen] = useState(false);

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

  // Fetch dynamic News & APBDes from Supabase
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const supabase = createClient();
        const [{ data: newsData }, { data: summaryData }, { data: sectorsData }] =
          await Promise.all([
            supabase
              .from("news_articles")
              .select("*")
              .eq("is_deleted", false)
              .order("created_at", { ascending: false }),
            supabase
              .from("apbdes_summary")
              .select("*")
              .eq("tahun", 2026)
              .maybeSingle(),
            supabase
              .from("apbdes_sectors")
              .select("*")
              .eq("is_deleted", false)
              .order("id", { ascending: true }),
          ]);

        if (newsData && newsData.length > 0) {
          setNewsList(
            newsData.map((item: any) => ({
              id: item.id,
              slug: item.slug,
              title: item.title,
              category: item.category as any,
              date: item.date,
              author: item.author,
              summary: item.summary,
              status: item.status,
              imageUrl:
                item.image_url ||
                "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
            }))
          );
        }

        if (summaryData) {
          setApbdesTotals({
            pendapatan: Number(summaryData.total_pendapatan) || 1488500000,
            belanja: Number(summaryData.total_belanja) || 1445000000,
            serapan: Number(summaryData.persen_realisasi_belanja) || 79.5,
          });
        }

        if (sectorsData && sectorsData.length > 0) {
          setApbdesBidangList(
            sectorsData.map((s: any) => ({
              id: s.id,
              nama: s.nama,
              persen: Number(s.persen) || 0,
              pagu: Number(s.pagu) || 0,
              realisasi: Number(s.realisasi) || 0,
              keterangan: s.keterangan || "",
            }))
          );
        }
      } catch (err) {
        console.warn("Gagal memuat landing page data dari Supabase:", err);
      }
    };

    fetchLandingData();
  }, []);

  // Handlers Residents
  const filteredResidents = residentsList.filter((res) => {
    const matchesDusun =
      residentDusunFilter === "all" || res.dusun === residentDusunFilter;
    const matchesSearch =
      !residentSearch.trim() ||
      res.nama.toLowerCase().includes(residentSearch.toLowerCase()) ||
      res.nik.includes(residentSearch) ||
      res.noKk.includes(residentSearch);
    return matchesDusun && matchesSearch;
  });

  const paginatedResidents = filteredResidents.slice(
    (residentCurrentPage - 1) * residentPageSize,
    residentCurrentPage * residentPageSize
  );

  const handleSyncSingleResident = (nik: string) => {
    setResidentsList((prev) =>
      prev.map((r) =>
        r.nik === nik ? { ...r, syncStatus: "Tersinkronisasi" as const } : r
      )
    );
    const target = residentsList.find((r) => r.nik === nik);
    setSyncNotification(
      `Data kependudukan warga ${target?.nama || nik} berhasil disinkronkan dengan SIAK Dukcapil.`
    );
    setTimeout(() => setSyncNotification(null), 3500);
  };

  const handleSyncAllResidents = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      setResidentsList((prev) =>
        prev.map((r) => ({ ...r, syncStatus: "Tersinkronisasi" as const }))
      );
      setIsSyncingAll(false);
      setSyncNotification(
        "Seluruh data kependudukan (3 Dusun) berhasil disinkronkan dengan server SIAK Dukcapil."
      );
      setTimeout(() => setSyncNotification(null), 4000);
    }, 700);
  };

  const handleOpenEditResident = (res: Resident) => {
    setEditingResident({ ...res });
    setIsEditResidentModalOpen(true);
  };

  const handleSaveEditResident = () => {
    if (!editingResident) return;
    setResidentsList((prev) =>
      prev.map((r) =>
        r.nik === editingResident.nik
          ? { ...editingResident, syncStatus: "Diperbarui Internal" as const }
          : r
      )
    );
    setIsEditResidentModalOpen(false);
    setSyncNotification(
      `Perubahan data internal warga ${editingResident.nama} tersimpan dengan sukses.`
    );
    setTimeout(() => setSyncNotification(null), 3500);
  };

  // Handlers Sensus & Profil Keluarga
  const filteredSensus = sensusList.filter((item) => {
    // Role filter
    if (adminKadusRole !== "all" && item.dusun !== adminKadusRole) return false;
    // Dusun filter
    if (sensusDusunFilter !== "all" && item.dusun !== sensusDusunFilter) return false;
    // Desil filter
    if (sensusDesilFilter !== "all" && String(item.desil) !== sensusDesilFilter) return false;
    // PBB filter
    if (sensusPbbFilter !== "all" && item.statusPbb !== sensusPbbFilter) return false;
    // Program filter
    if (sensusProgramFilter === "rtlh" && item.kondisiRumah !== "RTLH") return false;
    if (sensusProgramFilter === "stunting" && !item.kerentanan.adaBalitaStunting) return false;
    if (sensusProgramFilter === "lansia" && !item.kerentanan.adaLansiaTunggal) return false;
    if (sensusProgramFilter === "bansos" && item.bansosAktif === "Tidak Ada (Non-Bansos)") return false;
    if (sensusProgramFilter === "non-bansos" && item.bansosAktif !== "Tidak Ada (Non-Bansos)") return false;
    // Search filter
    if (sensusSearch.trim()) {
      const q = sensusSearch.toLowerCase();
      const matchKk = item.noKk.includes(q);
      const matchNik = item.nikKepalaKeluarga.includes(q);
      const matchNama = item.namaKepalaKeluarga.toLowerCase().includes(q);
      if (!matchKk && !matchNik && !matchNama) return false;
    }
    return true;
  });

  const paginatedSensus = filteredSensus.slice(
    (sensusCurrentPage - 1) * sensusPageSize,
    sensusCurrentPage * sensusPageSize
  );

  // Export Sensus to CSV / Excel
  const handleExportSensusExcel = () => {
    const headers = [
      "No",
      "No. KK",
      "NIK Kepala Keluarga",
      "Nama Kepala Keluarga",
      "Dusun",
      "RT",
      "RW",
      "Alamat",
      "Jumlah Anggota",
      "Desil Kesejahteraan",
      "Status PBB 2026",
      "Nominal PBB (Rp)",
      "Kondisi Rumah",
      "Status Kepemilikan",
      "Luas Lantai (m2)",
      "Dinding",
      "Lantai",
      "Atap",
      "Sanitasi / Jamban",
      "Sumber Air",
      "Daya Listrik",
      "Pekerjaan Utama",
      "Penghasilan Bulanan",
      "Kepemilikan Lahan",
      "Lansia Tunggal",
      "Balita Stunting",
      "Disabilitas",
      "Bansos Aktif",
      "Surveyor Kadus",
      "Tanggal Sensus",
      "Catatan Verifikasi",
    ];

    const rows = filteredSensus.map((item, idx) => [
      idx + 1,
      `'${item.noKk}`,
      `'${item.nikKepalaKeluarga}`,
      `"${item.namaKepalaKeluarga}"`,
      item.dusun,
      item.rt,
      item.rw,
      `"${item.alamat}"`,
      item.jumlahAnggota,
      `Desil ${item.desil}`,
      item.statusPbb,
      item.nominalPbb,
      item.kondisiRumah,
      item.statusKepemilikanRumah,
      item.luasLantai,
      `"${item.dinding}"`,
      `"${item.lantai}"`,
      `"${item.atap}"`,
      `"${item.jambanSanitasi}"`,
      `"${item.sumberAir}"`,
      item.dayaListrik,
      `"${item.pekerjaanUtama}"`,
      `"${item.penghasilanBulanan}"`,
      `"${item.kepemilikanLahan}"`,
      item.kerentanan.adaLansiaTunggal ? "Ya" : "Tidak",
      item.kerentanan.adaBalitaStunting ? "Ya" : "Tidak",
      item.kerentanan.adaDisabilitas ? "Ya" : "Tidak",
      `"${item.bansosAktif}"`,
      `"${item.surveyorKadus}"`,
      item.tanggalSensus,
      `"${item.catatanVerifikasi}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `sensus_keluarga_desa_kadurama_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenCreateSensus = () => {
    setEditingSensus({
      id: `SN-00${sensusList.length + 1}`,
      noKk: "",
      nikKepalaKeluarga: "",
      namaKepalaKeluarga: "",
      dusun: adminKadusRole === "all" ? "Manis" : adminKadusRole,
      rt: "01",
      rw: "01",
      alamat: "Desa Kadurama",
      jumlahAnggota: 4,
      desil: 3,
      statusPbb: "Belum Lunas",
      tahunPbb: 2026,
      nominalPbb: 50000,
      kondisiRumah: "Layak Huni",
      statusKepemilikanRumah: "Milik Sendiri",
      luasLantai: 60,
      dinding: "Tembok Permanen",
      lantai: "Keramik / Granit",
      atap: "Genteng Baik",
      jambanSanitasi: "Jamban Sendiri (Septic Tank)",
      sumberAir: "PDAM / Sumur Bor Bersih",
      dayaListrik: "900 VA",
      pekerjaanUtama: "Petani Padi Sawah",
      penghasilanBulanan: "Rp 1.000.000 - Rp 2.000.000",
      kepemilikanLahan: "Lahan Sawah Sendiri",
      kerentanan: {
        adaLansiaTunggal: false,
        adaBalitaStunting: false,
        adaDisabilitas: false,
        adaAnakPutusSekolah: false,
      },
      bansosAktif: "Tidak Ada (Non-Bansos)",
      surveyorKadus:
        adminKadusRole === "Manis"
          ? "Jamaludin (Kadus Manis)"
          : adminKadusRole === "Pahing"
            ? "Trida Sentosa (Kadus Pahing)"
            : adminKadusRole === "Wage"
              ? "Andri Rukmana (Kadus Wage)"
              : "Operator Balai Desa",
      tanggalSensus: "15 September 2026",
      catatanVerifikasi: "Hasil sensus verifikasi lapangan oleh Kepala Dusun.",
    });
    setIsSensusModalOpen(true);
  };

  const handleOpenEditSensus = (item: SensusKK) => {
    setEditingSensus({ ...item });
    setIsSensusModalOpen(true);
  };

  const handleSaveSensus = () => {
    if (!editingSensus) return;
    if (!editingSensus.noKk || !editingSensus.namaKepalaKeluarga) {
      alert("Nomor KK dan Nama Kepala Keluarga wajib diisi!");
      return;
    }

    // Auto-calculate Desil before saving
    const autoDesil = calculateDesil(
      editingSensus.dinding,
      editingSensus.lantai,
      editingSensus.penghasilanBulanan,
      editingSensus.luasLantai,
      editingSensus.jumlahAnggota
    );

    const updated = {
      ...editingSensus,
      desil: autoDesil,
      kondisiRumah:
        editingSensus.lantai === "Tanah" ||
          editingSensus.dinding === "Bilik Bambu / Papan" ||
          editingSensus.atap === "Rumbia / Lapuk"
          ? ("RTLH" as const)
          : ("Layak Huni" as const),
    };

    setSensusList((prev) => {
      const exists = prev.some((s) => s.id === updated.id);
      if (exists) {
        return prev.map((s) => (s.id === updated.id ? updated : s));
      } else {
        return [updated, ...prev];
      }
    });

    setIsSensusModalOpen(false);
    setEditingSensus(null);
    setSyncNotification(
      `Data sensus keluarga ${updated.namaKepalaKeluarga} berhasil disimpan dengan evaluasi Desil ${updated.desil}.`
    );
    setTimeout(() => setSyncNotification(null), 3500);
  };

  const handleDeleteSensus = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data sensus keluarga ini?")) {
      setSensusList((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleOpenPdfModal = (item: SensusKK) => {
    setSelectedSensusForPdf(item);
    setIsPdfModalOpen(true);
  };

  // Handlers News
  const handleToggleNewsStatus = (id: string) => {
    setNewsList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Terbit" ? "Draf" : "Terbit" }
          : item
      )
    );
  };

  const handleDeleteNews = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel kabar desa ini?")) {
      setNewsList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleOpenCreateNews = () => {
    setEditingNews({
      id: `NEWS-00${newsList.length + 1}`,
      title: "",
      category: "Pemerintahan",
      date: "15 September 2026",
      author: "Kasi Pelayanan",
      summary: "",
      status: "Terbit",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
    });
    setIsNewsModalOpen(true);
  };

  const handleOpenEditNews = (news: NewsItem) => {
    setEditingNews({ ...news });
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = () => {
    if (!editingNews || !editingNews.title.trim()) {
      alert("Judul artikel berita wajib diisi!");
      return;
    }
    setNewsList((prev) => {
      const exists = prev.some((n) => n.id === editingNews.id);
      if (exists) {
        return prev.map((n) => (n.id === editingNews.id ? editingNews : n));
      } else {
        return [editingNews, ...prev];
      }
    });
    setIsNewsModalOpen(false);
    setEditingNews(null);
  };

  const filteredNews = newsList.filter((item) => {
    const matchesCategory =
      newsCategoryFilter === "all" || item.category === newsCategoryFilter;
    const matchesStatus =
      newsStatusFilter === "all" || item.status === newsStatusFilter;
    return matchesCategory && matchesStatus;
  });

  const paginatedNews = filteredNews.slice(
    (newsCurrentPage - 1) * newsPageSize,
    newsCurrentPage * newsPageSize
  );

  // APBDes Handlers
  const handleOpenEditBidang = (bidang: APBDesBidang) => {
    setEditingBidang({ ...bidang });
    setIsEditBidangModalOpen(true);
  };

  const handleSaveBidang = () => {
    if (!editingBidang) return;
    const persen = Math.round((editingBidang.realisasi / editingBidang.pagu) * 100);
    const updated = { ...editingBidang, persen };
    const updatedList = apbdesBidangList.map((b) =>
      b.id === updated.id ? updated : b
    );
    setApbdesBidangList(updatedList);

    const totalPaguBelanja = updatedList.reduce((acc, curr) => acc + curr.pagu, 0);
    const totalRealisasi = updatedList.reduce((acc, curr) => acc + curr.realisasi, 0);
    const serapan = Number(((totalRealisasi / totalPaguBelanja) * 100).toFixed(1));
    setApbdesTotals((prev) => ({
      ...prev,
      belanja: totalPaguBelanja,
      serapan,
    }));
    setIsEditBidangModalOpen(false);
  };

  // Facility filter for interactive map
  const filteredFacilities = VILLAGE_FACILITIES.filter((f) => {
    if (facilityCategoryFilter === "all") return true;
    return f.kategori === facilityCategoryFilter;
  });

  const selectedFacility =
    VILLAGE_FACILITIES.find((f) => f.id === activeFacilityId) ||
    VILLAGE_FACILITIES[0];

  // Calculated Stats for Sensus
  const totalKkCount = sensusList.length;
  const lunasPbbCount = sensusList.filter((s) => s.statusPbb === "Lunas").length;
  const lunasPbbPercent = totalKkCount > 0 ? Math.round((lunasPbbCount / totalKkCount) * 100) : 0;
  const desilRentanCount = sensusList.filter((s) => s.desil === 1 || s.desil === 2).length;
  const rtlhCount = sensusList.filter((s) => s.kondisiRumah === "RTLH").length;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      {/* =================================================================== */}
      {/* NAVBAR 2-BARIS (HANYA MUNCUL DI PORTAL PUBLIK, BUKAN DI PANEL ADMIN)*/}
      {/* =================================================================== */}
      <CivicNavbar />



      {/* =================================================================== */}
      {/* VIEW 1: PORTAL PUBLIK DESA KADURAMA                                */}
      {/* =================================================================== */}

      <main className="flex-1">
        {/* =============================================================== */}
        {/* HERO SECTION DENGAN ORNAMEN GERBANG KUNINGAN & CIVIC COCKPIT     */}
        {/* =============================================================== */}
        <section
          id="beranda"
          className="min-h-[calc(100vh-110px)] flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#003733] via-[#005851] to-[#009388] text-white pt-14 sm:pt-20 pb-0"
        >
          {/* 1. Subtle Decorative Mesh & Golden Ambient Glows */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-[550px] h-[550px] bg-[#eda50c]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#009388]/30 rounded-full blur-3xl pointer-events-none" />

          {/* 2. Landmark Gerbang Kuningan Asri (2x Size di Tengah, Kiri Kanan Putih Menyatu Tanpa Blocking) */}
          <div className="absolute inset-x-0 bottom-0 w-full flex items-end justify-center pointer-events-none select-none z-0 mix-blend-multiply opacity-80 overflow-hidden">
            <img
              src="/kuningan-gate-wide.png"
              alt="Landmark Gerbang Kuningan Asri"
              className="w-full h-[280px] sm:h-[320px] md:h-[360px] object-cover object-bottom select-none [mask-image:linear-gradient(to_top,black_80%,transparent)] filter brightness-105 contrast-110"
            />
          </div>

          {/* Main Hero Container */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Kolom Kiri: Narrative & Clear Civic Focus (Col 7) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Eyebrow Badge (Sesuai index.html dengan aksen emas) */}
                <div
                  id="hero-badge"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#eda50c] text-xs font-bold tracking-wide uppercase shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#eda50c]" />
                  <span>Portal Resmi Informasi & Panduan Layanan Warga</span>
                </div>

                {/* Headline Utama */}
                <h1
                  id="hero-title"
                  className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.14]"
                >
                  Pemerintahan Terbuka &{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eda50c] via-amber-200 to-[#eda50c]">
                    Pelayanan Tertib
                  </span>{" "}
                  Desa Kadurama
                </h1>

                {/* Subtext Ringkas */}
                <p
                  id="hero-desc"
                  className="text-base sm:text-lg text-emerald-50/90 max-w-xl leading-relaxed font-normal"
                >
                  Informasi terpadu seputar profil 3 dusun, akuntabilitas anggaran APBDes 2026, serta pendataan sensus keluarga di lereng Gunung Ciremai.
                </p>

                {/* Tombol Aksi Hero */}
                <div id="hero-actions" className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <a
                    href="#layanan-warga"
                    className="px-6 py-3.5 rounded-xl bg-[#eda50c] hover:bg-[#d99407] text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-950/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Cek Persyaratan Berkas Surat</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#profil-dusun"
                    className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs sm:text-sm backdrop-blur-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-[#eda50c]" />
                    <span>Jelajahi Profil 3 Dusun</span>
                  </a>
                </div>
              </div>

              {/* Kolom Kanan: Highlight Box Kuningan dengan Aksen Kuning Emas Khas (Col 5) */}
              <div className="lg:col-span-5 relative" id="hero-gate-card">
                {/* Amber Accent Ambient Glow */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#eda50c]/30 via-[#009388]/20 to-transparent rounded-3xl blur-2xl pointer-events-none" />

                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 hover:border-[#eda50c]/50 transition-all duration-300 shadow-2xl space-y-5 text-white">
                  {/* Top Gold Accent Bar */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#eda50c] to-transparent rounded-t-3xl" />

                  {/* Header Card: KD Emblem + Pemerintah Desa */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/15">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#eda50c] text-slate-950 flex items-center justify-center font-extrabold text-lg shadow-lg shadow-[#eda50c]/30 flex-shrink-0">
                        KD
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-[#eda50c]">
                          Pemerintah Desa
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-white">
                          Kadurama, Ciawigebang
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eda50c]/20 border border-[#eda50c]/40 text-[#eda50c] text-[10px] font-bold">
                      <Award className="w-3 h-3" />
                      <span>Desa Mandiri</span>
                    </span>
                  </div>

                  {/* Point List with Yellow Accent Checkmarks (from index.html) */}
                  <div className="space-y-3.5 text-xs text-emerald-50">
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#eda50c] font-bold text-sm leading-none mt-0.5">✓</span>
                      <div>
                        <div className="font-bold text-white text-xs sm:text-[13px]">
                          Layanan Langsung di Kantor Desa
                        </div>
                        <div className="text-[11px] text-emerald-100/80 mt-0.5 leading-relaxed">
                          Warga datang langsung membawa syarat dokumen asli dan fotokopi ke loket pemdes.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="text-[#eda50c] font-bold text-sm leading-none mt-0.5">✓</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-white text-xs sm:text-[13px]">
                            Jam Buka Loket Kantor
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Buka
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-100/80 mt-0.5">
                          Senin - Jumat pukul 07.30 - 15.00 WIB (Sabtu dan Minggu libur).
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="text-[#eda50c] font-bold text-sm leading-none mt-0.5">✓</span>
                      <div>
                        <div className="font-bold text-white text-xs sm:text-[13px]">
                          Sensus Mikro 3 Dusun Harmonis
                        </div>
                        <div className="text-[11px] text-emerald-100/80 mt-0.5 leading-relaxed">
                          492 Kepala Keluarga dan 1.660 Jiwa terdata lengkap di Dusun Manis, Pahing, dan Wage.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 pt-1 border-t border-white/10">
                      <span className="text-[#eda50c] font-bold text-sm leading-none mt-0.5">✓</span>
                      <div>
                        <div className="font-bold text-white text-xs sm:text-[13px]">
                          Motto Kuningan Terpadu
                        </div>
                        <div className="text-[11px] text-[#eda50c] italic font-medium mt-0.5">
                          &quot;Melesat Ngudag Jaman, Ngakar Kuat Purwadaksi&quot;
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Alamat Balai Desa & Lokasi Link */}
                  <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-100/80">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#eda50c]" />
                      <span>Jl. Desa Kadurama No. 01</span>
                    </span>
                    <a
                      href="#geografis"
                      className="text-[#eda50c] hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Petunjuk Lokasi</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Horizon Metric Strip: Connecting Hero to Next Section */}
          <div className="w-full bg-[#002b27]/90 border-t border-white/15 backdrop-blur-md relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/15">
                {/* 1. Total KK Terdata Sensus */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eda50c]/20 border border-[#eda50c]/35 flex items-center justify-center text-[#eda50c] flex-shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">492 Kepala Keluarga</div>
                    <div className="text-[10px] text-emerald-100/80">1.660 Jiwa (100% Sensus Terdata)</div>
                  </div>
                </div>

                {/* 2. Potensi Pertanian Organik */}
                <div className="flex items-center gap-3 pt-3 md:pt-0 md:pl-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/35 flex items-center justify-center text-emerald-300 flex-shrink-0">
                    <Wheat className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">42 Ha Lahan Sawah</div>
                    <div className="text-[10px] text-emerald-100/80">Lumbung Pangan Dusun Pahing</div>
                  </div>
                </div>

                {/* 3. Potensi Mata Air Cikaduran */}
                <div className="flex items-center gap-3 pt-3 md:pt-0 md:pl-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/35 flex items-center justify-center text-sky-300 flex-shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">45 Liter / Detik</div>
                    <div className="text-[10px] text-emerald-100/80">Mata Air Alami Dusun Wage</div>
                  </div>
                </div>

                {/* 4. Sentra Potensi Ekonomi & UMKM */}
                <div className="flex items-center gap-3 pt-3 md:pt-0 md:pl-4">
                  <div className="w-10 h-10 rounded-xl bg-[#eda50c]/20 border border-[#eda50c]/35 flex items-center justify-center text-[#eda50c] flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">3 Klaster Potensi</div>
                    <div className="text-[10px] text-emerald-100/80">Tani Organik, Sapi & UMKM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 1: PROFIL 3 DUSUN - INFINITE FULL-PHOTO CAROUSEL         */}
        {/* =============================================================== */}
        <section id="profil-dusun" className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#009388_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.05] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:48px_48px] opacity-60 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header Section dengan Subtitle Bersih (Tanpa Tombol Panah Atas) */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Karakteristik & Potensi 3 Dusun
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Eksplorasi panorama dan potensi mikro Desa Kadurama yang terbagi menjadi 3 dusun tradisional saling komplementer di lereng Gunung Ciremai.
              </p>
            </div>

            {/* FULL-PHOTO CINEMATIC CAROUSEL STAGE (INFINITE FORWARD LOOP & AUTO-SLIDE) */}
            <div
              onMouseEnter={handleCarouselMouseEnter}
              onMouseLeave={handleCarouselMouseLeave}
              onTouchStart={handleCarouselMouseEnter}
              onTouchEnd={handleCarouselMouseLeave}
              className="relative overflow-hidden rounded-3xl shadow-2xl bg-slate-950 border border-slate-800 group"
            >
              {/* Floating Left Edge Arrow (Di Dalam Gambar) */}
              <button
                onClick={handlePrevDusun}
                aria-label="Dusun Sebelumnya"
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/45 hover:bg-black/80 border border-white/25 text-white backdrop-blur-md flex items-center justify-center transition shadow-xl active:scale-90 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* Floating Right Edge Arrow (Di Dalam Gambar) */}
              <button
                onClick={handleNextDusun}
                aria-label="Dusun Berikutnya"
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/45 hover:bg-black/80 border border-white/25 text-white backdrop-blur-md flex items-center justify-center transition shadow-xl active:scale-90 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Infinite Seamless Slider Track (5 Slides: Clone 3, Real 1, Real 2, Real 3, Clone 1) */}
              <div
                onTransitionEnd={handleDusunTransitionEnd}
                className="flex"
                style={{
                  transform: `translateX(-${dusunTrackIndex * 100}%)`,
                  transition: isDusunTransitioning ? "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                }}
              >
                {/* ========================================================= */}
                {/* SLIDE 0: CLONE OF DUSUN MANIS (UNTUK SEAMLESS PREV LOOP)  */}
                {/* ========================================================= */}
                <div className="w-full flex-shrink-0 relative min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=85"
                    alt="Panorama Dusun Manis Kadurama"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011715] via-[#011715]/75 to-black/30 lg:bg-gradient-to-r lg:from-[#011715]/95 lg:via-[#011715]/80 lg:to-transparent z-0" />
                  <div className="relative z-10 h-full p-6 sm:p-10 lg:p-14 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3.5 py-1.5 rounded-full bg-[#009388] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                          Dusun III • Manis
                        </span>
                        <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-emerald-200 text-xs font-medium border border-white/15">
                          Sentra Pemerintahan & Pelayanan Publik
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-emerald-200 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                        <Mountain className="w-3.5 h-3.5 text-[#eda50c]" />
                        <span>Elevasi 285 mdpl</span>
                      </div>
                    </div>
                    <div className="my-auto py-6 max-w-2xl space-y-4">
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Dusun Manis
                      </h3>
                      <div className="text-sm sm:text-base font-semibold text-[#eda50c]">
                        Pusat Pelayanan Publik, Kantor Urusan Agama (KUA), SD, Pesantren & 4 Mushola
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200/95 leading-relaxed font-normal max-w-xl">
                        Dusun ketiga dengan luas wilayah terbesar di Desa Kadurama yaitu kurang lebih 39 hektar (3 RT / 1 RW). Sentra administrasi publik menaungi Kantor Balai Desa, KUA, gedung SD, 1 pondok pesantren, 4 unit mushola, serta Posyandu.
                      </p>
                      <div className="border-y border-white/15 py-4 my-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 font-mono">
                        <div><div className="text-2xl sm:text-3xl font-black text-white">184</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Kepala Keluarga</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-[#eda50c]">620</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Jiwa Warga</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-emerald-300">39 Ha</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Luas Wilayah</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-white">3 / 1</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">RT / RW</div></div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Fasilitas Wilayah Terpadu:</div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Building2 className="w-3.5 h-3.5 text-[#009388]" /><span>Balai Desa & Kantor KUA</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Landmark className="w-3.5 h-3.5 text-[#eda50c]" /><span>Gedung SD & 1 Pesantren</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Building2 className="w-3.5 h-3.5 text-amber-300" /><span>4 Unit Mushola Lingkungan</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /><span>Posyandu Dusun Manis</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 text-slate-200">
                        <span className="w-2 h-2 rounded-full bg-[#009388]" />
                        <span>Kepala Dusun III: <strong className="text-white">Bpk. Jamaludin</strong></span>
                        <span className="text-slate-400">• Wilayah Kerja RT 01 s.d. RT 03 / RW 01</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <a
                          href="/dusun/manis"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs border border-white/30 backdrop-blur-xs transition"
                        >
                          <span>Buka Halaman Dusun</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href="#geografis"
                          onClick={() => {
                            setActiveFacilityId(1);
                            setGisSelectedDusun("manis");
                            setGisSelectedPoiId(null);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-lg transition"
                        >
                          <MapPin className="w-3.5 h-3.5" /><span>Peta GIS</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* SLIDE 1: REAL DUSUN PAHING (DUSUN PERTAMA)                */}
                {/* ========================================================= */}
                <div className="w-full flex-shrink-0 relative min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=85"
                    alt="Panorama Dusun Pahing Kadurama"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011715] via-[#011715]/75 to-black/30 lg:bg-gradient-to-r lg:from-[#011715]/95 lg:via-[#011715]/80 lg:to-transparent z-0" />
                  <div className="relative z-10 h-full p-6 sm:p-10 lg:p-14 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3.5 py-1.5 rounded-full bg-[#eda50c] text-slate-950 text-xs font-bold uppercase tracking-wider shadow-md">
                          Dusun I • Pahing
                        </span>
                        <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-amber-200 text-xs font-medium border border-white/15">
                          Lumbung Pangan & Olahraga Desa
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-amber-200 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                        <Mountain className="w-3.5 h-3.5 text-[#eda50c]" />
                        <span>Elevasi 310 mdpl</span>
                      </div>
                    </div>
                    <div className="my-auto py-6 max-w-2xl space-y-4">
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Dusun Pahing
                      </h3>
                      <div className="text-sm sm:text-base font-semibold text-[#eda50c]">
                        Hamparan Sawah Padi Terpadu, Lapangan Sepakbola & Kompleks Pendidikan Dasar
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200/95 leading-relaxed font-normal max-w-xl">
                        Dusun pertama di Desa Kadurama dengan luas wilayah kurang lebih 27 hektar (3 RT / 1 RW). Menjadi sentra ketahanan pangan padi sawah desa, lapangan sepakbola Gelora Kadurama, 2 unit mushola peribadatan, gedung Sekolah Dasar (SD), TK, serta Posyandu.
                      </p>
                      <div className="border-y border-white/15 py-4 my-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 font-mono">
                        <div><div className="text-2xl sm:text-3xl font-black text-white">162</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Kepala Keluarga</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-[#eda50c]">548</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Jiwa Warga</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-emerald-300">27 Ha</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Luas Wilayah</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-white">3 / 1</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">RT / RW</div></div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Fasilitas Wilayah Terpadu:</div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Award className="w-3.5 h-3.5 text-emerald-300" /><span>Lapangan Sepakbola Gelora</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Landmark className="w-3.5 h-3.5 text-[#eda50c]" /><span>Gedung SD & TK Tunas Bangsa</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Building2 className="w-3.5 h-3.5 text-amber-300" /><span>2 Unit Mushola Peribadatan</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#009388]" /><span>Posyandu Dusun Pahing</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 text-slate-200">
                        <span className="w-2 h-2 rounded-full bg-[#eda50c]" />
                        <span>Kepala Dusun I: <strong className="text-white">Bpk. Trida Sentosa</strong></span>
                        <span className="text-slate-400">• Wilayah Kerja RT 01 s.d. RT 03 / RW 01</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <a
                          href="/dusun/pahing"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs border border-white/30 backdrop-blur-xs transition"
                        >
                          <span>Buka Halaman Dusun</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href="#geografis"
                          onClick={() => {
                            setActiveFacilityId(4);
                            setGisSelectedDusun("pahing");
                            setGisSelectedPoiId(null);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eda50c] hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition"
                        >
                          <MapPin className="w-3.5 h-3.5" /><span>Peta GIS</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* SLIDE 2: REAL DUSUN WAGE (DUSUN KEDUA)                    */}
                {/* ========================================================= */}
                <div className="w-full flex-shrink-0 relative min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85"
                    alt="Panorama Dusun Wage Kadurama"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011715] via-[#011715]/75 to-black/30 lg:bg-gradient-to-r lg:from-[#011715]/95 lg:via-[#011715]/80 lg:to-transparent z-0" />
                  <div className="relative z-10 h-full p-6 sm:p-10 lg:p-14 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3.5 py-1.5 rounded-full bg-[#003733] text-emerald-200 border border-emerald-400/40 text-xs font-bold uppercase tracking-wider shadow-md">
                          Dusun II • Wage
                        </span>
                        <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-emerald-200 text-xs font-medium border border-white/15">
                          Konservasi Air & Kehidupan Religi
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-emerald-200 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                        <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Elevasi 340 mdpl</span>
                      </div>
                    </div>
                    <div className="my-auto py-6 max-w-2xl space-y-4">
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Dusun Wage
                      </h3>
                      <div className="text-sm sm:text-base font-semibold text-emerald-300">
                        Sumber Mata Air Purba Cikaduran 45 L/dtk, Masjid, Mushola, Pesantren & PAUD
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200/95 leading-relaxed font-normal max-w-xl">
                        Dusun kedua di Desa Kadurama dengan luas wilayah kurang lebih 23 hektar (2 RT / 1 RW) di kontur sejuk lereng Gunung Ciremai. Memiliki sarana ibadah 1 masjid jami dan 1 mushola, institusi pendidikan keagamaan Pondok Pesantren, gedung PAUD, layanan Posyandu, serta mata air alami Cikaduran 45 L/dtk.
                      </p>
                      <div className="border-y border-white/15 py-4 my-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 font-mono">
                        <div><div className="text-2xl sm:text-3xl font-black text-white">146</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Kepala Keluarga</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-[#eda50c]">492</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Jiwa Warga</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-cyan-300">23 Ha</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Luas Wilayah</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-white">2 / 1</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">RT / RW</div></div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Fasilitas Wilayah Terpadu:</div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Building2 className="w-3.5 h-3.5 text-cyan-300" /><span>1 Masjid Utama & 1 Mushola</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Landmark className="w-3.5 h-3.5 text-[#eda50c]" /><span>Pondok Pesantren & PAUD</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Droplets className="w-3.5 h-3.5 text-cyan-400" /><span>Mata Air Cikaduran 45 L/s</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /><span>Posyandu Dusun Wage</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 text-slate-200">
                        <span className="w-2 h-2 rounded-full bg-[#009388]" />
                        <span>Kepala Dusun II: <strong className="text-white">Bpk. Andri Rukmana</strong></span>
                        <span className="text-slate-400">• Wilayah Kerja RT 01 s.d. RT 02 / RW 01</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <a
                          href="/dusun/wage"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs border border-white/30 backdrop-blur-xs transition"
                        >
                          <span>Buka Halaman Dusun</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href="#geografis"
                          onClick={() => {
                            setActiveFacilityId(7);
                            setGisSelectedDusun("wage");
                            setGisSelectedPoiId(null);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-lg transition"
                        >
                          <MapPin className="w-3.5 h-3.5" /><span>Peta GIS</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* SLIDE 3: REAL DUSUN MANIS (DUSUN KETIGA)                  */}
                {/* ========================================================= */}
                <div className="w-full flex-shrink-0 relative min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=85"
                    alt="Panorama Dusun Manis Kadurama"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011715] via-[#011715]/75 to-black/30 lg:bg-gradient-to-r lg:from-[#011715]/95 lg:via-[#011715]/80 lg:to-transparent z-0" />
                  <div className="relative z-10 h-full p-6 sm:p-10 lg:p-14 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3.5 py-1.5 rounded-full bg-[#009388] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                          Dusun III • Manis
                        </span>
                        <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-emerald-200 text-xs font-medium border border-white/15">
                          Sentra Pemerintahan & Pelayanan Publik
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-emerald-200 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                        <Mountain className="w-3.5 h-3.5 text-[#eda50c]" />
                        <span>Elevasi 285 mdpl</span>
                      </div>
                    </div>
                    <div className="my-auto py-6 max-w-2xl space-y-4">
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Dusun Manis
                      </h3>
                      <div className="text-sm sm:text-base font-semibold text-[#eda50c]">
                        Pusat Pelayanan Publik, Kantor Urusan Agama (KUA), SD, Pesantren & 4 Mushola
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200/95 leading-relaxed font-normal max-w-xl">
                        Dusun ketiga dengan luas wilayah terbesar di Desa Kadurama yaitu kurang lebih 39 hektar (3 RT / 1 RW). Sentra administrasi publik menaungi Kantor Balai Desa, KUA, gedung SD, 1 pondok pesantren, 4 unit mushola, serta Posyandu.
                      </p>
                      <div className="border-y border-white/15 py-4 my-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 font-mono">
                        <div><div className="text-2xl sm:text-3xl font-black text-white">184</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Kepala Keluarga</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-[#eda50c]">620</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Jiwa Warga</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-emerald-300">39 Ha</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Luas Wilayah</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-white">3 / 1</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">RT / RW</div></div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Fasilitas Wilayah Terpadu:</div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Building2 className="w-3.5 h-3.5 text-[#009388]" /><span>Balai Desa & Kantor KUA</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Landmark className="w-3.5 h-3.5 text-[#eda50c]" /><span>Gedung SD & 1 Pesantren</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Building2 className="w-3.5 h-3.5 text-amber-300" /><span>4 Unit Mushola Lingkungan</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /><span>Posyandu Dusun Manis</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 text-slate-200">
                        <span className="w-2 h-2 rounded-full bg-[#009388]" />
                        <span>Kepala Dusun III: <strong className="text-white">Bpk. Jamaludin</strong></span>
                        <span className="text-slate-400">• Wilayah Kerja RT 01 s.d. RT 03 / RW 01</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <a
                          href="/dusun/manis"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs border border-white/30 backdrop-blur-xs transition"
                        >
                          <span>Buka Halaman Dusun</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href="#geografis"
                          onClick={() => {
                            setActiveFacilityId(1);
                            setGisSelectedDusun("manis");
                            setGisSelectedPoiId(null);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-lg transition"
                        >
                          <MapPin className="w-3.5 h-3.5" /><span>Peta GIS</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* SLIDE 4: CLONE OF DUSUN PAHING (UNTUK SEAMLESS NEXT LOOP) */}
                {/* ========================================================= */}
                <div className="w-full flex-shrink-0 relative min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=85"
                    alt="Panorama Dusun Pahing Kadurama"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011715] via-[#011715]/75 to-black/30 lg:bg-gradient-to-r lg:from-[#011715]/95 lg:via-[#011715]/80 lg:to-transparent z-0" />
                  <div className="relative z-10 h-full p-6 sm:p-10 lg:p-14 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3.5 py-1.5 rounded-full bg-[#eda50c] text-slate-950 text-xs font-bold uppercase tracking-wider shadow-md">
                          Dusun I • Pahing
                        </span>
                        <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-amber-200 text-xs font-medium border border-white/15">
                          Lumbung Pangan & Olahraga Desa
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-amber-200 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                        <Mountain className="w-3.5 h-3.5 text-[#eda50c]" />
                        <span>Elevasi 310 mdpl</span>
                      </div>
                    </div>
                    <div className="my-auto py-6 max-w-2xl space-y-4">
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Dusun Pahing
                      </h3>
                      <div className="text-sm sm:text-base font-semibold text-[#eda50c]">
                        Hamparan Sawah Padi Terpadu, Lapangan Sepakbola & Kompleks Pendidikan Dasar
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200/95 leading-relaxed font-normal max-w-xl">
                        Dusun pertama di Desa Kadurama dengan luas wilayah kurang lebih 27 hektar (3 RT / 1 RW). Menjadi sentra ketahanan pangan padi sawah desa, lapangan sepakbola Gelora Kadurama, 2 unit mushola peribadatan, gedung Sekolah Dasar (SD), TK, serta Posyandu.
                      </p>
                      <div className="border-y border-white/15 py-4 my-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 font-mono">
                        <div><div className="text-2xl sm:text-3xl font-black text-white">162</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Kepala Keluarga</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-[#eda50c]">548</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Jiwa Warga</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-emerald-300">27 Ha</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Luas Wilayah</div></div>
                        <div><div className="text-2xl sm:text-3xl font-black text-white">3 / 1</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">RT / RW</div></div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Fasilitas Wilayah Terpadu:</div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Award className="w-3.5 h-3.5 text-emerald-300" /><span>Lapangan Sepakbola Gelora</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Landmark className="w-3.5 h-3.5 text-[#eda50c]" /><span>Gedung SD & TK Tunas Bangsa</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <Building2 className="w-3.5 h-3.5 text-amber-300" /><span>2 Unit Mushola Peribadatan</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#009388]" /><span>Posyandu Dusun Pahing</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 text-slate-200">
                        <span className="w-2 h-2 rounded-full bg-[#eda50c]" />
                        <span>Kepala Dusun I: <strong className="text-white">Bpk. Trida Sentosa</strong></span>
                        <span className="text-slate-400">• Wilayah Kerja RT 01 s.d. RT 03 / RW 01</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <a
                          href="/dusun/pahing"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs border border-white/30 backdrop-blur-xs transition"
                        >
                          <span>Buka Halaman Dusun</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href="#geografis"
                          onClick={() => {
                            setActiveFacilityId(4);
                            setGisSelectedDusun("pahing");
                            setGisSelectedPoiId(null);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eda50c] hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition"
                        >
                          <MapPin className="w-3.5 h-3.5" /><span>Peta GIS</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SLIDE INDICATOR PILL DOTS DIRECTLY BENEATH STAGE */}
            <div className="py-4 flex items-center justify-center gap-2.5">
              {[0, 1, 2].map((idx) => {
                const isActive = currentDusunRealIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    aria-label={`Lihat Dusun ${idx + 1}`}
                    className={`transition-all duration-300 cursor-pointer ${isActive
                      ? "w-10 h-2.5 rounded-full bg-[#009388] shadow-md shadow-[#009388]/30"
                      : "w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-slate-400"
                      }`}
                  />
                );
              })}
            </div>

            {/* Dusun Demographic Distribution Bar */}
            <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#009388]/10 text-[#009388] flex items-center justify-center flex-shrink-0">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Distribusi Keseimbangan Wilayah 3 Dusun</div>
                  <div className="text-[11px] text-slate-500">
                    Total 492 Kepala Keluarga dan 1.660 Jiwa terdata lengkap dalam basis sensus mikro desa.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#eda50c]" />
                  <span className="text-slate-700 font-sans text-[11px]">Dusun I Pahing (27 Ha • 30.3%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#003733]" />
                  <span className="text-slate-700 font-sans text-[11px]">Dusun II Wage (23 Ha • 25.8%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#009388]" />
                  <span className="text-slate-700 font-sans text-[11px]">Dusun III Manis (39 Ha • 43.8%)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 2: PETA GEOGRAFIS & BATAS WILAYAH 3 DUSUN (GIS SATELIT)   */}
        {/* =============================================================== */}
        <section id="geografis" className="py-16 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.14] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {/* SECTION HEADER: EDITORIAL & SPATIAL METRICS STRIP */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 mb-8 border-b border-slate-200 gap-6">

              {/* Left: Core Title & Value-Prop */}
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Peta Batas Wilayah & Tata Ruang 3 Dusun
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Pemetaan batas definitif Desa Kadurama seluas 89 hektar (termasuk tanah perhutani) di lereng Gunung Ciremai berbasis citra satelit resolusi tinggi. Terdiri dari 42 Ha tanah sawah dan 47 Ha tanah darat.
                </p>
              </div>

              {/* Right: Integrated Precision Metrics (Hairline Separators, Zero Emojis) */}
              <div className="flex items-center gap-6 divide-x divide-slate-200 self-start lg:self-auto text-left">
                <div className="pr-2">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Luas Wilayah</div>
                  <div className="text-xl font-extrabold text-slate-900 font-mono mt-0.5">89.0 <span className="text-xs font-sans font-normal text-slate-500">Ha</span></div>
                  <div className="text-[11px] text-[#009388] font-medium mt-0.5">Sawah 42 Ha • Darat 47 Ha</div>
                </div>
                <div className="pl-6 pr-2">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Topografi</div>
                  <div className="text-xl font-extrabold text-slate-900 font-mono mt-0.5">285-340 <span className="text-xs font-sans font-normal text-slate-500">mdpl</span></div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Kaki Gunung Ciremai</div>
                </div>
                <div className="pl-6">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Kependudukan</div>
                  <div className="text-xl font-extrabold text-slate-900 font-mono mt-0.5">492 <span className="text-xs font-sans font-normal text-slate-500">KK</span></div>
                  <div className="text-[11px] text-slate-500 mt-0.5">1.720 Jiwa Tersebar</div>
                </div>
              </div>

            </div>

            {/* MASTER SPATIAL CONSOLE (UNIFIED CONTAINER) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

              {/* CONSOLE TOP TOOLBAR */}
              <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">

                {/* Dusun Segmented Controller */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                  {(
                    [
                      { id: "all", label: "Semua Wilayah" },
                      { id: "pahing", label: "Dusun I Pahing" },
                      { id: "wage", label: "Dusun II Wage" },
                      { id: "manis", label: "Dusun III Manis" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setGisSelectedDusun(tab.id);
                        setGisSelectedPoiId(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg transition font-semibold ${gisSelectedDusun === tab.id && gisSelectedPoiId === null
                        ? "bg-[#009388] text-white font-bold shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Layer Toggles */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-3 text-[11px] text-slate-600">
                    <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={gisShowOuter}
                        onChange={(e) => setGisShowOuter(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#eda50c] rounded"
                      />
                      <span>Batas Luar Desa</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={gisShowDusuns}
                        onChange={(e) => setGisShowDusuns(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#009388] rounded"
                      />
                      <span>Batas 3 Dusun</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={gisShowWater}
                        onChange={(e) => setGisShowWater(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#0284c7] rounded"
                      />
                      <span>Irigasi & Air</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* MAIN SPLIT WORKSPACE: MAP (COL 8) + MONOGRAPHY REGISTRY (COL 4) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">

                {/* LEFT 8 COLS: LEAFLET MAP WORKSPACE */}
                <div className="lg:col-span-8 relative border-b lg:border-b-0 lg:border-r border-slate-200 h-[480px] lg:h-auto min-h-[480px]">
                  <CivicGisMap
                    selectedDusun={gisSelectedDusun}
                    selectedPoiId={gisSelectedPoiId}
                    onSelectDusun={(d) => {
                      setGisSelectedDusun(d);
                      setGisSelectedPoiId(null);
                    }}
                    onSelectPoi={(p) => {
                      setGisSelectedPoiId(p.id);
                    }}
                    showOuterBoundary={gisShowOuter}
                    showDusunBoundaries={gisShowDusuns}
                    showWaterways={gisShowWater}
                  />
                </div>

                {/* RIGHT 4 COLS: OFFICIAL MONOGRAPHY REGISTRY SHEET */}
                <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-white text-xs">

                  {(() => {
                    const activePoi = gisSelectedPoiId
                      ? POI_POINTS.find((p) => p.id === gisSelectedPoiId)
                      : null;
                    const dInfo = DUSUN_REGISTRY_DATA[gisSelectedDusun] || DUSUN_REGISTRY_DATA.all;

                    if (activePoi) {
                      return (
                        <div className="space-y-4">
                          <div className="pb-3 border-b border-slate-100">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-bold text-[#009388] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Fasilitas Dusun {activePoi.dusun}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400">STATUS: AKTIF</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                              {activePoi.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Terdaftar di Master Aset Desa Kadurama 2026
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Lokasi Wilayah</div>
                              <div className="font-bold text-slate-800 text-xs mt-1">Dusun {activePoi.dusun}</div>
                              <div className="text-[10px] text-slate-500">Desa Kadurama</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Ketinggian</div>
                              <div className="font-bold text-slate-800 text-xs mt-1 font-mono">{activePoi.elev}</div>
                              <div className="text-[10px] text-[#009388]">Kaki Gunung Ciremai</div>
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Koordinat Geospasial</div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 font-mono text-xs text-slate-800">
                              {activePoi.lat}, {activePoi.lng}
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Catatan Layanan</div>
                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                              Sarana publik strategis yang melayani warga Dusun {activePoi.dusun} dan sekitarnya. Terintegrasi dengan jalan poros lingkungan desa.
                            </p>
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                            <a
                              href={`https://maps.google.com/?q=${activePoi.lat},${activePoi.lng}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                            >
                              <span>Buka Rute di Google Maps</span>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            </a>
                            <button
                              onClick={() => setGisSelectedPoiId(null)}
                              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition"
                            >
                              Kembali ke Profil Dusun
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        <div className="pb-3 border-b border-slate-100">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-[#009388] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {dInfo.tag}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">KODE: 32.08.10.2002</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                            {dInfo.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {dInfo.sub}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Penanggung Jawab</div>
                            <div className="font-bold text-slate-800 text-xs mt-1">{dInfo.lead}</div>
                            <div className="text-[10px] text-slate-500">{dInfo.leadRole}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Luas Wilayah</div>
                            <div className="font-bold text-slate-800 text-xs mt-1 font-mono">{dInfo.area}</div>
                            <div className="text-[10px] text-[#009388]">100% Batas Geospasial</div>
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Karakteristik & Potensi</div>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {dInfo.desc}
                          </p>
                        </div>

                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Fasilitas Pelayanan Strategis</div>
                          <div className="space-y-1.5">
                            {dInfo.facilities.map((fac, fIdx) => (
                              <div
                                key={fIdx}
                                className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]"
                              >
                                <span className="font-semibold text-slate-800">{fac.name}</span>
                                <span className="text-[10px] font-medium text-slate-500">{fac.dusun}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                          <a
                            href={`https://maps.google.com/?q=${dInfo.coords}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                          >
                            <span>Navigasi Presisi Google Maps</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </a>
                          <div className="text-[10px] text-slate-400 text-center">
                            Data terverifikasi Buku Monografi Desa Kadurama 2026
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 3: PANDUAN INFORMASI & LAYANAN ADMINISTRASI WARGA        */}
        {/* =============================================================== */}
        <section id="layanan-warga" className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Header Section dengan CTA Utama Menuju Halaman Layanan */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
                  <FileText className="w-3.5 h-3.5 text-[#009388]" />
                  <span>Layanan Mandiri Warga</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Prosedur & Standar Pelayanan Administrasi Warga
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Cuplikan persyaratan dokumen administrasi resmi desa. Kunjungi katalog layanan untuk panduan lengkap berkas fisik dan prosedur loket Balai Desa.
                </p>
              </div>

              <div className="flex-shrink-0">
                <Link
                  href="/layanan"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003733] hover:bg-[#002825] text-white text-xs font-bold shadow-xs transition group border border-[#005851]"
                >
                  <span>Buka Katalog Layanan Lengkap</span>
                  <ArrowRight className="w-4 h-4 text-[#eda50c] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Grid 5 Kartu Cuplikan Layanan (Ringkas & Informatif) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CIVIC_SERVICES_DATA.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-5 hover:border-[#009388]/50 hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white text-[#003733] border border-slate-200 shadow-2xs">
                        {srv.code}
                      </span>
                      <span className="text-[10px] font-semibold text-[#009388] uppercase tracking-wider">
                        {srv.category}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#009388] transition leading-snug">
                      {srv.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-normal">
                      {srv.desc}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-slate-500 space-y-1">
                      <div className="font-semibold text-slate-700">Persyaratan Utama:</div>
                      <div className="flex items-center gap-1.5 text-slate-600 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#009388] flex-shrink-0" />
                        <span className="truncate">{srv.requirements[0]}</span>
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        + {srv.requirements.length - 1} berkas pendukung lainnya
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400">Loket Balai Desa</span>
                    <Link
                      href="/layanan"
                      className="text-xs font-bold text-[#009388] hover:text-[#005851] inline-flex items-center gap-1 group-hover:underline"
                    >
                      <span>Syarat Lengkap</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}

              {/* Box Khusus CTA Langsung ke Katalog Layanan */}
              <div className="bg-gradient-to-br from-[#003733] to-[#002825] text-white rounded-2xl p-6 border border-[#005851] shadow-xs flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider mb-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#eda50c]" />
                    Standar Pelayanan (SOP)
                  </span>
                  <h3 className="text-lg font-extrabold text-white leading-snug">
                    Butuh Panduan Surat & Verifikasi Berkas Fisik?
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Kunjungi direktori layanan untuk membaca SOP resmi, alur verifikasi berkas, dan jam buka loket Balai Desa Kadurama.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
                  <Link
                    href="/layanan"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white text-xs font-bold transition shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Buka Katalog Layanan Lengkap</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-200/80">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Senin - Jumat (08.00 - 15.00 WIB)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 4: PAMONG & APARATUR PEMERINTAHAN DESA                  */}
        {/* =============================================================== */}
        <section id="perangkat-desa" className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Perangkat Pemerintahan & 3 Kepala Dusun
                </h2>
                <p className="text-sm text-slate-600 mt-2 max-w-xl">
                  Jajaran pamong desa yang berdedikasi melayani kepentingan masyarakat dan memajukan Desa Kadurama.
                </p>
              </div>
              <div className="text-xs text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200">
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
                    SAMIR SYARIFUDIN
                  </h3>
                  <p className="text-xs font-mono text-emerald-200 mt-0.5">Kepala Desa (Kuwu) Kadurama</p>
                </div>

                <blockquote className="text-sm sm:text-base text-emerald-100 italic border-l-2 border-[#eda50c] pl-4 py-1 leading-relaxed">
                  "Kami berkomitmen melayani warga Kadurama dengan tulus, transparan dalam pengelolaan dana APBDes, dan memastikan akurasi data sensus keluarga agar setiap program bantuan pemerintah tepat sasaran."
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
                    <span className="font-semibold text-[#eda50c]">3 Dusun (8 RT & 3 RW)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Jajaran Sekdes & 3 Kepala Dusun */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sekdes */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:border-[#009388] hover:shadow-lg transition">
                <div className="relative h-72 overflow-hidden bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80"
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
                  <h4 className="font-extrabold text-slate-900 text-base uppercase">SUMIATI, SE</h4>
                  <div className="text-xs font-semibold text-[#009388] mt-0.5">Sekretaris Desa</div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Koordinator administrasi umum, tata kelola regulasi perdes, perumusan APBDes, dan verifikasi basis data sensus desa.
                  </p>
                </div>
              </div>

              {/* Kadus I Pahing */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:border-[#009388] hover:shadow-lg transition">
                <div className="relative h-72 overflow-hidden bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80"
                    alt="Kadus Pahing"
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] font-bold text-slate-950 uppercase tracking-wider bg-[#eda50c] px-2.5 py-0.5 rounded">
                      Kepala Dusun I
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-extrabold text-slate-900 text-base uppercase">TRIDA SENTOSA</h4>
                  <div className="text-xs font-semibold text-[#009388] mt-0.5">Kepala Dusun Pahing</div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Penanggung jawab ketenteraman wilayah Dusun I Pahing (3 RT / 1 RW), pengelola sarana olahraga Gelora Kadurama, serta pengawasan fasilitas pendidikan SD & TK.
                  </p>
                </div>
              </div>

              {/* Kadus II Wage */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:border-[#009388] hover:shadow-lg transition">
                <div className="relative h-72 overflow-hidden bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80"
                    alt="Kadus Wage"
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] font-bold text-slate-950 uppercase tracking-wider bg-[#eda50c] px-2.5 py-0.5 rounded">
                      Kepala Dusun II
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-extrabold text-slate-900 text-base uppercase">ANDRI RUKMANA</h4>
                  <div className="text-xs font-semibold text-[#009388] mt-0.5">Kepala Dusun Wage</div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Pengawal kelestarian mata air alami Cikaduran, pembina kerukunan religi pondok pesantren, masjid, mushola, serta pengayom Dusun II Wage (2 RT / 1 RW).
                  </p>
                </div>
              </div>

              {/* Kadus III Manis */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:border-[#009388] hover:shadow-lg transition">
                <div className="relative h-72 overflow-hidden bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80"
                    alt="Kadus Manis"
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] font-bold text-slate-950 uppercase tracking-wider bg-[#eda50c] px-2.5 py-0.5 rounded">
                      Kepala Dusun III
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-extrabold text-slate-900 text-base uppercase">JAMALUDIN</h4>
                  <div className="text-xs font-semibold text-[#009388] mt-0.5">Kepala Dusun Manis</div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Penanggung jawab ketenteraman wilayah gerbang desa Dusun III Manis (3 RT / 1 RW), koordinasi pelayanan publik di Balai Desa, KUA, serta pembinaan lembaga sosial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 5: TRANSPARANSI APBDES 2026                             */}
        {/* =============================================================== */}
        <section id="apbdes" className="py-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Header Bersih Tanpa Eyebrow Repetitif */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Akuntabilitas & Realisasi APBDes Tahun Anggaran 2026
                </h2>
                <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                  Publikasi terbuka tata kelola keuangan desa, realisasi serapan belanja 5 bidang pembangunan, dan dokumen ketetapan Peraturan Desa (Perdes).
                </p>
              </div>

              {/* Filter & CTA Transparansi */}
              <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
                <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs">
                  <button
                    onClick={() => setApbdesFilter("all")}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition ${apbdesFilter === "all" ? "bg-[#009388] text-white" : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setApbdesFilter("pendapatan")}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition ${apbdesFilter === "pendapatan" ? "bg-[#009388] text-white" : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    Pendapatan
                  </button>
                  <button
                    onClick={() => setApbdesFilter("belanja")}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition ${apbdesFilter === "belanja" ? "bg-[#009388] text-white" : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    Belanja
                  </button>
                </div>

                <Link
                  href="/transparansi/apbdes"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003733] hover:bg-[#002825] text-white text-xs font-bold transition shadow-xs border border-[#005851] group"
                >
                  <span>Detail APBDes Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#eda50c] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Bento Alokasi Anggaran: 2 Kolom Asimetris */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Kolom Kiri (4 Cols): Ringkasan Neraca Keuangan & Multi-Segment Serapan */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Basis Data APBDes 2026
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                    Ringkasan Kas & Realisasi
                  </h3>
                </div>

                {/* Neraca Angka Utama dengan Hairline Dividers */}
                <div className="space-y-4 divide-y divide-slate-100">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Total Pendapatan Desa
                    </div>
                    <div id="apbdes-pendapatan-val" className="text-2xl font-black text-slate-900 font-mono mt-1">
                      Rp {apbdesTotals.pendapatan.toLocaleString("id-ID")}
                    </div>
                    <div className="text-[11px] text-[#009388] font-medium mt-0.5">
                      Dana Desa (DD), ADD, PADes & Bagi Pajak
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Total Realisasi Belanja
                    </div>
                    <div id="apbdes-belanja-val" className="text-2xl font-black text-[#009388] font-mono mt-1">
                      Rp {apbdesTotals.belanja.toLocaleString("id-ID")}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Realisasi serapan triwulan berjalan
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sisa Pagu / Surplus</span>
                      <span className="text-xs font-bold text-emerald-700 font-mono">
                        Rp {(apbdesTotals.pendapatan - apbdesTotals.belanja).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Serapan Multi-Segment Visual */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-700">Rasio Penyerapan Kas</span>
                    <span id="apbdes-serapan-val" className="font-mono font-extrabold text-[#009388]">
                      {apbdesTotals.serapan}%
                    </span>
                  </div>

                  {/* Proportional Segment Bar (Tanpa Track Abu-abu Tebal Generik) */}
                  <div className="h-2.5 rounded-full flex overflow-hidden gap-0.5">
                    <div style={{ width: "35%" }} title="Penyelenggaraan (35%)" className="bg-[#009388]" />
                    <div style={{ width: "38%" }} title="Pembangunan (38%)" className="bg-[#10b981]" />
                    <div style={{ width: "12%" }} title="Pembinaan (12%)" className="bg-[#eda50c]" />
                    <div style={{ width: "10%" }} title="Pemberdayaan (10%)" className="bg-sky-600" />
                    <div style={{ width: "5%" }} title="Penanggulangan Bencana (5%)" className="bg-rose-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] text-slate-600">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#009388]" /><span>Penyelenggaraan</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10b981]" /><span>Pembangunan</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#eda50c]" /><span>Pembinaan</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-600" /><span>Pemberdayaan</span></div>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan (8 Cols): Daftar 5 Bidang & Unduh Salinan Perdes */}
              <div className="lg:col-span-8">
                {(apbdesFilter === "all" || apbdesFilter === "belanja") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {apbdesBidangList.map((bidang) => (
                      <div
                        key={bidang.id}
                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-[#009388] uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                              Bidang {bidang.id}
                            </span>
                            <span className="text-xs font-bold text-[#009388] font-mono">
                              {bidang.persen}% Terpakai
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mt-2">{bidang.nama}</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{bidang.keterangan}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                          <span className="text-slate-400 text-[11px]">Pagu Ditetapkan:</span>
                          <span className="font-bold text-slate-900 font-mono">
                            Rp {bidang.pagu.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Kartu Unduh Dokumen Resmi Perdes PDF */}
                    <div className="p-5 rounded-2xl bg-[#003733] text-white flex flex-col justify-between shadow-2xs border border-[#005851]">
                      <div>
                        <span className="text-[10px] font-bold text-[#eda50c] uppercase tracking-wider">
                          Transparansi Publik
                        </span>
                        <h4 className="font-bold text-white text-base mt-1">Salinan Perdes APBDes 2026</h4>
                        <p className="text-xs text-emerald-100/80 mt-1.5 leading-relaxed">
                          Unduh berkas PDF resmi lembaran daerah dan rincian alokasi anggaran belanja yang telah disahkan BPD Desa Kadurama.
                        </p>
                      </div>
                      <div className="mt-5 space-y-2">
                        <button
                          onClick={() => alert("Mengunduh salinan resmi Perdes APBDes Kadurama 2026 format PDF...")}
                          className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white text-xs font-bold transition shadow-xs"
                        >
                          <Download className="w-4 h-4" />
                          <span>Unduh Salinan Berkas PDF</span>
                        </button>
                        <Link
                          href="/transparansi/apbdes"
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-200 text-xs font-semibold transition border border-white/10"
                        >
                          <span>Buka Halaman Rincian APBDes</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 6: KABAR & BERITA DESA KADURAMA                         */}
        {/* =============================================================== */}
        <section id="berita" className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Header Bersih Tanpa Eyebrow Repetitif */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Kabar & Warta Kegiatan Desa Kadurama
                </h2>
                <p className="text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">
                  Liputan resmi agenda pembangunan infrastruktur, musyawarah 3 dusun, dan keterbukaan penyaluran bantuan sosial warga.
                </p>
              </div>
              <a
                href="/berita"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003733] hover:bg-[#005851] text-white text-xs font-bold transition shadow-xs flex-shrink-0"
              >
                <span>Lihat Seluruh Berita & Warta</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#eda50c]" />
              </a>
            </div>

            {/* Asymmetric Editorial News Layout (1 Besar + 1 Sedang + 1 Kecil + 1 Box CTA) */}
            {(() => {
              const published = newsList.filter((n) => n.status === "Terbit");
              const featured = published[0];
              const mediumItem = published[1];
              const smallItem = published[2];

              if (!featured) return null;

              const getSlug = (id: string) => {
                const found = newsList.find((n) => n.id === id);
                if (found?.slug) return found.slug;
                if (id === "NEWS-001") return "musyawarah-rkpdes-2027";
                if (id === "NEWS-002") return "penyaluran-blt-dana-desa-triwulan-iii-2026";
                if (id === "NEWS-003") return "posyandu-balita-dan-skrining-stunting-pahing";
                if (id === "NEWS-004") return "rehabilitasi-drainase-pemukiman-dusun-wage";
                if (id === "NEWS-005") return "pelatihan-digital-marketing-umkm-ubi-kuningan";
                return found?.title
                  ? found.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                  : "musyawarah-rkpdes-2027";
              };

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  {/* 1 ARTIKEL UTAMA / BESAR (7 Cols) */}
                  <article className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden hover:shadow-md transition flex flex-col justify-between group">
                    <div>
                      <div className="h-64 sm:h-72 bg-slate-200 overflow-hidden relative">
                        <img
                          src={featured.imageUrl}
                          alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div
                          className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider ${featured.category === "Bansos"
                            ? "bg-[#eda50c] text-slate-950"
                            : "bg-[#009388] text-white shadow-xs"
                            }`}
                        >
                          {featured.category}
                        </div>
                      </div>
                      <div className="p-6 sm:p-8">
                        <div className="text-xs text-slate-500 mb-2 font-medium">
                          {featured.date} • Ditulis oleh {featured.author}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-[#009388] transition leading-snug">
                          <Link href={`/berita/${getSlug(featured.id)}`}>
                            {featured.title}
                          </Link>
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                          {featured.summary}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0">
                      <Link
                        href={`/berita/${getSlug(featured.id)}`}
                        className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-[#009388] hover:underline"
                      >
                        <span>Baca Liputan Berita Lengkap</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </article>

                  {/* SISI KANAN (5 Cols): 1 Sedang di atas, 1 Kecil & 1 Box CTA di bawah */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-5">
                    {/* 1 ARTIKEL SEDANG (Horizontal Card) */}
                    {mediumItem && (
                      <article className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden hover:shadow-md transition group p-5 flex flex-col justify-between">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="w-full sm:w-32 h-28 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-200 relative">
                            <img
                              src={mediumItem.imageUrl}
                              alt={mediumItem.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-[#eda50c]/20 text-amber-900 border border-amber-300/40">
                                {mediumItem.category}
                              </span>
                              <span className="text-[11px] text-slate-400 truncate">{mediumItem.date}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#009388] transition line-clamp-2 leading-snug">
                              <Link href={`/berita/${getSlug(mediumItem.id)}`}>
                                {mediumItem.title}
                              </Link>
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {mediumItem.summary}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/berita/${getSlug(mediumItem.id)}`}
                          className="mt-3 pt-2.5 border-t border-slate-200/70 flex justify-between items-center text-[11px] font-semibold text-[#009388] hover:underline"
                        >
                          <span>Baca Selengkapnya</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                      </article>
                    )}

                    {/* BAGIAN GIZI DIBAGI 2: 1 KECIL (KIRI) + 1 BOX CARD LIHAT SELENGKAPNYA (KANAN) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                      {/* 1 ARTIKEL KECIL (Posyandu & Gizi) */}
                      {smallItem && (
                        <article className="bg-slate-50 border border-slate-200 rounded-3xl p-4 hover:shadow-md transition group flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-2">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-100 text-[#005851]">
                                {smallItem.category}
                              </span>
                              <span className="text-[10px] text-slate-400">{smallItem.date}</span>
                            </div>
                            <h5 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#009388] transition line-clamp-3 leading-snug">
                              <Link href={`/berita/${getSlug(smallItem.id)}`}>
                                {smallItem.title}
                              </Link>
                            </h5>
                            <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                              {smallItem.summary}
                            </p>
                          </div>
                          <Link
                            href={`/berita/${getSlug(smallItem.id)}`}
                            className="mt-3 pt-2 border-t border-slate-200/70 text-[11px] font-bold text-[#009388] flex items-center justify-between"
                          >
                            <span>Baca Warta</span>
                            <span>→</span>
                          </Link>
                        </article>
                      )}

                      {/* 1 BOX CARD LIHAT BERITA LAINNYA */}
                      <div className="bg-gradient-to-br from-[#003733] to-[#002825] text-white rounded-3xl p-4 border border-[#005851] shadow-xs flex flex-col justify-between group">
                        <div>
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#eda50c] flex items-center justify-center mb-2.5 border border-emerald-400/30">
                            <Newspaper className="w-4 h-4" />
                          </div>
                          <h5 className="font-extrabold text-white text-sm leading-snug">
                            Jelajahi Warta Desa Lainnya
                          </h5>
                          <p className="text-[11px] text-emerald-100/70 mt-1.5 leading-relaxed line-clamp-3">
                            Liputan pembangunan 3 dusun, agenda musyawarah, dan penyaluran bansos.
                          </p>
                        </div>
                        <Link
                          href="/berita"
                          className="mt-3 pt-2 border-t border-white/10 text-xs font-bold text-[#eda50c] group-hover:text-amber-300 flex items-center justify-between transition"
                        >
                          <span>Lihat Semua Berita</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 7: LOKASI KANTOR DESA & KONTAK                           */}
        {/* =============================================================== */}
        <section id="lokasi-kantor" className="py-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Kantor Balai Desa Kadurama
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Silakan datang langsung ke balai desa pada jam kerja operasional atau hubungi nomor layanan masyarakat desa.
                </p>
                <div className="mt-6 space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#009388] flex-shrink-0" />
                    <span>Jl. Desa Kadurama No. 01, Dusun Manis, Kuningan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#009388] flex-shrink-0" />
                    <span>+62 821-2345-6789 (WhatsApp Pelayanan)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#009388] flex-shrink-0" />
                    <span>pemdes@kadurama.desa.id</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-slate-200 h-64 sm:h-80 relative bg-slate-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.582697843076!2d108.545!3d-6.996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f1672688849b3%3A0xb30f81dcb06573c!2sKadurama%2C%20Ciawigebang%2C%20Kuningan%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  title="Peta Lokasi Kantor Desa Kadurama"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER PUBLIK */}
        <CivicFooter />
      </main>

      {/* FLOATING SYNC NOTIFICATION TOAST */}
      {syncNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003733] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="text-xs font-semibold">{syncNotification}</div>
          <button
            onClick={() => setSyncNotification(null)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
