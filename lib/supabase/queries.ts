import { createClient } from "@/lib/supabase/server";
import { createReader } from "@/lib/supabase/reader";
import type { Locale } from "@/i18n/routing";

export type Work = {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  category: string;
  location: string | null;
  event_date: string | null;
  image_urls: string[];
  video_url?: string | null;
  created_at: string;
};

export type Review = {
  id: string;
  work_id: string | null;
  name: string;
  rating: number;
  feedback: string | null;
  approved: boolean;
  created_at: string;
  works?: { id: string; title: string } | null;
};

export type Post = {
  id: string;
  title: string;
  title_en: string | null;
  slug: string;
  slug_en: string | null;
  excerpt: string | null;
  excerpt_en: string | null;
  content: string;
  content_en: string | null;
  cover_image: string | null;
  published: boolean;
  created_at: string;
};

export type Faq = {
  id: string;
  question: string;
  question_en: string | null;
  answer: string;
  answer_en: string | null;
  position: number;
  published: boolean;
  created_at: string;
};

const WORK_FIELDS_WITH_VIDEO =
  "id, title, title_en, description, description_en, category, location, event_date, image_urls, video_url, created_at";

const WORK_FIELDS_LEGACY =
  "id, title, title_en, description, description_en, category, location, event_date, image_urls, created_at";

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i;

/**
 * `works.image_urls` is a free-form text array, so a video (or any other file)
 * can end up in the photo list and then break `next/image` at render time.
 * Strip anything that is not an image so the public pages stay safe. The raw
 * values are still visible in the admin panel, so nothing is lost.
 */
function onlyImages(works: Work[]): Work[] {
  return works.map((w) => ({
    ...w,
    image_urls: (w.image_urls ?? []).filter((u) => IMAGE_EXTENSIONS.test(u)),
  }));
}

export async function getWorks(): Promise<Work[]> {
  try {
    const reader = createReader();
    // Try with video_url first; if the column isn't created yet in DB, fall back to legacy fields
    const { data, error } = await reader
      .from("works")
      .select(WORK_FIELDS_WITH_VIDEO)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return onlyImages(data as Work[]);
    }

    const { data: fallbackData, error: fallbackError } = await reader
      .from("works")
      .select(WORK_FIELDS_LEGACY)
      .order("created_at", { ascending: false });

    if (fallbackError) return [];
    return onlyImages((fallbackData ?? []) as Work[]);
  } catch {
    return [];
  }
}

export async function getWork(id: string): Promise<Work | null> {
  try {
    const reader = createReader();
    const { data, error } = await reader
      .from("works")
      .select(WORK_FIELDS_WITH_VIDEO)
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return onlyImages([data as Work])[0];
    }

    const { data: fallbackData } = await reader
      .from("works")
      .select(WORK_FIELDS_LEGACY)
      .eq("id", id)
      .maybeSingle();

    const work = (fallbackData as Work | null) ?? null;
    if (!work) return null;
    return onlyImages([work])[0];
  } catch {
    return null;
  }
}

export async function getApprovedReviews(workId: string): Promise<Review[]> {
  try {
    const { data, error } = await createReader()
      .from("reviews")
      .select("id, work_id, name, rating, feedback, created_at")
      .eq("work_id", workId)
      .eq("approved", true)
      .order("created_at", { ascending: false });
    if (error) return [];
    return ((data ?? []) as unknown as Review[]).filter(
      (r) => r.feedback && r.feedback.trim().length > 0
    );
  } catch {
    return [];
  }
}

export async function getAllApprovedReviews(): Promise<Review[]> {
  try {
    const { data, error } = await createReader()
      .from("reviews")
      .select("id, work_id, name, rating, feedback, created_at, works(id, title)")
      .eq("approved", true)
      .order("created_at", { ascending: false });
    if (error) return [];
    return ((data ?? []) as unknown as Review[]).filter(
      (r) => r.feedback && r.feedback.trim().length > 0
    );
  } catch {
    return [];
  }
}

export async function getAllReviews(): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, work_id, name, rating, feedback, approved, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Review[];
}

const POST_FIELDS =
  "id, title, title_en, slug, slug_en, excerpt, excerpt_en, cover_image, created_at";

const POST_FULL_FIELDS =
  "id, title, title_en, slug, slug_en, excerpt, excerpt_en, content, content_en, cover_image, created_at";

const FAQ_FIELDS =
  "id, question, question_en, answer, answer_en, position, published, created_at";

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const { data, error } = await createReader()
      .from("posts")
      .select(POST_FIELDS)
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as Post[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const reader = createReader();
    // Match either the French slug or the English slug
    const { data, error } = await reader
      .from("posts")
      .select(POST_FULL_FIELDS)
      .or(`slug.eq.${slug},slug_en.eq.${slug}`)
      .eq("published", true)
      .maybeSingle();
    if (error) return null;
    return (data as Post | null) ?? null;
  } catch {
    return null;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Post[];
}

export async function getPublishedFaqs(): Promise<Faq[]> {
  try {
    const { data, error } = await createReader()
      .from("faqs")
      .select(FAQ_FIELDS)
      .eq("published", true)
      .order("position", { ascending: true });
    if (error) return [];
    return (data ?? []) as Faq[];
  } catch {
    return [];
  }
}

export async function getAllFaqs(): Promise<Faq[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Faq[];
}

export { PORTFOLIO_CATEGORIES, getLocalizedCategory } from "@/lib/categories";

export function getLocalizedWork(work: Work, locale: string): Work {
  const isEn = locale === "en";
  return {
    ...work,
    title: isEn && work.title_en?.trim() ? work.title_en.trim() : work.title,
    description:
      isEn && work.description_en?.trim()
        ? work.description_en.trim()
        : work.description,
  };
}

export function getLocalizedFaq(faq: Faq, locale: string): Faq {
  const isEn = locale === "en";
  return {
    ...faq,
    question:
      isEn && faq.question_en?.trim() ? faq.question_en.trim() : faq.question,
    answer: isEn && faq.answer_en?.trim() ? faq.answer_en.trim() : faq.answer,
  };
}

export function getLocalizedPost(post: Post, locale: string): Post {
  const isEn = locale === "en";
  return {
    ...post,
    title: isEn && post.title_en?.trim() ? post.title_en.trim() : post.title,
    excerpt: isEn && post.excerpt_en?.trim() ? post.excerpt_en.trim() : post.excerpt,
    content: isEn && post.content_en?.trim() ? post.content_en.trim() : post.content,
    slug: isEn && post.slug_en?.trim() ? post.slug_en.trim() : post.slug,
  };
}

export function computeStats(reviews: Pick<Review, "rating">[]) {
  if (reviews.length === 0) return { avg: 0, count: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    avg: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

export function buildRatingsMap(
  reviews: Pick<Review, "work_id" | "rating">[]
): Record<string, number> {
  const totals: Record<string, { sum: number; count: number }> = {};
  for (const r of reviews) {
    if (!r.work_id) continue;
    const cur = totals[r.work_id] ?? { sum: 0, count: 0 };
    cur.sum += r.rating;
    cur.count += 1;
    totals[r.work_id] = cur;
  }
  const out: Record<string, number> = {};
  for (const [id, v] of Object.entries(totals)) {
    out[id] = Math.round((v.sum / v.count) * 10) / 10;
  }
  return out;
}

/**
 * Locale-aware date rendering. The locale is explicit rather than read from
 * the request so it can be used from server components that already resolved
 * it, and so the output matches the `<html lang>` of the page.
 */
export function formatDate(
  date: string | null,
  locale: Locale = "fr"
): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString(
    locale === "en" ? "en-GB" : "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}