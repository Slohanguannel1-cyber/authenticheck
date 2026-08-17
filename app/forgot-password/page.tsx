"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Si cette adresse possède un compte, un e-mail de réinitialisation a été envoyé."
    );

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
            RÉINITIALISATION
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Mot de passe oublié ?
          </h1>

          <p className="mt-3 text-sm text-white/40">
            Entrez votre adresse e-mail pour recevoir un lien de
            réinitialisation.
          </p>

          <form
            onSubmit={handleReset}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="text-sm font-bold">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 outline-none transition focus:border-white/25"
                placeholder="vous@example.com"
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
                ? "Envoi..."
                : "Envoyer le lien"}
            </button>
          </form>

        </div>

      </div>
    </main>
  );
}