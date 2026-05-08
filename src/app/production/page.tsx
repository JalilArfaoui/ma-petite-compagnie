import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SpectaclesClient from "./SpectaclesClient";

export const dynamic = "force-dynamic";

export default async function ProductionPage() {
  const session = await auth();
  const compagnieId = Number(session!.activeCompanyId);

  const spectacles = await prisma.spectacle.findMany({
    orderBy: { id: "desc" },
    select: {
      id: true,
      titre: true,
      type: true,
      statut: true,
      imageMimeType: true,
    },
    where: {
      compagnieId: compagnieId,
    },
  });

  const serialized = spectacles.map((s) => ({
    id: s.id,
    titre: s.titre,
    type: s.type,
    statut: s.statut,
    hasImage: !!s.imageMimeType,
  }));

  return <SpectaclesClient spectacles={serialized} />;
}
