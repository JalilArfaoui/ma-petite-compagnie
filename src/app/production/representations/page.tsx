import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/* =========================
   CREATE
========================= */
async function createRepresentation(formData: FormData) {
  "use server";

  const date = new Date(formData.get("date") as string);
  const spectacleId = Number(formData.get("spectacleId"));
  const lieuId = Number(formData.get("lieuId"));

  await prisma.representation.create({
    data: { date, spectacleId, lieuId },
  });

  revalidatePath("/production/representations");
}

/* =========================
   UPDATE
========================= */
async function updateRepresentation(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const date = new Date(formData.get("date") as string);
  const spectacleId = Number(formData.get("spectacleId"));
  const lieuId = Number(formData.get("lieuId"));

  await prisma.representation.update({
    where: { id },
    data: { date, spectacleId, lieuId },
  });

  revalidatePath("/production/representations");
}

/* =========================
   DELETE
========================= */
async function deleteRepresentation(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.representation.delete({
    where: { id },
  });

  revalidatePath("/production/representations");
}

/* =========================
   HELPER FUNCTIONS
========================= */
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
};

const formatDateInput = (date: Date) => {
  return date.toISOString().slice(0, 16);
};

/* =========================
   PAGE
========================= */
export default async function RepresentationsPage() {
  const [representations, spectacles, lieux] = await Promise.all([
    prisma.representation.findMany({
      orderBy: { date: "desc" },
      include: {
        spectacle: true,
        lieu: true,
        _count: { select: { reservations: true } },
      },
    }),
    prisma.spectacle.findMany({ orderBy: { titre: "asc" } }),
    prisma.lieu.findMany({ orderBy: { libelle: "asc" } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <h1 className="text-4xl text-[#D00039] text-center font-bold">
          📅 Gestion des Représentations
        </h1>

        {/* Create Form */}
        <div className="p-6 shadow-lg border-t-4 border-t-[#D00039] bg-white rounded-xl">
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">➕ Ajouter une représentation</h3>

          <form action={createRepresentation}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-2">Date et heure *</label>
                <input
                  name="date"
                  type="datetime-local"
                  required
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Spectacle *</label>
                <select
                  name="spectacleId"
                  required
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                >
                  <option value="">Sélectionner un spectacle</option>
                  {spectacles.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.titre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Lieu *</label>
                <select
                  name="lieuId"
                  required
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                >
                  <option value="">Sélectionner un lieu</option>
                  {lieux.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.libelle} - {l.ville}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
            >
              ➕ Ajouter la représentation
            </button>
          </form>
        </div>

        {/* Separator */}
        <div className="h-0.5 bg-[#D00039]" />

        {/* Representations List */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">
            📋 Liste des représentations ({representations.length})
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {representations.map((r) => (
              <div
                key={r.id}
                className="p-6 shadow-md border-l-4 border-l-[#D00039] bg-white rounded-xl transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">#{r.id}</p>
                    <h4 className="text-lg font-bold text-[#D00039] mb-2">{r.spectacle.titre}</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        📍 {r.lieu.libelle}
                      </span>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        📦 {r._count.reservations} réservation(s)
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-2 text-sm">
                    <p>
                      <strong>📅 Date:</strong> {formatDate(r.date)}
                    </p>
                    <p>
                      <strong>📍 Adresse:</strong> {r.lieu.adresse}, {r.lieu.ville}
                    </p>
                    {r.lieu.numero_salle && (
                      <p>
                        <strong>🚪 Salle:</strong> {r.lieu.numero_salle}
                      </p>
                    )}
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-slate-200" />

                  {/* Update Form */}
                  <form action={updateRepresentation}>
                    <input type="hidden" name="id" value={r.id} />
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          name="date"
                          type="datetime-local"
                          defaultValue={formatDateInput(r.date)}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        />
                        <select
                          name="spectacleId"
                          defaultValue={r.spectacleId}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        >
                          {spectacles.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.titre}
                            </option>
                          ))}
                        </select>
                        <select
                          name="lieuId"
                          defaultValue={r.lieuId}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        >
                          {lieux.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.libelle} - {l.ville}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-8 text-sm bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
                      >
                        ✏️ Modifier
                      </button>
                    </div>
                  </form>

                  {/* Delete Form */}
                  <form action={deleteRepresentation}>
                    <input type="hidden" name="id" value={r.id} />
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

          {representations.length === 0 && (
            <div className="p-12 text-center bg-white rounded-xl shadow-md">
              <p className="text-slate-500 text-lg">
                Aucune représentation pour le moment. Ajoutez-en une ci-dessus !
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
