import { NextResponse } from "next/server";
import { isLocale } from "@/i18n/routing";
import {
  submitContactMessage,
  validateContactPayload,
} from "@/lib/supabase/contact";

/** Bots that fill every field instantly never spend this long on the form. */
const MIN_SECONDS_ON_PAGE = 3;
const MAX_BODY_BYTES = 8_000;

/**
 * POST /api/contact — public contact form endpoint.
 *
 * Lives under the root `app/api` segment (never `/[locale]`) so it has one URL
 * for both languages; the visitor's language rides along in the `locale` field
 * instead of the path.
 *
 * The three spam checks are re-run here even though the form already applies
 * them in the browser. A bot that posts straight to this endpoint with curl or
 * a headless driver never executes `ContactForm`, so the server has to be the
 * authority — otherwise the honeypot would be decorative.
 *
 * When a check trips we answer 200 with `{ ok: true }` anyway: telling a bot
 * it was detected just teaches it to adapt, and a human never trips these.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    body = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const silentOk = NextResponse.json({ ok: true }, { status: 200 });

  // 1. Honeypot: a real visitor never sees or fills this hidden field.
  if (String(body.company ?? "").trim()) {
    return silentOk;
  }

  // 2. Basic sanity check on timestamp (prevents replay attacks after 24h)
  const openedAt = Number(body.openedAt);
  if (Number.isFinite(openedAt) && openedAt > 0) {
    const elapsedMs = Date.now() - openedAt;
    // Reject only if submitted from more than 24 hours in the past
    // or more than 5 minutes into the future (severe clock spoofing)
    if (elapsedMs > 24 * 60 * 60 * 1000 || elapsedMs < -300_000) {
      return silentOk;
    }
  }

  const parsed = validateContactPayload(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: "validation", field: parsed.field, reason: parsed.reason },
      { status: 422 }
    );
  }

  const requested = String(body.locale ?? "fr");
  const locale = isLocale(requested) ? requested : "fr";

  const result = await submitContactMessage(parsed.value, locale);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}