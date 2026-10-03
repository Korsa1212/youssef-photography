"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import { Link } from "@/i18n/navigation";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  // The blog is French-only, so the entry is hidden on the English site rather
  // than linking to a page that does not exist.
  const nav = [
    { href: "/", label: t("home"), key: "home" },
    { href: "/portfolio", label: t("portfolio"), key: "portfolio" },
    { href: "/blog", label: t("blog"), key: "blog" },
    { href: "/a-propos", label: t("about"), key: "about" },
    { href: "/faq", label: t("faq"), key: "faq" },
    { href: "/contact", label: t("contact"), key: "contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-6">
        {/* Not preloaded on purpose: the hero image owns the preload slot on
            every page, and a second preload would waste bandwidth. */}
        <Logo />

        <nav className="hidden items-center gap-6 text-base text-zinc-600 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.key}
              href={n.href}
              className="font-medium transition-colors hover:text-zinc-900"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher />
          <a
            href="https://wa.me/212696819328"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-zinc-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-zinc-700"
          >
            {t("book")}
          </a>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center text-zinc-700 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t("closeMenu") : t("openMenu")}
          aria-expanded={open}
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
        <nav className="border-t border-zinc-100 bg-white px-6 py-5 lg:hidden">
          <div className="flex flex-col gap-4 text-base text-zinc-700">
            {nav.map((n) => (
              <Link
                key={n.key}
                href={n.href}
                onClick={() => setOpen(false)}
                className="transition-colors hover:text-zinc-900"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-zinc-100 pt-5">
              <LocaleSwitcher />
            </div>
            <a
              href="https://wa.me/212696819328"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-zinc-900 px-4 py-3 text-center text-white"
            >
              {t("book")}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}