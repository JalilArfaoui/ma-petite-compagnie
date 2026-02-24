import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/* =========================
   CREATE
========================= */
async function createCompagnie(formData: FormData) {
  "use server";

  const nom = formData.get("nom") as string;

  await prisma.compagnie.create({
    data: { nom },
  });

  revalidatePath("/production/compagnies");
}

/* =========================
   UPDATE
========================= */
async function updateCompagnie(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const nom = formData.get("nom") as string;

  await prisma.compagnie.update({
    where: { id },
    data: { nom },
  });

  revalidatePath("/production/compagnies");
}

/* =========================
   DELETE
========================= */
async function deleteCompagnie(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.compagnie.delete({
    where: { id },
  });

  revalidatePath("/production/compagnies");
}

/* =========================
   PAGE
========================= */
export default async function CompagniesPage() {
  const compagnies = await prisma.compagnie.findMany({
    orderBy: { id: "desc" },
    include: {
      _count: {
        select: {
          spectacles: true,
          objets: true,
          membres: true,
        },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <h1 className="text-4xl text-[#D00039] text-center font-bold">🏢 Gestion des Compagnies</h1>

        {/* Create Form */}
        <div className="p-6 shadow-lg border-t-4 border-t-[#D00039] bg-white rounded-xl">
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">➕ Ajouter une compagnie</h3>

          <form action={createCompagnie}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block font-semibold mb-2">Nom *</label>
                <input
                  name="nom"
                  placeholder="Nom de la compagnie"
                  required
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
            >
              ➕ Ajouter la compagnie
            </button>
          </form>
        </div>

        {/* Separator */}
        <div className="h-0.5 bg-[#D00039]" />

        {/* Compagnies List */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">
            📋 Liste des compagnies ({compagnies.length})
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {compagnies.map((c) => (
              <div
                key={c.id}
                className="p-6 shadow-md border-l-4 border-l-[#D00039] bg-white rounded-xl transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">#{c.id}</p>
                    <h4 className="text-lg font-bold text-[#D00039] mb-2">{c.nom}</h4>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {c._count.spectacles} spectacle(s)
                    </span>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {c._count.objets} objet(s)
                    </span>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {c._count.membres} membre(s)
                    </span>
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-slate-200" />

                  {/* Update Form */}
                  <form action={updateCompagnie}>
                    <input type="hidden" name="id" value={c.id} />
                    <div className="flex flex-col gap-3">
                      <input
                        name="nom"
                        defaultValue={c.nom}
                        className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
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
                  <form action={deleteCompagnie}>
                    <input type="hidden" name="id" value={c.id} />
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

          {compagnies.length === 0 && (
            <div className="p-12 text-center bg-white rounded-xl shadow-md">
              <p className="text-slate-500 text-lg">
                Aucune compagnie pour le moment. Ajoutez-en une ci-dessus !
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
