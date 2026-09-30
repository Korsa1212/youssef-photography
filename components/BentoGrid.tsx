import Image from "next/image";
import Link from "next/link";
import Stars from "./Stars";
import type { Work } from "@/lib/supabase/queries";

/**
 * Bento layout blocks.
 *
 * Every block fills a 4-column grid *exactly* — no gaps, no stray empty
 * cells — so the grid always looks deliberate no matter how many albums
 * exist. Each entry is [columns, rows] for one tile.
 *
 * Cell maths per block (4 cols x 2 rows = 8 cells):
 *   4 items -> 4 + 2 + 1 + 1 = 8
 *   3 items -> 4 + 2 + 2     = 8
 *   2 items -> 4 + 4         = 8
 *   1 item  -> 8             = 8
 * Trailing single item after a block uses one row instead (4 cells).
 */
const BLOCK_4 = [
  [2, 2],
  [2, 1],
  [1, 1],
  [1, 1],
] as const;

const BLOCK_3 = [
  [2, 2],
  [2, 1],
  [2, 1],
] as const;

const BLOCK_2 = [
  [2, 2],
  [2, 2],
] as const;

const BLOCK_1_BIG = [[4, 2]] as const;

const BLOCK_1_STRIP = [[4, 1]] as const;

/**
 * Tailwind only sees class names that appear verbatim in the source, so the
 * span classes are written out literally and looked up from here.
 */
const SPAN_CLASS: Record<string, string> = {
  "4x2": "md:col-span-4 md:row-span-2",
  "4x1": "md:col-span-4 md:row-span-1",
  "2x2": "md:col-span-2 md:row-span-2",
  "2x1": "md:col-span-2 md:row-span-1",
  "1x1": "md:col-span-1 md:row-span-1",
};

/**
 * Builds the tile spans for however many albums actually exist.
 * Uses full 4-item blocks while it can, then closes the layout with a
 * 3 / 2 / 1 item block so the last row is never ragged.
 */
function buildSpans(count: number): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  let i = 0;

  while (i < count) {
    const remaining = count - i;

    if (remaining >= 4) {
      for (const [c, r] of BLOCK_4) {
        if (i < count) spans.push([c, r]);
        i++;
      }
    } else if (remaining === 3) {
      for (const [c, r] of BLOCK_3) {
        spans.push([c, r]);
        i++;
      }
    } else if (remaining === 2) {
      for (const [c, r] of BLOCK_2) {
        spans.push([c, r]);
        i++;
      }
    } else {
      for (const [c, r] of spans.length === 0 ? BLOCK_1_BIG : BLOCK_1_STRIP) {
        spans.push([c, r]);
        i++;
      }
    }
  }

  return spans;
}

export default function BentoGrid({
  works,
  ratings,
  className = "",
}: {
  works: Work[];
  ratings?: Record<string, number>;
  className?: string;
}) {
  if (works.length === 0) return null;

  const spans = buildSpans(works.length);

  return (
    <div
      className={`grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[240px] lg:auto-rows-[300px] ${className}`}
    >
      {works.map((work, i) => {
        const [cols, rows] = spans[i];
        const image = work.image_urls[0];
        const rating = ratings?.[work.id];
        const photoCount = work.image_urls.length;

        return (
          <Link
            key={work.id}
            href={`/portfolio/${work.id}`}
            className={`group relative isolate flex aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 md:aspect-auto ${SPAN_CLASS[`${cols}x${rows}`] ?? "md:col-span-1 md:row-span-1"}`}
          >
            {image ? (
              <Image
                src={image}
                alt={work.title}
                fill
                sizes={
                  cols === 4
                    ? "(max-width: 768px) 100vw, 1152px"
                    : cols === 2
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 768px) 100vw, 25vw"
                }
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
                Aucune photo
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/25 opacity-95 transition-opacity duration-500 md:opacity-80 md:group-hover:opacity-95" />

            {photoCount > 0 && (
              <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M3 7h3l2-2h4l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7z" />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
                {photoCount}
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-amber-300/90 sm:text-[11px]">
                {work.category}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-white sm:text-xl">
                {work.title}
              </h3>
              {work.location && (
                <p className="mt-1 truncate text-xs text-white/60">
                  {work.location}
                </p>
              )}
              {typeof rating === "number" && (
                <div className="mt-2 flex items-center gap-1.5">
                  <Stars rating={rating} />
                  <span className="text-xs text-white/60">
                    {rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
              Voir l&apos;album
            </span>
          </Link>
        );
      })}
    </div>
  );
}
