"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

const SHORT: Record<Locale, string> = { fr: "FR", en: "EN" };
const OTHER: Record<Locale, Locale> = { fr: "en", en: "fr" };

/**
 * FR / EN segmented control.
 *
 * The blog exists in French only, so `/en/blog` is not served. Switching
 * language from a blog page therefore lands on that language's homepage
 * instead of walking into a 404.
 */
export default function LocaleSwitcher({ tone = "light" }: { tone?: "light" | "dark" }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("lang");
  const router = useRouter();
  const pathname = usePathname();

  const target = OTHER[locale];
  // If on an individual blog post, switch to /blog in target language
  // since slugs may differ; otherwise preserve the current pathname.
  const isPostDetail = pathname.startsWith("/blog/");
  const href = isPostDetail ? "/blog" : pathname;

  const dark = tone === "dark";

  return (
    <div
      className="inline-flex items-center rounded-full border p-0.5"
      role="group"
      aria-label={t("label")}
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => {
              if (!active) router.replace(href, { locale: code });
            }}
            aria-current={active ? "true" : undefined}
            title={`${t("switchTo")} ${t(code)}`}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide transition-colors ${
              active
                ? dark
                  ? "bg-white text-zinc-900"
                  : "bg-zinc-900 text-white"
                : dark
                  ? "text-zinc-400 hover:text-white"
                  : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {SHORT[code]}
          </button>
        );
      })}
      {/* Screen-reader-only context so the control is not just two letters. */}
      <span className="sr-only">{`${t("switchTo")} ${t(target)}`}</span>
    </div>
  );
}