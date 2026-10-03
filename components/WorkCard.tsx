import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import Stars from "./Stars";
import { Link } from "@/i18n/navigation";
import { getLocalizedCategory } from "@/lib/categories";
import type { Work } from "@/lib/supabase/queries";

export default function WorkCard({
  work,
  rating,
}: {
  work: Work;
  rating?: number;
}) {
  const t = useTranslations("portfolio");
  const locale = useLocale();
  const image = work.image_urls[0];
  const localizedCat = getLocalizedCategory(work.category, locale);
  const photoCount = work.image_urls.length;

  return (
    <Link
      href={`/portfolio/${work.id}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-xl hover:shadow-amber-500/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        {image ? (
          <Image
            src={image}
            alt={work.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            {t("noPhoto")}
          </div>
        )}

        <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
          {work.video_url && (
            <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-950 shadow-md shadow-amber-500/30 backdrop-blur-md">
              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-current" aria-hidden>
                <polygon points="6 4 18 12 6 20 6 4" />
              </svg>
              <span>Film</span>
            </span>
          )}
          {photoCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M3 7h3l2-2h4l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7z" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
              {photoCount}
            </span>
          )}
        </div>
      </div>
      <div className="p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber-600">
          {localizedCat}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold text-zinc-900 transition-colors group-hover:text-amber-600">
          {work.title}
        </h3>
        {work.location && (
          <p className="mt-1 truncate text-xs text-zinc-400">
            📍 {work.location}
          </p>
        )}
        {typeof rating === "number" && (
          <div className="mt-2.5 flex items-center gap-1.5">
            <Stars rating={rating} />
            <span className="text-xs font-medium text-zinc-500">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}