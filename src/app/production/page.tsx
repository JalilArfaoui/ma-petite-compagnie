import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { StatutSpectacle, TypeSpectacle } from "@prisma/client";

export const dynamic = "force-dynamic";

/* =========================
   CREATE
========================= */
async function createSpectacle(formData: FormData) {
  "use server";

  const titre = formData.get("titre") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as TypeSpectacle;
  const statut = formData.get("statut") as StatutSpectacle;
  const compagnieId = Number(formData.get("compagnieId"));
  const budget_initial = Number(formData.get("budget_initial")) || 0;

  await prisma.spectacle.create({
    data: {
      titre,
      description,
      type,
      statut,
      compagnieId,
      budget_initial,
    },
  });

  revalidatePath("/production");
}

/* =========================
   UPDATE
========================= */
async function updateSpectacle(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const titre = formData.get("titre") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as TypeSpectacle;
  const statut = formData.get("statut") as StatutSpectacle;
  const compagnieId = Number(formData.get("compagnieId"));
  const budget_initial = Number(formData.get("budget_initial")) || 0;

  await prisma.spectacle.update({
    where: { id },
    data: {
      titre,
      description,
      type,
      statut,
      compagnieId,
      budget_initial,
    },
  });

  revalidatePath("/production");
}

/* =========================
   DELETE
========================= */
async function deleteSpectacle(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.spectacle.delete({
    where: { id },
  });

  revalidatePath("/production");
}

/* =========================
   HELPER FUNCTIONS
========================= */
const getStatusColor = (statut: string) => {
  switch (statut) {
    case "EN_CREATION":
      return "bg-blue-100 text-blue-800";
    case "EN_REPETITION":
      return "bg-orange-100 text-orange-800";
    case "EN_TOURNEE":
      return "bg-green-100 text-green-800";
    case "ARCHIVE":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (statut: string) => {
  switch (statut) {
    case "EN_CREATION":
      return "En Création";
    case "EN_REPETITION":
      return "En Répétition";
    case "EN_TOURNEE":
      return "En Tournée";
    case "ARCHIVE":
      return "Archivé";
    default:
      return statut;
  }
};

const getTypeLabel = (type: TypeSpectacle) => {
  switch (type) {
    case "THEATRE":
      return "🎭 Théâtre";
    case "DANSE":
      return "💃 Danse";
    case "MUSIQUE":
      return "🎵 Musique";
    case "CIRQUE":
      return "🎪 Cirque";
    case "AUTRE":
      return "📦 Autre";
    default:
      return type;
  }
};

/* =========================
   PAGE
========================= */
export default async function SpectaclesPage() {
  const [spectacles, compagnies] = await Promise.all([
    prisma.spectacle.findMany({
      orderBy: { id: "desc" },
      include: { compagnie: true },
    }),
    prisma.compagnie.findMany({ orderBy: { nom: "asc" } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <h1 className="text-4xl text-[#D00039] text-center font-bold">🎭 Gestion des Spectacles</h1>

        {/* Create Form */}
        <div className="p-6 shadow-lg border-t-4 border-t-[#D00039] bg-white rounded-xl">
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">➕ Ajouter un spectacle</h3>

          <form action={createSpectacle}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Titre *</label>
                <input
                  name="titre"
                  placeholder="Titre du spectacle"
                  required
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Type *</label>
                <select
                  name="type"
                  required
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                >
                  <option value="THEATRE">🎭 Théâtre</option>
                  <option value="DANSE">💃 Danse</option>
                  <option value="MUSIQUE">🎵 Musique</option>
                  <option value="CIRQUE">🎪 Cirque</option>
                  <option value="AUTRE">📦 Autre</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Compagnie *</label>
                <select
                  name="compagnieId"
                  required
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                >
                  <option value="">Sélectionner une compagnie</option>
                  {compagnies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Statut *</label>
                <select
                  name="statut"
                  required
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                >
                  <option value="EN_CREATION">En Création</option>
                  <option value="EN_REPETITION">En Répétition</option>
                  <option value="EN_TOURNEE">En Tournée</option>
                  <option value="ARCHIVE">Archivé</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-2">Description</label>
                <input
                  name="description"
                  placeholder="Description du spectacle"
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Budget Initial (€)</label>
                <input
                  name="budget_initial"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
            >
              ➕ Ajouter le spectacle
            </button>
          </form>
        </div>

        {/* Separator */}
        <div className="h-0.5 bg-[#D00039]" />

        {/* Spectacles List */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">
            📋 Liste des spectacles ({spectacles.length})
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {spectacles.map((s) => (
              <div
                key={s.id}
                className="p-6 shadow-md border-l-4 border-l-[#D00039] bg-white rounded-xl transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">#{s.id}</p>
                      <h4 className="text-lg font-bold text-[#D00039] mb-2">{s.titre}</h4>
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(s.statut)}`}
                      >
                        {getStatusLabel(s.statut)}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-2 text-sm">
                    {s.description && (
                      <p className="text-slate-600">
                        <strong>Description:</strong> {s.description}
                      </p>
                    )}
                    <p>
                      <strong>Type:</strong> {getTypeLabel(s.type)}
                    </p>
                    <p>
                      <strong>Compagnie:</strong> {s.compagnie.nom}
                    </p>
                    <p>
                      <strong>Budget:</strong>{" "}
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(s.budget_initial)}
                    </p>
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-slate-200" />

                  {/* Update Form */}
                  <form action={updateSpectacle}>
                    <input type="hidden" name="id" value={s.id} />
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          name="titre"
                          defaultValue={s.titre}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        />
                        <select
                          name="type"
                          defaultValue={s.type}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        >
                          <option value="THEATRE">Théâtre</option>
                          <option value="DANSE">Danse</option>
                          <option value="MUSIQUE">Musique</option>
                          <option value="CIRQUE">Cirque</option>
                          <option value="AUTRE">Autre</option>
                        </select>
                        <select
                          name="compagnieId"
                          defaultValue={s.compagnieId}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        >
                          {compagnies.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nom}
                            </option>
                          ))}
                        </select>
                        <select
                          name="statut"
                          defaultValue={s.statut}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        >
                          <option value="EN_CREATION">En Création</option>
                          <option value="EN_REPETITION">En Répétition</option>
                          <option value="EN_TOURNEE">En Tournée</option>
                          <option value="ARCHIVE">Archivé</option>
                        </select>
                      </div>
                      <input
                        name="description"
                        defaultValue={s.description ?? ""}
                        className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        placeholder="Description"
                      />
                      <input
                        name="budget_initial"
                        type="number"
                        step="0.01"
                        defaultValue={s.budget_initial}
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
                  <form action={deleteSpectacle}>
                    <input type="hidden" name="id" value={s.id} />
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

          {spectacles.length === 0 && (
            <div className="p-12 text-center bg-white rounded-xl shadow-md">
              <p className="text-slate-500 text-lg">
                Aucun spectacle pour le moment. Ajoutez-en un ci-dessus !
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
