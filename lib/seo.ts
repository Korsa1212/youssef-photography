export const SITE_NAME = "Youssef Production";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://www.youssefproduction.com";
export const SITE_DESCRIPTION =
  "Youssef Production — photographe et vidéaste à Marrakech. Mariage, fiançailles, événements : des souvenirs authentiques, livrés rapidement.";

export const PHONE_E164 = "+212696819328";
export const PHONE_DISPLAY = "+212 696 819 328";
export const WHATSAPP_URL = "https://wa.me/212696819328";
export const EMAIL = "baghzaoui1@gmail.com";
export const INSTAGRAM_URL = "https://www.instagram.com/youssef.production";

/**
 * Full Google review URL, e.g.
 * https://search.google.com/local/writereview?placeid=ChIJ...
 * Left null when unset so the review button stays hidden.
 */
export const GOOGLE_REVIEW_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL?.trim() || null;

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}