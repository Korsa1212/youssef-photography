import Image from "next/image";
import Link from "next/link";
import Stars from "./Stars";
import type { Work } from "@/lib/supabase/queries";

export default function WorkCard({
  work,
  rating,
}: {
  work: Work;
  rating?: number;
}) {
  const image = work.image_urls[0];
  return (
    <Link
      href={`/portfolio/${work.id}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-all hover:-translate-y-0.5 hover:border-zinc-200 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        {image ? (
          <Image
            src={image}
            alt={work.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Aucune photo
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          {work.category}
        </p>
        <h3 className="mt-1.5 text-lg font-medium text-zinc-900">
          {work.title}
        </h3>
        {typeof rating === "number" && (
          <div className="mt-2.5 flex items-center gap-1.5">
            <Stars rating={rating} />
            <span className="text-sm text-zinc-400">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}