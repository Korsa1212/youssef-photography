"use client";

import { useState } from "react";
import Image from "next/image";
import type { FilmSource } from "@/lib/seo";

export default function WeddingFilm({
  title,
  poster,
  source,
  orientation = "landscape",
}: {
  title: string;
  poster: string | null;
  source: FilmSource;
  /** Matches the player box to the footage so vertical reels are not pillarboxed. */
  orientation?: "landscape" | "portrait";
}) {
  const [playing, setPlaying] = useState(false);

  const frame =
    orientation === "portrait"
      ? // Vertical footage: keep it phone-width on small screens, then scale up
        // with the viewport so desktop does not show a tiny sliver.
        "mx-auto aspect-[9/16] w-full max-w-[420px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[640px]"
      : "aspect-video w-full";

  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-24">
      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-400">
            Vidéo
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
            Un aperçu de notre travail le plus récent, en mouvement et en musique.
          </p>
        </div>

        <div className={`relative mt-12 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/40 ${frame}`}>
          {playing ? (
            source.kind === "embed" ? (
              <iframe
                src={`${source.src}${source.src.includes("?") ? "&" : "?"}autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <video
                src={source.src}
                controls
                autoPlay
                playsInline
                preload="none"
                className="absolute inset-0 h-full w-full bg-black object-contain"
              >
                Votre navigateur ne peut pas lire cette vidéo.
              </video>
            )
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Lire la vidéo : ${title}`}
              className="group absolute inset-0 h-full w-full"
            >
              {poster ? (
                <Image
                  src={poster}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 1152px"
                  className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />

              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md transition-transform duration-300 group-hover:scale-110 sm:h-24 sm:w-24">
                  <svg viewBox="0 0 24 24" className="ml-1 h-9 w-9 text-white sm:h-11 sm:w-11" fill="currentColor" aria-hidden>
                    <path d="M8 5.14v14l11-7-11-7z" />
                  </svg>
                </span>
              </span>

              <span className="absolute inset-x-0 bottom-0 p-6 text-left sm:p-8">
                <span className="block font-display text-xl font-semibold text-white sm:text-2xl">
                  {title}
                </span>
                <span className="mt-1 block text-sm text-white/70">
                  Cliquez pour regarder
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
