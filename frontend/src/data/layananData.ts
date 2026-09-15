export interface LayananSurat {
  id: string;
  code: string;
  nama: string;
  kategori: "Kependudukan" | "Kesejahteraan" | "Usaha" | "Umum";
  deskripsi: string;
  persyaratan: string[];
  alur: { step: number; title: string; desc: string }[];
}

export const DAFTAR_LAYANAN_SURAT: LayananSurat[] = [
  {
    id: "surat-sktm",
    code: "SKTM",
    nama: "Surat Keterangan Tidak Mampu (SKTM)",
    kategori: "Kesejahteraan",
    deskripsi: "Surat keterangan resmi untuk keperluan beasiswa pendidikan (KIP Kuliah), jaminan kesehatan (BPJS PBI), atau keringanan biaya rumah sakit.",
    persyaratan: [
      "Fotokopi Kartu Tanda Penduduk (KTP) pemohon & orang tua",
      "Fotokopi Kartu Keluarga (KK) yang masih berlaku",
      "Surat Pengantar RT/RW setempat yang ditandatangani Ketua RT",
      "Foto rumah tampak depan & ruang keluarga (opsional)",
      "Surat pernyataan penghasilan orang tua bermaterai (khusus beasiswa)"
    ],
    alur: [
      { step: 1, title: "Surat Pengantar RT/RW", desc: "Minta surat pengantar domisili tidak mampu dari Ketua RT dan Ketua RW setempat." },
      { step: 2, title: "Verifikasi Loket Balai Desa", desc: "Kasi Kesejahteraan memeriksa kelayakan berkas fisik dan pencocokan basis data DTKS Desa." },
      { step: 3, title: "Penandatanganan Kuwu", desc: "Surat dicetak resmi dan ditandatangani Kepala Desa beserta stempel basah." },
      { step: 4, title: "Penyerahan Berkas", desc: "Warga menerima lembar fisik surat resmi di loket pelayanan Balai Desa Kadurama." }
    ]
  },
  {
    id: "surat-sku",
    code: "SKU",
    nama: "Surat Keterangan Usaha (SKU)",
    kategori: "Usaha",
    deskripsi: "Keterangan legalitas kegiatan usaha warga di wilayah Desa Kadurama untuk pengajuan KUR perbankan, izin edar, atau legalitas UMKM.",
    persyaratan: [
      "Fotokopi KTP pemilik usaha",
      "Fotokopi Kartu Keluarga",
      "Surat Pengantar RT/RW domisili tempat usaha",
      "Foto tempat usaha atau aktivitas produksi (misal: olahan ubi / bengkel)"
    ],
    alur: [
      { step: 1, title: "Surat Pengantar RT", desc: "Bawa surat pengantar keterangan usaha dari RT wilayah domisili tempat usaha." },
      { step: 2, title: "Validasi Kadus & Loket", desc: "Kepala Dusun terkait dan petugas loket memvalidasi keberadaan fisik unit usaha." },
      { step: 3, title: "Penerbitan Surat", desc: "Kasi Pelayanan mencetak SKU resmi yang ditandatangani Kepala Desa Kadurama." }
    ]
  },
  {
    id: "surat-domisili",
    code: "SKD",
    nama: "Surat Keterangan Domisili Warga / Lembaga",
    kategori: "Kependudukan",
    deskripsi: "Keterangan tempat tinggal resmi bagi warga yang bertempat tinggal di Kadurama untuk syarat perbankan, pekerjaan, atau organisasi.",
    persyaratan: [
      "Fotokopi KTP pemohon",
      "Fotokopi Kartu Keluarga asal",
      "Surat Pengantar RT/RW tempat tinggal saat ini"
    ],
    alur: [
      { step: 1, title: "Pemeriksaan Identitas", desc: "Operator loket mencocokkan fisik KTP dengan buku induk kependudukan desa." },
      { step: 2, title: "Pengesahan Kepala Desa", desc: "Penerbitan surat domisili resmi bertandatangan Kepala Desa dan stempel kantor." }
    ]
  },
  {
    id: "surat-pengantar-skck",
    code: "SKCK",
    nama: "Surat Pengantar Catatan Kepolisian (SKCK)",
    kategori: "Umum",
    deskripsi: "Surat pengantar resmi dari desa untuk pembuatan SKCK di Polsek Ciawigebang atau Polres Kuningan.",
    persyaratan: [
      "Fotokopi KTP pemohon",
      "Fotokopi Kartu Keluarga",
      "Fotokopi Akta Kelahiran / Ijazah Terakhir",
      "Surat Pengantar RT/RW setempat",
      "Pas foto 4x6 latar merah (2 lembar)"
    ],
    alur: [
      { step: 1, title: "Pemeriksaan Berkas di Loket", desc: "Lengkapi berkas identitas diri dan sebutkan keperluan pembuatan SKCK ke petugas loket." },
      { step: 2, title: "Legalisasi Kuwu", desc: "Kepala Desa menandatangani pengantar resmi untuk dibawa ke Polsek Ciawigebang." }
    ]
  },
  {
    id: "surat-pengantar-nikah",
    code: "N1-N4",
    nama: "Surat Pengantar Pernikahan (Model N1 - N4)",
    kategori: "Kependudukan",
    deskripsi: "Berkas formulir pengantar resmi pendaftaran pernikahan ke Kantor Urusan Agama (KUA) Kecamatan Ciawigebang.",
    persyaratan: [
      "Fotokopi KTP & KK calon pengantin (pria dan wanita)",
      "Fotokopi KTP orang tua calon pengantin",
      "Fotokopi Akta Kelahiran & Ijazah Terakhir",
      "Surat Pengantar RT/RW wilayah calon pengantin",
      "Surat Kematian jika orang tua sudah meninggal dunia",
      "Akta Cerai jika berstatus duda / janda cerai hidup"
    ],
    alur: [
      { step: 1, title: "Konsultasi Modin / Kesra", desc: "Pengecekan kelengkapan berkas wali nikah dan status administrasi mempelai." },
      { step: 2, title: "Penerbitan Berkas N1 s.d N4", desc: "Penerbitan formulir model N1, N2, N4 resmi yang disahkan oleh Kuwu Kadurama." }
    ]
  }
];
