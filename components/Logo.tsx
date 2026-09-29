import Image from "next/image";
import Link from "next/link";

export default function Logo({
  className = "",
  preload = false,
}: {
  className?: string;
  preload?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Youssef Production — accueil"
      className={`flex shrink-0 items-center ${className}`}
    >
      <Image
        src="/youssef-logo.png"
        alt="Youssef Production"
        width={900}
        height={218}
        preload={preload}
        sizes="(max-width: 640px) 40vw, 220px"
        className="h-auto w-auto max-w-[150px] object-contain sm:max-w-[210px]"
      />
    </Link>
  );
}
