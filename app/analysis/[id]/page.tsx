import Link from "next/link";
import Nav from "@/components/Nav";
import { createClient } from "@supabase/supabase-js";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function AnalysisPage({ params }: PageProps) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: analysis, error } = await supabase
    .from("analyses")
    .select(
  "id, brand, score, confidence, summary, flags, photo_count, photo_paths, created_at"
)
    .eq("id", params.id)
    .single();

  if (error || !analysis) {
    return (
      <>
        <Nav />

        <main className="mx-auto max-w-4xl px-5 pb-24 pt-32">
          <Link
            href="/dashboard"
            className="text-sm text-white/45 hover:text-white"
          >
            ← Retour au Dashboard
          </Link>

          <div className="glass mt-8 rounded-3xl p-10 text-center">
            <h1 className="text-2xl font-black">
              Analyse introuvable
            </h1>

            <p className="mt-3 text-white/40">
              Cette analyse n'existe pas ou n'est plus disponible.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />

      <main className="mx-auto max-w-4xl px-5 pb-24 pt-32">

        <Link
          href="/dashboard"
          className="text-sm text-white/45 transition hover:text-white"
        >
          ← Retour au Dashboard
        </Link>

        <div className="mt-8">
          <p className="text-sm font-bold text-indigo-300">
            RÉSULTAT DE L'ANALYSE
          </p>

          <h1 className="mt-3 text-4xl font-black">
            {analysis.brand
              ? `Article ${analysis.brand}`
              : "Article sans marque"}
          </h1>

          <p className="mt-2 text-sm text-white/40">
            {new Date(analysis.created_at).toLocaleString("fr-FR")}
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">

          <div className="glass rounded-3xl p-7">
            <p className="text-sm text-white/40">
              Score d'authenticité
            </p>

            <p className="mt-3 text-6xl font-black">
              {analysis.score}%
            </p>

            <p className="mt-3 text-sm text-white/50">
              Confiance :{" "}
              <span className="font-bold text-white">
                {analysis.confidence === "high"
                  ? "élevée"
                  : analysis.confidence === "medium"
                    ? "moyenne"
                    : "faible"}
              </span>
            </p>
          </div>

          <div className="glass rounded-3xl p-7">
            <p className="text-sm text-white/40">
              Photos analysées
            </p>

            <p className="mt-3 text-6xl font-black">
              {analysis.photo_count}
            </p>

            <p className="mt-3 text-sm text-white/40">
              photo(s)
            </p>
          </div>

        </div>

        <div className="glass mt-5 rounded-3xl p-7">
	{analysis.photo_paths?.length > 0 && (
  <div className="glass mt-5 rounded-3xl p-7">
    <p className="text-sm font-bold">
      Photos analysées
    </p>

    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {analysis.photo_paths.map(
        (path: string, index: number) => {
          const {
            data: { publicUrl },
          } = supabase.storage
            .from("analysis-photos")
            .getPublicUrl(path);

          return (
            <img
              key={path}
              src={publicUrl}
              alt={`Photo analysée ${index + 1}`}
              className="w-full rounded-2xl object-cover"
            />
          );
        }
      )}
    </div>
  </div>
)}
          <p className="text-sm font-bold">
            Résumé
          </p>

          <p className="mt-3 text-sm leading-7 text-white/50">
            {analysis.summary}
          </p>

        </div>

        {analysis.flags && analysis.flags.length > 0 && (
          <div className="glass mt-5 rounded-3xl p-7">

            <p className="text-sm font-bold">
              Points détectés
            </p>

            <div className="mt-4 space-y-3">
              {analysis.flags.map(
                (flag: string, index: number) => (
                  <div
                    key={index}
                    className="rounded-xl border border-white/10 bg-white/[.03] p-4 text-sm text-white/60"
                  >
                    {flag}
                  </div>
                )
              )}
            </div>

          </div>
        )}

      </main>
    </>
  );
}