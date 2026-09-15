# 📓 Development Log & Project Roadmap
## Sistem Pemdes Terintegrasi Desa Digital Kadurama

**Inisiasi Proyek:** 13 September 2026  
**Status SDLC:** Phase 1 (Requirements & Specifications Completed)  
**Teknologi Utama:** Next.js (App Router), Express.js (TypeScript), Turborepo/NPM Workspaces, Supabase-Ready Repository Pattern.  

---

## 📌 Status Tahapan SDLC (5-Phase Workflow)

- [x] **Phase 1: Brainstorming, PRD, SRS & Backlog**
  - [x] Diskusi arah arsitektur & scope dengan stakeholder (Monorepo, Express Backend, Next.js Frontend, Internal-only surat flow).
  - [x] Dokumen [PRD.md](file:///home/jrilym/Projects/Next/desa/PRD.md) final & disetujui.
  - [x] Dokumen [SRS.md](file:///home/jrilym/Projects/Next/desa/SRS.md) spesifikasi fungsional dan arsitektur data.
  - [x] Backlog & rincian task modular.
- [x] **Phase 2: UI/UX Mockup via Interactive HTML Options & Design Spec**
  - [x] Pembuatan berkas mockup visual `.html` interaktif (`mockups/index.html`) untuk Landing Page & Backpanel Cetak Surat.
  - [x] Review spesifikasi desain (Modern Emerald Civic Tech), tipografi sans-serif jernih (Plus Jakarta Sans), dan palet warna.
- [x] **Phase 3: Frontend Next.js & Backend Express Implementation (Pitch-Ready)**
  - [x] Setup direktori `frontend/` (Next.js 16.3.5 App Router, TypeScript, Tailwind CSS v4, Lucide React).
  - [x] Setup direktori `backend/` (Express.js, TypeScript, TSX, Cors).
  - [x] Ekstraksi palet warna resmi Pemkab Kuningan: Kuningan Teal (`#009388`) dan Kuningan Gold (`#eda50c`).
  - [x] Implementasi Portal Publik Interaktif (Navbar tunggal bersih, Hero 100vh, Panduan Syarat Surat tanpa CTA buat online, Statistik Penduduk 5 Dusun, Pamong Desa Portrait Showcase, APBDes Cockpit, Berita Terkini, Lokasi & Jam Kantor).
  - [x] Implementasi Backpanel Loket Persuratan & Pratinjau Kertas A4 Resmi (Kop Desa Kadurama, Auto-fill NIK/Nama, QR Verification, NIP/Tanda Tangan, cetak browser).
  - [x] Verifikasi build produksi Next.js (`npm run build` via Turbopack lolos 100%) dan Express (`tsc` lolos 100%).
- [ ] **Phase 4: Empirical Testing & Database Integration (Setelah Deal Klien)**
  - [ ] Integrasi Supabase PostgreSQL (Database Auth, RLS, Table kependudukan & surat).
  - [ ] Koneksi REST API antara `frontend` dan `backend`.
- [ ] **Phase 5: Deployment Preparation & User Manual**
  - [ ] Konfigurasi deployment hosting / VPS / Vercel.
  - [ ] Panduan operasional staf desa (*User Manual*).

---

## 📝 Log Aktivitas Sesi Ini

### Task Selesai (`[x]`):
1. Mengumpulkan preferensi teknis dan alur bisnis dari pengguna:
   - Direktori `frontend/` untuk Next.js dan `backend/` untuk Express.
   - Alur surat: Pelayanan di kantor desa langsung oleh operator/staf.
   - Modul prioritas: Sistem Generator & Cetak Surat Resmi Otomatis + Master Data Kependudukan.
   - Arah visual: Identitas resmi Pemkab Kuningan (Teal `#009388` & Gold `#eda50c`).
2. Menyusun dokumen perencanaan SDLC:
   - [PRD.md](file:///home/jrilym/Projects/Next/desa/PRD.md)
   - [SRS.md](file:///home/jrilym/Projects/Next/desa/SRS.md)
   - [DEVELOPMENT_LOG.md](file:///home/jrilym/Projects/Next/desa/DEVELOPMENT_LOG.md)
3. Bedah & Adaptasi Desain Referensi `https://kadugede.godesa.id`:
   - Konten lokal 5 Dusun tradisional Kuningan (Manis, Pahing, Puhun, Wage, Kliwon), jadwal loket, transparansi APBDes, rekapitulasi surat keluar, dan status IDM/SDGs.
   - Diterapkan ke [mockups/index.html](file:///home/jrilym/Projects/Next/desa/mockups/index.html).
4. Penerapan Ketat Disiplin Anti-AI-Slop & GSAP Motion:
   - Single clean, unified navbar (tidak bertumpuk).
   - Hero 100vh cinematic tanpa CTA buka loket online.
   - Section tersendiri untuk Demografi & Statistik Kependudukan (5 Dusun).
   - Large Portrait Leadership Showcase untuk pamong desa (Kades Suhendra, S.Sos, Sekdes Dadang Kurnia, Kasi, Kaur, 5 Kadus).
   - Cockpit APBDes 2026 dengan tab filter dan rincian 5 bidang belanja.
   - Section Kabar & Berita Desa Kadurama terkini.
   - Zero em-dash (`—`) dan en-dash (`–`) di seluruh teks antarmuka.
   - Zero kata "ritual" di seluruh sistem.
5. Setup & Migrasi UI ke Next.js 16 (`frontend/`) dan Express (`backend/`):
   - Inisialisasi Next.js 16.3.5 App Router dengan Tailwind CSS v4 dan TypeScript.
   - Migrasi dan rekayasa ulang seluruh UI ke [frontend/src/app/page.tsx](file:///home/jrilym/Projects/Next/desa/frontend/src/app/page.tsx) dengan status reaktif React (tab, live preview surat, switcher portal-backpanel, live print CSS).
   - Inisialisasi Express server di [backend/src/index.ts](file:///home/jrilym/Projects/Next/desa/backend/src/index.ts).
   - Validasi kedua build: `npm run build` di frontend dan backend sukses 0 error.
6. Refinement UI, Ornamen Gerbang Kuningan, Animasi GSAP & Panduan Wawancara SDLC:
   - Cropping presisi landmark Gerbang Kuda Kuningan dari [image.png](file:///home/jrilym/Projects/Next/desa/image.png), menghapus badge "1 SEPTEMBER 2026" dan menghasilkan asset transparan [frontend/public/kuningan-gate-transparent.png](file:///home/jrilym/Projects/Next/desa/frontend/public/kuningan-gate-transparent.png).
   - Hero Section Refactor: Menghapus card "5 Dusun Khas" yang canggung dan menggantinya dengan civic showcase card berlatar landmark gerbang Kuningan beraksen emas serta watermark ambient.
   - Integrasi GSAP & ScrollTrigger (dynamic import tanpa SSR hydration mismatch): Animasi entrance Hero (badge, title, desc, action buttons, gate card) dan APBDes counter animation (counter angka pendapatan, belanja, serapan, dan animasi progress bar 0% ke 82.4%).
   - Penyesuaian jenis surat sementara menjadi tepat 3 jenis: SKU, SKTM, DOMISILI (SKCK dihapus).
   - Navbar 2-baris presisi rata kiri-kanan, ikon rumah tunggal untuk beranda, label "LAYANAN", hover dropdown bridge tanpa celah, dan tombol panel admin murni ikon (tersembunyi di mobile).
   - Penyusunan panduan wawancara SDLC komprehensif di [PANDUAN_WAWANCARA_DESA.md](file:///home/jrilym/Projects/Next/desa/PANDUAN_WAWANCARA_DESA.md) untuk persiapan rapat dengan perangkat desa.
7. Hero 100vh Gate Landmark Background, Navbar Hover Fix & Tekstur Grid/Dot Sivik:
   - Background Hero: Menggunakan [frontend/public/kuningan-gate.png](file:///home/jrilym/Projects/Next/desa/frontend/public/kuningan-gate.png) penuh di latar belakang Hero section (100vh) dipadukan dengan teknik CSS `mix-blend-multiply`, radial glow emas `#eda50c`, dan gradien gelap Kuningan teal. Menghilangkan noise/artefak penghapusan putih sepenuhnya dan menghasilkan visual landmark megah.
   - Hero Foreground Panel: Menghapus gambar dari dalam card dan menggantinya dengan Civic Information Cockpit berlatar glassmorphism (Status IDM Desa Mandiri 0.8942, jam operasional balai desa, alamat kantor, dan metrik kunci wilayah).
   - Perbaikan Menyeluruh Bug Hover Navbar:
     - Mengintegrasikan state React `activeDropdown` dengan timer tenggang (*grace period* 150ms) untuk mencegah menu tertutup tiba-tiba atau berkedip (*flicker*).
     - Invisible bridge (`before:content-[''] before:absolute before:-top-3 ...`) menjembatani tombol dan dropdown menu tanpa *deadzone*.
     - Menambah lebar dropdown `w-72` pada menu Layanan dan menerapkan `whitespace-nowrap` pada seluruh link sehingga teks "Surat Keterangan Tidak Mampu (SKTM)" tidak terpotong.
     - Menambahkan segitiga penunjuk (*pointer caret*) di atas dropdown card untuk presisi visual.
   - Tekstur Latar Belakang Non-Plain: Menerapkan pola dot matrix sivik halus (`radial-gradient`) dan kisi arsitektural (`linear-gradient`) transparan pada seluruh section (Section 1 s.d. Section 6 dan workspace Backpanel Loket), sehingga tidak ada area putih atau abu-abu yang terkesan datar (*plain*).
8. Isolasi Total Panel Admin (Navbar Publik Dihapus, Sidebar Fixed, Konten Scroll Independen):
   - Navbar publik 2-baris diisolasi hanya tampil pada kanal warga (`view === 'public'`). Saat aparatur masuk ke panel loket (`view === 'admin'`), navbar publik ditiadakan dari DOM.
   - Panel admin menggunakan viewport penuh `fixed inset-0 overflow-hidden` dengan sidebar `w-64 h-full` yang terpasang tetap (*fixed*, zero-scroll).
   - Workspace utama loket persuratan (`<main>`) diberi alur scroll independen (`h-full overflow-y-auto`), sehingga formulir pembuatan surat, pratinjau kertas A4/F4, buku agenda, dan tabel kependudukan dapat di-scroll lancar tanpa menggeser sidebar.
9. Admin Portal Features Expansion, Reusable Pagination & Master Data Synchronization:
   - Penambahan Fitur Manajemen Kabar Desa (Tab Admin `berita`):
     - Panel administrasi untuk melihat, menulis kabar baru, mengubah, menghapus, serta mengubah status publikasi (*Terbit* vs *Draf*).
     - Terhubung langsung secara reaktif dengan Section Berita di beranda publik (hanya berita berstatus *Terbit* yang ditampilkan).
   - Penambahan Fitur Kelola Transparansi APBDes 2026 (Tab Admin `apbdes`):
     - Panel administrasi cockpit ringkasan pendapatan, belanja, dan serapan berjalan, serta tabel 5 bidang belanja.
     - Modal penyesuaian pagu anggaran, realisasi belanja per bidang, dan kalkulasi otomatis persentase serapan.
     - Terhubung langsung secara reaktif dengan Section Transparansi APBDes di beranda publik.
   - Transformasi Master Data Kependudukan (`residents`):
     - Mengganti aksi "Buat Surat" menjadi aksi tata kelola data internal: tombol "Perbarui" (membuka modal koreksi nama, KK, pekerjaan, alamat, dusun, status keluarga) dan tombol "Sinkronkan" (sinkronisasi SIAK Dukcapil).
     - Tombol massal "Sinkronisasi Semua (SIAK)" di bagian header dengan animasi loading dan toast notifikasi interaktif.
     - Penambahan kolom indikator badge status sinkronisasi (*Tersinkronisasi SIAK*, *Pembaruan Internal*, *Belum Sinkron*).
     - Pencarian real-time berdasarkan NIK, Nama, dan No. KK dipadukan dengan filter 5 Dusun.
   - Komponen Pagination Reusable:
     - Komponen `Pagination` fleksibel yang mendukung pemilihan jumlah baris (10 atau 25 baris per halaman), penunjuk range data (`Menampilkan X - Y dari Z data`), serta tombol navigasi halaman.
     - Diterapkan pada Buku Agenda Persuratan (`agenda`), Master Data Kependudukan (`residents`), dan Manajemen Kabar Desa (`berita`).
10. Pivot Kebutuhan Klien Pasca-Meeting & Implementasi Sensus Kesejahteraan 3 Dusun:
   - Pembatalan Modul Generator Persuratan: Sesuai arahan klien pada meeting, sistem cetak surat dan agenda surat masuk/keluar resmi dihapus dari alur utama.
   - Transformasi Backpanel Menjadi Village Data Center & Sensus Dusun:
     - Modul Sensus Kesejahteraan Keluarga (Per KK): Pendataan komprehensif tingkat dusun mencakup NIK, No KK, Kepala Keluarga, 3 Dusun resmi (Manis, Pahing, Puhun), Desil Kesejahteraan (Desil 1 s.d. Desil 4+), status pelunasan PBB-P2 2026, kondisi fisik rumah (kriteria RTLH PUPR: lantai, dinding, atap, sanitasi/jamban, sumber air minum, daya listrik), kerentanan sosial (lansia tunggal, balita/stunting, disabilitas berat), pekerjaan & penghasilan bulanan, kepemilikan lahan/ternak, serta kepesertaan bansos aktif (PKH, BPNT, BLT-DD, Non-Bansos).
     - Kalkulasi Otomatis Desil Kesejahteraan: Sistem mengkalkulasi rekomendasi desil secara terintegrasi berdasarkan kombinasi kondisi fisik hunian dan rentang penghasilan keluarga.
     - Role Kadus & Lingkup 3 Dusun: Input sensus difokuskan per wilayah kerja Kepala Dusun dengan fitur Role Switcher interaktif (Kadus Manis: Rusman, Kadus Pahing: Nana Suryana, Kadus Puhun: Agus Setiawan).
     - Fitur Ekspor Ganda:
       1. Ekspor Excel (.CSV) terfilter per dusun, desil, status PBB, dan kepesertaan bansos langsung dari browser.
       2. Ekspor Lembar PDF Profil Keluarga Terpersonalisasi format A4 resmi (*Lembar Hasil Sensus & Verifikasi Profil Kesejahteraan Keluarga*) lengkap dengan Kop Desa Kadurama, QR Code verifikasi, badge desil, rincian kelayakan hunian, rekomendasi intervensi program desa, serta kolom tanda tangan Kades & Kadus.
   - Penyesuaian Portal Publik:
     - Section Profil 3 Dusun Kadurama (Dusun Manis, Pahing, Puhun) menampilkan potensi unggulan, demografi KK & jiwa, fasilitas lingkungan, dan kontak Kepala Dusun.
     - Section Peta Geografis, Topografi & Sebaran Fasilitas Wilayah: Peta interaktif SVG lereng Gunung Ciremai (koordinat 6°59'48"S 108°33'12"E, elevasi 285-340 mdpl, luas 142.8 Ha) dengan pin fasilitas berkategori (Pemerintahan, Ibadah, Kesehatan, Pendidikan, Pertanian) dan kartu detail fasilitas interaktif.
     - Section Panduan Administrasi Warga: Prosedur pengurusan dokumen kependudukan, jam loket fisik kantor desa, dan kontak WhatsApp layanan warga (tanpa tombol pembuatan surat online).

11. Redesign Hero Section & 3 Dusun Cards (Anti-Slop Taste Skill & Asymmetric Bento Architecture):
   - Desain Hero Section Berintegritas & Anti-Slop:
     - Mengatasi masalah kepadatan teks berlebih (clutter notice box) dan tampilan card yang menutupi landmark gerbang.
     - Headline diperpendek menjadi maksimal 2 baris desktop (*Keterbukaan Data Wilayah, Kesejahteraan Nyata Warga*).
     - Subtext dibatasi ketat menjadi 17 kata sesuai direktif anti-slop (maksimal 20 kata).
     - Restrukturisasi panel kanan menjadi *Civic Cockpit & Performance Card*: menampilkan status resmi IDM 2026 Desa Mandiri (Skor 0.8942), kode wilayah Kemendagri (32.08.09.2005), pilar demografi mikro 3 dusun, jam layanan aktif balai desa, dan tautan langsung ke peta geografis.
     - Integrasi *Bottom Horizon Metric Strip* yang elegan menghubungkan hero dengan section konten: 142.8 Ha luas wilayah, 285-340 mdpl elevasi lereng Ciremai, Rp 1.48 Miliar APBDes 2026, dan keharmonisan 3 dusun.
     - Ornamen Gerbang Kuningan diperkuat dengan efek *multiply*, *ambient golden backlight*, dan *gradient mask* halus agar menyatu dengan latar belakang bernuansa deep dark teal.
   - Transformasi 3 Dusun Menjadi Asymmetric Bento Grid:
     - Mengeliminasi anti-pola 3 kartu kembar identik (*3 equal feature cards slop*).
     - Dusun I (Manis) diangkat sebagai *Dominant Bento Hero Cell* (Col-Span-7) sebagai pusat administrasi, balai desa, Pustu siaga, gedung sekolah, dan sentra UMKM pangan.
     - Dusun II (Pahing) dan Dusun III (Puhun) dirancang sebagai *Stacked Bento Cells* (Col-Span-5) dengan karakter tematik spesifik: Dusun Pahing bertema lumbung padi organik & irigasi teknis 64 Ha (aksen emerald-emas), sedangkan Dusun Puhun bertema mata air alami purba Cikaduran 45 L/dtk & agrowisata perbukitan 340 mdpl (aksen teal-cyan lereng Ciremai).
     - Penambahan *Interactive Dusun Filter Tabs* di bagian atas (Semua Dusun, Dusun I Manis, Dusun II Pahing, Dusun III Puhun) untuk eksplorasi fokus per wilayah.
     - Penambahan *Demographic Balance Summary Bar* di bagian bawah menampilkan proporsi sebaran warga (Manis 37.4%, Pahing 33.0%, Puhun 29.6%).

12. Transformasi Profil 3 Dusun Menjadi Focal Carousel Interaktif (Geser & Fokus Per Dusun):
   - Carousel Stage & Track Geser Halus:
     - Mengubah penyajian profil 3 dusun menjadi panggung carousel fokus (`currentDusunIndex: 0, 1, 2`) dengan transisi geser horizontal (`transform -translateX-[...%] duration-500 ease-out`).
     - Tiap slide menyajikan format kartu panggung penuh (Split 7:5):
       - Sisi Kiri (Col-Span-7): Foto lanskap resolusi tinggi dengan efek pan/zoom, label elevasi (mdpl), lencana nomor dusun bergradien, serta judul dan tagline karakter dusun.
       - Sisi Kanan (Col-Span-5): Narasi mendalam potensi mikro, bento 3 metrik kependudukan (KK, Jiwa, dan Porsi Populasi Desa), chip fasilitas publik utama lengkap dengan ikon tematik, profil Kepala Dusun (Kadus) setempat, dan tombol aksi "Lihat Titik di Peta" yang langsung memfokuskan pin peta geografis di section berikutnya.
   - Multi-Layer Kontrol & Navigasi:
     - Dusun Selector Pills di bagian atas untuk lompat fokus langsung ke dusun yang dipilih (`Dusun I: Manis`, `Dusun II: Pahing`, `Dusun III: Puhun`).
     - Panah Navigasi Kiri & Kanan (`ChevronLeft`, `ChevronRight`) dengan slide counter dinamis (`01 / 03 • Dusun Manis`).
     - 3 Kartu Mini-Preview (Thumbnail Switcher) di bagian bawah carousel yang memperlihatkan rangkuman seluruh dusun secara simultan, dengan indikator ring aktif dan badge "Fokus Aktif" pada dusun yang sedang ditampilkan di panggung utama.
   - Tetap mempertahankan *Demographic Balance Summary Bar* di bagian bawah sebagai rangkuman proporsi sebaran warga (Manis 37.4%, Pahing 33.0%, Puhun 29.6%).

13. Redesign Profil 3 Dusun: Full-Photo Cinematic Canvas (Anti-Nested Cards & Opsi 1 Minimalist Navigation):
   - Eliminasi Anti-Pola "Cards-in-Cards":
     - Mengubah seluruh slide carousel menjadi satu panggung kanvas foto sinematik penuh (*Full-Bleed Photographic Canvas* setinggi 540-620px), tanpa ada kotak card putih bertumpuk di dalam card.
     - Penerapan *Cinematic Multi-Stop Directional Scrim* (`bg-gradient-to-t` dan `bg-gradient-to-r`) yang memberikan keterbacaan tipografi 100% kontras tinggi (WCAG AA) di sisi kiri, sembari membiarkan keindahan panorama alam dusun bersinar utuh di sisi kanan.
     - Metrik demografi (KK, Jiwa, Porsi Desa, RT/RW) disajikan secara murni tipografis dengan pemisah garis horizontal (`border-y border-white/15`) tanpa pembungkus kotak/box bertumpuk.
     - Fasilitas wilayah disajikan berupa *inline glass badges* elegan bernuansa kaca transparan.
   - Penerapan Navigasi Opsi 1 (Bersih & Zero-Redundancy):
     - Menghapus tab menu pill di atas dan 3 kartu thumbnail di bawah untuk meniadakan kontrol ganda yang berlebih.
     - Navigasi geser murni dipusatkan pada tombol panah `< >` di sudut kanan atas header dan tombol panah melayang (*floating edge arrows*) di tepi kiri-kanan kanvas foto.
     - Indikator slide minimalis (*pill dots*) di bawah panggung utama yang melebar halus (*elongated pill*) pada dusun yang aktif.

14. Infinite Forward Loop Carousel & Floating Arrows Cleanups:
   - Penghapusan Indikator & Panah Atas Kanan:
     - Sesuai permintaan, tombol `< >` dan teks counter di sudut kanan atas header dihapus sepenuhnya agar tampilan header bersih dan fokus hanya pada judul serta deskripsi wilayah.
     - Kontrol panah geser murni diposisikan melayang di dalam gambar (*floating edge arrows* di tepi kiri dan kanan kanvas foto) dengan latar belakang kaca gelap (*dark glass backdrop*), ikon yang jelas, dan efek taktil interaktif.
   - Implementasi Infinite Forward Loop (Unlimited 1, 2, 3, 1, 2, 3):
     - Mengubah mekanisme carousel menggunakan *cloned buffer virtual track* 5 slide: `[Clone Dusun 3 (Puhun), Real 1 (Manis), Real 2 (Pahing), Real 3 (Puhun), Clone 1 (Manis)]`.
     - Saat berpindah dari Dusun 3 ke Dusun 1, transisi tetap bergerak maju mulus ke kanan (ke slide Clone 1) dengan durasi 600ms, lalu secara instan berpindah ke posisi Real 1 tanpa animasi rewind ke belakang. Begitu pula saat menekan panah kiri dari Dusun 1, transisi mundur mulus ke slide Clone 3 lalu reposisi ke Real 3.
     - Hasil: Carousel berputar terus-menerus ke depan secara mulus tanpa batas (*unlimited continuous loop* 1 -> 2 -> 3 -> 1 -> 2 -> 3).
   - Auto-Slide Otomatis dengan Pause on Hover:
     - Carousel otomatis bergeser maju setiap 5 detik (5000ms).
     - Otomatis dijeda (*paused*) ketika kursor mouse warga berada di atas area kanvas foto (*hover*) untuk kenyamanan membaca data kependudukan dan fasilitas.

15. Perbaikan Auto-Slide Carousel (Pause saat Hover & Reset Timer saat Geser Manual):
   - Isolasi Status Hover Menggunakan `useRef` & `useCallback`:
     - Mengatasi masalah interval timer yang bertumpuk atau berjalan saat kursor pengguna sedang berada di atas kanvas carousel.
     - Menggunakan `isDusunHoveredRef` dan `autoSlideTimerRef` untuk menghentikan interval secara instan (`clearInterval`) begitu kursor masuk (`onMouseEnter` dan `onTouchStart`).
     - Selama kursor berada di atas foto atau card, timer 100% berhenti (paused), sehingga warga tidak akan mengalami slide berpindah mendadak saat sedang membaca data.
   - Reset Total Countdown Saat Interaksi Manual:
     - Ketika tombol panah kanan, panah kiri, atau titik indikator diklik, fungsi `resetAutoSlideTimer()` langsung membersihkan timer lama dan memulai hitung mundur 5 detik yang baru dari 0 jika tidak sedang di-hover.
     - Ketika kursor meninggalkan area gambar (`onMouseLeave` dan `onTouchEnd`), timer 5 detik dimulai kembali secara segar (*fresh 5000ms countdown*).
   - Pengamanan State Transisi (Safety Guard):
     - Menambahkan batasan `dusunTrackIndex >= 4` dan `<= 0` pada handler klik manual agar klik cepat beruntun tidak melompat melebihi batas buffer track.
     - Menambahkan *safety fallback timeout* 650ms untuk menjamin reposisi instan tetap berjalan meskipun event `transitionEnd` terlambat dari browser.

 16. Restorasi Palet Warna Hero Section, Highlight Card Aksen Emas Kuningan (`index.html`), dan Indikator Vital Wilayah:
   - Restorasi Gradien Warna Latar Hero Section:
     - Mengubah gradien gelap pekat (`from-[#021815] via-[#002f2b] to-[#011412]`) kembali ke warna resmi Pemkab Kuningan yang hidup dan bermartabat sesuai referensi [index.html](file:///home/jrilym/Projects/Next/desa/index.html): `bg-gradient-to-br from-[#003733] via-[#005851] to-[#009388]`.
     - Menghilangkan lapisan vignette hitam pekat dan menggantinya dengan tekstur dot matrix sivik halus (`radial-gradient`) serta ambient atmospheric glow emas `#eda50c` dan teal `#009388`.
     - Siluet landmark Gerbang Kuningan dipadukan secara harmonis menggunakan `mix-blend-screen` dan opacity lembut agar tetap estetik tanpa menurunkan keterbacaan teks.
   - Restorasi Box Kanan Hero Card dengan Aksen Kuning Emas Khas Kuningan:
     - Mengadopsi struktur visual card dari `index.html` dengan latar belakang *frosted glass* transparan `bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#eda50c]/50`.
     - Menampilkan emblem kotak emas khas `KD` bergradien Kuningan (`bg-[#eda50c] text-slate-950 font-extrabold`) dipadukan dengan badge status Desa Mandiri IDM 2026.
     - Menyematkan rincian layanan, jam operasional balai desa (Senin - Jumat 07.30 - 15.00 WIB) dengan badge aktif *Buka Sekarang*, ringkasan sensus 3 dusun terpadu, serta semboyan resmi Kuningan: *"Melesat Ngudag Jaman, Ngakar Kuat Purwadaksi"*.
   - Transformasi Strip Metrik Bawah Hero (*Bottom Horizon Metric Strip*):
     - Mengganti data teknis elevasi/topografi dengan 4 indikator vital desa yang relevan langsung bagi warga dan pemdes:
       1. **Jumlah Kepala Keluarga:** `492 Kepala Keluarga` (1.660 Jiwa • 100% Sensus Terdata).
       2. **Potensi Pertanian Organik:** `64 Ha Padi Organik` (Lumbung Pangan Dusun Pahing).
       3. **Potensi Mata Air Alami:** `45 Liter / Detik` (Debit Mata Air Purba Cikaduran Dusun Puhun).
       4. **Sentra Ekonomi & Potensi Unggulan:** `3 Klaster Potensi` (Tani Organik, Peternakan Sapi & UMKM Olahan Ubi).

 17. Penyesuaian Dimensi Landmark Gerbang Kuningan (Tinggi Proporsional & Flank Putih Full-Width):
   - Penyelesaian Masalah Skala Gambar (Mencegah "Kegedan" saat Full-Width):
     - Mempertahankan tinggi asli landmark gerbang Kuningan yang proporsional dan tidak mendominasi layar (`h-[150px] sm:h-[175px] md:h-[190px]`).
     - Membuat aset panorama [frontend/public/kuningan-gate-wide.png](file:///home/jrilym/Projects/Next/desa/frontend/public/kuningan-gate-wide.png) berukuran 2400 x 179 piksel: gerbang landmark tetap berada di tengah dengan dimensi asli, sementara area kiri dan kanannya di-insert warna putih murni (`#ffffff`) yang identik dengan background foto gerbang.
     - Menggunakan `mix-blend-multiply` dengan container `inset-x-0 bottom-0 w-full justify-center`: area putih di kiri, tengah, dan kanan secara mulus ter-multiplikasi sempurna dengan gradien teal Kuningan, menghilangkan batas potongan blocking putih tanpa memperbesar ukuran gerbang secara berlebihan.
     - Siluet gerbang, kuda emas, dan pilar Kuningan tetap tampil estetik, proporsional, dan terintegrasi di dasar hero section di atas strip indikator data desa.

---

## 🎯 Status & Pekerjaan Selanjutnya (Next Action)
- [x] Penghapusan modul cetak surat dan agenda persuratan dari navigasi publik dan backpanel.
- [x] Standardisasi wilayah menjadi 3 dusun resmi: Dusun Manis, Dusun Pahing, Dusun Puhun.
- [x] Pembuatan Modul Sensus Kesejahteraan Keluarga (Per KK) dengan kalkulator auto-desil dan kriteria RTLH.
- [x] Pembuatan fitur ekspor CSV dan lembar cetak PDF A4 berdesain terpersonalisasi.
- [x] Pembuatan section Profil 3 Dusun dan Peta Geografis Sebaran Fasilitas di portal publik.
- [x] Redesign Hero Section & Profil 3 Dusun dengan standard taste frontend anti-slop.
- [x] Implementasi Full-Photo Cinematic Carousel Profil 3 Dusun (Opsi 1: anti card-bertumpuk).
- [x] Implementasi Infinite Seamless Loop (1, 2, 3, 1, 2, 3) & Auto-Slide 5s dengan navigasi panah di dalam gambar.
- [x] Perbaikan Timer Auto-Slide (100% pause saat hover, dan instan reset timer saat klik panah/indikator).
- [x] Restorasi palet warna Hero section kembali ke nuansa Kuningan Teal [index.html](file:///home/jrilym/Projects/Next/desa/index.html) (tidak pekat hitam).
- [x] Restorasi Home Cockpit Card dengan aksen kotak kuning emas KD, jam buka, dan motto resmi Kuningan.
- [x] Pembaruan strip data bawah Hero dengan 4 indikator vital (492 KK, 64 Ha Padi, 45 L/s Air, 3 Klaster Potensi).
- [x] Penyesuaian dimensi Gerbang Kuningan: tinggi asli proporsional di tengah, flank kiri-kanan putih seamless 2400px tanpa blocking putih.
- [x] Verifikasi build Next.js 16 (Turbopack) sukses 100% tanpa error TypeScript/JSX.
- [ ] Persiapan skema migrasi tabel Supabase (`sensus_kk`, `fasilitas_desa`) jika data akan dipersistensikan ke backend PostgreSQL.
- [ ] Uji coba lapangan simulasi pendataan sensus oleh Kepala Dusun.





