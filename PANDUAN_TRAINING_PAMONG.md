# 📚 Panduan Sosialisasi & Pelatihan Teknis Pamong Desa Kadurama
## Sistem Pemdes Terintegrasi & Data Center Desa Kadurama

Dokumen ini disusun sebagai panduan langkah demi langkah (*trainer script & playbook*) bagi Anda saat mempresentasikan, mendemonstrasikan, dan melatih jajaran Pemerintah Desa Kadurama (Kuwu, Sekretaris Desa, para Kepala Dusun, Kepala Seksi, Kepala Urusan, dan Operator Balai Desa).

---

## 🎯 1. Ringkasan Eksekutif & Tujuan Training

### Sasaran Sesi:
1. **Menghilangkan Rasa Takut / Gaptek:** Meyakinkan perangkat desa bahwa sistem ini sangat ramah pengguna (*user-friendly*), berbahasa Indonesia lugas, dan memiliki perlindungan keamanan sehingga tidak perlu takut salah klik.
2. **Efisiensi Loket Pelayanan:** Membuktikan bahwa penerbitan surat warga (SKU, SKTM, Domisili) yang sebelumnya memakan waktu 15–30 menit kini selesai dalam waktu kurang dari 1 menit.
3. **Validitas Data Bansos & RTLH:** Membekali Kepala Dusun (Manis, Pahing, Wage) cara memetakan keluarga rentan (Desil 1 s.d. 4) secara obyektif tanpa kecurigaan warga.
4. **Transparansi & Kepatuhan Regulasi:** Mendemonstrasikan keterbukaan APBDes 2026 dan publikasi warta desa sesuai standar Kementerian Dalam Negeri dan Kabupaten Kuningan.

---

## ⏱️ 2. Susunan Acara Pelatihan (Rundown 60–90 Menit)

| Waktu | Durasi | Agenda Utama | Penanggung Jawab |
| :--- | :--- | :--- | :--- |
| **09.00 - 09.15** | 15 Menit | Pembukaan & Penjelasan Nilai Tambah Website bagi Desa | Trainer & Kuwu |
| **09.15 - 09.30** | 15 Menit | Tur Portal Publik Warga (Peta GIS, APBDes, Profil Dusun) | Trainer |
| **09.30 - 09.45** | 15 Menit | Pengenalan Akun Pamong & Otorisasi Hak Akses (`/master`) | Trainer & Seluruh Pamong |
| **09.45 - 10.15** | 30 Menit | Praktek Mandiri per Meja (Simulasi Loket Surat & Sensus) | Sekdes, Kadus, Operator |
| **10.15 - 10.30** | 15 Menit | Tanya Jawab, Tips SOP Keamanan & Penutupan | Trainer & Seluruh Pamong |

---

## 🗣️ 3. Naskah Pembukaan & Motivasi Trainer (Opening Script)

> *"Bapak Kuwu, Pak Sekdes, Bapak-Bapak Kepala Dusun, dan seluruh jajaran pamong Desa Kadurama yang kami hormati.*  
>  
> *Hari ini kita tidak berkumpul untuk menambah beban administrasi baru dengan sistem yang rumit. Justru sebaliknya, sistem ini dibangun khusus agar pekerjaan harian Bapak-Bapak sekalian menjadi jauh lebih ringan, cepat, dan rapi.*  
>  
> *Selama ini, membuat surat keterangan masih manual mencari format Word, data warga tercecer di berbagai buku dusun, dan laporan APBDes harus dibuat berulang-ulang. Mulai hari ini, semua terpusat dalam satu genggaman: surat dicetak otomatis dengan QR Code sah, sensus kemiskinan per dusun dihitung otomatis oleh sistem, dan realisasi anggaran tampil transparan membanggakan warga Kadurama.*  
>  
> *Tidak perlu takut salah pencet. Sistem ini dilengkapi proteksi riwayat audit digital, data tidak akan hilang, dan kami dampingi sampai semuanya lancar mengoperasikan."*

---

## 🌐 4. Demo Portal Publik Warga (15 Menit)

Tunjukkan tampilan layar proyektor / laptop Anda pada domain website desa:

1. **Identitas Resmi Daerah:**
   - Tunjukkan Lambang Resmi Kabupaten Kuningan pada navigasi atas dan tab favicon browser.
   - Perlihatkan Kode Desa Kemendagri `32.08.10.2002` serta alamat Balai Desa di Dusun Manis.
2. **Peta Geospasial GIS Satelit Nyata (`/peta`):**
   - Tunjukkan batas administratif presisi lereng Gunung Ciremai dan sebaran 3 wilayah dusun: **Dusun Manis**, **Dusun Pahing**, dan **Dusun Wage**.
   - Tunjukkan pin fasilitas: Kantor Balai Desa, Sarana Pendidikan, Sarana Ibadah, dan Sumber Air Cikaduran.
3. **Transparansi Realisasi APBDes 2026 (`/transparansi/apbdes`):**
   - Jelaskan bahwa warga dapat melihat keterbukaan pendapatan dan rincian belanja 5 bidang secara berkala.
4. **Profil 3 Dusun (`/dusun`):**
   - Tunjukkan bahwa masing-masing dusun memiliki laman kehormatannya sendiri lengkap dengan nama Kepala Dusun yang bertugas.
5. **Kabar Warta, Agenda & Pengumuman (`/berita`, `/agenda`, `/pengumuman`):**
   - Jelaskan bahwa saat ini terpasang data contoh (*Contoh Berita 1 s.d. 5, Contoh Agenda, Contoh Pengumuman*) yang siap diisi dengan kegiatan nyata warga.

---

## 🔐 5. Otorisasi Akses Pamong & Pengenalan 8 Akun Resmi

Jelaskan mengapa di halaman login tidak disediakan tombol pendaftaran akun umum:
* **Alasan Keamanan:** Sistem data kependudukan menyangkut NIK dan kerentanan warga. Hanya aparatur ber-SK resmi yang diberikan akses login.

### Daftar Kredensial Akun Default:

| Jabatan / Posisi | Email Login | Password Awal | Tugas Utama di Sistem |
| :--- | :--- | :--- | :--- |
| **Kuwu / Master Admin** | `master@kadurama.com` | `kadurama2026` | Pengawasan Penuh, Monitoring Audit Log & Rekap Desa |
| **Sekretaris Desa** | `sekdes@kadurama.com` | `kadurama2026` | Loket Persuratan Warga & Verifikasi Master Data |
| **Kepala Dusun I Manis** | `kadus.manis@kadurama.com` | `kadurama2026` | Sensus KK & Verifikasi RTLH/PBB Dusun Manis |
| **Kepala Dusun II Pahing** | `kadus.pahing@kadurama.com` | `kadurama2026` | Sensus KK & Verifikasi RTLH/PBB Dusun Pahing |
| **Kepala Dusun III Wage** | `kadus.wage@kadurama.com` | `kadurama2026` | Sensus KK & Verifikasi RTLH/PBB Dusun Wage |
| **Kaur Keuangan** | `keuangan@kadurama.com` | `kadurama2026` | Input & Penyesuaian Realisasi Belanja APBDes 2026 |
| **Kasi Kesejahteraan** | `kesra@kadurama.com` | `kadurama2026` | Pemantauan Penerima Bansos & Desil 1–2 (Miskin Ekstrem) |
| **Operator Balai Desa** | `operator@kadurama.com` | `kadurama2026` | Entri Data Harian, Penerbitan Berita, Foto & Agenda |

---

## 🛠️ 6. Panduan Praktek Mandiri Sesuai Tugas (Tupoksi)

Ajak masing-masing aparatur membuka menu sesuai tugasnya:

### A. Untuk Sekretaris Desa & Operator (Loket Pelayanan Surat Otomatis)
1. Buka menu **Loket Cetak Surat** di panel pamong.
2. Pilih jenis surat yang dimohon warga:
   - **SKU:** Surat Keterangan Usaha (ketik nama toko/kebun ubi/ternak).
   - **SKTM:** Surat Keterangan Tidak Mampu (pilih tujuan: Beasiswa / Rumah Sakit).
   - **Domisili:** Keterangan tempat tinggal warga di dusun.
3. Masukkan NIK / Nama pemohon.
4. Klik **Pratinjau Surat Resmi**:
   - Kop Desa Kadurama otomatis terpasang rapi.
   - Nomor surat registrasi terisi otomatis.
   - QR Code keabsahan berkas terbuat otomatis.
5. Tekan tombol **Cetak Surat (PDF / Print A4)** atau tekan tombol keyboard `Ctrl + P`. Surat siap ditandatangani dan distempel.

### B. Untuk 3 Kepala Dusun (Manis, Pahing, Wage) - Tata Kelola Sensus Keluarga
1. Buka tab **Sensus Profil Keluarga (KK)**.
2. Filter otomatis mengunci data dusun masing-masing:
   - Pak Kadus Pahing hanya mengelola warga Dusun Pahing.
   - Pak Kadus Wage mengelola warga Dusun Wage.
   - Pak Kadus Manis mengelola warga Dusun Manis.
3. Klik tombol **+ Tambah Sensus KK**:
   - Masukkan Nomor KK dan Nama Kepala Keluarga.
   - Masukkan kondisi fisik rumah: dinding, lantai, atap, dan sanitasi jamban.
   - **Kalkulator Desil Otomatis:** Sistem langsung mengkalkulasi skor kerentanan (Desil 1 = Sangat Miskin, Desil 2 = Miskin, Desil 3 = Hampir Miskin, Desil 4 = Mampu).
   - Status RTLH: Jika atap bambu/lantai tanah, sistem otomatis menandai sebagai prioritas bedah rumah RTLH.
4. **Dokumentasi Foto Rumah:** Kadus dapat memfoto rumah warga langsung dari kamera HP dan mengunggahnya ke formulir.

### C. Untuk Kaur Keuangan - Pengelolaan Transparansi APBDes
1. Buka tab **Kelola APBDes 2026**.
2. Periksa pagu anggaran yang sudah disahkan dalam Perdes.
3. Saat ada pencairan atau penyelesaian kegiatan fisik (misal: drainase Dusun Wage atau jalan usaha tani Dusun Pahing), klik **Edit Realisasi**.
4. Masukkan angka realisasi terbaru. Persentase serapan belanja langsung terhitung otomatis dan halaman publik langsung terupdate detik itu juga.

### D. Untuk Operator Desa - Menerbitkan Berita, Foto & Pengumuman
1. Buka tab **Kabar & Artikel Desa**.
2. Klik **+ Tulis Warta Baru**:
   - Masukkan Judul Berita dan Kategori (Pemerintahan, Pembangunan, Kesehatan, Ekonomi, dll).
   - Masukkan Ringkasan Singkat dan Isi Berita.
3. **Pengaturan Foto Unggulan (Seragam 16:9):**
   - Operator bisa mengklik tombol cepat foto desa (*Lanskap Dusun Manis*, *Lanskap Dusun Pahing*, *Lanskap Dusun Wage*, atau *Banner Pemdes*).
   - Atau klik **Upload Foto dari HP/Laptop**.
   - Pratinjau rasio 16:9 akan memastikan foto tidak peyang atau terpotong sembarangan di website.
4. Pilih Status: **Terbit** (langsung muncul di website) atau **Draf** (disimpan untuk diedit lagi nanti).

### E. Untuk Bapak Kuwu - Pengawasan Terpadu & Audit Log
1. Buka tab **Jejak Audit Digital**.
2. Kuwu dapat memantau setiap aktivitas:
   - Jam berapa surat dibuat dan siapa pembuatnya.
   - Siapa pamong yang menginput sensus keluarga.
   - Siapa yang melakukan pembaruan realisasi anggaran.
   - Menghilangkan potensi salah paham antar perangkat desa karena seluruh riwayat tercatat objektif.

---

## 🖨️ 7. Tips Teknis Pencetakan Dokumen (Print Settings A4)

Saat pamong mencetak surat atau laporan PDF dari browser Google Chrome / Microsoft Edge:
1. Ukuran Kertas (*Paper size*): Pilih **A4**.
2. Margin: Pilih **Default** atau **None / Minimum**.
3. Centang opsi: **"Background graphics"** (agar garis kop surat dan bayangan tabel tercetak jelas).
4. Skala (*Scale*): Tetapkan pada **100%**.

---

## ❓ 8. Jawaban Cepat atas Keraguan Pamong (FAQ Sesi Tanya Jawab)

* **Q1: "Kalau saya salah ketik nama warga atau salah masukkan angka, apakah bisa diperbaiki?"**
  * *Jawaban:* "Tentu saja bisa. Di setiap baris tabel ada tombol **Edit (Ikon Pensil)**. Bapak tinggal klik, ubah teks yang salah, lalu simpan. Data akan langsung terperbarui."
* **Q2: "Apakah data NIK warga aman dan tidak bisa diintip orang luar?"**
  * *Jawaban:* "Sangat aman. Portal publik yang dibuka warga tidak menampilkan NIK utuh maupun data rahasia sensus. Data kependudukan hanya bisa dilihat setelah login menggunakan akun resmi pamong desa."
* **Q3: "Bagaimana kalau di kantor desa sedang mati lampu atau internet lemot?"**
  * *Jawaban:* "Aplikasi ini berbasis cloud yang sangat ringan dan mobile-friendly. Bapak bisa membuka panel pamong lewat smartphone Android atau iPhone menggunakan paket data seluler biasa."
* **Q4: "Apakah foto berita harus diedit dulu pakai aplikasi desain?"**
  * *Jawaban:* "Tidak perlu. Sistem sudah dilengkapi pengatur rasio otomatis (16:9). Foto apa pun yang diupload dari kamera HP akan diseragamkan ukurannya oleh sistem sehingga selalu tampil rapi."
* **Q5: "Bagaimana jika password akun pamong ingin diubah?"**
  * *Jawaban:* "Bisa diubah secara mandiri melalui menu profil akun pamong atau dikoordinasikan langsung dengan operator balai desa / super administrator."

---

## ✅ 9. Lembar Serah Terima & Komitmen Pamong

Setelah sesi pelatihan selesai, minta perwakilan pamong menandatangani lembar serah terima sederhana sebagai dokumentasi kegiatan:
* Kuwu Desa Kadurama
* Sekretaris Desa Kadurama
* Kepala Dusun I Manis
* Kepala Dusun II Pahing
* Kepala Dusun III Wage

*Dokumentasi ini siap dicetak atau diproyeksikan langsung selama acara sosialisasi.*
