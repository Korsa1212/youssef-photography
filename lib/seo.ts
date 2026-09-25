export const SITE_NAME = "Youssef Production";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://youssefproduction.com";
export const SITE_DESCRIPTION =
  "Youssef Production — photographe et vidéaste à Marrakech. Mariage, fiançailles, événements : des souvenirs authentiques, livrés rapidement.";

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}