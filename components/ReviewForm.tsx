"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function ReviewForm({ workId }: { workId: string }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [hovered, setHovered] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
    const { error } = await supabase.from("reviews").insert({
      work_id: workId,
      name: name.trim() || "Anonyme",
      rating,
      feedback: feedback.trim(),
    });
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-8 text-center">
        <p className="text-lg font-medium text-emerald-800">
          Merci pour votre avis !
        </p>
        <p className="mt-1.5 text-base text-emerald-700">
          Il sera publié sur le site après validation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-wrap gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            className="p-1"
            aria-label={`${i} étoile${i > 1 ? "s" : ""}`}
          >
            <svg
              viewBox="0 0 20 20"
              className={`h-8 w-8 transition-colors ${
                (hovered || rating) >= i ? "fill-amber-400" : "fill-zinc-200"
              }`}
            >
              <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
            </svg>
          </button>
        ))}
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Votre nom"
        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-base outline-none transition-colors focus:border-zinc-400"
      />
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Votre avis sur ce travail (facultatif)"
        rows={3}
        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-base outline-none transition-colors focus:border-zinc-400"
      />
      {status === "error" && (
        <p className="text-sm text-red-600">
          Une erreur est survenue. Veuillez réessayer.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-zinc-900 px-7 py-3 text-base text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {status === "loading" ? "Envoi..." : "Envoyer mon avis"}
      </button>
    </form>
  );
}