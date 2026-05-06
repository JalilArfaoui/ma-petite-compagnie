import { prisma } from "@/lib/prisma";
import { refresh, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Box, Card, Heading } from "@/components/ui";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

async function reserver(formData: FormData) {
  "use server";

  const date = new Date(formData.get("date") as string);
  const spectacleId = Number(formData.get("spectacleId"));
  const lieuId = Number(formData.get("lieuId"));
  const deca_debut = Number(formData.get("decalage-debut"));
  const deca_fin = Number(formData.get("decalage-fin"));
  const debutResa = new Date(date.getTime() + deca_debut * 60000);
  const finResa = new Date(date.getTime() + deca_fin * 60000);

  const rep = await prisma.representation.create({
    data: { debutResa, finResa, spectacleId, lieuId },
  });

  if (rep != null) {
    const promises: Promise<unknown>[] = [];
    formData.forEach((data, key) => {
      if (!isNaN(Number(key))) {
        promises.push(
          prisma.reservationObjet.create({
            data: {
              representationId: rep.id,
              objetId: Number(data),
            },
          })
        );
      }
    });
    await Promise.all(promises);
  }

  revalidatePath(`/production/spectacles/${spectacleId}/reserver`);
  redirect(`/production/spectacles/${spectacleId}/reserver`);
}

async function deleteRepresentation(formData: FormData) {
  "use server";

  const spectacleId = formData.get("spectacleId") as string;

  const representationId = Number(formData.get("representationId"));
  console.log(representationId);
  await prisma.representation.delete({
    where: {
      id: representationId,
    },
  });

  if (formData.has("date") && formData.has("lieuId")) {
    const date = formData.get("date") as string;
    const lieu = formData.get("lieuId") as string;

    redirect(
      `/production/spectacles/${spectacleId}/reserver?date=${encodeURIComponent(date)}&lieu=${encodeURIComponent(lieu)}`
    );
  } else {
    redirect(`/production/spectacles/${spectacleId}/reserver`);
  }
}

async function confirmDateLieu(formData: FormData) {
  "use server";

  const date = formData.get("date") as string;
  const lieu = formData.get("lieuId") as string;
  const spectacleId = formData.get("spectacleId") as string;

  redirect(
    `/production/spectacles/${spectacleId}/reserver?date=${encodeURIComponent(date)}&lieu=${encodeURIComponent(lieu)}`
  );
}

/* =========================
   HELPER FUNCTIONS
========================= */

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

const formatDate2 = (date1: Date, date2: Date) => {
  let d = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date1);
  const h1 = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date1);
  const h2 = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date2);

  d = d + " de " + h1 + " à " + h2;
  return d;
};

const formatDateInput = (date: Date) => {
  return date.toISOString().slice(0, 16);
};

const compagnieId = 1; // TODO: remplacer par l'id de la compagnie connectée

export default async function ProductionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string; lieu?: number }>;
}) {
  const { id } = await params;
  const { date: dateParam, lieu: lieuParam } = await searchParams;
  const laDate = dateParam ? (dateParam as string) : null;
  const leLieu = lieuParam ? (lieuParam as number) : null;
  const spectacle = await prisma.spectacle.findFirst({
    where: {
      id: Number(id),
      compagnieId: compagnieId,
    },
  });
  if (spectacle == null) {
    return <p>vous n&apos;avez pas acces a ce spectacle</p>;
  } else {
    const representations = await prisma.representation.findMany({
      include: {
        lieu: true,
      },
      where: {
        spectacleId: Number(id),
      },
    });

    const lieux = await prisma.lieu.findMany({
      select: {
        id: true,
        ville: true,
        libelle: true,
      },
    });
    if (laDate == null || leLieu == null) {
      return (
        <div className="max-w-7xl mx-auto px-4">
          <a
            href={"."}
            className="text-sm text-slate-500 hover:text-[#D00039] font-serif mb-4 inline-flex items-center gap-1 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour a {spectacle.titre}
          </a>
          <div id="main" className="flex flex-col gap-8">
            <Heading as="h4" className="text-primary mb-2">
              créer une nouvelle representation de {spectacle.titre} :
            </Heading>

            <form action={confirmDateLieu}>
              <input name="spectacleId" type="hidden" value={id} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block font-semibold mb-2">Lieu *</label>
                  <select
                    name="lieuId"
                    required
                    defaultValue={""}
                    className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                  >
                    <option disabled value="">
                      Sélectionner un lieu
                    </option>
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
                commencer la reservation
              </button>
            </form>
            {/* Separator */}
            <Box className="h-0.5 bg-primary" />
            <div>
              {representations.length == 0 ? (
                <Heading as="h4" className="text-primary mb-2">
                  {spectacle.titre} n&apos;a aucune representations
                </Heading>
              ) : (
                <Heading as="h4" className="text-primary mb-2">
                  representations de {spectacle.titre} :
                </Heading>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {representations.map((representation) => (
                  <div
                    key={representation.id}
                    className="p-6 shadow-md border-l-4 border-l-[#D00039] bg-white rounded-xl transition-all hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {/* Header */}
                    <div>
                      <p className="text-xs text-slate-500 mb-1">#{representation.id}</p>
                      <h4 className="text-lg font-bold text-[#D00039] mb-2">{spectacle.titre}</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          📍 {representation.lieu.libelle}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-2 text-sm">
                      <p>
                        <strong>📅 Date:</strong>{" "}
                        {representation.debutResa.getDate() === representation.finResa.getDate()
                          ? formatDate2(representation.debutResa, representation.finResa)
                          : "du " +
                            formatDate(representation.debutResa) +
                            " au " +
                            formatDate(representation.finResa)}
                      </p>
                      <p>
                        <strong>📍 Adresse:</strong> {representation.lieu.adresse},{" "}
                        {representation.lieu.ville}
                      </p>
                      {representation.lieu.numero_salle && (
                        <p>
                          <strong>🚪 Salle:</strong> {representation.lieu.numero_salle}
                        </p>
                      )}
                    </div>

                    <form action={deleteRepresentation}>
                      <input
                        name="spectacleId"
                        hidden
                        type="number"
                        readOnly
                        defaultValue={id}
                        required
                      />

                      <input
                        name="representationId"
                        hidden
                        type="number"
                        readOnly
                        defaultValue={representation.id}
                        required
                      />

                      <button
                        type="submit"
                        className="w-full h-8 text-sm border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-md transition-colors"
                      >
                        🗑️ Supprimer
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      const debut = new Date(Date.parse(laDate));
      const fin = new Date(debut.getTime() + spectacle.dure * 60000);
      const req = await prisma.besoinSpectacle.findMany({
        include: {
          typeObjet: {
            include: {
              categorie: {
                select: {
                  nom: true,
                },
              },
              objets: {
                where: {
                  etat: {
                    not: "CASSE",
                  },
                  reservations: {
                    none: {
                      representation: {
                        OR: [
                          {
                            AND: [
                              {
                                debutResa: {
                                  gte: debut,
                                },
                              },
                              {
                                debutResa: {
                                  lte: fin,
                                },
                              },
                            ],
                          },
                          {
                            AND: [
                              {
                                finResa: {
                                  gte: debut,
                                },
                              },
                              {
                                finResa: {
                                  lte: fin,
                                },
                              },
                            ],
                          },
                          {
                            AND: [
                              {
                                debutResa: {
                                  lte: debut,
                                },
                              },
                              {
                                finResa: {
                                  gte: fin,
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                  },
                  compagnieId: spectacle.compagnieId,
                },
              },
            },
          },
        },
        where: {
          spectacleId: spectacle.id,
        },
      });

      const besoins: Record<string, typeof req> = {};

      const categories: string[] = [];
      req.forEach((element) => {
        if (besoins[element.typeObjet.categorie.nom] == undefined) {
          categories.push(element.typeObjet.categorie.nom);
          besoins[element.typeObjet.categorie.nom] = [];
        }
        besoins[element.typeObjet.categorie.nom].push(element);
      });

      return (
        <div className="max-w-7xl mx-auto px-4">
          <a
            href={"."}
            className="text-sm text-slate-500 hover:text-[#D00039] font-serif mb-4 inline-flex items-center gap-1 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour a {spectacle.titre}
          </a>

          <div id="main" className="flex flex-col gap-8">
            <Heading as="h4" className="text-primary mb-2">
              créer une nouvelle representation de {spectacle.titre} :
            </Heading>

            <form action={confirmDateLieu}>
              <input name="spectacleId" type="hidden" value={id} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Date et heure *</label>
                  <input
                    name="date"
                    type="datetime-local"
                    required
                    defaultValue={laDate}
                    className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Lieu *</label>
                  <select
                    name="lieuId"
                    required
                    defaultValue={leLieu}
                    className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                  >
                    <option disabled value="">
                      Sélectionner un lieu
                    </option>
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
                modifier la date ou lieu
              </button>
            </form>
            <form action={reserver}>
              <input name="date" hidden type="datetime-local" readOnly value={laDate} required />

              <input
                name="decalage-debut"
                hidden
                type="number"
                readOnly
                defaultValue={0}
                required
              />

              <input
                name="decalage-fin"
                hidden
                type="number"
                readOnly
                defaultValue={spectacle.dure}
                required
              />

              <input name="spectacleId" hidden type="number" readOnly defaultValue={id} required />

              <input name="lieuId" hidden type="number" readOnly defaultValue={leLieu} required />

              <div className="flex flex-col gap-3">
                {categories.map((categorie) => (
                  <div
                    key={categorie}
                    className="gap-3 p-3 rounded-[12px] bg-slate-50 border border-slate-200"
                  >
                    <Heading as="h4">{categorie}</Heading>
                    <table style={{ width: "50%" }} className="border-spacing-10">
                      <tbody>
                        {besoins[categorie].map((besoin) => (
                          <tr key={besoin.id}>
                            <td style={{ width: "50%" }} className="p-1">
                              {besoin.typeObjet.nom} * {besoin.nb}
                            </td>
                            <td style={{ width: "50%" }} className="p-1">
                              {[
                                ...Array(
                                  Math.min(besoin.nb, besoin.typeObjet.objets.length)
                                ).keys(),
                              ].map((n) => (
                                <input
                                  key={n}
                                  hidden
                                  type="number"
                                  readOnly
                                  name={besoin.typeObjetId.toString()}
                                  value={
                                    besoin.typeObjet.objets.sort(function (a, b) {
                                      return a.etat > b.etat ? -1 : 1;
                                    })[n].id
                                  }
                                ></input>
                              ))}

                              <p>
                                {besoin.nb <= besoin.typeObjet.objets.length ? null : (
                                  <span className="rounded-full px-2.5 py-[5px] bg-red-100 text-red-600">
                                    &#9888; {besoin.nb - besoin.typeObjet.objets.length + " "}
                                    {1 < besoin.nb - besoin.typeObjet.objets.length
                                      ? "manquants"
                                      : "manquant"}
                                  </span>
                                )}{" "}
                                {besoin.nb <=
                                  besoin.typeObjet.objets.filter((objet) => objet.etat == "NEUF")
                                    .length ||
                                besoin.typeObjet.objets.filter((objet) => objet.etat == "ABIME")
                                  .length == 0 ? null : (
                                  <span className="rounded-full px-2.5 py-[5px] bg-orange-100 text-orange-600">
                                    &#9888;{" "}
                                    {Math.min(
                                      besoin.nb -
                                        besoin.typeObjet.objets.filter(
                                          (objet) => objet.etat == "NEUF"
                                        ).length,
                                      besoin.typeObjet.objets.filter(
                                        (objet) => objet.etat == "ABIME"
                                      ).length
                                    )}{" "}
                                    {Math.min(
                                      besoin.nb -
                                        besoin.typeObjet.objets.filter(
                                          (objet) => objet.etat == "NEUF"
                                        ).length,
                                      besoin.typeObjet.objets.filter(
                                        (objet) => objet.etat == "ABIME"
                                      ).length
                                    ) > 1
                                      ? "sont abimés"
                                      : "est abimé"}
                                  </span>
                                )}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="mt-6 px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
              >
                enregistrer la representation
              </button>
            </form>
            {/* Separator */}
            <Box className="h-0.5 bg-primary" />
            <div>
              {representations.length == 0 ? (
                <Heading as="h4" className="text-primary mb-2">
                  {spectacle.titre} n&apos;a aucune representations
                </Heading>
              ) : (
                <Heading as="h4" className="text-primary mb-2">
                  representations de {spectacle.titre} :
                </Heading>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {representations.map((representation) => (
                  <div
                    key={representation.id}
                    className="p-6 shadow-md border-l-4 border-l-[#D00039] bg-white rounded-xl transition-all hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {/* Header */}
                    <div>
                      <p className="text-xs text-slate-500 mb-1">#{representation.id}</p>
                      <h4 className="text-lg font-bold text-[#D00039] mb-2">{spectacle.titre}</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          📍 {representation.lieu.libelle}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-2 text-sm">
                      <p>
                        <strong>📅 Date:</strong>{" "}
                        {representation.debutResa.getDate() === representation.finResa.getDate()
                          ? formatDate2(representation.debutResa, representation.finResa)
                          : "du " +
                            formatDate(representation.debutResa) +
                            " au " +
                            formatDate(representation.finResa)}
                      </p>
                      <p>
                        <strong>📍 Adresse:</strong> {representation.lieu.adresse},{" "}
                        {representation.lieu.ville}
                      </p>
                      {representation.lieu.numero_salle && (
                        <p>
                          <strong>🚪 Salle:</strong> {representation.lieu.numero_salle}
                        </p>
                      )}
                    </div>

                    <form action={deleteRepresentation}>
                      <input
                        name="date"
                        hidden
                        type="datetime-local"
                        readOnly
                        value={laDate}
                        required
                      />

                      <input
                        name="spectacleId"
                        hidden
                        type="number"
                        readOnly
                        defaultValue={id}
                        required
                      />

                      <input
                        name="lieuId"
                        hidden
                        type="number"
                        readOnly
                        defaultValue={leLieu}
                        required
                      />

                      <input
                        name="representationId"
                        hidden
                        type="number"
                        readOnly
                        defaultValue={representation.id}
                        required
                      />

                      <button
                        type="submit"
                        className="w-full h-8 text-sm border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-md transition-colors"
                      >
                        🗑️ Supprimer
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
