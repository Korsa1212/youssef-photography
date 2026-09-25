"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { revalidateNow } from "@/lib/revalidate";
import type { Faq } from "@/lib/supabase/queries";

export default function FaqManager() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase
      .from("faqs")
      .select("*")
      .order("position", { ascending: true })
      .then(({ data }) => {
        if (!active) return;
        setFaqs((data ?? []) as Faq[]);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function addFaq(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    const supabase = createClient();
    const { error } = await supabase.from("faqs").insert({
      question: question.trim(),
      answer: answer.trim(),
      position: faqs.length,
    });
    if (error) {
      alert(error.message);
      return;
    }
    setQuestion("");
    setAnswer("");
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .order("position", { ascending: true });
    setFaqs((data ?? []) as Faq[]);
    revalidateNow();
  }

  async function deleteFaq(faq: Faq) {
    if (!confirm(`Supprimer la question « ${faq.question} » ?`)) return;
    const supabase = createClient();
    await supabase.from("faqs").delete().eq("id", faq.id);
    setFaqs((f) => f.filter((x) => x.id !== faq.id));
    revalidateNow();
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={addFaq}
        className="rounded-2xl border border-zinc-100 bg-white p-6"
      >
        <h2 className="font-medium text-zinc-900">Nouvelle question</h2>
        <div className="mt-4 space-y-4">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Question (ex: Quel est le tarif d'un shooting ?)"
            required
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-colors focus:border-zinc-400"
          />
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Réponse"
            rows={3}
            required
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-colors focus:border-zinc-400"
          />
          <button
            type="submit"
            className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm text-white transition-colors hover:bg-zinc-700"
          >
            Ajouter la question
          </button>
        </div>
      </form>

      <div>
        <h2 className="mb-4 font-medium text-zinc-900">FAQ ({faqs.length})</h2>
        {loading ? (
          <p className="text-sm text-zinc-400">Chargement...</p>
        ) : faqs.length === 0 ? (
          <p className="rounded-2xl border border-zinc-100 bg-white p-8 text-center text-sm text-zinc-400">
            Aucune question ajoutée.
          </p>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-zinc-100 bg-white p-5"
              >
                <div className="min-w-0">
                  <p className="font-medium text-zinc-900">{faq.question}</p>
                  <p className="mt-1 text-sm text-zinc-500">{faq.answer}</p>
                </div>
                <button
                  onClick={() => deleteFaq(faq)}
                  className="shrink-0 rounded-full border border-red-100 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}