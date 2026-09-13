# 📋 Product Requirement Document (PRD)
## Sistem Pemdes Terintegrasi Desa Digital Kadurama

**Versi:** 1.0.0  
**Status:** Approved (Phase 1 SDLC)  
**Tanggal:** 13 September 2026  
**Target Rilis:** v1.0 MVP  

---

## 1. Executive Summary & Visi Produk
Sistem Pemdes Terintegrasi **Desa Kadurama** adalah platform tata kelola pemerintahan desa berbasis digital modern yang menggabungkan:
1. **Portal Publik Desa (Landing Page & Pusat Informasi Warga):** Menghadirkan transparansi program desa, profil wilayah & kepemimpinan, statistik kependudukan ringkas, agenda, transparansi anggaran, serta direktori persyaratan berkas administrasi.
2. **Backpanel Admin Pelayanan Terpadu (Pemerintahan Desa):** Sistem internal yang mempermudah operator/staf desa dalam melayani pembuatan surat keterangan resmi secara instan dengan generator cetak format standar (PDF) berbasis data kependudukan (NIK/KK) yang terintegrasi, cepat, akurat, dan minim kesalahan ketik manual.

---

## 2. Problem Statement & Latar Belakang Masalah
1. **Proses Surat Menyurat Manual Lambat:** Pembuatan surat permohonan warga (SKTM, SKU, Domisili, Pengantar SKCK) masih sering menggunakan template Word terpisah-pisah, rawan salah input nomor surat, format tidak konsisten, dan memakan waktu tunggu warga di kantor desa.
2. **Data Kependudukan Terfragmentasi:** Operator desa kesulitan mencocokkan data warga secara instan saat warga datang membawa KTP/KK tanpa database kependudukan lokal yang responsif.
3. **Keterbatasan Akses Informasi Publik:** Warga sering datang ke kantor desa tanpa membawa syarat berkas lengkap karena ketiadaan portal informasi terpusat yang informatif dan mudah diakses dari ponsel pintar.

---

## 3. Profil Pengguna & Persona
1. **Warga Desa Kadurama (Masyarakat Umum):**
   - Mengakses portal publik melalui ponsel pintar/PC.
   - Mencari informasi syarat dokumen surat sebelum ke kantor desa.
   - Melihat berita kegiatan desa, transparansi anggaran, dan profil aparat desa.
2. **Operator / Staf Pelayanan Administrasi Desa:**
   - Menghadapi warga langsung di loket pelayanan kantor desa.
   - Menginput NIK/nama warga, memilih jenis surat, mengisi parameter dinamis, dan langsung mencetak (*print*) surat dengan format resmi dan nomor surat otomatis.
   - Memperbarui data warga atau master kependudukan.
3. **Kepala Desa & Sekretaris Desa (Pimpinan):**
   - Memantau volume pelayanan surat harian/bulanan.
   - Memverifikasi riwayat penerbitan surat dan arsip pelayanan.

---

## 4. Ruang Lingkup Fitur (Feature Scope)

### A. Web Portal Publik (Landing Page)
- **Hero Section:** Selamat datang di Desa Kadurama, tagline modern, akses cepat ke panduan layanan & kontak kantor.
- **Profil & Demografi Singkat:** Peta statistik singkat penduduk (total warga, KK, mata pencaharian utama, luas wilayah).
- **Katalog Layanan Surat & Syarat:** Panduan lengkap dokumen apa saja yang wajib dibawa saat warga ke kantor desa untuk mengurus masing-masing jenis surat.
- **Berita & Pengumuman:** Publikasi kegiatan desa, musdes, penyaluran bansos, dan agenda resmi.
- **Transparansi Desa:** Ringkasan infografis APBDes (pendapatan, belanja, pembiayaan).
- **Struktur Perangkat Desa:** Direktori kepala desa, sekdes, kaur, dan kadus.
- **Kontak & Lokasi:** Peta kantor desa, jam operasional loket layanan, nomor WhatsApp aduan warga.

### B. Backpanel Admin Pelayanan Pemdes
- **Dashboard Overview:** Metrik jumlah surat terbit bulan ini, total warga terdaftar, surat terpopuler, dan grafik aktivitas pelayanan.
- **Generator & Cetak Surat Instan:**
  - Pilihan jenis surat:
    1. Surat Keterangan Usaha (SKU)
    2. Surat Keterangan Tidak Mampu (SKTM - Sekolah & Rumah Sakit)
    3. Surat Keterangan Domisili
    4. Surat Pengantar Catatan Kepolisian (SKCK)
    5. Surat Keterangan Kelahiran / Kematian
    6. Surat Keterangan Belum Menikah / Penghasilan
  - Input form adaptif sesuai jenis surat.
  - Preview cetak dokumen resmi (kop surat resmi desa, nomor surat otomatis, tanda tangan digital/manual barcode).
  - Ekspor/Cetak langsung ke PDF standar A4 / Folio.
- **Master Data Kependudukan:**
  - Manajemen data warga (NIK, No KK, Nama Lengkap, Tempat/Tgl Lahir, Jenis Kelamin, Agama, Pekerjaan, Alamat/RT/RW).
  - Fitur pencarian instan berdasarkan NIK atau Nama saat proses input surat.
- **Arsip & Log Surat Keluar:**
  - Riwayat seluruh surat yang telah dicetak lengkap dengan tanggal terbit, pemohon, dan operator yang memproses.
- **Autentikasi & Hak Akses:**
  - Login staf desa & administrator dengan proteksi sesi.

---

## 5. Kriteria Sukses (Success Metrics)
- **Waktu Layanan Surat:** Durasi pembuatan 1 surat resmi di loket desa terpangkas dari rata-rata 10–15 menit manual menjadi < 1 menit.
- **Konsistensi Format:** 100% surat resmi desa memiliki kop surat, margin, dan penomoran standar.
- **Aksesibilitas Informasi:** Warga mendapatkan panduan syarat administrasi yang jelas sebelum datang ke kantor desa.
- **Performa Antarmuka:** Waktu muat landing page < 1.5 detik (First Contentful Paint) dengan responsivitas tinggi di perangkat mobile.

---

## 6. Batasan & Dependensi (Assumptions & Constraints)
- **Database Phase:** Pada fase awal, modul Express backend menggunakan Provider/Repository Pattern dengan in-memory / mock database terstruktur yang kompatibel penuh untuk migrasi instan ke Supabase PostgreSQL pada tahap berikutnya.
- **Akses Surat:** Pengajuan surat dilakukan di kantor desa oleh operator (internal-only), tidak ada pengajuan mandiri warga di web publik pada rilis v1.0.
