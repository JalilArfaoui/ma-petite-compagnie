import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/* =========================
   CREATE
========================= */
async function createReservationObjet(formData: FormData) {
  "use server";

  const quantite = Number(formData.get("quantite"));
  const objetId = Number(formData.get("objetId"));
  const representationId = Number(formData.get("representationId"));

  await prisma.reservationObjet.create({
    data: { quantite, objetId, representationId },
  });

  revalidatePath("/production/reservations-objets");
}

/* =========================
   UPDATE
========================= */
async function updateReservationObjet(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const quantite = Number(formData.get("quantite"));
  const objetId = Number(formData.get("objetId"));
  const representationId = Number(formData.get("representationId"));

  await prisma.reservationObjet.update({
    where: { id },
    data: { quantite, objetId, representationId },
  });

  revalidatePath("/production/reservations-objets");
}

/* =========================
   DELETE
========================= */
async function deleteReservationObjet(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.reservationObjet.delete({
    where: { id },
  });

  revalidatePath("/production/reservations-objets");
}

/* =========================
   HELPER FUNCTIONS
========================= */
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

/* =========================
   PAGE
========================= */
export default async function ReservationsObjetsPage() {
  const [reservations, objets, representations] = await Promise.all([
    prisma.reservationObjet.findMany({
      orderBy: { id: "desc" },
      include: {
        objet: { include: { compagnie: true } },
        representation: {
          include: {
            spectacle: true,
            lieu: true,
          },
        },
      },
    }),
    prisma.objet.findMany({
      orderBy: { nom: "asc" },
      where: { estDisponible: true },
    }),
    prisma.representation.findMany({
      orderBy: { date: "desc" },
      include: { spectacle: true, lieu: true },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <h1 className="text-4xl text-[#D00039] text-center font-bold">
          📦 Gestion des Réservations d&apos;Objets
        </h1>

        {/* Create Form */}
        <div className="p-6 shadow-lg border-t-4 border-t-[#D00039] bg-white rounded-xl">
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">➕ Ajouter une réservation</h3>

          <form action={createReservationObjet}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-2">Objet *</label>
                <select
                  name="objetId"
                  required
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                >
                  <option value="">Sélectionner un objet</option>
                  {objets.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nom} ({o.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Représentation *</label>
                <select
                  name="representationId"
                  required
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                >
                  <option value="">Sélectionner une représentation</option>
                  {representations.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.spectacle.titre} - {formatDate(r.date)} @ {r.lieu.libelle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Quantité *</label>
                <input
                  name="quantite"
                  type="number"
                  min="1"
                  placeholder="1"
                  required
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
            >
              ➕ Ajouter la réservation
            </button>
          </form>
        </div>

        {/* Separator */}
        <div className="h-0.5 bg-[#D00039]" />

        {/* Reservations List */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">
            📋 Liste des réservations ({reservations.length})
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reservations.map((r) => (
              <div
                key={r.id}
                className="p-6 shadow-md border-l-4 border-l-[#D00039] bg-white rounded-xl transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">#{r.id}</p>
                    <h4 className="text-lg font-bold text-[#D00039] mb-2">{r.objet.nom}</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        🎭 {r.representation.spectacle.titre}
                      </span>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        x{r.quantite}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-2 text-sm">
                    <p>
                      <strong>🎪 Objet:</strong> {r.objet.nom} ({r.objet.type})
                    </p>
                    <p>
                      <strong>🏢 Compagnie:</strong> {r.objet.compagnie.nom}
                    </p>
                    <p>
                      <strong>📅 Date:</strong> {formatDate(r.representation.date)}
                    </p>
                    <p>
                      <strong>📍 Lieu:</strong> {r.representation.lieu.libelle},{" "}
                      {r.representation.lieu.ville}
                    </p>
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-slate-200" />

                  {/* Update Form */}
                  <form action={updateReservationObjet}>
                    <input type="hidden" name="id" value={r.id} />
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <select
                          name="objetId"
                          defaultValue={r.objetId}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        >
                          {objets.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.nom}
                            </option>
                          ))}
                          {/* Keep current if not available anymore */}
                          {!objets.find((o) => o.id === r.objetId) && (
                            <option value={r.objetId}>{r.objet.nom} (actuel)</option>
                          )}
                        </select>
                        <select
                          name="representationId"
                          defaultValue={r.representationId}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        >
                          {representations.map((rep) => (
                            <option key={rep.id} value={rep.id}>
                              {rep.spectacle.titre} - {formatDate(rep.date)}
                            </option>
                          ))}
                        </select>
                        <input
                          name="quantite"
                          type="number"
                          min="1"
                          defaultValue={r.quantite}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        />
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
                  <form action={deleteReservationObjet}>
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

          {reservations.length === 0 && (
            <div className="p-12 text-center bg-white rounded-xl shadow-md">
              <p className="text-slate-500 text-lg">
                Aucune réservation pour le moment. Ajoutez-en une ci-dessus !
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
