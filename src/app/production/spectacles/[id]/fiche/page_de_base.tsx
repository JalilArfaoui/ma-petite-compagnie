import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/* =========================
   CREATE
========================= */
async function createFicheTechnique(spectacleId: number, spectacleTitre: String,  formData: FormData) {
  "use server";
  
  const texte = formData.get("texte") as string;
  const pdfName = "Fiche Technique - " +spectacleTitre+".pdf";

  await prisma.ficheTechnique.create({
    data: { texte, spectacleId, pdfName },
  });

  revalidatePath(`/production/spectacles/`);
}

/* =========================
   UPDATE
========================= */
async function updateFicheTechnique(spectacleId: number,formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const texte = formData.get("texte") as string;


  await prisma.ficheTechnique.update({
    where: { spectacleId },
    data: { texte },
  });

  revalidatePath(`/production/spectacles/${spectacleId}`);
}

/* =========================
   DELETE
========================= */
async function deleteFicheTechnique(spectacleId: number, formData: FormData) {
  "use server";


  await prisma.ficheTechnique.delete({
    where: { spectacleId },
  });

  revalidatePath(`/production/spectacles/${spectacleId}`);
}

/* =========================
   PAGE
========================= */
export default async function FichesTechniquesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id  } = await params;

  const ficheTechnique = await prisma.ficheTechnique.findUnique({
    where: { id: Number(id) },
    include: { spectacle: true },
  });

  const spectacle = await prisma.spectacle.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      titre: true,
      type: true,
      statut: true,
      dure: true,
      ficheTechnique: {
        select: { id: true, texte: true, pdfName: true, spectacleId: true},
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <h1 className="text-4xl text-[#D00039] text-center font-bold">
          📋 Gestion de la Fiche Technique
        </h1>

        {/* Create Form */}
        <div className="p-6 shadow-lg border-t-4 border-t-[#D00039] bg-white rounded-xl">
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">➕ Ajouter une fiche technique</h3>

          {spectacle?.ficheTechnique?.spectacleId === spectacle?.id ? (
            
            
                    
              <><div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full h-8 text-sm bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
              >
                ✏️ Modifier
              </button>
            <button
              type="submit"
              className="w-full h-8 text-sm border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-md transition-colors"
            >
                🗑️ Supprimer
              </button>
            </div></>

                  
          ) : (
            <form action={createFicheTechnique.bind(null, spectacle!.id, spectacle!.titre)} className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Nom du spectacle : {spectacle?.titre}</label>
                  
                </div>

                <div>
                  <label className="block font-semibold mb-2">Contenu de la fiche *</label>
                  <textarea
                    name="texte"
                    placeholder="Détails techniques du spectacle..."
                    required
                    rows={6}
                    className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none resize-y"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
              >
                ➕ Ajouter la fiche technique
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
