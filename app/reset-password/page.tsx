"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setReady(true);
      } else {
        setError(
          "Le lien de réinitialisation est invalide ou a expiré."
        );
      }
    }

    checkSession();
  }, []);

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError(
        "Le mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Les deux mots de passe ne correspondent pas."
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Votre mot de passe a été modifié avec succès."
    );

    setPassword("");
    setConfirmPassword("");
    setLoading(false);
  }

  return (
    <main className="min-h-screen px-5 py-20">
      <div className="mx-auto max-w-md">

        <Link
          href="/login"
          className="text-sm text-white/45 hover:text-white"
        >
          ← Retour à la connexion
        </Link>

        <div className="glass mt-8 rounded-3xl p-8">

          <p className="text-sm font-bold text-indigo-300">
            NOUVEAU MOT DE PASSE
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Réinitialiser votre mot de passe
          </h1>

          {!ready && !error && (
            <p className="mt-6 text-sm text-white/40">
              Vérification du lien...
            </p>
          )}

          {ready && (
            <form
              onSubmit={handleReset}
              className="mt-8 space-y-5"
            >
              <div>
                <label className="text-sm font-bold">
                  Nouveau mot de passe
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  minLength={6}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 outline-none transition focus:border-white/25"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="text-sm font-bold">
                  Confirmer le mot de passe
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                  minLength={6}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 outline-none transition focus:border-white/25"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-300">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-white px-5 py-3 font-bold text-black transition hover:bg-white/90 disabled:opacity-50"
              >
                {loading
                  ? "Modification..."
                  : "Modifier le mot de passe"}
              </button>
            </form>
          )}

          {error && !ready && (
            <Link
              href="/forgot-password"
              className="mt-6 inline-block text-sm font-bold text-indigo-300 hover:text-indigo-200"
            >
              Demander un nouveau lien
            </Link>
          )}

        </div>

      </div>
    </main>
  );
}