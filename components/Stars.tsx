export default function Stars({
  rating,
  className = "",
}: {
  rating: number;
  className?: string;
}) {
  const rounded = Math.round(rating);
  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      aria-label={`${rating} sur 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${
            i <= rounded ? "fill-amber-400" : "fill-zinc-200"
          }`}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}