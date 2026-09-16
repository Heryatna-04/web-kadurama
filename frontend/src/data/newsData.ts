export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  category: "Pemerintahan" | "Bansos" | "Kesehatan" | "Pembangunan" | "Kegiatan" | "Ekonomi";
  date: string;
  author: string;
  authorRole: string;
  readTime: string;
  summary: string;
  content: string[];
  status: "Terbit" | "Draf";
  imageUrl: string;
  tags: string[];
}

export interface AnnouncementItem {
  id: string;
  number: string;
  title: string;
  category: "Edaran Kuwu" | "Bansos" | "Kesehatan" | "Pajak PBB" | "Administrasi";
  date: string;
  validUntil: string;
  issuer: string;
  summary: string;
  content: string;
  fileSize?: string;
  isUrgent?: boolean;
}

export interface AgendaItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  dusun: "Semua Dusun" | "Dusun Manis" | "Dusun Pahing" | "Dusun Wage";
  organizer: string;
  description: string;
  status: "Akan Datang" | "Berlangsung" | "Selesai";
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "NEWS-001",
    slug: "musyawarah-rkpdes-2027",
    title: "Musyawarah Rencana Kerja Pemerintah Desa (RKPDes) Tahun 2027 Berjalan Lancar",
    category: "Pemerintahan",
    date: "12 September 2026",
    author: "Sumiati, SE",
    authorRole: "Sekretaris Desa",
    readTime: "4 menit baca",
    summary: "Kepala Desa bersama BPD dan 3 Kepala Dusun menyepakati prioritas pembangunan jalan usaha tani dan penuntasan RTLH untuk tahun depan.",
    content: [
      "Pemerintah Desa Kadurama menggelar Musyawarah Rencana Kerja Pemerintah Desa (Musrenbangdes / RKPDes) Tahun Anggaran 2027 yang bertempat di Balai Pertemuan Desa Kadurama, Dusun Manis. Musyawarah ini dihadiri oleh Kepala Desa, Ketua BPD, Lembaga Pemberdayaan Masyarakat (LPM), Ketua Tim Penggerak PKK, para Kepala Dusun (Manis, Pahing, dan Wage), serta perwakilan tokoh pemuda dan tokoh tani.",
      "Dalam sambutannya, Kepala Desa Kadurama Samir Syarifudin menekankan bahwa arah kebijakan pembangunan desa tahun 2027 tetap menitikberatkan pada dua pilar pokok: penguatan infrastruktur konektivitas pertanian antardusun dan penanganan kerentanan sosial warga miskin ekstrem secara presisi.",
      "Hasil rekapitulasi aspirasi masyarakat dari 21 RT menunjukkan kesepakatan bulat untuk memprioritaskan perkerasan jalan usaha tani di Dusun Pahing sepanjang 650 meter guna memangkas biaya angkut hasil panen padi organik, optimalisasi pipa distribusi air bersih dari mata air Cikaduran di Dusun Wage, serta alokasi stimulan bedah rumah untuk 8 unit Rumah Tidak Layak Huni (RTLH).",
      "Dokumen rancangan RKPDes 2027 yang telah disepakati ini selanjutnya akan diverifikasi oleh tim asistensi Kecamatan Ciawigebang dan Dinas Pemberdayaan Masyarakat dan Desa (DPMD) Kabupaten Kuningan sebelum disahkan menjadi Peraturan Desa (Perdes)."
    ],
    status: "Terbit",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=85",
    tags: ["RKPDes", "Musyawarah", "BPD", "Infrastruktur", "Dusun Pahing"]
  },
  {
    id: "NEWS-002",
    slug: "penyaluran-blt-dana-desa-triwulan-iii-2026",
    title: "Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Triwulan III Tepat Sasaran",
    category: "Bansos",
    date: "08 September 2026",
    author: "Ayub Suhandi",
    authorRole: "Kasi Kesejahteraan",
    readTime: "3 menit baca",
    summary: "Sebanyak 45 Keluarga Penerima Manfaat (KPM) kategori Desil 1 & 2 dari Dusun Manis, Pahing, dan Wage menerima bantuan tunai secara transparan.",
    content: [
      "Pemerintah Desa Kadurama kembali menuntaskan penyaluran program Bantuan Langsung Tunai Dana Desa (BLT-DD) untuk periode Triwulan III Tahun Anggaran 2026. Penyaluran diselenggarakan secara transparan di Aula Pertemuan Balai Desa Kadurama dengan pendampingan langsung oleh Babinsa, Bhabinkamtibmas, dan Pendamping Lokal Desa.",
      "Sebanyak 45 Keluarga Penerima Manfaat (KPM) yang tercantum dalam Surat Keputusan Kuwu telah menerima alokasi bantuan tunai sebesar Rp 300.000 per bulan, sehingga total yang diterima setiap KPM pada tahap ini adalah Rp 900.000 (Juli, Agustus, September).",
      "Kepala Dusun I (Pahing), Kepala Dusun II (Wage), dan Kepala Dusun III (Manis) bertindak sebagai verifikator lapangan guna memastikan tidak ada tumpang tindih dengan penerima Program Keluarga Harapan (PKH) atau Bantuan Pangan Non Tunai (BPNT) Kementerian Sosial.",
      "Bagi warga lansia tunggal dan penyandang disabilitas berat yang berhalangan hadir di balai desa, jajaran perangkat desa bersama perawat desa langsung mengantarkan bantuan tunai tersebut ke rumah masing-masing (door-to-door service)."
    ],
    status: "Terbit",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=85",
    tags: ["BLT Dana Desa", "Bansos", "Desil 1", "Transparansi", "Kesejahteraan"]
  },
  {
    id: "NEWS-003",
    slug: "posyandu-balita-dan-skrining-stunting-pahing",
    title: "Peningkatan Kapasitas Posyandu dan Skrining Gizi Balita Dusun Pahing",
    category: "Kesehatan",
    date: "03 September 2026",
    author: "Hj. Nina Karlina, S.ST",
    authorRole: "Bidan Desa Kadurama",
    readTime: "3 menit baca",
    summary: "Pemerintah Desa Kadurama menggencarkan penimbangan balita dan pemberian makanan tambahan guna mempertahankan zero new stunting.",
    content: [
      "Sebagai bagian dari komitmen penanganan stunting terpadu, Posyandu Melati I di Dusun Pahing menggelar kegiatan penimbangan serentak, pengukuran lingkar lengan atas, serta pemeriksaan tumbuh kembang balita dan ibu hamil.",
      "Bidan Desa Kadurama bekerja sama dengan Puskesmas Ciawigebang dan kader PKK Dusun Pahing melakukan intervensi langsung terhadap 62 balita yang hadir. Hasil pengukuran menunjukkan 98% balita berada pada kurva berat badan ideal sesuai standar Kementerian Kesehatan.",
      "Pemerintah Desa Kadurama mengalokasikan anggaran Dana Desa untuk pengadaan Pemberian Makanan Tambahan (PMT) berbasis pangan lokal bernutrisi tinggi, seperti olahan telur omega, kacang hijau, dan susu pasteurisasi dari peternakan rakyat Dusun Wage.",
      "Inisiatif jemput bola ini akan dilaksanakan bergilir setiap minggu ke Dusun Manis dan Dusun Wage agar seluruh keluarga berisiko stunting terpantau berkala."
    ],
    status: "Terbit",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=85",
    tags: ["Kesehatan", "Posyandu", "Stunting", "Dusun Pahing", "Gizi Balita"]
  },
  {
    id: "NEWS-004",
    slug: "rehabilitasi-drainase-pemukiman-dusun-wage",
    title: "Rehabilitasi Drainase Lingkungan Dusun Wage Memasuki Tahap Penyelesaian",
    category: "Pembangunan",
    date: "28 Agustus 2026",
    author: "Jumadi",
    authorRole: "Kaur Perencanaan",
    readTime: "4 menit baca",
    summary: "Pembangunan saluran drainase sepanjang 320 meter di Dusun Wage berhasil menuntaskan masalah limpasan air saat musim hujan di perbukitan.",
    content: [
      "Pekerjaan fisik pembangunan saluran drainase lingkungan permukiman di Dusun Wage RT 02 dan RT 04 telah mencapai progres 92%. Proyek infrastruktur yang bersumber dari Dana Desa Tahap II ini menelan biaya Rp 84.500.000 dan dikerjakan secara swakelola padat karya oleh warga setempat.",
      "Pembangunan drainase beton bertulang sepanjang 320 meter ini dirancang khusus untuk mengendalikan limpasan air permukaan dari lereng perbukitan Ciremai yang kerap mengikis bahu jalan desa ketika curah hujan tinggi.",
      "Kepala Dusun Wage, Bpk. Andri Rukmana, menyampaikan rasa syukur masyarakat setempat atas realisasi drainase ini karena dapat melindungi pemukiman warga dari genangan air sekaligus mengalirkan buangan air ke saluran irigasi tersier persawahan.",
      "Pemerintah Desa menargetkan serah terima pekerjaan (PHO) dan pelaporan pertanggungjawaban fisik pada pertengahan September 2026."
    ],
    status: "Terbit",
    imageUrl: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=1200&q=85",
    tags: ["Pembangunan", "Drainase", "Dusun Wage", "Dana Desa", "Padat Karya"]
  },
  {
    id: "NEWS-005",
    slug: "pelatihan-digital-marketing-umkm-ubi-kuningan",
    title: "Pelatihan Keterampilan Digital dan Pembukuan Bagi Pengrajin Olahan Ubi Kuningan",
    category: "Ekonomi",
    date: "22 Agustus 2026",
    author: "Hendri Pratama, S.E",
    authorRole: "Pendamping Desa Ciawigebang",
    readTime: "5 menit baca",
    summary: "Sebanyak 25 pelaku UMKM Desa Kadurama mendapatkan pelatihan pemasaran digital dan integrasi barcode QRIS untuk ekspansi usaha.",
    content: [
      "BUMDes Bina Mandiri Desa Kadurama bersama Dinas Koperasi, UKM, Perdagangan dan Perindustrian (Diskopdagperin) Kabupaten Kuningan menyelenggarakan lokakarya 'Akselerasi Digital UMKM Olahan Pangan Desa' di Gedung Serbaguna Dusun Manis.",
      "Pelatihan intensif ini diikuti oleh 25 perwakilan pelaku usaha mikro produsen keripik ubi manis, getuk goreng, opak rengginang, dan kerupuk aci khas Kadurama. Materi yang disampaikan mencakup teknik fotografi produk menggunakan smartphone, pembuatan toko daring, serta pencatatan kas digital sederhana.",
      "Selain materi teoritis, seluruh peserta langsung didaftarkan pada sistem pembayaran non-tunai QRIS melalui perbankan daerah guna mempermudah transaksi dengan wisatawan yang berkunjung ke kawasan Kuningan.",
      "Ketua BUMDes Bina Mandiri menyatakan siap menampung dan mengemas produk olahan pangan warga dengan merek kolektif 'Kadurama Asri' untuk dipasarkan di pusat oleh-oleh modern."
    ],
    status: "Terbit",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
    tags: ["UMKM", "BUMDes", "Ekonomi Desa", "Ubi Manis", "Pelatihan Digital"]
  },
  {
    id: "NEWS-006",
    slug: "panen-raya-padi-organik-dusun-pahing",
    title: "Panen Raya Padi Organik Dusun Pahing Catat Produktivitas 7,2 Ton per Hektar",
    category: "Kegiatan",
    date: "18 Agustus 2026",
    author: "Trida Sentosa",
    authorRole: "Kepala Dusun I Pahing",
    readTime: "3 menit baca",
    summary: "Kelompok Tani Sri Mukti Dusun Pahing membuktikan keunggulan pupuk hayati mandiri dengan hasil panen gabah kering panen yang melimpah.",
    content: [
      "Kelompok Tani Sri Mukti di Dusun Pahing sukses melaksanakan Panen Raya Padi Organik Varietas Inpari 32 di atas hamparan sawah seluas 15 hektar. Hasil ubinan yang dilakukan bersama petugas Penyuluh Pertanian Lapangan (PPL) menunjukkan produktivitas rata-rata mencapai 7,2 ton Gabah Kering Panen (GKP) per hektar.",
      "Capaian ini melampaui hasil panen musim tanam sebelumnya yang hanya mencapai 6,1 ton per hektar. Keberhasilan ini didukung oleh pemanfaatan pupuk organik cair dan mikroba hayati yang diproduksi secara mandiri menggunakan kotoran ternak sapi Dusun Wage.",
      "Sistem irigasi teknis yang mengalir tanpa henti dari hulu sungai Kadurama turut menjaga suplai air sawah tetap stabil selama masa vegetatif dan generatif tanaman.",
      "Bupati Kuningan melalui perwakilan Dinas Ketahanan Pangan dan Pertanian memberikan apresiasi tinggi kepada para petani Desa Kadurama yang konsisten mengadopsi pertanian ramah lingkungan."
    ],
    status: "Terbit",
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=85",
    tags: ["Panen Raya", "Pertanian Organik", "Dusun Pahing", "Kelompok Tani", "Ketahanan Pangan"]
  }
];

export const ANNOUNCEMENTS_LIST: AnnouncementItem[] = [
  {
    id: "PENG-001",
    number: "140/084/Pemdes/IX/2026",
    title: "Jadwal Pelunasan dan Verifikasi Lapangan PBB-P2 Tahun Pajak 2026",
    category: "Pajak PBB",
    date: "10 September 2026",
    validUntil: "30 September 2026",
    issuer: "Sekretariat Desa Kadurama",
    summary: "Dihimbau kepada seluruh Wajib Pajak Desa Kadurama agar segera menyelesaikan kewajiban PBB-P2 sebelum jatuh tempo akhir September 2026.",
    content: "Berdasarkan Peraturan Daerah Kabupaten Kuningan tentang Pajak Daerah, diberitahukan kepada seluruh wajib pajak di wilayah Dusun Manis, Dusun Pahing, dan Dusun Wage bahwa masa pembayaran PBB-P2 buku 1 & 2 akan berakhir pada 30 September 2026. Pembayaran dapat diserahkan langsung kepada kolektor kadus masing-masing atau melalui loket pelayanan Balai Desa Kadurama setiap hari kerja pukul 08.00 - 14.00 WIB.",
    fileSize: "1.2 MB (PDF)",
    isUrgent: true
  },
  {
    id: "PENG-002",
    number: "440/091/Pkm/IX/2026",
    title: "Pelaksanaan Pekan Imunisasi Nasional (PIN) Polio Tambahan",
    category: "Kesehatan",
    date: "05 September 2026",
    validUntil: "20 September 2026",
    issuer: "Pustu Desa Kadurama & Puskesmas Ciawigebang",
    summary: "Pemberian tetes manis imunisasi polio gratis bagi seluruh balita usia 0 s.d. 59 bulan di 3 posyandu dusun.",
    content: "Dalam rangka mempertahankan status eliminasi polio, Dinas Kesehatan Kabupaten Kuningan melalui Pustu Desa Kadurama menyelenggarakan Sub PIN Polio serentak. Posyandu Melati I (Pahing): 15 September, Posyandu Melati II (Wage): 16 September, dan Posyandu Balai Desa (Manis): 17 September. Warga diwajibkan membawa Buku KIA/KMS.",
    fileSize: "850 KB (PDF)",
    isUrgent: false
  },
  {
    id: "PENG-003",
    number: "141/102/Perdes/VIII/2026",
    title: "Pendaftaran Calon Anggota Badan Permusyawaratan Desa (BPD) Periode 2026-2032",
    category: "Edaran Kuwu",
    date: "25 Agustus 2026",
    validUntil: "15 Oktober 2026",
    issuer: "Panitia Pengisian BPD Desa Kadurama",
    summary: "Membuka kesempatan kepada putra-putri terbaik Desa Kadurama untuk mendaftarkan diri sebagai wakil wilayah dusun.",
    content: "Panitia Pengisian Anggota BPD Desa Kadurama membuka pendaftaran calon anggota BPD untuk kuota keterwakilan wilayah Dusun Manis (2 orang), Dusun Pahing (2 orang), Dusun Wage (2 orang), dan kuota keterwakilan perempuan (1 orang). Formulir persyaratan dan berkas administrasi dapat diambil di Sekretariat Balai Desa.",
    fileSize: "2.4 MB (PDF)",
    isUrgent: false
  }
];

export const AGENDA_LIST: AgendaItem[] = [
  {
    id: "AGD-001",
    title: "Rapat Koordinasi Evaluasi APBDes Triwulan III Bersama BPD",
    date: "18 September 2026",
    time: "09.00 - 12.00 WIB",
    location: "Ruang Rapat Utama Balai Desa Kadurama",
    dusun: "Dusun Manis",
    organizer: "Pemerintah Desa & BPD",
    description: "Pembahasan realisasi belanja operasional, serapan anggaran pembangunan fisik saluran drainase, dan monitoring penerima bansos BLT-DD.",
    status: "Akan Datang"
  },
  {
    id: "AGD-002",
    title: "Kerja Bakti Massal Normalisasi Saluran Irigasi Tersier Cikaduran",
    date: "21 September 2026",
    time: "07.00 - 11.00 WIB",
    location: "Bantaran Saluran Irigasi Blok Sawah Kidul",
    dusun: "Dusun Pahing",
    organizer: "Gapoktan Sri Mukti & Karang Taruna",
    description: "Pembersihan sedimentasi lumpur dan rumput liar di saluran tersier guna menyongsong musim tanam rendeng Oktober 2026.",
    status: "Akan Datang"
  },
  {
    id: "AGD-003",
    title: "Posyandu Balita & Posbindu Lansia Terpadu Dusun Wage",
    date: "24 September 2026",
    time: "08.30 - 12.00 WIB",
    location: "Poskesdes Dusun Wage",
    dusun: "Dusun Wage",
    organizer: "Kader Posyandu Melati II & Bidan Desa",
    description: "Penimbangan balita, imunisasi rutin, pengukuran tensi darah lansia, serta pemeriksaan kadar gula dan kolesterol gratis.",
    status: "Akan Datang"
  },
  {
    id: "AGD-004",
    title: "Pelatihan Pengemasan & Sertifikasi Halal Produk UMKM Keripik Ubi",
    date: "28 September 2026",
    time: "08.30 - 15.30 WIB",
    location: "Aula Serbaguna BUMDes Bina Mandiri",
    dusun: "Dusun Manis",
    organizer: "BUMDes Bina Mandiri & Dinas Perdagangan",
    description: "Pendampingan pendaftaran Sertifikat Halal Self-Declare gratis bagi 30 pengrajin olahan ubi jalar Kadurama.",
    status: "Akan Datang"
  }
];
