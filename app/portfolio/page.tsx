import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { getWorks, getAllApprovedReviews, buildRatingsMap } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Portfolio — Mariages, fiançailles & événements à Marrakech",
  description:
    "Découvrez les plus belles réalisations de Youssef Production : reportages de mariage, séances fiançailles et couverture d'événements à Marrakech.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio — Youssef Production",
    description:
      "Reportages de mariage, fiançailles et événements immortalisés à Marrakech.",
    url: "/portfolio",
  },
};

export const revalidate = 300;

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const [works, reviews] = await Promise.all([
    getWorks(),
    getAllApprovedReviews(),
  ]);
  const ratings = buildRatingsMap(reviews);
  const { categorie } = await searchParams;

  const initialCategory =
    categorie && works.some((w) => w.category === categorie)
      ? categorie
      : "Tous";

  return (
    <div className="bg-white px-6 pb-24 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-amber-600">
              Portfolio
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Mes réalisations
            </h1>
            <p className="mt-4 max-w-lg text-zinc-500">
              Mariage, fiançailles, événements — mes plus belles séries à
              Marrakech.
            </p>
          </div>
          <p className="text-sm text-zinc-400">
            {works.length} album{works.length > 1 ? "s" : ""} ·{" "}
            {works.reduce((n, w) => n + w.image_urls.length, 0)} photos
          </p>
        </div>

        <div className="mt-14">
          <GalleryGrid
            works={works}
            ratings={ratings}
            initialCategory={initialCategory}
          />
        </div>
      </div>
    </div>
  );
}