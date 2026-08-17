
type DetailedResultProps = {
  score: number;
  photoCount: number;
};

export default function DetailedResult({
  score,
  photoCount,
}: DetailedResultProps) {
  const confidence =
    score >= 85
      ? "Élevé"
      : score >= 65
        ? "Modéré"
        : "Faible";

  return (
    <div className="space-y-5">
      {/* SCORE */}
      <div className="glass rounded-3xl p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm text-white/45">
              Indice d'authenticité estimé
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-6xl font-black tracking-tight">
                {score}
              </span>

              <span className="mb-2 text-2xl font-bold text-white/40">
                %
              </span>
            </div>

            <p className="mt-2 text-sm text-white/45">
              Analyse basée sur les éléments visibles fournis.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-right">
            <p className="text-xs text-white/40">
              Confiance
            </p>

            <p className="mt-1 font-bold">
              {confidence}
            </p>
          </div>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* ÉLÉMENTS COHÉRENTS */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
            ✓
          </div>

          <div>
            <h2 className="font-bold">
              Éléments cohérents
            </h2>

            <p className="text-xs text-white/40">
              Points compatibles avec les caractéristiques attendues
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <ResultItem text="Logo et placement visuel cohérents" />
          <ResultItem text="Typographie globalement cohérente" />
          <ResultItem text="Finitions visibles compatibles" />
        </div>
      </div>

      {/* POINTS À VÉRIFIER */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/10 text-amber-300">
            !
          </div>

          <div>
            <h2 className="font-bold">
              Points à vérifier
            </h2>

            <p className="text-xs text-white/40">
              Informations pouvant améliorer l'analyse
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <ResultItem text="Référence secondaire non visible" warning />
          <ResultItem text="Photo du packaging recommandée" warning />
          <ResultItem text="Étiquette intérieure à photographier" warning />
        </div>
      </div>

      {/* PHOTOS */}
      <div className="glass rounded-3xl p-6">
        <h2 className="font-bold">
          Photos analysées
        </h2>

        <p className="mt-1 text-sm text-white/40">
          {photoCount} photo(s) prise(s) en compte dans cette analyse.
        </p>
      </div>

      {/* AVERTISSEMENT */}
      <div className="rounded-3xl border border-amber-400/10 bg-amber-400/[.04] p-6">
        <h2 className="font-bold text-amber-200">
          À propos de ce résultat
        </h2>

        <p className="mt-3 text-sm leading-6 text-white/50">
          Cet indice est une estimation basée sur les images et informations
          fournies. Il ne constitue pas une garantie absolue d'authenticité
          et ne remplace pas systématiquement l'expertise d'un authentificateur
          humain.
        </p>
      </div>

      <button className="w-full rounded-xl bg-white py-3 font-bold text-black transition hover:bg-white/90">
        Générer le rapport
      </button>
    </div>
  );
}

function ResultItem({
  text,
  warning = false,
}: {
  text: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.02] px-4 py-3">
      <span
        className={
          warning
            ? "text-amber-300"
            : "text-emerald-300"
        }
      >
        {warning ? "!" : "✓"}
      </span>

      <span className="text-sm text-white/70">
        {text}
      </span>
    </div>
  );
}
