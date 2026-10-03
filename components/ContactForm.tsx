"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Must match MIN_SECONDS_ON_PAGE in `app/api/contact/route.ts`. */
const MIN_SECONDS_ON_PAGE = 3;

type Status = "idle" | "sending" | "sent" | "error";

type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "event_date" | "message", "required" | "invalid">
>;

export default function ContactForm() {
  const t = useTranslations("contact");
  const tc = useTranslations("contact");
  const locale = useLocale();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  const openedAt = useRef(0);
  // One message per session per browser: a refresh must not let a visitor
  // (or a bot that kept the tab open) fire the form again and again.
  const sentKey = "yp:contact";

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = "required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      next.email = email.trim() ? "invalid" : "required";
    if (phone.trim().length < 6) next.phone = "required";
    else if (!/^[\d\s+().-]{6,32}$/.test(phone.trim())) next.phone = "invalid";
    if (message.trim().length < 10) next.message = "required";
    else if (message.trim().length > 4000) next.message = "invalid";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;

    // Honeypot: only an automated bot fills this invisible field.
    if (trap) {
      setStatus("sent");
      return;
    }

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: trap,
          openedAt: openedAt.current,
          locale,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          event_type: eventType || null,
          event_date: eventDate || null,
          location: location.trim() || null,
          message: message.trim(),
        }),
      });

      // 422 means the server rejected a field; surface which one.
      if (res.status === 422) {
        const data = (await res.json().catch(() => null)) as {
          field?: keyof FieldErrors;
          reason?: "required" | "invalid";
        } | null;
        setErrors(data?.field && data.reason ? { [data.field]: data.reason } : {});
        setStatus("idle");
        return;
      }

      if (!res.ok) {
        setStatus("error");
        return;
      }

      window.sessionStorage.setItem(sentKey, "1");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-8 text-center">
        <p className="font-display text-2xl font-semibold text-emerald-900">
          {t("successTitle")}
        </p>
        <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-emerald-800">
          {t("successBody")}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-emerald-900 underline underline-offset-4"
          >
            {t("successCta")}
          </Link>
          <button
            type="button"
            onClick={() => {
              setMessage("");
              setStatus("idle");
            }}
            className="rounded-lg border border-emerald-300 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-emerald-900 transition-colors hover:bg-white"
          >
            {locale === "en" ? "Send another message" : "Envoyer un autre message"}
          </button>
        </div>
      </div>
    );
  }

  const fieldError = (key: keyof FieldErrors) => {
    const reason = errors[key];
    if (!reason) return null;
    return (
      <p
        id={`${key}-error`}
        className="mt-1.5 text-sm text-red-600"
        role="alert"
      >
        {tc(`error.${key}.${reason}`)}
      </p>
    );
  };

  const labelClass = "block text-sm font-medium text-zinc-900";
  const inputClass =
    "w-full rounded-xl border bg-white px-4 py-3 text-base outline-none transition-colors placeholder:text-zinc-300 focus:border-zinc-400";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot — offscreen and hidden from assistive tech, so only a bot
          that fills every input it finds will trip it. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            {t("name")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`mt-2 ${inputClass} ${
              errors.name ? "border-red-300" : "border-zinc-200"
            }`}
          />
          {fieldError("name")}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`mt-2 ${inputClass} ${
              errors.email ? "border-red-300" : "border-zinc-200"
            }`}
          />
          {fieldError("email")}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            {t("phone")}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder={t("phonePlaceholder")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={`mt-2 ${inputClass} ${
              errors.phone ? "border-red-300" : "border-zinc-200"
            }`}
          />
          {fieldError("phone")}
        </div>

        <div>
          <label htmlFor="eventType" className={labelClass}>
            {t("eventType")}{" "}
            <span className="font-normal text-zinc-400">
              ({t("optional")})
            </span>
          </label>
          <select
            id="eventType"
            name="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className={`mt-2 ${inputClass} border-zinc-200 text-zinc-900`}
          >
            <option value="">{t("eventTypePlaceholder")}</option>
            <option value="mariage">{t("eventTypes.wedding")}</option>
            <option value="fiançailles">{t("eventTypes.engagement")}</option>
            <option value="evenement">{t("eventTypes.event")}</option>
            <option value="autre">{t("eventTypes.other")}</option>
          </select>
        </div>

        <div>
          <label htmlFor="eventDate" className={labelClass}>
            {t("eventDate")}{" "}
            <span className="font-normal text-zinc-400">
              ({t("eventDateHint")})
            </span>
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            aria-invalid={errors.event_date ? true : undefined}
            aria-describedby={errors.event_date ? "event_date-error" : undefined}
            className={`mt-2 ${inputClass} ${
              errors.event_date ? "border-red-300" : "border-zinc-200"
            }`}
          />
          {fieldError("event_date")}
        </div>

        <div>
          <label htmlFor="location" className={labelClass}>
            {t("location")}{" "}
            <span className="font-normal text-zinc-400">
              ({t("optional")})
            </span>
          </label>
          <input
            id="location"
            name="location"
            type="text"
            autoComplete="address-level2"
            placeholder={t("locationPlaceholder")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`mt-2 ${inputClass} border-zinc-200`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={4000}
          placeholder={t("messagePlaceholder")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={
            errors.message ? "message-error" : "message-count"
          }
          className={`mt-2 resize-y ${inputClass} ${
            errors.message ? "border-red-300" : "border-zinc-200"
          }`}
        />
        <div className="mt-1.5 flex justify-between">
          {fieldError("message") ?? (
            <span id="message-count" className="text-xs text-zinc-400">
              {message.length}/4000
            </span>
          )}
        </div>
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 p-5 text-center"
        >
          <p className="font-medium text-red-800">{t("errorTitle")}</p>
          <p className="mt-1 text-sm text-red-700">{t("errorBody")}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? t("sending") : t("submit")}
        </button>
        <p className="text-xs text-zinc-400">{t("privacyNote")}</p>
      </div>
    </form>
  );
}