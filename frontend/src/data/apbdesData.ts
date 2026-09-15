export interface APBDesSector {
  id: number;
  nama: string;
  persen: number;
  pagu: number;
  realisasi: number;
  keterangan: string;
  subKegiatan: {
    nama: string;
    anggaran: number;
    realisasi: number;
    status: string;
  }[];
}

export interface APBDesRevenue {
  id: string;
  sumber: string;
  kategori: string;
  target: number;
  realisasi: number;
  persen: number;
}

export const APBDES_TOTAL_SUMMARY = {
  tahun: 2026,
  totalPendapatan: 1488500000,
  totalBelanja: 1445000000,
  totalRealisasiBelanja: 1148782000,
  persenRealisasiBelanja: 79.5,
  surplusDefisit: 43500000,
  silpaTahunLalu: 28400000
};

export const APBDES_REVENUES: APBDesRevenue[] = [
  {
    id: "REV-001",
    sumber: "Dana Desa (APBN)",
    kategori: "Transfer Pusat",
    target: 875000000,
    realisasi: 875000000,
    persen: 100
  },
  {
    id: "REV-002",
    sumber: "Alokasi Dana Desa (ADD Kab. Kuningan)",
    kategori: "Transfer Daerah",
    target: 420000000,
    realisasi: 315000000,
    persen: 75
  },
  {
    id: "REV-003",
    sumber: "Bagi Hasil Pajak & Retribusi Daerah",
    kategori: "Transfer Daerah",
    target: 68500000,
    realisasi: 51375000,
    persen: 75
  },
  {
    id: "REV-004",
    sumber: "Pendapatan Asli Desa (PADes)",
    kategori: "Pendapatan Asli",
    target: 85000000,
    realisasi: 72800000,
    persen: 85.6
  },
  {
    id: "REV-005",
    sumber: "Bantuan Keuangan Provinsi Jawa Barat",
    kategori: "Transfer Provinsi",
    target: 40000000,
    realisasi: 40000000,
    persen: 100
  }
];

export const APBDES_SECTORS: APBDesSector[] = [
  {
    id: 1,
    nama: "Penyelenggaraan Pemerintahan Desa",
    persen: 85,
    pagu: 485600000,
    realisasi: 412760000,
    keterangan: "Penghasilan tetap dan tunjangan perangkat desa, operasional balai desa, kearsipan, serta tunjangan BPD.",
    subKegiatan: [
      { nama: "Penghasilan Tetap & Tunjangan Kepala Desa & Perangkat", anggaran: 288000000, realisasi: 240000000, status: "Tepat Waktu" },
      { nama: "Operasional Kantor Balai Desa & Listrik / Internet", anggaran: 54000000, realisasi: 45000000, status: "Berjalan Lancar" },
      { nama: "Operasional dan Tunjangan Kinerja BPD", anggaran: 48000000, realisasi: 40000000, status: "Berjalan Lancar" },
      { nama: "Penyusunan Profil Desa & Sensus SDGs Mandiri", anggaran: 95600000, realisasi: 87760000, status: "Hampir Rampung" }
    ]
  },
  {
    id: 2,
    nama: "Pelaksanaan Pembangunan Desa",
    persen: 78,
    pagu: 562400000,
    realisasi: 438672000,
    keterangan: "Pembangunan rabat beton jalan usaha tani Dusun Pahing, drainase pemukiman Dusun Wage, dan renovasi Pustu.",
    subKegiatan: [
      { nama: "Rabat Beton Jalan Usaha Tani Dusun Pahing (650m)", anggaran: 185000000, realisasi: 185000000, status: "100% Selesai" },
      { nama: "Rehabilitasi Drainase Pemukiman Dusun Wage (320m)", anggaran: 84500000, realisasi: 77740000, status: "Tahap Akhir (92%)" },
      { nama: "Pemasangan Lampu Penerangan Jalan Umum (PJU) Tenaga Surya", anggaran: 62900000, realisasi: 62900000, status: "100% Selesai" },
      { nama: "Perluasan Saluran Pipa Air Bersih Mata Air Cikaduran", anggaran: 120000000, realisasi: 68032000, status: "Sedang Berjalan" },
      { nama: "Stimulan Bedah Rumah Tidak Layak Huni (8 Unit)", anggaran: 110000000, realisasi: 45000000, status: "Tahap II Berjalan" }
    ]
  },
  {
    id: 3,
    nama: "Pembinaan Kemasyarakatan Desa",
    persen: 88,
    pagu: 145000000,
    realisasi: 127600000,
    keterangan: "Pembinaan poskamling ketertiban dusun, kegiatan kepemudaan Karang Taruna, dan festival olahraga desa.",
    subKegiatan: [
      { nama: "Pengadaan Perlengkapan Poskamling Terpadu 3 Dusun", anggaran: 35000000, realisasi: 32000000, status: "100% Selesai" },
      { nama: "Pekan Olahraga & Seni Warga Kadurama di Gelora Dusun Pahing", anggaran: 45000000, realisasi: 45000000, status: "100% Selesai" },
      { nama: "Pelatihan Kesiapsiagaan Bencana & Kebakaran Warga", anggaran: 25000000, realisasi: 21600000, status: "Selesai" },
      { nama: "Bantuan Sarana Kelompok Pengajian & Keagamaan", anggaran: 40000000, realisasi: 29000000, status: "Berjalan Sesuai Jadwal" }
    ]
  },
  {
    id: 4,
    nama: "Pemberdayaan Masyarakat Desa",
    persen: 71,
    pagu: 132000000,
    realisasi: 93720000,
    keterangan: "Pelatihan UMKM olahan ubi jalar, pengadaan bibit pupuk hayati organik, dan permodalan BUMDes Bina Mandiri.",
    subKegiatan: [
      { nama: "Pelatihan Pemasaran Digital & QRIS bagi 25 UMKM Olahan Pangan", anggaran: 32000000, realisasi: 28500000, status: "Selesai" },
      { nama: "Penyertaan Modal Usaha BUMDes Bina Mandiri (Unit Pangan)", anggaran: 50000000, realisasi: 50000000, status: "Terealisasi" },
      { nama: "Bantuan Bibit Padi Organik Inpari 32 & Pupuk Organik Cair", anggaran: 30000000, realisasi: 15220000, status: "Musim Tanam II" },
      { nama: "Bantuan Pakan Tambahan & Vaksinasi Ternak Sapi Perah", anggaran: 20000000, realisasi: 0, status: "Jadwal Triwulan IV" }
    ]
  },
  {
    id: 5,
    nama: "Penanggulangan Bencana & Mendesak",
    persen: 64,
    pagu: 120000000,
    realisasi: 76800000,
    keterangan: "Bantuan Langsung Tunai (BLT) Dana Desa untuk 45 KPM rentan desil 1-2 serta kesiapsiagaan darurat.",
    subKegiatan: [
      { nama: "Penyaluran BLT Dana Desa (45 KPM x Rp 300.000 x 9 Bulan)", anggaran: 108000000, realisasi: 76800000, status: "Tahap III Disalurkan" },
      { nama: "Dana Cadangan Tanggap Darurat Bencana Cuaca Ekstrem", anggaran: 12000000, realisasi: 0, status: "Siaga Kas Desa" }
    ]
  }
];
