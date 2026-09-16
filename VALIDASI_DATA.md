# Lembar Validasi Data & Inventarisasi Data Asumsi (Kadurama)

Dokumen ini mencatat seluruh data dan informasi yang ada di dalam website Desa Kadurama, memisahkan antara **Data Autentik (Terverifikasi dari Pengguna)** dan **Data Asumsi / Placeholder (Perlu Dikonfirmasi / Ditangguhkan / Dihapus)**.

---

## 1. Data Autentik & Terverifikasi (Berasal Resmi dari Pengguna)

| Kategori Data | Nilai / Rincian Terverifikasi | Sumber Data Asli | Status di Sistem |
| :--- | :--- | :--- | :--- |
| **Kependudukan Pahing** | 826 Jiwa, 260 Kepala Keluarga (KK) | File `SASARAN ILP DUSUN PAHING 1-1.xlsx` | Tersimpan di Supabase & Dinamis |
| **Kependudukan Wage** | 822 Jiwa, 260 Kepala Keluarga (KK) | File `DATA WARGA WAGE.xlsx` | Tersimpan di Supabase & Dinamis |
| **Kependudukan Manis** | 833 Jiwa, 288 Kepala Keluarga (KK) | File `DATABASE DUSUN MANIS 2026 TERBARU.xlsx` | Tersimpan di Supabase & Dinamis |
| **Total Penduduk Desa** | 2.481 Jiwa, 808 Kepala Keluarga (KK) | Agregasi Database Sensus Desa | 100% Terverifikasi Real-time |
| **Nomor Kontak Kadus** | Kadus 1 (Pahing): `083861181402`<br>Kadus 2 (Wage): `089667736184`<br>Kadus 3 (Manis): `08314407775` | Input Langsung Pengguna | Aktif di Komponen Kontak & Profil |
| **Identitas & Silsilah Kuwu** | 15 Periode Kuwu (1805: Sura Braja s/d 2019-2027: Samir Syarifudin) | Naskah Sejarah dari Pengguna | Aktif di `/profil/sejarah-visi-misi` |
| **Foto Resmi Kuwu** | Foto asli Kuwu Samir Syarifudin | File `kuwu.png` | Aktif di `/profil/sejarah-visi-misi` |
| **Visi & 9 Butir Misi** | Visi Transparansi & Akuntabilitas + 9 Butir Misi Resmi | Naskah Visi Misi dari Pengguna | Aktif di `/profil/sejarah-visi-misi` |
| **Logo Daerah** | Logo Resmi Kabupaten Kuningan | File `logo-kuningan.png` | Aktif di Header, Footer & Favicon |
| **Wilayah & Geografis** | 89 Ha, 550 mdpl, Batas 4 Mata Angin, 3 Dusun / 8 RT | Naskah Monografi dari Pengguna | Aktif di Profil & Demografi |

---

## 2. Data Asumsi / Ditangguhkan (Perlu Dikonfirmasi / Dihapus jika Tidak Sesuai)

Berikut adalah daftar data yang dibuat sebagai placeholder awal dan **DITANGGUHKAN** pembaruannya sampai pengguna memberikan instruksi koreksi atau penghapusan:

| No | Elemen Data | Nilai Saat Ini | Lokasi File di Codebase | Catatan & Rekomendasi Tindakan | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | **Mata Air / Sungai Cikaduran** | "Sumber Mata Air Purba Cikaduran 45 L/dtk" di Dusun Wage | `frontend/src/data/dusunData.ts`<br>`frontend/src/app/page.tsx`<br>`frontend/src/components/CivicGisMap.tsx` | Ditangguhkan. Jika nama mata air / sungai ini tidak ada di Kadurama, ubah menjadi "Sumber Air Bersih Dusun Wage" atau hapus atribut 45 L/dtk. | ⚠️ Ditangguhkan |
| 2 | **Nama Lapangan Sepakbola** | "Gelora Kadurama" di Dusun Pahing | `frontend/src/data/dusunData.ts`<br>`frontend/src/app/page.tsx`<br>`frontend/src/components/CivicGisMap.tsx` | Ditangguhkan. Jika warga hanya menyebutnya "Lapangan Sepakbola Dusun Pahing" tanpa nama 'Gelora Kadurama', nama julukan akan dinetralisir. | ⚠️ Ditangguhkan |
| 3 | **Angka APBDes 2026** | Total Anggaran Rp 1.485.200.000 (5 Bidang Belanja) | `frontend/src/data/apbdesData.ts`<br>`frontend/src/app/page.tsx`<br>`frontend/src/app/transparansi/apbdes/page.tsx` | Belum ada lembar Perdes APBDes murni dari desa. Saat ini angka dipakai sebagai format mockup display; akan digantikan saat file real APBDes desa diinput. | ⚠️ Placeholder |
| 4 | **Berita Desa Default** | 6 Judul Berita (Musrenbangdes, Panen Raya Organik, dll.) | `frontend/src/data/newsData.ts` | **DIPUTUSKAN:** Dibuat dinamis dari Supabase. Jika tabel database kosong, tampilkan *Clean Empty State* tanpa memaksa memunculkan artikel dummy. | 🔄 Dinamisasi |
| 5 | **Agenda Desa Default** | 4 Jadwal Agenda (Rapat BPD, Posyandu, dll.) | `frontend/src/data/newsData.ts` | **DIPUTUSKAN:** Dibuat dinamis dari Supabase. Jika tabel database kosong, tampilkan *Clean Empty State*. | 🔄 Dinamisasi |
| 6 | **Pengumuman Resmi Default** | 3 Surat Edaran (PBB-P2, Bansos, Kerja Bakti) | `frontend/src/data/newsData.ts` | **DIPUTUSKAN:** Dibuat dinamis dari Supabase. Jika tabel database kosong, tampilkan *Clean Empty State*. | 🔄 Dinamisasi |
| 7 | **Titik Koordinat Fasilitas GIS** | Titik latitude/longitude rekaan sarana di peta Leaflet | `frontend/src/components/CivicGisMap.tsx` | Menggunakan estimasi koordinat area Kadurama Ciawigebang (`-6.97` s/d `-6.98`). Perlu penyesuaian titik GPS akurat jika desa memiliki survei pemetaan. | ⚠️ Ditangguhkan |

---

## 3. Panduan Pengguna untuk Mengoreksi Data
1. Jika suatu data pada tabel No. 2 di atas **ingin dihapus total**, beritahukan nama datanya, sistem akan langsung membersihkan penyebutannya di seluruh komponen.
2. Jika ada **data pengganti yang benar** (misalnya nama mata air yang sebenarnya atau file APBDes asli), cukup lampirkan file atau sebutkan nama yang benar.
