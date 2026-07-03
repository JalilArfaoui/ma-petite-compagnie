import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SpectacleDetailClient from "./SpectacleDetailClient";

export const dynamic = "force-dynamic";

export default async function SpectacleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const compagnieId = Number(session!.activeCompanyId);
  const { id } = await params;

  const spectacle = await prisma.spectacle.findFirst({
    where: { id: Number(id), compagnieId },
    select: {
      id: true,
      titre: true,
      description: true,
      type: true,
      statut: true,
      budget_initial: true,
      dure: true,
      imageMimeType: true,
      dossierArtistiqueName: true,
      ficheTechnique: {
        select: { id: true, texte: true, pdfName: true },
      },
      besoins: {
        include: {
          typeObjet: {
            include: { categorie: true },
          },
        },
      },
    },
  });

  if (!spectacle) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-serif text-lg">Ce spectacle n&apos;existe pas</p>
      </div>
    );
  }

  const typeObjets = await prisma.typeObjet.findMany({
    orderBy: { nom: "asc" },
    where: { objets: { some: { compagnieId } } },
    include: { categorie: true },
  });

  const categories = await prisma.categorieObjet.findMany({
    orderBy: { nom: "asc" },
  });

  const serialized = {
    ...spectacle,
    hasImage: !!spectacle.imageMimeType,
    hasDossier: !!spectacle.dossierArtistiqueName,
    dossierArtistiqueName: spectacle.dossierArtistiqueName,
    ficheTechnique: spectacle.ficheTechnique,
    besoins: spectacle.besoins,
  };

  return (
    <SpectacleDetailClient spectacle={serialized} typeObjets={typeObjets} categories={categories} />
  );
}
