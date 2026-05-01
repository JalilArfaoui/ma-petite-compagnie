"use server";

import { prisma } from "@/lib/prisma";

//fonction helper pour valider les données d'un cachet
async function validerCachetDataAction(data: {
  membreId: number;
  date: string;
  montant: string;
  spectacleId: number;
  note?: string;
}): Promise<{ valid: boolean; error?: string }> {
  if (!Number.isInteger(data.membreId) || data.membreId <= 0) {
    return { valid: false, error: "L'identifiant du membre est invalide" };
  }

  const membre = await prisma.companyMember.findUnique({
    where: { id: data.membreId },
  });
  if (!membre) {
    return { valid: false, error: "Le membre spécifié n'existe pas" };
  }

  if (!Number.isInteger(data.spectacleId) || data.spectacleId <= 0) {
    return { valid: false, error: "L'identifiant du spectacle est invalide" };
  }

  const spectacle = await prisma.spectacle.findUnique({
    where: { id: data.spectacleId },
  });
  if (!spectacle) {
    return { valid: false, error: "Le spectacle spécifié n'existe pas" };
  }

  const dateObj = new Date(data.date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: "La date est invalide" };
  }

  const montantNum = parseFloat(data.montant.replace(/[^\d.,-]/g, "").replace(",", "."));
  if (isNaN(montantNum) || montantNum < 110) {
    return { valid: false, error: "Le montant doit être un nombre >= 110" };
  }

  if (data.note && data.note.length > 120) {
    return { valid: false, error: "La note ne peut pas dépasser 120 caractères" };
  }

  return { valid: true };
}

export async function getCachetsAction() {
  try {
    const cachets = await prisma.cachet.findMany({
      include: {
        spectacle: true,
        membre: {
          include: {
            user: true,
          },
        },
      },
    });
    return { success: true, data: cachets };
  } catch (error) {
    console.error("Erreur lors de la récupération des cachets:", error);
    return { success: false, error: "Impossible de récupérer les cachets" };
  }
}

export async function creerCachetAction(data: {
  membreId: number;
  date: string;
  montant: string;
  spectacleId: number;
  note?: string;
}) {
  //validation côté serveur
  const validation = await validerCachetDataAction(data);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const nouvCachet = await prisma.cachet.create({
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

    return { success: true, data: nouvCachet };
  } catch (error) {
    console.error("Erreur lors de la création du cachet:", error);
    return { success: false, error: "Impossible de créer le cachet" };
  }
}

export async function mettreAJourCachetAction(
  id: number,
  data: {
    membreId: number;
    date: string;
    montant: string;
    spectacleId: number;
    note?: string;
  }
) {
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, error: "L'identifiant du cachet est invalide" };
  }

  const validation = await validerCachetDataAction(data);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const cachetExistant = await prisma.cachet.findUnique({
    where: { id },
  });
  if (!cachetExistant) {
    return { success: false, error: "Le cachet spécifié n'existe pas" };
  }

  try {
    const cachetMisAJour = await prisma.cachet.update({
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

    return { success: true, data: cachetMisAJour };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du cachet:", error);
    return { success: false, error: "Impossible de mettre à jour le cachet" };
  }
}

export async function supprimerCachetAction(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, error: "L'identifiant du cachet est invalide" };
  }

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

//pour l'input de selection des membres
export async function getAllMembresAction() {
  try {
    const membres = await prisma.companyMember.findMany({
      include: {
        user: true,
      },
    });
    return { success: true, data: membres };
  } catch (error) {
    console.error("Erreur lors de la récupération des membres:", error);
    return { success: false, error: "Impossible de récupérer les membres" };
  }
}

//pour l'input de selection des spectacles
export async function getAllSpectaclesAction() {
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
