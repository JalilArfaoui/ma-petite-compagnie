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
      include: {
        spectacle: true,
        lieu: true,
        _count: { select: { reservations: true } },
        reservations: {
          include: {
            objet: {
              include: {
                typeObjet: true,
              },
            },
          },
        },
      },
    }),
    prisma.spectacle.findMany({ orderBy: { titre: "asc" }, where: { compagnieId } }),
    prisma.lieu.findMany({ orderBy: { libelle: "asc" } }),
  ]);

  const serialized = JSON.parse(JSON.stringify(representations));

  return (
    <RepresentationsClient representations={serialized} spectacles={spectacles} lieux={lieux} />
  );
}
