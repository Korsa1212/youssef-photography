import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Italiana
} from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"]
});
const italiana = Italiana({
  variable: "--font-italiana",
  subsets: ["latin"],
  weight: ["400"]
});

/**
 * Shared by both root layouts: the localized site under `app/[locale]`
 * and the admin area. They are separate root layouts because the
 * localized one must set `<html lang>` per request, and a root layout
 * sitting above `app/[locale]` cannot read that param.
 */
export const fontClassName = `${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${italiana.variable} h-full antialiased`;

export const bodyClassName =
  "flex min-h-full flex-col bg-white font-sans text-zinc-900";
