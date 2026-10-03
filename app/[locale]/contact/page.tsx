import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactForm from "@/components/ContactForm";
import { isLocale, locales, type Locale } from "@/i18n/routing";
import { localeMetadata } from "@/i18n/metadata";
import {
  EMAIL,
  PHONE_DISPLAY,
  PHONE_E164,
  WHATSAPP_URL,
} from "@/lib/seo";

export const revalidate = 3600;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safe: Locale = isLocale(locale) ? locale : "fr";
  return localeMetadata(safe, "contact", "/contact");
}

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const tf = await getTranslations("footer");
  const t = await getTranslations("contact");

  return (
    <div className="bg-white px-6 pb-24 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-amber-600">
            {t("title")}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            {t("heading")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-500">
            {t("description")}
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8">
            <ContactForm />
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-zinc-950 p-8 text-white">
              <h2 className="font-display text-xl font-semibold">
                {t("directTitle")}
              </h2>
              <p className="mt-2.5 text-[15px] leading-relaxed text-white/70">
                {t("directBody")}
              </p>

              <div className="mt-7 space-y-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-full bg-amber-400 px-6 py-3.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
                >
                  {t("whatsappCta")}
                </a>
                <a
                  href={`tel:${PHONE_E164}`}
                  className="flex w-full items-center justify-center gap-2.5 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60"
                >
                  <svg viewBox="0 0 24 24" {...iconProps}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex w-full items-center justify-center gap-2.5 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60"
                >
                  <svg viewBox="0 0 24 24" {...iconProps}>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                  {EMAIL}
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-100 bg-zinc-50 p-8">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900">
                {t("location")}
              </h2>
              <p className="mt-3 flex items-start gap-3 text-[15px] text-zinc-600">
                <span className="mt-0.5 text-amber-500">
                  <svg viewBox="0 0 24 24" {...iconProps}>
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                {tf("cityLine")}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}