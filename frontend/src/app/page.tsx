"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
} from "lucide-react";

// =========================================================================
// 1. DATA KEPENDUDUKAN (3 DUSUN KADURAMA: MANIS, PAHING, PUHUN)
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
  dusun: "Manis" | "Pahing" | "Puhun";
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
    dusun: "Puhun",
    rt: "03",
    rw: "03",
    alamat: "Dusun Puhun RT 03 / RW 03, Desa Kadurama",
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
    dusun: "Puhun",
    rt: "01",
    rw: "03",
    alamat: "Dusun Puhun RT 01 / RW 03, Desa Kadurama",
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
    dusun: "Puhun",
    rt: "01",
    rw: "03",
    alamat: "Dusun Puhun RT 01 / RW 03, Desa Kadurama",
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
    dusun: "Puhun",
    rt: "02",
    rw: "03",
    alamat: "Dusun Puhun RT 02 / RW 03, Desa Kadurama",
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
    dusun: "Puhun",
    rt: "02",
    rw: "03",
    alamat: "Dusun Puhun RT 02 / RW 03, Desa Kadurama",
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
    dusun: "Puhun",
    rt: "04",
    rw: "03",
    alamat: "Dusun Puhun RT 04 / RW 03, Desa Kadurama",
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
  dusun: "Manis" | "Pahing" | "Puhun";
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
    surveyorKadus: "Ahmad Dahlan (Kadus Manis)",
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
    surveyorKadus: "Rohmat Hidayat (Kadus Pahing)",
    tanggalSensus: "11 September 2026",
    catatanVerifikasi: "Lantai ruang tengah masih tanah merah, balita usia 2 tahun terindikasi berat badan kurang, perlu intervensi PMT Posyandu.",
  },
  {
    id: "SN-003",
    noKk: "3208150102030003",
    nikKepalaKeluarga: "3208151111920005",
    namaKepalaKeluarga: "Maman Suherman",
    dusun: "Puhun",
    rt: "03",
    rw: "03",
    alamat: "Dusun Puhun RT 03 / RW 03, Desa Kadurama",
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
    surveyorKadus: "Agus Setiawan (Kadus Puhun)",
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
    surveyorKadus: "Ahmad Dahlan (Kadus Manis)",
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
    surveyorKadus: "Rohmat Hidayat (Kadus Pahing)",
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
    surveyorKadus: "Rohmat Hidayat (Kadus Pahing)",
    tanggalSensus: "12 September 2026",
    catatanVerifikasi: "Prioritas tertinggi Bedah Rumah (RTLH). Tinggal bersama ibu lansia berusia 76 tahun dengan atap bocor parah dan sanitasi belum ada.",
  },
  {
    id: "SN-007",
    noKk: "3208150102030007",
    nikKepalaKeluarga: "3208151508800014",
    namaKepalaKeluarga: "Cecep Supriatna",
    dusun: "Puhun",
    rt: "01",
    rw: "03",
    alamat: "Dusun Puhun RT 01 / RW 03, Desa Kadurama",
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
    surveyorKadus: "Agus Setiawan (Kadus Puhun)",
    tanggalSensus: "11 September 2026",
    catatanVerifikasi: "Memiliki 3 ekor sapi perah produktif, memanfaatkan air dari mata air Cikaduran.",
  },
  {
    id: "SN-008",
    noKk: "3208150102030008",
    nikKepalaKeluarga: "3208151804700017",
    namaKepalaKeluarga: "Kusnadi",
    dusun: "Puhun",
    rt: "02",
    rw: "03",
    alamat: "Dusun Puhun RT 02 / RW 03, Desa Kadurama",
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
    surveyorKadus: "Agus Setiawan (Kadus Puhun)",
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
    surveyorKadus: "Ahmad Dahlan (Kadus Manis)",
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
    surveyorKadus: "Ahmad Dahlan (Kadus Manis)",
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
    surveyorKadus: "Rohmat Hidayat (Kadus Pahing)",
    tanggalSensus: "08 September 2026",
    catatanVerifikasi: "Keluarga mandiri, mengelola sawah produktif seluas 140 bata.",
  },
  {
    id: "SN-012",
    noKk: "3208150102030012",
    nikKepalaKeluarga: "3208152504840024",
    namaKepalaKeluarga: "Iwan Setiawan",
    dusun: "Puhun",
    rt: "04",
    rw: "03",
    alamat: "Dusun Puhun RT 04 / RW 03, Desa Kadurama",
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
    surveyorKadus: "Agus Setiawan (Kadus Puhun)",
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
  dusun: "Manis" | "Pahing" | "Puhun";
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
    dusun: "Puhun",
    koordinat: "7°00'15.4\"S 108°33'24.8\"E",
    elevasi: "338 mdpl",
    alamat: "Lereng Bukit Cikaduran, Dusun Puhun",
    deskripsi: "Sumber mata air alami purba berkualitas tinggi dari resapan lereng Gunung Ciremai yang mengalirkan air bersih untuk kebutuhan 3 dusun desa.",
    jamBuka: "Kawasan Konservasi Air Bersih (24 Jam)",
    status: "Fasilitas Umum",
    iconType: "Droplets",
  },
  {
    id: 9,
    nama: "Posyandu Melati II Dusun Puhun",
    kategori: "kesehatan",
    dusun: "Puhun",
    koordinat: "7°00'10.2\"S 108°33'20.5\"E",
    elevasi: "325 mdpl",
    alamat: "Dusun Puhun RT 02 / RW 03",
    deskripsi: "Pusat pemantauan kesehatan ibu hamil, pemeriksaan tensi lansia, dan skrining berkala gizi balita kawasan Dusun Puhun.",
    jamBuka: "Senin Kedua Setiap Bulan (08.30 - 12.00 WIB)",
    status: "Aktif Melayani",
    iconType: "Activity",
  },
  {
    id: 10,
    nama: "Sentra Peternakan Sapi Rakyat Dusun Puhun",
    kategori: "ekonomi",
    dusun: "Puhun",
    koordinat: "7°00'20.1\"S 108°33'28.3\"E",
    elevasi: "340 mdpl",
    alamat: "Blok Pasir Kiara, Dusun Puhun",
    deskripsi: "Kompleks kandang komunal peternakan sapi perah & potong terpadu binaan dinas peternakan dengan instalasi biogas ramah lingkungan.",
    jamBuka: "Setiap Hari: 06.00 - 17.30 WIB",
    status: "Aktif Melayani",
    iconType: "Layers",
  },
];

// =========================================================================
// 4. KABAR DESA & APBDES DATA
// =========================================================================
interface NewsItem {
  id: string;
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
    summary: "Sebanyak 45 Keluarga Penerima Manfaat (KPM) kategori Desil 1 & 2 dari Dusun Manis, Pahing, dan Puhun menerima bantuan tunai.",
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
    title: "Rehabilitasi Drainase Lingkungan Dusun Puhun Memasuki Tahap Penyelesaian",
    category: "Pembangunan",
    date: "28 Agustus 2026",
    author: "Kaur Pembangunan",
    summary: "Pembangunan saluran drainase sepanjang 320 meter di Dusun Puhun berhasil menuntaskan masalah limpasan air saat musim hujan.",
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
    keterangan: "Pelatihan UMKM olahan pangan lokal dan bantuan modal bibit sapi perah dusun puhun.",
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
              className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                currentPage === p
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
  // Navigation & View States
  const [view, setView] = useState<"public" | "admin">("public");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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
  const [dusunTrackIndex, setDusunTrackIndex] = useState(1); // 1 = Manis, 2 = Pahing, 3 = Puhun (0 & 4 are clones)
  const [isDusunTransitioning, setIsDusunTransitioning] = useState(true);
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDusunHoveredRef = useRef(false);

  // Active Real Index (0 = Manis, 1 = Pahing, 2 = Puhun)
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

  // Admin Panel States
  const [adminTab, setAdminTab] = useState<
    "sensus" | "residents" | "berita" | "apbdes"
  >("sensus");
  const [adminKadusRole, setAdminKadusRole] = useState<"all" | "Manis" | "Pahing" | "Puhun">("all");

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

  // Handlers Login & Auth Demo
  const handleLoginDemo = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    setView("admin");
  };

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
          ? "Ahmad Dahlan (Kadus Manis)"
          : adminKadusRole === "Pahing"
          ? "Rohmat Hidayat (Kadus Pahing)"
          : adminKadusRole === "Puhun"
          ? "Agus Setiawan (Kadus Puhun)"
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
      {view === "public" && (
        <header className="no-print sticky top-0 z-50 shadow-sm transition-all duration-200">
          {/* BARIS 1: TOP HEADER BAR (Putih Bersih - Presisi Max-W 7XL) */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
              {/* Brand & Identitas Resmi Desa */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center">
                  <Image
                    src="/kuningan-logo.png"
                    alt="Logo Kabupaten Kuningan"
                    width={40}
                    height={40}
                    className="object-contain drop-shadow-sm"
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
              </div>

              {/* Sisi Kanan Baris 1: Pencarian & Tombol Akses Aparatur Desa (Desktop Only) */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Search Bar Minimalis */}
                <div className="relative hidden md:block w-64 lg:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={siteSearchQuery}
                    onChange={(e) => setSiteSearchQuery(e.target.value)}
                    placeholder="Cari profil dusun, peta, APBDes..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-full border border-slate-300 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#009388] focus:border-transparent transition"
                  />
                </div>

                {/* Tombol Akses Aparatur Desa: HANYA ICON & HANYA DI DESKTOP */}
                <div className="hidden md:flex items-center">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    title="Akses Panel Aparatur Desa (Staf & Kadus)"
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#e6f7f5] text-[#003733] hover:text-[#009388] hover:border-[#009388]/40 transition shadow-2xs group flex items-center justify-center"
                    aria-label="Akses Panel Aparatur"
                  >
                    <Lock className="w-4 h-4 text-[#009388] group-hover:scale-110 transition-transform" />
                  </button>
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

          {/* BARIS 2: SUB-NAVBAR KATEGORI (Dark Emerald Kuningan #003733) */}
          <div className="hidden md:block bg-[#003733] text-white border-b border-[#005851]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between text-xs font-semibold tracking-wide">
              <nav className="flex items-center gap-1">
                {/* 1. HOME: HANYA ICON RUMAH */}
                <a
                  href="#beranda"
                  title="Beranda Utama"
                  className="p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-[#005851] transition flex items-center justify-center"
                >
                  <HomeIcon className="w-4 h-4" />
                </a>

                <span className="text-emerald-500/50">|</span>

                {/* 2. PROFIL 3 DUSUN DROPDOWN */}
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("profil")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => handleDropdownToggle("profil")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                      activeDropdown === "profil"
                        ? "text-white bg-[#005851]"
                        : "text-emerald-100 hover:text-white hover:bg-[#005851]"
                    }`}
                  >
                    <span>PROFIL DUSUN</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === "profil" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === "profil" && (
                    <div
                      className="absolute top-full left-0 pt-2 w-64 z-50 select-none before:content-[''] before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:bg-transparent"
                      onMouseEnter={() => handleDropdownEnter("profil")}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="relative bg-white text-slate-800 rounded-2xl p-2 shadow-2xl border border-slate-200 animate-in fade-in-50 zoom-in-95 duration-150">
                        <div className="absolute -top-1.5 left-5 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45 pointer-events-none" />
                        <a
                          href="#profil-dusun"
                          onClick={() => setActiveDropdown(null)}
                          className="block px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#e6f7f5] hover:text-[#009388] transition whitespace-nowrap"
                        >
                          Rincian 3 Dusun Kadurama
                        </a>
                        <a
                          href="#geografis"
                          onClick={() => setActiveDropdown(null)}
                          className="block px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#e6f7f5] hover:text-[#009388] transition whitespace-nowrap"
                        >
                          Peta Geografis & Titik Fasilitas
                        </a>
                        <a
                          href="#perangkat-desa"
                          onClick={() => setActiveDropdown(null)}
                          className="block px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#e6f7f5] hover:text-[#009388] transition whitespace-nowrap"
                        >
                          Aparatur & 3 Kepala Dusun
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. PETA GEOGRAFIS LANGSUNG */}
                <a
                  href="#geografis"
                  className="px-3 py-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-[#005851] transition whitespace-nowrap"
                >
                  PETA WILAYAH
                </a>

                {/* 4. PANDUAN INFORMASI WARGA */}
                <a
                  href="#layanan-warga"
                  className="px-3 py-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-[#005851] transition whitespace-nowrap"
                >
                  PANDUAN WARGA
                </a>

                {/* 5. TRANSPARANSI APBDES 2026 */}
                <a
                  href="#apbdes"
                  className="px-3 py-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-[#005851] transition whitespace-nowrap"
                >
                  APBDes 2026
                </a>

                {/* 6. KABAR DESA */}
                <a
                  href="#berita"
                  className="px-3 py-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-[#005851] transition whitespace-nowrap"
                >
                  KABAR DESA
                </a>

                {/* 7. KONTAK & LOKASI */}
                <a
                  href="#lokasi-kantor"
                  className="px-3 py-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-[#005851] transition whitespace-nowrap"
                >
                  KONTAK & LOKASI
                </a>
              </nav>

              {/* Sisi Kanan Baris 2: Status Jam Pelayanan Kantor Desa */}
              <div className="flex items-center gap-2 text-emerald-200/90 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-[#eda50c]" />
                <span>Pelayanan Balai Desa: 08.00 - 15.00 WIB</span>
              </div>
            </div>
          </div>

          {/* MOBILE DROPDOWN MENU */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 text-xs shadow-lg animate-in slide-in-from-top duration-150">
              <a
                href="#beranda"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388]"
              >
                Beranda Utama
              </a>
              <a
                href="#profil-dusun"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388]"
              >
                Profil 3 Dusun Kadurama
              </a>
              <a
                href="#geografis"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388]"
              >
                Peta Geografis & Fasilitas
              </a>
              <a
                href="#layanan-warga"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388]"
              >
                Panduan Administrasi Warga
              </a>
              <a
                href="#perangkat-desa"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388]"
              >
                Aparatur & Kepala Dusun
              </a>
              <a
                href="#apbdes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388]"
              >
                Transparansi APBDes 2026
              </a>
              <a
                href="#berita"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388]"
              >
                Kabar Desa Terkini
              </a>
              <a
                href="#lokasi-kantor"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-bold text-slate-800 hover:bg-[#e6f7f5] hover:text-[#009388]"
              >
                Kontak & Lokasi Kantor
              </a>
            </div>
          )}
        </header>
      )}

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
                  <p className="text-[11px] text-slate-500">Panel Sensus Warga & Master Data Desa</p>
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
                  Peran Akses / Wilayah
                </label>
                <select
                  value={adminKadusRole}
                  onChange={(e) => setAdminKadusRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                >
                  <option value="all">Administrator Balai Desa (Semua Wilayah)</option>
                  <option value="Manis">Kepala Dusun Manis - Ahmad Dahlan</option>
                  <option value="Pahing">Kepala Dusun Pahing - Rohmat Hidayat</option>
                  <option value="Puhun">Kepala Dusun Puhun - Agus Setiawan</option>
                </select>
              </div>

              <div className="p-3 bg-[#e6f7f5] rounded-xl border border-[#009388]/20 flex items-start gap-2.5 text-[11px] text-[#005851]">
                <ShieldCheck className="w-4 h-4 text-[#009388] flex-shrink-0 mt-0.5" />
                <span>
                  Akses ini khusus staf desa dan kepala dusun untuk melakukan pendataan sensus profil keluarga, PBB-P2, dan master kependudukan Kadurama.
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
                className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <span>Masuk ke Panel Data Center</span>
                <ArrowRight className="w-4 h-4" />
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

            {/* 2. Landmark Gerbang Kuningan Asri (Tinggi Asli di Tengah, Kiri Kanan Putih Menyatu Tanpa Blocking) */}
            <div className="absolute inset-x-0 bottom-0 w-full flex items-end justify-center pointer-events-none select-none z-0 mix-blend-multiply opacity-80 overflow-hidden">
              <img
                src="/kuningan-gate-wide.png"
                alt="Landmark Gerbang Kuningan Asri"
                className="w-full h-[150px] sm:h-[175px] md:h-[190px] object-cover object-bottom select-none [mask-image:linear-gradient(to_top,black_80%,transparent)] filter brightness-105 contrast-110"
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
                      href="#layanan-surat"
                      className="px-6 py-3.5 rounded-xl bg-[#eda50c] hover:bg-[#d99407] text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-950/20 transition-transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Cek Persyaratan Berkas Surat</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <a
                      href="#profil-dusun"
                      className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs sm:text-sm backdrop-blur-sm transition flex items-center justify-center gap-2 cursor-pointer"
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
                            492 Kepala Keluarga dan 1.660 Jiwa terdata lengkap di Dusun Manis, Pahing, dan Puhun.
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
                      <div className="text-xs sm:text-sm font-bold text-white">64 Ha Padi Organik</div>
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
                      <div className="text-[10px] text-emerald-100/80">Mata Air Alami Dusun Puhun</div>
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
                <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3.5 py-1 rounded-full border border-[#009388]/20">
                  Wilayah Administratif
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
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
                  {/* SLIDE 0: CLONE OF DUSUN PUHUN (UNTUK SEAMLESS PREV LOOP)   */}
                  {/* ========================================================= */}
                  <div className="w-full flex-shrink-0 relative min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85"
                      alt="Dusun Puhun Kadurama"
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#011715] via-[#011715]/75 to-black/30 lg:bg-gradient-to-r lg:from-[#011715]/95 lg:via-[#011715]/80 lg:to-transparent z-0" />
                    <div className="relative z-10 h-full p-6 sm:p-10 lg:p-14 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="px-3.5 py-1.5 rounded-full bg-[#003733] text-emerald-200 border border-emerald-400/40 text-xs font-bold uppercase tracking-wider shadow-md">
                            Dusun III • Puhun
                          </span>
                          <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-emerald-200 text-xs font-medium border border-white/15">
                            Mata Air Purba & Agrowisata Ciremai
                          </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-emerald-200 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                          <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Elevasi 340 mdpl</span>
                        </div>
                      </div>
                      <div className="my-auto py-6 max-w-2xl space-y-4">
                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                          Dusun Puhun
                        </h3>
                        <div className="text-sm sm:text-base font-semibold text-emerald-300">
                          Mata Air Alami Purba Cikaduran 45 Liter/Detik & Agrobisnis Ubi Jalar
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200/95 leading-relaxed font-normal max-w-xl">
                          Kawasan perbukitan sejuk di elevasi 340 mdpl lereng Gunung Ciremai. Menjadi sumber mata air alami Cikaduran dengan debit melimpah untuk konsumsi warga, perkebunan ubi manis lereng gunung, dan sentra sapi perah terpadu.
                        </p>
                        <div className="border-y border-white/15 py-4 my-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 font-mono">
                          <div><div className="text-2xl sm:text-3xl font-black text-white">146</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Kepala Keluarga</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-[#eda50c]">492</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Jiwa Warga</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-cyan-300">45 L/s</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Debit Mata Air</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-white">6 / 2</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">RT / RW</div></div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Fasilitas Wilayah Terpadu:</div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Droplets className="w-3.5 h-3.5 text-cyan-400" /><span>Mata Air Purba Cikaduran</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Mountain className="w-3.5 h-3.5 text-[#009388]" /><span>Jalur Agrowisata Ubi Jalar</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /><span>Posyandu Melati II Dusun Puhun</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 text-slate-200">
                          <span className="w-2 h-2 rounded-full bg-[#009388]" />
                          <span>Kepala Dusun III: <strong className="text-white">Bpk. Agus Setiawan</strong></span>
                        </div>
                        <a href="#geografis" onClick={() => setActiveFacilityId(7)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-lg transition">
                          <MapPin className="w-3.5 h-3.5" /><span>Lihat Fasilitas Dusun di Peta</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* SLIDE 1: REAL DUSUN MANIS (SLIDE UTAMA 1)                  */}
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
                            Dusun I • Manis
                          </span>
                          <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-emerald-200 text-xs font-medium border border-white/15">
                            Pusat Administrasi & Pelayanan Warga
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
                          Sentra Pemerintahan Desa, Layanan Medis Siaga & UMKM Olahan Pangan
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200/95 leading-relaxed font-normal max-w-xl">
                          Wilayah gerbang masuk desa yang menjadi pusat koordinasi administrasi Balai Desa Kadurama, Puskesmas Pembantu 24 jam, sekolah dasar, dan sentra produksi keripik olahan ubi jalar serta rengginang khas warga.
                        </p>
                        <div className="border-y border-white/15 py-4 my-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 font-mono">
                          <div><div className="text-2xl sm:text-3xl font-black text-white">184</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Kepala Keluarga</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-[#eda50c]">620</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Jiwa Warga</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-emerald-300">37.4%</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Porsi Desa</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-white">8 / 2</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">RT / RW</div></div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Fasilitas Wilayah Terpadu:</div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Building2 className="w-3.5 h-3.5 text-[#009388]" /><span>Kantor Balai Desa & Pendopo</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Activity className="w-3.5 h-3.5 text-emerald-300" /><span>Puskesmas Pembantu (Pustu)</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Landmark className="w-3.5 h-3.5 text-[#eda50c]" /><span>Gedung SDN 1 Kadurama</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" /><span>Gerai BUMDes Bina Mandiri</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 text-slate-200">
                          <span className="w-2 h-2 rounded-full bg-[#009388]" />
                          <span>Kepala Dusun I: <strong className="text-white">Bpk. Ahmad Dahlan</strong></span>
                          <span className="text-slate-400">• Wilayah Kerja RT 01 s.d. RT 08</span>
                        </div>
                        <a href="#geografis" onClick={() => setActiveFacilityId(1)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-lg transition">
                          <MapPin className="w-3.5 h-3.5" /><span>Lihat Fasilitas Dusun di Peta</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* SLIDE 2: REAL DUSUN PAHING (SLIDE UTAMA 2)                 */}
                  {/* ========================================================= */}
                  <div className="w-full flex-shrink-0 relative min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=85"
                      alt="Panorama Sawah Dusun Pahing Kadurama"
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#011715] via-[#011715]/75 to-black/30 lg:bg-gradient-to-r lg:from-[#011715]/95 lg:via-[#011715]/80 lg:to-transparent z-0" />
                    <div className="relative z-10 h-full p-6 sm:p-10 lg:p-14 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="px-3.5 py-1.5 rounded-full bg-[#eda50c] text-slate-950 text-xs font-bold uppercase tracking-wider shadow-md">
                            Dusun II • Pahing
                          </span>
                          <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-amber-200 text-xs font-medium border border-white/15">
                            Lumbung Pangan & Ketahanan Padi
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
                          Hamparan 64 Hektar Sawah Beririgasi Teknis & Lumbung Padi Organik
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200/95 leading-relaxed font-normal max-w-xl">
                          Lumbung kedaulatan pangan utama Desa Kadurama dengan hamparan sawah produktif beririgasi teknis teratur, dikelola kelompok tani Sri Rejeki dengan sarana rice milling mandiri serta kompleks olahraga Gelora Kadurama.
                        </p>
                        <div className="border-y border-white/15 py-4 my-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 font-mono">
                          <div><div className="text-2xl sm:text-3xl font-black text-white">162</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Kepala Keluarga</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-[#eda50c]">548</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Jiwa Warga</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-emerald-300">64 Ha</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Lahan Sawah</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-white">7 / 2</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">RT / RW</div></div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Fasilitas Wilayah Terpadu:</div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Wheat className="w-3.5 h-3.5 text-[#eda50c]" /><span>Lumbung Pangan & Rice Milling</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Droplets className="w-3.5 h-3.5 text-cyan-300" /><span>Pintu Saluran Irigasi Teknis</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#009388]" /><span>Posyandu Melati I Dusun Pahing</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Award className="w-3.5 h-3.5 text-emerald-300" /><span>Gelora Olahraga Kadurama</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 text-slate-200">
                          <span className="w-2 h-2 rounded-full bg-[#eda50c]" />
                          <span>Kepala Dusun II: <strong className="text-white">Bpk. Rohmat Hidayat</strong></span>
                          <span className="text-slate-400">• Wilayah Kerja RT 01 s.d. RT 07</span>
                        </div>
                        <a href="#geografis" onClick={() => setActiveFacilityId(4)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#eda50c] hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition">
                          <MapPin className="w-3.5 h-3.5" /><span>Lihat Fasilitas Dusun di Peta</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* SLIDE 3: REAL DUSUN PUHUN (SLIDE UTAMA 3)                  */}
                  {/* ========================================================= */}
                  <div className="w-full flex-shrink-0 relative min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85"
                      alt="Panorama Lereng Dusun Puhun Kadurama"
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#011715] via-[#011715]/75 to-black/30 lg:bg-gradient-to-r lg:from-[#011715]/95 lg:via-[#011715]/80 lg:to-transparent z-0" />
                    <div className="relative z-10 h-full p-6 sm:p-10 lg:p-14 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="px-3.5 py-1.5 rounded-full bg-[#003733] text-emerald-200 border border-emerald-400/40 text-xs font-bold uppercase tracking-wider shadow-md">
                            Dusun III • Puhun
                          </span>
                          <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-emerald-200 text-xs font-medium border border-white/15">
                            Mata Air Purba & Agrowisata Ciremai
                          </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-emerald-200 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                          <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Elevasi 340 mdpl</span>
                        </div>
                      </div>
                      <div className="my-auto py-6 max-w-2xl space-y-4">
                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                          Dusun Puhun
                        </h3>
                        <div className="text-sm sm:text-base font-semibold text-emerald-300">
                          Mata Air Alami Purba Cikaduran 45 Liter/Detik & Agrobisnis Ubi Jalar
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200/95 leading-relaxed font-normal max-w-xl">
                          Kawasan perbukitan sejuk di elevasi 340 mdpl lereng Gunung Ciremai. Menjadi sumber mata air alami Cikaduran dengan debit melimpah untuk konsumsi warga, perkebunan ubi manis lereng gunung, dan sentra sapi perah terpadu.
                        </p>
                        <div className="border-y border-white/15 py-4 my-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 font-mono">
                          <div><div className="text-2xl sm:text-3xl font-black text-white">146</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Kepala Keluarga</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-[#eda50c]">492</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Jiwa Warga</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-cyan-300">45 L/s</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Debit Mata Air</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-white">6 / 2</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">RT / RW</div></div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Fasilitas Wilayah Terpadu:</div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Droplets className="w-3.5 h-3.5 text-cyan-400" /><span>Mata Air Purba Cikaduran</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Mountain className="w-3.5 h-3.5 text-[#009388]" /><span>Jalur Agrowisata Ubi Jalar</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /><span>Posyandu Melati II Dusun Puhun</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Award className="w-3.5 h-3.5 text-amber-300" /><span>Peternakan Sapi Perah Rakyat</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 text-slate-200">
                          <span className="w-2 h-2 rounded-full bg-[#009388]" />
                          <span>Kepala Dusun III: <strong className="text-white">Bpk. Agus Setiawan</strong></span>
                          <span className="text-slate-400">• Wilayah Kerja RT 01 s.d. RT 06</span>
                        </div>
                        <a href="#geografis" onClick={() => setActiveFacilityId(7)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-lg transition">
                          <MapPin className="w-3.5 h-3.5" /><span>Lihat Fasilitas Dusun di Peta</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* SLIDE 4: CLONE OF DUSUN MANIS (UNTUK SEAMLESS NEXT LOOP)   */}
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
                            Dusun I • Manis
                          </span>
                          <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-emerald-200 text-xs font-medium border border-white/15">
                            Pusat Administrasi & Pelayanan Warga
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
                          Sentra Pemerintahan Desa, Layanan Medis Siaga & UMKM Olahan Pangan
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200/95 leading-relaxed font-normal max-w-xl">
                          Wilayah gerbang masuk desa yang menjadi pusat koordinasi administrasi Balai Desa Kadurama, Puskesmas Pembantu 24 jam, sekolah dasar, dan sentra produksi keripik olahan ubi jalar serta rengginang khas warga.
                        </p>
                        <div className="border-y border-white/15 py-4 my-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 font-mono">
                          <div><div className="text-2xl sm:text-3xl font-black text-white">184</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Kepala Keluarga</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-[#eda50c]">620</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Jiwa Warga</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-emerald-300">37.4%</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">Porsi Desa</div></div>
                          <div><div className="text-2xl sm:text-3xl font-black text-white">8 / 2</div><div className="text-[11px] text-slate-300 font-sans mt-0.5">RT / RW</div></div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Fasilitas Wilayah Terpadu:</div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Building2 className="w-3.5 h-3.5 text-[#009388]" /><span>Kantor Balai Desa & Pendopo</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Activity className="w-3.5 h-3.5 text-emerald-300" /><span>Puskesmas Pembantu (Pustu)</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Landmark className="w-3.5 h-3.5 text-[#eda50c]" /><span>Gedung SDN 1 Kadurama</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" /><span>Gerai BUMDes Bina Mandiri</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 text-slate-200">
                          <span className="w-2 h-2 rounded-full bg-[#009388]" />
                          <span>Kepala Dusun I: <strong className="text-white">Bpk. Ahmad Dahlan</strong></span>
                          <span className="text-slate-400">• Wilayah Kerja RT 01 s.d. RT 08</span>
                        </div>
                        <a href="#geografis" onClick={() => setActiveFacilityId(1)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-lg transition">
                          <MapPin className="w-3.5 h-3.5" /><span>Lihat Fasilitas Dusun di Peta</span>
                        </a>
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
                      className={`transition-all duration-300 cursor-pointer ${
                        isActive
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
                    <span className="w-2.5 h-2.5 rounded-full bg-[#009388]" />
                    <span className="text-slate-700 font-sans text-[11px]">Manis (37.4%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#eda50c]" />
                    <span className="text-slate-700 font-sans text-[11px]">Pahing (33.0%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#003733]" />
                    <span className="text-slate-700 font-sans text-[11px]">Puhun (29.6%)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 2: PETA GEOGRAFIS, TOPOGRAFI & SEBARAN TITIK FASILITAS   */}
          {/* =============================================================== */}
          <section id="geografis" className="py-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.16] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3 py-1 rounded-full border border-[#009388]/20">
                    Geospasial & Kondisi Wilayah
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                    Peta Geografis & Titik Sebaran Fasilitas Desa
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 max-w-xl">
                    Eksplorasi letak geografis, kontur ketinggian lereng Ciremai, batas wilayah, dan lokasi fasilitas pelayanan publik di 3 dusun.
                  </p>
                </div>

                {/* Filter Kategori Titik Fasilitas */}
                <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs flex-wrap">
                  {[
                    { id: "all", label: "Semua Titik" },
                    { id: "pemerintahan", label: "Pemerintahan" },
                    { id: "kesehatan", label: "Kesehatan" },
                    { id: "pendidikan", label: "Pendidikan" },
                    { id: "ekonomi", label: "Ekonomi / Tani" },
                    { id: "alam", label: "Konservasi Alam" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFacilityCategoryFilter(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition text-[11px] ${
                        facilityCategoryFilter === tab.id
                          ? "bg-[#009388] text-white"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Kartu Metrik Geospasial */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5 text-[#009388]" />
                    <span>Koordinat Astronomis</span>
                  </div>
                  <div className="text-sm sm:text-base font-mono font-bold text-slate-900 mt-1.5">
                    6°59'48"S 108°33'12"E
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Kecamatan Ciawigebang</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5 text-[#eda50c]" />
                    <span>Topografi & Elevasi</span>
                  </div>
                  <div className="text-sm sm:text-base font-mono font-bold text-slate-900 mt-1.5">
                    285 - 340 mdpl
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Lereng Timur G. Ciremai</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    <Layers className="w-3.5 h-3.5 text-[#009388]" />
                    <span>Luas Total Wilayah</span>
                  </div>
                  <div className="text-sm sm:text-base font-mono font-bold text-slate-900 mt-1.5">
                    142,8 Hektar
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Sawah: 64 Ha | Daratan: 78 Ha</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-[#eda50c]" />
                    <span>Batas Wilayah Desa</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-1.5">
                    U: Karangkancana | S: Ciomas
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">B: Ciawigebang | T: Sukaraja</div>
                </div>
              </div>

              {/* Layout Peta Interaktif & Panel Detail Fasilitas */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Visual Interactive Civic Map Canvas (Col 8) */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm overflow-hidden relative">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#009388] animate-pulse"></span>
                      <span className="font-bold text-slate-800">
                        Visualisasi Zonasi 3 Dusun & Persebaran {filteredFacilities.length} Fasilitas
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Skala Tematik 1:5.000</span>
                  </div>

                  {/* Canvas Peta Tematik Representasi SVG & Grid Zonasi */}
                  <div className="relative w-full h-[420px] bg-gradient-to-br from-emerald-950/5 via-slate-100 to-amber-950/10 rounded-2xl border border-slate-200 overflow-hidden select-none flex items-center justify-center p-4">
                    {/* SVG Garis Kontur & Zonasi 3 Dusun */}
                    <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid-map" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid-map)" />
                      {/* Batas Dusun I (Manis) - Barat */}
                      <path d="M 40 20 Q 180 80 260 220 T 120 400 Z" fill="#009388" fillOpacity="0.12" stroke="#009388" strokeWidth="1.5" strokeDasharray="4 2" />
                      {/* Batas Dusun II (Pahing) - Tengah & Selatan Sawah */}
                      <path d="M 260 20 Q 420 120 480 340 T 260 410 Z" fill="#eda50c" fillOpacity="0.14" stroke="#eda50c" strokeWidth="1.5" strokeDasharray="4 2" />
                      {/* Batas Dusun III (Puhun) - Timur & Perbukitan */}
                      <path d="M 480 40 Q 660 140 760 360 T 480 400 Z" fill="#003733" fillOpacity="0.15" stroke="#003733" strokeWidth="1.5" strokeDasharray="4 2" />
                      {/* Aliran Sungai Cikaduran */}
                      <path d="M 720 30 Q 560 180 380 260 T 40 370" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                    </svg>

                    {/* Label Zonasi Dusun di Peta */}
                    <div className="absolute top-6 left-12 px-3 py-1 rounded-lg bg-white/80 backdrop-blur-xs border border-[#009388]/30 text-[10px] font-extrabold text-[#009388] shadow-xs">
                      ZONA I: DUSUN MANIS (Pemerintahan & UMKM)
                    </div>
                    <div className="absolute bottom-8 left-1/3 px-3 py-1 rounded-lg bg-white/80 backdrop-blur-xs border border-[#eda50c]/30 text-[10px] font-extrabold text-[#b45309] shadow-xs">
                      ZONA II: DUSUN PAHING (Lumbung Padi Organik)
                    </div>
                    <div className="absolute top-8 right-10 px-3 py-1 rounded-lg bg-white/80 backdrop-blur-xs border border-[#003733]/30 text-[10px] font-extrabold text-[#003733] shadow-xs">
                      ZONA III: DUSUN PUHUN (Perkebunan Ubi & Air)
                    </div>

                    {/* Titik-titik Pin Interaktif Fasilitas */}
                    <div className="absolute inset-0 pointer-events-auto">
                      {filteredFacilities.map((f, idx) => {
                        // Coordinates placement mapping on canvas
                        const positions: Record<number, { top: string; left: string }> = {
                          1: { top: "35%", left: "18%" }, // Balai Desa (Manis)
                          2: { top: "48%", left: "22%" }, // Pustu (Manis)
                          3: { top: "22%", left: "16%" }, // SDN 1 (Manis)
                          4: { top: "58%", left: "26%" }, // BUMDes (Manis)
                          5: { top: "42%", left: "48%" }, // Posyandu I (Pahing)
                          6: { top: "66%", left: "42%" }, // Lumbung Padi (Pahing)
                          7: { top: "28%", left: "45%" }, // Gelora Kadurama (Pahing)
                          8: { top: "20%", left: "78%" }, // Mata Air Cikaduran (Puhun)
                          9: { top: "48%", left: "72%" }, // Posyandu II (Puhun)
                          10: { top: "72%", left: "80%" }, // Peternakan Sapi (Puhun)
                        };
                        const pos = positions[f.id] || { top: "50%", left: "50%" };
                        const isSelected = activeFacilityId === f.id;

                        return (
                          <button
                            key={f.id}
                            onClick={() => setActiveFacilityId(f.id)}
                            style={{ top: pos.top, left: pos.left }}
                            title={`${f.nama} (${f.dusun})`}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 z-20 ${
                              isSelected ? "scale-125 z-30" : "hover:scale-115"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition border-2 ${
                                isSelected
                                  ? "bg-[#009388] text-white border-[#eda50c] ring-4 ring-[#009388]/30"
                                  : f.dusun === "Manis"
                                  ? "bg-white text-[#009388] border-[#009388]"
                                  : f.dusun === "Pahing"
                                  ? "bg-white text-[#b45309] border-[#eda50c]"
                                  : "bg-white text-[#003733] border-[#003733]"
                              }`}
                            >
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition pointer-events-none">
                              {f.nama}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#009388]"></span>
                        <span>Dusun Manis</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#eda50c]"></span>
                        <span>Dusun Pahing</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#003733]"></span>
                        <span>Dusun Puhun</span>
                      </span>
                    </div>
                    <span>Klik sembarang pin pada peta untuk menampilkan rincian fasilitas</span>
                  </div>
                </div>

                {/* Panel Detail Fasilitas Terpilih (Col 4) */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#e6f7f5] text-[#009388] uppercase tracking-wider">
                        Dusun {selectedFacility.dusun}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {selectedFacility.status}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                      {selectedFacility.nama}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {selectedFacility.deskripsi}
                    </p>

                    <div className="mt-5 space-y-3 pt-4 border-t border-slate-100 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Alamat / Lokasi
                        </div>
                        <div className="font-semibold text-slate-800 mt-0.5">
                          {selectedFacility.alamat}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Ketinggian / Elevasi
                          </div>
                          <div className="font-mono font-semibold text-[#009388] mt-0.5">
                            {selectedFacility.elevasi}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Kategori
                          </div>
                          <div className="font-semibold text-slate-800 capitalize mt-0.5">
                            {selectedFacility.kategori}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Waktu Operasional
                        </div>
                        <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#eda50c]" />
                          <span>{selectedFacility.jamBuka}</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Titik Koordinat GPS
                        </div>
                        <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                          {selectedFacility.koordinat}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <a
                      href="#lokasi-kantor"
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#e6f7f5] text-slate-700 hover:text-[#009388] font-bold text-xs transition flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Petunjuk Rute ke Lokasi</span>
                    </a>
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
              <div className="max-w-2xl mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3 py-1 rounded-full border border-[#009388]/20">
                  Kanal Layanan Warga
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                  Panduan Pengurusan Berkas & Pelayanan Masyarakat
                </h2>
                <p className="text-sm text-slate-600 mt-2">
                  Petunjuk berkas syarat dokumen administrasi kependudukan dan rekomendasi sosial langsung di kantor Balai Desa Kadurama.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Panduan 1: Kependudukan (KTP & KK) */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#009388]/50 transition-all hover:shadow-md">
                  <div className="w-11 h-11 rounded-2xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center font-bold text-sm mb-4">
                    KTP/KK
                  </div>
                  <h3 className="font-bold text-slate-950 text-lg">Pembaruan KK & KTP Elektronik</h3>
                  <p className="text-xs text-slate-600 mt-1 mb-5">
                    Penambahan anggota keluarga, perubahan pekerjaan, pisah KK baru, atau pergantian data rusak.
                  </p>
                  <div className="text-xs space-y-2.5 border-t border-slate-200 pt-5">
                    <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Syarat Dokumen:</div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Kartu Keluarga (KK) Asli</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Buku Nikah / Akta Lahir Baru</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Formulir Pengantar RT/RW Dusun</span>
                    </div>
                  </div>
                </div>

                {/* Panduan 2: Bansos & Kesejahteraan */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#009388]/50 transition-all hover:shadow-md">
                  <div className="w-11 h-11 rounded-2xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center font-bold text-sm mb-4">
                    BANSOS
                  </div>
                  <h3 className="font-bold text-slate-950 text-lg">Verifikasi Sensus & DTKS Bansos</h3>
                  <p className="text-xs text-slate-600 mt-1 mb-5">
                    Pengecekan desil kesejahteraan, usulan baru penerima PKH/BPNT, serta pendataan bedah rumah (RTLH).
                  </p>
                  <div className="text-xs space-y-2.5 border-t border-slate-200 pt-5">
                    <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Syarat Dokumen:</div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Fotokopi KTP & KK Kepala Keluarga</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Foto Kondisi Fisik Rumah (RTLH)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Verifikasi Langsung Kepala Dusun</span>
                    </div>
                  </div>
                </div>

                {/* Panduan 3: Pajak PBB-P2 */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#009388]/50 transition-all hover:shadow-md">
                  <div className="w-11 h-11 rounded-2xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center font-bold text-sm mb-4">
                    PBB
                  </div>
                  <h3 className="font-bold text-slate-950 text-lg">Layanan Kolektor PBB-P2 Dusun</h3>
                  <p className="text-xs text-slate-600 mt-1 mb-5">
                    Pengecekan tagihan SPPT, pembayaran Pajak Bumi dan Bangunan, dan mutasi balik nama objek pajak.
                  </p>
                  <div className="text-xs space-y-2.5 border-t border-slate-200 pt-5">
                    <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Syarat Dokumen:</div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>SPPT PBB Tahun Berjalan / Terakhir</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Fotokopi KTP Pemilik Objek Tanah</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#009388] flex-shrink-0" />
                      <span>Bukti Pembayaran kepada Kadus</span>
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
                  <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3 py-1 rounded-full border border-[#009388]/20">
                    Pamong & Aparatur
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
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
                      SUHENDRA, S.Sos
                    </h3>
                    <p className="text-xs font-mono text-emerald-200 mt-0.5">NIP. 19780412 200501 1 008</p>
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
                      <span className="font-semibold text-[#eda50c]">3 Dusun & 21 RT</span>
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
                      Koordinator administrasi umum, perencanaan pembangunan, dan verifikasi basis data sensus desa.
                    </p>
                  </div>
                </div>

                {/* Kadus Manis */}
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
                        Kepala Dusun I
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-extrabold text-slate-900 text-base uppercase">AHMAD DAHLAN</h4>
                    <div className="text-xs font-semibold text-[#009388] mt-0.5">Kepala Dusun Manis</div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Penanggung jawab ketenteraman wilayah Dusun Manis (8 RT), surveyor sensus keluarga, dan penagihan PBB-P2.
                    </p>
                  </div>
                </div>

                {/* Kadus Pahing */}
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
                        Kepala Dusun II
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-extrabold text-slate-900 text-base uppercase">ROHMAT HIDAYAT</h4>
                    <div className="text-xs font-semibold text-[#009388] mt-0.5">Kepala Dusun Pahing</div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Koordinator lumbung pangan padi Dusun Pahing (7 RT), monitoring irigasi sawah, dan pendataan RTLH.
                    </p>
                  </div>
                </div>

                {/* Kadus Puhun */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:border-[#009388] hover:shadow-lg transition">
                  <div className="relative h-72 overflow-hidden bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80"
                      alt="Kadus Puhun"
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
                    <h4 className="font-extrabold text-slate-900 text-base uppercase">AGUS SETIAWAN</h4>
                    <div className="text-xs font-semibold text-[#009388] mt-0.5">Kepala Dusun Puhun</div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Pengelola konservasi mata air Cikaduran, pendamping kelompok tani ubi & peternak Dusun Puhun (6 RT).
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
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3 py-1 rounded-full border border-[#009388]/20">
                    Transparansi Anggaran
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                    Realisasi APBDes Tahun Anggaran 2026
                  </h2>
                  <p className="text-sm text-slate-600 mt-2">
                    Laporan serapan pendapatan, belanja 5 bidang, dan pembiayaan desa untuk akuntabilitas publik.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs">
                  <button
                    onClick={() => setApbdesFilter("all")}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                      apbdesFilter === "all" ? "bg-[#009388] text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setApbdesFilter("pendapatan")}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                      apbdesFilter === "pendapatan" ? "bg-[#009388] text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Pendapatan
                  </button>
                  <button
                    onClick={() => setApbdesFilter("belanja")}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                      apbdesFilter === "belanja" ? "bg-[#009388] text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Belanja
                  </button>
                </div>
              </div>

              {/* 3 Cockpit Cards Utama */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#009388]">
                    Total Pendapatan Desa
                  </div>
                  <div
                    id="apbdes-pendapatan-val"
                    className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2 font-mono"
                  >
                    Rp {apbdesTotals.pendapatan.toLocaleString("id-ID")}
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
                    Rp {apbdesTotals.belanja.toLocaleString("id-ID")}
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
                    {apbdesTotals.serapan}%
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3 overflow-hidden">
                    <div
                      id="apbdes-progress-bar"
                      className="bg-[#009388] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${apbdesTotals.serapan}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Grid 5 Bidang Belanja */}
              {(apbdesFilter === "all" || apbdesFilter === "belanja") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {apbdesBidangList.map((bidang) => (
                    <div
                      key={bidang.id}
                      className="apbdes-bidang-card p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-[#009388] uppercase bg-[#e6f7f5] px-2 py-0.5 rounded">
                            Bidang {bidang.id}
                          </span>
                          <span className="text-xs font-bold text-[#009388]">
                            {bidang.persen}% Terpakai
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-2">{bidang.nama}</h4>
                        <p className="text-xs text-slate-500 mt-1">{bidang.keterangan}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                        <span className="text-slate-500">Pagu:</span>
                        <span className="font-bold text-slate-900">
                          Rp {bidang.pagu.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))}

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
          {/* SECTION 6: KABAR & BERITA DESA KADURAMA                         */}
          {/* =============================================================== */}
          <section id="berita" className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3 py-1 rounded-full border border-[#009388]/20">
                    Informasi Terkini
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                    Kabar & Berita Kegiatan Desa
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 max-w-xl">
                    Informasi resmi kegiatan pemerintah desa, musyawarah 3 dusun, agenda pembangunan, dan penyaluran bansos masyarakat.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {newsList
                  .filter((item) => item.status === "Terbit")
                  .slice(0, 3)
                  .map((item) => (
                    <article
                      key={item.id}
                      className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden hover:shadow-md transition group flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-48 bg-slate-200 overflow-hidden relative">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div
                            className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase ${
                              item.category === "Bansos"
                                ? "bg-[#eda50c] text-slate-950"
                                : "bg-[#009388] text-white"
                            }`}
                          >
                            {item.category}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="text-[11px] text-slate-500 mb-2">
                            {item.date} • {item.author}
                          </div>
                          <h3 className="font-bold text-slate-900 text-base group-hover:text-[#009388] transition line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                            {item.summary}
                          </p>
                        </div>
                      </div>
                      <div className="px-6 pb-6 pt-0">
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs font-semibold text-[#009388]">
                          <span>Baca Selengkapnya</span>
                          <span>→</span>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 7: LOKASI KANTOR DESA & KONTAK                           */}
          {/* =============================================================== */}
          <section id="lokasi-kantor" className="py-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#009388] bg-[#e6f7f5] px-3 py-1 rounded-full border border-[#009388]/20">
                    Pusat Informasi
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-3">
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
          <footer className="bg-[#002f2b] text-white py-12 border-t border-[#005851]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-emerald-200/80">
                <div className="flex items-center gap-3">
                  <Image src="/kuningan-logo.png" alt="Logo" width={28} height={28} className="object-contain" />
                  <div>
                    <strong className="text-white">Pemerintah Desa Kadurama</strong> • Kecamatan Ciawigebang, Kabupaten Kuningan
                  </div>
                </div>
                <div>© 2026 Desa Kadurama. Seluruh Hak Cipta Dilindungi.</div>
              </div>
            </div>
          </footer>
        </main>
      ) : (
        /* =================================================================== */
        /* VIEW 2: BACKPANEL APARATUR PEMDES (DATA CENTER & SENSUS)           */
        /* =================================================================== */
        <div className="flex h-screen overflow-hidden bg-slate-100">
          {/* Sidebar Backpanel (Fixed / Full Height / Zero Scroll) */}
          <aside className="no-print w-64 bg-[#003733] text-white flex-shrink-0 h-full flex flex-col justify-between border-r border-[#005851] z-20 select-none">
            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="p-5 border-b border-[#005851] flex items-center gap-3">
                <Image src="/kuningan-logo.png" alt="Logo" width={32} height={32} className="object-contain" />
                <div>
                  <div className="font-bold text-sm leading-tight text-white">Data Center Pemdes</div>
                  <div className="text-[11px] text-[#eda50c]">Desa Kadurama • Kuningan</div>
                </div>
              </div>

              <div className="p-3 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/70 px-3 py-2">
                  Pendataan & Kependudukan
                </div>

                {/* TAB 1: SENSUS KELUARGA (PER KK) */}
                <button
                  onClick={() => setAdminTab("sensus")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                    adminTab === "sensus"
                      ? "bg-[#009388] text-white shadow-sm"
                      : "text-emerald-100 hover:bg-[#005851]"
                  }`}
                >
                  <ClipboardCheck className="w-4 h-4 text-[#eda50c]" />
                  <span>Sensus Keluarga & Desil</span>
                </button>

                {/* TAB 2: DATA KEPENDUDUKAN (3 DUSUN) */}
                <button
                  onClick={() => setAdminTab("residents")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                    adminTab === "residents"
                      ? "bg-[#009388] text-white shadow-sm"
                      : "text-emerald-100 hover:bg-[#005851]"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Data Penduduk (3 Dusun)</span>
                </button>

                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/70 px-3 pt-4 pb-2">
                  Portal & Transparansi
                </div>

                {/* TAB 3: MANAJEMEN KABAR DESA */}
                <button
                  onClick={() => setAdminTab("berita")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                    adminTab === "berita"
                      ? "bg-[#009388] text-white shadow-sm"
                      : "text-emerald-100 hover:bg-[#005851]"
                  }`}
                >
                  <Newspaper className="w-4 h-4" />
                  <span>Manajemen Kabar Desa</span>
                </button>

                {/* TAB 4: KELOLA APBDES 2026 */}
                <button
                  onClick={() => setAdminTab("apbdes")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                    adminTab === "apbdes"
                      ? "bg-[#009388] text-white shadow-sm"
                      : "text-emerald-100 hover:bg-[#005851]"
                  }`}
                >
                  <PieChart className="w-4 h-4" />
                  <span>Kelola APBDes 2026</span>
                </button>
              </div>
            </div>

            {/* Profil Operator & Role Switcher Kadus */}
            <div className="p-4 border-t border-[#005851] bg-[#002f2b]">
              <div className="mb-2.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-300/80 mb-1">
                  Wilayah / Hak Akses Kadus
                </label>
                <select
                  value={adminKadusRole}
                  onChange={(e) => setAdminKadusRole(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#003733] border border-[#005851] text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#009388]"
                >
                  <option value="all">Semua Wilayah (Admin Desa)</option>
                  <option value="Manis">Kadus Manis (Ahmad Dahlan)</option>
                  <option value="Pahing">Kadus Pahing (Rohmat Hidayat)</option>
                  <option value="Puhun">Kadus Puhun (Agus Setiawan)</option>
                </select>
              </div>

              <div className="flex items-center gap-2.5 pt-2 border-t border-[#005851]">
                <div className="w-7 h-7 rounded-full bg-[#eda50c] text-slate-950 font-bold flex items-center justify-center text-xs">
                  {adminKadusRole === "all" ? "OP" : adminKadusRole.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {adminKadusRole === "all"
                      ? "Operator Balai Desa"
                      : `Kadus Dusun ${adminKadusRole}`}
                  </div>
                  <div className="text-[10px] text-emerald-300 truncate">Petugas Sensus Lapangan</div>
                </div>
              </div>

              <button
                onClick={() => setView("public")}
                className="mt-3 w-full py-2 rounded-xl bg-[#005851] hover:bg-[#004741] text-emerald-100 hover:text-white text-[11px] font-bold transition flex items-center justify-center gap-2 shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Kembali ke Portal Warga</span>
              </button>
            </div>
          </aside>

          {/* Konten Utama Backpanel (Scrollable Independen) */}
          <main className="flex-1 h-full overflow-y-auto p-6 lg:p-8 relative z-10">
            <div className="max-w-[1400px] mx-auto pb-16">
              {/* ============================================================ */}
              {/* TAB 1: SENSUS KELUARGA & DESIL (PER KK)                     */}
              {/* ============================================================ */}
              {adminTab === "sensus" && (
                <div className="no-print space-y-6">
                  {/* Top Bar Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2.5">
                        <ClipboardCheck className="w-6 h-6 text-[#009388]" />
                        <span>Sensus & Profil Kesejahteraan Keluarga (Per KK)</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Basis data mikro 3 Dusun: estimasi desil kesejahteraan, kepatuhan PBB-P2, kelayakan fisik rumah (RTLH), kerentanan sosial, dan rekam bansos.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={handleExportSensusExcel}
                        className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-[#eda50c]" />
                        <span>Ekspor Data Excel (.CSV)</span>
                      </button>
                      <button
                        onClick={handleOpenCreateSensus}
                        className="px-4 py-2.5 bg-[#009388] hover:bg-[#007b71] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Input Sensus KK Baru</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Cockpit Cards Ringkasan Sensus */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Total Keluarga Terdata
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                        {totalKkCount} KK
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Dari estimasi 492 KK di 3 Dusun
                      </div>
                    </div>

                    <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#009388]">
                        Realisasi PBB-P2 2026
                      </div>
                      <div className="text-2xl font-extrabold text-[#009388] mt-1 font-mono">
                        {lunasPbbPercent}% Lunas
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {lunasPbbCount} Lunas / {totalKkCount - lunasPbbCount} Terutang
                      </div>
                    </div>

                    <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                        Desil 1 & 2 (Prioritas Bansos)
                      </div>
                      <div className="text-2xl font-extrabold text-amber-600 mt-1 font-mono">
                        {desilRentanCount} KK
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Keluarga sangat miskin & miskin
                      </div>
                    </div>

                    <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                        RTLH (Bedah Rumah)
                      </div>
                      <div className="text-2xl font-extrabold text-red-600 mt-1 font-mono">
                        {rtlhCount} Rumah
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Lantai tanah / bilik bambu / seng lapuk
                      </div>
                    </div>
                  </div>

                  {/* Filter Bar Cerdas Sensus */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {/* Filter Dusun */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-700 mr-2 flex items-center gap-1">
                          <Filter className="w-3.5 h-3.5 text-[#009388]" />
                          <span>Dusun:</span>
                        </span>
                        {["all", "Manis", "Pahing", "Puhun"].map((dusun) => (
                          <button
                            key={dusun}
                            onClick={() => {
                              setSensusDusunFilter(dusun);
                              setSensusCurrentPage(1);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              sensusDusunFilter === dusun
                                ? "bg-[#009388] text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {dusun === "all" ? "Semua Dusun" : `Dusun ${dusun}`}
                          </button>
                        ))}
                      </div>

                      {/* Live Search No KK / NIK / Nama */}
                      <div className="relative w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={sensusSearch}
                          onChange={(e) => {
                            setSensusSearch(e.target.value);
                            setSensusCurrentPage(1);
                          }}
                          placeholder="Cari No. KK, NIK, atau Nama..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#009388]"
                        />
                      </div>
                    </div>

                    {/* Filter Desil & Status Pajak & Program */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-medium">Desil:</span>
                        <select
                          value={sensusDesilFilter}
                          onChange={(e) => {
                            setSensusDesilFilter(e.target.value);
                            setSensusCurrentPage(1);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 font-semibold text-slate-800 text-xs focus:ring-1 focus:ring-[#009388]"
                        >
                          <option value="all">Semua Desil</option>
                          <option value="1">Desil 1 (Sangat Miskin)</option>
                          <option value="2">Desil 2 (Miskin)</option>
                          <option value="3">Desil 3 (Hampir Miskin)</option>
                          <option value="4">Desil 4+ (Mampu)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-medium">Status PBB:</span>
                        <select
                          value={sensusPbbFilter}
                          onChange={(e) => {
                            setSensusPbbFilter(e.target.value);
                            setSensusCurrentPage(1);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 font-semibold text-slate-800 text-xs focus:ring-1 focus:ring-[#009388]"
                        >
                          <option value="all">Semua Status PBB</option>
                          <option value="Lunas">Lunas PBB 2026</option>
                          <option value="Belum Lunas">Belum Lunas / Terutang</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-medium">Filter Kategori Program:</span>
                        <select
                          value={sensusProgramFilter}
                          onChange={(e) => {
                            setSensusProgramFilter(e.target.value);
                            setSensusCurrentPage(1);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 font-bold text-[#009388] text-xs focus:ring-1 focus:ring-[#009388]"
                        >
                          <option value="all">Semua Kategori</option>
                          <option value="rtlh">Calon Bedah Rumah (RTLH)</option>
                          <option value="stunting">Keluarga Balita Stunting</option>
                          <option value="lansia">Keluarga Lansia Tunggal</option>
                          <option value="bansos">Penerima Bansos Aktif</option>
                          <option value="non-bansos">Belum Terima Bansos (Non-Bansos)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tabel Data Sensus Keluarga */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3.5">No. KK & NIK</th>
                            <th className="px-4 py-3.5">Kepala Keluarga</th>
                            <th className="px-4 py-3.5">Dusun & RT/RW</th>
                            <th className="px-4 py-3.5">Desil Kesejahteraan</th>
                            <th className="px-4 py-3.5">Status PBB-P2</th>
                            <th className="px-4 py-3.5">Kondisi Rumah</th>
                            <th className="px-4 py-3.5">Kerentanan & Bansos</th>
                            <th className="px-4 py-3.5 text-right">Aksi Sensus</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedSensus.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition">
                              <td className="px-4 py-3 font-mono">
                                <div className="font-bold text-slate-900">{item.noKk}</div>
                                <div className="text-[11px] text-slate-500">NIK: {item.nikKepalaKeluarga}</div>
                              </td>

                              <td className="px-4 py-3">
                                <div className="font-bold text-[#003733] text-sm">
                                  {item.namaKepalaKeluarga}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  {item.pekerjaanUtama} • {item.jumlahAnggota} Anggota
                                </div>
                              </td>

                              <td className="px-4 py-3">
                                <span className="font-semibold text-slate-800">
                                  Dusun {item.dusun}
                                </span>
                                <div className="text-[11px] text-slate-500">
                                  RT {item.rt} / RW {item.rw}
                                </div>
                              </td>

                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    item.desil === 1
                                      ? "bg-red-50 text-red-700 border border-red-200"
                                      : item.desil === 2
                                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                                      : item.desil === 3
                                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  }`}
                                >
                                  Desil {item.desil}
                                  {item.desil === 1
                                    ? " (Sangat Miskin)"
                                    : item.desil === 2
                                    ? " (Miskin)"
                                    : item.desil === 3
                                    ? " (Hampir Miskin)"
                                    : " (Mampu)"}
                                </span>
                              </td>

                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                    item.statusPbb === "Lunas"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {item.statusPbb === "Lunas" ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                  ) : (
                                    <AlertTriangle className="w-3 h-3 text-red-700" />
                                  )}
                                  <span>{item.statusPbb} (2026)</span>
                                </span>
                                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                                  Rp {item.nominalPbb.toLocaleString("id-ID")}
                                </div>
                              </td>

                              <td className="px-4 py-3">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                    item.kondisiRumah === "RTLH"
                                      ? "bg-red-100 text-red-800 border border-red-200"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {item.kondisiRumah}
                                </span>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  Lantai: {item.lantai} • Dinding: {item.dinding}
                                </div>
                              </td>

                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                  {item.kerentanan.adaLansiaTunggal && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800">
                                      Lansia
                                    </span>
                                  )}
                                  {item.kerentanan.adaBalitaStunting && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-100 text-pink-800">
                                      Stunting
                                    </span>
                                  )}
                                  {item.kerentanan.adaDisabilitas && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-800">
                                      Disabilitas
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-600 mt-1 font-semibold">
                                  {item.bansosAktif}
                                </div>
                              </td>

                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Tombol Lembar PDF Personalisasi */}
                                  <button
                                    onClick={() => handleOpenPdfModal(item)}
                                    title="Cetak Lembar Profil Keluarga PDF Terpersonalisasi"
                                    className="px-2.5 py-1.5 rounded-lg bg-[#009388] hover:bg-[#007b71] text-white font-bold text-[11px] transition flex items-center gap-1 shadow-2xs"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-[#eda50c]" />
                                    <span>Lembar PDF</span>
                                  </button>

                                  <button
                                    onClick={() => handleOpenEditSensus(item)}
                                    title="Ubah Data Sensus"
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteSensus(item.id)}
                                    title="Hapus Rekaman Sensus"
                                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition border border-red-200"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Sensus */}
                    <Pagination
                      currentPage={sensusCurrentPage}
                      totalItems={filteredSensus.length}
                      pageSize={sensusPageSize}
                      onPageChange={setSensusCurrentPage}
                      onPageSizeChange={setSensusPageSize}
                      pageSizeOptions={[10, 25]}
                    />
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 2: DATA KEPENDUDUKAN (3 DUSUN KADURAMA)                 */}
              {/* ============================================================ */}
              {adminTab === "residents" && (
                <div className="no-print space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <h2 className="text-xl font-bold text-slate-950">
                        Master Data Kependudukan Desa Kadurama
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Dikelompokkan berdasarkan 3 Dusun resmi (Manis, Pahing, Puhun), rincian Kartu Keluarga (KK), dan RT/RW.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSyncAllResidents}
                        disabled={isSyncingAll}
                        className="px-4 py-2.5 bg-[#009388] hover:bg-[#007b71] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition disabled:opacity-60"
                      >
                        <RefreshCw className={`w-4 h-4 text-[#eda50c] ${isSyncingAll ? "animate-spin" : ""}`} />
                        <span>{isSyncingAll ? "Menyinkronkan..." : "Sinkronisasi Semua (SIAK)"}</span>
                      </button>
                      <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition"
                      >
                        <Upload className="w-4 h-4 text-[#eda50c]" />
                        <span>Bulk Import (Excel / CSV)</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter Wilayah 3 Dusun & Pencarian */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-700 mr-2 flex items-center gap-1">
                        <Filter className="w-3.5 h-3.5 text-[#009388]" />
                        <span>Filter Dusun:</span>
                      </span>
                      <button
                        onClick={() => {
                          setResidentDusunFilter("all");
                          setResidentCurrentPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          residentDusunFilter === "all"
                            ? "bg-[#009388] text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        Semua Dusun
                      </button>
                      {["Manis", "Pahing", "Puhun"].map((dusun) => (
                        <button
                          key={dusun}
                          onClick={() => {
                            setResidentDusunFilter(dusun);
                            setResidentCurrentPage(1);
                          }}
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

                    <div className="relative w-56">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={residentSearch}
                        onChange={(e) => {
                          setResidentSearch(e.target.value);
                          setResidentCurrentPage(1);
                        }}
                        placeholder="Cari NIK / Nama / KK..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#009388]"
                      />
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
                            <th className="px-4 py-3.5">Status Sinkron</th>
                            <th className="px-4 py-3.5 text-right">Aksi Data</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedResidents.map((res) => (
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
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    res.syncStatus === "Tersinkronisasi"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : res.syncStatus === "Diperbarui Internal"
                                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                                      : "bg-blue-50 text-blue-700 border border-blue-200"
                                  }`}
                                >
                                  {res.syncStatus === "Tersinkronisasi" ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <RefreshCw className="w-3 h-3 text-amber-600" />
                                  )}
                                  <span>{res.syncStatus || "Tersinkronisasi"}</span>
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditResident(res)}
                                    title="Koreksi / Perbarui Data Internal"
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#e6f7f5] text-slate-700 hover:text-[#009388] font-bold text-[11px] transition flex items-center gap-1 border border-slate-200"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Perbarui</span>
                                  </button>
                                  <button
                                    onClick={() => handleSyncSingleResident(res.nik)}
                                    title="Sinkronkan data dengan SIAK Dukcapil"
                                    className="p-1.5 rounded-lg bg-[#e6f7f5] hover:bg-[#009388] text-[#009388] hover:text-white transition shadow-2xs border border-[#009388]/20"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <Pagination
                      currentPage={residentCurrentPage}
                      totalItems={filteredResidents.length}
                      pageSize={residentPageSize}
                      onPageChange={setResidentCurrentPage}
                      onPageSizeChange={setResidentPageSize}
                      pageSizeOptions={[10, 25]}
                    />
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 3: MANAJEMEN KABAR & BERITA DESA                         */}
              {/* ============================================================ */}
              {adminTab === "berita" && (
                <div className="no-print space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <h2 className="text-xl font-bold text-slate-950">
                        Manajemen Kabar & Berita Publik Desa
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Publikasi artikel kegiatan 3 dusun, transparansi bansos, dan agenda pembangunan untuk portal warga.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleOpenCreateNews}
                        className="px-4 py-2 bg-[#009388] hover:bg-[#007b71] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tulis Kabar Baru</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3.5">Gambar</th>
                            <th className="px-4 py-3.5">Judul & Ringkasan</th>
                            <th className="px-4 py-3.5">Kategori</th>
                            <th className="px-4 py-3.5">Penulis & Tanggal</th>
                            <th className="px-4 py-3.5">Status Publikasi</th>
                            <th className="px-4 py-3.5 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedNews.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition">
                              <td className="px-4 py-3">
                                <img
                                  src={item.imageUrl}
                                  alt={item.title}
                                  className="w-16 h-12 object-cover rounded-lg border border-slate-200"
                                />
                              </td>
                              <td className="px-4 py-3 max-w-md">
                                <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.summary}</div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#e6f7f5] text-[#009388] border border-[#009388]/20">
                                  {item.category}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-slate-800">{item.author}</div>
                                <div className="text-[11px] text-slate-500">{item.date}</div>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleToggleNewsStatus(item.id)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 ${
                                    item.status === "Terbit"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-slate-100 text-slate-600 border border-slate-300"
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Terbit" ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                                  <span>{item.status}</span>
                                </button>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditNews(item)}
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#e6f7f5] text-slate-700 hover:text-[#009388] font-bold text-[11px] transition flex items-center gap-1 border border-slate-200"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Ubah</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteNews(item.id)}
                                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition border border-red-200"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <Pagination
                      currentPage={newsCurrentPage}
                      totalItems={filteredNews.length}
                      pageSize={newsPageSize}
                      onPageChange={setNewsCurrentPage}
                      onPageSizeChange={setNewsPageSize}
                      pageSizeOptions={[10, 25]}
                    />
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 4: KELOLA TRANSPARANSI APBDES 2026                       */}
              {/* ============================================================ */}
              {adminTab === "apbdes" && (
                <div className="no-print space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <h2 className="text-xl font-bold text-slate-950">
                        Pengelolaan Transparansi APBDes Tahun Anggaran 2026
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Perbarui pagu anggaran, realisasi belanja per bidang, dan kalkulasi serapan untuk transparansi publik warga.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditTotalsModalOpen(true)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition"
                      >
                        <Edit3 className="w-4 h-4 text-[#eda50c]" />
                        <span>Sesuaikan Total Anggaran</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Cockpit */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#009388]">
                        Total Pendapatan Desa
                      </div>
                      <div className="text-2xl font-extrabold text-slate-950 mt-2 font-mono">
                        Rp {apbdesTotals.pendapatan.toLocaleString("id-ID")}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Dana Desa, Alokasi Dana Desa (ADD), & PADes
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#eda50c]">
                        Total Belanja Desa
                      </div>
                      <div className="text-2xl font-extrabold text-slate-950 mt-2 font-mono">
                        Rp {apbdesTotals.belanja.toLocaleString("id-ID")}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Akumulasi pagu dari 5 bidang belanja
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Persentase Serapan Berjalan
                      </div>
                      <div className="text-2xl font-extrabold text-[#009388] mt-2 font-mono">
                        {apbdesTotals.serapan}%
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 overflow-hidden">
                        <div
                          className="bg-[#009388] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${apbdesTotals.serapan}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Tabel 5 Bidang Belanja */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3.5">Bidang</th>
                            <th className="px-4 py-3.5">Pagu Anggaran</th>
                            <th className="px-4 py-3.5">Realisasi Berjalan</th>
                            <th className="px-4 py-3.5">Persentase Serapan</th>
                            <th className="px-4 py-3.5">Keterangan / Program Utama</th>
                            <th className="px-4 py-3.5 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {apbdesBidangList.map((bidang) => (
                            <tr key={bidang.id} className="hover:bg-slate-50 transition">
                              <td className="px-4 py-3.5">
                                <span className="text-[10px] font-bold text-[#009388] uppercase bg-[#e6f7f5] px-2 py-0.5 rounded">
                                  Bidang {bidang.id}
                                </span>
                                <div className="font-bold text-slate-900 text-sm mt-1">{bidang.nama}</div>
                              </td>
                              <td className="px-4 py-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                                Rp {bidang.pagu.toLocaleString("id-ID")}
                              </td>
                              <td className="px-4 py-3.5 font-mono font-bold text-[#009388] whitespace-nowrap">
                                Rp {bidang.realisasi.toLocaleString("id-ID")}
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-slate-800">{bidang.persen}%</span>
                                  <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="bg-[#009388] h-1.5 rounded-full"
                                      style={{ width: `${bidang.persen}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-slate-600 max-w-xs">{bidang.keterangan}</td>
                              <td className="px-4 py-3.5 text-right">
                                <button
                                  onClick={() => handleOpenEditBidang(bidang)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#e6f7f5] text-slate-700 hover:text-[#009388] font-bold text-[11px] transition flex items-center gap-1 border border-slate-200 ml-auto"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Sesuaikan</span>
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
            </div>
          </main>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL LEMBAR PDF PROFIL KELUARGA (TERPERSONALISASI & SIAP CETAK)    */}
      {/* =================================================================== */}
      {isPdfModalOpen && selectedSensusForPdf && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Action Header Bar (No Print) */}
            <div className="no-print flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#eda50c]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Lembar Profil & Verifikasi Kesejahteraan Keluarga
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Dokumen resmi siap cetak format A4 untuk verifikasi lapangan & pengajuan bansos dinas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen (A4)</span>
                </button>
                <button
                  onClick={() => setIsPdfModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* LEMBAR KERTAS A4 ELEGAN DENGAN PALET KUNINGAN TEAL & GOLD */}
            <div className="printable-sheet bg-white border-2 border-slate-800 p-8 sm:p-10 rounded-2xl shadow-sm text-slate-900 text-xs font-sans space-y-6">
              {/* Kop Surat Resmi */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
                <div className="flex items-center gap-4">
                  <Image src="/kuningan-logo.png" alt="Logo Kuningan" width={56} height={56} className="object-contain" />
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
                      Pemerintah Kabupaten Kuningan • Kecamatan Ciawigebang
                    </div>
                    <div className="text-lg sm:text-xl font-extrabold text-slate-950 uppercase tracking-tight">
                      PEMERINTAH DESA KADURAMA
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      Alamat: Jl. Desa Kadurama No. 01, Dusun Manis, Kode Pos 45591 • Surel: pemdes@kadurama.desa.id
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider">No. Reg Sensus</div>
                  <div className="text-xs font-bold text-[#003733]">{selectedSensusForPdf.id}/KDR/2026</div>
                  <div className="mt-1 px-2 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-700 border border-slate-300 inline-block">
                    VERIFIKASI VALID
                  </div>
                </div>
              </div>

              {/* Judul Dokumen */}
              <div className="text-center py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <h4 className="text-sm font-extrabold uppercase text-slate-950 tracking-wider">
                  LEMBAR HASIL SENSUS & VERIFIKASI PROFIL KESEJAHTERAAN KELUARGA
                </h4>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Tahun Anggaran 2026 • Wilayah Dusun {selectedSensusForPdf.dusun}
                </div>
              </div>

              {/* Grid 1: Identitas KK & Status Desil */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-300 bg-slate-50/60 space-y-2">
                  <div className="font-bold text-[11px] text-[#003733] uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center justify-between">
                    <span>1. Identitas Kepala Keluarga</span>
                    <span className="font-mono text-[10px] text-slate-500">KK: {selectedSensusForPdf.noKk}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-500">Nama Lengkap:</span>
                    <strong className="col-span-2 text-slate-950">{selectedSensusForPdf.namaKepalaKeluarga}</strong>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-500">NIK:</span>
                    <span className="col-span-2 font-mono">{selectedSensusForPdf.nikKepalaKeluarga}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-500">Domisili:</span>
                    <span className="col-span-2">Dusun {selectedSensusForPdf.dusun} RT {selectedSensusForPdf.rt} / RW {selectedSensusForPdf.rw}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-500">Anggota:</span>
                    <span className="col-span-2 font-bold">{selectedSensusForPdf.jumlahAnggota} Jiwa</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-300 bg-slate-50/60 space-y-2">
                  <div className="font-bold text-[11px] text-[#003733] uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center justify-between">
                    <span>2. Evaluasi Desil & Pajak PBB-P2</span>
                    <span className="font-mono text-[10px] text-[#009388]">TA 2026</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 items-center">
                    <span className="text-slate-500">Tingkat Desil:</span>
                    <div className="col-span-2 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        selectedSensusForPdf.desil === 1
                          ? "bg-red-100 text-red-800"
                          : selectedSensusForPdf.desil === 2
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        Desil {selectedSensusForPdf.desil} ({selectedSensusForPdf.desil <= 2 ? "Prioritas Bantuan" : "Mandiri"})
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 items-center">
                    <span className="text-slate-500">Pajak PBB-P2:</span>
                    <span className={`col-span-2 font-bold ${
                      selectedSensusForPdf.statusPbb === "Lunas" ? "text-emerald-700" : "text-red-700"
                    }`}>
                      {selectedSensusForPdf.statusPbb} (Rp {selectedSensusForPdf.nominalPbb.toLocaleString("id-ID")})
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-500">Pekerjaan:</span>
                    <span className="col-span-2">{selectedSensusForPdf.pekerjaanUtama}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-500">Penghasilan:</span>
                    <span className="col-span-2 font-semibold text-slate-900">{selectedSensusForPdf.penghasilanBulanan}</span>
                  </div>
                </div>
              </div>

              {/* Grid 2: Kondisi Fisik Rumah (RTLH) & Sanitasi */}
              <div className="p-4 rounded-xl border border-slate-300 bg-white space-y-3">
                <div className="font-bold text-[11px] text-[#003733] uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center justify-between">
                  <span>3. Indikator Fisik Kelayakan Rumah (Standar PUPR Bedah Rumah)</span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    selectedSensusForPdf.kondisiRumah === "RTLH"
                      ? "bg-red-100 text-red-800 border border-red-300"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  }`}>
                    {selectedSensusForPdf.kondisiRumah}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[9px]">Material Lantai</div>
                    <div className="font-bold text-slate-900 mt-0.5">{selectedSensusForPdf.lantai}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[9px]">Material Dinding</div>
                    <div className="font-bold text-slate-900 mt-0.5">{selectedSensusForPdf.dinding}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[9px]">Kondisi Atap</div>
                    <div className="font-bold text-slate-900 mt-0.5">{selectedSensusForPdf.atap}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[9px]">Jamban & Sanitasi</div>
                    <div className="font-bold text-slate-900 mt-0.5">{selectedSensusForPdf.jambanSanitasi}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[9px]">Sumber Air Minum</div>
                    <div className="font-bold text-slate-900 mt-0.5">{selectedSensusForPdf.sumberAir}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[9px]">Daya Listrik PLN</div>
                    <div className="font-bold text-slate-900 mt-0.5">{selectedSensusForPdf.dayaListrik}</div>
                  </div>
                </div>
              </div>

              {/* Grid 3: Kerentanan Sosial & Bansos Aktif */}
              <div className="p-4 rounded-xl border border-slate-300 bg-slate-50/60 space-y-2">
                <div className="font-bold text-[11px] text-[#003733] uppercase tracking-wider border-b border-slate-200 pb-1">
                  4. Kerentanan Sosial & Rekam Bantuan Sosial Aktif
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-slate-500">Anggota Rawan / Khusus:</div>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {selectedSensusForPdf.kerentanan.adaLansiaTunggal && (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">Lansia Tunggal</span>
                      )}
                      {selectedSensusForPdf.kerentanan.adaBalitaStunting && (
                        <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-800 font-bold">Balita Rawan Gizi / Stunting</span>
                      )}
                      {selectedSensusForPdf.kerentanan.adaDisabilitas && (
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">Penyandang Disabilitas</span>
                      )}
                      {!selectedSensusForPdf.kerentanan.adaLansiaTunggal &&
                        !selectedSensusForPdf.kerentanan.adaBalitaStunting &&
                        !selectedSensusForPdf.kerentanan.adaDisabilitas && (
                          <span className="text-slate-600 font-semibold">Tidak ada kerentanan khusus</span>
                        )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-slate-500">Program Bansos Yang Sedang Berjalan:</div>
                    <div className="font-extrabold text-[#009388] text-sm pt-0.5">
                      {selectedSensusForPdf.bansosAktif}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-slate-700 italic">
                  Catatan Verifikasi Surveyor: "{selectedSensusForPdf.catatanVerifikasi}"
                </div>
              </div>

              {/* Tanda Tangan Resmi */}
              <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="text-slate-500">Petugas Surveyor / Kepala Dusun,</div>
                  <div className="mt-14 font-bold text-slate-950 uppercase underline">
                    {selectedSensusForPdf.surveyorKadus}
                  </div>
                  <div className="text-[10px] text-slate-500">Kepala Dusun {selectedSensusForPdf.dusun}</div>
                </div>

                <div>
                  <div className="text-slate-500">Kadurama, {selectedSensusForPdf.tanggalSensus}</div>
                  <div className="text-slate-500">Mengetahui, Kepala Desa Kadurama</div>
                  <div className="mt-14 font-bold text-slate-950 uppercase underline">
                    SUHENDRA, S.Sos
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">NIP. 19780412 200501 1 008</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL TAMBAH / UBAH SENSUS KELUARGA (WITH AUTO-DESIL CALCULATION)   */}
      {/* =================================================================== */}
      {isSensusModalOpen && editingSensus && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-[#eda50c]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {sensusList.some((s) => s.id === editingSensus.id)
                      ? "Ubah Data Sensus Keluarga"
                      : "Formulir Sensus & SDGs Keluarga Baru"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Input survei keluarga berbasis Dusun Manis, Pahing, atau Puhun
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSensusModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Bagian 1: Identitas KK */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  1. Identitas Kepala Keluarga
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor Kartu Keluarga (KK)</label>
                    <input
                      type="text"
                      value={editingSensus.noKk}
                      onChange={(e) => setEditingSensus({ ...editingSensus, noKk: e.target.value })}
                      placeholder="16 digit Nomor KK"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">NIK Kepala Keluarga</label>
                    <input
                      type="text"
                      value={editingSensus.nikKepalaKeluarga}
                      onChange={(e) => setEditingSensus({ ...editingSensus, nikKepalaKeluarga: e.target.value })}
                      placeholder="16 digit NIK"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap Kepala Keluarga</label>
                    <input
                      type="text"
                      value={editingSensus.namaKepalaKeluarga}
                      onChange={(e) => setEditingSensus({ ...editingSensus, namaKepalaKeluarga: e.target.value })}
                      placeholder="Nama lengkap sesuai KTP"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Dusun</label>
                      <select
                        value={editingSensus.dusun}
                        onChange={(e) => setEditingSensus({ ...editingSensus, dusun: e.target.value as any })}
                        className="w-full px-2 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-900"
                      >
                        <option value="Manis">Manis</option>
                        <option value="Pahing">Pahing</option>
                        <option value="Puhun">Puhun</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">RT</label>
                      <input
                        type="text"
                        value={editingSensus.rt}
                        onChange={(e) => setEditingSensus({ ...editingSensus, rt: e.target.value })}
                        className="w-full px-2 py-2 rounded-xl border border-slate-300 bg-white text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">RW</label>
                      <input
                        type="text"
                        value={editingSensus.rw}
                        onChange={(e) => setEditingSensus({ ...editingSensus, rw: e.target.value })}
                        className="w-full px-2 py-2 rounded-xl border border-slate-300 bg-white text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian 2: Kondisi Fisik Rumah (Kriteria RTLH) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  2. Kondisi Fisik Rumah & Sanitasi
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Material Lantai</label>
                    <select
                      value={editingSensus.lantai}
                      onChange={(e) => setEditingSensus({ ...editingSensus, lantai: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Keramik / Granit">Keramik / Granit</option>
                      <option value="Semen Rata">Semen Rata</option>
                      <option value="Tanah">Tanah (Indikator RTLH)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Material Dinding</label>
                    <select
                      value={editingSensus.dinding}
                      onChange={(e) => setEditingSensus({ ...editingSensus, dinding: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Tembok Permanen">Tembok Permanen</option>
                      <option value="Setengah Tembok">Setengah Tembok</option>
                      <option value="Bilik Bambu / Papan">Bilik Bambu / Papan (RTLH)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Kondisi Atap</label>
                    <select
                      value={editingSensus.atap}
                      onChange={(e) => setEditingSensus({ ...editingSensus, atap: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Genteng Baik">Genteng Baik</option>
                      <option value="Seng / Asbes">Seng / Asbes</option>
                      <option value="Rumbia / Lapuk">Rumbia / Lapuk (RTLH)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Fasilitas Jamban</label>
                    <select
                      value={editingSensus.jambanSanitasi}
                      onChange={(e) => setEditingSensus({ ...editingSensus, jambanSanitasi: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Jamban Sendiri (Septic Tank)">Jamban Sendiri (Septic Tank)</option>
                      <option value="Jamban Bersama">Jamban Bersama</option>
                      <option value="Tidak Ada (Numpang / Sungai)">Tidak Ada (Numpang / Sungai)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Sumber Air Minum</label>
                    <select
                      value={editingSensus.sumberAir}
                      onChange={(e) => setEditingSensus({ ...editingSensus, sumberAir: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="PDAM / Sumur Bor Bersih">PDAM / Sumur Bor Bersih</option>
                      <option value="Sumur Timba Gali">Sumur Timba Gali</option>
                      <option value="Mata Air Terbuka">Mata Air Terbuka</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Daya Listrik</label>
                    <select
                      value={editingSensus.dayaListrik}
                      onChange={(e) => setEditingSensus({ ...editingSensus, dayaListrik: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="450 VA">450 VA (Subsidi)</option>
                      <option value="900 VA">900 VA</option>
                      <option value="1300 VA">1300 VA</option>
                      <option value="Menumpang">Menumpang / Tanpa Meteran</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bagian 3: Ekonomi, PBB & Bansos */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  3. Ekonomi, Pajak PBB & Bansos
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Pekerjaan Utama</label>
                    <input
                      type="text"
                      value={editingSensus.pekerjaanUtama}
                      onChange={(e) => setEditingSensus({ ...editingSensus, pekerjaanUtama: e.target.value })}
                      placeholder="Contoh: Buruh Tani"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Kisaran Penghasilan</label>
                    <select
                      value={editingSensus.penghasilanBulanan}
                      onChange={(e) => setEditingSensus({ ...editingSensus, penghasilanBulanan: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Dibawah Rp 1.000.000">Dibawah Rp 1.000.000</option>
                      <option value="Rp 1.000.000 - Rp 2.000.000">Rp 1.000.000 - Rp 2.000.000</option>
                      <option value="Rp 2.000.000 - Rp 4.000.000">Rp 2.000.000 - Rp 4.000.000</option>
                      <option value="Diatas Rp 4.000.000">Diatas Rp 4.000.000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Status Pajak PBB 2026</label>
                    <select
                      value={editingSensus.statusPbb}
                      onChange={(e) => setEditingSensus({ ...editingSensus, statusPbb: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                    >
                      <option value="Lunas">Lunas</option>
                      <option value="Belum Lunas">Belum Lunas / Terutang</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Bansos Yang Sedang Diterima</label>
                    <select
                      value={editingSensus.bansosAktif}
                      onChange={(e) => setEditingSensus({ ...editingSensus, bansosAktif: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                    >
                      <option value="Tidak Ada (Non-Bansos)">Tidak Ada (Non-Bansos)</option>
                      <option value="PKH">PKH (Program Keluarga Harapan)</option>
                      <option value="BPNT">BPNT (Bantuan Pangan Non Tunai)</option>
                      <option value="BLT Dana Desa">BLT Dana Desa</option>
                      <option value="Bansos Lansia">Bansos Lansia / Disabilitas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Kerentanan Keluarga</label>
                    <div className="flex items-center gap-3 pt-2">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingSensus.kerentanan.adaLansiaTunggal}
                          onChange={(e) =>
                            setEditingSensus({
                              ...editingSensus,
                              kerentanan: {
                                ...editingSensus.kerentanan,
                                adaLansiaTunggal: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-[#009388] focus:ring-[#009388]"
                        />
                        <span>Lansia</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingSensus.kerentanan.adaBalitaStunting}
                          onChange={(e) =>
                            setEditingSensus({
                              ...editingSensus,
                              kerentanan: {
                                ...editingSensus.kerentanan,
                                adaBalitaStunting: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-[#009388] focus:ring-[#009388]"
                        />
                        <span>Stunting</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingSensus.kerentanan.adaDisabilitas}
                          onChange={(e) =>
                            setEditingSensus({
                              ...editingSensus,
                              kerentanan: {
                                ...editingSensus.kerentanan,
                                adaDisabilitas: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-[#009388] focus:ring-[#009388]"
                        />
                        <span>Disabilitas</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indikator Auto-Desil Preview */}
              <div className="p-3 bg-[#e6f7f5] rounded-xl border border-[#009388]/30 flex items-center justify-between text-xs text-[#003733]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#009388]" />
                  <span>Kalkulasi Otomatis Desil Kesejahteraan:</span>
                </div>
                <strong className="px-3 py-1 rounded-full bg-[#009388] text-white text-[11px] font-bold">
                  Desil{" "}
                  {calculateDesil(
                    editingSensus.dinding,
                    editingSensus.lantai,
                    editingSensus.penghasilanBulanan,
                    editingSensus.luasLantai,
                    editingSensus.jumlahAnggota
                  )}
                </strong>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Catatan Lapangan Kadus / Surveyor</label>
                <textarea
                  rows={2}
                  value={editingSensus.catatanVerifikasi}
                  onChange={(e) => setEditingSensus({ ...editingSensus, catatanVerifikasi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsSensusModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
              >
                Batal
              </button>
              <button
                onClick={handleSaveSensus}
                className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Hasil Sensus Keluarga</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT DATA WARGA INTERNAL */}
      {isEditResidentModalOpen && editingResident && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Koreksi / Perbarui Data Warga Internal
                  </h3>
                  <p className="text-[11px] text-slate-500">Perubahan disimpan ke master internal desa</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditResidentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  NIK (Nomor Induk Kependudukan)
                </label>
                <input
                  type="text"
                  disabled
                  value={editingResident.nik}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nomor Kartu Keluarga (KK)
                </label>
                <input
                  type="text"
                  value={editingResident.noKk}
                  onChange={(e) => setEditingResident({ ...editingResident, noKk: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:ring-1 focus:ring-[#009388]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editingResident.nama}
                  onChange={(e) => setEditingResident({ ...editingResident, nama: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-[#009388]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Dusun</label>
                <select
                  value={editingResident.dusun}
                  onChange={(e) => setEditingResident({ ...editingResident, dusun: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-[#009388]"
                >
                  <option value="Manis">Dusun Manis</option>
                  <option value="Pahing">Dusun Pahing</option>
                  <option value="Puhun">Dusun Puhun</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">RT</label>
                  <input
                    type="text"
                    value={editingResident.rt}
                    onChange={(e) => setEditingResident({ ...editingResident, rt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">RW</label>
                  <input
                    type="text"
                    value={editingResident.rw}
                    onChange={(e) => setEditingResident({ ...editingResident, rw: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pekerjaan</label>
                <input
                  type="text"
                  value={editingResident.pekerjaan}
                  onChange={(e) => setEditingResident({ ...editingResident, pekerjaan: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Hubungan Keluarga</label>
                <input
                  type="text"
                  value={editingResident.hubunganKeluarga}
                  onChange={(e) => setEditingResident({ ...editingResident, hubunganKeluarga: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsEditResidentModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEditResident}
                className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Pembaruan Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT APBDES BIDANG */}
      {isEditBidangModalOpen && editingBidang && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Sesuaikan Anggaran Bidang {editingBidang.id}
                  </h3>
                  <p className="text-[11px] text-slate-500">{editingBidang.nama}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditBidangModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pagu Anggaran (Rp)</label>
                <input
                  type="number"
                  value={editingBidang.pagu}
                  onChange={(e) => setEditingBidang({ ...editingBidang, pagu: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Realisasi Belanja (Rp)</label>
                <input
                  type="number"
                  value={editingBidang.realisasi}
                  onChange={(e) => setEditingBidang({ ...editingBidang, realisasi: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Keterangan Alokasi</label>
                <textarea
                  rows={2}
                  value={editingBidang.keterangan}
                  onChange={(e) => setEditingBidang({ ...editingBidang, keterangan: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsEditBidangModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSaveBidang}
                className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Nilai Bidang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT APBDES TOTALS */}
      {isEditTotalsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Sesuaikan Total Anggaran APBDes</h3>
                  <p className="text-[11px] text-slate-500">Angka utama ringkasan transparansi anggaran</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditTotalsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Total Pendapatan Desa (Rp)</label>
                <input
                  type="number"
                  value={apbdesTotals.pendapatan}
                  onChange={(e) => setApbdesTotals({ ...apbdesTotals, pendapatan: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Total Belanja Desa (Rp)</label>
                <input
                  type="number"
                  value={apbdesTotals.belanja}
                  onChange={(e) => setApbdesTotals({ ...apbdesTotals, belanja: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Persentase Serapan (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={apbdesTotals.serapan}
                  onChange={(e) => setApbdesTotals({ ...apbdesTotals, serapan: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsEditTotalsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs"
              >
                Batal
              </button>
              <button
                onClick={() => setIsEditTotalsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Ringkasan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / UBAH BERITA */}
      {isNewsModalOpen && editingNews && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {newsList.some((n) => n.id === editingNews.id) ? "Ubah Kabar Desa" : "Tulis Kabar Desa Baru"}
                  </h3>
                  <p className="text-[11px] text-slate-500">Artikel akan langsung terlihat di beranda warga jika berstatus Terbit</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Judul Kabar Desa</label>
                <input
                  type="text"
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  placeholder="Contoh: Musyawarah RKPDes 2027 Berjalan Lancar..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={editingNews.category}
                    onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                  >
                    <option value="Pemerintahan">Pemerintahan</option>
                    <option value="Bansos">Bansos</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Pembangunan">Pembangunan</option>
                    <option value="Kegiatan">Kegiatan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Penulis / Narasumber</label>
                  <input
                    type="text"
                    value={editingNews.author}
                    onChange={(e) => setEditingNews({ ...editingNews, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Ringkasan Isi Berita</label>
                <textarea
                  rows={3}
                  value={editingNews.summary}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">URL Gambar Sampul</label>
                <input
                  type="text"
                  value={editingNews.imageUrl}
                  onChange={(e) => setEditingNews({ ...editingNews, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Status Publikasi</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={editingNews.status === "Terbit"}
                      onChange={() => setEditingNews({ ...editingNews, status: "Terbit" })}
                      className="text-[#009388] focus:ring-[#009388]"
                    />
                    <span className="font-semibold text-slate-800">Terbit (Tampil di Web Publik)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={editingNews.status === "Draf"}
                      onChange={() => setEditingNews({ ...editingNews, status: "Draf" })}
                      className="text-[#009388] focus:ring-[#009388]"
                    />
                    <span className="font-semibold text-slate-800">Draf (Hanya Admin)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsNewsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNews}
                className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Artikel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BULK IMPORT KEPENDUDUKAN */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Import Master Data Kependudukan</h3>
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
                  Mendukung file SIAK dari 3 Dusun (Manis, Pahing, Puhun)
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  alert("Simulasi import berhasil! Data kependudukan 3 dusun terupdate.");
                  setIsImportModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm"
              >
                Mulai Proses Import
              </button>
            </div>
          </div>
        </div>
      )}

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
