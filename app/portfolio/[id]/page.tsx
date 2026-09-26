import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stars from "@/components/Stars";
import ReviewForm from "@/components/ReviewForm";
import PhotoSlider from "@/components/PhotoSlider";
import { absoluteUrl } from "@/lib/seo";
import {
  getWork,
  getApprovedReviews,
  computeStats,
  formatDate,
} from "@/lib/supabase/queries";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const work = await getWork(id);
  if (!work) return { title: "Travail introuvable" };
  return {
    title: work.title,
    description:
      work.description ??
      `${work.category} à ${work.location ?? "Marrakech"} — Youssef Production, photographe vidéaste.`,
    alternates: { canonical: `/portfolio/${work.id}` },
    openGraph: {
      title: `${work.title} — Youssef Production`,
      description: work.description ?? undefined,
      url: `/portfolio/${work.id}`,
      images: work.image_urls[0]
        ? [{ url: absoluteUrl(work.image_urls[0]), alt: work.title }]
        : [],
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [work, reviews] = await Promise.all([
    getWork(id),
    getApprovedReviews(id),
  ]);
  if (!work) notFound();

  const stats = computeStats(reviews);
  const image = work.image_urls[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.title,
    url: absoluteUrl(`/portfolio/${work.id}`),
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
        name: "Accueil",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfolio",
        item: absoluteUrl("/portfolio"),
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
          ← Retour au portfolio
        </Link>

        <p className="mt-7 text-xs uppercase tracking-[0.2em] text-zinc-400">
          {work.category}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-zinc-900 sm:text-5xl">
          {work.title}
        </h1>

        {stats.count > 0 && (
          <div className="mt-5 flex items-center gap-2.5">
            <Stars rating={stats.avg} className="scale-110" />
            <span className="text-base text-zinc-500">
              {stats.avg.toFixed(1)}/5 · {stats.count} avis
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
                <span aria-hidden>📅</span> {formatDate(work.event_date)}
              </span>
            )}
          </div>
        )}

        {/* Album */}
        <div className="mt-9">
          <PhotoSlider images={work.image_urls} alt={work.title} />
        </div>

        {work.description && (
          <p className="mt-8 text-[17px] leading-relaxed text-zinc-600">
            {work.description}
          </p>
        )}

        {/* Reviews */}
        <section className="mt-14 border-t border-zinc-100 pt-12">
          <h2 className="font-display text-3xl font-semibold text-zinc-900">
            Avis des clients
          </h2>

          {reviews.length === 0 ? (
            <p className="mt-5 text-base text-zinc-400">
              Aucun avis publié pour le moment. Soyez le premier à donner votre
              avis !
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
            <h3 className="text-lg font-medium text-zinc-900">Laisser un avis</h3>
            <p className="mb-5 mt-1.5 text-base text-zinc-500">
              Votre avis aide d&apos;autres clients à faire confiance à Youssef.
            </p>
            <ReviewForm workId={work.id} />
          </div>
        </section>
      </div>
    </div>
  );
}