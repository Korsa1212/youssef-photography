"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import BentoGrid from "./BentoGrid";
import { getLocalizedCategory } from "@/lib/categories";
import type { Work } from "@/lib/supabase/queries";

const CATEGORY_ICONS: Record<string, string> = {
  all: "✨",
  "caftan & tradition": "👰",
  mariage: "💍",
  weddings: "💍",
  portraits: "📸",
  drone: "🚁",
  shooting: "🎬",
  fiançailles: "🕊️",
  engagements: "🕊️",
  événements: "🥂",
  events: "🥂",
  autre: "📁",
  other: "📁",
};

function getIcon(catKey: string) {
  const k = catKey.toLowerCase().trim();
  if (k.includes("caftan")) return CATEGORY_ICONS["caftan & tradition"];
  if (k.includes("portrait")) return CATEGORY_ICONS["portraits"];
  if (k.includes("drone")) return CATEGORY_ICONS["drone"];
  if (k.includes("shoot")) return CATEGORY_ICONS["shooting"];
  if (k.includes("mariage") || k.includes("wedding")) return CATEGORY_ICONS["mariage"];
  if (k.includes("fian") || k.includes("engag")) return CATEGORY_ICONS["fiançailles"];
  if (k.includes("év") || k.includes("ev")) return CATEGORY_ICONS["événements"];
  return CATEGORY_ICONS[k] || "📷";
}

export default function GalleryGrid({
  works,
  ratings,
  initialCategory,
}: {
  works: Work[];
  ratings: Record<string, number>;
  /** Server-validated `?categorie=` value; falls back to the "All" chip. */
  initialCategory?: string;
}) {
  const t = useTranslations("portfolio");
  const locale = useLocale();
  const allLabel = t("all");
  const [active, setActive] = useState<string | undefined>(initialCategory);
  const [onlyVideos, setOnlyVideos] = useState(false);

  // Distinct raw categories from works
  const distinctCategories = Array.from(new Set(works.map((w) => w.category)));

  // Filter works by active category and/or video filter
  let filtered = active ? works.filter((w) => w.category === active) : works;
  if (onlyVideos) {
    filtered = filtered.filter((w) => Boolean(w.video_url));
  }

  const videoCount = works.filter((w) => Boolean(w.video_url)).length;

  return (
    <div>
      {/* Category filters */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {/* All chip */}
        <button
          onClick={() => {
            setActive(undefined);
            setOnlyVideos(false);
          }}
          aria-pressed={!active && !onlyVideos}
          className={`group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
            !active && !onlyVideos
              ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/15"
              : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
          }`}
        >
          <span>{CATEGORY_ICONS.all}</span>
          <span>{allLabel}</span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-xs ${
              !active && !onlyVideos
                ? "bg-white/20 text-white"
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {works.length}
          </span>
        </button>

        {/* Dynamic Category Chips */}
        {distinctCategories.map((rawCat) => {
          const isSelected = active === rawCat && !onlyVideos;
          const label = getLocalizedCategory(rawCat, locale);
          const icon = getIcon(rawCat);
          const count = works.filter((w) => w.category === rawCat).length;

          return (
            <button
              key={rawCat}
              onClick={() => {
                setActive(rawCat);
                setOnlyVideos(false);
              }}
              aria-pressed={isSelected}
              className={`group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/15"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {/* Video filter chip if any videos exist */}
        {videoCount > 0 && (
          <button
            onClick={() => {
              setOnlyVideos(!onlyVideos);
              if (!onlyVideos) setActive(undefined);
            }}
            aria-pressed={onlyVideos}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              onlyVideos
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/25"
                : "border border-amber-300/80 bg-amber-50/60 text-amber-900 hover:bg-amber-100/60"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 fill-current"
              aria-hidden
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>{locale === "en" ? "Films & Videos" : "Films & Vidéos"}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${
                onlyVideos
                  ? "bg-zinc-950/20 text-zinc-950 font-bold"
                  : "bg-amber-200/60 text-amber-900"
              }`}
            >
              {videoCount}
            </span>
          </button>
        )}
      </div>

      {/* Grid or Empty */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-base text-zinc-400">{t("emptyCategory")}</p>
          <button
            onClick={() => {
              setActive(undefined);
              setOnlyVideos(false);
            }}
            className="mt-4 rounded-full border border-zinc-200 px-5 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
          >
            {locale === "en" ? "Show all works" : "Voir tous les travaux"}
          </button>
        </div>
      ) : (
        <BentoGrid works={filtered} ratings={ratings} />
      )}
    </div>
  );
}