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
    <div className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-center font-display text-4xl font-semibold text-zinc-900 sm:text-5xl">
          Portfolio
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-lg text-zinc-500">
          Mariage, fiançailles, événements — mes plus belles réalisations.
        </p>
        <div className="mt-12">
          <GalleryGrid works={works} ratings={ratings} initialCategory={initialCategory} />
        </div>
      </div>
    </div>
  );
}