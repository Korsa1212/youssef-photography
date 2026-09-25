import { createClient } from "@/lib/supabase/server";
import { createReader } from "@/lib/supabase/reader";

export type Work = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  location: string | null;
  event_date: string | null;
  image_urls: string[];
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
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  created_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  position: number;
  published: boolean;
  created_at: string;
};

const WORK_FIELDS =
  "id, title, description, category, location, event_date, image_urls, created_at";

export async function getWorks(): Promise<Work[]> {
  try {
    const { data, error } = await createReader()
      .from("works")
      .select(WORK_FIELDS)
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as Work[];
  } catch {
    return [];
  }
}

export async function getWork(id: string): Promise<Work | null> {
  try {
    const { data, error } = await createReader()
      .from("works")
      .select(WORK_FIELDS)
      .eq("id", id)
      .maybeSingle();
    if (error) return null;
    return (data as Work | null) ?? null;
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

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const { data, error } = await createReader()
      .from("posts")
      .select("id, title, slug, excerpt, cover_image, created_at")
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
    const { data, error } = await createReader()
      .from("posts")
      .select("id, title, slug, excerpt, content, cover_image, created_at")
      .eq("slug", slug)
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
      .select("id, question, answer")
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

export function formatDate(date: string | null): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}