import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { locales } from "@/i18n/routing";

/**
 * Cache busting for content edited in the admin panel.
 *
 * Runs under the root segment (`app/api`), so `revalidatePath` needs the full
 * localized path for each public route — `/fr` and `/en` are separate pages
 * now, and revalidating one does not touch the other.
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  const sharedPaths = ["/portfolio", "/portfolio/[id]", "/faq", "/contact"];
  const frenchOnlyPaths = ["/blog", "/blog/[slug]"];

  for (const locale of locales) {
    revalidatePath(`/${locale}`, "page");
    revalidatePath(`/${locale}/a-propos`, "page");
    for (const path of sharedPaths) {
      revalidatePath(`/${locale}${path}`, "page");
    }
  }

  for (const path of frenchOnlyPaths) {
    revalidatePath(`/fr${path}`, "page");
  }

  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");

  return NextResponse.json({ revalidated: true });
}