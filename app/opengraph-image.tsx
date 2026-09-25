import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Youssef Production — Photographe & Vidéaste à Marrakech";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const marcellus = await readFile(join(process.cwd(), "assets/Marcellus.ttf"));

export default async function OpengraphImage() {
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
          background: "linear-gradient(135deg, #18181b 0%, #27272a 55%, #3f3f46 100%)",
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
        <div style={{ fontSize: 62, letterSpacing: 4, textAlign: "center" }}>
          YOUSSEF PRODUCTION
        </div>
        <div
          style={{
            marginTop: 20,
            width: 520,
            height: 1,
            background: "#facc15",
          }}
        />
        <div
          style={{
            marginTop: 20,
            fontSize: 30,
            color: "#facc15",
            letterSpacing: 8,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          Photographe &amp; Vidéaste
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 24,
            color: "#d4d4d8",
            letterSpacing: 2,
            textAlign: "center",
          }}
        >
          Mariage · Fiançailles · Événements
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 24,
            color: "#d4d4d8",
            letterSpacing: 3,
            textAlign: "center",
          }}
        >
          à Marrakech
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