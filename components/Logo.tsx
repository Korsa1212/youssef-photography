import Link from "next/link";

const THEME = {
  light: {
    stroke: "#57534b",
    sub: "text-zinc-400",
  },
  dark: {
    stroke: "#fafaf9",
    sub: "text-white/45",
  },
} as const;

export default function Logo({
  variant = "light",
  className = "",
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const t = THEME[variant];

  return (
    <Link
      href="/"
      aria-label="Youssef Production — accueil"
      className={`group flex shrink-0 flex-col items-center leading-none ${className}`}
    >
      <span
        className={`text-[8px] font-medium uppercase tracking-[0.42em] sm:text-[9px] sm:tracking-[0.5em] ${t.sub}`}
      >
        Photographe &amp; Vidéaste
      </span>

      <span
        className="mt-1.5 font-script text-[1.75rem] tracking-[0.24em] sm:text-[2.1rem] sm:tracking-[0.28em]"
        style={{
          color: "transparent",
          WebkitTextStroke: `1px ${t.stroke}`,
        }}
      >
        YOUSSEF
      </span>

      <span
        className={`mt-1.5 text-[9px] font-medium uppercase tracking-[0.5em] sm:text-[10px] sm:tracking-[0.58em] ${t.sub}`}
      >
        Production
      </span>
    </Link>
  );
}
