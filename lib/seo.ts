export const SITE_NAME = "Youssef Production";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://www.youssefproduction.com";
export const SITE_DESCRIPTION =
  "Youssef Production — photographe et vidéaste à Marrakech. Mariage, fiançailles, événements : des souvenirs authentiques, livrés rapidement.";

export const PHONE_E164 = "+212526051702";
export const PHONE_DISPLAY = "+212 5 26 05 17 02";
export const WHATSAPP_URL = "https://wa.me/212696819328";
export const EMAIL = "contact@youssefproduction.com";
export const INSTAGRAM_URL = "https://www.instagram.com/youssef.production";

/**
 * Full Google review URL, e.g.
 * https://search.google.com/local/writereview?placeid=ChIJ...
 * Left null when unset so the review button stays hidden.
 */
export const GOOGLE_REVIEW_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL?.trim() || null;

/**
 * Wedding film link. Accepts a YouTube, Vimeo or direct video-file URL.
 * Left null so the section stays hidden until a link is provided.
 * Note: Facebook links cannot be embedded on third-party sites and are ignored.
 */
export const WEDDING_FILM_URL =
  process.env.NEXT_PUBLIC_WEDDING_FILM_URL?.trim() || null;

/** Optional poster frame shown before playback. Falls back to a real portfolio photo. */
export const WEDDING_FILM_POSTER =
  process.env.NEXT_PUBLIC_WEDDING_FILM_POSTER?.trim() || null;

export type FilmSource =
  | { kind: "embed"; src: string }
  | { kind: "file"; src: string };

export function filmSource(raw: string | null): FilmSource | null {
  if (!raw) return null;
  const url = raw.trim();

  const youtube =
    url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/);
  if (youtube) {
    return {
      kind: "embed",
      src: `https://www.youtube-nocookie.com/embed/${youtube[1]}?rel=0&modestbranding=1&playsinline=1`,
    };
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return { kind: "embed", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  }

  if (/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url)) {
    return { kind: "file", src: url };
  }

  return null;
}

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}