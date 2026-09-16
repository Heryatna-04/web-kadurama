export interface LayananSurat {
  id: string;
  code: string;
  nama: string;
  kategori: "Kependudukan" | "Kesejahteraan" | "Usaha" | "Pertanahan" | "Umum";
  deskripsi: string;
  persyaratan: string[];
  alur: { step: number; title: string; desc: string }[];
}

export const DAFTAR_LAYANAN_SURAT: LayananSurat[] = [
  // 1. SKTM
  {
    id: "surat-sktm",
    code: "SKTM",
    nama: "Surat Keterangan Tidak Mampu (SKTM)",
    kategori: "Kesejahteraan",
    deskripsi: "Surat keterangan resmi keadaan ekonomi keluarga pemohon untuk pengajuan beasiswa (KIP), keringanan biaya pendidikan, jaminan kesehatan, atau bantuan sosial.",
    persyaratan: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Maksud / Tujuan Permohonan"
    ],
    alur: [
      { step: 1, title: "Persiapan Berkas", desc: "Siapkan fotokopi KK dan cantumkan maksud/tujuan pengajuan permohonan." },
      { step: 2, title: "Loket Balai Desa", desc: "Serahkan berkas ke petugas loket pelayanan Kantor Balai Desa Kadurama." },
      { step: 3, title: "Pengesahan Kuwu", desc: "Penerbitan surat resmi berkop desa yang ditandatangani Kepala Desa dan dicap stempel basah." }
    ]
  },

  // 2. SKU
  {
    id: "surat-sku",
    code: "SKU",
    nama: "Surat Keterangan Usaha (SKU)",
    kategori: "Usaha",
    deskripsi: "Surat keterangan legalitas keberadaan kegiatan usaha warga di Desa Kadurama untuk permohonan perbankan, pinjaman modal usaha, atau legalitas izin usaha.",
    persyaratan: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Maksud / Tujuan Usaha"
    ],
    alur: [
      { step: 1, title: "Persiapan Berkas", desc: "Bawa fotokopi KK dan cantumkan maksud/tujuan kegiatan usaha yang dijalankan." },
      { step: 2, title: "Verifikasi Loket", desc: "Petugas loket memverifikasi data kependudukan dan kegiatan usaha pemohon." },
      { step: 3, title: "Penerbitan SKU", desc: "Surat keterangan usaha dicetak dan disahkan resmi oleh Kepala Desa." }
    ]
  },

  // 3. SURAT KETERANGAN KEMATIAN
  {
    id: "surat-kematian",
    code: "SK-Kematian",
    nama: "Surat Keterangan Kematian",
    kategori: "Kependudukan",
    deskripsi: "Surat keterangan resmi pencatatan peristiwa kematian warga di Desa Kadurama untuk pengurusan Akta Kematian Disdukcapil, perbankan, pensiun, atau administrasi ahli waris.",
    persyaratan: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Tanggal Kematian",
      "Keterangan Waktu Kematian"
    ],
    alur: [
      { step: 1, title: "Pelaporan ke Balai Desa", desc: "Keluarga/ahli waris membawa KK almarhum/almarhumah beserta rincian tanggal dan waktu kematian." },
      { step: 2, title: "Pencatatan Register", desc: "Petugas loket mencatat peristiwa kematian ke buku register kependudukan desa." },
      { step: 3, title: "Penerbitan Surat", desc: "Penerbitan Surat Keterangan Kematian resmi yang disahkan oleh Kepala Desa Kadurama." }
    ]
  },

  // 4. SURAT KETERANGAN LAHIR
  {
    id: "surat-kelahiran",
    code: "SK-Lahir",
    nama: "Surat Keterangan Lahir",
    kategori: "Kependudukan",
    deskripsi: "Surat keterangan pencatatan kelahiran anak warga Desa Kadurama sebagai pengantar resmi pembuatan Akta Kelahiran dan penambahan anggota KK di Disdukcapil.",
    persyaratan: [
      "Fotokopi Kartu Keluarga (KK)",
      "Nama Ibu dan Bapak Kandung",
      "Keterangan Tanggal Lahir",
      "Keterangan Waktu Lahir"
    ],
    alur: [
      { step: 1, title: "Bawa Dokumen", desc: "Orang tua membawa KK, mencantumkan nama ayah & ibu kandung, serta tanggal dan waktu kelahiran bayi." },
      { step: 2, title: "Pencatatan Register", desc: "Petugas loket mencatat data kelahiran anak ke sistem administrasi desa." },
      { step: 3, title: "Penerbitan Surat", desc: "Surat keterangan kelahiran resmi disahkan Kepala Desa Kadurama." }
    ]
  },

  // 5. SURAT KETERANGAN KERJA
  {
    id: "surat-kerja",
    code: "SK-Kerja",
    nama: "Surat Keterangan Kerja",
    kategori: "Umum",
    deskripsi: "Surat keterangan resmi yang menerangkan status mata pencaharian, profesi, atau rekomendasi melamar pekerjaan bagi warga Desa Kadurama.",
    persyaratan: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Maksud / Tujuan"
    ],
    alur: [
      { step: 1, title: "Persiapan Berkas", desc: "Bawa fotokopi KK dan tentukan maksud/tujuan instansi atau perusahaan yang dituju." },
      { step: 2, title: "Verifikasi Loket", desc: "Petugas loket memeriksa identitas pemohon dan memvalidasi tujuan kerja." },
      { step: 3, title: "Penerbitan Surat", desc: "Surat keterangan kerja dicetak resmi dengan tanda tangan Kuwu dan cap basah." }
    ]
  },

  // 6. SURAT KETERANGAN AHLI WARIS
  {
    id: "surat-ahli-waris",
    code: "SK-Waris",
    nama: "Surat Keterangan Ahli Waris",
    kategori: "Pertanahan",
    deskripsi: "Surat keterangan resmi yang menerangkan susunan sah para ahli waris dari pewaris yang telah wafat untuk keperluan pembagian hak waris, perbankan, atau balik nama sertifikat.",
    persyaratan: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Tujuan / Maksud"
    ],
    alur: [
      { step: 1, title: "Penyiapan Berkas", desc: "Bawa fotokopi KK dan rincian tujuan/maksud pengurusan hak ahli waris." },
      { step: 2, title: "Pemeriksaan Pamong", desc: "Pamong desa memverifikasi susunan garis keturunan dan kesepakatan keluarga." },
      { step: 3, title: "Pengesahan Kuwu", desc: "Penandatanganan Surat Keterangan Ahli Waris resmi oleh Kepala Desa Kadurama." }
    ]
  },

  // 7. SURAT KETERANGAN DOMISILI
  {
    id: "surat-domisili",
    code: "SK-Domisili",
    nama: "Surat Keterangan Domisili",
    kategori: "Kependudukan",
    deskripsi: "Surat keterangan tempat tinggal resmi bagi warga yang bertempat tinggal di Desa Kadurama untuk keperluan administrasi kependudukan, perbankan, atau kepegawaian.",
    persyaratan: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Bersangkutan Tinggal di Mana"
    ],
    alur: [
      { step: 1, title: "Bawa Dokumen", desc: "Bawa fotokopi KK dan sebutkan alamat tinggal saat ini (Dusun, RT, dan RW)." },
      { step: 2, title: "Pencocokan Wilayah", desc: "Petugas memeriksa kesesuaian alamat domisili tempat tinggal pemohon." },
      { step: 3, title: "Penerbitan Surat", desc: "Surat domisili diterbitkan dan disahkan resmi oleh Kepala Desa Kadurama." }
    ]
  },

  // 8. SURAT JALAN
  {
    id: "surat-jalan",
    code: "Surat Jalan",
    nama: "Surat Jalan (Keterangan Bepergian)",
    kategori: "Umum",
    deskripsi: "Surat pengantar resmi bagi warga Desa Kadurama yang hendak melakukan perjalanan ke luar daerah/kota untuk dinas, perantauan, bekerja, atau urusan keluarga.",
    persyaratan: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Mau Pergi ke Mana / Tujuan"
    ],
    alur: [
      { step: 1, title: "Pengajuan Rencana Perjalanan", desc: "Bawa fotokopi KK dan sebutkan kota tujuan bepergian serta keperluan perjalanan." },
      { step: 2, title: "Register Perjalanan", desc: "Petugas loket mencatat rincian tujuan dan durasi bepergian pemohon." },
      { step: 3, title: "Penerbitan Surat Jalan", desc: "Surat jalan resmi ditandatangani Kepala Desa Kadurama." }
    ]
  },

  // 9. SURAT KETERANGAN TANAH
  {
    id: "surat-tanah",
    code: "SK-Tanah",
    nama: "Surat Keterangan Tanah",
    kategori: "Pertanahan",
    deskripsi: "Surat keterangan resmi kepemilikan, riwayat, atau penguasaan bidang tanah di wilayah Desa Kadurama untuk pensertifikatan, jual beli, hibah, atau perbankan.",
    persyaratan: [
      "Fotokopi Kartu Keluarga (KK)",
      "Surat Pemberitahuan Pajak Terhutang (SPPT)",
      "Keterangan Tujuan / Maksud"
    ],
    alur: [
      { step: 1, title: "Penyiapan Berkas", desc: "Bawa fotokopi KK, lembar SPPT PBB tahun berjalan, dan maksud pengurusan tanah." },
      { step: 2, title: "Pencocokan Letter C", desc: "Pamong memeriksa kesesuaian nomor persil, luas, dan data buku Letter C desa." },
      { step: 3, title: "Penerbitan Surat", desc: "Penerbitan Surat Keterangan Tanah resmi berkop desa bertandatangan Kuwu." }
    ]
  },

  // 10. SURAT KETERANGAN-KETERANGAN (STATUS & HAJI / UMROH)
  {
    id: "surat-keterangan-keterangan",
    code: "SK-Keterangan",
    nama: "Surat Keterangan-Keterangan (Belum Menikah, Akan Menikah, Janda, Duda, Mau Berangkat Haji & Umroh)",
    kategori: "Kependudukan",
    deskripsi: "Layanan surat keterangan terpadu untuk pencatatan status administrasi kependudukan dan rekomendasi ibadah warga: keterangan belum menikah, akan menikah, janda, duda, serta keterangan mau berangkat haji & umroh.",
    persyaratan: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Maksud / Tujuan (Belum Menikah / Akan Menikah / Keterangan Janda / Keterangan Duda / Mau Berangkat Haji & Umroh)"
    ],
    alur: [
      { step: 1, title: "Pilih Keperluan Keterangan", desc: "Bawa KK dan tentukan status yang dimohonkan (belum menikah, akan menikah, janda, duda, atau keberangkatan haji & umroh)." },
      { step: 2, title: "Verifikasi Data", desc: "Petugas loket memvalidasi status kependudukan pemohon pada basis data desa." },
      { step: 3, title: "Pengesahan Kuwu", desc: "Penerbitan surat keterangan resmi bertandatangan Kepala Desa dan stempel basah." }
    ]
  },

  // 11. SUB-JENIS KHUSUS: SURAT KETERANGAN BELUM MENIKAH
  {
    id: "surat-belum-menikah",
    code: "SK-BM",
    nama: "Surat Keterangan Belum Menikah",
    kategori: "Kependudukan",
    deskripsi: "Surat keterangan resmi yang menyatakan bahwa pemohon belum pernah menikah untuk melamar pekerjaan, beasiswa, atau persyaratan KPR.",
    persyaratan: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Maksud / Tujuan"
    ],
    alur: [
      { step: 1, title: "Bawa Berkas", desc: "Bawa fotokopi KK dan sampaikan instansi tujuan permohonan." },
      { step: 2, title: "Validasi Register", desc: "Petugas memeriksa status perkawinan di data kependudukan desa." },
      { step: 3, title: "Penerbitan Surat", desc: "Surat keterangan belum menikah disahkan oleh Kepala Desa." }
    ]
  },

  // 12. SUB-JENIS KHUSUS: SURAT KETERANGAN AKAN MENIKAH
  {
    id: "surat-akan-menikah",
    code: "SK-AM",
    nama: "Surat Keterangan Akan Menikah",
    kategori: "Kependudukan",
    deskripsi: "Surat pengantar bagi warga yang akan melangsungkan pernikahan untuk kelengkapan berkas pendaftaran ke Kantor Urusan Agama (KUA).",
    persyaratan: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Maksud / Tujuan"
    ],
    alur: [
      { step: 1, title: "Bawa Berkas", desc: "Bawa fotokopi KK dan informasi rencana pernikahan." },
      { step: 2, title: "Pemeriksaan Modin / Kesra", desc: "Kaur Kesra memvalidasi dokumen administrasi calon pengantin." },
      { step: 3, title: "Penerbitan Pengantar", desc: "Surat pengantar akan menikah disahkan Kepala Desa Kadurama." }
    ]
  },

  // 13. SUB-JENIS KHUSUS: SURAT KETERANGAN JANDA / DUDA
  {
    id: "surat-janda-duda",
    code: "SK-JD",
    nama: "Surat Keterangan Janda / Duda",
    kategori: "Kependudukan",
    deskripsi: "Surat keterangan resmi status janda atau duda (cerai mati / cerai hidup) untuk keperluan pensiun taspen, santunan, perbankan, atau pernikahan kembali.",
    persyaratan: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Maksud / Tujuan"
    ],
    alur: [
      { step: 1, title: "Bawa Dokumen", desc: "Bawa fotokopi KK dan sampaikan maksud pengurusan status janda / duda." },
      { step: 2, title: "Pencocokan Berkas", desc: "Petugas memverifikasi status perkawinan pada catatan sipil desa." },
      { step: 3, title: "Penerbitan Surat", desc: "Surat keterangan resmi diterbitkan bertandatangan Kepala Desa." }
    ]
  },

  // 14. SUB-JENIS KHUSUS: SURAT KETERANGAN MAU BERANGKAT HAJI & UMROH
  {
    id: "surat-haji-umroh",
    code: "SK-Haji",
    nama: "Surat Keterangan Mau Berangkat Haji & Umroh",
    kategori: "Umum",
    deskripsi: "Surat pengantar dan rekomendasi resmi dari Pemerintah Desa Kadurama bagi warga yang akan menunaikan ibadah haji atau umroh ke tanah suci Mekkah.",
    persyaratan: [
      "Fotokopi Kartu Keluarga (KK)",
      "Keterangan Maksud / Tujuan (Jadwal / Keberangkatan Haji & Umroh)"
    ],
    alur: [
      { step: 1, title: "Pengajuan Pengantar", desc: "Bawa fotokopi KK dan sebutkan rencana jadwal keberangkatan ibadah ke loket." },
      { step: 2, title: "Pencatatan Keberangkatan", desc: "Petugas mencatat data calon jamaah haji / umroh di arsip keagamaan desa." },
      { step: 3, title: "Penerbitan Rekomendasi", desc: "Kepala Desa menandatangani surat keterangan dan doa restu keberangkatan warga." }
    ]
  }
];
