import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@/components/ui";
import { Prisma, BesoinSpectacle, StatutSpectacle, TypeSpectacle } from "@prisma/client";

export const dynamic = "force-dynamic";

async function reserver(formData: FormData) {
  "use server";

  const date = new Date(formData.get("date") as string);
  const spectacleId = Number(formData.get("spectacleId"));
  const lieuId = Number(formData.get("lieuId"));

  const rep = await prisma.representation.create({
    data: { date, spectacleId, lieuId },
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

  revalidatePath("/production");
  redirect(`/production/spectacles/${spectacleId}/reserver`);
}

async function getObjets(formData: FormData) {
  "use server";

  const date = formData.get("date") as string;
  const spectacleId = formData.get("spectacleId") as string;

  redirect(`/production/spectacles/${spectacleId}/reserver?date=${encodeURIComponent(date)}`);
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

const compagnieId = 1; // TODO: remplacer par l'id de la compagnie connectée

export default async function ProductionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const { id } = await params;
  const { date: dateParam } = await searchParams;
  const laDate = dateParam ? new Date(dateParam) : null;

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
    if (laDate == null) {
      return (
        <div id="main">
          <div>
            {representations.length == 0 ? (
              <Heading as="h4" className="text-primary mb-2">
                ce spectacle n&apos;a aucune representations
              </Heading>
            ) : (
              <Heading as="h4" className="text-primary mb-2">
                representations du spectacle :
              </Heading>
            )}
            {representations.map((representation) => (
              <p key={representation.id}>
                le {formatDate(representation.date)} a {representation.lieu.libelle}{" "}
                {representation.lieu.ville}
              </p>
            ))}
          </div>
          <form action={getObjets}>
            <input name="spectacleId" type="hidden" value={id} />
            <div>
              <label className="block font-semibold mb-2">date de reservation</label>
              <input
                name="date"
                type="datetime-local"
                required
                className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
            >
              confirmer cette date
            </button>
          </form>
        </div>
      );
    } else {
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
                        date: laDate,
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
      const besoins: { [id: string]: typeof req } = {};
      const categories: string[] = [];
      req.forEach((element) => {
        if (besoins[element.typeObjet.categorie.nom] == undefined) {
          categories.push(element.typeObjet.categorie.nom);
          besoins[element.typeObjet.categorie.nom] = [];
        }
        besoins[element.typeObjet.categorie.nom].push(element);
      });

      const lieux = await prisma.lieu.findMany({
        select: {
          id: true,
          ville: true,
          libelle: true,
        },
      });
      return (
        <div id="main">
          <div>
            {representations.length == 0 ? (
              <Heading as="h4" className="text-primary mb-2">
                ce spectacle n&apos;a aucune representations
              </Heading>
            ) : (
              <Heading as="h4" className="text-primary mb-2">
                representations du spectacle :
              </Heading>
            )}
            {representations.map((representation) => (
              <p key={representation.id}>
                le {formatDate(representation.date)} a {representation.lieu.libelle}{" "}
                {representation.lieu.ville}
              </p>
            ))}
          </div>
          {/* Separator */}
          <Box className="h-0.5 bg-primary" />
          <form action={getObjets}>
            <input name="spectacleId" type="hidden" value={id} />
            <div>
              <label className="block font-semibold mb-2">date de reservation</label>
              <input
                name="date"
                type="datetime-local"
                defaultValue={formatDateInput(laDate)}
                required
                className="w-full p-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
            >
              modifier la date
            </button>
          </form>
          <form action={reserver}>
            <input
              name="date"
              hidden
              type="datetime-local"
              readOnly
              value={formatDateInput(laDate)}
              required
            />

            <input
              name="spectacleId"
              hidden
              type="number"
              readOnly
              defaultValue={spectacle.id}
              required
            />

            {categories.map((categorie) => (
              <Card
                key={categorie}
                className="p-6 shadow-md border-l-4 border-l-primary bg-white transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <Heading as="h4" className="text-primary mb-2">
                  {categorie}
                </Heading>
                <table style={{ width: "50%" }}>
                  <tbody>
                    {besoins[categorie].map((besoin) => (
                      <tr key={besoin.id}>
                        <td style={{ width: "50%" }}>
                          {besoin.typeObjet.nom} * {besoin.nb}
                        </td>
                        <td style={{ width: "50%" }}>
                          {[
                            ...Array(Math.min(besoin.nb, besoin.typeObjet.objets.length)).keys(),
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
                              <span className="text-red-600">
                                &#9888;
                                {besoin.nb - besoin.typeObjet.objets.length + " "}
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
                              <span className="text-orange-600">
                                &#9888;{" "}
                                {Math.min(
                                  besoin.nb -
                                    besoin.typeObjet.objets.filter((objet) => objet.etat == "NEUF")
                                      .length,
                                  besoin.typeObjet.objets.filter((objet) => objet.etat == "ABIME")
                                    .length
                                )}{" "}
                                {Math.min(
                                  besoin.nb -
                                    besoin.typeObjet.objets.filter((objet) => objet.etat == "NEUF")
                                      .length,
                                  besoin.typeObjet.objets.filter((objet) => objet.etat == "ABIME")
                                    .length
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
              </Card>
            ))}
            {/* Separator */}
            <Box className="h-0.5 bg-primary" />
            <div>
              <select name="lieuId" required defaultValue="">
                <option disabled value="">
                  choisir le lieu
                </option>
                {lieux.map((lieu) => (
                  <option key={lieu.id} value={lieu.id}>
                    {lieu.libelle} {lieu.ville}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
            >
              enregistrer la representation
            </button>
          </form>
        </div>
      );
    }
  }
}
