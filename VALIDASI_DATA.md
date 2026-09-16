# Lembar Validasi Data & Inventarisasi Informasi Asumsi (Desa Kadurama)

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
| **Lambang Daerah** | Lambang Resmi Kabupaten Kuningan (bukan 'Kuningan Asri') | File `logo-kuningan.png` | Aktif di Header, Hero, Footer & Favicon |
| **Wilayah & Geografis** | 89 Ha, 550 mdpl, Batas 4 Mata Angin, 3 Dusun / 8 RT | Naskah Monografi dari Pengguna | Aktif di Profil & Demografi |
| **APBDes 2026 Murni** | **Pendapatan: Rp 898.152.227**<br>**Belanja: Rp 856.452.227**<br>Surplus: Rp 41.700.000<br>Pembiayaan Netto: Rp 41.700.000<br>*(Bidang 3: Pembinaan Kemasyarakatan = Rp 0)* | Naskah Transkripsi Banner Fisik Kuwu Samir Syarifudin | Tersimpan di Supabase (`apbdes_summary`, `apbdes_sectors`, `apbdes_revenues`) |
| **Laporan ILPPD 2025** | **Pendapatan Realisasi: Rp 1.477.820.277**<br>**Belanja Realisasi: Rp 1.291.506.827**<br>Surplus: Rp 186.313.400 | Naskah Transkripsi Banner Fisik Kuwu Samir Syarifudin | Tersimpan di Supabase & Tab Switcher Transparansi |

---

## 2. Data Asumsi / Ditangguhkan (Kontak, Alamat, dan Fasilitas yang Memerlukan Konfirmasi Pengguna)

Berikut adalah daftar data yang dibuat sebagai placeholder awal dan **DITANGGUHKAN** pembaruannya sampai pengguna memberikan nomor kontak, alamat jalan, atau nama fasilitas yang sebenarnya:

| No | Elemen Data | Nilai Saat Ini di Sistem | Lokasi Komponen / File | Rekomendasi Tindakan & Status |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **Nomor WhatsApp Balai Desa** | `+62 821-2345-6789` | `CivicFooter.tsx`<br>`page.tsx` (Bagian Lokasi Kantor) | ⚠️ **Asumsi Placeholder.** Harap berikan nomor WhatsApp resmi kantor desa / nomor sekretariat bila ada, atau diganti nomor Kadus. |
| 2 | **Email Resmi Balai Desa** | `pemdes@kadurama.desa.id` | `CivicFooter.tsx`<br>`page.tsx`<br>`layout.tsx` | ⚠️ **Asumsi Domain Desa.** Jika desa belum memiliki domain `desa.id` resmi atau menggunakan email Gmail (misal `pemdeskadurama@gmail.com`), silakan sebutkan agar disesuaikan. |
| 3 | **Alamat Kantor Balai Desa** | `Jl. Desa Kadurama No. 01, Dusun Manis, Ciawigebang, Kuningan` | Hero Right Card, Footer, Bagian Lokasi Map | ⚠️ **Asumsi Nomor Jalan.** "No. 01" adalah asumsi penomoran standar. Beritahukan jika ada nama jalan spesifik atau patokan resmi (misal: "Depan Lapangan" / "RT 01 RW 01"). |
| 4 | **Kode Pos Wilayah** | `45591` | Hero Card, Layout JSON-LD, Footer | ℹ️ **Standar Kecamatan.** 45591 adalah kode pos resmi Kecamatan Ciawigebang. |
| 5 | **Jam Operasional Loket** | `Senin - Jumat (08.00 - 15.00 WIB)` | Footer Balai Desa | ℹ️ **Standar Kantor Desa.** Konfirmasi jika jam pelayanan berbeda (misal 07.30 - 14.30). |
| 6 | **Mata Air / Sungai Cikaduran** | "Sumber Mata Air Purba Cikaduran 45 L/dtk" di Dusun Wage | `frontend/src/data/dusunData.ts`<br>`frontend/src/components/CivicGisMap.tsx` | ⚠️ **Ditangguhkan.** Jika nama mata air / sungai ini tidak ada di Kadurama, beri tahu kami untuk diubah menjadi nama sumber air yang nyata atau dinetralkan. |
| 7 | **Nama Lapangan Sepakbola** | "Gelora Kadurama" di Dusun Pahing | `frontend/src/data/dusunData.ts`<br>`frontend/src/components/CivicGisMap.tsx` | ⚠️ **Ditangguhkan.** Jika hanya disebut "Lapangan Sepakbola Dusun Pahing" tanpa nama julukan 'Gelora Kadurama', akan dinetralkan. |
| 8 | **Titik Koordinat Fasilitas GIS** | Titik latitude/longitude rekaan sarana di peta Leaflet | `frontend/src/components/CivicGisMap.tsx` | ⚠️ **Estimasi Wilayah.** Menggunakan rentang koordinat Kadurama Ciawigebang (`-6.968` s/d `-6.996`). |

---

## 3. Catatan Khusus Mengenai APBDes 2026: Bidang Pembinaan Kemasyarakatan

> [!NOTE]
> **Konfirmasi Kekosongan Bidang Pembinaan Kemasyarakatan:**
> Pada dokumen fisik banner resmi APBDes 2026 Kepala Desa Samir Syarifudin:
> - **Total Belanja Desa:** **Rp 856.452.227**
> - **Rincian 5 Bidang Belanja:**
>   1. Bidang Penyelenggaraan Pemerintahan: **Rp 543.725.227**
>   2. Bidang Pelaksanaan Pembangunan: **Rp 201.627.000**
>   3. Bidang Pembinaan Kemasyarakatan: **Rp 0** *(Kosong / Tidak ada sub-kegiatan di banner)*
>   4. Bidang Pemberdayaan Masyarakat: **Rp 78.000.000**
>   5. Bidang Penanggulangan Bencana & Mendesak: **Rp 33.100.000**
> 
> **Kalkulasi Akuntansi:**  
> Rp 543.725.227 + Rp 201.627.000 + Rp 0 + Rp 78.000.000 + Rp 33.100.000 = **TEPAT Rp 856.452.227**.  
> Dengan demikian, **BENAR bahwa Bidang Pembinaan Kemasyarakatan bernilai Rp 0 (kosong)** pada APBDes murni tahun 2026. Angka di website telah disesuaikan 100% presisi dengan banner asli.
