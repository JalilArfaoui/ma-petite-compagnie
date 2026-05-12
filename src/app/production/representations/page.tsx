import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import RepresentationsClient from "./RepresentationsClient";

export const dynamic = "force-dynamic";

export default async function RepresentationsPage() {
  const session = await auth();
  const compagnieId = Number(session!.activeCompanyId);

  const [representations, spectacles, lieux] = await Promise.all([
    prisma.representation.findMany({
      orderBy: { debutResa: "desc" },
      where: { spectacle: { compagnieId } },
      select: {
        id: true,
        debutResa: true,
        finResa: true,
        spectacleId: true,
        lieuId: true,
        spectacle: { select: { id: true, titre: true } },
        lieu: {
          select: {
            id: true,
            libelle: true,
            adresse: true,
            ville: true,
            numero_salle: true,
          },
        },
        _count: { select: { reservations: true } },
        reservations: {
          select: {
            id: true,
            objet: {
              select: {
                id: true,
                etat: true,
                commentaire: true,
                typeObjet: {
                  select: {
                    id: true,
                    nom: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.spectacle.findMany({
      orderBy: { titre: "asc" },
      where: { compagnieId },
      select: { id: true, titre: true },
    }),
    prisma.lieu.findMany({
      orderBy: { libelle: "asc" },
      select: { id: true, libelle: true, ville: true },
    }),
  ]);

  const serialized = representations.map((r) => ({
    ...r,
    debutResa: r.debutResa.toISOString(),
    finResa: r.finResa.toISOString(),
  }));

  return (
    <RepresentationsClient representations={serialized} spectacles={spectacles} lieux={lieux} />
  );
}
