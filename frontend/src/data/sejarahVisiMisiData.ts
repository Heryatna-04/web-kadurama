export interface KuwuHistory {
  period: string;
  name: string;
  isCurrent?: boolean;
}

export const KUWU_HISTORY_LIST: KuwuHistory[] = [
  { period: "1805 - 1850", name: "Sura Braja" },
  { period: "1850 - 1850", name: "Cakra" },
  { period: "1885 - 1910", name: "Jangkung" },
  { period: "1910 - 1928", name: "Murnawi" },
  { period: "1928 - 1932", name: "Sujatma" },
  { period: "1932 - 1965", name: "Sukarta" },
  { period: "1965 - 1973", name: "Johani" },
  { period: "1973 - 1978", name: "Rahman" },
  { period: "1978 - 1990", name: "H Suhara" },
  { period: "1990 - 1995", name: "Abu Bakri" },
  { period: "1995 - 2000", name: "Sutiana" },
  { period: "2000 - 2005", name: "Ade Usep" },
  { period: "2007 - 2013", name: "Samir Syarifudin" },
  { period: "2013 - 2019", name: "Uu Sueb" },
  { period: "2019 - 2027", name: "Samir Syarifudin", isCurrent: true },
];

export const DESA_SEJARAH_DATA = {
  title: "Sejarah Desa Kadurama",
  overview:
    "Desa Kadurama adalah bagian dari wilayah Kabupaten Kuningan merupakan salah satu produk dari perjalanan waktu, memiliki keunikan sebagai jatidirinya. Desa Kadurama sekarang adalah hasil perjalanan panjang dari berbagai peristiwa di masa lalu yang mengandung berbagai semangat dan dinamika. Dengan mengenali sejarahnya, maka kita akan mampu memberikan pemahaman dan apresiasi secara tepat terhadap Desa Kadurama.",
  originStory:
    "Sejarah adanya Desa Kadurama tidak ada bukti yang autentik / tertulis, hanya cerita dari mulut ke mulut yang terus berkembang di sebagian besar masyarakat cerita yang berkembang di masyarakat.",
  geografi: {
    kecamatan: "Kecamatan Ciawigebang",
    jarakKecamatan: "1 Kilometer dari pusat kota Kecamatan Ciawigebang",
    topografi: "Dataran rendah",
    ketinggian: "550 meter di atas permukaan laut (mdpl)",
    curahHujan: "2.124 Mm / Tahun",
    luasWilayah: "89 Hektar (Ha)",
    batasWilayah: [
      { arah: "Sebelah Utara", berbatasanDengan: "Desa Kalimanggis Kulon" },
      { arah: "Sebelah Barat", berbatasanDengan: "Desa Ciawigebang" },
      { arah: "Sebelah Selatan", berbatasanDengan: "Desa Panyosogan" },
      { arah: "Sebelah Timur", berbatasanDengan: "Desa Cihideunggirang" },
    ],
    jarakTempuh: [
      { tujuan: "Kantor Kecamatan Ciawigebang", jarak: "1 Kilometer" },
      { tujuan: "Kantor Bupati Kuningan", jarak: "± 15 Kilometer" },
      { tujuan: "Badan Koordinasi Wilayah Tiga Cirebon", jarak: "± 56 Kilometer" },
      { tujuan: "Ibu Kota Provinsi Jawa Barat", jarak: "± 230 Kilometer" },
      { tujuan: "Ibu Kota Negara Republik Indonesia", jarak: "± 375 Kilometer" },
    ],
    pembagianWilayah: {
      dusunCount: 3,
      rwCount: 3,
      rtCount: 8,
      dusunList: [
        { name: "Dusun Pahing", detail: "Dusun I • 27 Ha (3 RT / 1 RW)" },
        { name: "Dusun Wage", detail: "Dusun II • 23 Ha (2 RT / 1 RW)" },
        { name: "Dusun Manis", detail: "Dusun III • 39 Ha (3 RT / 1 RW)" },
      ],
    },
  },
};

export const VISI_MISI_DATA = {
  visi: "Terwujudnya Trasfaransi Akuntabilitas Menuju Masyarakat Desa Kadurama yang Aman dan Sejahtera",
  visiPenjelasan:
    "Berdasarkan kondisi saat ini dan menghadapi 5 tahun mendatang, Visi Pembangunan Desa Kadurama diartikan sebagai komitmen untuk memberikan kepuasan pelayanan kepada masyarakat di berbagai bidang, serta meningkatkan kesejahteraan segenap warga desa secara berkelanjutan.",
  misiList: [
    {
      code: "A",
      title: "Pemerintahan Transparan & Adil",
      desc: "Pemerintahan yang Trasparan, adil, Cepat, Tepat dan Benar.",
    },
    {
      code: "B",
      title: "Pembangunan Berkesinambungan & Gotong Royong",
      desc: "Pelaksanaan Pembangunan Desa yang berkesinambungan dan mengadakan Musyawarah dan Partisipasi Gotong-Royong masyarakat.",
    },
    {
      code: "C",
      title: "Pelayanan Publik Prima",
      desc: "Mengutamakan pelayanan masyarakat yang baik.",
    },
    {
      code: "D",
      title: "Penguatan SDM Iptek & Imtaq",
      desc: "Mempersiapkan SDM perangkat yang cerdas dalam Iptek dan Imtaq.",
    },
    {
      code: "E",
      title: "Sinergi Program Kabupaten Kuningan",
      desc: "Memfasilitasi masyarakat dalam mendukung program Kabupaten Kuningan.",
    },
    {
      code: "F",
      title: "Masyarakat Terampil & Kreatif",
      desc: "Menumbuh kembangkan masyarakat yang terampil, kreatif dan inovatif.",
    },
    {
      code: "G",
      title: "Budaya Ramah & Pariwisata",
      desc: "Mengembangkan budaya ramah dalam pergaulan masyarakat guna mendukung Kuningan Daerah Pariwisata.",
    },
    {
      code: "H",
      title: "Tata Kelola Pemerintahan & Lingkungan",
      desc: "Menyelenggarakan sistem organisasi pemerintahan yang terarah dan terprogram serta tata kelola lingkungan yang baik.",
    },
    {
      code: "I",
      title: "Penguatan Sektor Pertanian",
      desc: "Serta meningkatkan usaha dibidang pertanian sebagai landasan perekonomian Desa.",
    },
  ],
};
