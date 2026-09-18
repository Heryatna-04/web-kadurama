export interface APBDesSector {
  id: number;
  tahun?: number;
  nama: string;
  persen: number;
  pagu: number;
  realisasi: number;
  keterangan: string;
  subKegiatan: {
    id?: string;
    nama: string;
    anggaran: number;
    realisasi?: number;
    keterangan?: string;
    status?: string;
  }[];
}

export interface APBDesRevenue {
  id: string;
  tahun?: number;
  sumber: string;
  kategori: string;
  target: number;
  realisasi: number;
  persen: number;
  keterangan?: string;
}

// =============================================================================
// APBDES 2026 (ANGGARAN MURNI KEPALA DESA SAMIR SYARIFUDIN)
// =============================================================================
export const APBDES_TOTAL_SUMMARY = {
  tahun: 2026,
  totalPendapatan: 898152227,
  totalBelanja: 856452227,
  totalRealisasiBelanja: 0,
  persenRealisasiBelanja: 0,
  surplusDefisit: 41700000,
  pembiayaanNetto: 41700000,
  silpaTahunLalu: 0,
};

export const APBDES_REVENUES: APBDesRevenue[] = [
  {
    id: "REV-2026-001",
    tahun: 2026,
    sumber: "Pendapatan Asli Desa (PADes)",
    kategori: "Pendapatan Asli",
    target: 55200000,
    realisasi: 0,
    persen: 0,
    keterangan: "Bagi hasil BUMDes & pengelolaan tanah kas desa",
  },
  {
    id: "REV-2026-002",
    tahun: 2026,
    sumber: "Dana Desa (DD APBN)",
    kategori: "Transfer Pusat",
    target: 312599000,
    realisasi: 0,
    persen: 0,
    keterangan: "Pembangunan infrastruktur & ketahanan pangan",
  },
  {
    id: "REV-2026-003",
    tahun: 2026,
    sumber: "Alokasi Dana Desa (ADD Kab. Kuningan)",
    kategori: "Transfer Daerah",
    target: 136947000,
    realisasi: 0,
    persen: 0,
    keterangan: "Siltap & tunjangan aparatur serta operasional pemdes",
  },
  {
    id: "REV-2026-004",
    tahun: 2026,
    sumber: "Bantuan Keuangan Provinsi (BKP Jabar)",
    kategori: "Transfer Provinsi",
    target: 130000000,
    realisasi: 0,
    persen: 0,
    keterangan: "Bantuan Pemprov Jabar untuk program desa",
  },
  {
    id: "REV-2026-005",
    tahun: 2026,
    sumber: "Bagi Hasil Pajak & Retribusi Daerah",
    kategori: "Transfer Daerah",
    target: 36006227,
    realisasi: 0,
    persen: 0,
    keterangan: "Bagi hasil pajak dan retribusi Kabupaten Kuningan",
  },
  {
    id: "REV-2026-006",
    tahun: 2026,
    sumber: "Pendapatan Bunga Bank & Lain-lain",
    kategori: "Lain-lain",
    target: 1200000,
    realisasi: 0,
    persen: 0,
    keterangan: "Jasa giro kas rekening desa",
  },
];

export const APBDES_SECTORS: APBDesSector[] = [
  {
    id: 1,
    tahun: 2026,
    nama: "Bidang Penyelenggaraan Pemerintahan Desa",
    persen: 0,
    pagu: 543725227,
    realisasi: 0,
    keterangan:
      "Siltap & tunjangan Kades/Perangkat, operasional BPD, RT/RW, rehab kantor desa, dan pengembangan SID.",
    subKegiatan: [
      { nama: "Penghasilan Tetap dan Tunjangan Kepala Desa", anggaran: 55505960 },
      { nama: "Penghasilan Tetap dan Tunjangan Perangkat Desa", anggaran: 358474480 },
      { nama: "Penyediaan Jaminan Sosial Kepala Desa & Perangkat Desa", anggaran: 1584000 },
      { nama: "Operasional Pemerintahan Desa", anggaran: 19834787 },
      { nama: "Penyediaan Tunjangan BPD", anggaran: 18100000 },
      { nama: "Penyediaan Operasional BPD", anggaran: 10900000 },
      { nama: "Penyediaan Insentif/Operasional RT/RW", anggaran: 2054000 },
      { nama: "Operasional Kegiatan Bersumber Dana Desa (DD)", anggaran: 9300000 },
      { nama: "Pembangunan/Rehabilitasi/Prasarana Kantor Desa", anggaran: 25000000 },
      { nama: "Penyusunan, Penataan dan Pemutakhiran Profil Desa", anggaran: 2700000 },
      { nama: "Penyusunan Dokumen Perencanaan Desa (RPJMDes, RKPDes, APBDes)", anggaran: 6000000 },
      { nama: "Penyelenggaraan Musyawarah Desa Lainnya", anggaran: 11000000 },
      { nama: "Pengembangan Sistem Informasi Desa (SID)", anggaran: 7872000 },
      { nama: "Dukungan Administrasi SID dan Penjaringan Perangkat Desa", anggaran: 5000000 },
      { nama: "Administrasi Pajak Bumi dan Bangunan (PBB)", anggaran: 10000000 },
    ],
  },
  {
    id: 2,
    tahun: 2026,
    nama: "Bidang Pelaksanaan Pembangunan Desa",
    persen: 0,
    pagu: 201627000,
    realisasi: 0,
    keterangan:
      "Pembangunan/peningkatan pengerasan jalan desa, sarana posyandu, PAUD desa, dan pengelolaan sampah.",
    subKegiatan: [
      { nama: "Pembangunan/Rehabilitasi/Peningkatan Pengerasan Jalan Desa", anggaran: 98000000 },
      { nama: "Penyelenggaraan Posyandu Balita & Lansia", anggaran: 55000000 },
      { nama: "Pemeliharaan Fasilitas Pengelolaan Sampah Desa", anggaran: 18000000 },
      { nama: "Penyuluhan dan Pelatihan bagi Pendidikan Masyarakat", anggaran: 13000000 },
      { nama: "Penyelenggaraan PAUD Desa", anggaran: 8627000 },
      { nama: "Pengasuhan Bersama atau Bina Keluarga Balita (BKB)", anggaran: 8000000 },
      { nama: "Penyelenggaraan Informasi Publik Desa", anggaran: 1000000 },
    ],
  },
  {
    id: 3,
    tahun: 2026,
    nama: "Bidang Pembinaan Kemasyarakatan",
    persen: 0,
    pagu: 0,
    realisasi: 0,
    keterangan: "Kegiatan pembinaan kelembagaan, kepemudaan, seni budaya & keagamaan.",
    subKegiatan: [],
  },
  {
    id: 4,
    tahun: 2026,
    nama: "Bidang Pemberdayaan Masyarakat",
    persen: 0,
    pagu: 78000000,
    realisasi: 0,
    keterangan:
      "Pemeliharaan saluran irigasi tersier pertanian, pemasaran UMKM & pelatihan pemberdayaan perempuan.",
    subKegiatan: [
      { nama: "Pemeliharaan Saluran Irigasi Tersier / Sederhana", anggaran: 54000000 },
      { nama: "Pelatihan Penyuluhan Pemberdayaan Perempuan", anggaran: 10000000 },
      { nama: "Pengembangan Sarana Pemasaran Usaha Mikro (UMKM) & Koperasi", anggaran: 10000000 },
      { nama: "Peningkatan Kapasitas Kepala Desa", anggaran: 2000000 },
      { nama: "Peningkatan Kapasitas BPD", anggaran: 2000000 },
    ],
  },
  {
    id: 5,
    tahun: 2026,
    nama: "Bidang Penanggulangan Bencana & Mendesak",
    persen: 0,
    pagu: 33100000,
    realisasi: 0,
    keterangan: "Kegiatan mitigasi bencana serta penanganan keadaan darurat mendesak warga.",
    subKegiatan: [
      { nama: "Kegiatan Penanggulangan Bencana Desa", anggaran: 25000000 },
      { nama: "Penanganan Keadaan Mendesak Desa", anggaran: 8100000 },
    ],
  },
];

// =============================================================================
// ILPPD 2025 (LAPORAN REALISASI PERTANGGUNGJAWABAN PENYELENGGARAAN PEMERINTAHAN DESA)
// =============================================================================
export const ILPPD_2025_SUMMARY = {
  tahun: 2025,
  totalPendapatanAnggaran: 1477514768,
  totalPendapatanRealisasi: 1477820277,
  totalBelanjaAnggaran: 1291201368,
  totalBelanjaRealisasi: 1291506827,
  surplusDefisitAnggaran: 186313400,
  surplusDefisitRealisasi: 186316400,
  pengeluaranPembiayaan: 186313400,
  cadanganPilkades: 9200000,
  penyertaanBumdes: 177113400,
};

export const ILPPD_2025_SECTORS: APBDesSector[] = [
  {
    id: 1,
    tahun: 2025,
    nama: "1. Bidang Penyelenggaraan Pemerintahan Desa",
    pagu: 684010768,
    realisasi: 601076227,
    persen: 87.88,
    keterangan: "Realisasi Siltap Kades/Perangkat, operasional kantor balai desa & BPD.",
    subKegiatan: [
      { nama: "Siltap & Tunjangan Kepala Desa", anggaran: 55505960, realisasi: 55505960 },
      { nama: "Siltap & Tunjangan Perangkat Desa", anggaran: 358474480, realisasi: 358474480 },
      { nama: "Operasional Kantor & Kelembagaan BPD", anggaran: 270030328, realisasi: 187095787 },
    ],
  },
  {
    id: 2,
    tahun: 2025,
    nama: "2. Bidang Pelaksanaan Pembangunan Desa",
    pagu: 337960600,
    realisasi: 428410600,
    persen: 126.76,
    keterangan: "Pembangunan rabat beton jalan lingkungan 3 dusun, drainase pemukiman & sarana posyandu.",
    subKegiatan: [
      { nama: "Pembangunan Jalan Rabat Beton & Drainase", anggaran: 237960600, realisasi: 328410600 },
      { nama: "Penyelenggaraan Posyandu Balita & Kesehatan", anggaran: 100000000, realisasi: 100000000 },
    ],
  },
  {
    id: 3,
    tahun: 2025,
    nama: "3. Bidang Pembinaan Kemasyarakatan",
    pagu: 0,
    realisasi: 0,
    persen: 0,
    keterangan: "Kegiatan pembinaan kemasyarakatan TA 2025.",
    subKegiatan: [],
  },
  {
    id: 4,
    tahun: 2025,
    nama: "4. Bidang Pemberdayaan Masyarakat",
    pagu: 164785000,
    realisasi: 157575000,
    persen: 95.62,
    keterangan: "Program ketahanan pangan desa, irigasi pertanian & pelatihan kelompok tani.",
    subKegiatan: [
      { nama: "Ketahanan Pangan & Irigasi Pertanian", anggaran: 124785000, realisasi: 120575000 },
      { nama: "Pelatihan Kelompok Tani & UMKM Desa", anggaran: 40000000, realisasi: 37000000 },
    ],
  },
  {
    id: 5,
    tahun: 2025,
    nama: "5. Bidang Penanggulangan Bencana & Mendesak",
    pagu: 104445000,
    realisasi: 104445000,
    persen: 100.0,
    keterangan: "Penyaluran Bantuan Langsung Tunai Dana Desa (BLT-DD) 100% tepat sasaran & tanggap darurat.",
    subKegiatan: [
      { nama: "Penyaluran BLT Dana Desa (100% Terserap)", anggaran: 96345000, realisasi: 96345000 },
      { nama: "Penanganan Keadaan Mendesak Desa", anggaran: 8100000, realisasi: 8100000 },
    ],
  },
];
