/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getTranslations } from "next-intl/server";
import { isLocale, type Locale } from "@/i18n/routing";

export const alt = "Youssef Production — Photographer & Videographer in Marrakech";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const marcellus = await readFile(join(process.cwd(), "assets/Marcellus.ttf"));

// The supplied logo sits on a white background, so it is shown on a white
// card rather than dropped straight onto the dark panel.
const logo = await readFile(join(process.cwd(), "public/youssef-logo.png"));
const logoDataUri = `data:image/png;base64,${logo.toString("base64")}`;

/**
 * Localized OG image.
 *
 * Lives inside `app/[locale]/` so it renders one image per language: sharing
 * the French card on `/en` pages would advertise French to English visitors in
 * the link preview.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safe: Locale = isLocale(locale) ? locale : "fr";
  const t = await getTranslations({ locale: safe, namespace: "site" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#18181b",
          backgroundImage:
            "linear-gradient(135deg, #18181b 0%, #27272a 55%, #3f3f46 100%)",
          color: "#fafafa",
          fontFamily: "Marcellus",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(to right, #a16207 0%, #facc15 50%, #a16207 100%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            borderRadius: 24,
            padding: "28px 60px",
          }}
        >
          <img
            src={logoDataUri}
            alt="Youssef Production"
            width={520}
            height={126}
            style={{ width: 520, height: 126, display: "flex" }}
          />
        </div>
        <div
          style={{
            marginTop: 44,
            fontSize: 30,
            color: "#facc15",
            letterSpacing: 8,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {t("ogTagline")}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 24,
            color: "#d4d4d8",
            letterSpacing: 2,
            textAlign: "center",
          }}
        >
          {t("ogServices")}
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 24,
            color: "#d4d4d8",
            letterSpacing: 3,
            textAlign: "center",
          }}
        >
          {t("ogLocation")}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Marcellus",
          data: marcellus,
          weight: 400,
        },
      ],
    }
  );
}