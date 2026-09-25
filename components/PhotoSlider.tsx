"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export default function PhotoSlider({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-zinc-100 text-sm text-zinc-400">
        Aucune photo
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-100">
      <div className="relative aspect-[4/3] sm:aspect-[16/10]">
        <Image
          src={images[index]}
          alt={`${alt} — photo ${index + 1}`}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Photo précédente"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-zinc-800 shadow-md backdrop-blur transition-colors hover:bg-white"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Photo suivante"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-zinc-800 shadow-md backdrop-blur transition-colors hover:bg-white"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
          <span className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {index + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}