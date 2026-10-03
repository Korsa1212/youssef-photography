import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // `/admin` is unlocalized, so a single rule covers every locale.
        // `/en/blog` 404s on purpose; disallowing it keeps crawlers from
        // logging a soft-404 on a URL that will never exist.
        disallow: ["/admin", "/admin/", "/api/", "/en/blog"],
      },
    ],
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}