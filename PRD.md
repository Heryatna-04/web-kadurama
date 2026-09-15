# 📋 Product Requirement Document (PRD)
## Sistem Pemdes Terintegrasi Desa Digital Kadurama

**Versi:** 2.0.0 (Pivot Pasca-Meeting Klien)  
**Status:** Approved (Phase 1 SDLC - Updated)  
**Tanggal:** 15 September 2026  
**Target Rilis:** v2.0 MVP  

---

## 1. Executive Summary & Visi Produk
Sistem Pemdes Terintegrasi **Desa Kadurama** adalah platform tata kelola pemerintahan desa berbasis digital modern yang berpusat pada akurasi data kependudukan mikro dan keterbukaan informasi publik:
1. **Portal Publik Desa (Kanal Informasi & Geografis Warga):** Menghadirkan profil 3 Dusun (Manis, Pahing, Puhun), peta geografis interaktif & kondisi wilayah, transparansi APBDes 2026, kabar kegiatan desa, dan direktori fasilitas publik desa.
2. **Backpanel Admin Data Center & Sensus Dusun:** Pusat pendataan mikro kesejahteraan warga berbasis per Kepala Keluarga (KK) yang diinput oleh Kepala Dusun (Kadus) dan operator desa. Meliputi estimasi status desil ekonomi, kepatuhan pembayaran PBB-P2, kelayakan fisik rumah (RTLH), kerentanan sosial/kesehatan, serta rekam bansos, lengkap dengan fitur ekspor Excel dan lembar profil keluarga terpersonalisasi format PDF. Modul generator persuratan resmi ditiadakan dari alur utama sesuai hasil kesepakatan rapat dengan klien desa.

---

## 2. Problem Statement & Latar Belakang Masalah
1. **Kepanikan Pendataan Saat Bantuan Pemerintah Turun Mendadak:** Ketika ada kuota program dari kementerian/Pemkab (seperti PKH, BLT, RTLH/Bedah Rumah, bantuan bibit pertanian, atau penanganan stunting), perangkat desa kesulitan dan panik menyensus ulang warga secara manual door-to-door, memakan waktu lama, dan berisiko salah sasaran.
2. **Ketiadaan Data Mikro Terpadu Per Dusun:** Data kondisi rumah (atap, lantai, dinding, jamban), status pembayaran PBB-P2, dan kerentanan ekonomi (desil) masih terpisah-pisah di buku catatan Kadus atau RT tanpa format digital terpusat.
3. **Kebutuhan Visualisasi Geografis & Potensi 3 Dusun:** Warga dan pemangku kepentingan luar desa membutuhkan gambaran jelas mengenai peta kondisi wilayah, batas dusun, topografi, dan persebaran fasilitas umum di Kadurama.

---

## 3. Profil Pengguna & Persona
1. **Warga Desa & Publik:**
   - Mengakses portal publik melalui smartphone atau PC.
   - Melihat profil 3 dusun, peta geografis, berita kegiatan, dan transparansi APBDes.
2. **Kepala Dusun (Kadus Manis, Pahing, Puhun):**
   - Bertanggung jawab melakukan survei dan memperbarui data sensus warga di dusunnya masing-masing.
   - Mengisi kuesioner profil KK: kondisi rumah, pajak PBB, kerentanan lansia/stunting, dan mata pencaharian.
3. **Kasi Kesejahteraan / Administrator Balai Desa:**
   - Menyaring data keluarga saat ada alokasi bantuan pemerintah (filter instan RTLH, Desil 1-2, balita rawan stunting).
   - Mencetak Lembar Verifikasi Lapangan PDF terpersonalisasi untuk tim dinas dan mengekspor rekapitulasi data sensus ke Excel.
   - Mengelola publikasi berita kabar desa dan transparansi anggaran APBDes.

---

## 4. Ruang Lingkup Fitur (Feature Scope)

### A. Web Portal Publik (Landing Page)
- **Hero Section:** Selamat datang di Desa Kadurama berlatar landmark Gerbang Kuningan 100vh dan Civic Cockpit glassmorphism.
- **Profil & Potensi 3 Dusun:** Rincian demografi, potensi unggulan, dan fasilitas Dusun Manis, Dusun Pahing, dan Dusun Puhun.
- **Peta Geografis & Kondisi Wilayah:** Visualisasi peta wilayah desa, batas astronomis & administratif, elevasi/topografi, serta titik fasilitas umum (Balai Desa, Posyandu, Pustu, SD, BUMDes, Mata Air).
- **Transparansi APBDes 2026:** Ringkasan infografis pendapatan, belanja 5 bidang, dan serapan berjalan dengan animasi GSAP.
- **Kabar & Berita Desa:** Publikasi berita terbit yang dikelola langsung dari panel admin.
- **Pamong & Aparatur Desa:** Direktori kepala desa, sekdes, kaur, dan 3 kepala dusun.
- **Kontak & Lokasi Balai Desa:** Jam operasional dan kontak WhatsApp informasi warga.

### B. Backpanel Admin Data Center Pemdes
- **Sensus & Pendataan Kesejahteraan Warga (Per KK):**
  - Input & edit kuesioner sensus keluarga berbasis NIK Kepala Keluarga.
  - Penilaian Desil Kesejahteraan (Desil 1: Sangat Miskin s.d. Desil 4+: Sejahtera).
  - Status Kepatuhan Pajak Bumi dan Bangunan (PBB-P2).
  - Indikator Kelayakan Fisik Rumah (RTLH vs Layak: jenis lantai, dinding, atap, jamban, air bersih, listrik).
  - Profil Kerentanan Sosial (Lansia tunggal, balita/stunting, disabilitas, anak putus sekolah).
  - Bansos Tracker (PKH, BPNT, BLT-DD, Non-Bansos).
  - Filter cepat per 3 Dusun, per kategori program, dan status desil.
  - Ekspor data sensus ke format Excel (XLSX/CSV).
  - Ekspor Lembar Profil & Verifikasi Keluarga format PDF terpersonalisasi dengan kop resmi, QR verifikasi, dan palet Kuningan Teal & Gold.
- **Master Data Kependudukan (3 Dusun):**
  - Tabel master penduduk warga desa Kadurama terkelompok per Dusun Manis, Pahing, Puhun.
  - Aksi perbarui data internal dan sinkronisasi SIAK Dukcapil.
  - Reusable Pagination (10 dan 25 baris per halaman).
- **Manajemen Kabar Desa:**
  - Tambah, edit, hapus, dan toggle status terbit/draf artikel berita publik.
- **Kelola Transparansi APBDes 2026:**
  - Penyesuaian pagu anggaran, realisasi belanja per bidang, dan kalkulasi serapan otomatis.

---

## 5. Kriteria Sukses (Success Metrics)
- **Kesiapan Data Bantuan:** Waktu persiapan data calon penerima bansos/RTLH terpangkas dari beberapa hari menjadi < 1 menit menggunakan filter cerdas sensus.
- **Akurasi Data Dusun:** 100% data keluarga teridentifikasi status desil dan PBB-P2 oleh masing-masing Kadus.
- **Kualitas Dokumen Verifikasi:** Lembar profil PDF terpersonalisasi siap cetak dengan layout profesional berstandar pemkab.
- **Zero Em-Dash & Anti-Slop:** Seluruh antarmuka mempertahankan tipografi sans-serif bersih (Plus Jakarta Sans) tanpa dekorasi berlebihan.

---

## 6. Batasan & Dependensi (Assumptions & Constraints)
- **Generator Surat Ditiadakan:** Menu cetak surat permohonan dan buku agenda surat masuk/keluar dihapus sesuai kesepakatan rapat klien.
- **Cakupan Wilayah:** Data disesuaikan menjadi 3 dusun resmi di Desa Kadurama (Dusun Manis, Dusun Pahing, Dusun Puhun).
