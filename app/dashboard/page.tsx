import Nav from "@/components/Nav";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

type Analysis = {
  id: string;
  brand: string | null;
  score: number | null;
  confidence: string | null;
  summary: string | null;
  photo_count: number;
  created_at: string;
};

async function getAnalyses(userId: string): Promise<Analysis[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("analyses")
    .select(
      "id, brand, score, confidence, summary, photo_count, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
console.log("DASHBOARD ANALYSES TROUVEES :", data?.length);
  
if (error) {
    console.error("SUPABASE DASHBOARD ERROR :", error);
    return [];
  }

  return data ?? [];
}

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();

const {
  data: { user },
} = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const analyses = await getAnalyses(user.id);

  const now = new Date();

  const analysesThisMonth = analyses.filter((analysis) => {
    const date = new Date(analysis.created_at);

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  const remaining = Math.max(30 - analysesThisMonth, 0);

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function getConfidenceLabel(confidence: string | null) {
    if (confidence === "high") return "Confiance élevée";
    if (confidence === "medium") return "Confiance moyenne";
    if (confidence === "low") return "À vérifier";

    return "À vérifier";
  }

  return (
    <>
      <Nav />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-32">

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold text-indigo-300">
              DASHBOARD
            </p>

            <h1 className="mt-3 text-4xl font-black md:text-5xl">
              Votre espace Authenticheck.
            </h1>

            <p className="mt-3 max-w-2xl text-white/50">
              Retrouvez vos analyses, votre abonnement et lancez rapidement
              une nouvelle vérification.
            </p>
          </div>

          <Link
            href="/analyze"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-black transition hover:bg-white/90"
          >
            + Nouvelle analyse
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <div className="glass rounded-3xl p-6">
            <p className="text-sm text-white/45">
              Analyses restantes
            </p>

            <p className="mt-3 text-4xl font-black">
              {remaining}
            </p>

            <p className="mt-2 text-xs text-white/35">
              sur 30 analyses ce mois-ci
            </p>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width: `${Math.min(
                    (analysesThisMonth / 30) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <p className="text-sm text-white/45">
              Analyses réalisées
            </p>

            <p className="mt-3 text-4xl font-black">
              {analysesThisMonth}
            </p>

            <p className="mt-2 text-xs text-white/35">
              depuis le début du mois
            </p>
          </div>

          <div className="glass rounded-3xl p-6">
            <p className="text-sm text-white/45">
              Abonnement actuel
            </p>

            <p className="mt-3 text-3xl font-black">
              Pro
            </p>

            <p className="mt-2 text-xs text-white/35">
              19,99 € / mois
            </p>

            <Link
              href="/pricing"
              className="mt-4 inline-block text-xs font-bold text-indigo-300 hover:text-indigo-200"
            >
              Voir les offres →
            </Link>
          </div>

        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">

          <Link
            href="/analyze"
            className="glass rounded-3xl p-7 transition hover:border-white/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl text-black">
              +
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Analyser un nouvel article
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Ajoutez les photos d&apos;un article et obtenez une estimation
              de son niveau d&apos;authenticité.
            </p>

            <p className="mt-5 text-sm font-bold text-indigo-300">
              Commencer une analyse →
            </p>
          </Link>

          <Link
            href="/pricing"
            className="glass rounded-3xl p-7 transition hover:border-white/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-400/15 text-xl text-indigo-300">
              ★
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Votre abonnement Pro
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Vous disposez de 30 analyses par mois avec une analyse
              prioritaire et un historique complet.
            </p>

            <p className="mt-5 text-sm font-bold text-indigo-300">
              Gérer mon offre →
            </p>
          </Link>

        </div>

        <div className="mt-10">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white/40">
                HISTORIQUE
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Dernières analyses
              </h2>
            </div>

            <Link
              href="/analyze"
              className="text-sm font-bold text-indigo-300 hover:text-indigo-200"
            >
              Nouvelle analyse →
            </Link>
          </div>

          <div className="mt-5 space-y-3">

            {analyses.length === 0 ? (

              <div className="glass rounded-2xl p-8 text-center">
                <p className="font-bold">
                  Aucune analyse enregistrée
                </p>

                <p className="mt-2 text-sm text-white/40">
                  Lancez votre première analyse pour la retrouver ici.
                </p>

                <Link
                  href="/analyze"
                  className="mt-5 inline-block rounded-xl bg-white px-5 py-3 text-sm font-bold text-black"
                >
                  Commencer une analyse
                </Link>
              </div>

            ) : (

              analyses.map((analysis) => (

                <div
                  key={analysis.id}
                  className="glass flex flex-col gap-4 rounded-2xl p-5 md:flex-row md:items-center md:justify-between"
                >

                  <div>
                    <p className="font-bold">
                      {analysis.brand
                        ? `Article ${analysis.brand}`
                        : "Article sans marque"}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {formatDate(analysis.created_at)}
                      {" · "}
                      {analysis.photo_count} photo(s)
                    </p>
                  </div>

                  <div className="flex items-center gap-5">

                    <div className="text-right">
                      <p className="font-black">
                        {analysis.score ?? "--"} %
                      </p>

                      <p className="text-xs text-white/35">
                        {getConfidenceLabel(analysis.confidence)}
                      </p>
                    </div>

                    <Link
                      href={`/analysis/${analysis.id}`}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50 transition hover:border-white/20 hover:text-white"
                    >
                      Voir
                    </Link>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[.03] p-6">

          <p className="text-sm font-bold">
            À propos des résultats
          </p>

          <p className="mt-2 max-w-3xl text-xs leading-5 text-white/35">
            Les résultats affichés par Authenticheck sont des estimations
            basées sur les informations et photos disponibles. Ils ne
            constituent pas une garantie absolue d&apos;authenticité.
          </p>

        </div>

      </main>
    </>
  );
}