"use client";

import { useState } from "react";
import WorkCard from "./WorkCard";
import type { Work } from "@/lib/supabase/queries";

export default function GalleryGrid({
  works,
  ratings,
  initialCategory = "Tous",
}: {
  works: Work[];
  ratings: Record<string, number>;
  initialCategory?: string;
}) {
  const categories = ["Tous", ...Array.from(new Set(works.map((w) => w.category)))];
  const [active, setActive] = useState(initialCategory);

  const filtered =
    active === "Tous" ? works : works.filter((w) => w.category === active);

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-5 py-2.5 text-sm transition-colors ${
              active === cat
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="py-20 text-center text-base text-zinc-400">
          Aucun travail dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((work) => (
            <WorkCard key={work.id} work={work} rating={ratings[work.id]} />
          ))}
        </div>
      )}
    </div>
  );
}