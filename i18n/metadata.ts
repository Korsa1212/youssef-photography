import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "./routing";
import { SITE_URL } from "@/lib/seo";

/**
 * Canonical + hreflang for a localized page.
 *
 * `localePrefix: "always"` means every public URL carries its language, so the
 * canonical has to include the prefix too — otherwise `/en/portfolio` would
 * declare `/portfolio` as its canonical and Google would drop the English page.
 * `languages` gives Google the fr<->en pairing it needs to serve the right
 * version to each visitor instead of guessing from the page content.
 *
 * `pathname` is the locale-stripped path (`"/"`, `"/portfolio"`, `/blog/slug`).
 *
 * `available` narrows which locales actually publish this route. A page that
 * only exists in French (the blog) must not advertise an English URL that 404s,
 * so pass `{ fr: true }`; `x-default` then points at French, the only real
 * alternative.
 */
export function localeAlternates(
  locale: Locale,
  pathname: string,
  available: Record<Locale, boolean> = { fr: true, en: true }
): NonNullable<Metadata["alternates"]> {
  const suffix = pathname === "/" ? "" : pathname;
  const url = (l: Locale) => `${SITE_URL}/${l}${suffix}`;

  const published = locales.filter((l) => available[l]);
  const languages: Record<string, string> = Object.fromEntries(
    published.map((l) => [l, url(l)])
  );
  // x-default = the fallback for any locale we do not publish. Prefer English
  // only when English exists; otherwise French is the only sane default.
  languages["x-default"] = url(published.includes("en") ? "en" : "fr");

  return { canonical: url(locale), languages };
}

/**
 * Builds localized metadata for a page. Titles and descriptions come from the
 * message files so the English site never ships a French `<title>`.
 */
export async function localeMetadata(
  locale: Locale,
  namespace: "home" | "portfolio" | "about" | "faq" | "blog" | "contact",
  pathname: string,
  available?: Record<Locale, boolean>
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  const title = t("title");
  const description = t("description");
  const alternates = localeAlternates(locale, pathname, available);

  // `alternates.canonical` is typed as a descriptor union; this helper always
  // produces a plain absolute URL string, so narrow it for `openGraph.url`.
  const canonical = alternates.canonical as string;

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}