"use server";

import { prisma } from "@/lib/prisma";

export async function getCachets() {
  return await prisma.cachet.findMany({
    include: {
      spectacle: true,
      membre: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function createCachet(data: {
  membreId: number;
  date: string;
  montant: string;
  spectacleId: number;
  note?: string;
}) {
  try {
    const newCachet = await prisma.cachet.create({
      data: {
        membreId: data.membreId,
        date: new Date(data.date),
        montant: data.montant,
        spectacleId: data.spectacleId,
        note: data.note || null,
      },
      include: {
        spectacle: true,
        membre: {
          include: {
            user: true,
          },
        },
      },
    });

    return { success: true, data: newCachet };
  } catch (error) {
    console.error("Erreur lors de la création du cachet:", error);
    return { success: false, error: "Impossible de créer le cachet" };
  }
}

export async function updateCachet(
  id: number,
  data: {
    membreId: number;
    date: string;
    montant: string;
    spectacleId: number;
    note?: string;
  }
) {
  try {
    const updatedCachet = await prisma.cachet.update({
      where: { id },
      data: {
        membreId: data.membreId,
        date: new Date(data.date),
        montant: data.montant,
        spectacleId: data.spectacleId,
        note: data.note || null,
      },
      include: {
        spectacle: true,
        membre: {
          include: {
            user: true,
          },
        },
      },
    });

    return { success: true, data: updatedCachet };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du cachet:", error);
    return { success: false, error: "Impossible de mettre à jour le cachet" };
  }
}

export async function deleteCachet(id: number) {
  try {
    await prisma.cachet.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du cachet:", error);
    return { success: false, error: "Impossible de supprimer le cachet" };
  }
}

// Récupère tous les membres (pour l'input de selection des membres)
export async function getAllMembers() {
  try {
    const members = await prisma.companyMember.findMany({
      include: {
        user: true,
      },
    });
    return { success: true, data: members };
  } catch (error) {
    console.error("Erreur lors de la récupération des membres:", error);
    return { success: false, error: "Impossible de récupérer les membres" };
  }
}

// Récupère tous les spectacles (pour l'input de selection des spectacles)
export async function getAllSpectacles() {
  try {
    const spectacles = await prisma.spectacle.findMany({
      orderBy: { titre: "asc" },
    });
    return { success: true, data: spectacles };
  } catch (error) {
    console.error("Erreur lors de la récupération des spectacles:", error);
    return { success: false, error: "Impossible de récupérer les spectacles" };
  }
}
