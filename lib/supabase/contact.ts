import { createClient as createBareClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Contact messages (`supabase/003-contact.sql`).
 *
 * Split in two halves on purpose:
 *   - `submitContactMessage` runs as the **anon** role and can only insert.
 *   - the `get...` / `set...` / `delete...` helpers run as the signed-in
 *     admin session.
 *
 * The split is enforced by RLS, not by this file, so a mistake here cannot
 * hand out the inbox.
 */

export const CONTACT_EVENT_TYPES = [
  "mariage",
  "fiançailles",
  "evenement",
  "autre",
] as const;

export type ContactEventType = (typeof CONTACT_EVENT_TYPES)[number];

export type ContactStatus = "unread" | "handled";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: ContactEventType | null;
  event_date: string | null;
  location: string | null;
  message: string;
  locale: string;
  status: ContactStatus;
  handled_at: string | null;
  created_at: string;
};

const FIELDS =
  "id, name, email, phone, event_type, event_date, location, message, locale, status, handled_at, created_at";

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  event_type: string | null;
  event_date: string | null;
  location: string | null;
  message: string;
};

export type ValidationResult =
  | { ok: true; value: ContactPayload }
  | { ok: false; field: keyof ContactPayload; reason: "required" | "invalid" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Digits, spaces and the usual phone punctuation, at least 6 digits.
const PHONE_RE = /^[\d\s+().-]{6,32}$/;

function isEventType(v: string): v is ContactEventType {
  return (CONTACT_EVENT_TYPES as readonly string[]).includes(v);
}

/**
 * Trims, bounds-checks and normalises a submission.
 *
 * Length limits mirror the CHECK constraints in the migration so the visitor
 * gets a real error message instead of a bare Postgres constraint violation.
 */
export function validateContactPayload(
  raw: Record<string, unknown>
): ValidationResult {
  const name = String(raw.name ?? "").trim();
  if (name.length < 2) return { ok: false, field: "name", reason: "required" };
  if (name.length > 120) return { ok: false, field: "name", reason: "invalid" };

  const email = String(raw.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email))
    return { ok: false, field: "email", reason: email ? "invalid" : "required" };
  if (email.length > 254)
    return { ok: false, field: "email", reason: "invalid" };

  const phone = String(raw.phone ?? "").trim();
  // Required on purpose: a lead without a phone cannot be called back, and
  // WhatsApp is the main sales channel.
  if (phone.length < 6) return { ok: false, field: "phone", reason: "required" };
  if (!PHONE_RE.test(phone))
    return { ok: false, field: "phone", reason: "invalid" };

  const message = String(raw.message ?? "").trim();
  if (message.length < 10)
    return { ok: false, field: "message", reason: "required" };
  if (message.length > 4000)
    return { ok: false, field: "message", reason: "invalid" };

  const eventTypeRaw = String(raw.event_type ?? "").trim();
  const eventType = isEventType(eventTypeRaw) ? eventTypeRaw : null;

  const eventDateRaw = String(raw.event_date ?? "").trim();
  let eventDate: string | null = null;
  if (eventDateRaw) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDateRaw))
      return { ok: false, field: "event_date", reason: "invalid" };
    // Reject a date Postgres could not store, e.g. 2026-02-31.
    if (Number.isNaN(Date.parse(eventDateRaw)))
      return { ok: false, field: "event_date", reason: "invalid" };
    eventDate = eventDateRaw;
  }

  const location = String(raw.location ?? "").trim();
  if (location.length > 200)
    return { ok: false, field: "location", reason: "invalid" };

  return {
    ok: true,
    value: {
      name,
      email,
      phone,
      event_type: eventType,
      event_date: eventDate,
      location: location || null,
      message,
    },
  };
}

/**
 * Bare anon client for the public insert. The SSR `createClient()` wraps
 * cookie handling which doesn't work reliably when the visitor has no
 * Supabase session. A direct `@supabase/supabase-js` client uses the anon
 * key and matches the `to anon` INSERT policy in 003-contact.sql.
 */
function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase credentials missing from environment variables.");
  }
  return createBareClient(url, key);
}

/**
 * Public insert. Uses the anon client so RLS decides the role, and always
 * starts as `unread`.
 */
export async function submitContactMessage(
  payload: ContactPayload,
  locale: string
): Promise<{ ok: true } | { ok: false }> {
  const supabase = getAnonClient();
  const { error } = await supabase.from("contact_messages").insert({
    ...payload,
    locale: locale === "en" ? "en" : "fr",
    status: "unread",
  });
  if (error) {
    console.error("[contact] insert failed:", error.message, error.code, error.details);
    return { ok: false };
  }
  return { ok: true };
}

/* ---------------- Admin-side (authenticated) ---------------- */

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select(FIELDS)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ContactMessage[];
}

export async function setContactMessageStatus(
  id: string,
  status: ContactStatus
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ status, handled_at: status === "handled" ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteContactMessage(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}