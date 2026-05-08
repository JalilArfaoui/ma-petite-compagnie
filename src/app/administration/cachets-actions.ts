"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const MONTANT_CACHET_MINIMUM_LEGAL: number = 110;
const NOTE_NB_MAX_CARACS: number = 120;

//vérifie si le membre est connecté et à accès à la page gestion cachets
//(pas besoin de vérifier pour vision cachets puisque tous les membres de la compagnie y ont accès)
export async function accesPageAuth(): Promise<{
  estConnecte: boolean;
  idUtilisateurConnecte?: number;
  peutAccederGestionCachets?: boolean;
  error?: string;
}> {
  let session; //let au lieu de const pour pouvoir l'utiliser en dehors du premier try/catch, et pour pouvoir assigner une nouvelle valeur dessus
  let id_utilisateur_connecte: number = -1;

  try {
    session = await auth();
    if (!session) return { estConnecte: false as const, error: "Non autorisé" };
  } catch (error) {
    console.error("Erreur lors de l'authentification:", error);
    return { estConnecte: false as const, error: "Erreur lors de l'authentification" };
  }

  try {
    const membreCompagnie = await prisma.companyMember.findFirst({
      where: {
        userId: Number(session.user.id),
      },
    });

    if (!membreCompagnie) {
      return { estConnecte: false as const, error: "Membre de la compagnie non trouvé" };
    } else {
      id_utilisateur_connecte = membreCompagnie.id;
    }

    if (membreCompagnie.droitAccesAdministration) {
      return {
        estConnecte: true,
        idUtilisateurConnecte: id_utilisateur_connecte,
        peutAccederGestionCachets: true,
      };
    } else {
      return {
        estConnecte: true,
        idUtilisateurConnecte: id_utilisateur_connecte,
        peutAccederGestionCachets: false,
      };
    }
  } catch (error) {
    console.error("Erreur lors de la vérification des droits d'accès:", error);
    return {
      estConnecte: false as const,
      error: "Erreur lors de la vérification des droits d'accès",
    };
  }
}

//fonction helper pour valider les données d'un cachet
async function validerCachetDataAction(data: {
  membreId: number;
  date: string;
  montant: number;
  spectacleId: number;
  note?: string;
}): Promise<{ valid: boolean; error?: string }> {
  if (!Number.isInteger(data.membreId) || data.membreId <= 0) {
    return { valid: false, error: "L'identifiant du membre est invalide" };
  }

  if (!Number.isInteger(data.spectacleId) || data.spectacleId <= 0) {
    return { valid: false, error: "L'identifiant du spectacle est invalide" };
  }

  const dateObj = new Date(data.date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: "La date est invalide" };
  }

  if (data.montant < MONTANT_CACHET_MINIMUM_LEGAL) {
    return {
      valid: false,
      error: `Le montant doit être un nombre >= ${MONTANT_CACHET_MINIMUM_LEGAL}`,
    };
  }

  if (data.note && data.note.length > NOTE_NB_MAX_CARACS) {
    return { valid: false, error: `La note ne peut pas dépasser ${NOTE_NB_MAX_CARACS} caractères` };
  }

  return { valid: true };
}

export async function getCachetsAction() {
  const session = await auth();
  if (!session) return { success: false as const, error: "Non autorisé" };

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
  montant: number;
  spectacleId: number;
  note?: string;
}) {
  //authentification
  const session = await auth();
  if (!session) return { success: false, error: "Non autorisé" };

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
    montant: number;
    spectacleId: number;
    note?: string;
  }
) {
  const session = await auth();
  if (!session) return { success: false, error: "Non autorisé" };

  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, error: "L'identifiant du cachet est invalide" };
  }

  const validation = await validerCachetDataAction(data);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const cachetExistant = await prisma.cachet.findUnique({
      where: { id },
    });
    if (!cachetExistant) {
      return { success: false, error: "Le cachet spécifié n'existe pas" };
    }

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
  const session = await auth();
  if (!session) return { success: false, error: "Non autorisé" };

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
  const session = await auth();
  if (!session) return { success: false, error: "Non autorisé" };

  try {
    const membreCompagnie = await prisma.companyMember.findMany({
      include: {
        user: true,
      },
    });
    return { success: true, data: membreCompagnie };
  } catch (error) {
    console.error("Erreur lors de la récupération des membres:", error);
    return { success: false, error: "Impossible de récupérer les membres" };
  }
}

//pour l'input de selection des spectacles
export async function getAllSpectaclesAction() {
  const session = await auth();
  if (!session) return { success: false, error: "Non autorisé" };

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
