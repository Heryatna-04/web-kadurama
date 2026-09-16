export interface PamongItem {
  id: string;
  name: string;
  role: string;
  category: "Pimpinan" | "Sekretariat" | "Kewilayahan" | "Pelaksana Teknis" | "BPD" | "LPM";
  nip?: string;
  dusun?: string;
  workArea?: string;
  bio: string;
  imageUrl: string;
  contact?: string;
}

export const PAMONG_LIST: PamongItem[] = [
  // 1. PIMPINAN (KEPALA DESA / KUWU)
  {
    id: "PAMONG-001",
    name: "Samir Syarifudin",
    role: "Kepala Desa (Kuwu)",
    category: "Pimpinan",
    workArea: "Seluruh Wilayah Desa Kadurama",
    bio: "Memimpin penyelenggaraan pemerintahan desa, pembinaan kemasyarakatan, dan pemberdayaan warga dengan prinsip keterbukaan, pelayanan prima, dan pemerataan pembangunan 3 dusun.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    contact: "kuwu@kadurama.desa.id"
  },

  // 2. SEKRETARIAT DESA
  {
    id: "PAMONG-002",
    name: "Sumiati, SE",
    role: "Sekretaris Desa",
    category: "Sekretariat",
    workArea: "Sekretariat Balai Desa Kadurama",
    bio: "Koordinator administrasi ketatausahaan, pengelolaan regulasi perdes, perumusan APBDes & RKPDes, serta koordinasi teknis pelayanan publik terpadu.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    contact: "sekdes@kadurama.desa.id"
  },
  {
    id: "PAMONG-003",
    name: "Agus Ahmad Asidik",
    role: "Kepala Urusan Umum",
    category: "Sekretariat",
    workArea: "Ketatausahaan & Sarana Prasarana Desa",
    bio: "Penanggung jawab tata kelola persuratan, inventarisasi aset dan kekayaan desa, ekspedisi kedinasan, serta pengelolaan rumah tangga balai desa.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "PAMONG-004",
    name: "Jumadi",
    role: "Kepala Urusan Perencanaan",
    category: "Sekretariat",
    workArea: "Perencanaan Pembangunan Desa",
    bio: "Penyusun dokumen rencana pembangunan desa, pengoordinasian Musrenbangdes, pengolahan data geospasial monografi, dan monitoring berkala program kerja desa.",
    imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "PAMONG-005",
    name: "Leni Sumiati",
    role: "Kepala Urusan Keuangan (Bendahara)",
    category: "Sekretariat",
    workArea: "Penatausahaan Kas & Fiskal APBDes",
    bio: "Pelaksana penatausahaan perbendaharaan desa berbasis aplikasi Siskeudes, pengelolaan kas penerimaan/pengeluaran desa, serta verifikasi SPJ anggaran.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
  },

  // 3. PELAKSANA TEKNIS (KEPALA SEKSI)
  {
    id: "PAMONG-006",
    name: "Adun Durahman",
    role: "Kepala Seksi Pemerintahan",
    category: "Pelaksana Teknis",
    workArea: "Ketenteraman, Ketertiban & Kependudukan",
    bio: "Pelaksana operasional pembinaan ketenteraman wilayah, penegakan peraturan desa, pengelolaan profil kependudukan SIAK, dan fasilitasi administrasi pertanahan.",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "PAMONG-007",
    name: "Ayub Suhandi",
    role: "Kepala Seksi Kesejahteraan",
    category: "Pelaksana Teknis",
    workArea: "Sosial, Kesehatan & Pembangunan Masyarakat",
    bio: "Koordinator penyaluran jaring pengaman sosial BLT-DD, verifikasi bantuan sosial DTKS, pengawasan sarana kesehatan posyandu, dan pencegahan stunting.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "PAMONG-008",
    name: "Aan Johan",
    role: "Kepala Seksi Pelayanan",
    category: "Pelaksana Teknis",
    workArea: "Loket Pelayanan Administrasi Warga",
    bio: "Penanggung jawab loket pelayanan administrasi umum surat menyurat warga (SKTM, SKU, Keterangan Lahir/Kematian, dsb) secara cepat, ramah, dan tertib.",
    imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80"
  },

  // 4. PELAKSANA KEWILAYAHAN (KEPALA DUSUN)
  {
    id: "PAMONG-009",
    name: "Trida Sentosa",
    role: "Kepala Dusun I Pahing",
    category: "Kewilayahan",
    dusun: "Pahing",
    workArea: "Dusun Pahing (3 RT / 1 RW)",
    bio: "Penanggung jawab ketenteraman wilayah Dusun I Pahing (27 Ha), koordinator lumbung ketahanan pangan, pengelola sarana olahraga lapangan sepakbola, serta pengawasan sekolah SD & TK.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    contact: "083861181402"
  },
  {
    id: "PAMONG-010",
    name: "Andri Rukmana",
    role: "Kepala Dusun II Wage",
    category: "Kewilayahan",
    dusun: "Wage",
    workArea: "Dusun Wage (2 RT / 1 RW)",
    bio: "Pengawal kelestarian mata air alami pegunungan Dusun II Wage (23 Ha), pembina kerukunan religi jamaah masjid, mushola, pondok pesantren, sarana PAUD, serta posyandu lingkungan.",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    contact: "089667736184"
  },
  {
    id: "PAMONG-011",
    name: "Jamaludin",
    role: "Kepala Dusun III Manis",
    category: "Kewilayahan",
    dusun: "Manis",
    workArea: "Dusun Manis (3 RT / 1 RW)",
    bio: "Penanggung jawab ketenteraman wilayah Dusun III Manis (39 Ha), koordinasi pelayanan warga di gerbang utama desa, instansi Kantor KUA, kompleks pendidikan SD, dan pembinaan 4 mushola & pesantren.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    contact: "08314407775"
  },

  // 5. BADAN PERMUSYAWARATAN DESA (BPD)
  {
    id: "BPD-001",
    name: "Ubaedilah, SE",
    role: "Ketua BPD",
    category: "BPD",
    workArea: "Lembaga Legislasi & Aspirasi Masyarakat Desa",
    bio: "Memimpin BPD Kadurama dalam membahas dan menyepakati rancangan Peraturan Desa bersama Kuwu, menampung aspirasi warga, serta mengawasi kinerja pemerintahan desa.",
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "BPD-002",
    name: "Erik Kasihanto, S.Pd",
    role: "Sekretaris BPD",
    category: "BPD",
    workArea: "Administrasi & Dokumentasi BPD",
    bio: "Mengelola ketatausahaan risalah rapat musyawarah, arsip keputusan regulasi perdes, dan surat-menyurat kelembagaan BPD.",
    imageUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "BPD-003",
    name: "Iwan Radiawan, S.Pd",
    role: "Anggota BPD",
    category: "BPD",
    workArea: "Bidang Pembangunan & Pendidikan",
    bio: "Menjaring aspirasi warga terkait penguatan mutu sarana pendidikan, pemuda, dan pemeliharaan fasilitas umum desa.",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "BPD-004",
    name: "Didin Mulyana",
    role: "Anggota BPD",
    category: "BPD",
    workArea: "Bidang Perekonomian & Pertanian",
    bio: "Pengawas dan penyalur aspirasi kelompok tani persawahan, irigasi teknis, dan permodalan usaha mandiri masyarakat desa.",
    imageUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "BPD-005",
    name: "Titin Arentina",
    role: "Anggota BPD",
    category: "BPD",
    workArea: "Bidang Pemberdayaan Perempuan & Kesejahteraan Keluarga",
    bio: "Penyalur aspirasi keterwakilan perempuan, kesehatan balita/ibu hamil di posyandu, dan pembinaan ketahanan pangan keluarga.",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "BPD-006",
    name: "Ade Sarifudin",
    role: "Anggota BPD",
    category: "BPD",
    workArea: "Bidang Ketenteraman & Kewilayahan",
    bio: "Mengawal aspirasi warga perihal stabilitas keamanan lingkungan warga, penataan saluran air, dan tata ruang dusun.",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "BPD-007",
    name: "Ade Usep",
    role: "Anggota BPD",
    category: "BPD",
    workArea: "Bidang Sosial Budaya & Keagamaan",
    bio: "Penyerap aspirasi pembinaan majelis taklim, kegiatan kepemudaan, serta kerukunan lembaga keagamaan desa.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  },

  // 6. LEMBAGA PEMBERDAYAAN MASYARAKAT (LPM)
  {
    id: "LPM-001",
    name: "Ahmad",
    role: "Ketua LPM",
    category: "LPM",
    workArea: "Pemberdayaan Masyarakat & Gotong Royong Desa",
    bio: "Memimpin Lembaga Pemberdayaan Masyarakat (LPM) Desa Kadurama dalam menggerakkan swadaya gotong royong warga, kemitraan pembangunan bersama pemerintah desa, dan penguatan ekonomi kerakyatan.",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "LPM-002",
    name: "Caslim",
    role: "Sekretaris LPM",
    category: "LPM",
    workArea: "Administrasi & Program Kerja LPM",
    bio: "Penanggung jawab ketatausahaan, dokumentasi musyawarah swadaya, dan penyusunan usulan program pemberdayaan masyarakat.",
    imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "LPM-003",
    name: "Carta Azis",
    role: "Anggota LPM",
    category: "LPM",
    workArea: "Bidang Pembangunan Fisik & Swadaya",
    bio: "Pendamping pelaksanaan kerja bakti infrastruktur lingkungan warga dan pelibatan tenaga kerja lokal padat karya.",
    imageUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "LPM-004",
    name: "Edo",
    role: "Anggota LPM",
    category: "LPM",
    workArea: "Bidang Kepemudaan & Kesejahteraan Sosial",
    bio: "Penggerak pemuda dan karang taruna dalam program pemberdayaan UMKM desa, olahraga, serta kepedulian sosial kemasyarakatan.",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80"
  }
];
