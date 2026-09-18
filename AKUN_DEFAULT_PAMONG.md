# Dokumentasi Akun Default Aparatur Pemdes Kadurama

Dokumen ini berisi daftar akun resmi dan kredensial default untuk mengakses **Panel Data Center & Otorisasi Aparatur Desa Kadurama** (`/master` atau `/login`).

> **Catatan Keamanan:**
> Daftar akun ini sebelumnya ditampilkan di antarmuka login web sebagai panduan cepat, namun kini telah dimatikan dari antarmuka publik demi keamanan data kependudukan dan privasi aparatur desa.

---

## Kredensial Default

* **Kata Sandi Default:** `kadurama2026`
* **URL Akses:** `http://localhost:3000/master` atau `https://www.desakadurama.com/master`

---

## Daftar Akun Resmi Aparatur

| No | Nama Aparatur | Email Login | Role / Otorisasi | Jabatan Resmi | Wilayah Kerja |
|:---|:--------------|:------------|:-----------------|:--------------|:--------------|
| 1 | **Developer & Master Admin** | `master@kadurama.com` | `master` | Super Administrator Sistem (Full Access) | Seluruh Desa Kadurama |
| 2 | **Sumiati, SE** | `sekdes@kadurama.com` | `sekdes` | Sekretaris Desa Kadurama | Seluruh Desa Kadurama |
| 3 | **Trida Sentosa** | `kadus.pahing@kadurama.com` | `kadus` | Kepala Dusun I Pahing | Dusun Pahing |
| 4 | **Andri Rukmana** | `kadus.wage@kadurama.com` | `kadus` | Kepala Dusun II Wage | Dusun Wage |
| 5 | **Jamaludin** | `kadus.manis@kadurama.com` | `kadus` | Kepala Dusun III Manis | Dusun Manis |
| 6 | **Leni Sumiati** | `keuangan@kadurama.com` | `keuangan` | Kaur Keuangan & Perbendaharaan | Seluruh Desa Kadurama |
| 7 | **Ayub Suhandi** | `kesra@kadurama.com` | `kesra` | Kasi Kesejahteraan Rakyat & Bansos | Seluruh Desa Kadurama |
| 8 | **Operator Balai Desa** | `operator@kadurama.com` | `operator` | Staf Administrasi & Pelayanan Warga | Seluruh Desa Kadurama |

---

## Matriks Hak Akses (Role-Based Access Control)

1. **Master (`master`):**
   * Akses penuh ke seluruh modul sensus, keuangan APBDes, berita, agenda, pengumuman, log audit, dan manajemen data.
2. **Sekretaris Desa (`sekdes`):**
   * Akses verifikasi sensus kependudukan, pengawasan master data warga, monitoring APBDes, dan publikasi warta desa.
3. **Kepala Dusun (`kadus`):**
   * Dibatasi hanya untuk melihat, mengedit, dan memverifikasi data keluarga & warga di **wilayah dusun masing-masing** (Pahing / Wage / Manis), verifikasi kelayakan rumah (RTLH), serta pemantauan PBB.
4. **Kaur Keuangan (`keuangan`):**
   * Pengelolaan APBDes 2026, input pos rincian kegiatan belanja, pencatatan realisasi kas riil, dan penerimaan pendapatan desa.
5. **Kasi Kesra (`kesra`):**
   * Pemetaan desil kemiskinan warga, keluarga rentan (RTLH, lansia tunggal, balita stunting), dan verifikasi penerima bansos (PKH, BPNT, BLT-DD).
6. **Operator (`operator`):**
   * Entri dan update harian sensus kependudukan warga, publikasi berita, pengumuman warga, dan agenda balai desa.

---

## 🔒 Prosedur Penggantian Kata Sandi Mandiri

Setiap aparatur desa sangat disarankan untuk mengganti kata sandi default setelah pertama kali berhasil masuk demi keamanan data kependudukan warga:

1. Masuk ke panel `/master` menggunakan email dinas dan sandi default `kadurama2026`.
2. Di pojok kiri bawah sidebar panel admin, klik nama profil aparatur Anda.
3. Pilih opsi **"Ubah Kata Sandi"** (Ikon Kunci).
4. Masukkan kata sandi lama, kemudian buat kata sandi baru (minimal 8 karakter kombinasi huruf dan angka).
5. Klik **"Simpan Sandi Baru"**. Sistem akan otomatis meng-hash kata sandi baru dan menyimpannya langsung ke database Supabase serta mencatat riwayat perubahan ke tabel `audit_logs`.

---

## 🌐 Checklist Persiapan Produksi (Deployment)

- [x] Tombol dan modal pendaftaran akun mandiri telah dimatikan 100% dari antarmuka publik (`/master` dan `/login`).
- [x] Favicon multi-resolusi (`favicon.ico`) dan Apple Touch Icon telah terpasang dengan lambang resmi Kabupaten Kuningan.
- [x] Metadata Open Graph (`og-image.jpg` 1200x630) dan Twitter Card telah terkonfigurasi untuk tampilan pratinjau tautan WhatsApp/Media Sosial.
- [x] Seluruh kueri kependudukan dan APBDes tersambung dengan aman ke Supabase PostgreSQL.
- [ ] Atur environment variable `NEXT_PUBLIC_SITE_URL` pada dashboard Vercel/Hosting ke domain produksi final (contoh: `https://desakadurama.id`).
