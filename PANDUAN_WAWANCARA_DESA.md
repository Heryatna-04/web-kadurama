# 📝 Panduan Wawancara SDLC & Kuesioner Lapangan: Pemerintah Desa Kadurama
## Sistem Pemdes Terintegrasi & Desa Digital Kadurama

**Tujuan Dokumen:**  
Panduan terstruktur ini disusun untuk digunakan oleh tim pengembang saat melakukan pertemuan langsung, wawancara mendalam, dan observasi lapangan bersama aparatur Pemerintah Desa Kadurama (Kecamatan Ciawigebang, Kabupaten Kuningan).

---

## 👥 Matriks Pemangku Kepentingan (Stakeholders)

| No | Peran / Jabatan | Fokus Pembahasan Utama |
|---|---|---|
| 1 | **Kepala Desa (Kuwu)** | Visi digitalisasi desa, transparansi APBDes, kepatuhan regulasi, otorisasi surat |
| 2 | **Sekretaris Desa (Sekdes)** | Tata naskah dinas, klasifikasi kearsipan surat, pelimpahan wewenang TTD, master aset |
| 3 | **Kasi Pelayanan & Kasi Pemerintahan** | Alur harian persuratan warga, volume surat, syarat dokumen, kendala loket |
| 4 | **Kaur Keuangan** | Format data publikasi APBDes, laporan realisasi serapan anggaran |
| 5 | **Kepala Dusun (Kadus 5 Dusun)** | Validitas batas dusun (Manis, Pahing, Puhun, Wage, Kliwon), pembaruan data warga |

---

## 📋 Bagian 1: Format Kertas & Perangkat Keras Kantor Desa

1. **Format Kertas yang Biasa Digunakan:**
   - [ ] Menggunakan kertas **F4 / Folio (215 × 330 mm)** untuk seluruh surat resmi?
   - [ ] Menggunakan kertas **A4 (210 × 297 mm)** untuk seluruh surat resmi?
   - [ ] Campuran (sebagian surat F4, dokumen tertentu A4)?
   *Catatan Tambahan:* Apakah desa mencetak pada kertas berkop pre-printed (kop sudah dicetak percetakan sebelumnya) atau kertas HVS putih polos dan kop dicetak langsung oleh sistem?

2. **Perangkat Printer di Loket Kantor Desa:**
   - Merk dan tipe printer yang aktif di loket pelayanan: `________________________` (misal: *Epson L3110 / Canon G2010 / Laserjet*)
   - Apakah printer terhubung langsung ke PC operator loket via kabel USB atau jaringan LAN/Wi-Fi?

3. **Koneksi Internet Kantor Desa:**
   - Penyedia koneksi (IndiHome / Iconnet / Orbit / Seluler / BAKTI Kominfo): `________________________`
   - Stabilitas jaringan harian di kantor desa: (Sangat Stabil / Cukup / Sering Terputus).

---

## 📋 Bagian 2: Tata Naskah Dinas & Penomoran Surat

1. **Format Penomoran Surat Keluar:**
   - Apakah penomoran surat keluar menggunakan **Satu Nomor Urut Terpusat** untuk semua jenis surat? (Contoh: Surat ke-001 adalah SKU, ke-002 adalah SKTM, ke-003 adalah Domisili).
   - ATAU **Nomor Urut Terpisah per Bidang/Seksi**? (Contoh: Seksi Pemerintahan punya nomor 001 sendiri, Seksi Kesejahteraan punya 001 sendiri).
   - Tuliskan contoh riil nomor surat terakhir yang terbit di desa: `____________________________________`

2. **Kode Klasifikasi Surat:**
   - Apakah desa mengikuti Kode Klasifikasi Surat Permendagri No. 78 Tahun 2012 / Permendagri No. 83-84?
     - Kependudukan: `470`
     - Perizinan / Usaha: `503`
     - Kesejahteraan / Bantuan Sosial: `401`
     - Keamanan / Pengantar SKCK: `331`
     - Kematian / Kelahiran: `472`
   - Apakah ada kode singkatan khusus Desa Kadurama? (misal: `/Pem/Kdr/`, `/Kdr/`, atau `/Ds-Kdr/`).

3. **Buku Agenda Surat Masuk & Surat Keluar:**
   - Bagaimana staf desa saat ini mencatat surat masuk dari kecamatan/dinas luar dan surat keluar warga?
     - [ ] Buku tulis fisik manual (buku besar folio bergaris).
     - [ ] Lembar kerja Microsoft Excel.
     - [ ] Belum ada pencatatan yang rapi.
   - Apakah surat masuk memerlukan fitur pencatatan lembar **Disposisi Kepala Desa** (instruksi tindak lanjut ke Sekdes/Kasi)?

---

## 📋 Bagian 3: Kebijakan Tanda Tangan & Otorisasi Surat

1. **Tanda Tangan Surat Administrasi:**
   - Siapa yang menandatangani sebagian besar surat harian?
     - [ ] Selalu ditandatangani langsung oleh Kepala Desa.
     - [ ] Boleh didelegasikan ke Sekretaris Desa (*a.n. Kepala Desa*) bila Kades dinas luar.
     - [ ] Apakah Kasi Pelayanan berwenang menandatangani surat pengantar biasa?
2. **Bentuk Pengesahan Dokumen:**
   - [ ] **Tanda Tangan Basah + Cap Stempel Basah:** Surat dicetak kosong area TTD, lalu ditandatangani pena dan dicap stempel ungu tinta basah.
   - [ ] **Tanda Tangan Gambar / Scan Digital:** Tanda tangan dan stempel langsung tercetak pada dokumen.
   - [ ] **Tanda Tangan Elektronik (TTE) / QR Code:** Dokumen memuat QR Code yang saat dipindai kamera HP menampilkan halaman verifikasi keaslian surat dari server desa.
3. **Arsip Digital Hasil Scan:**
   - Apakah surat yang telah ditandatangani dan dicap stempel basah biasa discan ulang untuk disimpan sebagai arsip PDF di kantor desa?

---

## 📋 Bagian 4: Master Data Kependudukan Desa

1. **Sumber Data Awal:**
   - Apakah Desa Kadurama memiliki file rekap kependudukan digital yang siap diimpor ke sistem?
     - [ ] File Excel SIAK (Sistem Informasi Administrasi Kependudukan).
     - [ ] Data Prodeskel (Profil Desa dan Kelurahan Kemendagri).
     - [ ] Data SDGs Desa / Pendataan IDM.
     - [ ] Rekap DPT Pemilu / Pilkades.
     - [ ] Belum ada, harus diinput bertahap.
2. **Struktur Wilayah Desa:**
   - Konfirmasi nama dusun resmi di Desa Kadurama:
     1. Dusun Manis: Berapa RT dan RW? `______ RT / ______ RW`
     2. Dusun Pahing: Berapa RT dan RW? `______ RT / ______ RW`
     3. Dusun Puhun: Berapa RT dan RW? `______ RT / ______ RW`
     4. Dusun Wage: Berapa RT dan RW? `______ RT / ______ RW`
     5. Dusun Kliwon: Berapa RT dan RW? `______ RT / ______ RW`
   - Total jumlah penduduk saat ini (estimasi): `_______` jiwa / `_______` KK.
3. **Kebutuhan Pembaruan (Mutasi) Data:**
   - Bagaimana alur pencatatan warga yang pindah keluar, warga baru pindah datang, kelahiran, dan kematian?

---

## 📋 Bagian 5: Jenis Surat & Syarat Dokumen (Prioritas Rilis)

Berikan tanda ceklis `[x]` pada surat yang wajib tersedia pada peluncuran awal (*Tahap 1*):

| Jenis Surat | Urgensi (Tinggi / Sedang) | Kode Klasifikasi Desa | Lampiran Syarat yang Wajib Dibawa Warga |
|---|---|---|---|
| **Surat Keterangan Usaha (SKU)** | [ ] Tinggi [ ] Sedang | ................... | Pengantar RT/RW, Fotokopi KTP, KK, Foto Tempat Usaha |
| **Surat Keterangan Tidak Mampu (SKTM)** | [ ] Tinggi [ ] Sedang | ................... | Pengantar RT/RW, Fotokopi KTP, KK, Surat Pernyataan |
| **Surat Pengantar Catatan Kepolisian (SKCK)** | [ ] Tinggi [ ] Sedang | ................... | Pengantar RT/RW, Fotokopi KTP, KK, Pas Foto 4x6 |
| **Surat Keterangan Domisili** | [ ] Tinggi [ ] Sedang | ................... | Pengantar RT/RW, Fotokopi KTP, KK |
| **Surat Keterangan Kematian (SKM)** | [ ] Tinggi [ ] Sedang | ................... | Surat Dokter / Bidan, KTP Almarhum, KTP Pelapor, KK |
| **Surat Keterangan Kelahiran** | [ ] Tinggi [ ] Sedang | ................... | Surat Bidan/RS, Buku Nikah Orang Tua, KTP, KK |
| **Surat Keterangan Belum Menikah** | [ ] Tinggi [ ] Sedang | ................... | Pengantar RT/RW, Pernyataan Belum Menikah Bermaterai |
| **Surat Keterangan Beda Nama** | [ ] Tinggi [ ] Sedang | ................... | KTP, KK, Ijazah / Akta Kelahiran pembanding |

---

## 📋 Bagian 6: Informasi Portal Publik & Transparansi

1. **Publikasi APBDes:**
   - Apakah rincian pagu dan realisasi APBDes Tahun Anggaran 2026 sudah ditetapkan dalam Peraturan Desa (Perdes)?
   - Siapa yang akan bertanggung jawab memberikan data update serapan belanja (apakah tiap semester atau per tahun)?
2. **Kanal Berita & Pengumuman:**
   - Siapa staf desa yang ditugaskan sebagai pengelola konten / admin berita website desa?
3. **Layanan Pengaduan & Kontak:**
   - Nomor WhatsApp resmi balai desa yang aktif untuk menerima pesan informasi dari warga: `________________________`
   - Alamat email resmi desa: `________________________`

---

## 📌 Lembar Catatan Khusus & Kesepakatan Awal

- **Catatan Tambahan dari Kepala Desa / Sekdes:**  
  `____________________________________________________________________________________`  
  `____________________________________________________________________________________`  
  `____________________________________________________________________________________`  

- **Tanggal Pertemuan:** `_____ / ____________ / 2026`  
- **Tempat:** Kantor Balai Desa Kadurama, Kec. Ciawigebang, Kab. Kuningan.  
- **Perwakilan Tim Pengembang:** `________________________`  
- **Perwakilan Pemdes Kadurama:** `________________________`  
