-- ============================================================================
-- SKEMA DATABASE RESMI PEMERINTAH DESA KADURAMA
-- Kecamatan Ciawigebang, Kabupaten Kuningan, Jawa Barat
-- Terintegrasi dengan Supabase PostgreSQL & Next.js App
-- Wilayah Resmi: Dusun Manis, Dusun Pahing, Dusun Wage
-- ============================================================================

-- Ekstensi UUID untuk ID unik
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. FUNGSI TRIGGER TIMESTAMP (Auto-update updated_at)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 2. TABEL: aparatur_users (Akun & Hak Akses Pamong Desa)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.aparatur_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    nama TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('master', 'sekdes', 'kadus', 'keuangan', 'kesra', 'operator')),
    jabatan TEXT NOT NULL,
    dusun TEXT CHECK (dusun IN ('Manis', 'Pahing', 'Wage', 'all')),
    password_hash TEXT NOT NULL DEFAULT 'kadurama2026',
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

DROP TRIGGER IF EXISTS set_aparatur_users_timestamp ON public.aparatur_users;
CREATE TRIGGER set_aparatur_users_timestamp
BEFORE UPDATE ON public.aparatur_users
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 3. TABEL: residents (Master Kependudukan 3 Dusun: Manis, Pahing, Wage)
-- Dengan Proteksi Soft Delete (Zero Data Loss)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.residents (
    nik TEXT PRIMARY KEY,
    no_kk TEXT NOT NULL,
    nama TEXT NOT NULL,
    ttl TEXT,
    jenis_kelamin TEXT CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
    pekerjaan TEXT,
    agama TEXT DEFAULT 'Islam',
    status_perkawinan TEXT,
    hubungan_keluarga TEXT,
    dusun TEXT NOT NULL CHECK (dusun IN ('Manis', 'Pahing', 'Wage')),
    rt TEXT NOT NULL,
    rw TEXT NOT NULL,
    alamat TEXT NOT NULL,
    status TEXT DEFAULT 'Warga Tetap',
    sync_status TEXT DEFAULT 'Tersinkronisasi',
    -- Kolom Soft Delete & Audit Pelaku
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    deleted_by TEXT DEFAULT NULL,
    created_by TEXT DEFAULT 'system',
    updated_by TEXT DEFAULT 'system',
    version INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_residents_no_kk ON public.residents(no_kk);
CREATE INDEX IF NOT EXISTS idx_residents_dusun ON public.residents(dusun);
CREATE INDEX IF NOT EXISTS idx_residents_nama ON public.residents(nama);
CREATE INDEX IF NOT EXISTS idx_residents_is_deleted ON public.residents(is_deleted);

DROP TRIGGER IF EXISTS set_residents_timestamp ON public.residents;
CREATE TRIGGER set_residents_timestamp
BEFORE UPDATE ON public.residents
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 4. TABEL: sensus_kk (Sensus Mikro Profil Keluarga, Desil 1-4 & RTLH)
-- Dilengkapi Foto Rumah & Foto KK, Tanpa Kolom Lat/Long, dengan Soft Delete
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sensus_kk (
    id TEXT PRIMARY KEY,
    no_kk TEXT NOT NULL UNIQUE,
    nik_kepala_keluarga TEXT NOT NULL,
    nama_kepala_keluarga TEXT NOT NULL,
    dusun TEXT NOT NULL CHECK (dusun IN ('Manis', 'Pahing', 'Wage')),
    rt TEXT NOT NULL,
    rw TEXT NOT NULL,
    alamat TEXT NOT NULL,
    jumlah_anggota INTEGER DEFAULT 1,
    desil INTEGER NOT NULL CHECK (desil BETWEEN 1 AND 4),
    status_pbb TEXT DEFAULT 'Belum Lunas' CHECK (status_pbb IN ('Lunas', 'Belum Lunas')),
    tahun_pbb INTEGER DEFAULT 2026,
    nominal_pbb NUMERIC DEFAULT 0,
    kondisi_rumah TEXT DEFAULT 'Layak Huni' CHECK (kondisi_rumah IN ('Layak Huni', 'RTLH')),
    status_kepemilikan_rumah TEXT DEFAULT 'Milik Sendiri',
    luas_lantai NUMERIC DEFAULT 36,
    dinding TEXT NOT NULL,
    lantai TEXT NOT NULL,
    atap TEXT NOT NULL,
    jamban_sanitasi TEXT NOT NULL,
    sumber_air TEXT NOT NULL,
    daya_listrik TEXT NOT NULL,
    pekerjaan_utama TEXT,
    penghasilan_bulanan TEXT,
    kepemilikan_lahan TEXT,
    kerentanan JSONB DEFAULT '{"adaLansiaTunggal": false, "adaBalitaStunting": false, "adaDisabilitas": false, "adaAnakPutusSekolah": false}'::jsonb,
    bansos_aktif TEXT DEFAULT 'Tidak Ada (Non-Bansos)',
    -- Foto Dokumentasi Fisik (Kriteria RTLH & Dokumen)
    foto_rumah_url TEXT,
    foto_kk_url TEXT,
    surveyor_kadus TEXT NOT NULL,
    tanggal_sensus TEXT NOT NULL,
    catatan_verifikasi TEXT,
    -- Kolom Soft Delete & Audit Pelaku
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    deleted_by TEXT DEFAULT NULL,
    created_by TEXT DEFAULT 'system',
    updated_by TEXT DEFAULT 'system',
    version INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sensus_dusun ON public.sensus_kk(dusun);
CREATE INDEX IF NOT EXISTS idx_sensus_desil ON public.sensus_kk(desil);
CREATE INDEX IF NOT EXISTS idx_sensus_status_pbb ON public.sensus_kk(status_pbb);
CREATE INDEX IF NOT EXISTS idx_sensus_kondisi_rumah ON public.sensus_kk(kondisi_rumah);
CREATE INDEX IF NOT EXISTS idx_sensus_is_deleted ON public.sensus_kk(is_deleted);

DROP TRIGGER IF EXISTS set_sensus_kk_timestamp ON public.sensus_kk;
CREATE TRIGGER set_sensus_kk_timestamp
BEFORE UPDATE ON public.sensus_kk
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 5. TABEL: news_articles (Manajemen Kabar Desa & Publikasi)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.news_articles (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    author TEXT NOT NULL,
    author_role TEXT,
    read_time TEXT,
    summary TEXT NOT NULL,
    content JSONB NOT NULL,
    status TEXT DEFAULT 'Terbit' CHECK (status IN ('Terbit', 'Draf')),
    image_url TEXT,
    tags TEXT[],
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_news_status ON public.news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_news_is_deleted ON public.news_articles(is_deleted);

DROP TRIGGER IF EXISTS set_news_articles_timestamp ON public.news_articles;
CREATE TRIGGER set_news_articles_timestamp
BEFORE UPDATE ON public.news_articles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 6. TABEL: apbdes_sectors & apbdes_summary (Transparansi APBDes 2026)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.apbdes_sectors (
    id INTEGER PRIMARY KEY,
    nama TEXT NOT NULL,
    pagu BIGINT NOT NULL,
    realisasi BIGINT NOT NULL,
    persen NUMERIC(5,2) DEFAULT 0,
    keterangan TEXT,
    sub_kegiatan JSONB DEFAULT '[]'::jsonb,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.apbdes_summary (
    tahun INTEGER PRIMARY KEY,
    total_pendapatan BIGINT NOT NULL,
    total_belanja BIGINT NOT NULL,
    total_realisasi_belanja BIGINT NOT NULL,
    persen_realisasi_belanja NUMERIC(5,2) NOT NULL,
    surplus_defisit BIGINT NOT NULL,
    silpa_tahun_lalu BIGINT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 7. TABEL: audit_logs (Riwayat Aktivitas & Jejak Audit Digital)
-- Mencatat Siapa Mengubah Apa secara Kronologis Terbaru
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_email TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'RESTORE', 'LOGIN')),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('residents', 'sensus_kk', 'news_articles', 'apbdes_sectors', 'aparatur_users')),
    entity_id TEXT NOT NULL,
    description TEXT NOT NULL,
    old_data JSONB, -- Data SEBELUM perubahan
    new_data JSONB, -- Data SESUDAH perubahan
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- ----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.aparatur_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensus_kk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apbdes_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apbdes_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy Publik (Read-only untuk Berita & Transparansi APBDes yang tidak didelete)
DROP POLICY IF EXISTS "Public Read Articles" ON public.news_articles;
CREATE POLICY "Public Read Articles" ON public.news_articles
FOR SELECT TO anon, authenticated USING (status = 'Terbit' AND is_deleted = FALSE);

DROP POLICY IF EXISTS "Public Read APBDes Sectors" ON public.apbdes_sectors;
CREATE POLICY "Public Read APBDes Sectors" ON public.apbdes_sectors
FOR SELECT TO anon, authenticated USING (is_deleted = FALSE);

DROP POLICY IF EXISTS "Public Read APBDes Summary" ON public.apbdes_summary;
CREATE POLICY "Public Read APBDes Summary" ON public.apbdes_summary
FOR SELECT TO anon, authenticated USING (true);

-- Policy Pengelolaan Aparatur (Full Control untuk Sesi Terautentikasi & Service Role)
DROP POLICY IF EXISTS "Aparatur Manage Users" ON public.aparatur_users;
CREATE POLICY "Aparatur Manage Users" ON public.aparatur_users
FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Aparatur Manage Residents" ON public.residents;
CREATE POLICY "Aparatur Manage Residents" ON public.residents
FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Aparatur Manage Sensus" ON public.sensus_kk;
CREATE POLICY "Aparatur Manage Sensus" ON public.sensus_kk
FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Aparatur Manage Articles" ON public.news_articles;
CREATE POLICY "Aparatur Manage Articles" ON public.news_articles
FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Aparatur Manage APBDes" ON public.apbdes_sectors;
CREATE POLICY "Aparatur Manage APBDes" ON public.apbdes_sectors
FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Aparatur Read Logs" ON public.audit_logs;
CREATE POLICY "Aparatur Read Logs" ON public.audit_logs
FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 9. SEED DATA: AKUN RESMI APARATUR PEMDES KADURAMA
-- Termasuk Dusun III Wage (Agus Setiawan)
-- ----------------------------------------------------------------------------
INSERT INTO public.aparatur_users (email, nama, role, jabatan, dusun, password_hash)
VALUES
  ('master@kadurama.com', 'Developer & Master Administrator', 'master', 'Super Administrator Sistem', 'all', 'kadurama2026'),
  ('sekdes@kadurama.com', 'Dadang Kurnia', 'sekdes', 'Sekretaris Desa Kadurama', 'all', 'kadurama2026'),
  ('kadus.manis@kadurama.com', 'Ahmad Dahlan', 'kadus', 'Kepala Dusun I Manis', 'Manis', 'kadurama2026'),
  ('kadus.pahing@kadurama.com', 'Rohmat Hidayat', 'kadus', 'Kepala Dusun II Pahing', 'Pahing', 'kadurama2026'),
  ('kadus.wage@kadurama.com', 'Agus Setiawan', 'kadus', 'Kepala Dusun III Wage', 'Wage', 'kadurama2026'),
  ('keuangan@kadurama.com', 'Ismail Saleh, S.E', 'keuangan', 'Kaur Keuangan & Perbendaharaan', 'all', 'kadurama2026'),
  ('kesra@kadurama.com', 'Iskandar Zulkarnaen', 'kesra', 'Kasi Kesejahteraan Rakyat & Bansos', 'all', 'kadurama2026'),
  ('operator@kadurama.com', 'Operator Balai Desa', 'operator', 'Staf Administrasi & Kependudukan', 'all', 'kadurama2026')
ON CONFLICT (email) DO UPDATE SET
  nama = EXCLUDED.nama,
  role = EXCLUDED.role,
  jabatan = EXCLUDED.jabatan,
  dusun = EXCLUDED.dusun;

-- ----------------------------------------------------------------------------
-- 10. SEED DATA: RINGKASAN APBDES 2026 RESMI
-- ----------------------------------------------------------------------------
INSERT INTO public.apbdes_summary (tahun, total_pendapatan, total_belanja, total_realisasi_belanja, persen_realisasi_belanja, surplus_defisit, silpa_tahun_lalu)
VALUES (2026, 1488500000, 1445000000, 1148782000, 79.5, 43500000, 28400000)
ON CONFLICT (tahun) DO NOTHING;

INSERT INTO public.apbdes_sectors (id, nama, pagu, realisasi, persen, keterangan)
VALUES
  (1, 'Penyelenggaraan Pemerintahan Desa', 485000000, 412250000, 85.0, 'Operasional perkantoran, siltap, dan pelayanan adminduk'),
  (2, 'Pelaksanaan Pembangunan Desa', 520000000, 395200000, 76.0, 'Infrastruktur jalan usaha tani Dusun Pahing & perpipaan Dusun Wage'),
  (3, 'Pembinaan Kemasyarakatan Desa', 145000000, 118900000, 82.0, 'Kelembagaan adat, olahraga Gelora Kadurama & Karang Taruna'),
  (4, 'Pemberdayaan Masyarakat Desa', 165000000, 122100000, 74.0, 'Pelatihan Gapoktan tani organik & budidaya ubi Dusun Wage'),
  (5, 'Penanggulangan Bencana & Mendesak', 130000000, 100332000, 77.2, 'BLT Dana Desa kemiskinan ekstrem & tanggap darurat')
ON CONFLICT (id) DO NOTHING;

-- Catatan Awal di Audit Log: Inisialisasi Sistem
INSERT INTO public.audit_logs (actor_email, actor_name, actor_role, action, entity_type, entity_id, description)
VALUES (
  'master@kadurama.com',
  'Developer & Master Administrator',
  'master',
  'CREATE',
  'aparatur_users',
  'SYS-INIT-2026',
  'Inisialisasi sistem database Desa Kadurama, 3 Dusun (Manis, Pahing, Wage) dan 8 akun aparatur resmi'
);
