import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { locales } from "@/i18n/routing";
import { getWorks, getPublishedPosts } from "@/lib/supabase/queries";

export const revalidate = 300;

/**
 * Every public URL carries its locale prefix (`localePrefix: "always"`), so the
 * sitemap lists one entry per language. The blog is French-only and therefore
 * never emits an `/en/blog` URL.
 */
const LOCALIZED_STATIC_PATHS: Array<{
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
  /** Locales this route is actually published in. */
  locales?: ("fr" | "en")[];
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/portfolio", changeFrequency: "weekly", priority: 0.9 },
  { path: "/a-propos", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7, locales: ["fr"] },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [works, posts] = await Promise.all([getWorks(), getPublishedPosts()]);

  const staticRoutes: MetadataRoute.Sitemap = LOCALIZED_STATIC_PATHS.flatMap(
    ({ path, changeFrequency, priority, locales: only }) =>
      locales
        .filter((l) => !only || only.includes(l))
        .map((l) => ({
          url: `${SITE_URL}/${l}${path}`,
          changeFrequency,
          priority,
        }))
  );

  const workRoutes: MetadataRoute.Sitemap = locales.flatMap((l) =>
    works.map((w) => ({
      url: `${SITE_URL}/${l}/portfolio/${w.id}`,
      lastModified: w.created_at,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  );

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/fr/blog/${p.slug}`,
    lastModified: p.created_at,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...workRoutes, ...postRoutes];
}