"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";

type AnalysisData = {
  score: number;
  confidence: "high" | "medium" | "low";
  summary: string;
  flags: string[];
};

export default function Analyze() {
  const [files, setFiles] = useState<File[]>([]);
  const [brand, setBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);

  // le reste de ton code continue ici...

  function handleFiles(selectedFiles: FileList | null) {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles).filter((file) =>
      file.type.startsWith("image/")
    );

    setFiles((current) => [...current, ...newFiles]);
    setResult(null);
  }

  function removeFile(indexToRemove: number) {
    setFiles((current) =>
      current.filter((_, index) => index !== indexToRemove)
    );

    setResult(null);
  }

  async function runAnalysis() {
    if (files.length === 0) return;

    setLoading(true);
    setResult(null);
    setAnalysisStep(0);

    const timers = [
      setTimeout(() => setAnalysisStep(1), 900),
      setTimeout(() => setAnalysisStep(2), 1800),
      setTimeout(() => setAnalysisStep(3), 2800),
      setTimeout(() => setAnalysisStep(4), 3900),
    ];

    try {
	const formData = new FormData();
	
	formData.append("brand", brand);
      
	files.forEach((file) => {
        formData.append("photos", file);
      });

      console.log("AUTHENTICHECK : appel API lancé");

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("L'analyse a échoué.");
      }

      const data: AnalysisData = await response.json();

      console.log("AUTHENTICHECK : résultat API", data);

      timers.forEach(clearTimeout);

      setAnalysisStep(4);

      setTimeout(() => {
        setLoading(false);
        setResult(data);
      }, 700);
    } catch (error) {
      timers.forEach(clearTimeout);

      console.error("Erreur API :", error);

      setLoading(false);
      setResult(null);
    }
  }

  return (
    <>
      <Nav />

      <main className="mx-auto max-w-5xl px-5 pb-24 pt-32">
        <Link
          href="/dashboard"
          className="text-sm text-white/45 transition hover:text-white"
        >
          ← Retour au Dashboard
        </Link>

        <h1 className="mt-6 text-4xl font-black">
          Analyser un article
        </h1>

        <p className="mt-2 text-white/50">
          Ajoutez plusieurs photos pour améliorer la qualité de l'analyse.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">

          {/* FORMULAIRE */}
          <div className="glass rounded-3xl p-6">

            <label className="text-sm font-bold">
              Marque
            </label>

            <input
              type="text"
              placeholder="Ex. Nike"
              value={brand}
onChange={(event) => setBrand(event.target.value)}
className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-indigo-400"
            />

            <label className="mt-5 block text-sm font-bold">
              Photos
            </label>

            <label className="mt-2 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[.03] text-center transition hover:bg-white/[.05]"
            >
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  handleFiles(event.target.files)
                }
              />

              <span className="text-3xl">
                ＋
              </span>

              <span className="mt-3 font-bold">
                Ajouter des photos
              </span>

              <span className="mt-1 text-xs text-white/40">
                Logo, étiquette, coutures, référence...
              </span>
            </label>

            {files.length > 0 && (
              <div className="mt-5">

                <div className="mb-3 flex items-center justify-between">

                  <p className="text-sm font-bold">
                    Photos sélectionnées
                  </p>

                  <p className="text-xs text-white/40">
                    {files.length} photo(s)
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                  {files.map((file, index) => (
                    <PhotoPreview
                      key={`${file.name}-${index}`}
                      file={file}
                      index={index}
                      onRemove={() => removeFile(index)}
                    />
                  ))}

                </div>

              </div>
            )}

            <p className="mt-4 text-xs text-white/40">
              {files.length} photo(s) sélectionnée(s)
            </p>

            <button
              type="button"
              disabled={loading || files.length === 0}
              onClick={runAnalysis}
              className="mt-5 w-full rounded-xl bg-white py-3 font-bold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {loading
                ? "Analyse en cours..."
                : "Lancer l'analyse"}
            </button>

          </div>

          {/* PANNEAU DE DROITE */}
          <div>

            {loading ? (

              <AnalysisLoading
                step={analysisStep}
              />

            ) : result ? (

              <AnalysisResult
                photoCount={files.length}
                result={result}
              />

            ) : (

              <div className="glass flex min-h-full items-center justify-center rounded-3xl p-10 text-center">

                <div>

                  <div className="text-4xl">
                    ✦
                  </div>

                  <h2 className="mt-4 text-xl font-bold">
                    Votre résultat apparaîtra ici
                  </h2>

                  <p className="mt-2 text-sm text-white/35">
                    Ajoutez vos photos puis lancez l'analyse.
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>
      </main>
    </>
  );
}


/* =========================
   APERÇU PHOTO
========================= */

function PhotoPreview({
  file,
  index,
  onRemove,
}: {
  file: File;
  index: number;
  onRemove: () => void;
}) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);

    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.03]">

      {preview && (
        <img
          src={preview}
          alt={`Photo ${index + 1}`}
          className="aspect-square w-full object-cover"
        />
      )}

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-sm font-bold text-white opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-red-500"
        aria-label={`Supprimer la photo ${index + 1}`}
      >
        ×
      </button>

      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1.5 text-xs text-white/70 backdrop-blur">
        Photo {index + 1}
      </div>

    </div>
  );
}


/* =========================
   CHARGEMENT
========================= */

function AnalysisLoading({
  step,
}: {
  step: number;
}) {
  return (
    <div className="glass rounded-3xl p-8">

      <div className="text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[.04]">

          <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />

        </div>

        <h2 className="mt-6 text-2xl font-black">
          Analyse en cours
        </h2>

        <p className="mt-2 text-sm text-white/45">
          Authenticheck examine les éléments visibles de votre article.
        </p>

      </div>

      <div className="mt-8 space-y-4">

        <AnalysisStep
          number="01"
          title="Vérification des images"
          active={step >= 1}
          current={step === 0}
        />

        <AnalysisStep
          number="02"
          title="Analyse des détails"
          active={step >= 2}
          current={step === 1}
        />

        <AnalysisStep
          number="03"
          title="Comparaison des caractéristiques"
          active={step >= 3}
          current={step === 2}
        />

        <AnalysisStep
          number="04"
          title="Évaluation du niveau de confiance"
          active={step >= 4}
          current={step === 3}
        />

      </div>

      <p className="mt-8 text-center text-xs leading-5 text-white/30">
        L'analyse automatisée fournit une estimation basée sur les
        informations disponibles. Elle ne constitue pas une garantie
        absolue d'authenticité.
      </p>

    </div>
  );
}


/* =========================
   ÉTAPE D'ANALYSE
========================= */

function AnalysisStep({
  number,
  title,
  active,
  current,
}: {
  number: string;
  title: string;
  active: boolean;
  current: boolean;
}) {
  return (
    <div className="flex items-center gap-4">

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xs font-bold transition ${
          active
            ? "border-white/20 bg-white text-black"
            : "border-white/10 bg-white/[.03] text-white/30"
        }`}
      >
        {active ? "✓" : number}
      </div>

      <div className="flex-1">

        <p
          className={`text-sm font-bold ${
            active
              ? "text-white"
              : "text-white/40"
          }`}
        >
          {title}
        </p>

        {current && (
          <p className="mt-1 text-xs text-white/30">
            En cours...
          </p>
        )}

      </div>

      {current && (
        <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
      )}

    </div>
  );
}


/* =========================
   RÉSULTAT
========================= */

function AnalysisResult({
  photoCount,
  result,
}: {
  photoCount: number;
  result: AnalysisData;
}) {
  const confidenceLabel =
    result.confidence === "high"
      ? "Élevé"
      : result.confidence === "medium"
      ? "Moyen"
      : "Faible";

  return (
    <div className="glass rounded-3xl p-7">

      <p className="text-sm text-white/45">
        Indice d'authenticité estimé
      </p>

      <div className="mt-2 flex items-end gap-2">

        <span className="text-6xl font-black">
          {result.score}
        </span>

        <span className="mb-2 text-2xl font-bold text-white/40">
          %
        </span>

      </div>

      <p className="mt-2 text-sm text-white/45">
        Niveau de confiance : {confidenceLabel}
      </p>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">

        <div
          className="h-full rounded-full bg-white transition-all duration-700"
          style={{
            width: `${Math.min(
              Math.max(result.score, 0),
              100
            )}%`,
          }}
        />

      </div>

      <div className="mt-7">

        <p className="text-sm leading-6 text-white/65">
          {result.summary}
        </p>

      </div>

      {result.flags.length > 0 && (
        <div className="mt-6 space-y-3">

          {result.flags.map((flag, index) => (
            <p
              key={`${flag}-${index}`}
              className="flex gap-3 text-sm"
            >
              <span className="text-indigo-300">
                ✓
              </span>

              <span>
                {flag}
              </span>

            </p>
          ))}

        </div>
      )}

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[.03] p-4">

        <p className="text-xs leading-5 text-white/45">
          Analyse réalisée à partir de {photoCount} photo(s).
          Cette analyse constitue une estimation basée sur les
          informations disponibles. Elle ne constitue pas une garantie
          absolue d'authenticité et ne remplace pas systématiquement
          l'expertise d'un authentificateur humain.
        </p>

      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-xl border border-white/10 py-3 font-bold transition hover:bg-white/[.05]"
      >
        Générer un rapport
      </button>

    </div>
  );
}