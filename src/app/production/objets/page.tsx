import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TypeObjet } from "@prisma/client";

export const dynamic = "force-dynamic";

/* =========================
   CREATE
========================= */
async function createObjet(formData: FormData) {
  "use server";

  const nom = formData.get("nom") as string;
  const type = formData.get("type") as TypeObjet;
  const estDisponible = formData.get("estDisponible") === "true";
  const compagnieId = Number(formData.get("compagnieId"));

  await prisma.objet.create({
    data: { nom, type, estDisponible, compagnieId },
  });

  revalidatePath("/production/objets");
}

/* =========================
   UPDATE
========================= */
async function updateObjet(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const nom = formData.get("nom") as string;
  const type = formData.get("type") as TypeObjet;
  const estDisponible = formData.get("estDisponible") === "true";
  const compagnieId = Number(formData.get("compagnieId"));

  await prisma.objet.update({
    where: { id },
    data: { nom, type, estDisponible, compagnieId },
  });

  revalidatePath("/production/objets");
}

/* =========================
   DELETE
========================= */
async function deleteObjet(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.objet.delete({
    where: { id },
  });

  revalidatePath("/production/objets");
}

/* =========================
   HELPER FUNCTIONS
========================= */
const getTypeLabel = (type: TypeObjet) => {
  switch (type) {
    case "COSTUME":
      return "👗 Costume";
    case "DECOR":
      return "🎨 Décor";
    case "MATERIEL_TECHNIQUE":
      return "🔧 Matériel Technique";
    case "ACCESSOIRE":
      return "🎭 Accessoire";
    default:
      return type;
  }
};

const getTypeColor = (type: TypeObjet) => {
  switch (type) {
    case "COSTUME":
      return "bg-pink-100 text-pink-800";
    case "DECOR":
      return "bg-green-100 text-green-800";
    case "MATERIEL_TECHNIQUE":
      return "bg-blue-100 text-blue-800";
    case "ACCESSOIRE":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/* =========================
   PAGE
========================= */
export default async function ObjetsPage() {
  const [objets, compagnies] = await Promise.all([
    prisma.objet.findMany({
      orderBy: { id: "desc" },
      include: {
        compagnie: true,
        _count: { select: { reservations: true } },
      },
    }),
    prisma.compagnie.findMany({ orderBy: { nom: "asc" } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <h1 className="text-4xl text-[#D00039] text-center font-bold">🎪 Gestion des Objets</h1>

        {/* Create Form */}
        <div className="p-6 shadow-lg border-t-4 border-t-[#D00039] bg-white rounded-xl">
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">➕ Ajouter un objet</h3>

          <form action={createObjet}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Nom *</label>
                <input
                  name="nom"
                  placeholder="Nom de l'objet"
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
                  <option value="COSTUME">👗 Costume</option>
                  <option value="DECOR">🎨 Décor</option>
                  <option value="MATERIEL_TECHNIQUE">🔧 Matériel Technique</option>
                  <option value="ACCESSOIRE">🎭 Accessoire</option>
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
                <label className="block font-semibold mb-2">Disponibilité *</label>
                <select
                  name="estDisponible"
                  required
                  className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                >
                  <option value="true">✅ Disponible</option>
                  <option value="false">❌ Indisponible</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
            >
              ➕ Ajouter l&apos;objet
            </button>
          </form>
        </div>

        {/* Separator */}
        <div className="h-0.5 bg-[#D00039]" />

        {/* Objets List */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">
            📋 Liste des objets ({objets.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objets.map((o) => (
              <div
                key={o.id}
                className="p-6 shadow-md border-l-4 border-l-[#D00039] bg-white rounded-xl transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">#{o.id}</p>
                    <h4 className="text-lg font-bold text-[#D00039] mb-2">{o.nom}</h4>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getTypeColor(o.type)}`}
                      >
                        {getTypeLabel(o.type)}
                      </span>
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${o.estDisponible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {o.estDisponible ? "✅ Disponible" : "❌ Indisponible"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-2 text-sm">
                    <p>
                      <strong>🏢 Compagnie:</strong> {o.compagnie.nom}
                    </p>
                    <p>
                      <strong>📦 Réservations:</strong> {o._count.reservations}
                    </p>
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-slate-200" />

                  {/* Update Form */}
                  <form action={updateObjet}>
                    <input type="hidden" name="id" value={o.id} />
                    <div className="flex flex-col gap-3">
                      <input
                        name="nom"
                        defaultValue={o.nom}
                        className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          name="type"
                          defaultValue={o.type}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        >
                          <option value="COSTUME">Costume</option>
                          <option value="DECOR">Décor</option>
                          <option value="MATERIEL_TECHNIQUE">Matériel Tech.</option>
                          <option value="ACCESSOIRE">Accessoire</option>
                        </select>
                        <select
                          name="estDisponible"
                          defaultValue={o.estDisponible.toString()}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        >
                          <option value="true">Disponible</option>
                          <option value="false">Indisponible</option>
                        </select>
                      </div>
                      <select
                        name="compagnieId"
                        defaultValue={o.compagnieId}
                        className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                      >
                        {compagnies.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nom}
                          </option>
                        ))}
                      </select>

                      <button
                        type="submit"
                        className="w-full h-8 text-sm bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
                      >
                        ✏️ Modifier
                      </button>
                    </div>
                  </form>

                  {/* Delete Form */}
                  <form action={deleteObjet}>
                    <input type="hidden" name="id" value={o.id} />
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

          {objets.length === 0 && (
            <div className="p-12 text-center bg-white rounded-xl shadow-md">
              <p className="text-slate-500 text-lg">
                Aucun objet pour le moment. Ajoutez-en un ci-dessus !
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
