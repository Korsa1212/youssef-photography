import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-zinc-900">
            YOUSSEF PRODUCTION
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-zinc-500">
            Photographe & vidéaste — créateur de souvenirs. Mariage · Fiançailles
            · Événements.
          </p>
        </div>
        <div className="text-[15px]">
          <p className="mb-3 font-semibold text-zinc-900">Contact</p>
          <a
            href="tel:+212696819328"
            className="block text-zinc-500 transition-colors hover:text-zinc-900"
          >
            +212 696 819 328
          </a>
          <a
            href="mailto:baghzaoui1@gmail.com"
            className="block text-zinc-500 transition-colors hover:text-zinc-900"
          >
            baghzaoui1@gmail.com
          </a>
          <a
            href="https://wa.me/212696819328"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition-colors hover:text-zinc-900"
          >
            WhatsApp
          </a>
        </div>
        <div className="text-[15px]">
          <p className="mb-3 font-semibold text-zinc-900">Localisation</p>
          <p className="text-zinc-500">Marrakech / Kalaa des Sraghna, Maroc</p>
        </div>
      </div>
      <div className="border-t border-zinc-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Youssef Production. Tous droits réservés.</p>
          <Link href="/admin" className="transition-colors hover:text-zinc-600">
            Espace admin
          </Link>
        </div>
      </div>
    </footer>
  );
}