import GalleryGrid from "@/components/GalleryGrid";
import {
  getWorks,
  getAllApprovedReviews,
  buildRatingsMap,
  getLocalizedWork,
} from "@/lib/supabase/queries";
import { isLocale, locales, type Locale } from "@/i18n/routing";
import { localeMetadata } from "@/i18n/metadata";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const revalidate = 300;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safe: Locale = isLocale(locale) ? locale : "fr";
  return localeMetadata(safe, "portfolio", "/portfolio");
}

export default async function PortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("portfolio");
  const [rawWorks, reviews] = await Promise.all([
    getWorks(),
    getAllApprovedReviews(),
  ]);
  const works = rawWorks.map((w) => getLocalizedWork(w, locale));
  const ratings = buildRatingsMap(reviews);
  const { categorie } = await searchParams;

  // `undefined` = "All" chip; an unknown category falls back to it too so a
  // stale `?categorie=` never renders an empty grid.
  const initialCategory =
    categorie && works.some((w) => w.category === categorie)
      ? categorie
      : undefined;

  const photoCount = works.reduce((n, w) => n + w.image_urls.length, 0);
  const videoCount = works.filter((w) => Boolean(w.video_url)).length;

  return (
    <div className="bg-white px-6 pb-24 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-zinc-100 pb-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-600">
              {t("title")}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              {t("heading")}
            </h1>
            <p className="mt-4 max-w-lg text-zinc-500 leading-relaxed">{t("description")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
              {t("albumCount", { count: works.length })}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
              {t("photoCount", { count: photoCount })}
            </span>
            {videoCount > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-800 border border-amber-200/60">
                <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                {videoCount} {locale === "en" ? "Films" : "Films"}
              </span>
            )}
          </div>
        </div>

        <div className="mt-10">
          <GalleryGrid works={works} ratings={ratings} initialCategory={initialCategory} />
        </div>
      </div>
    </div>
  );
}