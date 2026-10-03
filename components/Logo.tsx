"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default function Logo({
  className = "",
}: {
  className?: string;
  preload?: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href="/"
      aria-label="Youssef Production — accueil"
      className={`flex shrink-0 items-center ${className}`}
    >
      {!imgError ? (
        <Image
          src="/youssef-logo.png"
          alt="Youssef Production"
          width={900}
          height={218}
          priority
          sizes="(max-width: 640px) 160px, 220px"
          style={{ aspectRatio: "900 / 218" }}
          onError={() => setImgError(true)}
          className="h-9 w-auto max-w-[160px] object-contain sm:h-11 sm:max-w-[210px]"
        />
      ) : (
        <div className="flex flex-col leading-none">
          <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-zinc-400">
            Photographe & Vidéaste
          </span>
          <span className="mt-1 font-display text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
            YOUSSEF <span className="text-amber-600">PRODUCTION</span>
          </span>
        </div>
      )}
    </Link>
  );
}
