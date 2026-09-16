export interface DusunDetail {
  slug: "manis" | "pahing" | "wage";
  number: string;
  name: string;
  titleTag: string;
  tagline: string;
  elevation: string;
  areaHa: string;
  kkCount: number;
  residentCount: number;
  villageShare: string;
  rtRwInfo: string;
  kadusName: string;
  kadusNip?: string;
  kadusPhone: string;
  photoUrl: string;
  kadusPhotoUrl: string;
  description: string;
  quote?: string;
  coordinates: string;
  potentials: {
    title: string;
    category: string;
    desc: string;
    metric: string;
    metricLabel: string;
  }[];
  facilities: {
    name: string;
    category: string;
    address: string;
    coords: string;
  }[];
}

export const DUSUN_DETAILS: Record<"manis" | "pahing" | "wage", DusunDetail> = {
  pahing: {
    slug: "pahing",
    number: "Dusun I",
    name: "Dusun Pahing",
    titleTag: "Lumbung Ketahanan Pangan & Olahraga",
    tagline: "Hamparan Sawah Padi Terpadu, Lapangan Sepakbola & Kompleks Pendidikan Dasar",
    elevation: "310 mdpl",
    areaHa: "27 Ha",
    kkCount: 260,
    residentCount: 826,
    villageShare: "33.3%",
    rtRwInfo: "3 RT / 1 RW",
    kadusName: "Trida Sentosa",
    kadusPhone: "083861181402",
    photoUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=85",
    kadusPhotoUrl: "/default-avatar.svg",
    description:
      "Dusun Pahing merupakan dusun pertama di Desa Kadurama dengan luas wilayah kurang lebih 27 hektar. Memiliki 3 RT dan 1 RW, wilayah ini menaungi lumbung pangan padi sawah desa, lapangan sepakbola kebanggaan warga (Gelora Kadurama), sarana ibadah 2 mushola, institusi pendidikan Sekolah Dasar (SD) dan Taman Kanak-Kanak (TK), serta Posyandu.",
    coordinates: "-6.9785, 108.6020",
    potentials: [
      {
        title: "Lapangan Sepakbola & Olahraga",
        category: "Kepemudaan & Olahraga",
        desc: "Fasilitas olahraga terbuka untuk kompetisi antar-dusun, pembinaan SSB anak desa, dan kegiatan senam warga.",
        metric: "1 Lapangan",
        metricLabel: "Gelora Kadurama",
      },
      {
        title: "Pendidikan Dasar SD & TK",
        category: "Pendidikan Anak Desa",
        desc: "Layanan pendidikan terpadu tingkat Sekolah Dasar (SD) dan Taman Kanak-Kanak (TK) bagi putra-putri desa.",
        metric: "SD & TK",
        metricLabel: "Gedung Sekolah Terpadu",
      },
      {
        title: "Sarana Ibadah 2 Mushola & Posyandu",
        category: "Sosial & Kesehatan",
        desc: "2 unit mushola peribadatan warga dan posyandu aktif siaga pemantauan kesehatan keluarga.",
        metric: "2 Mushola + 1 Posyandu",
        metricLabel: "Layanan Sosial Aktif",
      },
    ],
    facilities: [
      {
        name: "Lapangan Sepakbola Gelora Kadurama",
        category: "Olahraga",
        address: "Jl. Lapang Pemuda Dusun Pahing RT 02 / RW 01",
        coords: "-6.9790, 108.6015",
      },
      {
        name: "Gedung Sekolah Dasar (SD)",
        category: "Pendidikan",
        address: "Kompleks Pendidikan Dusun Pahing RT 01 / RW 01",
        coords: "-6.9782, 108.6018",
      },
      {
        name: "Taman Kanak-Kanak (TK)",
        category: "Pendidikan",
        address: "Jl. Tunas Mandiri Dusun Pahing RT 01 / RW 01",
        coords: "-6.9784, 108.6019",
      },
      {
        name: "Mushola Al-Ikhlas (Mushola 1)",
        category: "Tempat Ibadah",
        address: "Blok Pahing RT 01 / RW 01",
        coords: "-6.9786, 108.6022",
      },
      {
        name: "Mushola Nurul Huda (Mushola 2)",
        category: "Tempat Ibadah",
        address: "Blok Pahing RT 03 / RW 01",
        coords: "-6.9788, 108.6025",
      },
      {
        name: "Posyandu Dusun Pahing",
        category: "Kesehatan",
        address: "Balai Warga Dusun Pahing RT 02 / RW 01",
        coords: "-6.9785, 108.6020",
      },
    ],
  },
  wage: {
    slug: "wage",
    number: "Dusun II",
    name: "Dusun Wage",
    titleTag: "Zona Konservasi Air & Religi",
    tagline: "Sumber Mata Air Purba Cikaduran 45 L/dtk, Masjid, Mushola, Pesantren & PAUD",
    elevation: "340 mdpl",
    areaHa: "23 Ha",
    kkCount: 260,
    residentCount: 822,
    villageShare: "33.1%",
    rtRwInfo: "2 RT / 1 RW",
    kadusName: "Andri Rukmana",
    kadusPhone: "089667736184",
    photoUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85",
    kadusPhotoUrl: "/default-avatar.svg",
    description:
      "Dusun Wage merupakan dusun kedua di Desa Kadurama dengan luas wilayah kurang lebih 23 hektar. Terdiri dari 2 RT dan 1 RW di kontur sejuk lereng timur Gunung Ciremai. Wilayah ini memiliki sarana ibadah 1 masjid dan 1 mushola, institusi pendidikan keagamaan Pondok Pesantren, gedung PAUD, layanan Posyandu, serta sumber daya alam abadi Mata Air Alami Cikaduran berdebit 45 liter per detik.",
    coordinates: "-6.9825, 108.5955",
    potentials: [
      {
        title: "Pondok Pesantren & PAUD",
        category: "Pendidikan Karakter & Agama",
        desc: "Lembaga pondok pesantren santri dan pendidikan anak usia dini (PAUD) untuk tumbuh kembang anak desa.",
        metric: "Pesantren & PAUD",
        metricLabel: "Lembaga Pendidikan Aktif",
      },
      {
        title: "Sarana Ibadah Masjid & Mushola",
        category: "Kehidupan Religi",
        desc: "1 masjid utama sholat berjamaah warga serta 1 mushola lingkungan yang makmur oleh kegiatan keagamaan.",
        metric: "1 Masjid + 1 Mushola",
        metricLabel: "Fasilitas Peribadatan",
      },
      {
        title: "Mata Air Cikaduran & Posyandu",
        category: "Konservasi & Kesehatan",
        desc: "Mata air alami pegunungan berdebit 45 L/dtk dan posyandu siaga kesehatan balita serta lansia.",
        metric: "45 L/dtk",
        metricLabel: "Debit Lestari Konstan",
      },
    ],
    facilities: [
      {
        name: "Masjid Baiturrahman Dusun Wage",
        category: "Tempat Ibadah",
        address: "Jl. Poros Dusun Wage RT 01 / RW 01",
        coords: "-6.9822, 108.5958",
      },
      {
        name: "Mushola Al-Barokah Dusun Wage",
        category: "Tempat Ibadah",
        address: "Lingkungan RT 02 / RW 01 Dusun Wage",
        coords: "-6.9824, 108.5956",
      },
      {
        name: "Pondok Pesantren Dusun Wage",
        category: "Pendidikan Agama",
        address: "Kompleks Pesantren Dusun Wage RT 01 / RW 01",
        coords: "-6.9828, 108.5952",
      },
      {
        name: "Gedung PAUD Dusun Wage",
        category: "Pendidikan Usia Dini",
        address: "Jl. Melati Dusun Wage RT 02 / RW 01",
        coords: "-6.9821, 108.5959",
      },
      {
        name: "Posyandu Dusun Wage",
        category: "Kesehatan",
        address: "Balai Warga Dusun Wage RT 02 / RW 01",
        coords: "-6.9818, 108.5950",
      },
      {
        name: "Hulu Konservasi Mata Air Cikaduran",
        category: "Konservasi",
        address: "Blok Hulu Cikaduran RT 01 Dusun Wage",
        coords: "-6.9825, 108.5955",
      },
    ],
  },
  manis: {
    slug: "manis",
    number: "Dusun III",
    name: "Dusun Manis",
    titleTag: "Sentra Pemerintahan & Lembaga Layanan",
    tagline: "Pusat Pelayanan Publik, Kantor Urusan Agama (KUA), SD, Pesantren & 4 Mushola",
    elevation: "285 mdpl",
    areaHa: "39 Ha",
    kkCount: 288,
    residentCount: 833,
    villageShare: "33.6%",
    rtRwInfo: "3 RT / 1 RW",
    kadusName: "Jamaludin",
    kadusPhone: "08314407775",
    photoUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=85",
    kadusPhotoUrl: "/default-avatar.svg",
    description:
      "Dusun Manis merupakan dusun ketiga di Desa Kadurama dengan wilayah terluas yaitu kurang lebih 39 hektar. Terdiri dari 3 RT dan 1 RW, dusun ini menjadi sentra pelayanan publik dan institusi penting: Kantor Urusan Agama (KUA), Kantor Balai Desa, gedung Sekolah Dasar (SD), 1 Pondok Pesantren, 4 unit mushola peribadatan, serta Posyandu.",
    coordinates: "-6.9755, 108.5980",
    potentials: [
      {
        title: "Kantor Urusan Agama (KUA) & Balai Desa",
        category: "Administrasi & Layanan Publik",
        desc: "Pusat pelayanan pencatatan nikah, administrasi desa, dan koordinasi pemerintahan terpadu.",
        metric: "KUA & Balai Desa",
        metricLabel: "Pusat Layanan Strategis",
      },
      {
        title: "Pendidikan Sekolah Dasar (SD) & Pesantren",
        category: "Pendidikan Terpadu",
        desc: "Sekolah Dasar (SD) negeri serta 1 pondok pesantren pembinaan keagamaan santri generasi muda.",
        metric: "1 SD + 1 Pesantren",
        metricLabel: "Institusi Pendidikan",
      },
      {
        title: "Jaringan 4 Mushola & Posyandu",
        category: "Peribadatan & Kesehatan",
        desc: "4 unit mushola lingkungan warga dan posyandu terpadu untuk pemantauan gizi dan kesehatan warga.",
        metric: "4 Mushola",
        metricLabel: "Sarana Ibadah Lingkungan",
      },
    ],
    facilities: [
      {
        name: "Kantor Urusan Agama (KUA)",
        category: "Pelayanan Publik",
        address: "Jl. Desa Kadurama RT 01 / RW 01 Dusun Manis",
        coords: "-6.9754, 108.5982",
      },
      {
        name: "Gedung Sekolah Dasar (SDN 1 Kadurama)",
        category: "Pendidikan",
        address: "Kompleks Pendidikan Dusun Manis RT 02 / RW 01",
        coords: "-6.9752, 108.5976",
      },
      {
        name: "Pondok Pesantren Dusun Manis",
        category: "Pendidikan Agama",
        address: "Jl. Balai Desa RT 02 / RW 01 Dusun Manis",
        coords: "-6.9756, 108.5978",
      },
      {
        name: "Mushola Al-Falah (Mushola 1)",
        category: "Tempat Ibadah",
        address: "Blok Manis RT 01 / RW 01",
        coords: "-6.9757, 108.5981",
      },
      {
        name: "Mushola Baitul Muttaqin (Mushola 2)",
        category: "Tempat Ibadah",
        address: "Blok Manis RT 02 / RW 01",
        coords: "-6.9759, 108.5984",
      },
      {
        name: "Mushola Nurul Iman (Mushola 3)",
        category: "Tempat Ibadah",
        address: "Blok Manis RT 03 / RW 01",
        coords: "-6.9753, 108.5975",
      },
      {
        name: "Mushola Al-Huda (Mushola 4)",
        category: "Tempat Ibadah",
        address: "Jl. Poros Balai Desa RT 01 / RW 01 Dusun Manis",
        coords: "-6.9750, 108.5972",
      },
      {
        name: "Posyandu Dusun Manis",
        category: "Kesehatan",
        address: "Balai Warga RT 03 / RW 01 Dusun Manis",
        coords: "-6.9758, 108.5983",
      },
    ],
  },
};

export interface LandAllocationItem {
  kategori: string;
  nama: string;
  areaHa: number;
  formattedHa: string;
  keterangan: string;
  tipe: "tkd" | "hak_milik";
}

export interface KeadaanWilayahDesa {
  totalLuasHa: number;
  catatanTotal: string;
  jenisTanah: {
    jenis: string;
    luasHa: number;
    persen: string;
    deskripsi: string;
  }[];
  peruntukanTanah: LandAllocationItem[];
}

export const KEADAAN_WILAYAH_KADURAMA: KeadaanWilayahDesa = {
  totalLuasHa: 89.0,
  catatanTotal: "Termasuk tanah perhutani",
  jenisTanah: [
    {
      jenis: "Tanah Sawah",
      luasHa: 42.0,
      persen: "47.2%",
      deskripsi: "Sawah irigasi teknis, setengah teknis & tadah hujan produktif",
    },
    {
      jenis: "Tanah Darat",
      luasHa: 47.0,
      persen: "52.8%",
      deskripsi: "Permukiman hunian, tegalan, pekarangan warga & fasilitas umum desa",
    },
  ],
  peruntukanTanah: [
    {
      kategori: "Tanah Kas Desa (TKD)",
      nama: "Luas Tanah Ex Bengkok",
      areaHa: 11.076,
      formattedHa: "11,076 Ha",
      keterangan: "Tanah kas desa eks-bengkok pamong desa",
      tipe: "tkd",
    },
    {
      kategori: "Tanah Kas Desa (TKD)",
      nama: "Luas Tanah Kuburan",
      areaHa: 1.0,
      formattedHa: "1,000 Ha",
      keterangan: "Tempat pemakaman umum (TPU) warga desa",
      tipe: "tkd",
    },
    {
      kategori: "Tanah Kas Desa (TKD)",
      nama: "Luas TKD Lainnya",
      areaHa: 0.96,
      formattedHa: "0,960 Ha",
      keterangan: "Digunakan untuk gedung balai desa, gedung sekolah, lapang olahraga, dan gedung/fasilitas umum lainnya",
      tipe: "tkd",
    },
    {
      kategori: "Tanah Hak Milik Warga",
      nama: "Tanah Sawah Hak Milik",
      areaHa: 10.5,
      formattedHa: "10,500 Ha",
      keterangan: "Sawah produktif bersertifikat hak milik warga desa",
      tipe: "hak_milik",
    },
    {
      kategori: "Tanah Hak Milik Warga",
      nama: "Tanah Darat / Tegalan Hak Milik",
      areaHa: 23.0,
      formattedHa: "23,000 Ha",
      keterangan: "Lahan tegalan, kebun produktif & palawija milik warga",
      tipe: "hak_milik",
    },
    {
      kategori: "Tanah Hak Milik Warga",
      nama: "Tanah Permukiman / Pekarangan",
      areaHa: 45.0,
      formattedHa: "45,000 Ha",
      keterangan: "Area tapak permukiman perumahan dan pekarangan tempat tinggal warga",
      tipe: "hak_milik",
    },
  ],
};
