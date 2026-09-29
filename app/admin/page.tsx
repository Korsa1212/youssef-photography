import { redirect } from "next/navigation";
import { checkAdmin } from "@/lib/supabase/admin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const check = await checkAdmin();

  if (check.status !== "ok") {
    redirect(
      check.status === "setup_missing"
        ? "/admin/login?error=setup_missing"
        : "/admin/login?error=not_allowed"
    );
  }

  return <AdminDashboard userEmail={check.email} />;
}
