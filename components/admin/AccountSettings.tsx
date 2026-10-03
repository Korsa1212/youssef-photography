"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/25 outline-none transition-all duration-200 focus:border-amber-400/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-amber-400/20";

export default function AccountSettings({ userEmail }: { userEmail?: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les deux nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("Le nouveau mot de passe doit être différent de l'ancien.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail ?? "",
      password: currentPassword,
    });
    if (signInError) {
      setError("Mot de passe actuel incorrect.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess("Mot de passe mis à jour avec succès.");
  }

  return (
    <div className="max-w-lg space-y-6">
      {/* Profile card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 text-xl font-semibold text-zinc-900">
            {(userEmail?.charAt(0) || "A").toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              {userEmail ?? "Administrateur"}
            </p>
            <p className="text-sm text-white/40">Administrateur du site</p>
          </div>
        </div>
      </div>

      {/* Password form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm"
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            Changer le mot de passe
          </h2>
          <p className="mt-1 text-sm text-white/40">
            Utilisez un mot de passe fort d&apos;au moins 8 caractères.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-2 block text-sm font-medium text-white/60"
            >
              Mot de passe actuel
            </label>
            <input
              id="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-medium text-white/60"
            >
              Nouveau mot de passe
            </label>
            <input
              id="newPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-white/25">
              8 caractères minimum.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-white/60"
            >
              Confirmer le nouveau mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 shrink-0 text-red-400">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 shrink-0 text-emerald-400">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p className="text-sm text-emerald-300">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3.5 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:from-amber-300 hover:to-amber-400 hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                </svg>
                Mise à jour...
              </span>
            ) : (
              "Mettre à jour le mot de passe"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
