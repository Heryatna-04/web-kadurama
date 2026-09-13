"use client";

import { useState, useEffect, useRef } from "react";
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
  RefreshCw,
  Edit3,
  Trash2,
  Newspaper,
  PieChart,
  ChevronLeft,
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
  syncStatus?: "Tersinkronisasi" | "Perlu Sinkronisasi" | "Diperbarui Internal";
}

const INITIAL_RESIDENTS_ARRAY: Resident[] = [
  {
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
    syncStatus: "Tersinkronisasi",
  },
  {
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
    syncStatus: "Tersinkronisasi",
  },
  {
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
    syncStatus: "Tersinkronisasi",
  },
  {
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
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208150303850007",
    noKk: "3208150102030006",
    nama: "Dedi Suryadi",
    ttl: "Kuningan, 03 Maret 1985",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Petani / Pekebun",
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
    noKk: "3208150102030006",
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
    noKk: "3208150102030007",
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
    noKk: "3208150102030008",
    nama: "Jaja Subagja",
    ttl: "Kuningan, 21 Juni 1975",
    jenisKelamin: "Laki-laki",
    pekerjaan: "PNS / Guru",
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
    noKk: "3208150102030008",
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
    noKk: "3208150102030008",
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
    noKk: "3208150102030009",
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
    noKk: "3208150102030010",
    nama: "Cecep Supriatna",
    ttl: "Kuningan, 15 Agustus 1980",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Peternak Sapi",
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
    noKk: "3208150102030010",
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
    noKk: "3208150102030011",
    nama: "Tatang Sutisna",
    ttl: "Kuningan, 28 Februari 1995",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Montir Bengkel",
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
    nik: "3208151703900017",
    noKk: "3208150102030012",
    nama: "Oman Rohman",
    ttl: "Kuningan, 17 Maret 1990",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Sopir Angkutan",
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
    nik: "3208154101920018",
    noKk: "3208150102030012",
    nama: "Ai Maryani",
    ttl: "Kuningan, 01 Januari 1992",
    jenisKelamin: "Perempuan",
    pekerjaan: "Karyawan Toko",
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
    nik: "3208152310860019",
    noKk: "3208150102030013",
    nama: "Kusnadi",
    ttl: "Kuningan, 23 Oktober 1986",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Tukang Kayu",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Wage",
    rt: "02",
    rw: "03",
    alamat: "Dusun Wage RT 02 / RW 03, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208150905930020",
    noKk: "3208150102030014",
    nama: "Wawan Hendrawan",
    ttl: "Kuningan, 09 Mei 1993",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Wiraswasta Olahan Ubi",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Kliwon",
    rt: "08",
    rw: "04",
    alamat: "Dusun Kliwon RT 08 / RW 04, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208154811950021",
    noKk: "3208150102030014",
    nama: "Yanti Susanti",
    ttl: "Kuningan, 08 November 1995",
    jenisKelamin: "Perempuan",
    pekerjaan: "Mengurus Rumah Tangga",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Istri",
    dusun: "Kliwon",
    rt: "08",
    rw: "04",
    alamat: "Dusun Kliwon RT 08 / RW 04, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208151606770022",
    noKk: "3208150102030015",
    nama: "Endang Sujana",
    ttl: "Kuningan, 16 Juni 1977",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Petani Padi",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Kliwon",
    rt: "10",
    rw: "04",
    alamat: "Dusun Kliwon RT 10 / RW 04, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208155904800023",
    noKk: "3208150102030015",
    nama: "Kokom Komariah",
    ttl: "Kuningan, 19 April 1980",
    jenisKelamin: "Perempuan",
    pekerjaan: "Pedagang Pasar",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    hubunganKeluarga: "Istri",
    dusun: "Kliwon",
    rt: "10",
    rw: "04",
    alamat: "Dusun Kliwon RT 10 / RW 04, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208150508000024",
    noKk: "3208150102030016",
    nama: "Bagus Nugraha",
    ttl: "Kuningan, 05 Agustus 2000",
    jenisKelamin: "Laki-laki",
    pekerjaan: "Tenaga Medis Puskesmas",
    agama: "Islam",
    statusPerkawinan: "Belum Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Manis",
    rt: "02",
    rw: "01",
    alamat: "Dusun Manis RT 02 / RW 01, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
  {
    nik: "3208154703990025",
    noKk: "3208150102030017",
    nama: "Rina Marlina",
    ttl: "Kuningan, 07 Maret 1999",
    jenisKelamin: "Perempuan",
    pekerjaan: "Bidan Desa",
    agama: "Islam",
    statusPerkawinan: "Belum Kawin",
    hubunganKeluarga: "Kepala Keluarga",
    dusun: "Pahing",
    rt: "05",
    rw: "02",
    alamat: "Dusun Pahing RT 05 / RW 02, Desa Kadurama",
    status: "Warga Tetap",
    syncStatus: "Tersinkronisasi",
  },
];

const RESIDENTS_DATA: Record<string, Resident> = Object.fromEntries(
  INITIAL_RESIDENTS_ARRAY.map((r) => [r.nik, r])
);

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
  {
    id: "AG-K-004",
    tipe: "keluar",
    nomorSurat: "503/051/Pem/IX/2026",
    tanggal: "07 Sep 2026",
    perihal: "Surat Keterangan Usaha (SKU) - Bengkel Las Jaya",
    pihakTerkait: "Tatang Sutisna (NIK: 3208152802950016)",
    pejabatAtauPenerima: "Kades Suhendra, S.Sos",
    status: "Terbit",
  },
  {
    id: "AG-M-003",
    tipe: "masuk",
    nomorSurat: "900/084/DPMD/2026",
    tanggal: "05 Sep 2026",
    perihal: "Surat Edaran Verifikasi Laporan Realisasi Dana Desa Tahap II",
    pihakTerkait: "Dinas Pemberdayaan Masyarakat dan Desa (DPMD)",
    pejabatAtauPenerima: "Kaur Keuangan & Sekdes",
    status: "Disposisi Kades",
  },
  {
    id: "AG-K-005",
    tipe: "keluar",
    nomorSurat: "401/052/Kesra/IX/2026",
    tanggal: "04 Sep 2026",
    perihal: "Surat Keterangan Tidak Mampu (SKTM) - Pengantar BPJS PBI",
    pihakTerkait: "Nana Sumarna (NIK: 3208151004820013)",
    pejabatAtauPenerima: "Sekdes Dadang Kurnia",
    status: "Terbit",
  },
  {
    id: "AG-K-006",
    tipe: "keluar",
    nomorSurat: "470/053/Pem/IX/2026",
    tanggal: "02 Sep 2026",
    perihal: "Surat Keterangan Domisili Usaha Peternakan",
    pihakTerkait: "Cecep Supriatna (NIK: 3208151508800014)",
    pejabatAtauPenerima: "Kades Suhendra, S.Sos",
    status: "Terbit",
  },
  {
    id: "AG-M-004",
    tipe: "masuk",
    nomorSurat: "440/215/Pusk.Cwg/2026",
    tanggal: "01 Sep 2026",
    perihal: "Pemberitahuan Posyandu Balita & Skrining PTM Serentak",
    pihakTerkait: "Puskesmas Ciawigebang",
    pejabatAtauPenerima: "Kasi Kesejahteraan Rakyat",
    status: "Terarsip",
  },
  {
    id: "AG-K-007",
    tipe: "keluar",
    nomorSurat: "503/054/Pem/VIII/2026",
    tanggal: "29 Agu 2026",
    perihal: "Surat Keterangan Usaha (SKU) - Produksi Keripik Pisang",
    pihakTerkait: "Wawan Hendrawan (NIK: 3208150905930020)",
    pejabatAtauPenerima: "Kades Suhendra, S.Sos",
    status: "Terbit",
  },
  {
    id: "AG-M-005",
    tipe: "masuk",
    nomorSurat: "600/402/DPUTR/2026",
    tanggal: "27 Agu 2026",
    perihal: "Jadwal Pengukuran Lapangan Drainase Lingkungan Dusun Wage",
    pihakTerkait: "Dinas PUTR Kabupaten Kuningan",
    pejabatAtauPenerima: "Kaur Perencanaan & Pembangunan",
    status: "Disposisi Kades",
  },
  {
    id: "AG-K-008",
    tipe: "keluar",
    nomorSurat: "470/055/Pem/VIII/2026",
    tanggal: "25 Agu 2026",
    perihal: "Surat Keterangan Domisili Tinggal Sementara",
    pihakTerkait: "Bagus Nugraha (NIK: 3208150508000024)",
    pejabatAtauPenerima: "Kades Suhendra, S.Sos",
    status: "Terbit",
  },
  {
    id: "AG-M-006",
    tipe: "masuk",
    nomorSurat: "027/110/Bag.Hukum/2026",
    tanggal: "22 Agu 2026",
    perihal: "Salinan Peraturan Bupati tentang Pedoman Pengelolaan Keuangan Desa",
    pihakTerkait: "Bagian Hukum Setda Kabupaten Kuningan",
    pejabatAtauPenerima: "Kades Suhendra, S.Sos",
    status: "Terarsip",
  },
  {
    id: "AG-K-009",
    tipe: "keluar",
    nomorSurat: "401/056/Kesra/VIII/2026",
    tanggal: "20 Agu 2026",
    perihal: "Surat Keterangan Tidak Mampu (SKTM) - Keringanan Biaya Sekolah",
    pihakTerkait: "Endang Sujana (NIK: 3208151606770022)",
    pejabatAtauPenerima: "Sekdes Dadang Kurnia",
    status: "Terbit",
  },
];

// Manajemen Berita / Kabar Desa Data
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
    author: "Tim Humas Pemdes",
    summary: "Kepala Desa bersama BPD dan tokoh masyarakat dari 5 dusun menyepakati prioritas pembangunan jalan tani dan drainase lingkungan untuk tahun depan.",
    status: "Terbit",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "NEWS-002",
    title: "Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Triwulan III Tepat Sasaran",
    category: "Bansos",
    date: "08 September 2026",
    author: "Kasi Kesejahteraan",
    summary: "Sebanyak 65 Keluarga Penerima Manfaat (KPM) dari lima dusun menerima bantuan tunai untuk pemenuhan kebutuhan pokok keluarga.",
    status: "Terbit",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "NEWS-003",
    title: "Peningkatan Kapasitas Posyandu dan Penguatan Gizi Balai Dusun Pahing",
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
    summary: "Pembangunan saluran drainase sepanjang 320 meter di Dusun Wage berhasil menuntaskan masalah genangan saat musim hujan.",
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
    summary: "Pemerintah desa mempersiapkan pos siaga bencana berbasis dusun untuk mitigasi dini terhadap potensi cuaca ekstrem.",
    status: "Draf",
    imageUrl: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80",
  },
];

// APBDes Bidang Belanja Data
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
    keterangan: "Siltap pamong, operasional kantor balai desa, kearsipan, dan BPD.",
  },
  {
    id: 2,
    nama: "Pelaksanaan Pembangunan",
    persen: 78,
    pagu: 562400000,
    realisasi: 438672000,
    keterangan: "Rabat beton jalan Dusun Pahing, drainase pemukiman, dan posyandu.",
  },
  {
    id: 3,
    nama: "Pembinaan Kemasyarakatan",
    persen: 88,
    pagu: 145000000,
    realisasi: 127600000,
    keterangan: "Kegiatan keagamaan, olahraga karang taruna, dan ketenteraman warga.",
  },
  {
    id: 4,
    nama: "Pemberdayaan Masyarakat",
    persen: 81,
    pagu: 185800000,
    realisasi: 150498000,
    keterangan: "Pelatihan UMKM olahan pangan lokal dan bantuan modal bibit ternak.",
  },
  {
    id: 5,
    nama: "Penanggulangan Bencana & Darurat",
    persen: 75,
    pagu: 84000000,
    realisasi: 63000000,
    keterangan: "Bantuan darurat warga sakit berat dan kesiapsiagaan musim hujan.",
  },
];

// Reusable Pagination Component (Per 10 atau 25 data)
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


export default function Home() {
  // Navigation & View States
  const [view, setView] = useState<"public" | "admin">("public");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(null);

  // Desktop Dropdown State with Intent-Aware Hover Timer (Eliminates Flickering & Deadzone Bugs)
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

  // Search & Public Filter
  const [siteSearchQuery, setSiteSearchQuery] = useState("");
  const [apbdesFilter, setApbdesFilter] = useState<"all" | "pendapatan" | "belanja">("all");

  // Admin Panel States
  const [adminTab, setAdminTab] = useState<
    "generator" | "agenda" | "residents" | "berita" | "apbdes"
  >("generator");
  const [paperSize, setPaperSize] = useState<"F4" | "A4">("F4");
  const [authMode, setAuthMode] = useState<"wet" | "digital" | "scanned">("wet");

  // Generator Loket States (3 JENIS SURAT SEMENTARA: SKU, SKTM, DOMISILI)
  const [residentsList, setResidentsList] = useState<Resident[]>(INITIAL_RESIDENTS_ARRAY);
  const [searchQuery, setSearchQuery] = useState("3208152405900001");
  const [selectedResident, setSelectedResident] = useState<Resident>(INITIAL_RESIDENTS_ARRAY[0]);
  const [letterType, setLetterType] = useState<"SKU" | "SKTM" | "DOMISILI">("SKU");
  const [businessName, setBusinessName] = useState("Warung Sembako Barokah");
  const [businessField, setBusinessField] = useState("Perdagangan Kebutuhan Pokok dan Makanan Ringan");
  const [businessLocation, setBusinessLocation] = useState("Dusun Manis RT 02 / RW 01, Desa Kadurama");
  const [letterPurpose, setLetterPurpose] = useState("Kelengkapan Administrasi Permohonan Kredit Usaha Rakyat (KUR) BRI");
  const [selectedOfficial, setSelectedOfficial] = useState<"kades" | "sekdes">("kades");

  // Agenda & Residents States + Pagination
  const [agendaList, setAgendaList] = useState<AgendaRecord[]>(INITIAL_AGENDA);
  const [agendaFilter, setAgendaFilter] = useState<"all" | "keluar" | "masuk">("all");
  const [agendaCurrentPage, setAgendaCurrentPage] = useState(1);
  const [agendaPageSize, setAgendaPageSize] = useState(10);

  // Master Data Kependudukan States + Sync + Pagination
  const [residentDusunFilter, setResidentDusunFilter] = useState<string>("all");
  const [residentSearch, setResidentSearch] = useState("");
  const [residentCurrentPage, setResidentCurrentPage] = useState(1);
  const [residentPageSize, setResidentPageSize] = useState(10);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [isEditResidentModalOpen, setIsEditResidentModalOpen] = useState(false);
  const [syncNotification, setSyncNotification] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Manajemen Kabar Desa States + Pagination
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

  // Handlers
  const handleSearchResident = (val: string) => {
    setSearchQuery(val);
    const trimmed = val.trim();
    const foundExact = residentsList.find((r) => r.nik === trimmed);
    if (foundExact) {
      setSelectedResident(foundExact);
      return;
    }
    const foundByName = residentsList.find((r) =>
      r.nama.toLowerCase().includes(trimmed.toLowerCase())
    );
    if (foundByName) {
      setSelectedResident(foundByName);
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

  // Agenda Filter & Pagination
  const filteredAgenda = agendaList.filter((item) => {
    if (agendaFilter === "all") return true;
    return item.tipe === agendaFilter;
  });

  const paginatedAgenda = filteredAgenda.slice(
    (agendaCurrentPage - 1) * agendaPageSize,
    agendaCurrentPage * agendaPageSize
  );

  // Residents Filter, Sync & Pagination
  const filteredResidents = residentsList.filter((res) => {
    const matchesDusun = residentDusunFilter === "all" || res.dusun === residentDusunFilter;
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
    setSyncNotification(`Data kependudukan ${target?.nama || nik} berhasil disinkronkan dengan SIAK Dukcapil.`);
    setTimeout(() => setSyncNotification(null), 3500);
  };

  const handleSyncAllResidents = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      setResidentsList((prev) =>
        prev.map((r) => ({ ...r, syncStatus: "Tersinkronisasi" as const }))
      );
      setIsSyncingAll(false);
      setSyncNotification("Seluruh master data kependudukan (25 data) berhasil disinkronkan dengan SIAK Dukcapil.");
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
    if (selectedResident.nik === editingResident.nik) {
      setSelectedResident(editingResident);
    }
    setIsEditResidentModalOpen(false);
    setSyncNotification(`Perubahan data internal warga ${editingResident.nama} berhasil diperbarui.`);
    setTimeout(() => setSyncNotification(null), 3500);
  };

  // News Handlers & Pagination
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
      date: "14 September 2026",
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

    // Recalculate totals
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
              <div className="flex items-center space-x-1 h-full">
                {/* Home: HANYA ICON RUMAH TANPA TEXT */}
                <a
                  href="#beranda"
                  title="Beranda"
                  className="px-3 h-full hover:bg-[#007b71] transition flex items-center justify-center"
                >
                  <HomeIcon className="w-4 h-4 text-[#eda50c]" />
                </a>

                {/* Dropdown 1: Profil Desa */}
                <div
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleDropdownEnter("profil")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => handleDropdownToggle("profil")}
                    className={`h-full px-3.5 flex items-center gap-1 uppercase tracking-wider text-[11px] font-bold transition ${
                      activeDropdown === "profil" ? "bg-[#007b71]" : "hover:bg-[#007b71]"
                    }`}
                  >
                    <span>PROFIL DESA</span>
                    <ChevronDown
                      className={`w-3 h-3 text-[#eda50c] transition-transform duration-200 ${
                        activeDropdown === "profil" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {/* Dropdown Wrapper dengan Invisible Hover Bridge & Pointer Caret */}
                  <div
                    className={`absolute left-0 top-full pt-1.5 z-50 transition-all duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 ${
                      activeDropdown === "profil" ? "block opacity-100 translate-y-0" : "hidden opacity-0 -translate-y-1"
                    }`}
                  >
                    <div className="w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 ring-1 ring-black/5 relative">
                      <div className="absolute -top-1.5 left-5 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45 pointer-events-none"></div>
                      <a
                        href="#profil"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Sejarah Desa Kadurama
                      </a>
                      <a
                        href="#profil"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Visi & Misi Kepala Desa
                      </a>
                      <a
                        href="#lokasi-kantor"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Kondisi Geografis & Wilayah
                      </a>
                      <a
                        href="#perangkat-desa"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Struktur Organisasi Pemdes
                      </a>
                      <a
                        href="#apbdes"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Program Kerja Prioritas
                      </a>
                    </div>
                  </div>
                </div>

                {/* Dropdown 2: Pemerintahan */}
                <div
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleDropdownEnter("pemerintahan")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => handleDropdownToggle("pemerintahan")}
                    className={`h-full px-3.5 flex items-center gap-1 uppercase tracking-wider text-[11px] font-bold transition ${
                      activeDropdown === "pemerintahan" ? "bg-[#007b71]" : "hover:bg-[#007b71]"
                    }`}
                  >
                    <span>PEMERINTAHAN</span>
                    <ChevronDown
                      className={`w-3 h-3 text-[#eda50c] transition-transform duration-200 ${
                        activeDropdown === "pemerintahan" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`absolute left-0 top-full pt-1.5 z-50 transition-all duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 ${
                      activeDropdown === "pemerintahan" ? "block opacity-100 translate-y-0" : "hidden opacity-0 -translate-y-1"
                    }`}
                  >
                    <div className="w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 ring-1 ring-black/5 relative">
                      <div className="absolute -top-1.5 left-5 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45 pointer-events-none"></div>
                      <a
                        href="#perangkat-desa"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Pemerintahan Desa (Pamong)
                      </a>
                      <a
                        href="#perangkat-desa"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Badan Permusyawaratan Desa (BPD)
                      </a>
                      <a
                        href="#perangkat-desa"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Lembaga Pemberdayaan (LPM)
                      </a>
                      <a
                        href="#perangkat-desa"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Tim Penggerak PKK Desa
                      </a>
                      <a
                        href="#perangkat-desa"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs font-semibold text-[#009388] whitespace-nowrap"
                      >
                        5 Kepala Dusun Kadurama
                      </a>
                    </div>
                  </div>
                </div>

                {/* Dropdown 3: LAYANAN */}
                <div
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleDropdownEnter("layanan")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => handleDropdownToggle("layanan")}
                    className={`h-full px-3.5 flex items-center gap-1 uppercase tracking-wider text-[11px] font-bold transition ${
                      activeDropdown === "layanan" ? "bg-[#007b71]" : "hover:bg-[#007b71]"
                    }`}
                  >
                    <span>LAYANAN</span>
                    <ChevronDown
                      className={`w-3 h-3 text-[#eda50c] transition-transform duration-200 ${
                        activeDropdown === "layanan" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`absolute left-0 top-full pt-1.5 z-50 transition-all duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 ${
                      activeDropdown === "layanan" ? "block opacity-100 translate-y-0" : "hidden opacity-0 -translate-y-1"
                    }`}
                  >
                    <div className="w-72 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 ring-1 ring-black/5 relative">
                      <div className="absolute -top-1.5 left-5 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45 pointer-events-none"></div>
                      <a
                        href="#layanan-surat"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap font-medium"
                      >
                        Surat Keterangan Usaha (SKU)
                      </a>
                      <a
                        href="#layanan-surat"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap font-medium"
                      >
                        Surat Keterangan Tidak Mampu (SKTM)
                      </a>
                      <a
                        href="#layanan-surat"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap font-medium"
                      >
                        Surat Keterangan Domisili
                      </a>
                      <div className="border-t border-slate-100 my-1"></div>
                      <a
                        href="#layanan-surat"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs font-semibold text-[#009388] whitespace-nowrap"
                      >
                        Alur 4 Langkah di Kantor Desa
                      </a>
                    </div>
                  </div>
                </div>

                {/* Dropdown 4: Statistik */}
                <div
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleDropdownEnter("statistik")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => handleDropdownToggle("statistik")}
                    className={`h-full px-3.5 flex items-center gap-1 uppercase tracking-wider text-[11px] font-bold transition ${
                      activeDropdown === "statistik" ? "bg-[#007b71]" : "hover:bg-[#007b71]"
                    }`}
                  >
                    <span>STATISTIK</span>
                    <ChevronDown
                      className={`w-3 h-3 text-[#eda50c] transition-transform duration-200 ${
                        activeDropdown === "statistik" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`absolute left-0 top-full pt-1.5 z-50 transition-all duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 ${
                      activeDropdown === "statistik" ? "block opacity-100 translate-y-0" : "hidden opacity-0 -translate-y-1"
                    }`}
                  >
                    <div className="w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 ring-1 ring-black/5 relative">
                      <div className="absolute -top-1.5 left-5 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45 pointer-events-none"></div>
                      <a
                        href="#statistik"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Demografi 5 Dusun Kadurama
                      </a>
                      <a
                        href="#statistik"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Perbandingan Jenis Kelamin
                      </a>
                      <a
                        href="#statistik"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Kelompok Usia Penduduk
                      </a>
                      <a
                        href="#statistik"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Mata Pencaharian Utama
                      </a>
                    </div>
                  </div>
                </div>

                {/* Dropdown 5: Transparansi APBDes */}
                <div
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleDropdownEnter("apbdes")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => handleDropdownToggle("apbdes")}
                    className={`h-full px-3.5 flex items-center gap-1 uppercase tracking-wider text-[11px] font-bold transition ${
                      activeDropdown === "apbdes" ? "bg-[#007b71]" : "hover:bg-[#007b71]"
                    }`}
                  >
                    <span>APBDES 2026</span>
                    <ChevronDown
                      className={`w-3 h-3 text-[#eda50c] transition-transform duration-200 ${
                        activeDropdown === "apbdes" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`absolute left-0 top-full pt-1.5 z-50 transition-all duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 ${
                      activeDropdown === "apbdes" ? "block opacity-100 translate-y-0" : "hidden opacity-0 -translate-y-1"
                    }`}
                  >
                    <div className="w-72 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 ring-1 ring-black/5 relative">
                      <div className="absolute -top-1.5 left-5 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45 pointer-events-none"></div>
                      <a
                        href="#apbdes"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs font-semibold text-[#009388] whitespace-nowrap"
                      >
                        Realisasi Serapan Anggaran 82.4%
                      </a>
                      <a
                        href="#apbdes"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Penyelenggaraan Pemerintahan Desa
                      </a>
                      <a
                        href="#apbdes"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Pelaksanaan Pembangunan Desa
                      </a>
                      <a
                        href="#apbdes"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 hover:bg-[#e6f7f5] hover:text-[#009388] transition text-xs whitespace-nowrap"
                      >
                        Pembinaan & Pemberdayaan Warga
                      </a>
                    </div>
                  </div>
                </div>

                {/* Link Berita */}
                <a
                  href="#berita"
                  className="px-3.5 h-full hover:bg-[#007b71] transition uppercase tracking-wider text-[11px] font-bold flex items-center"
                >
                  KABAR DESA
                </a>

                {/* Link Kontak */}
                <a
                  href="#lokasi-kantor"
                  className="px-3.5 h-full hover:bg-[#007b71] transition uppercase tracking-wider text-[11px] font-bold flex items-center"
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
          {/* HERO SECTION DENGAN ORNAMEN GERBANG KUNINGAN (FULL 100VH BACKGROUND) & CIVIC COCKPIT */}
          <section
            id="beranda"
            className="min-h-[calc(100vh-110px)] flex items-center relative overflow-hidden bg-gradient-to-b from-[#021815] via-[#003833] to-[#001715] text-white py-16 lg:py-24"
          >
            {/* 1. Golden Backlight & Ambient Radial Glow behind Landmark */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] bg-gradient-to-t from-[#eda50c]/25 via-[#009388]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[600px] h-[400px] bg-[#009388]/15 rounded-full blur-3xl pointer-events-none" />

            {/* 2. Landmark Gerbang Kuningan 100vh Background (CSS Multiply: Zero White Noise, Preserves True Teal & Gold) */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-center mix-blend-multiply opacity-80 pointer-events-none select-none z-0">
              <img
                src="/kuningan-gate.png"
                alt="Landmark Gerbang Kuningan Asri"
                className="w-full max-w-5xl h-auto object-contain object-bottom filter brightness-105 contrast-120 select-none"
              />
            </div>

            {/* 3. Gradient Overlay for Smooth Bottom Transition & Text Contrast */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#001715] to-transparent pointer-events-none z-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#021815]/80 via-transparent to-[#001715]/70 pointer-events-none z-0" />

            {/* 4. Subtle Civic Dot Matrix Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#eda50c_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none z-0" />

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

                {/* Kolom Kanan: Civic Information & Cockpit Panel (Bukan Gambar Card) */}
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

                    {/* Informasi Operasional Pelayanan Balai Desa */}
                    <div className="my-5 space-y-4 text-xs">
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                        <Clock className="w-4 h-4 text-[#eda50c] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                            Jam Operasional Pelayanan Loket
                          </div>
                          <div className="text-slate-300 mt-0.5">
                            Senin - Jumat: 08.00 - 15.00 WIB
                          </div>
                          <div className="text-[10px] text-emerald-300 mt-0.5">
                            Pelayanan tatap muka di Kantor Balai Desa Kadurama
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#eda50c] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                            Alamat Balai Desa Kadurama
                          </div>
                          <div className="text-slate-300 mt-0.5">
                            Jl. Raya Ciawigebang No. 12, Kadurama, Kec. Ciawigebang, Kab. Kuningan 45591
                          </div>
                        </div>
                      </div>

                      {/* Metrik Kunci Ringkas */}
                      <div className="grid grid-cols-3 gap-2.5 pt-1">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                          <div className="text-base font-extrabold text-white">3.420</div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Jiwa Warga</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                          <div className="text-base font-extrabold text-[#eda50c]">5 Dusun</div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Kewilayahan</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                          <div className="text-base font-extrabold text-white">142 Ha</div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Luas Wilayah</div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Narrative */}
                    <div className="pt-3 border-t border-white/10 text-center">
                      <div className="text-[11px] text-[#eda50c] font-semibold italic">
                        "Melesat Ngudag Jaman, Ngakar Kuat Purwadaksi"
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                        Portal Informasi Resmi Terverifikasi Pemkab Kuningan
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* SECTION 1: PANDUAN SYARAT LAYANAN (3 JENIS SURAT SEMENTARA)     */}
          {/* =============================================================== */}
          <section id="layanan-surat" className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
            {/* Fine Civic Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#009388_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
          <section id="statistik" className="py-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
            {/* Fine Technical Civic Dot & Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.18] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
          <section id="perangkat-desa" className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
            {/* Fine Civic Texture Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#009388_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
          <section id="apbdes" className="py-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
            {/* Fine Civic Data Texture Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.16] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
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

              {/* Grid 5 Bidang Belanja & Unduh PDF (Sesuai index.html & Staggered GSAP) */}
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
          {/* SECTION 5: KABAR & BERITA DESA KADURAMA (SESUAI INDEX.HTML)     */}
          {/* =============================================================== */}
          <section id="berita" className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
            {/* Fine Civic Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#009388_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
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
                    Informasi resmi kegiatan pemerintah desa, musyawarah warga, agenda pembangunan, serta penyaluran bantuan masyarakat.
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
          {/* SECTION 6: JADWAL & LOKASI KANTOR DESA (SESUAI INDEX.HTML)      */}
          {/* =============================================================== */}
          <section id="lokasi-kantor" className="py-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
            {/* Fine Civic Texture Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.16] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
        <div className="fixed inset-0 overflow-hidden flex bg-slate-100 z-50">
          {/* Subtle Technical Civic Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.20] pointer-events-none" />
          
          {/* Sidebar Backpanel (Fixed / Full Height / Zero Scroll) */}
          <aside className="no-print w-64 bg-[#003733] text-white flex-shrink-0 h-full flex flex-col justify-between border-r border-[#005851] z-20 select-none">
            <div className="flex flex-col flex-1 overflow-y-auto">
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

                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/70 px-3 pt-3 pb-1">
                  Portal & Transparansi
                </div>

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

            <div className="p-4 border-t border-[#005851] bg-[#002f2b]">
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
                        {paginatedAgenda.map((item) => (
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
                  {/* Reusable Pagination for Buku Agenda */}
                  <Pagination
                    currentPage={agendaCurrentPage}
                    totalItems={filteredAgenda.length}
                    pageSize={agendaPageSize}
                    onPageChange={setAgendaCurrentPage}
                    onPageSizeChange={setAgendaPageSize}
                    pageSizeOptions={[10, 25]}
                  />
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
                      Data kependudukan 5 Dusun tradisional. Aksi difokuskan untuk koreksi data internal dan sinkronisasi SIAK Dukcapil.
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

                {/* Filter Wilayah 5 Dusun & Pencarian */}
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
                    {["Manis", "Pahing", "Puhun", "Wage", "Kliwon"].map((dusun) => (
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

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={residentSearch}
                        onChange={(e) => {
                          setResidentSearch(e.target.value);
                          setResidentCurrentPage(1);
                        }}
                        placeholder="Cari NIK / Nama / KK..."
                        className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#009388] w-48 sm:w-56"
                      />
                    </div>
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

                  {/* Reusable Pagination for Data Kependudukan */}
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
            {/* TAB 4: MANAJEMEN KABAR & BERITA DESA                         */}
            {/* ============================================================ */}
            {adminTab === "berita" && (
              <div className="no-print space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Manajemen Kabar & Berita Publik Desa
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Publikasi artikel informasi kegiatan desa, transparansi bansos, dan agenda pembangunan untuk portal warga.
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

                {/* Filter Status & Kategori Berita */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setNewsStatusFilter("all");
                        setNewsCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        newsStatusFilter === "all"
                          ? "bg-[#009388] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Semua Status ({newsList.length})
                    </button>
                    <button
                      onClick={() => {
                        setNewsStatusFilter("Terbit");
                        setNewsCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        newsStatusFilter === "Terbit"
                          ? "bg-[#009388] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span>Terbit ({newsList.filter((n) => n.status === "Terbit").length})</span>
                    </button>
                    <button
                      onClick={() => {
                        setNewsStatusFilter("Draf");
                        setNewsCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        newsStatusFilter === "Draf"
                          ? "bg-[#009388] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span>Draf ({newsList.filter((n) => n.status === "Draf").length})</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium">Kategori:</span>
                    <select
                      value={newsCategoryFilter}
                      onChange={(e) => {
                        setNewsCategoryFilter(e.target.value);
                        setNewsCurrentPage(1);
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#009388]"
                    >
                      <option value="all">Semua Kategori</option>
                      <option value="Pemerintahan">Pemerintahan</option>
                      <option value="Bansos">Bansos</option>
                      <option value="Kesehatan">Kesehatan</option>
                      <option value="Pembangunan">Pembangunan</option>
                      <option value="Kegiatan">Kegiatan</option>
                    </select>
                  </div>
                </div>

                {/* Tabel Manajemen Berita */}
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
                                title="Klik untuk mengubah status publikasi"
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 ${
                                  item.status === "Terbit"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                    : "bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200"
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

                  {/* Reusable Pagination for Berita */}
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
            {/* TAB 5: KELOLA TRANSPARANSI APBDES 2026                       */}
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

                {/* Ringkasan Cockpit Cards */}
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
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Rincian 5 Bidang Belanja Desa</h3>
                      <p className="text-xs text-slate-500">Nilai pada tabel ini terhubung langsung dengan tampilan transparansi di beranda publik.</p>
                    </div>
                  </div>

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

            {/* Modal Edit Data Warga Internal */}
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
                        onChange={(e) =>
                          setEditingResident({ ...editingResident, noKk: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:ring-1 focus:ring-[#009388]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={editingResident.nama}
                        onChange={(e) =>
                          setEditingResident({ ...editingResident, nama: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-[#009388]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Dusun
                      </label>
                      <select
                        value={editingResident.dusun}
                        onChange={(e) =>
                          setEditingResident({
                            ...editingResident,
                            dusun: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-[#009388]"
                      >
                        <option value="Manis">Dusun Manis</option>
                        <option value="Pahing">Dusun Pahing</option>
                        <option value="Puhun">Dusun Puhun</option>
                        <option value="Wage">Dusun Wage</option>
                        <option value="Kliwon">Dusun Kliwon</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          RT
                        </label>
                        <input
                          type="text"
                          value={editingResident.rt}
                          onChange={(e) =>
                            setEditingResident({ ...editingResident, rt: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-[#009388]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          RW
                        </label>
                        <input
                          type="text"
                          value={editingResident.rw}
                          onChange={(e) =>
                            setEditingResident({ ...editingResident, rw: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-[#009388]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Hubungan Keluarga
                      </label>
                      <input
                        type="text"
                        value={editingResident.hubunganKeluarga}
                        onChange={(e) =>
                          setEditingResident({
                            ...editingResident,
                            hubunganKeluarga: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-[#009388]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Pekerjaan
                      </label>
                      <input
                        type="text"
                        value={editingResident.pekerjaan}
                        onChange={(e) =>
                          setEditingResident({
                            ...editingResident,
                            pekerjaan: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-[#009388]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Alamat Lengkap
                      </label>
                      <input
                        type="text"
                        value={editingResident.alamat}
                        onChange={(e) =>
                          setEditingResident({
                            ...editingResident,
                            alamat: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-[#009388]"
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

            {/* Modal Tambah / Edit Berita */}
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
                          {newsList.some((n) => n.id === editingNews.id)
                            ? "Ubah Kabar Desa"
                            : "Tulis Kabar Desa Baru"}
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
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Judul Kabar Desa
                      </label>
                      <input
                        type="text"
                        value={editingNews.title}
                        onChange={(e) =>
                          setEditingNews({ ...editingNews, title: e.target.value })
                        }
                        placeholder="Contoh: Musyawarah Pembangunan Jalan Usaha Tani..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-[#009388]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Kategori
                        </label>
                        <select
                          value={editingNews.category}
                          onChange={(e) =>
                            setEditingNews({
                              ...editingNews,
                              category: e.target.value as NewsItem["category"],
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-[#009388]"
                        >
                          <option value="Pemerintahan">Pemerintahan</option>
                          <option value="Bansos">Bansos</option>
                          <option value="Kesehatan">Kesehatan</option>
                          <option value="Pembangunan">Pembangunan</option>
                          <option value="Kegiatan">Kegiatan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Penulis / Narasumber
                        </label>
                        <input
                          type="text"
                          value={editingNews.author}
                          onChange={(e) =>
                            setEditingNews({ ...editingNews, author: e.target.value })
                          }
                          placeholder="Contoh: Kasi Pelayanan"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-[#009388]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Ringkasan Isi Berita
                      </label>
                      <textarea
                        rows={3}
                        value={editingNews.summary}
                        onChange={(e) =>
                          setEditingNews({ ...editingNews, summary: e.target.value })
                        }
                        placeholder="Ringkasan singkat yang ditampilkan pada kartu berita..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-[#009388]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        URL Gambar Sampul
                      </label>
                      <input
                        type="text"
                        value={editingNews.imageUrl}
                        onChange={(e) =>
                          setEditingNews({ ...editingNews, imageUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:ring-1 focus:ring-[#009388]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Status Publikasi
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="newsStatus"
                            checked={editingNews.status === "Terbit"}
                            onChange={() =>
                              setEditingNews({ ...editingNews, status: "Terbit" })
                            }
                            className="text-[#009388] focus:ring-[#009388]"
                          />
                          <span className="font-semibold text-slate-800">Terbit (Tampil di Web Publik)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="newsStatus"
                            checked={editingNews.status === "Draf"}
                            onChange={() =>
                              setEditingNews({ ...editingNews, status: "Draf" })
                            }
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
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveNews}
                      className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Simpan Artikel</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Edit Pagu & Realisasi Bidang APBDes */}
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
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Pagu Anggaran (Rupiah)
                      </label>
                      <input
                        type="number"
                        value={editingBidang.pagu}
                        onChange={(e) =>
                          setEditingBidang({
                            ...editingBidang,
                            pagu: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:ring-1 focus:ring-[#009388]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Realisasi Belanja Berjalan (Rupiah)
                      </label>
                      <input
                        type="number"
                        value={editingBidang.realisasi}
                        onChange={(e) =>
                          setEditingBidang({
                            ...editingBidang,
                            realisasi: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:ring-1 focus:ring-[#009388]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Keterangan Alokasi / Kegiatan Utama
                      </label>
                      <textarea
                        rows={2}
                        value={editingBidang.keterangan}
                        onChange={(e) =>
                          setEditingBidang({
                            ...editingBidang,
                            keterangan: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-[#009388]"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-600">Estimasi Persentase Serapan:</span>
                      <strong className="text-[#009388] font-mono text-sm">
                        {editingBidang.pagu > 0
                          ? Math.round((editingBidang.realisasi / editingBidang.pagu) * 100)
                          : 0}
                        %
                      </strong>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => setIsEditBidangModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveBidang}
                      className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Simpan Nilai Bidang</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Edit Totals APBDes */}
            {isEditTotalsModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center">
                        <Edit3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900">
                          Sesuaikan Total Anggaran APBDes
                        </h3>
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
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Total Pendapatan Desa (Rupiah)
                      </label>
                      <input
                        type="number"
                        value={apbdesTotals.pendapatan}
                        onChange={(e) =>
                          setApbdesTotals({
                            ...apbdesTotals,
                            pendapatan: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:ring-1 focus:ring-[#009388]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Total Belanja Desa (Rupiah)
                      </label>
                      <input
                        type="number"
                        value={apbdesTotals.belanja}
                        onChange={(e) =>
                          setApbdesTotals({
                            ...apbdesTotals,
                            belanja: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:ring-1 focus:ring-[#009388]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Persentase Serapan Berjalan (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={apbdesTotals.serapan}
                        onChange={(e) =>
                          setApbdesTotals({
                            ...apbdesTotals,
                            serapan: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:ring-1 focus:ring-[#009388]"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => setIsEditTotalsModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => setIsEditTotalsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Simpan Ringkasan</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

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
          </main>
        </div>
      )}
      {/* Floating Sync & Feedback Notification Toast */}
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
