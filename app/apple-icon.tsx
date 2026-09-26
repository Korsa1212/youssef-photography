import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const marcellus = await readFile(join(process.cwd(), "assets/Marcellus.ttf"));

export default function AppleIcon() {
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
          background: "linear-gradient(135deg, #18181b 0%, #27272a 60%, #3f3f46 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 18,
            background:
              "linear-gradient(to right, #a16207 0%, #facc15 50%, #a16207 100%)",
          }}
        />
        <div
          style={{
            fontFamily: "Marcellus",
            fontSize: 84,
            color: "#fafafa",
            lineHeight: 1,
            letterSpacing: 2,
          }}
        >
          YP
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Marcellus", data: marcellus, weight: 400 }],
    }
  );
}
