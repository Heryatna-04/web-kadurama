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
   * Akses verifikasi sensus kependudukan, pengesahan dokumen, tata kelola persuratan, dan transparansi anggaran.
3. **Kepala Dusun (`kadus`):**
   * Dibatasi hanya untuk melihat, mengedit, dan memverifikasi data keluarga & warga di **wilayah dusun masing-masing** (Pahing / Wage / Manis).
4. **Kaur Keuangan (`keuangan`):**
   * Fokus pada pembukuan PBB, status pelunasan pajak warga, dan realisasi penyerapan anggaran APBDes.
5. **Kasi Kesra (`kesra`):**
   * Pemetaan desil kemiskinan warga, keluarga rentan (RTLH, lansia tunggal, balita stunting), dan verifikasi penerima bansos (PKH, BPNT, BLT-DD).
6. **Operator (`operator`):**
   * Input dan update harian administrasi kependudukan dan surat pengantar warga.
