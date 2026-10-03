import type { Locale } from "@/i18n/routing";

/**
 * Long-form marketing copy for the home page.
 *
 * Kept as typed TypeScript rather than pushed into `messages/*.json` because
 * these are nested structures (cards, bullet lists), not flat UI labels — as
 * JSON they would lose type inference and be painful to edit.
 *
 * The `Record<Locale, ...>` shape is deliberate: adding a third language makes
 * this file a compile error rather than a silently half-translated page.
 *
 * Images and the highlighted-package position are locale-independent and
 * declared once below.
 */

const bg = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

export type Hero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
};

export type ServiceCard = {
  num: string;
  label: string;
  desc: string;
  image: string;
  items: string[];
};

export type PackageCard = {
  name: string;
  tagline: string;
  highlight?: boolean;
  items: string[];
};

export type WhyUsItem = {
  num: string;
  title: string;
  desc: string;
};

export type SiteCopy = {
  hero: Hero;
  services: { eyebrow: string; heading: string; body: string };
  servicesDetail: ServiceCard[];
  packagesSection: { eyebrow: string; heading: string; body: string; footnote: string };
  packages: PackageCard[];
  whyUsSection: { eyebrow: string; heading: string; body: string; cta: string };
  whyUs: WhyUsItem[];
};

/* ---------------- Language-independent assets ---------------- */

const SERVICE_IMAGES = [
  bg("photo-1519741497674-611481863552", 900),
  bg("photo-1511285560929-80b456fea0bc", 900),
  bg("photo-1511578314322-379afb476865", 900),
];

/** Index of the visually elevated package card ("Premium"). */
const HIGHLIGHTED_PACKAGE = 1;

export const WHY_US_IMAGE = bg("photo-1516035069371-29a1b244cc32", 1600);

export const PORTRAIT = {
  src: "/youssef-portrait.jpg",
  width: 767,
  height: 1293,
};

/* ---------------- French ---------------- */

const FR: SiteCopy = {
  hero: {
    eyebrow: "Photographe & vidéaste à Marrakech",
    title: "Votre histoire,\ncapturée avec élégance.",
    subtitle:
      "Reportages mariage, séances fiançailles et événements à Marrakech. Des images naturelles, une présence discrète, et des souvenirs livrés en quelques jours.",
    primaryCta: "Vérifier ma disponibilité",
    secondaryCta: "Voir le portfolio",
  },
  services: {
    eyebrow: "Ce que je capture",
    heading: "Mes services",
    body: "Photo, vidéo et options — tout ce qu'il faut pour garder vos souvenirs intacts.",
  },
  servicesDetail: [
    {
      num: "01",
      label: "Photographie",
      desc: "Des images naturelles, lumineuses et fidèles à votre journée.",
      image: SERVICE_IMAGES[0],
      items: [
        "Reportage photo de la journée complète",
        "Séance photo de mariage ou de fiançailles",
        "Retouche professionnelle image par image",
        "Galerie privée en ligne",
        "Livraison en haute résolution",
      ],
    },
    {
      num: "02",
      label: "Vidéographie",
      desc: "L'émotion de la journée, en mouvement et en musique.",
      image: SERVICE_IMAGES[1],
      items: [
        "Reportage vidéo de la journée complète",
        "Teaser vertical pour Reels, TikTok et Stories",
        "Son direct, ambiance et moments clés",
        "Montage dynamique et coloré",
        "Livraison en haute qualité",
      ],
    },
    {
      num: "03",
      label: "Options",
      desc: "Pour aller plus loin sur votre événement, en plus de la formule choisie.",
      image: SERVICE_IMAGES[2],
      items: [
        "Séance photo de fiançailles ou de couple",
        "Retouches supplémentaires de votre choix",
        "Galerie photo interactive personnalisée",
        "Tirages et albums sur devis",
        "Livraison express sur demande",
      ],
    },
  ],
  packagesSection: {
    eyebrow: "Formules",
    heading: "Nos formules",
    body: "Chaque événement est unique. Choisissez une base, nous ajustons ensemble.",
    footnote:
      "Tarifs sur devis, selon la durée, la date et le nombre de photographes. Réponse sous 24 h.",
  },
  packages: [
    {
      name: "Essentiel",
      tagline: "La photographie, sans le film",
      items: [
        "Reportage photo de la journée complète",
        "+ de 300 photos retouchées",
        "Galerie privée en ligne",
        "Exposition des images clés",
        "Livraison sous 15 jours",
      ],
    },
    {
      name: "Premium",
      tagline: "Photo et vidéo — le plus demandé",
      items: [
        "Tout le pack Essentiel",
        "+ de 500 photos retouchées",
        "Reportage vidéo complet de la journée",
        "Teaser vertical pour les réseaux sociaux",
        "Livraison sous 10 jours",
      ],
    },
    {
      name: "Signature",
      tagline: "L'expérience complète",
      items: [
        "Tout le pack Premium",
        "Séance photo de fiançailles offerte",
        "Galerie photo interactive personnalisée",
        "Retouches supplémentaires offertes",
        "Livraison express sous 5 jours",
      ],
    },
  ],
  whyUsSection: {
    eyebrow: "Pourquoi nous choisir",
    heading: "Ce qui fait la différence",
    body: "Un travail soigné, sans mauvaise surprise, et une livraison qui arrive à temps. C'est ce que nos clients attendent en premier.",
    cta: "Vérifier ma disponibilité",
  },
  whyUs: [
    {
      num: "01",
      title: "Matériel professionnel",
      desc: "Des reflex et objectifs haut de gamme pour des images nettes, même dans la lumière difficile de Marrakech.",
    },
    {
      num: "02",
      title: "Discrétion",
      desc: "Nous restons en retrait pour que vous profitiez de votre journée sans passer votre temps devant un objectif.",
    },
    {
      num: "03",
      title: "Livraison rapide",
      desc: "Vos photos et votre film retouchés en quelques jours, pas plusieurs mois après l'événement.",
    },
    {
      num: "04",
      title: "Prix clair",
      desc: "Un devis détaillé avant le jour J. Aucun frais caché, aucune mauvaise surprise.",
    },
    {
      num: "05",
      title: "Accompagnement",
      desc: "On discute de votre projet, de vos envies et de vos lieux avant le reportage, puis on vous guide le jour J.",
    },
    {
      num: "06",
      title: "Toujours disponible",
      desc: "Réponse rapide sur WhatsApp et accompagnement du premier contact jusqu'à la livraison finale.",
    },
  ],
};

/* ---------------- English ---------------- */

const EN: SiteCopy = {
  hero: {
    eyebrow: "Photographer & videographer in Marrakech",
    title: "Your story,\ncaptured with elegance.",
    subtitle:
      "Wedding coverage, engagement sessions and events in Marrakech. Natural images, an unobtrusive presence, and memories delivered within days.",
    primaryCta: "Check my availability",
    secondaryCta: "See the portfolio",
  },
  services: {
    eyebrow: "What I capture",
    heading: "My services",
    body: "Photo, video and extras — everything you need to keep your memories intact.",
  },
  servicesDetail: [
    {
      num: "01",
      label: "Photography",
      desc: "Natural, bright images that stay true to your day.",
      image: SERVICE_IMAGES[0],
      items: [
        "Full-day photo coverage",
        "Wedding or engagement photo session",
        "Professional retouching, image by image",
        "Private online gallery",
        "High-resolution delivery",
      ],
    },
    {
      num: "02",
      label: "Videography",
      desc: "The emotion of the day, in motion and in music.",
      image: SERVICE_IMAGES[1],
      items: [
        "Full-day video coverage",
        "Vertical teaser for Reels, TikTok and Stories",
        "Live sound, atmosphere and key moments",
        "Dynamic, colourful editing",
        "High-quality delivery",
      ],
    },
    {
      num: "03",
      label: "Extras",
      desc: "Go further with your event, on top of the package you chose.",
      image: SERVICE_IMAGES[2],
      items: [
        "Engagement or couple photo session",
        "Additional retouching of your choice",
        "Personalised interactive photo gallery",
        "Prints and albums on quote",
        "Express delivery on request",
      ],
    },
  ],
  packagesSection: {
    eyebrow: "Packages",
    heading: "Our packages",
    body: "Every event is unique. Pick a starting point and we will fine-tune it together.",
    footnote:
      "Prices on quote, based on duration, date and number of photographers. Reply within 24 h.",
  },
  packages: [
    {
      name: "Essentiel",
      tagline: "Photography, without the film",
      items: [
        "Full-day photo coverage",
        "300+ retouched photos",
        "Private online gallery",
        "Selection of key images",
        "Delivery within 15 days",
      ],
    },
    {
      name: "Premium",
      tagline: "Photo and video — most requested",
      items: [
        "Everything in Essentiel",
        "500+ retouched photos",
        "Full-day video coverage",
        "Vertical teaser for social media",
        "Delivery within 10 days",
      ],
    },
    {
      name: "Signature",
      tagline: "The complete experience",
      items: [
        "Everything in Premium",
        "Complimentary engagement photo session",
        "Personalised interactive photo gallery",
        "Complimentary additional retouching",
        "Express delivery within 5 days",
      ],
    },
  ],
  whyUsSection: {
    eyebrow: "Why choose us",
    heading: "What makes the difference",
    body: "Careful work, no bad surprises, and a delivery that actually arrives on time. This is what our clients expect first.",
    cta: "Check my availability",
  },
  whyUs: [
    {
      num: "01",
      title: "Professional equipment",
      desc: "High-end DSLRs and lenses for sharp images, even in Marrakech's difficult light.",
    },
    {
      num: "02",
      title: "Discretion",
      desc: "We stay in the background so you can enjoy your day without spending it in front of a lens.",
    },
    {
      num: "03",
      title: "Fast delivery",
      desc: "Your retouched photos and film within days, not months after the event.",
    },
    {
      num: "04",
      title: "Clear pricing",
      desc: "A detailed quote before the big day. No hidden fees, no bad surprises.",
    },
    {
      num: "05",
      title: "Guidance",
      desc: "We discuss your project, your wishes and your locations before the shoot, then guide you on the day.",
    },
    {
      num: "06",
      title: "Always available",
      desc: "Quick replies on WhatsApp and support from first contact through final delivery.",
    },
  ],
};

/* ---------------- Assembly ---------------- */

for (const copy of [FR, EN]) {
  copy.packages[HIGHLIGHTED_PACKAGE]!.highlight = true;
}

const COPY: Record<Locale, SiteCopy> = { fr: FR, en: EN };

/**
 * Marketing copy for a locale. Always returns a complete object, so callers
 * never null-check; an unknown locale falls back to French.
 */
export function getSiteCopy(locale: Locale): SiteCopy {
  return COPY[locale] ?? COPY.fr;
}