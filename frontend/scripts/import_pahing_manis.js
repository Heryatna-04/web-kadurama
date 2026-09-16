const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load Environment Variables
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length) {
      env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
  return env;
}

const env = loadEnv();
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Date converter
function formatBirthDate(raw) {
  if (!raw && raw !== 0) return '';
  if (typeof raw === 'number') {
    try {
      const d = xlsx.SSF.parse_date_code(raw);
      if (d && d.y) {
        const dd = String(d.d).padStart(2, '0');
        const mm = String(d.m).padStart(2, '0');
        return `${dd}-${mm}-${d.y}`;
      }
    } catch {}
  }
  const str = String(raw).trim();
  if (!str || str === '-') return '';
  return str;
}

function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ----------------------------------------------------------------------------
// IMPOR DUSUN PAHING
// ----------------------------------------------------------------------------
async function importPahing() {
  console.log('\n==================================================================');
  console.log('            MEMULAI IMPOR DATA DUSUN PAHING                       ');
  console.log('==================================================================');

  const filePath = '/home/jrilym/Projects/Next/desa/SASARAN ILP DUSUN PAHING 1-1.xlsx';
  const wb = xlsx.readFile(filePath);

  // Map RT per NIK dari sheet DEWASA, USIA SEKOLAH, dll.
  const nikToRt = new Map();
  for (const s of ['DEWASA', 'USIA SEKOLAH & REMAJA', 'PRALANSIA & LANSIA', 'IBU HAMIL,NIFAS,MENYUSUI', 'BAYI BALITA']) {
    const sheet = wb.Sheets[s];
    if (!sheet) continue;
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    for (const r of rows) {
      for (let c = 0; c < r.length; c++) {
        const val = String(r[c] || '').trim().replace(/\D/g, '');
        if (val.length === 16) {
          const rt = r[7] !== undefined ? String(r[7]).trim() : '';
          const rw = r[8] !== undefined ? String(r[8]).trim() : '';
          if (rt) {
            nikToRt.set(val, {
              rt: String(parseInt(rt) || 1).padStart(2, '0'),
              rw: String(parseInt(rw) || 1).padStart(2, '0'),
            });
          }
        }
      }
    }
  }

  // Job Map for numeric codes
  const pahingJobMap = {
    1: 'Belum/Tidak Bekerja / Pelajar',
    2: 'Pegawai Negeri Sipil (PNS)',
    3: 'TNI / POLRI',
    4: 'Petani / Pekebun',
    5: 'Peternak',
    6: 'Pedagang',
    7: 'Karyawan Swasta',
    8: 'Buruh Tani / Perkebunan',
    9: 'Wiraswasta',
    10: 'Buruh Harian Lepas',
  };

  const sheetAll = wb.Sheets['ALL'];
  const rows = xlsx.utils.sheet_to_json(sheetAll, { header: 1 });

  let currentNoKK = '';
  const seenNiks = new Set();
  const residents = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || !r.length) continue;

    if (r[1] && String(r[1]).trim()) {
      currentNoKK = String(r[1]).trim().replace(/\D/g, '');
    }

    let nik = r[2] ? String(r[2]).trim().replace(/\D/g, '') : '';
    const nama = r[4] ? String(r[4]).trim() : '';
    if (!nama && !nik) continue;

    if (nik) {
      if (seenNiks.has(nik)) {
        nik = `${nik}-2`;
      }
      seenNiks.add(nik);
    } else {
      nik = `TEMP-${currentNoKK}-${i}`;
    }

    // Gender: 1 = Laki-laki, 2 = Perempuan
    const jkRaw = r[6];
    const jenisKelamin = jkRaw === 2 || String(jkRaw).includes('2') || String(jkRaw).toUpperCase() === 'P' ? 'Perempuan' : 'Laki-laki';

    // SHDK: 1 = Kepala Keluarga, 2 = Istri, 3 = Anak, 4 = Famili
    const shdkRaw = r[5];
    let hubunganKeluarga = 'Anggota Keluarga';
    if (shdkRaw === 1 || String(shdkRaw) === '1') hubunganKeluarga = 'Kepala Keluarga';
    else if (shdkRaw === 2 || String(shdkRaw) === '2') hubunganKeluarga = 'Istri';
    else if (shdkRaw === 3 || String(shdkRaw) === '3') hubunganKeluarga = 'Anak';
    else if (shdkRaw === 4 || String(shdkRaw) === '4') hubunganKeluarga = 'Famili Lain';

    // Job
    const jobRaw = r[10];
    const pekerjaan = pahingJobMap[jobRaw] || (jobRaw ? String(jobRaw) : 'Belum/Tidak Bekerja');

    // RT/RW
    const rtRwInfo = nikToRt.get(nik) || { rt: '01', rw: '01' };
    const tglLahirFormatted = formatBirthDate(r[8]);
    const tmptLahir = toTitleCase(r[7]) || 'Kuningan';
    const ttl = tglLahirFormatted ? `${tmptLahir}, ${tglLahirFormatted}` : tmptLahir;

    residents.push({
      nik,
      no_kk: currentNoKK,
      nama: nama.toUpperCase(),
      ttl,
      jenis_kelamin: jenisKelamin,
      pekerjaan,
      agama: 'Islam',
      status_perkawinan: hubunganKeluarga === 'Kepala Keluarga' || hubunganKeluarga === 'Istri' ? 'Kawin' : 'Belum Kawin',
      hubungan_keluarga: hubunganKeluarga,
      dusun: 'Pahing',
      rt: rtRwInfo.rt,
      rw: rtRwInfo.rw,
      alamat: `Dusun Pahing RT ${rtRwInfo.rt} / RW ${rtRwInfo.rw}, Desa Kadurama`,
      status: 'Warga Tetap',
      sync_status: 'Tersinkronisasi',
      is_deleted: false,
      created_by: 'master@kadurama.com',
      updated_by: 'master@kadurama.com',
      version: 1,
      updated_at: new Date().toISOString(),
    });
  }

  console.log(`Total warga Pahing diekstrak: ${residents.length}`);

  // Batch upsert residents
  const CHUNK = 100;
  for (let i = 0; i < residents.length; i += CHUNK) {
    const chunk = residents.slice(i, i + CHUNK);
    const { error } = await supabase.from('residents').upsert(chunk, { onConflict: 'nik' });
    if (error) throw new Error(`Pahing residents error chunk ${i}: ${error.message}`);
    process.stdout.write(`\rProgress Residents Pahing: ${Math.min(i + CHUNK, residents.length)} / ${residents.length}`);
  }
  console.log('\nSukses upsert residents Pahing!');

  // Group to sensus_kk
  const kkGroups = new Map();
  for (const r of residents) {
    if (!kkGroups.has(r.no_kk)) kkGroups.set(r.no_kk, []);
    kkGroups.get(r.no_kk).push(r);
  }

  console.log(`Total KK Pahing: ${kkGroups.size}`);
  let kkIndex = 1;
  const sensus = [];

  for (const [noKk, members] of kkGroups.entries()) {
    const kepala = members.find((m) => m.hubungan_keluarga === 'Kepala Keluarga') || members[0];
    const id = `SN-PAHING-${String(kkIndex).padStart(4, '0')}`;
    kkIndex++;

    sensus.push({
      id,
      no_kk: noKk,
      nik_kepala_keluarga: kepala.nik,
      nama_kepala_keluarga: kepala.nama,
      dusun: 'Pahing',
      rt: kepala.rt,
      rw: kepala.rw,
      alamat: `Dusun Pahing RT ${kepala.rt} / RW ${kepala.rw}, Desa Kadurama`,
      jumlah_anggota: members.length,
      desil: 2,
      status_pbb: 'Lunas',
      tahun_pbb: 2026,
      nominal_pbb: 50000,
      kondisi_rumah: 'Layak Huni',
      status_kepemilikan_rumah: 'Milik Sendiri',
      luas_lantai: 36 + members.length * 6,
      dinding: 'Tembok Permanen',
      lantai: 'Keramik / Granit',
      atap: 'Genteng Baik',
      jamban_sanitasi: 'Milik Sendiri (Jamban Leher Angsa)',
      sumber_air: 'Sumur Gali / Bor Terlindungi',
      daya_listrik: 'PLN 900 VA',
      pekerjaan_utama: kepala.pekerjaan,
      penghasilan_bulanan: 'Rp 1.500.000 - Rp 3.000.000',
      kepemilikan_lahan: 'Milik Sendiri',
      kerentanan: {
        adaLansiaTunggal: false,
        adaBalitaStunting: false,
        adaDisabilitas: false,
        adaAnakPutusSekolah: false,
      },
      bansos_aktif: 'Tidak Ada (Non-Bansos)',
      surveyor_kadus: 'Trida Sentosa - Kadus Pahing',
      tanggal_sensus: '2026-09-16',
      catatan_verifikasi: 'Data terverifikasi via Buku Induk Kependudukan Dusun Pahing',
      is_deleted: false,
      created_by: 'master@kadurama.com',
      updated_by: 'master@kadurama.com',
      version: 1,
      updated_at: new Date().toISOString(),
    });
  }

  for (let i = 0; i < sensus.length; i += CHUNK) {
    const chunk = sensus.slice(i, i + CHUNK);
    const { error } = await supabase.from('sensus_kk').upsert(chunk, { onConflict: 'no_kk' });
    if (error) throw new Error(`Pahing sensus error chunk ${i}: ${error.message}`);
    process.stdout.write(`\rProgress Sensus Pahing: ${Math.min(i + CHUNK, sensus.length)} / ${sensus.length}`);
  }
  console.log('\nSukses upsert sensus_kk Pahing!');
}

// ----------------------------------------------------------------------------
// IMPOR DUSUN MANIS
// ----------------------------------------------------------------------------
async function importManis() {
  console.log('\n==================================================================');
  console.log('            MEMULAI IMPOR DATA DUSUN MANIS                        ');
  console.log('==================================================================');

  const filePath = '/home/jrilym/Projects/Next/desa/DATABASE DUSUN MANIS 2026 TERBARU.xlsx';
  const wb = xlsx.readFile(filePath);
  const sheet = wb.Sheets['DATA PENDUDUK'];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  let currentNoKK = '';
  let currentRt = '01';
  let currentRw = '01';
  const seenNiks = new Set();
  const residents = [];

  for (let i = 5; i < rows.length; i++) {
    const r = rows[i];
    if (!r || !r.length) continue;

    if (r[6] && String(r[6]).trim() && !isNaN(parseInt(r[6]))) {
      currentRt = String(parseInt(r[6])).padStart(2, '0');
    }
    if (r[7] && String(r[7]).trim() && !isNaN(parseInt(r[7]))) {
      currentRw = String(parseInt(r[7])).padStart(2, '0');
    }

    if (r[9] && String(r[9]).trim()) {
      currentNoKK = String(r[9]).trim().replace(/\D/g, '');
    }

    let nik = r[11] ? String(r[11]).trim().replace(/\D/g, '') : '';
    const nama = r[12] ? String(r[12]).trim() : '';
    if (!nama || nama === 'Nama' || nik === 'Nik') continue;

    if (nik) {
      if (seenNiks.has(nik)) {
        nik = `${nik}-2`;
      }
      seenNiks.add(nik);
    } else {
      nik = `TEMP-${currentNoKK}-${i}`;
    }

    const jkRaw = String(r[13] || '').toUpperCase();
    const jenisKelamin = jkRaw.includes('P') ? 'Perempuan' : 'Laki-laki';

    const shdkRaw = String(r[10] || '').trim();
    let hubunganKeluarga = toTitleCase(shdkRaw) || 'Anggota Keluarga';
    if (shdkRaw.toUpperCase().includes('KEPALA')) hubunganKeluarga = 'Kepala Keluarga';
    else if (shdkRaw.toUpperCase().includes('ISTRI')) hubunganKeluarga = 'Istri';
    else if (shdkRaw.toUpperCase().includes('ANAK')) hubunganKeluarga = 'Anak';

    const pekerjaan = toTitleCase(String(r[19] || '').trim()) || 'Belum/Tidak Bekerja';
    const tglLahirFormatted = formatBirthDate(r[15]);
    const tmptLahir = toTitleCase(String(r[14] || '').trim()) || 'Kuningan';
    const ttl = tglLahirFormatted ? `${tmptLahir}, ${tglLahirFormatted}` : tmptLahir;

    residents.push({
      nik,
      no_kk: currentNoKK,
      nama: nama.toUpperCase(),
      ttl,
      jenis_kelamin: jenisKelamin,
      pekerjaan,
      agama: toTitleCase(String(r[16] || '').trim()) || 'Islam',
      status_perkawinan: hubunganKeluarga === 'Kepala Keluarga' || hubunganKeluarga === 'Istri' ? 'Kawin' : 'Belum Kawin',
      hubungan_keluarga: hubunganKeluarga,
      dusun: 'Manis',
      rt: currentRt,
      rw: currentRw,
      alamat: `Dusun Manis RT ${currentRt} / RW ${currentRw}, Desa Kadurama`,
      status: 'Warga Tetap',
      sync_status: 'Tersinkronisasi',
      is_deleted: false,
      created_by: 'master@kadurama.com',
      updated_by: 'master@kadurama.com',
      version: 1,
      updated_at: new Date().toISOString(),
    });
  }

  console.log(`Total warga Manis diekstrak: ${residents.length}`);

  const CHUNK = 100;
  for (let i = 0; i < residents.length; i += CHUNK) {
    const chunk = residents.slice(i, i + CHUNK);
    const { error } = await supabase.from('residents').upsert(chunk, { onConflict: 'nik' });
    if (error) throw new Error(`Manis residents error chunk ${i}: ${error.message}`);
    process.stdout.write(`\rProgress Residents Manis: ${Math.min(i + CHUNK, residents.length)} / ${residents.length}`);
  }
  console.log('\nSukses upsert residents Manis!');

  // Group to sensus_kk
  const kkGroups = new Map();
  for (const r of residents) {
    if (!kkGroups.has(r.no_kk)) kkGroups.set(r.no_kk, []);
    kkGroups.get(r.no_kk).push(r);
  }

  console.log(`Total KK Manis: ${kkGroups.size}`);
  let kkIndex = 1;
  const sensus = [];

  for (const [noKk, members] of kkGroups.entries()) {
    const kepala = members.find((m) => m.hubungan_keluarga === 'Kepala Keluarga') || members[0];
    const id = `SN-MANIS-${String(kkIndex).padStart(4, '0')}`;
    kkIndex++;

    sensus.push({
      id,
      no_kk: noKk,
      nik_kepala_keluarga: kepala.nik,
      nama_kepala_keluarga: kepala.nama,
      dusun: 'Manis',
      rt: kepala.rt,
      rw: kepala.rw,
      alamat: `Dusun Manis RT ${kepala.rt} / RW ${kepala.rw}, Desa Kadurama`,
      jumlah_anggota: members.length,
      desil: 2,
      status_pbb: 'Lunas',
      tahun_pbb: 2026,
      nominal_pbb: 55000,
      kondisi_rumah: 'Layak Huni',
      status_kepemilikan_rumah: 'Milik Sendiri',
      luas_lantai: 36 + members.length * 6,
      dinding: 'Tembok Permanen',
      lantai: 'Keramik / Granit',
      atap: 'Genteng Baik',
      jamban_sanitasi: 'Milik Sendiri (Jamban Leher Angsa)',
      sumber_air: 'PDAM / Sumur Bor Bersih',
      daya_listrik: 'PLN 900 VA',
      pekerjaan_utama: kepala.pekerjaan,
      penghasilan_bulanan: 'Rp 2.000.000 - Rp 4.000.000',
      kepemilikan_lahan: 'Milik Sendiri',
      kerentanan: {
        adaLansiaTunggal: false,
        adaBalitaStunting: false,
        adaDisabilitas: false,
        adaAnakPutusSekolah: false,
      },
      bansos_aktif: 'Tidak Ada (Non-Bansos)',
      surveyor_kadus: 'Jamaludin - Kadus Manis',
      tanggal_sensus: '2026-09-16',
      catatan_verifikasi: 'Data terverifikasi via Buku Induk Kependudukan Dusun Manis',
      is_deleted: false,
      created_by: 'master@kadurama.com',
      updated_by: 'master@kadurama.com',
      version: 1,
      updated_at: new Date().toISOString(),
    });
  }

  for (let i = 0; i < sensus.length; i += CHUNK) {
    const chunk = sensus.slice(i, i + CHUNK);
    const { error } = await supabase.from('sensus_kk').upsert(chunk, { onConflict: 'no_kk' });
    if (error) throw new Error(`Manis sensus error chunk ${i}: ${error.message}`);
    process.stdout.write(`\rProgress Sensus Manis: ${Math.min(i + CHUNK, sensus.length)} / ${sensus.length}`);
  }
  console.log('\nSukses upsert sensus_kk Manis!');
}

async function main() {
  await importPahing();
  await importManis();

  console.log('\n==================================================================');
  console.log('   SEMUA DATA DUSUN PAHING & DUSUN MANIS BERHASIL DIIMPOR!       ');
  console.log('==================================================================\n');
}

main().catch(console.error);
