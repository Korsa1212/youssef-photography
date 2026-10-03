import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isLocale, locales, type Locale } from "@/i18n/routing";
import { localeMetadata } from "@/i18n/metadata";
import { getPublishedFaqs, getLocalizedFaq } from "@/lib/supabase/queries";
import { WHATSAPP_URL } from "@/lib/seo";

export const revalidate = 300;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safe: Locale = isLocale(locale) ? locale : "fr";
  return localeMetadata(safe, "faq", "/faq");
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("faq");
  const rawFaqs = await getPublishedFaqs();
  const faqs = rawFaqs.map((f) => getLocalizedFaq(f, locale));

  const faqLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <div className="bg-white px-6 py-20">
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-zinc-400">
          FAQ
        </p>
        <h1 className="mt-4 text-center font-display text-4xl font-semibold text-zinc-900 sm:text-5xl">
          {t("heading")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-center text-lg text-zinc-500">
          {t("subtitle")}
        </p>

        {faqs.length === 0 ? (
          <p className="mt-16 rounded-2xl border border-zinc-100 p-10 text-center text-zinc-400">
            {t("empty")}
          </p>
        ) : (
          <div className="mt-12 space-y-4">
            {faqs.map((f) => (
              <details
                key={f.id}
                className="group rounded-2xl border border-zinc-100 bg-zinc-50 p-6 open:bg-white"
              >
                <summary className="cursor-pointer list-none text-lg font-medium text-zinc-900">
                  <span className="flex items-center justify-between gap-4">
                    {f.question}
                    <span className="text-xl text-zinc-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-zinc-600">{f.answer}</p>
              </details>
            ))}
          </div>
        )}

        <div className="mt-16 rounded-2xl bg-zinc-900 p-10 text-center">
          <h2 className="font-display text-2xl font-semibold text-white">
            {t("ctaTitle")}
          </h2>
          <p className="mt-3 text-white/80">{t("ctaBody")}</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-white px-7 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            {t("ctaButton")}
          </a>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/portfolio"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-900"
          >
            {t("discoverPortfolio")}
          </Link>
        </div>
      </div>
    </div>
  );
}