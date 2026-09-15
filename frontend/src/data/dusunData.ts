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
  quote: string;
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
  manis: {
    slug: "manis",
    number: "Dusun I",
    name: "Dusun Manis",
    titleTag: "Sentra Pemerintahan & Pelayanan Publik",
    tagline: "Pusat Koordinasi Administrasi Balai Desa, Layanan Medis Siaga & Sentra Olahan Pangan",
    elevation: "285 mdpl",
    areaHa: "38.5 Ha",
    kkCount: 184,
    residentCount: 620,
    villageShare: "37.4%",
    rtRwInfo: "8 RT / 2 RW",
    kadusName: "Ahmad Dahlan",
    kadusNip: "19820514 200801 1 007",
    kadusPhone: "+62 821-1122-3341",
    photoUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=85",
    kadusPhotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    description:
      "Dusun Manis merupakan pintu gerbang utama Desa Kadurama yang menjadi pusat aktivitas administrasi pemerintahan dan pelayanan warga. Di wilayah ini berdiri Kantor Balai Desa Kadurama, Puskesmas Pembantu (Pustu) 24 jam, gedung sekolah dasar SDN 1 Kadurama, serta sentra UMKM warga yang memproduksi aneka olahan pangan khas seperti keripik ubi jalar dan rengginang ketan.",
    quote:
      "Pelayanan administrasi warga Dusun Manis kami pastikan cepat, ramah, dan tertib dokumen tanpa membebani warga.",
    coordinates: "-6.9755, 108.5980",
    potentials: [
      {
        title: "Pusat Layanan Terpadu Balai Desa",
        category: "Administrasi Publik",
        desc: "Loket pelayanan administrasi kependudukan, pengurusan surat pengantar, dan aula musyawarah desa.",
        metric: "100%",
        metricLabel: "Digitalisasi SIAK Desa",
      },
      {
        title: "Sentra UMKM Olahan Pangan Ketan & Ubi",
        category: "Ekonomi Kerakyatan",
        desc: "Klaster rumah tangga produktif produsen keripik ubi madu, rengginang beras ketan, dan sale pisang.",
        metric: "28 Unit",
        metricLabel: "UMKM Rumah Tangga",
      },
      {
        title: "Puskesmas Pembantu (Pustu) & Posyandu",
        category: "Kesehatan Warga",
        desc: "Layanan medis siaga pertama, penimbangan balita rutin, dan pemantauan gizi ibu hamil Dusun Manis.",
        metric: "0 Kasus",
        metricLabel: "Zero Stunting Terjaga",
      },
    ],
    facilities: [
      {
        name: "Kantor Balai Desa & Pendopo Kadurama",
        category: "Pemerintahan",
        address: "Jl. Desa Kadurama No. 01, Dusun Manis",
        coords: "-6.9755, 108.5980",
      },
      {
        name: "Puskesmas Pembantu (Pustu) Kadurama",
        category: "Kesehatan",
        address: "Jl. Balai Desa RT 03 Dusun Manis",
        coords: "-6.9758, 108.5983",
      },
      {
        name: "Gedung SDN 1 Kadurama",
        category: "Pendidikan",
        address: "Kompleks Pendidikan Dusun Manis",
        coords: "-6.9752, 108.5976",
      },
      {
        name: "Gerai BUMDes Bina Mandiri",
        category: "Perekonomian",
        address: "Jl. Raya Ciawigebang Kadurama RT 01",
        coords: "-6.9760, 108.5988",
      },
    ],
  },
  pahing: {
    slug: "pahing",
    number: "Dusun II",
    name: "Dusun Pahing",
    titleTag: "Lumbung Ketahanan Pangan & Olahraga",
    tagline: "Hamparan 64 Hektar Sawah Padi Organik, Irigasi Cisanggarung & Stadion Gelora Kadurama",
    elevation: "310 mdpl",
    areaHa: "64.0 Ha",
    kkCount: 172,
    residentCount: 598,
    villageShare: "36.0%",
    rtRwInfo: "7 RT / 2 RW",
    kadusName: "Rohmat Hidayat",
    kadusNip: "19850912 201002 1 004",
    kadusPhone: "+62 821-1122-3342",
    photoUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=85",
    kadusPhotoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80",
    description:
      "Dusun Pahing adalah benteng ketahanan pangan Desa Kadurama dengan hamparan 64 hektar sawah produktif. Menggunakan sistem irigasi teknis teratur dan pemupukan organik, kawasan ini mampu menghasilkan panen gabah berkualitas tinggi hingga 3 kali setahun. Dusun Pahing juga menjadi pusat pembinaan kepemudaan dengan adanya Lapangan Sepakbola Gelora Kadurama.",
    quote:
      "Kami menjaga kelestarian sawah irigasi Dusun Pahing agar tetap menjadi lumbung pangan kebanggaan warga Kadurama.",
    coordinates: "-6.9785, 108.6020",
    potentials: [
      {
        title: "Lumbung Padi Organik Terpadu",
        category: "Pertanian Berkelanjutan",
        desc: "Sawah produktif dengan varietas unggul lokal dan metode pertanian ramah lingkungan tanpa pestisida kimia.",
        metric: "64 Hektar",
        metricLabel: "Luas Hamparan Tani",
      },
      {
        title: "Saluran Irigasi Teknis Dusun Pahing",
        category: "Infrastruktur Pengairan",
        desc: "Jaringan irigasi tersier yang mengalirkan air pegunungan ke seluruh petak sawah sepanjang musim.",
        metric: "1.200 M",
        metricLabel: "Panjang Saluran Primer",
      },
      {
        title: "Stadion Mini Gelora Kadurama",
        category: "Kepemudaan & Olahraga",
        desc: "Fasilitas olahraga terbuka untuk kompetisi antar-dusun, pembinaan SSB anak desa, dan kegiatan senam warga.",
        metric: "1 Unit",
        metricLabel: "Lapangan Rumput Standar",
      },
    ],
    facilities: [
      {
        name: "Lumbung Padi & Gudang Gapoktan Pahing",
        category: "Pertanian",
        address: "Area Persawahan Blok Pahing RT 02",
        coords: "-6.9785, 108.6020",
      },
      {
        name: "Stadion Mini Gelora Kadurama",
        category: "Olahraga",
        address: "Jl. Lapang Pemuda Dusun Pahing RT 05",
        coords: "-6.9790, 108.6015",
      },
      {
        name: "Pintu Bagi Air Irigasi Cisanggarung",
        category: "Pengairan",
        address: "Batas Timur Dusun Pahing",
        coords: "-6.9780, 108.6030",
      },
    ],
  },
  wage: {
    slug: "wage",
    number: "Dusun III",
    name: "Dusun Wage",
    titleTag: "Zona Konservasi Air & Agrobisnis",
    tagline: "Sumber Mata Air Purba Cikaduran 45 L/dtk, Perkebunan Ubi Jalar Manis & Sapi Perah",
    elevation: "340 mdpl",
    areaHa: "40.3 Ha",
    kkCount: 136,
    residentCount: 442,
    villageShare: "26.6%",
    rtRwInfo: "6 RT / 2 RW",
    kadusName: "Agus Setiawan",
    kadusNip: "19880320 201203 1 006",
    kadusPhone: "+62 821-1122-3343",
    photoUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85",
    kadusPhotoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
    description:
      "Dusun Wage terletak pada kontur tertinggi di lereng timur Gunung Ciremai (elevasi 340 mdpl). Keberadaan Mata Air Alami Cikaduran dengan debit lestari 45 liter per detik menjadi berkah air bersih bagi seluruh warga desa. Wilayah sejuk ini juga menjadi sentra perkebunan ubi jalar lereng gunung dan kelompok peternak sapi perah rakyat yang mandiri energi melalui instalasi biogas.",
    quote:
      "Menjaga kejernihan mata air Cikaduran dan merawat lereng bukit adalah amanah turun-temurun leluhur Dusun Wage.",
    coordinates: "-6.9825, 108.5955",
    potentials: [
      {
        title: "Mata Air Alami Purba Cikaduran",
        category: "Konservasi Sumber Daya Air",
        desc: "Mata air alami pegunungan yang tidak pernah surut dan menjadi penopang utama air minum serta sanitasi desa.",
        metric: "45 L/dtk",
        metricLabel: "Debit Lestari Konstan",
      },
      {
        title: "Perkebunan Ubi Jalar Manis Ciremai",
        category: "Agrobisnis Holtikultura",
        desc: "Tanaman ubi jalar organik dengan rasa manis alami khas tanah vulkanik pegunungan Kuningan.",
        metric: "18 Ha",
        metricLabel: "Luas Kebun Produktif",
      },
      {
        title: "Peternakan Sapi Perah & Reaktor Biogas",
        category: "Peternakan & Energi Baru",
        desc: "Kelompok peternak sapi perah yang menghasilkan susu segar harian dan memanfaatkan limbah kandang untuk biogas.",
        metric: "42 Ekor",
        metricLabel: "Populasi Sapi Produktif",
      },
    ],
    facilities: [
      {
        name: "Hulu Konservasi Mata Air Cikaduran",
        category: "Konservasi",
        address: "Blok Hulu Cikaduran RT 01 Dusun Wage",
        coords: "-6.9825, 108.5955",
      },
      {
        name: "Pos Penampungan Susu Sapi Perah",
        category: "Peternakan",
        address: "Jl. Lereng Bukit RT 04 Dusun Wage",
        coords: "-6.9820, 108.5960",
      },
      {
        name: "Posyandu Melati II Dusun Wage",
        category: "Kesehatan",
        address: "Balai Warga RT 02 Dusun Wage",
        coords: "-6.9818, 108.5950",
      },
    ],
  },
};
