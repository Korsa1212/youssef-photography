"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { revalidateNow } from "@/lib/revalidate";
import type { Faq } from "@/lib/supabase/queries";

function LangTabs({
  lang,
  setLang,
}: {
  lang: "fr" | "en";
  setLang: (l: "fr" | "en") => void;
}) {
  return (
    <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5">
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`rounded-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
            lang === l
              ? "bg-amber-400 text-zinc-950 shadow-sm"
              : "text-white/50 hover:text-white/80"
          }`}
        >
          {l === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
        </button>
      ))}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/25 outline-none transition-all duration-200 focus:border-amber-400/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-amber-400/20";

export default function FaqManager() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"fr" | "en">("fr");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionEn, setQuestionEn] = useState("");
  const [answerEn, setAnswerEn] = useState("");

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
      question_en: questionEn.trim() || null,
      answer_en: answerEn.trim() || null,
      position: faqs.length,
    });
    if (error) {
      alert(error.message);
      return;
    }
    setQuestion("");
    setAnswer("");
    setQuestionEn("");
    setAnswerEn("");
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
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Nouvelle question</h2>
          <LangTabs lang={lang} setLang={setLang} />
        </div>
        <form onSubmit={addFaq} className="space-y-4">
          {lang === "fr" ? (
            <>
              <input
                key="q-fr"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Question (ex: Quel est le tarif d'un shooting ?)"
                required
                className={inputClass}
              />
              <textarea
                key="a-fr"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Réponse en français"
                rows={3}
                required
                className={inputClass}
              />
            </>
          ) : (
            <>
              <input
                key="q-en"
                value={questionEn}
                onChange={(e) => setQuestionEn(e.target.value)}
                placeholder="Question in English (e.g. How much does a shoot cost?)"
                className={inputClass}
              />
              <textarea
                key="a-en"
                value={answerEn}
                onChange={(e) => setAnswerEn(e.target.value)}
                placeholder="Answer in English"
                rows={3}
                className={inputClass}
              />
            </>
          )}
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:from-amber-300 hover:to-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
          >
            Ajouter la question
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">FAQ ({faqs.length})</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="h-6 w-6 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
            </svg>
          </div>
        ) : faqs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-white/30">
            Aucune question ajoutée.
          </p>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-200 hover:border-white/15"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-xs font-bold text-amber-400">
                      Q
                    </span>
                    <p className="font-medium text-white">{faq.question}</p>
                  </div>
                  {faq.question_en && (
                    <p className="mt-1 ml-9 text-xs text-white/30">EN: {faq.question_en}</p>
                  )}
                  <p className="mt-2 ml-9 text-sm text-white/50">{faq.answer}</p>
                  {faq.answer_en && (
                    <p className="mt-1 ml-9 text-xs text-white/30">EN: {faq.answer_en}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteFaq(faq)}
                  className="shrink-0 rounded-lg border border-red-500/20 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
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