import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Stars from "@/components/Stars";
import BentoGrid from "@/components/BentoGrid";
import WeddingFilm from "@/components/WeddingFilm";
import {
  EMAIL,
  GOOGLE_REVIEW_URL,
  INSTAGRAM_URL,
  PHONE_E164,
  PHONE_DISPLAY,
  SITE_URL,
  WEDDING_FILM_POSTER,
  WEDDING_FILM_URL,
  WHATSAPP_URL,
  filmSource,
} from "@/lib/seo";
import {
  HERO,
  PACKAGES,
  SERVICES_DETAIL,
  WHY_US,
  WHY_US_IMAGE,
} from "@/lib/site-content";
import {
  getWorks,
  getAllApprovedReviews,
  computeStats,
  buildRatingsMap,
  formatDate,
} from "@/lib/supabase/queries";

export const revalidate = 300;

const bg = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

// Hero image: a wide editorial destination-wedding frame (floral ceremony arch
// with a mountain backdrop) rather than a portfolio photo, so the first thing a
// visitor sees sets a premium, aspirational tone.
// Verified landscape 2400x1600 so a full-bleed 92vh hero does not crop it apart.
const HERO_IMAGE = bg("photo-1763560836989-d3636e2f82d8", 2400);

// Poster for the film section.
const FILM_POSTER_FALLBACK = bg("photo-1519167758481-83f550bb49b3", 1800);

// Background for the closing call-to-action panel.
const CTA_IMAGE = bg("photo-1519225421980-715cb0215aed", 1600);

const FALLBACK_HERO = HERO_IMAGE;

// Change the video URL in `.env.local` (NEXT_PUBLIC_WEDDING_FILM_URL).
// It accepts a YouTube/Vimeo link or a direct .mp4 / .webm / .mov file.
// The section stays hidden until that variable is set.
const FILM_TITLE =
  process.env.NEXT_PUBLIC_WEDDING_FILM_TITLE?.trim() ||
  "Un film de mariage";

// The current clip is shot vertically (9:16), so the player matches that
// shape instead of letterboxing it inside a 16:9 frame. Set to "landscape"
// (or remove the variable) when you upload a widescreen film.
const FILM_ORIENTATION =
  process.env.NEXT_PUBLIC_WEDDING_FILM_ORIENTATION?.trim() === "portrait"
    ? "portrait"
    : "landscape";
const film = filmSource(WEDDING_FILM_URL);

export const metadata: Metadata = {
  title: "Photographe & Vidéaste à Marrakech — Mariage, fiançailles, événements",
  description:
    "Youssef Production, photographe et vidéaste à Marrakech. Reportages mariage, séances fiançailles et événements. Devis gratuit, galerie livrée en quelques jours.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Youssef Production — Photographe & Vidéaste à Marrakech",
    description:
      "Mariage, fiançailles, événements à Marrakech : des souvenirs authentiques capturés avec soin.",
    url: "/",
  },
};

export default async function Home() {
  const [works, reviews] = await Promise.all([
    getWorks(),
    getAllApprovedReviews(),
  ]);
  const stats = computeStats(reviews);
  const ratings = buildRatingsMap(reviews);

  const realPhotos = works.flatMap((w) => w.image_urls).filter(Boolean);
  const heroImage = HERO_IMAGE;
  const featured = works.slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Youssef Production",
    description:
      "Photographe et vidéaste à Marrakech — mariage, fiançailles, événements.",
    url: SITE_URL,
    telephone: PHONE_E164,
    email: EMAIL,
    image: realPhotos[0] ?? heroImage,
    priceRange: "€€",
    areaServed: "Marrakech et ses environs, Maroc",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marrakech",
      addressCountry: "MA",
    },
    sameAs: [INSTAGRAM_URL, ...(GOOGLE_REVIEW_URL ? [GOOGLE_REVIEW_URL] : [])],
    ...(stats.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: stats.avg,
        ratingCount: stats.count,
      },
    }),
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1 — Hero */}
      <section className="relative min-h-[92vh] overflow-hidden bg-zinc-950">
        <div className="absolute inset-0">
          <Image
            src={heroImage ?? FALLBACK_HERO}
            alt=""
            fill
            preload
            sizes="100vw"
            quality={75}
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-6 pb-20 pt-36 sm:pb-24 sm:pt-44">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-white/90 backdrop-blur">
            {HERO.eyebrow}
          </span>

          <h1 className="mt-7 max-w-3xl whitespace-pre-line font-display text-[2.75rem] font-semibold leading-[1.03] tracking-tight text-white sm:text-7xl">
            {HERO.title}
          </h1>

          <div className="mt-8 h-px w-20 bg-amber-400" />

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80">
            {HERO.subtitle}
          </p>

          {stats.count > 0 && (
            <div className="mt-6 flex items-center gap-3">
              <Stars rating={stats.avg} className="scale-110" />
              <span className="text-sm font-medium text-white/90">
                {stats.avg.toFixed(1)}/5 — {stats.count} avis
              </span>
            </div>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-amber-400 px-8 py-3.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
            >
              {HERO.primaryCta}
            </a>
            <Link
              href="/portfolio"
              className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              {HERO.secondaryCta}
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-7 text-sm text-white/70">
            <span>📍 Marrakech, Maroc</span>
            <span>🕘 Devis gratuit sur WhatsApp</span>
            <a
              href={`tel:${PHONE_E164}`}
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* 2 — Dernières réalisations (bento, mixed sizes) */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-amber-600">
                Portfolio
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Dernières réalisations
              </h2>
              <p className="mt-4 max-w-lg text-zinc-500">
                Mariage, fiançailles et événements à Marrakech. Chaque album
                s&apos;ouvre en quelques secondes.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 border-b border-zinc-300 pb-1 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-900"
            >
              Voir tout le portfolio
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-dashed border-zinc-200 px-6 py-20 text-center">
              <p className="font-display text-2xl text-zinc-900">
                Les albums sont en préparation
              </p>
              <p className="mx-auto mt-3 max-w-md text-zinc-500">
                En attendant, demandez-nous un aperçu de notre travail sur
                WhatsApp — nous vous envoyons nos meilleures séries.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-block rounded-full bg-zinc-900 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
              >
                Voir nos photos sur WhatsApp
              </a>
            </div>
          ) : (
            <BentoGrid
              works={featured}
              ratings={ratings}
              className="mt-12"
            />
          )}
        </div>
      </section>

      {/* 3 — Latest video (hidden until a video URL is configured) */}
      {film && (
        <WeddingFilm
          title={FILM_TITLE}
          poster={WEDDING_FILM_POSTER ?? FILM_POSTER_FALLBACK}
          source={film}
          orientation={FILM_ORIENTATION}
        />
      )}

      {/* 4 — Services */}
      <section className="bg-zinc-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-amber-600">
              Ce que je capture
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Mes services
            </h2>
            <p className="mt-4 text-lg text-zinc-500">
              Photo, vidéo et options — tout ce qu&apos;il faut pour garder vos
              souvenirs intacts.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {SERVICES_DETAIL.map((s) => (
              <div key={s.label} className="group flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-200">
                  <Image
                    src={s.image}
                    alt={s.label}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-display text-sm text-white/90">
                    {s.num}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-zinc-900">
                  {s.label}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-zinc-500">
                  {s.desc}
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-zinc-200 pt-5">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[14px] leading-relaxed text-zinc-700"
                    >
                      <span
                        aria-hidden
                        className="mt-[7px] h-px w-3 shrink-0 bg-amber-500"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Formules */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-amber-600">
              Formules
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Nos formules
            </h2>
            <p className="mt-4 text-lg text-zinc-500">
              Chaque événement est unique. Choisissez une base, nous ajustons
              ensemble.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-0">
            {PACKAGES.map((p, i) => (
              <div
                key={p.name}
                className={`relative flex flex-col px-0 py-8 lg:px-8 ${
                  i > 0 ? "border-t border-zinc-200 lg:border-l lg:border-t-0" : ""
                } ${
                  p.highlight
                    ? "bg-zinc-950 text-white lg:-my-4 lg:py-12 lg:shadow-2xl lg:shadow-zinc-900/20"
                    : "text-zinc-900"
                } ${i > 0 ? "lg:pl-8" : ""}`}
              >
                {p.highlight && (
                  <span className="absolute left-0 top-0 h-1 w-full bg-amber-400 lg:left-8 lg:right-8 lg:top-0 lg:w-auto" />
                )}

                <p
                  className={`text-[11px] font-medium uppercase tracking-[0.25em] ${p.highlight ? "text-amber-400" : "text-zinc-400"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </p>

                <h3
                  className={`mt-4 font-display font-semibold tracking-tight ${p.highlight ? "text-3xl text-white" : "text-2xl text-zinc-900"}`}
                >
                  {p.name}
                </h3>
                <p
                  className={`mt-2 text-sm ${p.highlight ? "text-white/60" : "text-zinc-500"}`}
                >
                  {p.tagline}
                </p>

                <ul
                  className={`mt-8 flex-1 space-y-3.5 border-t pt-8 ${p.highlight ? "border-white/15" : "border-zinc-200"}`}
                >
                  {p.items.map((item) => (
                    <li
                      key={item}
                      className={`flex gap-3 text-[15px] leading-relaxed ${p.highlight ? "text-white/85" : "text-zinc-700"}`}
                    >
                      <span
                        aria-hidden
                        className={`mt-[7px] h-px w-3 shrink-0 ${p.highlight ? "bg-amber-400" : "bg-amber-500"}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 rounded-full px-6 py-3.5 text-center text-sm font-semibold transition-colors ${
                    p.highlight
                      ? "bg-amber-400 text-zinc-950 hover:bg-amber-300"
                      : "border border-zinc-300 text-zinc-900 hover:border-zinc-900"
                  }`}
                >
                  Demander un devis
                </a>
              </div>
            ))}
          </div>

          <p className="mt-12 text-sm text-zinc-500">
            Tarifs sur devis, selon la durée, la date et le nombre de
            photographes. Réponse sous 24 h.
          </p>
        </div>
      </section>

      {/* 5 — Pourquoi nous choisir */}
      <section className="relative overflow-hidden bg-zinc-950 px-6 py-24">
        <div className="absolute inset-0">
          <Image
            src={WHY_US_IMAGE}
            alt=""
            fill
            sizes="100vw"
            quality={65}
            className="object-cover opacity-60"
          />
          {/* Weighted to the left so the heading and copy stay crisp, while the
              photo reads as real texture across the numbered list on the right. */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/70" />
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-amber-400">
                Pourquoi nous choisir
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Ce qui fait la différence
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-white/60">
                Un travail soigné, sans mauvaise surprise, et une livraison
                qui arrive à temps. C&apos;est ce que nos clients attendent en
                premier.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded-full bg-amber-400 px-7 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
              >
                Vérifier ma disponibilité
              </a>
            </div>

            <div className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
              {WHY_US.map((w) => (
                <div
                  key={w.num}
                  className="border-t border-white/12 py-6 sm:py-7"
                >
                  <p className="font-display text-sm text-amber-400">
                    {w.num}
                  </p>
                  <h3 className="mt-3 text-[17px] font-medium text-white">
                    {w.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                    {w.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Témoignages + contact */}
      <section className="relative overflow-hidden bg-zinc-900 px-6 py-24">
        <div className="absolute inset-0">
          <Image
            src={bg("photo-1465495976277-4387d4b0b4c6", 2000)}
            alt=""
            fill
            sizes="100vw"
            quality={65}
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/75 via-zinc-900/70 to-zinc-950/95" />
          {/* Amber hairline separates this block from the section above. */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-amber-500/[0.07] blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          {reviews.length > 0 && (
            <>
              <div className="max-w-2xl">
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-amber-400">
                  Témoignages
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  Ce que disent mes clients
                </h2>
              </div>
              <div className="mt-14 grid gap-8 lg:grid-cols-3">
                <div className="flex flex-col items-center justify-center rounded-3xl border border-white/15 bg-white/10 p-10 text-center backdrop-blur-md lg:self-start">
                  <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/60">
                    Note moyenne
                  </p>
                  <span className="mt-4 font-display text-7xl font-semibold leading-none text-white">
                    {stats.avg.toFixed(1)}
                  </span>
                  <div className="mt-4">
                    <Stars rating={stats.avg} className="scale-125" />
                  </div>
                  <p className="mt-4 text-sm text-white/70">
                    Basé sur {stats.count} avis vérifiés
                  </p>
                  <div className="my-7 h-px w-16 bg-white/20" />
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
                    >
                      Laissez votre avis
                    </a>
                    {GOOGLE_REVIEW_URL && (
                      <a
                        href={GOOGLE_REVIEW_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
                      >
                        Avis sur Google
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-6 lg:col-span-2">
                  {reviews.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      className="flex flex-col rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 font-display text-lg font-semibold text-zinc-900">
                            {(r.name.trim().charAt(0) || "?").toUpperCase()}
                          </span>
                          <div>
                            <p className="font-medium text-white">{r.name}</p>
                            <p className="text-xs text-white/50">
                              {formatDate(r.created_at)}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full border border-white/20 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white/60">
                          ✓ Vérifié
                        </span>
                      </div>
                      <div className="mt-5">
                        <Stars rating={r.rating} />
                      </div>
                      <p className="mt-3 flex-1 text-[15px] italic leading-relaxed text-white/85">
                        “{r.feedback}”
                      </p>
                      {r.works && (
                        <Link
                          href={`/portfolio/${r.work_id}`}
                          className="mt-5 text-sm text-white/60 transition-colors hover:text-white"
                        >
                          Réalisation — {r.works.title} →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Closing call to action. Deliberately lighter than the footer
              (zinc-900 + photo vs. the footer's zinc-950) so the two never
              blend into one black block. */}
          <div className="relative mt-20 overflow-hidden rounded-3xl border border-white/15 bg-zinc-900">
            <div className="absolute inset-0">
              <Image
                src={CTA_IMAGE}
                alt=""
                fill
                sizes="(max-width: 1152px) 100vw, 1152px"
                quality={65}
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-900/65 to-zinc-950/85" />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
            </div>

            <div className="relative px-6 py-16 text-center sm:px-12 sm:py-20">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-amber-400">
                Réserver maintenant
              </p>
              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Vous avez une date en tête&nbsp;?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/75">
                Envoyez-moi votre date et le lieu de votre événement. Vous
                recevez une réponse et un devis gratuit sous 24 h, sans
                engagement.
              </p>

              <ul className="mx-auto mt-9 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
                {[
                  "Réponse sous 24 h",
                  "Devis 100 % gratuit",
                  "Sans engagement",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm font-medium text-white/80"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-zinc-950">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="h-3 w-3"
                        aria-hidden
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-amber-400 px-9 py-4 text-base font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-300 hover:shadow-amber-400/30 sm:w-auto"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Vérifier ma disponibilité
                </a>
                <a
                  href={`tel:${PHONE_E164}`}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-white/25 px-8 py-4 text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5 sm:w-auto"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {PHONE_DISPLAY}
                </a>
              </div>

              {stats.count > 0 && (
                <div className="mt-8 flex items-center justify-center gap-2.5 text-sm text-white/55">
                  <Stars rating={stats.avg} />
                  <span>
                    {stats.avg.toFixed(1)}/5 — {stats.count} avis clients
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
