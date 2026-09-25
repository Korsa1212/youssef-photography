import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  revalidatePath("/", "page");
  revalidatePath("/portfolio", "page");
  revalidatePath("/portfolio/[id]", "page");
  revalidatePath("/blog", "page");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/faq", "page");
  revalidatePath("/sitemap.xml", "page");

  return NextResponse.json({ revalidated: true });
}