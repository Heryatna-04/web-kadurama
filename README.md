# 🌾 sistem-desa: Sistem Pemdes Terintegrasi Desa Kadurama

Platform tata kelola pemerintahan desa digital modern yang mengintegrasikan **Portal Informasi Publik (Landing Page)** dan **Backpanel Pelayanan Administrasi & Pembuatan Surat Terpadu** untuk Desa Kadurama, Kec. Ciawigebang, Kab. Kuningan, Jawa Barat.

---

## 🚀 Fitur Utama

### 1. Portal Publik Desa (Landing Page Modern Civic Tech)
- **Profil & Potensi Desa:** Visi-misi, sejarah wilayah, dan potensi 5 dusun (Manis, Pahing, Puhun, Wage, Kliwon).
- **Katalog & Panduan Syarat Dokumen Surat:** Checklist syarat berkas (KTP, KK, Pengantar RT/RW) untuk warga sebelum datang ke kantor desa.
- **Transparansi APBDes 2026:** Infografis realisasi anggaran (Pendapatan Desa, Belanja Desa, Pembiayaan Netto).
- **Struktur Perangkat Desa:** Direktori kepala desa, sekdes, kasi, kaur, dan kadus.
- **Rekapitulasi Pelayanan Surat:** Statistik publik penerbitan surat desa secara transparan.
- **Lapak Desa / UMKM:** Etalase produk unggulan pertanian dan olahan warga desa.
- **Widget Layanan:** Jadwal operasional loket kantor desa, agenda kegiatan, status IDM (Desa Maju), dan kontak WhatsApp loket.

### 2. Backpanel Pelayanan Administrasi & Persuratan (Loket Staf Desa)
- **Live Search Kependudukan:** Pencarian instan data warga berdasarkan NIK 16 digit atau Nama.
- **Generator Dokumen Cetak Format Resmi (A4/F4):**
  - Surat Keterangan Usaha (SKU)
  - Surat Keterangan Tidak Mampu (SKTM)
  - Surat Pengantar Catatan Kepolisian (SKCK)
  - Surat Keterangan Domisili
  - Surat Keterangan Kelahiran / Kematian / Belum Menikah
- **Fitur Persuratan Resmi:** Kop resmi Pemdes Kadurama, penomoran otomatis, barcode verifikasi, dan tombol langsung cetak (*Print to PDF*).
- **Arsip & Agenda Surat Keluar:** Pencatatan riwayat penomoran surat secara rapi.

---

## 🛠️ Tech Stack & Arsitektur
- **Frontend / Web:** Next.js (App Router, Tailwind CSS, Lucide Icons)
- **Backend / REST API:** Node.js Express.js (TypeScript)
- **Shared Types:** TypeScript Contract & Schemas (`packages/shared`)
- **Database Layer:** Repository Pattern (In-memory mock store, siap migrasi ke Supabase PostgreSQL)
- **Monorepo:** NPM Workspaces / Turborepo

---

## 📁 Dokumentasi SDLC & Spesifikasi
- [PRD.md](PRD.md) — Product Requirement Document
- [SRS.md](SRS.md) — Software Requirement Specification
- [DEVELOPMENT_LOG.md](DEVELOPMENT_LOG.md) — Development Log & Roadmap
- [mockups/index.html](mockups/index.html) — Mockup Interaktif Landing Page & Backpanel Cetak Surat

---

## 👥 Pengembang & Lisensi
Dikembangkan untuk Pemerintah Desa Kadurama, Kabupaten Kuningan.  
Lisensi: MIT.
