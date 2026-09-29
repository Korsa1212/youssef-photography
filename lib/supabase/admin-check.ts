import type { SupabaseClient } from "@supabase/supabase-js";

export type AdminStatus = "ok" | "not_allowed" | "setup_missing";

/**
 * Checks the signed-in email against the public.admins allowlist.
 *
 * Fails closed: if the `admins` table has not been created yet we
 * return "setup_missing" instead of quietly letting people through.
 */
export async function verifyAdmin(
  supabase: SupabaseClient,
  email: string | null | undefined
): Promise<AdminStatus> {
  if (!email) return "not_allowed";

  try {
    const { data, error } = await supabase
      .from("admins")
      .select("email")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (error) return "setup_missing";
    return data ? "ok" : "not_allowed";
  } catch {
    return "setup_missing";
  }
}
