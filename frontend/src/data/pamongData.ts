export interface PamongItem {
  id: string;
  name: string;
  role: string;
  category: "Pimpinan" | "Sekretariat" | "Kewilayahan" | "Pelaksana Teknis" | "BPD";
  nip?: string;
  dusun?: string;
  workArea?: string;
  bio: string;
  imageUrl: string;
  contact?: string;
}

export const PAMONG_LIST: PamongItem[] = [
  {
    id: "PAMONG-001",
    name: "SUHENDRA, S.Sos",
    role: "Kepala Desa (Kuwu)",
    category: "Pimpinan",
    nip: "19780412 200501 1 008",
    workArea: "Seluruh Wilayah Desa Kadurama",
    bio: "Memimpin penyelenggaraan pemerintahan desa, pembinaan kemasyarakatan, dan pemberdayaan warga dengan prinsip transparansi fiskal dan keadilan sosial.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    contact: "kuwu@kadurama.desa.id"
  },
  {
    id: "PAMONG-002",
    name: "DADANG KURNIA",
    role: "Sekretaris Desa",
    category: "Sekretariat",
    nip: "19820915 200801 1 012",
    workArea: "Sekretariat Balai Desa Kadurama",
    bio: "Koordinator administrasi ketatausahaan, penyusunan rancangan peraturan desa, RKPDes, APBDes, serta pengelolaan sistem informasi kependudukan.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    contact: "sekdes@kadurama.desa.id"
  },
  {
    id: "PAMONG-003",
    name: "ROHMAT HIDAYAT",
    role: "Kepala Dusun I Pahing",
    category: "Kewilayahan",
    dusun: "Pahing",
    workArea: "Dusun Pahing (RT 01 s.d. RT 03 / RW 01)",
    bio: "Penanggung jawab ketenteraman wilayah lumbung pangan Dusun I Pahing, pengelola sarana olahraga Gelora Kadurama, serta pengawasan fasilitas pendidikan SD & TK.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    contact: "kadus.pahing@kadurama.desa.id"
  },
  {
    id: "PAMONG-004",
    name: "AGUS SETIAWAN",
    role: "Kepala Dusun II Wage",
    category: "Kewilayahan",
    dusun: "Wage",
    workArea: "Dusun Wage (RT 01 s.d. RT 02 / RW 01)",
    bio: "Pengawal kelestarian mata air alami Cikaduran, pembina kerukunan religi pondok pesantren, masjid, mushola, serta pengayom lingkungan Dusun II Wage.",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    contact: "kadus.wage@kadurama.desa.id"
  },
  {
    id: "PAMONG-005",
    name: "AHMAD DAHLAN",
    role: "Kepala Dusun III Manis",
    category: "Kewilayahan",
    dusun: "Manis",
    workArea: "Dusun Manis (RT 01 s.d. RT 03 / RW 01)",
    bio: "Penanggung jawab ketenteraman wilayah Dusun III Manis, koordinasi pelayanan warga di pusat pemerintahan dan KUA, serta pembinaan lembaga sosial masyarakat.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    contact: "kadus.manis@kadurama.desa.id"
  },
  {
    id: "PAMONG-006",
    name: "ISMAIL SALEH, S.E",
    role: "Kepala Urusan Keuangan (Bendahara)",
    category: "Sekretariat",
    workArea: "Tata Kelola Anggaran Balai Desa",
    bio: "Pengelola perbendaharaan APBDes, penatausahaan kas desa berbasis Siskeudes, serta penyusunan laporan pertanggungjawaban realisasi anggaran publik.",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "PAMONG-007",
    name: "AEP SAEPULLOH",
    role: "Kaur Perencanaan & Pembangunan",
    category: "Pelaksana Teknis",
    workArea: "Pengawasan Infrastruktur 3 Dusun",
    bio: "Penyusun desain teknis gambar kerja, rencana anggaran biaya (RAB) proyek fisik desa, dan pengawas swakelola padat karya tunai.",
    imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "PAMONG-008",
    name: "ISKANDAR ZULKARNAEN",
    role: "Kasi Kesejahteraan Rakyat",
    category: "Pelaksana Teknis",
    workArea: "Sosial, Kesehatan & Bansos Warga",
    bio: "Koordinator penyaluran BLT-DD, pendataan sensus kerentanan keluarga desil 1-4, verifikasi RTLH, dan pencegahan stunting posyandu terpadu.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "PAMONG-009",
    name: "H. ENDANG SUKMANA, M.Pd",
    role: "Ketua Badan Permusyawaratan Desa (BPD)",
    category: "BPD",
    workArea: "Lembaga Pengawasan & Aspirasi Warga",
    bio: "Memimpin BPD dalam membahas dan menyepakati rancangan peraturan desa bersama Kuwu, menampung dan menyalurkan aspirasi masyarakat 3 dusun.",
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80"
  }
];
