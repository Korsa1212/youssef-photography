import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Stars from "@/components/Stars";
import WorkCard from "@/components/WorkCard";
import {
  getWorks,
  getAllApprovedReviews,
  getPublishedPosts,
  computeStats,
  buildRatingsMap,
  formatDate,
} from "@/lib/supabase/queries";

export const revalidate = 300;

const bg = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

const HERO_IMAGE = bg("photo-1522673607200-164d1b6ce486", 2000);

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
    images: [{ url: HERO_IMAGE, width: 1600, height: 2000, alt: "Youssef Production — Photographe à Marrakech" }],
  },
};

const SERVICES = [
  {
    label: "Mariage",
    eyebrow: "Le Grand Jour",
    desc: "Le plus beau jour de votre vie, capturé pour toujours.",
    image: bg("photo-1519741497674-611481863552"),
  },
  {
    label: "Fiançailles",
    eyebrow: "À Deux",
    desc: "Des moments tendres et sincères, en photos et en vidéo.",
    image: bg("photo-1511285560929-80b456fea0bc"),
  },
  {
    label: "Événements",
    eyebrow: "Fêtes & Soirées",
    desc: "Soirées, cérémonies et fêtes immortalisés avec soin.",
    image: bg("photo-1511578314322-379afb476865"),
  },
];

export default async function Home() {
  const [works, reviews, posts] = await Promise.all([
    getWorks(),
    getAllApprovedReviews(),
    getPublishedPosts(),
  ]);
  const stats = computeStats(reviews);
  const ratings = buildRatingsMap(reviews);
  const heroImage = works[0]?.image_urls[0] || null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Youssef Production",
    description:
      "Photographe et vidéaste à Marrakech — mariage, fiançailles, événements.",
    url: "https://youssefproduction.com",
    telephone: "+212696819328",
    email: "baghzaoui1@gmail.com",
    image: heroImage ?? HERO_IMAGE,
    priceRange: "€€",
    areaServed: "Marrakech et ses environs, Maroc",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marrakech",
      addressCountry: "MA",
    },
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-900">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={70}
            className="object-cover opacity-80"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/85" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-32 text-center sm:px-6 sm:pb-32 sm:pt-48">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-white/90 backdrop-blur">
            Créateur de souvenirs
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.05] text-white sm:text-8xl">
            Youssef Production
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-white/85">
            Photographe & vidéaste professionnel à Marrakech. J&apos;immortalise
            les moments qui comptent : mariages, fiançailles et événements, avec
            élégance et discrétion.
          </p>
          {stats.count > 0 && (
            <div className="mt-7 flex items-center gap-3">
              <Stars rating={stats.avg} className="scale-110" />
              <span className="text-sm font-medium text-white/90">
                {stats.avg.toFixed(1)}/5 — {stats.count} avis
              </span>
            </div>
          )}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/portfolio"
              className="rounded-full bg-white px-8 py-3.5 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              Voir le portfolio
            </Link>
            <a
              href="https://wa.me/212696819328"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/40 px-8 py-3.5 text-base font-medium text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Réserver sur WhatsApp
            </a>
          </div>

          {/* Service chips */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
            {["Mariage", "Fiançailles", "Événements", "Photo & Vidéo"].map(
              (chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-white/80 backdrop-blur"
                >
                  {chip}
                </span>
              )
            )}
          </div>

          {/* Info bar */}
          <div className="mt-14 flex w-full max-w-3xl flex-col items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-6 py-5 text-sm text-white/85 backdrop-blur sm:flex-row sm:gap-8">
            <span className="flex items-center gap-2">
              <span aria-hidden>📍</span> Marrakech · Kalaa des Sraghna
            </span>
            <span className="hidden h-4 w-px bg-white/25 sm:block" />
            <span className="flex items-center gap-2">
              <span aria-hidden>🕘</span> Devis gratuit sur WhatsApp
            </span>
            <span className="hidden h-4 w-px bg-white/25 sm:block" />
            <a
              href="https://wa.me/212696819328"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              +212 696 819 328
            </a>
          </div>
        </div>
      </section>

      {/* Services — photo cards */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-600">
              Ce que je capture
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-zinc-900 sm:text-5xl">
              Mes services
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-500">
              Des images & vidéos à la hauteur de vos plus beaux souvenirs —
              élégance, émotion et discrétion.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {SERVICES.map((s) => (
              <Link
                key={s.label}
                href={`/portfolio?categorie=${s.label}`}
                className="group relative h-80 overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl shadow-zinc-900/20"
              >
                <Image
                  src={s.image}
                  alt={s.label}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-500 group-hover:from-black/95" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/70">
                    {s.eyebrow}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                    {s.label}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/85">
                    {s.desc}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Découvrir →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest works */}
      <section className="relative overflow-hidden bg-zinc-900 px-6 py-24">
        <div className="absolute inset-0">
          <Image
            src={bg("photo-1519225421980-715cb0215aed", 2000)}
            alt=""
            fill
            sizes="100vw"
            quality={65}
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/65 to-zinc-950" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-400">
                Portfolio
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-5xl">
                Derniers travaux
              </h2>
              <p className="mt-3 text-white/60">
                Une sélection de mes dernières réalisations — cliquer pour
                ouvrir l&apos;album complet.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Tout voir →
            </Link>
          </div>
          {works.length === 0 ? (
            <p className="py-20 text-center text-white/50">
              Les photos arrivent bientôt. Restez connecté !
            </p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {works.slice(0, 3).map((work) => (
                <WorkCard key={work.id} work={work} rating={ratings[work.id]} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews — detailed, photo bg */}
      {reviews.length > 0 && (
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
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/55 to-zinc-950/85" />
          </div>
          <div className="relative mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-400">
                Témoignages
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-5xl">
                Ce que disent mes clients
              </h2>
            </div>

            <div className="mt-14 grid gap-8 lg:grid-cols-3">
              {/* Rating summary */}
              <div className="flex flex-col items-center justify-center rounded-3xl border border-white/15 bg-white/10 p-10 text-center backdrop-blur-md lg:self-start">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/60">
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
                <a
                  href="https://wa.me/212696819328"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  Laissez votre avis
                </a>
              </div>

              {/* Review cards */}
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
          </div>
        </section>
      )}

      {/* Guides — blog teaser, photo bg */}
      {posts.length > 0 && (
        <section className="relative overflow-hidden bg-zinc-900 px-6 py-24">
          <div className="absolute inset-0">
            <Image
              src={bg("photo-1516035069371-29a1b244cc32", 2000)}
              alt=""
              fill
              sizes="100vw"
              quality={65}
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/60 to-zinc-950" />
          </div>
          <div className="relative mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-400">
                  Blog
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-5xl">
                  Guides & conseils
                </h2>
                <p className="mt-3 text-white/60">
                  Des conseils pour préparer et photographier vos plus beaux
                  moments.
                </p>
              </div>
              <Link
                href="/blog"
                className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Tous les guides →
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-3xl border border-zinc-100 bg-white transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
                >
                  <div className="relative h-48 bg-zinc-200">
                    {post.cover_image && (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-7">
                    <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
                      {formatDate(post.created_at)}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold text-zinc-900 transition-colors group-hover:text-amber-700">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="mt-4 inline-block text-sm font-medium text-zinc-700 transition-colors group-hover:text-amber-700">
                      Lire l&apos;article →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA — centered with bg image + details */}
      <section className="relative overflow-hidden bg-zinc-900 py-28 text-center">
        <div className="absolute inset-0">
          <Image
            src={bg("photo-1523293182086-7651a899d37f", 2000)}
            alt=""
            fill
            sizes="100vw"
            quality={65}
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/70 to-zinc-950/85" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-400">
            Réserver maintenant
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-5xl">
            Vous avez un événement à venir ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80">
            Contactez-moi directement sur WhatsApp pour discuter de votre projet
            et recevoir un devis gratuit, sans engagement.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/212696819328"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-8 py-3.5 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              Discutons de votre projet
            </a>
            <a
              href="tel:+212696819328"
              className="rounded-full border border-white/40 px-8 py-3.5 text-base font-medium text-white transition-colors hover:border-white hover:bg-white/10"
            >
              +212 696 819 328
            </a>
          </div>

          {/* More details */}
          <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              {
                icon: "⚡",
                title: "Réponse rapide",
                desc: "Un retour sous 24h",
              },
              {
                icon: "💶",
                title: "Devis gratuit",
                desc: "Sans aucun engagement",
              },
              {
                icon: "📷",
                title: "Photo + Vidéo",
                desc: "Mariage, fiançailles & événements",
              },
            ].map((d) => (
              <div
                key={d.title}
                className="rounded-2xl border border-white/15 bg-white/10 px-5 py-5 text-center backdrop-blur-md"
              >
                <span className="text-2xl" aria-hidden>
                  {d.icon}
                </span>
                <p className="mt-2.5 font-medium text-white">{d.title}</p>
                <p className="mt-1 text-sm text-white/60">{d.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-white/50">
           📍 Marrakech · Kalaa des Sraghna — interventions dans tout le Maroc
          </p>
        </div>
      </section>
    </div>
  );
}