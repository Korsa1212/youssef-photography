import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedFaqs } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "FAQ — tarifs, délais & réservation",
  description:
    "Questions fréquentes sur Youssef Production, photographe à Marrakech : tarifs, prestations, délais de livraison et réservation.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ — Youssef Production",
    description:
      "Tarifs, prestations, délais de livraison et réservation : les réponses à vos questions.",
    url: "/faq",
  },
};

export const revalidate = 300;

export default async function FaqPage() {
  const faqs = await getPublishedFaqs();

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
          Questions fréquentes
        </h1>
        <p className="mx-auto mt-4 max-w-md text-center text-lg text-zinc-500">
          Réponses aux questions les plus posées avant une réservation.
        </p>

        {faqs.length === 0 ? (
          <p className="mt-16 rounded-2xl border border-zinc-100 p-10 text-center text-zinc-400">
            Les FAQ arrivent bientôt.
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
            Une autre question ?
          </h2>
          <p className="mt-3 text-white/80">
            Écrivez-moi directement sur WhatsApp, je réponds rapidement.
          </p>
          <a
            href="https://wa.me/212696819328"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-white px-7 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Poser ma question
          </a>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/portfolio"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-900"
          >
            Découvrir le portfolio →
          </Link>
        </div>
      </div>
    </div>
  );
}