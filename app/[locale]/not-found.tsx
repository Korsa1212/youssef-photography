import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Localized 404 rendered inside `app/[locale]/layout.tsx`, so it already has a
 * root layout and can stay a plain component with no `<html>` of its own.
 *
 * Uses `getTranslations` rather than the `useTranslations` hook: this file can
 * be reached while Next.js is recovering from an error, and the server-side
 * lookup does not depend on a mounted React context.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  const tc = await getTranslations("common");

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-amber-500">
          {t("label")}
        </p>
        <h1 className="mt-4 font-display text-6xl font-semibold text-zinc-900 sm:text-7xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-zinc-500">
          {t("body")}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-zinc-900 px-7 py-3 font-medium text-white transition-colors hover:bg-zinc-700"
          >
            {tc("backHome")}
          </Link>
          <Link
            href="/portfolio"
            className="rounded-full border border-zinc-300 px-7 py-3 font-medium text-zinc-700 transition-colors hover:border-zinc-500"
          >
            {tc("viewPortfolio")}
          </Link>
        </div>
      </div>
    </div>
  );
}