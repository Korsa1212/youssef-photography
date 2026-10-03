import Link from "next/link";

/**
 * Catches paths that never resolve to a route — and therefore never get a
 * root layout. Without this file a bare `/nope` would try to render the 404
 * inside the localized layout, which is exactly what `localePrefix: "always"`
 * is meant to prevent. Renders its own `<html>`/`<body>` for that reason.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          background: "#ffffff",
          color: "#18181b",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#d97706",
              margin: 0,
            }}
          >
            Error 404
          </p>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 600,
              margin: "1rem 0 0",
            }}
          >
            Page not found
          </h1>
          <p style={{ color: "#71717a", margin: "0.75rem 0 0" }}>
            This address does not exist.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: "2rem",
              background: "#18181b",
              color: "#ffffff",
              padding: "0.75rem 1.75rem",
              borderRadius: "9999px",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            Go to the homepage
          </Link>
        </div>
      </body>
    </html>
  );
}