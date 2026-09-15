# 📐 Software Requirement Specification (SRS)
## Sistem Pemdes Terintegrasi Desa Digital Kadurama

**Kode Dokumen:** SRS-KADURAMA-2026-01  
**Target Arsitektur:** Monorepo (`apps/web`, `apps/api`, `packages/shared`)  
**Status:** Approved (Phase 1 SDLC)  

---

## 1. Pendahuluan & Gambaran Umum Sistem

Sistem Pemdes Terintegrasi Desa Kadurama dibangun menggunakan arsitektur web modern yang memisahkan aplikasi presentasi (*frontend* berbasis Next.js App Router) dan layanan API bisnis (*backend* berbasis Node.js Express.js), dengan repositori bersama (*shared types & validation*) untuk menjamin konsistensi kontrak data.

---

## 2. Kebutuhan Fungsional (Functional Requirements)

### Modul F-01: Portal Publik Warga (Landing Page & Geografis)
- **FR-01.1 (Profil & Peta Geografis 3 Dusun):** Menampilkan identitas resmi Desa Kadurama, batas wilayah, elevasi topografi, peta interaktif kondisi wilayah, dan sebaran fasilitas desa di Dusun Manis, Dusun Pahing, dan Dusun Puhun.
- **FR-01.2 (Pusat Informasi & Persyaratan Warga):** Menampilkan panduan berkas administrasi dan jam operasional balai desa tanpa tombol pembuatan surat online.
- **FR-01.3 (Transparansi APBDes 2026):** Menampilkan visualisasi interaktif anggaran desa, 5 bidang belanja, dan serapan berjalan dengan animasi GSAP.
- **FR-01.4 (Pusat Kabar & Pengumuman):** Menampilkan feed berita desa terkini yang terhubung langsung dengan status terbit di panel admin.
- **FR-01.5 (Aparatur Pemdes & Kontak):** Menampilkan profil kepala desa, sekretaris desa, kaur, dan 3 kepala dusun beserta kontak layanan.

### Modul F-02: Master Data Kependudukan (3 Dusun Kadurama)
- **FR-02.1 (Pencarian NIK/Nama Cepat):** Operator dan Kadus dapat mencari data warga secara live search dengan waktu respons < 100ms.
- **FR-02.2 (Pengelompokan 3 Dusun):** Data warga terstruktur rapi berdasarkan 3 Dusun (Manis, Pahing, Puhun) serta RT dan RW.
- **FR-02.3 (Sinkronisasi & Pembaruan Internal):** Aksi koreksi data internal warga dan tombol sinkronisasi SIAK Dukcapil satuan maupun massal.

### Modul F-03: Sensus & Profil Kesejahteraan Keluarga (Per KK)
- **FR-03.1 (Formulir Pendataan Sensus Mikro):** Kepala Dusun (Kadus) dan operator menginput survei keluarga berbasis Nomor KK dan NIK Kepala Keluarga.
- **FR-03.2 (Penilaian Status Desil):** Penentuan desil ekonomi (Desil 1: Sangat Miskin, Desil 2: Miskin, Desil 3: Hampir Miskin, Desil 4+: Rentan/Sejahtera) secara terintegrasi berdasarkan kondisi aset dan penghasilan.
- **FR-03.3 (Kepatuhan Pajak PBB-P2):** Pencatatan status pembayaran Pajak Bumi dan Bangunan tahun berjalan (Lunas / Belum Lunas).
- **FR-03.4 (Indikator Fisik Rumah & RTLH):** Pendataan kelayakan atap, lantai, dinding, ketersediaan jamban/sanitasi pribadi, sumber air bersih, dan daya listrik PLN (kriteria program Bedah Rumah / PUPR).
- **FR-03.5 (Kerentanan Sosial & Bansos Tracker):** Identifikasi anggota keluarga lansia tunggal, balita rawan stunting, disabilitas, dan status penerima bansos (PKH, BPNT, BLT-DD, Non-Bansos) untuk mencegah tumpang tindih bantuan.
- **FR-03.6 (Ekspor Data & Lembar PDF Terpersonalisasi):** Fitur unduh rekap data sensus ke Excel (CSV/XLSX) dan cetak Lembar Profil & Verifikasi Lapangan format PDF berdesain rapi (Kop Resmi Desa Kadurama, palet Kuningan Teal `#009388` & Gold `#eda50c`, barcode verifikasi).

---

## 3. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### NFR-01: Kinerja & Responsivitas (Performance)
- Halaman publik Next.js dioptimalkan dengan SSG/ISR untuk kecepatan loading tinggi (< 1 detik FCP pada jaringan 4G standar).
- Backend Express.js merespons permintaan pencarian data warga di bawah 150 milidetik.
- Tampilan responsif sempurna untuk resolusi seluler (360px) hingga layar desktop (1920px).

### NFR-02: Desain & Aksesibilitas (UI/UX Taste)
- **Design Persona:** *Modern Emerald Civic Tech*. Warna primer emerald forest (`#064e3b` / `#059669`), aksen slate lembut (`#0f172a`, `#f8fafc`), dengan tipografi sans-serif modern (Inter / Plus Jakarta Sans).
- **Anti-Slop:** Bebas dari tipografi bergaya marker/dekoratif font pada area fungsional. Tata letak kartu informasi proporsional, hierarki visual tegas, dan kontras warna memenuhi standar WCAG AA.
- **Bebas Istilah Non-Standar:** Menghindari terminologi yang tidak pantas untuk administrasi pemerintahan.

### NFR-03: Keamanan & Integritas Data (Security)
- Sanitasi input form terhadap serangan XSS dan SQL Injection.
- Pemisahan akses rute API admin dengan token otentikasi / session middleware.
- Validasi skema data ketat (menggunakan Zod pada backend dan frontend).

### NFR-04: Kompatibilitas & Portabilitas Database
- Arsitektur backend Express menggunakan *Repository Pattern*.
- Pada tahap awal data dilayani oleh in-memory/JSON mock store yang memiliki interface identik dengan Supabase Database Client, sehingga transisi ke Supabase PostgreSQL tidak memerlukan refactoring pada business logic layer.

---

## 4. Rencana Arsitektur & Struktur Folder Monorepo

```text
desa/
├── apps/
│   ├── web/                     # Next.js 14/15 (App Router, Tailwind CSS, Lucide Icons)
│   │   ├── app/
│   │   │   ├── (public)/        # Landing page, berita, panduan surat, profil
│   │   │   └── admin/           # Backpanel pelayanan pemdes (dashboard, surat, warga)
│   │   ├── components/
│   │   │   ├── ui/              # Atom/Design System (Button, Input, Modal, Badge)
│   │   │   ├── public/          # Header, Hero, ServiceGrid, Statistics, Footer
│   │   │   └── admin/           # SuratGenerator, ResidentPicker, PrintableLetter
│   │   └── lib/                 # API client, formatting helpers
│   └── api/                     # Express.js REST API Server
│       ├── src/
│       │   ├── routes/          # /api/residents, /api/letters, /api/news, /api/stats
│       │   ├── controllers/     # Handlers logika bisnis
│       │   ├── services/        # Service layer & letter generator
│       │   ├── repositories/    # In-memory store (Supabase-ready interface)
│       │   └── index.ts         # Server entry point
├── packages/
│   └── shared/                  # Shared TypeScript interfaces, types & constants
│       ├── src/
│       │   ├── types/           # Resident, Letter, LetterType, VillageProfile
│       │   └── schemas/         # Validasi Zod
│       └── package.json
├── PRD.md                       # Product Requirements Document
├── SRS.md                       # Software Requirements Specification
├── DEVELOPMENT_LOG.md           # Tracking roadmap, git streak, dan status sesi
└── package.json                 # Monorepo root workspace (npm / pnpm / yarn)
```

---

## 5. Matriks Ketertelusuran Kebutuhan (Traceability Matrix)

| ID Kebutuhan | Komponen Frontend | Endpoint Backend | Repository / Data Store |
| :--- | :--- | :--- | :--- |
| FR-01.1 - Profil Desa | `apps/web/app/(public)/page.tsx` | `GET /api/public/profile` | `VillageRepository` |
| FR-01.2 - Syarat Surat | `apps/web/app/(public)/layanan-surat/` | `GET /api/public/letter-types` | `LetterRepository` |
| FR-02.1 - Pencarian NIK | `apps/web/app/admin/surat/baru/` | `GET /api/residents?search=` | `ResidentRepository` |
| FR-02.2 - CRUD Warga | `apps/web/app/admin/kependudukan/` | `POST, PUT, DELETE /api/residents` | `ResidentRepository` |
| FR-03.1..5 - Cetak Surat | `apps/web/app/admin/surat/` | `POST /api/letters/generate` | `LetterRepository` |
| FR-04.1 - Log Arsip | `apps/web/app/admin/surat/arsip/` | `GET /api/letters` | `LetterRepository` |
