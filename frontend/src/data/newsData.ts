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

// Data Contoh Uji Coba Berita (Bukan Berita Ril - Hanya Teks Pengujian Layout & Antarmuka)
export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "NEWS-001",
    slug: "contoh-berita-1",
    title: "Contoh Berita 1",
    category: "Pemerintahan",
    date: "17 September 2026",
    author: "Operator Desa",
    authorRole: "Staf Administrasi",
    readTime: "2 menit baca",
    summary: "Ini adalah ringkasan contoh berita 1 untuk pengujian tata letak dan kartu warta resmi sistem informasi Desa Kadurama.",
    content: [
      "Ini adalah paragraf pengujian contoh berita 1. Konten ini disediakan khusus sebagai data simulasi tampilan warta desa sebelum artikel berita ril diinputkan oleh perangkat desa yang bertugas.",
      "Melalui pengujian sistem informasi publik Desa Kadurama ini, tata letak judul, badge kategori, dan gambar unggulan dipastikan tersaji seragam di berbagai resolusi layar (laptop, tablet, dan smartphone)."
    ],
    status: "Terbit",
    imageUrl: "/dusun-manis.jpg",
    tags: ["Uji Coba", "Contoh", "Berita 1"]
  },
  {
    id: "NEWS-002",
    slug: "contoh-berita-2",
    title: "Contoh Berita 2",
    category: "Pembangunan",
    date: "16 September 2026",
    author: "Operator Desa",
    authorRole: "Staf Administrasi",
    readTime: "2 menit baca",
    summary: "Ini adalah ringkasan contoh berita 2 untuk pengujian navigasi kategori dan halaman detail warta desa.",
    content: [
      "Ini adalah paragraf pengujian contoh berita 2. Teks ini digunakan untuk memeriksa format konten multialinea serta konsistensi tipografi sans-serif pada portal informasi desa.",
      "Pamong atau operator balai desa dapat mengubah isi berita ini, mengganti foto unggulan, atau menghapusnya secara langsung melalui Panel Data Center (/master)."
    ],
    status: "Terbit",
    imageUrl: "/dusun-pahing.jpg",
    tags: ["Uji Coba", "Contoh", "Berita 2"]
  },
  {
    id: "NEWS-003",
    slug: "contoh-berita-3",
    title: "Contoh Berita 3",
    category: "Kesehatan",
    date: "15 September 2026",
    author: "Operator Desa",
    authorRole: "Staf Administrasi",
    readTime: "2 menit baca",
    summary: "Ini adalah ringkasan contoh berita 3 untuk pengujian penyaringan kategori warta bidang kesehatan warga.",
    content: [
      "Ini adalah paragraf pengujian contoh berita 3. Bagian ini berfungsi untuk memastikan fitur filter kategori artikel berjalan dengan lancar saat diakses oleh warga masyarakat.",
      "Foto unggulan artikel telah diseragamkan dengan rasio baku 16:9 agar tidak terpotong atau mengalami distorsi visual pada kartu berita."
    ],
    status: "Terbit",
    imageUrl: "/dusun-wage.jpg",
    tags: ["Uji Coba", "Contoh", "Berita 3"]
  },
  {
    id: "NEWS-004",
    slug: "contoh-berita-4",
    title: "Contoh Berita 4",
    category: "Ekonomi",
    date: "14 September 2026",
    author: "Operator Desa",
    authorRole: "Staf Administrasi",
    readTime: "2 menit baca",
    summary: "Ini adalah ringkasan contoh berita 4 untuk menguji tampilan grid warta pada layar desktop dan seluler.",
    content: [
      "Ini adalah paragraf pengujian contoh berita 4. Artikel uji coba ini disiapkan guna memvalidasi kecepatan muat halaman dan responsivitas kartu berita.",
      "Semua berita uji coba ini dapat diperbarui oleh jajaran pamong sesuai dengan agenda kegiatan riil kemasyarakatan dan program BUMDes di kemudian hari."
    ],
    status: "Terbit",
    imageUrl: "/dusun-manis.jpg",
    tags: ["Uji Coba", "Contoh", "Berita 4"]
  },
  {
    id: "NEWS-005",
    slug: "contoh-berita-5",
    title: "Contoh Berita 5",
    category: "Kegiatan",
    date: "13 September 2026",
    author: "Operator Desa",
    authorRole: "Staf Administrasi",
    readTime: "2 menit baca",
    summary: "Ini adalah ringkasan contoh berita 5 untuk menguji fungsi pencarian berita dan tagar terkait.",
    content: [
      "Ini adalah paragraf pengujian contoh berita 5. Menguji fungsi pencarian kata kunci dan pratinjau cuplikan artikel warta resmi.",
      "Setelah tahapan pelatihan pamong selesai, artikel contoh ini dapat diganti dengan warta kegiatan riil Desa Kadurama secara berkala."
    ],
    status: "Terbit",
    imageUrl: "/dusun-pahing.jpg",
    tags: ["Uji Coba", "Contoh", "Berita 5"]
  }
];

// Data Contoh Uji Coba Pengumuman Resmi (Minimal 1 Pengumuman)
export const ANNOUNCEMENTS_LIST: AnnouncementItem[] = [
  {
    id: "PENG-001",
    number: "001/TEST/Pemdes/IX/2026",
    title: "Contoh Pengumuman 1",
    category: "Edaran Kuwu",
    date: "17 September 2026",
    validUntil: "30 September 2026",
    issuer: "Pemerintah Desa Kadurama",
    summary: "Ini adalah contoh ringkasan pengumuman resmi 1 untuk pengujian tata letak papan informasi balai desa.",
    content: "Ini adalah isi teks contoh pengumuman 1. Surat edaran resmi dari Kuwu atau Sekretariat Desa dapat diterbitkan di sini lengkap dengan nomor registrasi surat, masa berlaku pengumuman, serta lampiran dokumen PDF resmi.",
    fileSize: "1.2 MB (PDF)",
    isUrgent: true
  },
  {
    id: "PENG-002",
    number: "002/TEST/Pemdes/IX/2026",
    title: "Contoh Pengumuman 2",
    category: "Administrasi",
    date: "15 September 2026",
    validUntil: "15 Oktober 2026",
    issuer: "Sekretariat Desa Kadurama",
    summary: "Ini adalah contoh ringkasan pengumuman resmi 2 untuk pengujian modul pengumuman berkas warga.",
    content: "Ini adalah isi teks contoh pengumuman 2. Berfungsi untuk menyosialisasikan jadwal administrasi surat menyurat dan pelayanan kantor desa kepada warga di Dusun Manis, Dusun Pahing, dan Dusun Wage.",
    fileSize: "850 KB (PDF)",
    isUrgent: false
  }
];

// Data Contoh Uji Coba Agenda Kegiatan Desa (Minimal 1 Agenda)
export const AGENDA_LIST: AgendaItem[] = [
  {
    id: "AGD-001",
    title: "Contoh Agenda Kegiatan 1",
    date: "20 September 2026",
    time: "09.00 - 11.30 WIB",
    location: "Balai Desa Kadurama",
    dusun: "Semua Dusun",
    organizer: "Pemerintah Desa Kadurama",
    description: "Ini adalah deskripsi contoh agenda kegiatan 1 untuk pengujian modul kalender acara dan musyawarah warga.",
    status: "Akan Datang"
  },
  {
    id: "AGD-002",
    title: "Contoh Agenda Kegiatan 2",
    date: "25 September 2026",
    time: "08.00 - 10.30 WIB",
    location: "Pos Balai Dusun Pahing",
    dusun: "Dusun Pahing",
    organizer: "Kepala Dusun & Warga",
    description: "Ini adalah deskripsi contoh agenda kegiatan 2 untuk pengujian filter acara berbasis dusun pada portal desa.",
    status: "Akan Datang"
  }
];
