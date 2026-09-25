import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Youssef Production — photographe et vidéaste à Marrakech. Découvrez qui est Youssef, son matériel, son savoir-faire et sa façon de travailler.",
};

const VALUES = [
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

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-zinc-900 px-6 py-24 text-center sm:py-32">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">
          À propos
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold text-white sm:text-6xl">
          L&apos;homme derrière l&apos;objectif
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
          Youssef, photographe & vidéaste basé à Marrakech et Kalaa des Sraghna,
          créateur de souvenirs pour les mariages, fiançailles et événements.
        </p>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold text-zinc-900">
          Créateur de souvenirs
        </h2>
        <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-zinc-600">
          <p>
            Youssef Photography est née d&apos;une passion simple : raconter des
            histoires vraies à travers l&apos;image. Chaque mariage, chaque
            fiançailles, chaque événement est une émotion unique qu&apos;il
            s&apos;agit de préserver pour toujours.
          </p>
          <p>
            Basé à Marrakech, Youssef intervient dans toute la région — de la
            médina aux palais, des jardins aux déserts — pour capturer la
            lumière marocaine sous son plus bel angle. Discret pendant les
            moments importants, rassurant devant les plus timides, il met
            l&apos;humain au centre de chaque séance.
          </p>
          <p>
            Son approche : des photos naturelles, une vraie direction bienveillante
            et une livraison rapide de vos souvenirs en haute définition.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-zinc-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-3xl font-semibold text-zinc-900">
            Savoir-faire & moyens
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-zinc-100 bg-white p-7"
              >
                <h3 className="text-lg font-medium text-zinc-900">{v.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-zinc-500">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center font-display text-3xl font-semibold text-zinc-900">
          Comment ça se passe
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-zinc-500">
          Un déroulement simple et transparent, pensée pour vous mettre à
          l&apos;aise dès le premier échange.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl border border-zinc-100 p-7"
            >
              <span className="font-display text-4xl font-semibold text-zinc-200">
                {s.num}
              </span>
              <h3 className="mt-4 text-lg font-medium text-zinc-900">
                {s.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-900 px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-semibold text-white">
          Parlons de votre projet
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/80">
          Mariage, fiançailles, événement ou séance photo — écrivez-moi sur
          WhatsApp, je réponds rapidement.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://wa.me/212696819328"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-7 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Réserver via WhatsApp
          </a>
          <Link
            href="/portfolio"
            className="rounded-full border border-white/40 px-7 py-3 font-medium text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Voir le portfolio
          </Link>
        </div>
      </section>
    </div>
  );
}