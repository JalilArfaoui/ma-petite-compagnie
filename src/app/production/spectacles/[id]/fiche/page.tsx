import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import FicheForm from "./FicheForm";

export const dynamic = "force-dynamic";

/* =========================
   CREATE
========================= */
async function createFicheTechnique(spectacleId: number, spectacleTitre: string, formData: FormData) {
  "use server";

  const texte = formData.get("texte") as string;
  const pdfName = "Fiche Technique - " + spectacleTitre + ".pdf";

  await prisma.ficheTechnique.create({
    data: { texte, spectacleId, pdfName },
  });

  revalidatePath(`/production/spectacles/`);
}

/* =========================
   UPDATE
========================= */
async function updateFicheTechnique(spectacleId: number, formData: FormData) {
  "use server";

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
  console.log("essaie");
  revalidatePath(`/production/spectacles/${spectacleId}`);
}

/* =========================
   PAGE
========================= */
export default async function FichesTechniquesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const spectacle = await prisma.spectacle.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      titre: true,
      ficheTechnique: {
        select: { texte: true, pdfName: true, spectacleId: true },
      },
    },
  });

  const fiche = spectacle?.ficheTechnique ?? null;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-8">
        <h1 className="text-4xl text-[#D00039] text-center font-bold">
          📋 Gestion de la Fiche Technique
        </h1>
        <a href={`/production/spectacles/${id}`}>
        <button
          className="text-sm text-slate-500 hover:text-[#D00039] font-serif mb-4 inline-flex items-center gap-1 cursor-pointer"
        >
          ← Retour à la fiche du spectacle
        </button></a>
        <div className="p-6 shadow-lg border-t-4 border-t-[#D00039] bg-white rounded-xl">
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">
            {fiche ? "✏️ Modifier la fiche technique" : "➕ Ajouter une fiche technique"}
          </h3>

          <FicheForm
            spectacleTitre={spectacle!.titre}
            fiche={fiche}
            createAction={createFicheTechnique.bind(null, spectacle!.id, spectacle!.titre)}
            updateAction={updateFicheTechnique.bind(null, spectacle!.id)}
            deleteAction={deleteFicheTechnique.bind(null, spectacle!.id)}
          />
        </div>
      </div>
    </div>
  );
}
