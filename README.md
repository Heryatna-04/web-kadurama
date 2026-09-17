# 🌾 sistem-desa: Sistem Pemdes Terintegrasi Desa Kadurama

Platform tata kelola pemerintahan desa digital modern yang mengintegrasikan **Portal Informasi Publik (Landing Page)** dan **Backpanel Pelayanan Administrasi & Pembuatan Surat Terpadu** untuk Desa Kadurama, Kec. Ciawigebang, Kab. Kuningan, Jawa Barat.

---

## 🚀 Fitur Utama

### 1. Portal Publik Desa (Landing Page Modern Civic Tech)
- **Profil & Potensi 3 Dusun Resmi:** Visi-misi, sejarah wilayah, dan monografi spasial 3 dusun riil: **Dusun I Pahing**, **Dusun II Wage**, dan **Dusun III Manis**.
- **Peta Citra Geospasial (GIS):** Pemetaan batas definitif desa berbasis 125 koordinat resmi Dukcapil Kemendagri (Ref: 32.08.10.2002) dan citra satelit resolusi tinggi.
- **Katalog & Panduan Syarat Dokumen Surat:** Checklist syarat berkas (KTP, KK, Pengantar RT/RW) untuk warga sebelum datang ke kantor desa.
- **Transparansi APBDes 2026:** Infografis interaktif realisasi anggaran (Pendapatan Desa Rp 898 Juta, Belanja Desa Rp 856 Juta).
- **Struktur Perangkat Desa:** Direktori kepala desa Samir Syarifudin, sekretaris desa, kepala dusun, kaur, dan kasi.
- **Warta & Agenda Kegiatan:** Publikasi berita pembangunan, penyaluran bansos, dan agenda desa terintegrasi.
- **Widget Layanan:** Jadwal operasional loket balai desa (08:00 - 15:00 WIB), status IDM, dan kontak resmi.

### 2. Backpanel Pelayanan Administrasi & Persuratan (Loket Staf Desa)
- **Data Center & Sensus Kependudukan:** Manajemen master penduduk 3 dusun, data kartu keluarga (sensus_kk), dan klasifikasi desil sosial ekonomi.
- **Generator Dokumen Cetak Format Resmi (A4/F4):**
  - Surat Keterangan Usaha (SKU)
  - Surat Keterangan Tidak Mampu (SKTM)
  - Surat Pengantar Catatan Kepolisian (SKCK)
  - Surat Keterangan Domisili
  - Surat Keterangan Kelahiran / Kematian / Belum Menikah
- **Fitur Persuratan Resmi:** Kop resmi Pemdes Kadurama, penomoran otomatis, barcode verifikasi, dan tombol langsung cetak (*Print to PDF*).
- **Audit Logs & Keamanan:** Pencatatan setiap aktivitas login dan modifikasi data aparatur secara transparan.

---

## 🛠️ Tech Stack & Arsitektur
- **Frontend:** Next.js 16 (App Router, Turbopack, Tailwind CSS, Leaflet GIS, Lucide Icons)
- **Database & Backend Services:** Supabase PostgreSQL (Database, Auth, Audit Logging, Row-Level Security)
- **Typography:** Clean sans-serif (Plus Jakarta Sans)

---

## 📁 Dokumentasi SDLC & Spesifikasi
- [AKUN_DEFAULT_PAMONG.md](AKUN_DEFAULT_PAMONG.md) — **Dokumentasi Kredensial & Role Akun Resmi Aparatur**
- [PRD.md](PRD.md) — Product Requirement Document
- [SRS.md](SRS.md) — Software Requirement Specification
- [DEVELOPMENT_LOG.md](DEVELOPMENT_LOG.md) — Development Log & Roadmap

---

## 👥 Pengembang & Lisensi
Dikembangkan untuk Pemerintah Desa Kadurama, Kabupaten Kuningan.  
Lisensi: MIT.
