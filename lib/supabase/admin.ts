import { createClient } from "@/lib/supabase/server";
import { verifyAdmin, type AdminStatus } from "@/lib/supabase/admin-check";

export type AdminCheck =
  | { status: "ok"; email: string }
  | { status: "signed_out" }
  | { status: "not_allowed"; email: string }
  | { status: "setup_missing" };

/**
 * Server-side admin gate used by the /admin pages.
 * Blocks anyone who is merely logged in but not on the allowlist.
 */
export async function checkAdmin(): Promise<AdminCheck> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return { status: "signed_out" };

    const email = user.email.toLowerCase();
    const status: AdminStatus = await verifyAdmin(supabase, email);

    if (status === "ok") return { status: "ok", email };
    if (status === "not_allowed") return { status: "not_allowed", email };
    return { status: "setup_missing" };
  } catch {
    return { status: "signed_out" };
  }
}
