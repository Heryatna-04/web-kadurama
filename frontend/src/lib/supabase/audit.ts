import { createClient } from "./client";

export interface AuditLogEntry {
  actor_email: string;
  actor_name: string;
  actor_role: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "LOGIN" | "IMPORT";
  entity_type: "residents" | "sensus_kk" | "news_articles" | "announcements" | "village_agenda" | "apbdes_sectors" | "aparatur_users";
  entity_id: string;
  description: string;
  old_data?: any;
  new_data?: any;
}

export async function recordAuditLog(entry: AuditLogEntry) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("audit_logs").insert([
      {
        actor_email: entry.actor_email,
        actor_name: entry.actor_name,
        actor_role: entry.actor_role,
        action: entry.action,
        entity_type: entry.entity_type,
        entity_id: entry.entity_id,
        description: entry.description,
        old_data: entry.old_data || null,
        new_data: entry.new_data || null,
      },
    ]);
    if (error) {
      console.warn("Failed to record audit log:", error.message);
    }
  } catch (err) {
    console.warn("Error recording audit log:", err);
  }
}

/**
 * Mencatat rilis pembaruan sistem / fitur baru secara manual oleh pengembang
 * saat merilis versi baru ke production / push origin.
 * Log ini adalah satu-satunya log developer yang ditampilkan ke klien APDES.
 */
export async function recordSystemReleaseLog(version: string, title: string, description: string) {
  return recordAuditLog({
    actor_email: "master@kadurama.com",
    actor_name: "Tim Pengembang Desa (Developer)",
    actor_role: "master",
    action: "UPDATE",
    entity_type: "aparatur_users",
    entity_id: "SYSTEM_RELEASE",
    description: `Rilis Pembaruan Sistem (${version}): ${title} - ${description}`,
  });
}

