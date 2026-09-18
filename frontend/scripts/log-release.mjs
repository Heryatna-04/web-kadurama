import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Memuat variabel lingkungan dari .env.local jika belum ada
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_KEY wajib tersedia.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log(`
Penggunaan CLI Rilis Fitur Developer:
  node scripts/log-release.mjs "<Versi>" "<Judul Fitur>" "<Deskripsi Pembaruan>"

Contoh:
  node scripts/log-release.mjs "v1.2.0" "Matriks Demografi & Validasi 16 Digit NIK" "Menambahkan kalkulasi demografi keluarga, proteksi sensor privasi UU PDP, dan validasi 16 digit NIK"
`);
  process.exit(0);
}

const version = args[0];
const title = args[1];
const details = args[2] || "";

const description = `Rilis Pembaruan Sistem (${version}): ${title}${details ? ` - ${details}` : ""}`;

async function main() {
  const { data, error } = await supabase.from("audit_logs").insert([
    {
      actor_email: "master@kadurama.com",
      actor_name: "Tim Pengembang Desa (Developer)",
      actor_role: "master",
      action: "UPDATE",
      entity_type: "aparatur_users",
      entity_id: "SYSTEM_RELEASE",
      description: description,
    },
  ]);

  if (error) {
    console.error("Gagal mencatat log rilis ke Supabase:", error.message);
    process.exit(1);
  }

  console.log("Berhasil mencatat log rilis sistem ke Supabase audit_logs:");
  console.log("  ->", description);
}

main();
