// ============================================================================
// MASTER DATA & DEFINISI TIPE RESMI PEMERINTAH DESA KADURAMA
// 3 Dusun: Dusun Manis, Dusun Pahing, Dusun Wage
// ============================================================================

export interface AparaturUser {
  id?: string;
  email: string;
  nama: string;
  role: "master" | "sekdes" | "kadus" | "keuangan" | "kesra" | "operator";
  jabatan: string;
  dusun?: "Manis" | "Pahing" | "Wage" | "all";
  password_hash?: string;
  is_active?: boolean;
}

export interface Resident {
  nik: string;
  noKk: string;
  nama: string;
  ttl: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  pekerjaan: string;
  agama: string;
  statusPerkawinan: string;
  hubunganKeluarga: string;
  dusun: "Manis" | "Pahing" | "Wage";
  rt: string;
  rw: string;
  alamat: string;
  status: string;
  syncStatus?: "Tersinkronisasi" | "Perlu Sinkronisasi" | "Diperbarui Internal";
  is_deleted?: boolean;
  deleted_at?: string | null;
  deleted_by?: string | null;
}

export interface SensusKK {
  id: string;
  noKk: string;
  nikKepalaKeluarga: string;
  namaKepalaKeluarga: string;
  dusun: "Manis" | "Pahing" | "Wage";
  rt: string;
  rw: string;
  alamat: string;
  jumlahAnggota: number;
  desil: 1 | 2 | 3 | 4;
  statusPbb: "Lunas" | "Belum Lunas";
  tahunPbb: number;
  nominalPbb: number;
  kondisiRumah: "Layak Huni" | "RTLH";
  statusKepemilikanRumah: string;
  luasLantai: number;
  dinding: "Tembok Permanen" | "Setengah Tembok" | "Bilik Bambu / Papan";
  lantai: "Keramik / Granit" | "Semen Rata" | "Tanah";
  atap: "Genteng Baik" | "Seng / Asbes" | "Rumbia / Lapuk";
  jambanSanitasi: "Jamban Sendiri (Septic Tank)" | "Jamban Bersama" | "Tidak Ada (Numpang / Sungai)";
  sumberAir: "PDAM / Sumur Bor Bersih" | "Sumur Timba Gali" | "Mata Air Terbuka";
  dayaListrik: "450 VA" | "900 VA" | "1300 VA" | "Menumpang";
  pekerjaanUtama: string;
  penghasilanBulanan: "Dibawah Rp 1.000.000" | "Rp 1.000.000 - Rp 2.000.000" | "Rp 2.000.000 - Rp 4.000.000" | "Diatas Rp 4.000.000";
  kepemilikanLahan?: string;
  kerentanan: {
    adaLansiaTunggal: boolean;
    adaBalitaStunting: boolean;
    adaDisabilitas: boolean;
    adaAnakPutusSekolah?: boolean;
  };
  bansosAktif: "Tidak Ada (Non-Bansos)" | "PKH" | "BPNT" | "BLT Dana Desa" | "Bansos Lansia";
  foto_rumah_url?: string;
  foto_kk_url?: string;
  surveyorKadus: string;
  tanggalSensus: string;
  catatanVerifikasi: string;
  is_deleted?: boolean;
  deleted_at?: string | null;
  deleted_by?: string | null;
}

export interface AuditLog {
  id: string;
  actor_email: string;
  actor_name: string;
  actor_role: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "LOGIN" | "IMPORT";
  entity_type: "residents" | "sensus_kk" | "news_articles" | "announcements" | "village_agenda" | "apbdes_sectors" | "aparatur_users";
  entity_id: string;
  description: string;
  old_data?: any;
  new_data?: any;
  created_at: string;
}

// ----------------------------------------------------------------------------
// KALKULASI OTOMATIS DESIL KESEJAHTERAAN KELUARGA
// ----------------------------------------------------------------------------
export function calculateDesil(
  dinding: string,
  lantai: string,
  penghasilan: string,
  luasLantai: number,
  jumlahAnggota: number
): 1 | 2 | 3 | 4 {
  let score = 0;

  // Bobot Dinding
  if (dinding === "Bilik Bambu / Papan") score += 3;
  else if (dinding === "Setengah Tembok") score += 2;
  else score += 1;

  // Bobot Lantai
  if (lantai === "Tanah") score += 3;
  else if (lantai === "Semen Rata") score += 2;
  else score += 1;

  // Bobot Penghasilan
  if (penghasilan === "Dibawah Rp 1.000.000") score += 3;
  else if (penghasilan === "Rp 1.000.000 - Rp 2.000.000") score += 2;
  else if (penghasilan === "Rp 2.000.000 - Rp 4.000.000") score += 1;

  // Luas Lantai per Jiwa
  const rasioPerOrang = luasLantai / Math.max(1, jumlahAnggota);
  if (rasioPerOrang < 8) score += 2;
  else if (rasioPerOrang < 14) score += 1;

  if (score >= 9) return 1; // Sangat Rentan (Desil 1)
  if (score >= 7) return 2; // Rentan (Desil 2)
  if (score >= 5) return 3; // Pra-Sejahtera / Berkembang (Desil 3)
  return 4;                 // Mandiri (Desil 4)
}

// ----------------------------------------------------------------------------
// DAFTAR AKUN RESMI APARATUR PEMDES KADURAMA
// ----------------------------------------------------------------------------
export const APARATUR_ACCOUNTS: AparaturUser[] = [
  {
    email: "master@kadurama.com",
    nama: "Developer & Master Administrator",
    role: "master",
    jabatan: "Super Administrator Sistem (Full Access)",
    dusun: "all",
  },
  {
    email: "sekdes@kadurama.com",
    nama: "Sumiati, SE",
    role: "sekdes",
    jabatan: "Sekretaris Desa Kadurama",
    dusun: "all",
  },
  {
    email: "kadus.pahing@kadurama.com",
    nama: "Trida Sentosa",
    role: "kadus",
    jabatan: "Kepala Dusun I Pahing",
    dusun: "Pahing",
  },
  {
    email: "kadus.wage@kadurama.com",
    nama: "Andri Rukmana",
    role: "kadus",
    jabatan: "Kepala Dusun II Wage",
    dusun: "Wage",
  },
  {
    email: "kadus.manis@kadurama.com",
    nama: "Jamaludin",
    role: "kadus",
    jabatan: "Kepala Dusun III Manis",
    dusun: "Manis",
  },
  {
    email: "keuangan@kadurama.com",
    nama: "Leni Sumiati",
    role: "keuangan",
    jabatan: "Kaur Keuangan & Perbendaharaan",
    dusun: "all",
  },
  {
    email: "kesra@kadurama.com",
    nama: "Ayub Suhandi",
    role: "kesra",
    jabatan: "Kasi Kesejahteraan Rakyat & Bansos",
    dusun: "all",
  },
  {
    email: "operator@kadurama.com",
    nama: "Operator Balai Desa",
    role: "operator",
    jabatan: "Staf Administrasi & Pelayanan Warga",
    dusun: "all",
  },
];
