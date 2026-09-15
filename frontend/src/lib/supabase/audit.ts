import { createClient } from "./client";

export interface AuditLogEntry {
  actor_email: string;
  actor_name: string;
  actor_role: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "LOGIN" | "IMPORT";
  entity_type: "residents" | "sensus_kk" | "news_articles" | "apbdes_sectors" | "aparatur_users";
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
