import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/* =========================
   CREATE
========================= */
async function createFicheTechnique(formData: FormData) {
  "use server";

  const texte = formData.get("texte") as string;
  const spectacleId = Number(formData.get("spectacleId"));

  await prisma.ficheTechnique.create({
    data: { texte, spectacleId },
  });

  revalidatePath("/production/fiches-techniques");
}

/* =========================
   UPDATE
========================= */
async function updateFicheTechnique(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const texte = formData.get("texte") as string;
  const spectacleId = Number(formData.get("spectacleId"));

  await prisma.ficheTechnique.update({
    where: { id },
    data: { texte, spectacleId },
  });

  revalidatePath("/production/fiches-techniques");
}

/* =========================
   DELETE
========================= */
async function deleteFicheTechnique(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.ficheTechnique.delete({
    where: { id },
  });

  revalidatePath("/production/fiches-techniques");
}

/* =========================
   PAGE
========================= */
export default async function FichesTechniquesPage() {
  const [fichesTechniques, spectaclesSansFiche] = await Promise.all([
    prisma.ficheTechnique.findMany({
      orderBy: { id: "desc" },
      include: { spectacle: true },
    }),
    prisma.spectacle.findMany({
      where: { ficheTechnique: null },
      orderBy: { titre: "asc" },
    }),
  ]);

  const allSpectacles = await prisma.spectacle.findMany({
    orderBy: { titre: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <h1 className="text-4xl text-[#D00039] text-center font-bold">
          📋 Gestion des Fiches Techniques
        </h1>

        {/* Create Form */}
        <div className="p-6 shadow-lg border-t-4 border-t-[#D00039] bg-white rounded-xl">
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">➕ Ajouter une fiche technique</h3>

          {spectaclesSansFiche.length === 0 ? (
            <p className="text-slate-500">
              Tous les spectacles ont déjà une fiche technique. Créez d&apos;abord un nouveau
              spectacle.
            </p>
          ) : (
            <form action={createFicheTechnique}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Spectacle *</label>
                  <select
                    name="spectacleId"
                    required
                    className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                  >
                    <option value="">Sélectionner un spectacle</option>
                    {spectaclesSansFiche.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.titre}
                      </option>
                    ))}
                  </select>
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

        {/* Separator */}
        <div className="h-0.5 bg-[#D00039]" />

        {/* Fiches Techniques List */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">
            📋 Liste des fiches techniques ({fichesTechniques.length})
          </h3>

          <div className="grid grid-cols-1 gap-6">
            {fichesTechniques.map((f) => (
              <div
                key={f.id}
                className="p-6 shadow-md border-l-4 border-l-[#D00039] bg-white rounded-xl transition-all hover:shadow-xl"
              >
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">#{f.id}</p>
                    <h4 className="text-lg font-bold text-[#D00039] mb-2">
                      Fiche: {f.spectacle.titre}
                    </h4>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Spectacle #{f.spectacleId}
                    </span>
                  </div>

                  {/* Content Preview */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {f.texte.length > 300 ? f.texte.substring(0, 300) + "..." : f.texte}
                    </p>
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-slate-200" />

                  {/* Update Form */}
                  <form action={updateFicheTechnique}>
                    <input type="hidden" name="id" value={f.id} />
                    <div className="flex flex-col gap-3">
                      <select
                        name="spectacleId"
                        defaultValue={f.spectacleId}
                        className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                      >
                        {allSpectacles.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.titre}
                          </option>
                        ))}
                      </select>
                      <textarea
                        name="texte"
                        defaultValue={f.texte}
                        rows={4}
                        className="text-sm p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none resize-y"
                      />

                      <button
                        type="submit"
                        className="w-full h-8 text-sm bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
                      >
                        ✏️ Modifier
                      </button>
                    </div>
                  </form>

                  {/* Delete Form */}
                  <form action={deleteFicheTechnique}>
                    <input type="hidden" name="id" value={f.id} />
                    <button
                      type="submit"
                      className="w-full h-8 text-sm border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-md transition-colors"
                    >
                      🗑️ Supprimer
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          {fichesTechniques.length === 0 && (
            <div className="p-12 text-center bg-white rounded-xl shadow-md">
              <p className="text-slate-500 text-lg">
                Aucune fiche technique pour le moment. Ajoutez-en une ci-dessus !
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
