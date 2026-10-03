import type { Metadata } from "next";
import { fontClassName } from "@/app/fonts";
// The admin tree is a separate root layout, so it needs its own copy of the
// global stylesheet — see app/[locale]/layout.tsx.
import "../globals.css";

/**
 * Root layout for the admin area.
 *
 * The admin has its own root layout rather than nesting under the public one so
 * it never renders the public Header, Footer or analytics script. It stays
 * French-only on purpose: Youssef is the only user, and the admin is never
 * indexed.
 */
export const metadata: Metadata = {
  title: "Administration — Youssef Production",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={fontClassName}>
      <body className="min-h-screen bg-zinc-950 font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}