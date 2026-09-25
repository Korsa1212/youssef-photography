"use client";

import { useState } from "react";
import Link from "next/link";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/a-propos", label: "À propos" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
            YOUSSEF PRODUCTION
          </span>
          <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
            Photographe & Vidéaste
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-base text-zinc-600 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="font-medium transition-colors hover:text-zinc-900"
            >
              {n.label}
            </Link>
          ))}
          <a
            href="https://wa.me/212696819328"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-zinc-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Réserver
          </a>
        </nav>

        <button
          className="flex h-11 w-11 items-center justify-center text-zinc-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-zinc-100 bg-white px-6 py-5 md:hidden">
          <div className="flex flex-col gap-4 text-base text-zinc-700">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="transition-colors hover:text-zinc-900"
              >
                {n.label}
              </Link>
            ))}
            <a
              href="https://wa.me/212696819328"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-full bg-zinc-900 px-4 py-3 text-center text-white"
            >
              Réserver
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}