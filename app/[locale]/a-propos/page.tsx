import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isLocale, locales, type Locale } from "@/i18n/routing";
import { localeMetadata } from "@/i18n/metadata";
import {
  EMAIL,
  INSTAGRAM_URL,
  PHONE_E164,
  WHATSAPP_URL,
  absoluteUrl,
} from "@/lib/seo";

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
  return localeMetadata(safe, "about", "/a-propos");
}

const bg = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

const HERO_IMAGE = bg("photo-1516035069371-29a1b244cc32", 2000);
const PORTRAIT = "/youssef-portrait.jpg";
const VALUES_BG = bg("photo-1519225421980-715cb0215aed", 2000);

const CONTENT: Record<
  Locale,
  {
    hero: {
      eyebrow: string;
      title: string;
      subtitle: string;
      ctaChat: string;
      ctaPortfolio: string;
    };
    story: {
      basedIn: string;
      eyebrow: string;
      heading: string;
      p1: string;
      p2: string;
      points: string[];
    };
    stats: { num: string; label: string }[];
    valuesHeader: {
      eyebrow: string;
      heading: string;
      subtitle: string;
    };
    values: { title: string; desc: string }[];
    processHeader: {
      eyebrow: string;
      heading: string;
      subtitle: string;
    };
    steps: { num: string; title: string; desc: string }[];
    cta: {
      heading: string;
      subtitle: string;
      btnWhatsapp: string;
      btnPortfolio: string;
    };
  }
> = {
  fr: {
    hero: {
      eyebrow: "À propos",
      title: "L'homme derrière l'objectif",
      subtitle:
        "Youssef, photographe & vidéaste basé à Marrakech, créateur de souvenirs pour les mariages, fiançailles et événements.",
      ctaChat: "Discuter de votre projet",
      ctaPortfolio: "Voir mes réalisations",
    },
    story: {
      basedIn: "Basé à Marrakech 🇲🇦",
      eyebrow: "Créateur de souvenirs",
      heading: "Raconter des histoires vraies, une image à la fois",
      p1: "Youssef Photography est née d'une passion simple : raconter des histoires vraies à travers l'image. Chaque mariage, chaque fiançailles, chaque événement est une émotion unique qu'il s'agit de préserver pour toujours.",
      p2: "Basé à Marrakech, Youssef intervient dans toute la région — de la médina aux palais, des jardins aux déserts — pour capturer la lumière marocaine sous son plus bel angle.",
      points: [
        "Discret sur place, présent au bon moment",
        "Direction douce, idéale pour les timides",
        "Livraison rapide en haute définition",
      ],
    },
    stats: [
      { num: "120+", label: "Mariages immortalisés" },
      { num: "300+", label: "Événements couverts" },
      { num: "8", label: "Années d'expérience" },
      { num: "100%", label: "Clients satisfaits" },
    ],
    valuesHeader: {
      eyebrow: "Savoir-faire & moyens",
      heading: "La qualité avant tout",
      subtitle:
        "Un matériel soigné, un œil exigeant et une organisation irréprochable pour des souvenirs qui traversent le temps.",
    },
    values: [
      {
        title: "Équipement professionnel",
        desc: "Boîtiers plein format et optiques de haute qualité pour des images nettes et lumineuses, même en conditions exigeantes.",
      },
      {
        title: "Retouche soignée",
        desc: "Chaque photo est sélectionnée et retouchée avec soin pour rester naturelle et fidèle au moment vécu.",
      },
      {
        title: "Livraison rapide",
        desc: "Une galerie privée en haute définition, livrée en quelques jours après votre séance ou votre événement.",
      },
    ],
    processHeader: {
      eyebrow: "Méthode",
      heading: "Comment ça se passe",
      subtitle:
        "Un déroulement simple et transparent, pensé pour vous mettre à l'aise dès le premier échange.",
    },
    steps: [
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
    ],
    cta: {
      heading: "Prêt à créer vos souvenirs ?",
      subtitle:
        "Mariage, fiançailles, événement ou séance photo — écrivez-moi sur WhatsApp, je réponds rapidement.",
      btnWhatsapp: "Réserver via WhatsApp",
      btnPortfolio: "Voir le portfolio",
    },
  },
  en: {
    hero: {
      eyebrow: "About Me",
      title: "The Man Behind the Lens",
      subtitle:
        "Youssef, photographer & videographer based in Marrakech, capturing timeless memories for weddings, engagements and special events.",
      ctaChat: "Discuss your project",
      ctaPortfolio: "View my portfolio",
    },
    story: {
      basedIn: "Based in Marrakech 🇲🇦",
      eyebrow: "Creator of Memories",
      heading: "Telling genuine stories, one frame at a time",
      p1: "Youssef Photography was born from a simple passion: documenting real stories through honest, artistic imagery. Every wedding, engagement, and celebration holds an authentic emotion meant to be cherished forever.",
      p2: "Based in Marrakech, Youssef works across Morocco — from the historic medinas to grand palaces, desert dunes to serene riads — capturing the magical Moroccan light at its most captivating.",
      points: [
        "Discreet on site, present at the decisive moment",
        "Gentle direction, perfect for camera-shy couples",
        "Fast delivery in crystal-clear high definition",
      ],
    },
    stats: [
      { num: "120+", label: "Weddings captured" },
      { num: "300+", label: "Events covered" },
      { num: "8", label: "Years of experience" },
      { num: "100%", label: "Happy clients" },
    ],
    valuesHeader: {
      eyebrow: "Expertise & Standards",
      heading: "Quality above all",
      subtitle:
        "High-end equipment, an uncompromising artistic eye, and seamless organisation for memories that stand the test of time.",
    },
    values: [
      {
        title: "Professional gear",
        desc: "Full-frame camera bodies and premier prime lenses for sharp, luminous imagery even in challenging light.",
      },
      {
        title: "Meticulous retouching",
        desc: "Each photo is hand-selected and carefully colour-graded to preserve natural tones and the genuine emotion of the day.",
      },
      {
        title: "Fast delivery",
        desc: "A private high-definition online gallery, delivered within days of your session or event.",
      },
    ],
    processHeader: {
      eyebrow: "Our Process",
      heading: "How it works",
      subtitle:
        "A clear, transparent workflow designed to make you feel completely relaxed from our very first conversation.",
    },
    steps: [
      {
        num: "01",
        title: "Consultation & scouting",
        desc: "We discuss your expectations and choose the most breathtaking locations tailored to your story.",
      },
      {
        num: "02",
        title: "Guided shoot",
        desc: "Caring, gentle guidance that encourages spontaneous moments and relaxed, natural poses.",
      },
      {
        num: "03",
        title: "Retouching & delivery",
        desc: "A stunning high-resolution online gallery, retouched with love and delivered promptly.",
      },
    ],
    cta: {
      heading: "Ready to create your memories?",
      subtitle:
        "Wedding, engagement, private event or couple session — reach out on WhatsApp, I reply promptly.",
      btnWhatsapp: "Book via WhatsApp",
      btnPortfolio: "View portfolio",
    },
  },
};

const VALUE_ICONS = [
  <svg key="cam" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M2 7h3l2-2h4l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7z" />
    <circle cx="12" cy="13" r="4" />
  </svg>,
  <svg key="sparkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    <circle cx="12" cy="12" r="3.5" />
  </svg>,
  <svg key="clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>,
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = CONTENT[locale as Locale] ?? CONTENT.fr;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: locale === "en" ? "About — Youssef Production" : "À propos — Youssef Production",
    mainEntity: {
      "@type": "ProfessionalService",
      name: "Youssef Production",
      url: absoluteUrl(`/${locale}/a-propos`),
      telephone: PHONE_E164,
      email: EMAIL,
      sameAs: [INSTAGRAM_URL],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Marrakech",
        addressCountry: "MA",
      },
    },
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
            sizes="100vw"
            quality={70}
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/60 to-zinc-900" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 py-28 text-center sm:py-36">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-amber-400">
            {t.hero.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-white sm:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            {t.hero.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-amber-400 px-7 py-3 font-medium text-zinc-900 transition-colors hover:bg-amber-300"
            >
              {t.hero.ctaChat}
            </a>
            <Link
              href="/portfolio"
              className="rounded-full border border-white/40 px-7 py-3 font-medium text-white transition-colors hover:border-white hover:bg-white/10"
            >
              {t.hero.ctaPortfolio}
            </Link>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative overflow-hidden rounded-3xl bg-zinc-100">
              <Image
                src={PORTRAIT}
                alt="Youssef — photographe et vidéaste à Marrakech"
                width={767}
                height={1293}
                preload
                sizes="(max-width: 1024px) 100vw, 448px"
                className="aspect-[3/5] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-amber-400">
                    Youssef Production
                  </p>
                  <p className="mt-1 font-display text-2xl text-white">
                    Youssef
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-lg backdrop-blur-sm">
                  📍
                </span>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-3 rounded-2xl border border-white/10 bg-zinc-900 px-6 py-4 shadow-xl sm:-right-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-amber-400">
                {locale === "en" ? "Location" : "Basé à"}
              </p>
              <p className="mt-1 font-display text-xl text-white">
                Marrakech 🇲🇦
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-500">
              {t.story.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-zinc-900 sm:text-4xl">
              {t.story.heading}
            </h2>
            <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-zinc-600">
              <p>{t.story.p1}</p>
              <p>{t.story.p2}</p>
            </div>
            <ul className="mt-8 space-y-3.5">
              {t.story.points.map((p) => (
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
          {t.stats.map((s) => (
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
              {t.valuesHeader.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
              {t.valuesHeader.heading}
            </h2>
            <p className="mt-4 text-lg text-white/70">
              {t.valuesHeader.subtitle}
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {t.values.map((v, i) => (
              <div
                key={v.title}
                className="rounded-3xl border border-white/15 bg-white/10 p-8 backdrop-blur-md transition-colors hover:border-amber-400/40"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-zinc-900">
                  {VALUE_ICONS[i]}
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
            {t.processHeader.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-zinc-900 sm:text-4xl">
            {t.processHeader.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-500">
            {t.processHeader.subtitle}
          </p>
        </div>
        <div className="relative mt-16 grid gap-10 sm:grid-cols-3">
          <div className="absolute left-1/2 top-7 hidden h-px w-2/3 -translate-x-1/2 border-t border-dashed border-zinc-200 sm:block" />
          {t.steps.map((s) => (
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
          {t.cta.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-white/80">
          {t.cta.subtitle}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-amber-400 px-8 py-3 font-medium text-zinc-900 transition-colors hover:bg-amber-300"
          >
            {t.cta.btnWhatsapp}
          </a>
          <Link
            href="/portfolio"
            className="rounded-full border border-white/40 px-8 py-3 font-medium text-white transition-colors hover:border-white hover:bg-white/10"
          >
            {t.cta.btnPortfolio}
          </Link>
        </div>
      </section>
    </div>
  );
}