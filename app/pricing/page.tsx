import Nav from "@/components/Nav";
import Link from "next/link";

const plans = [
  [
    "Starter",
    "5,99 €",
    "3 analyses / mois",
    ["Analyse photo", "Résultat sous 5 min", "Indice de confiance"],
  ],
  [
    "Pro",
    "19,99 €",
    "30 analyses / mois",
    [
      "Analyse prioritaire",
      "Résultat rapide",
      "Rapports numériques",
      "Historique complet",
    ],
  ],
  [
    "Premium",
    "39,99 €",
    "Volume élevé*",
    [
      "Priorité maximale",
      "Rapports avancés",
      "Dashboard pro",
      "Support prioritaire",
      "Seconde analyse des cas incertains",
    ],
  ],
];

export default function Pricing() {
  return (
    <>
      <Nav />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold text-indigo-300">TARIFS</p>

          <h1 className="mt-3 text-5xl font-black">
            Choisissez votre niveau.
          </h1>

          <p className="mt-4 text-white/50">
            Des offres simples pour les vendeurs occasionnels comme
            professionnels.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {plans.map((p, i) => (
            <div
              key={String(p[0])}
              className={`glass rounded-3xl p-7 ${
                i === 1
                  ? "border-indigo-400/40 shadow-glow"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{p[0]}</h2>

                {i === 1 && (
                  <span className="rounded-full bg-indigo-400/15 px-2 py-1 text-[10px] font-bold text-indigo-300">
                    POPULAIRE
                  </span>
                )}
              </div>

              <p className="mt-6 text-4xl font-black">
                {p[1]}
                <span className="text-sm text-white/35">/mois</span>
              </p>

              <p className="mt-2 text-sm text-white/45">
                {p[2]}
              </p>

              <ul className="mt-7 space-y-3 text-sm text-white/65">
                {(Array.isArray(p[3]) ? p[3] : [p[3]]).map((x) => (
                  <li key={x}>✓ {x}</li>
                ))}
              </ul>

              <Link
                href="/dashboard"
                className="mt-8 block rounded-xl bg-white py-3 text-center font-bold text-black"
              >
                Choisir {p[0]}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          * Les limites exactes de Premium peuvent être configurées selon
          les coûts d'infrastructure.
        </p>
      </main>
    </>
  );
}