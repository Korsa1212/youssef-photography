import { defineRouting } from "next-intl/routing";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

/**
 * `localePrefix: "always"` means every public URL carries its language:
 *
 *   /fr/portfolio
 *   /en/portfolio
 *
 * So a bare `/portfolio` no longer exists. Visitors arriving on `/` are
 * redirected to the language their browser asks for, and `/portfolio`
 * is redirected to `/fr/portfolio` (or `/en/...`).
 */
export const routing = defineRouting({
  locales,
  defaultLocale: "fr",
  localePrefix: "always"
});

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
