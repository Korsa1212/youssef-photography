import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-amber-500">
          Erreur 404
        </p>
        <h1 className="mt-4 font-display text-6xl font-semibold text-zinc-900 sm:text-7xl">
          Oups, page introuvable
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-zinc-500">
          La page que vous cherchez n&apos;existe plus ou n&apos;a jamais
          existé. Revenons aux choses sérieuses.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-zinc-900 px-7 py-3 font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/portfolio"
            className="rounded-full border border-zinc-300 px-7 py-3 font-medium text-zinc-700 transition-colors hover:border-zinc-500"
          >
            Voir le portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}