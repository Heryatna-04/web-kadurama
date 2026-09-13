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

### Modul F-01: Portal Publik Warga (Landing Page)
- **FR-01.1 (Profil & Branding Desa):** Menampilkan identitas resmi Desa Kadurama, visi misi, potensi desa, dan lokasi geografis.
- **FR-01.2 (Direktori Layanan Surat & Persyaratan):** Menampilkan daftar seluruh surat administrasi yang dapat dibuat di kantor desa beserta checklist syarat dokumen asli dan fotokopi yang harus dibawa.
- **FR-01.3 (Transparansi Statistik):** Menampilkan visualisasi ringkas jumlah penduduk, jumlah KK, pembagian RT/RW, dan ringkasan pagu APBDes tahun berjalan.
- **FR-01.4 (Pusat Kabar & Pengumuman):** Menampilkan feed berita desa, agenda kegiatan masyarakat, dan pengumuman mendesak dari kepala desa.
- **FR-01.5 (Kontak Pelayanan):** Menampilkan jam operasional loket kantor desa, nomor layanan WhatsApp, dan denah kantor.

### Modul F-02: Manajemen Kependudukan (Master Resident Data)
- **FR-02.1 (Pencarian NIK/Nama Cepat):** Operator dapat mencari data warga secara live search dengan waktu respons < 100ms.
- **FR-02.2 (CRUD Data Warga):** Tambah warga baru, edit informasi (pindah alamat, perubahan status perkawinan, pekerjaan), dan arsipkan data warga.
- **FR-02.3 (Validasi Data Pokok):** Validasi format NIK 16 digit, tanggal lahir, dan relasi kepala keluarga.

### Modul F-03: Generator & Percetakan Surat Administrasi
- **FR-03.1 (Pemilihan Template Surat):** Mendukung template standar:
  - SKU (Surat Keterangan Usaha)
  - SKTM (Surat Keterangan Tidak Mampu - Umum, Sekolah, KIS/BPJS)
  - SKD (Surat Keterangan Domisili Warga / Usaha)
  - SKCK (Surat Pengantar Catatan Kepolisian)
  - SKK (Surat Keterangan Kematian / Kelahiran)
  - SKBM (Surat Keterangan Belum Menikah)
- **FR-03.2 (Auto-fill Data Pemohon):** Saat NIK warga dipilih, sistem otomatis mengisi nama, tempat/tanggal lahir, jenis kelamin, agama, status, pekerjaan, dan alamat ke template surat.
- **FR-03.3 (Kustomisasi Parameter Surat):** Form isian khusus sesuai jenis surat (contoh: nama usaha & modal untuk SKU, keperluan sekolah/rumah sakit untuk SKTM).
- **FR-03.4 (Penomoran Otomatis):** Generator penomoran surat resmi desa sesuai kode klasifikasi kearsipan (misal: `470/042/Kdr/IX/2026`).
- **FR-03.5 (Pratinjau & Cetak PDF):** Pratinjau interaktif format cetak kertas ukuran standar (A4 / F4) lengkap dengan Kop Surat Pemdes Kadurama, stempel/TTD placeholder, QR Code verifikasi, dan tombol perintah cetak (*Print/Save PDF*).

### Modul F-04: Log & Arsip Persuratan
- **FR-04.1 (Buku Agenda Surat Keluar):** Setiap surat yang dicetak otomatis tercatat dalam register surat keluar (Nomor, Jenis, NIK/Nama Warga, Tanggal, Operator).
- **FR-04.2 (Filter & Ekspor Rekapitulasi):** Operator dapat memfilter arsip berdasarkan rentang tanggal atau jenis surat.

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
