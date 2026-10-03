import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Stars from "@/components/Stars";
import ReviewForm from "@/components/ReviewForm";
import PhotoSlider from "@/components/PhotoSlider";
import { Link } from "@/i18n/navigation";
import { isLocale, type Locale } from "@/i18n/routing";
import { localeAlternates } from "@/i18n/metadata";
import { absoluteUrl } from "@/lib/seo";
import {
  getWork,
  getApprovedReviews,
  computeStats,
  formatDate,
  getLocalizedWork,
  getLocalizedCategory,
} from "@/lib/supabase/queries";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const safe: Locale = isLocale(locale) ? locale : "fr";
  const rawWork = await getWork(id);
  if (!rawWork) return { title: safe === "en" ? "Work not found" : "Travail introuvable" };
  const work = getLocalizedWork(rawWork, safe);
  return {
    title: work.title,
    description:
      work.description ??
      (safe === "en"
        ? `${work.category} in ${work.location ?? "Marrakech"} — Youssef Production, photographer & videographer.`
        : `${work.category} à ${work.location ?? "Marrakech"} — Youssef Production, photographe vidéaste.`),
    alternates: localeAlternates(safe, `/portfolio/${work.id}`),
    openGraph: {
      title: `${work.title} — Youssef Production`,
      description: work.description ?? undefined,
      url: absoluteUrl(`/${safe}/portfolio/${work.id}`),
      images: work.image_urls[0]
        ? [{ url: absoluteUrl(work.image_urls[0]), alt: work.title }]
        : [],
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const tp = await getTranslations("portfolio");
  const th = await getTranslations("home");
  const tc = await getTranslations("common");
  const tn = await getTranslations("nav");

  const [rawWork, reviews] = await Promise.all([
    getWork(id),
    getApprovedReviews(id),
  ]);
  if (!rawWork) notFound();
  const work = getLocalizedWork(rawWork, locale);

  const stats = computeStats(reviews);
  const image = work.image_urls[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.title,
    url: absoluteUrl(`/${locale}/portfolio/${work.id}`),
    image: image ? absoluteUrl(image) : undefined,
    author: { "@type": "Person", name: "Youssef Production" },
    genre: work.category,
    ...(work.location && { locationCreated: work.location }),
    ...(stats.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: stats.avg,
        ratingCount: stats.count,
      },
    }),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tn("home"),
        item: absoluteUrl(`/${locale}`),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tn("portfolio"),
        item: absoluteUrl(`/${locale}/portfolio`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: work.title,
      },
    ],
  };

  return (
    <div className="bg-white px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="mx-auto max-w-4xl">
        <Link
          href="/portfolio"
          className="text-sm text-zinc-400 transition-colors hover:text-zinc-900"
        >
          ← {tc("backToPortfolio")}
        </Link>

        <p className="mt-7 text-xs uppercase tracking-[0.2em] text-amber-600 font-medium">
          {getLocalizedCategory(work.category, locale)}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-zinc-900 sm:text-5xl">
          {work.title}
        </h1>

        {stats.count > 0 && (
          <div className="mt-5 flex items-center gap-2.5">
            <Stars rating={stats.avg} className="scale-110" />
            <span className="text-base text-zinc-500">
              {th("ratingLine", { rating: stats.avg.toFixed(1), count: stats.count })}
            </span>
          </div>
        )}

        {(work.location || work.event_date) && (
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-500">
            {work.location && (
              <span className="flex items-center gap-2">
                <span aria-hidden>📍</span> {work.location}
              </span>
            )}
            {work.event_date && (
              <span className="flex items-center gap-2">
                <span aria-hidden>📅</span> {formatDate(work.event_date, locale)}
              </span>
            )}
          </div>
        )}

        {/* Video Player (if video_url is present) */}
        {work.video_url && (
          <div className="mt-9 overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-950 p-2 sm:p-3 shadow-2xl shadow-zinc-950/20">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <video
                src={work.video_url}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-contain"
                poster={work.image_urls[0]}
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium text-amber-400">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                {locale === "en" ? "Cinematic Film 4K" : "Film cinématographique 4K"}
              </span>
              <span className="text-zinc-500">Cloudflare High-Speed Stream</span>
            </div>
          </div>
        )}

        {/* Photo Album */}
        {work.image_urls.length > 0 && (
          <div className="mt-9">
            <PhotoSlider images={work.image_urls} alt={work.title} />
          </div>
        )}

        {work.description && (
          <p className="mt-8 text-[17px] leading-relaxed text-zinc-600">
            {work.description}
          </p>
        )}

        {/* Reviews */}
        <section className="mt-14 border-t border-zinc-100 pt-12">
          <h2 className="font-display text-3xl font-semibold text-zinc-900">
            {tp("reviewsTitle")}
          </h2>

          {reviews.length === 0 ? (
            <p className="mt-5 text-base text-zinc-400">
              {tp("reviewsEmpty")}
            </p>
          ) : (
            <div className="mt-7 space-y-5">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-zinc-100 p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-base font-medium text-zinc-800">{r.name}</p>
                    <Stars rating={r.rating} />
                  </div>
                  {r.feedback && (
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600">
                      {r.feedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-9 rounded-2xl border border-zinc-100 bg-zinc-50 p-7">
            <h3 className="text-lg font-medium text-zinc-900">{tp("leaveReview")}</h3>
            <p className="mb-5 mt-1.5 text-base text-zinc-500">
              {tp("leaveReviewHint")}
            </p>
            <ReviewForm workId={work.id} />
          </div>
        </section>
      </div>
    </div>
  );
}