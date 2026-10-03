"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PHONE_E164 } from "@/lib/seo";
import type { ContactMessage } from "@/lib/supabase/contact";

type Filter = "all" | "unread" | "handled";

const EVENT_LABELS: Record<string, string> = {
  mariage: "Mariage",
  fiançailles: "Fiançailles",
  evenement: "Événement",
  autre: "Autre",
};

const FIELDS =
  "id, name, email, phone, event_type, event_date, location, message, locale, status, handled_at, created_at";

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatWhen(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d);
}

function whatsappLink(phone: string, text: string) {
  const digits = phone.replace(/[^\d]/g, "");
  const target = digits.startsWith("00") ? digits.slice(2) : digits;
  return `https://wa.me/${target}?text=${encodeURIComponent(text)}`;
}

function whatsappNumber(message: ContactMessage) {
  const digits = message.phone.replace(/[^\d]/g, "");
  const normalised = digits.startsWith("00") ? digits.slice(2) : digits;
  if (normalised.length < 10) return PHONE_E164.replace(/[^\d]/g, "");
  return normalised;
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("unread");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async (showLoading = false) => {
    if (showLoading) setRefreshing(true);
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from("contact_messages")
        .select(FIELDS)
        .order("created_at", { ascending: false });

      if (err) {
        setError(err.message);
      } else {
        setError(null);
        setMessages((data ?? []) as ContactMessage[]);
        const now = new Date();
        setLastUpdated(
          now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        );
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de connexion");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();

    // Supabase Realtime subscription for instant new messages
    const supabase = createClient();
    const channel = supabase
      .channel("contact_messages_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        () => {
          fetchMessages(false);
        }
      )
      .subscribe();

    // Fallback polling every 20s
    const pollInterval = setInterval(() => {
      fetchMessages(false);
    }, 20000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [fetchMessages]);

  async function setStatus(id: string, status: ContactMessage["status"]) {
    setBusyId(id);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("contact_messages")
      .update({
        status,
        handled_at: status === "handled" ? new Date().toISOString() : null,
      })
      .eq("id", id);
    if (err) {
      setError(err.message);
    } else {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    }
    setBusyId(null);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce message ? Cette action est définitive.")) return;
    setBusyId(id);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);
    if (err) {
      setError(err.message);
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
    setBusyId(null);
  }

  const unreadCount = useMemo(
    () => messages.filter((m) => m.status === "unread").length,
    [messages]
  );

  const filtered = useMemo(() => {
    let list = filter === "all" ? messages : messages.filter((m) => m.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.phone.toLowerCase().includes(q) ||
          (m.location && m.location.toLowerCase().includes(q)) ||
          m.message.toLowerCase().includes(q)
      );
    }
    return list;
  }, [messages, filter, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
          </svg>
          <p className="text-xs text-white/40">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-amber-300">
                Impossible de lire les messages.
              </p>
              <p className="mt-1 text-sm text-amber-200/70">{error}</p>
              <p className="mt-2 text-xs text-amber-200/60">
                Assurez-vous que le fichier{" "}
                <code className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-300">
                  supabase/003-contact.sql
                </code>{" "}
                a été exécuté dans l&apos;éditeur SQL Supabase.
              </p>
            </div>
            <button
              onClick={() => fetchMessages(true)}
              className="shrink-0 rounded-lg bg-amber-400/20 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-400/30"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* Control bar: Filters + Search + Refresh */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              ["unread", `Nouveaux${unreadCount ? ` (${unreadCount})` : ""}`],
              ["handled", "Traités"],
              ["all", `Tous (${messages.length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
                filter === key
                  ? "bg-amber-400 text-zinc-950 font-semibold shadow-sm shadow-amber-500/20"
                  : "border border-white/10 text-white/50 hover:border-white/20 hover:text-white/80"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search + Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:w-56">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30 outline-none transition-colors focus:border-amber-400/40 focus:bg-white/[0.08]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => fetchMessages(true)}
            disabled={refreshing}
            title={lastUpdated ? `Dernière mise à jour : ${lastUpdated}` : "Rafraîchir"}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-amber-400" : ""}`}
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            <span className="hidden sm:inline">Rafraîchir</span>
          </button>
        </div>
      </div>

      {!error && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mx-auto h-10 w-10 text-white/15"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p className="mt-3 text-sm text-white/40">
            {search
              ? "Aucun résultat pour cette recherche."
              : filter === "unread"
              ? "Aucun nouveau message."
              : filter === "handled"
              ? "Aucun message traité."
              : "Aucun message pour l'instant."}
          </p>
        </div>
      )}

      {/* Messages list */}
      <div className="space-y-3.5">
        {filtered.map((m) => {
          const isUnread = m.status === "unread";
          const open = expanded === m.id;
          const intro = `Bonjour ${m.name},`;
          const waText = `${intro}\n\nVous m'avez écrit depuis youssefproduction.com :\n"${m.message}"`;

          return (
            <article
              key={m.id}
              className={`rounded-2xl border p-4 transition-all duration-200 sm:p-5 ${
                isUnread
                  ? "border-amber-400/25 bg-amber-400/[0.04] shadow-sm shadow-amber-400/5"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-sm font-semibold text-zinc-900">
                      {(m.name.charAt(0) || "?").toUpperCase()}
                    </div>
                    <p className="font-medium text-white">{m.name}</p>
                    {isUnread && (
                      <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-950">
                        Nouveau
                      </span>
                    )}
                    {m.event_type && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/60">
                        {EVENT_LABELS[m.event_type] ?? m.event_type}
                      </span>
                    )}
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase text-white/30">
                      {m.locale}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-white/40">
                    {formatWhen(m.created_at)}
                    {m.location ? ` · ${m.location}` : ""}
                    {m.event_date ? ` · Date : ${formatWhen(m.event_date)}` : ""}
                  </p>
                </div>

                <button
                  onClick={() => setExpanded(open ? null : m.id)}
                  className="rounded-lg border border-white/10 px-3 py-1 text-xs font-medium text-white/50 transition-colors hover:border-white/20 hover:text-white"
                >
                  {open ? "Réduire" : "Détails"}
                </button>
              </div>

              <p
                className={`mt-3 text-sm leading-relaxed sm:text-[15px] ${
                  open ? "whitespace-pre-wrap text-white/80" : "line-clamp-2 text-white/60"
                }`}
              >
                {m.message}
              </p>

              {open && (
                <dl className="mt-4 grid gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4 text-xs sm:grid-cols-2 sm:text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-white/30">
                      E-mail
                    </dt>
                    <dd className="mt-0.5 break-all text-white/80">{m.email}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-white/30">
                      Téléphone
                    </dt>
                    <dd className="mt-0.5 text-white/80">{m.phone}</dd>
                  </div>
                </dl>
              )}

              {/* Action buttons with high-accessibility mobile touch targets */}
              <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                <a
                  href={whatsappLink(whatsappNumber(m), waText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-400"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent(
                    `${intro} votre demande`
                  )}&body=${encodeURIComponent(
                    `${intro}\n\nMerci pour votre message sur youssefproduction.com :\n"${m.message}"\n\nÀ bientôt,\nYoussef`
                  )}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
                >
                  E-mail
                </a>
                <a
                  href={`tel:${m.phone.replace(/[^\d+]/g, "")}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
                >
                  Appeler
                </a>

                <div className="flex-1" />

                <button
                  disabled={busyId === m.id}
                  onClick={() => setStatus(m.id, isUnread ? "handled" : "unread")}
                  className="rounded-xl border border-white/10 px-3.5 py-2 text-xs font-medium text-white/50 transition-colors hover:border-white/20 hover:text-white disabled:opacity-50"
                >
                  {isUnread ? "Marquer traité" : "Rouvrir"}
                </button>
                <button
                  disabled={busyId === m.id}
                  onClick={() => remove(m.id)}
                  className="rounded-xl px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                >
                  Supprimer
                </button>
              </div>

              {m.handled_at && !isUnread && (
                <p className="mt-2.5 text-[11px] text-white/25">
                  Traité le {formatWhen(m.handled_at)}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}