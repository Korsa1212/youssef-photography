import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { fontClassName, bodyClassName } from "@/app/fonts";
import { isLocale, locales, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
// Tailwind v4 + the `font-display` / `font-script` theme mappings live here.
// Both root layouts must import it; without one of them the tree that uses it
// renders completely unstyled.
import "../globals.css";

/**
 * Root layout for the public site.
 *
 * It sits at `app/[locale]` rather than `app/` because the localized tree is
 * NOT the only tree — `app/admin` has its own root layout. That split is the
 * only way to render `<html lang>` per request: a root layout above
 * `app/[locale]` cannot read the `[locale]` param.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "fr";
  const t = await getTranslations({ locale: safeLocale, namespace: "site" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s | Youssef Production`,
    },
    description: t("description"),
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      type: "website",
      siteName: "Youssef Production",
      title: t("title"),
      description: t("description"),
      url: `${SITE_URL}/${safeLocale}`,
      locale: safeLocale === "fr" ? "fr_FR" : "en_US",
      // Resolved relative to `metadataBase`; `app/[locale]/opengraph-image`
      // renders one localized card per language.
      images: [{ url: `/${safeLocale}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
    }),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // `/de/...` can still reach this layout if the prefix matcher is ever
  // loosened. Fail with a 404 rather than serving French under a German URL.
  if (!isLocale(locale)) notFound();

  // Opts this subtree into static rendering; without it next-intl renders
  // every page dynamically and the ISR in PROJECT.md stops applying.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={fontClassName}>
      <body className={bodyClassName}>
        <NextIntlClientProvider>
          <GoogleAnalytics />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}