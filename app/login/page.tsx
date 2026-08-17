"use client";

import { FormEvent, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen px-5 py-20">
      <div className="mx-auto max-w-md">

        <Link
          href="/"
          className="text-sm text-white/45 hover:text-white"
        >
          ← Retour à Authenticheck
        </Link>

        <div className="glass mt-8 rounded-3xl p-8">

          <p className="text-sm font-bold text-indigo-300">
            AUTHENTIFICATION
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Se connecter
          </h1>

          <p className="mt-3 text-sm text-white/40">
            Connectez-vous à votre espace Authenticheck.
          </p>

          <form
            onSubmit={handleLogin}
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

            <div>
              <label className="text-sm font-bold">
                Mot de passe
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 outline-none transition focus:border-white/25"
                placeholder="••••••••"
              />
           
 <div className="mt-2 text-right">
  <Link
    href="/forgot-password"
    className="text-xs font-bold text-indigo-300 hover:text-indigo-200"
  >
    Mot de passe oublié ?
  </Link>
</div>
		</div>

            {message && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-5 py-3 font-bold text-black transition hover:bg-white/90 disabled:opacity-50"
            >
              {loading
                ? "Connexion..."
                : "Se connecter"}
            </button>

          </form>

        </div>

      </div>
    </main>
  );
}