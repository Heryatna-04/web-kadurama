# Pemetaan Data Website Desa Kadurama: Dinamis vs Dummy/Statis

Dokumen ini memetakan seluruh data yang digunakan pada website resmi Desa Kadurama, membedakan antara data yang **sudah dinamis tersambung ke database Supabase** dan data yang **masih bersifat dummy / hardcoded**, beserta kebutuhan tabel dan prioritas pengembangannya.

---

## 1. Ringkasan Status Database Supabase Saat Ini

| Tabel Supabase | Status Saat Ini | Terhubung ke Frontend? | Tersedia CRUD di `/master`? | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| `aparatur_users` | **Aktif** (8 akun pamong) | Ya (`/master`, autentikasi) | Parsial (Ganti kata sandi akun aktif) | Otentikasi riil login pamong & hak akses role |
| `residents` | **Aktif** (2 data terdaftar) | Ya (`/profil/demografi`, `/master`) | Ya (Full CRUD, Soft Delete, Impor SIAK) | Pusat data induk warga desa Kadurama |
| `sensus_kk` | **Aktif** (2 KK terdaftar) | Ya (`/profil/demografi`, `/master`) | Ya (Full CRUD, Cetak PDF, Desil SDGs) | Data sosial ekonomi & verifikasi kelayakan KK |
| `news_articles` | **Aktif** (5 warta resmi) | Ya (Beranda, `/berita`, `/berita/[slug]`) | Ya (Full CRUD, Slug dinamis, Audit Trail) | Publikasi kabar desa & keterbukaan informasi |
| `apbdes_summary` | **Aktif** (TA 2026) | Ya (Beranda, `/transparansi/apbdes`) | Ya (Edit Ringkasan Fiskal Pagu & Realisasi) | Realisasi pendapatan & belanja total desa |
| `apbdes_sectors` | **Aktif** (5 Bidang Belanja) | Ya (Beranda, `/transparansi/apbdes`) | Ya (Edit Pagu, Realisasi, & Keterangan) | Bidang 01 s.d. Bidang 05 APBDes 2026 |
| `audit_logs` | **Aktif** (Real-time timeline) | Ya (`/master` Tab 5) | Read-only (Mencatat aktor, role, & aksi) | Jejak audit kepatuhan & transparansi data |

---

## 2. Pemetaan Rinci Data yang Masih Dummy / Statis

### A. Agenda Kegiatan & Musyawarah Desa
* **Halaman Terkait:**
  - `/agenda`
  - Widget Kalender Kegiatan di Beranda (`page.tsx`)
* **Sumber Data Saat Ini:**
  - Statis di `newsData.ts` (`AGENDA_LIST`, 4 agenda mockup).
* **Masalah:**
  - Perubahan jadwal rapat, posyandu, atau pelatihan UMKM belum bisa diinput pamong secara mandiri dari panel admin.
* **Kebutuhan Solusi:**
  - Tabel Supabase baru: `agendas`
  - Kolom: `id`, `title`, `date`, `time`, `location`, `dusun`, `organizer`, `description`, `status` ("Akan Datang" | "Berlangsung" | "Selesai"), `is_deleted`.
  - Form CRUD di panel `/master` bagi role `master`, `sekdes`, dan `operator`.

---

### B. Pengumuman & Surat Edaran Resmi Kuwu
* **Halaman Terkait:**
  - `/pengumuman`
  - Banner Pemberitahuan Darurat di Beranda
* **Sumber Data Saat Ini:**
  - Statis di `newsData.ts` (`ANNOUNCEMENTS_LIST`, 4 edaran mockup).
* **Masalah:**
  - Surat edaran batas pelunasan PBB, jadwal libur pelayanan kantor balai, dan edaran bansos belum dapat diunggah langsung oleh sekretariat desa.
* **Kebutuhan Solusi:**
  - Tabel Supabase baru: `announcements`
  - Kolom: `id`, `number`, `title`, `category`, `date`, `valid_until`, `issuer`, `summary`, `content`, `is_urgent`, `file_url`, `is_deleted`.
  - Panel kelola di `/master` dengan kemampuan lampiran file dokumen resmi (PDF).

---

### C. Profil Pamong & Hierarki SOTK Pemerintahan
* **Halaman Terkait:**
  - `/profil/pemerintahan`
  - Seksi Aparatur Desa di Beranda
* **Sumber Data Saat Ini:**
  - Statis di `pamongData.ts` (`PAMONG_LIST`, 13 aparatur).
* **Masalah:**
  - Tabel `aparatur_users` saat ini hanya difokuskan untuk otentikasi login.
  - Data profil publik seperti NIP, foto HD, bio pengabdian, kategori tingkat SOTK, dan nomor kontak masih berada di file TypeScript lokal.
* **Kebutuhan Solusi:**
  - Sinkronisasi tabel `aparatur_users` atau buat tabel `pamong_profiles` yang memuat bio, NIP, urutan hierarki SOTK (Tingkat I–V), dan foto profil.
  - Fitur edit profil perangkat desa langsung dari `/master`.

---

### D. Agregat Demografi Wilayah Dusun
* **Halaman Terkait:**
  - `/dusun`
  - `/dusun/[slug]` (Dusun Manis, Pahing, Wage)
* **Sumber Data Saat Ini:**
  - Statis di `dusunData.ts` (`DUSUN_DETAILS`).
* **Masalah:**
  - Halaman `/profil/demografi` sudah dinamis membaca database riil.
  - Namun halaman detail masing-masing dusun (`/dusun/manis`, `/dusun/pahing`, `/dusun/wage`) masih mencantumkan angka statis lama (misal: Dusun Wage ditulis 146 KK dan 492 Jiwa).
* **Kebutuhan Solusi:**
  - Hubungkan kartu statistik di `/dusun/[slug]` agar melakukan query `count` dari tabel `residents` dan `sensus_kk` berdasarkan filter dusun terkait, sehingga selalu konsisten dengan data kependudukan riil.

---

### E. Rincian Sumber Pendapatan APBDes (Revenues)
* **Halaman Terkait:**
  - Kolom kiri *"Struktur Sumber Pendapatan"* pada `/transparansi/apbdes`.
* **Sumber Data Saat Ini:**
  - Statis di `apbdesData.ts` (`APBDES_REVENUES`).
* **Masalah:**
  - Bagian Belanja (5 Bidang) dan Ringkasan Total APBDes sudah full Supabase dan bisa diedit di panel admin.
  - Namun rincian penerimaan (Dana Desa APBN, ADD Kabupaten Kuningan, Bagi Hasil Pajak, dan PADes) masih statis di frontend.
* **Kebutuhan Solusi:**
  - Tabel Supabase baru: `apbdes_revenues`
  - Kolom: `id`, `sumber`, `kategori`, `target`, `realisasi`, `persen`, `tahun`.
  - Formulir edit sumber pendapatan di panel `/master` (Tab APBDes) untuk role `master`, `sekdes`, dan `keuangan`.

---

### F. Katalog Layanan Administrasi & SOP Persyaratan Surat
* **Halaman Terkait:**
  - `/layanan`
  - `/layanan/surat`
* **Sumber Data Saat Ini:**
  - Statis di `layananData.ts` (`DAFTAR_LAYANAN_SURAT`, 8 jenis layanan).
* **Masalah:**
  - Penambahan jenis layanan baru atau perubahan persyaratan berkas masih harus dilakukan melalui perubahan kode.
  - Pengajuan surat daring belum aktif (saat ini diarahkan langsung ke loket balai desa).
* **Kebutuhan Solusi:**
  - Tabel Supabase: `layanan_surat` (daftar SOP layanan & persyaratan).
  - *Tahap Lanjutan:* Tabel `permohonan_surat` jika ingin mengaktifkan pengajuan surat daring oleh warga.

---

### G. Peta GIS Fasilitas & Batas Lingkungan Dusun
* **Halaman Terkait:**
  - `/peta`
  - Komponen Peta Satelit Interaktif Leaflet di tiap dusun
* **Sumber Data Saat Ini:**
  - Titik koordinat dan marker fasilitas publik di-hardcode di file komponen.
* **Kebutuhan Solusi:**
  - Tabel Supabase: `peta_fasilitas` (koordinat lat/lng, nama tempat, kategori: Posyandu, Mata Air Cikaduran, Gelora, Balai Desa, foto, deskripsi).

---

## 3. Matriks Rekomendasi Prioritas Eksekusi

```
┌────────────────────────────────────────────────────────────────────────┐
│ PRIORITAS 1: KONSISTENSI STATISTIK & KEUANGAN (Cepat & Berdampak)      │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Sinkronisasi KPI KK & Jiwa pada /dusun/[slug] dari Supabase.        │
│ 2. Buat tabel apbdes_revenues agar pendapatan desa 100% dinamis.       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PRIORITAS 2: INTERAKSI PUBLIK & INFORMASI KEGIATAN                    │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Buat tabel agendas & CRUD di /master (Tab Agenda).                 │
│ 2. Buat tabel announcements & CRUD di /master (Tab Edaran Kuwu).       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PRIORITAS 3: MANAJEMEN KELEMBAGAAN & LAYANAN MANDIRI                   │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Buat tabel pamong_profiles untuk data publik SOTK.                 │
│ 2. Buat tabel layanan_surat untuk pengelolaan SOP administrasi desa.   │
└────────────────────────────────────────────────────────────────────────┘
```
