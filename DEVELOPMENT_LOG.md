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

---

## 🎯 Status & Pekerjaan Selanjutnya (Next Action)
- [x] Penghapusan modul cetak surat dan agenda persuratan dari navigasi publik dan backpanel.
- [x] Standardisasi wilayah menjadi 3 dusun resmi: Dusun Manis, Dusun Pahing, Dusun Puhun.
- [x] Pembuatan Modul Sensus Kesejahteraan Keluarga (Per KK) dengan kalkulator auto-desil dan kriteria RTLH.
- [x] Pembuatan fitur ekspor CSV dan lembar cetak PDF A4 berdesain terpersonalisasi.
- [x] Pembuatan section Profil 3 Dusun dan Peta Geografis Sebaran Fasilitas di portal publik.
- [x] Redesign Hero Section & Profil 3 Dusun dengan standard taste frontend anti-slop (Asymmetric Bento).
- [x] Verifikasi build Next.js 16 (Turbopack) sukses 100% tanpa error TypeScript/JSX.
- [ ] Persiapan skema migrasi tabel Supabase (`sensus_kk`, `fasilitas_desa`) jika data akan dipersistensikan ke backend PostgreSQL.
- [ ] Uji coba lapangan simulasi pendataan sensus oleh Kepala Dusun.

