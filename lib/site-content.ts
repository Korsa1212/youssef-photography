export const HERO = {
  eyebrow: "Photographe & vidéaste à Marrakech",
  title: "Votre histoire,\ncapturée avec élégance.",
  subtitle:
    "Reportages mariage, séances fiançailles et événements à Marrakech. Des images naturelles, une présence discrète, et des souvenirs livrés en quelques jours.",
  primaryCta: "Vérifier ma disponibilité",
  secondaryCta: "Voir le portfolio",
};

export const WEDDING_FILM_TITLE = "Wedding Film";

const bg = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

export const SERVICES_DETAIL = [
  {
    num: "01",
    label: "Photographie",
    desc: "Des images naturelles, lumineuses et fidèles à votre journée.",
    image: bg("photo-1519741497674-611481863552", 900),
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
    image: bg("photo-1511285560929-80b456fea0bc", 900),
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
    image: bg("photo-1511578314322-379afb476865", 900),
    items: [
      "Séance photo de fiançailles ou de couple",
      "Retouches supplémentaires de votre choix",
      "Galerie photo interactive personnalisée",
      "Tirages et albums sur devis",
      "Livraison express sur demande",
    ],
  },
];

export const PACKAGES = [
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
    highlight: true,
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
];

export const WHY_US = [
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
];

export const WHY_US_IMAGE = bg("photo-1516035069371-29a1b244cc32", 1600);
export const PORTRAIT = {
  src: "/youssef-portrait.jpg",
  width: 767,
  height: 1293,
};
