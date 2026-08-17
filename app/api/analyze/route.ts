import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // Vérifier que l'utilisateur est connecté
    const supabaseServer = await createSupabaseServerClient();

const {
  data: { user },
  error: userError,
} = await supabaseServer.auth.getUser();

if (userError || !user) {
  console.error("AUTHENTICHECK AUTH ERROR :", userError);

  return NextResponse.json(
    { error: "Utilisateur non connecté." },
    { status: 401 }
  );
}

    const formData = await request.formData();

    const photos = formData.getAll("photos");
    const brand = String(formData.get("brand") || "");

    console.log(
      `AUTHENTICHECK API : ${photos.length} photo(s) reçue(s)`
    );

    console.log(
      "AUTHENTICHECK API : utilisateur =",
      user.id
    );

    console.log(
      "AUTHENTICHECK API : marque reçue =",
      brand
    );

    photos.forEach((photo) => {
      if (photo instanceof File) {
        console.log(
          "Photo reçue :",
          photo.name,
          photo.type,
          photo.size,
          "octets"
        );
      }
    });

    const result = {
  score: 75,
  confidence: "medium",
  summary:
    "Analyse de démonstration. L'analyse IA réelle n'est pas activée pour le moment.",
  flags: [
    "Vérification visuelle à effectuer",
    "Certaines informations peuvent être nécessaires",
  ],
};

    const photoPaths: string[] = [];

    for (const photo of photos) {
      if (!(photo instanceof File)) continue;

      const fileExtension =
        photo.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${crypto.randomUUID()}.${fileExtension}`;
      const filePath = `analyses/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("analysis-photos")
        .upload(filePath, photo, {
          contentType: photo.type,
          upsert: false,
        });

      if (uploadError) {
        console.error(
          "SUPABASE STORAGE ERROR :",
          uploadError
        );

        throw new Error(
          "Impossible d'enregistrer une photo."
        );
      }

      photoPaths.push(filePath);
    }

    const { data, error } = await supabase
      .from("analyses")
      .insert({
  	user_id: user.id,
  	brand,
  	score: result.score,
  	confidence: result.confidence,
  	summary: result.summary,
  	flags: result.flags,
  	photo_count: photos.length,
      })
      .select()
      .single();

    if (error) {
      console.error("SUPABASE ERROR :", error);

      return NextResponse.json(
        {
          error: "Impossible d'enregistrer l'analyse.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    console.log(
      "AUTHENTICHECK : analyse enregistrée :",
      data.id,
      "pour l'utilisateur :",
      user.id
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "AUTHENTICHECK API ERROR :",
      error
    );

    return NextResponse.json(
      { error: "Erreur pendant l'analyse." },
      { status: 500 }
    );
  }
}