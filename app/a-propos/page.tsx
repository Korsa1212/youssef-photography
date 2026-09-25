import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos — votre photographe à Marrakech",
  description:
    "Youssef Production — photographe et vidéaste à Marrakech. Découvrez Youssef, son matériel, son savoir-faire et sa façon de travailler.",
  alternates: { canonical: "/a-propos" },
  openGraph: {
    title: "À propos — Youssef Production",
    description:
      "Le photographe derrière Youssef Production : matériel, savoir-faire et façon de travailler.",
    url: "/a-propos",
  },
};

const bg = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

const HERO_IMAGE = bg("photo-1516035069371-29a1b244cc32", 2000);
const PORTRAIT_IMAGE = bg("photo-1522673607200-164d1b6ce486", 1600);
const VALUES_BG = bg("photo-1519225421980-715cb0215aed", 2000);

const STATS = [
  { num: "120+", label: "Mariages immortalisés" },
  { num: "300+", label: "Événements couverts" },
  { num: "8", label: "Années d'expérience" },
  { num: "100%", label: "Clients satisfaits" },
];

const VALUES = [
  {
    title: "Équipement professionnel",
    desc: "Boîtiers plein format et optiques de haute qualité pour des images nettes et lumineuses, même en conditions exigeantes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M2 7h3l2-2h4l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    title: "Retouche soignée",
    desc: "Chaque photo est sélectionnée et retouchée avec soin pour rester naturelle et fidèle au moment vécu.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    ),
  },
  {
    title: "Livraison rapide",
    desc: "Une galerie privée en haute définition, livrée en quelques jours après votre séance ou votre événement.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    num: "01",
    title: "Échange & repérage",
    desc: "Nous définissons ensemble vos attentes et choisissons les lieux les plus adaptés à votre projet.",
  },
  {
    num: "02",
    title: "Séance guidée",
    desc: "Un accompagnement bienveillant pour des poses fluides et des instants authentiques, sans artifice.",
  },
  {
    num: "03",
    title: "Retouche & livraison",
    desc: "Une galerie haute définition, retouchée avec soin et livrée rapidement.",
  },
];

const POINTS = [
  "Discret sur place, présent au bon moment",
  "Direction douce, idéale pour les timides",
  "Livraison rapide en haute définition",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "À propos — Youssef Production",
  mainEntity: {
    "@type": "ProfessionalService",
    name: "Youssef Production",
    url: "https://youssefproduction.com",
    telephone: "+212696819328",
    email: "baghzaoui1@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marrakech",
      addressCountry: "MA",
    },
  },
};

export default function AboutPage() {
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
            sizes="100vw"
            priority
            quality={70}
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/60 to-zinc-900" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 py-28 text-center sm:py-36">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-amber-400">
            À propos
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-white sm:text-6xl">
            L&apos;homme derrière l&apos;objectif
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Youssef, photographe & vidéaste basé à Marrakech et Kalaa des
            Sraghna, créateur de souvenirs pour les mariages, fiançailles et
            événements.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/212696819328"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-amber-400 px-7 py-3 font-medium text-zinc-900 transition-colors hover:bg-amber-300"
            >
              Discuter de votre projet
            </a>
            <Link
              href="/portfolio"
              className="rounded-full border border-white/40 px-7 py-3 font-medium text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Voir mes réalisations
            </Link>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-3xl">
              <Image
                src={PORTRAIT_IMAGE}
                alt="Youssef Production — photographe à Marrakech"
                width={1600}
                height={2000}
                sizes="(max-width: 1024px) 100vw, 448px"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-3 rounded-2xl border border-white/10 bg-zinc-900 px-6 py-4 shadow-xl sm:-right-6">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-400">
                Basé à
              </p>
              <p className="mt-1 font-display text-xl text-white">
                Marrakech 🇲🇦
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-500">
              Créateur de souvenirs
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-zinc-900 sm:text-4xl">
              Raconter des histoires vraies, une image à la fois
            </h2>
            <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-zinc-600">
              <p>
                Youssef Photography est née d&apos;une passion simple : raconter
                des histoires vraies à travers l&apos;image. Chaque mariage,
                chaque fiançailles, chaque événement est une émotion unique
                qu&apos;il s&apos;agit de préserver pour toujours.
              </p>
              <p>
                Basé à Marrakech, Youssef intervient dans toute la région — de la
                médina aux palais, des jardins aux déserts — pour capturer la
                lumière marocaine sous son plus bel angle.
              </p>
            </div>
            <ul className="mt-8 space-y-3.5">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15px] text-zinc-700">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-sm text-amber-500">
                    ✓
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-zinc-900 px-6 py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl font-semibold text-amber-400 sm:text-5xl">
                {s.num}
              </p>
              <p className="mt-2 text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values — photo band */}
      <section className="relative overflow-hidden bg-zinc-950 px-6 py-24">
        <div className="absolute inset-0">
          <Image
            src={VALUES_BG}
            alt=""
            fill
            sizes="100vw"
            quality={65}
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/75 to-zinc-950" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-400">
              Savoir-faire & moyens
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
              La qualité avant tout
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Un matériel soigné, un œil exigeant et une organisation
              irréprochable pour des souvenirs qui traversent le temps.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-3xl border border-white/15 bg-white/10 p-8 backdrop-blur-md transition-colors hover:border-amber-400/40"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-zinc-900">
                  {v.icon}
                </span>
                <h3 className="mt-6 text-lg font-medium text-white">{v.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-white/70">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-500">
            Méthode
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-zinc-900 sm:text-4xl">
            Comment ça se passe
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-500">
            Un déroulement simple et transparent, pensé pour vous mettre à
            l&apos;aise dès le premier échange.
          </p>
        </div>
        <div className="relative mt-16 grid gap-10 sm:grid-cols-3">
          <div className="absolute left-1/2 top-7 hidden h-px w-2/3 -translate-x-1/2 border-t border-dashed border-zinc-200 sm:block" />
          {STEPS.map((s) => (
            <div key={s.num} className="relative text-center">
              <span className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 font-display text-lg font-semibold text-zinc-900 shadow-lg shadow-amber-500/20">
                {s.num}
              </span>
              <h3 className="mt-6 text-xl font-medium text-zinc-900">{s.title}</h3>
              <p className="mx-auto mt-2.5 max-w-xs text-[15px] leading-relaxed text-zinc-500">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-900 px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Prêt à créer vos souvenirs ?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-white/80">
          Mariage, fiançailles, événement ou séance photo — écrivez-moi sur
          WhatsApp, je réponds rapidement.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://wa.me/212696819328"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-amber-400 px-8 py-3 font-medium text-zinc-900 transition-colors hover:bg-amber-300"
          >
            Réserver via WhatsApp
          </a>
          <Link
            href="/portfolio"
            className="rounded-full border border-white/40 px-8 py-3 font-medium text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Voir le portfolio
          </Link>
        </div>
      </section>
    </div>
  );
}