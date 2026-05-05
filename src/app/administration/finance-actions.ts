"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TypeOperation } from "@prisma/client";
import { getActiveAdministrationContext } from "./auth-helpers";
import { SpectacleEquilibre } from "./components/types";

// ─── Types pour les données transmises par les formulaires ───

export type OperationFormData = {
  id?: number;
  nom: string;
  montant: number;
  date: string;
  type: "RECETTE" | "DEPENSE";
  categorie?: string; // "facture" ou "financement" pour les recettes
  statut?: string;
  spectacles?: string[]; // titres des spectacles liés
  fichier?: string;
};

export type TresorerieMouvement = {
  id: string;
  nom: string;
  date: string;
  typeOp: "RECETTE" | "DEPENSE";
  montant: number;
  spectacles: string[];
};

export type TresorerieData = {
  soldeActuel: number;
  totalEncaisse: number;
  totalDepense: number;
  nombreMouvements: number;
  derniereDateMouvement: string | null;
  mouvements: TresorerieMouvement[];
};

// ─── Lecture ───

export async function getOperations(type: TypeOperation) {
  const context = await getActiveAdministrationContext();
  if (!context.ok) throw new Error(context.error);

  const operations = await prisma.operationFinanciere.findMany({
    where: { type, compagnieId: context.compagnieId },
    include: { spectacles: { select: { id: true, titre: true } } },
    orderBy: { date: "desc" },
  });

  return operations.map((op) => ({
    id: op.id.toString(),
    nom: op.nom,
    montant: op.montant,
    date: op.date.toISOString().split("T")[0],
    type: (op.categorie ?? "facture") as "facture" | "financement",
    typeOp: op.type, // RECETTE ou DEPENSE
    statut: (op.statut ?? "en_attente") as "en_attente" | "paye",
    source: op.source,
    spectacles: op.spectacles.map((s) => s.titre),
    fichier: op.fichier ?? undefined,
  }));
}

export async function getNomsSpectacles() {
  const context = await getActiveAdministrationContext();
  if (!context.ok) throw new Error(context.error);

  const spectacles = await prisma.spectacle.findMany({
    where: { compagnieId: context.compagnieId },
    select: { titre: true },
    orderBy: { titre: "asc" },
  });
  return spectacles.map((s) => s.titre);
}

export async function getEquilibresSpectacles(): Promise<SpectacleEquilibre[]> {
  const context = await getActiveAdministrationContext();
  if (!context.ok) throw new Error(context.error);

  const spectacles = await prisma.spectacle.findMany({
    where: { compagnieId: context.compagnieId },
    select: {
      id: true,
      titre: true,
      budget_initial: true,
      operations: {
        select: {
          montant: true,
          type: true,
          statut: true,
        },
      },
    },
    orderBy: { titre: "asc" },
  });

  return spectacles.map((spectacle) => {
    const { recettesPayees, recettesEnAttente, depenses } = spectacle.operations.reduce(
      (totaux, op) => {
        if (op.type === "RECETTE" && op.statut === "paye") {
          totaux.recettesPayees += op.montant;
        } else if (op.type === "RECETTE" && op.statut === "en_attente") {
          totaux.recettesEnAttente += op.montant;
        } else if (op.type === "DEPENSE") {
          totaux.depenses += op.montant;
        }
        return totaux;
      },
      { recettesPayees: 0, recettesEnAttente: 0, depenses: 0 }
    );
    const baseBudget = spectacle.budget_initial + recettesPayees;
    const pourcentageConsomme = baseBudget <= 0 ? 0 : Math.min((depenses / baseBudget) * 100, 100);

    return {
      id: spectacle.id,
      nom: spectacle.titre,
      budgetInitial: spectacle.budget_initial,
      recettesPayees,
      recettesEnAttente,
      depenses,
      montant: spectacle.budget_initial + recettesPayees - depenses,
      pourcentageConsomme,
    };
  });
}

export async function getTresorerieReelle(): Promise<TresorerieData> {
  const context = await getActiveAdministrationContext();
  if (!context.ok) throw new Error(context.error);

  const operations = await prisma.operationFinanciere.findMany({
    where: {
      compagnieId: context.compagnieId,
      OR: [{ type: "DEPENSE" }, { type: "RECETTE", statut: "paye" }],
    },
    select: {
      id: true,
      nom: true,
      montant: true,
      date: true,
      type: true,
      spectacles: { select: { titre: true } },
    },
    orderBy: { date: "desc" },
  });

  let totalEncaisse = 0;
  let totalDepense = 0;
  const mouvements = operations.map((op) => {
    if (op.type === "RECETTE") {
      totalEncaisse += op.montant;
    } else {
      totalDepense += op.montant;
    }

    return {
      id: op.id.toString(),
      nom: op.nom,
      date: op.date.toISOString().split("T")[0],
      typeOp: op.type,
      montant: op.type === "DEPENSE" ? -op.montant : op.montant,
      spectacles: op.spectacles.map((s) => s.titre),
    };
  });

  return {
    soldeActuel: totalEncaisse - totalDepense,
    totalEncaisse,
    totalDepense,
    nombreMouvements: mouvements.length,
    derniereDateMouvement: mouvements[0]?.date ?? null,
    mouvements,
  };
}

// ─── Création ───

export async function creerOperation(data: OperationFormData) {
  const context = await getActiveAdministrationContext();
  if (!context.ok) return { error: context.error };

  // Résoudre les spectacles par leur titre
  const spectacleConnections =
    data.spectacles && data.spectacles.length > 0
      ? await prisma.spectacle.findMany({
          where: { titre: { in: data.spectacles }, compagnieId: context.compagnieId },
          select: { id: true },
        })
      : [];

  const operation = await prisma.operationFinanciere.create({
    data: {
      nom: data.nom,
      montant: data.montant,
      date: new Date(data.date),
      type: data.type,
      categorie: data.categorie,
      statut: data.statut ?? "en_attente",
      fichier: data.fichier,
      compagnie: { connect: { id: context.compagnieId } },
      spectacles: {
        connect: spectacleConnections.map((s) => ({ id: s.id })),
      },
    },
    include: { spectacles: { select: { titre: true } } },
  });

  revalidatePath("/administration");
  revalidatePath("/administration/recettes");
  revalidatePath("/administration/depenses");
  revalidatePath("/administration/equilibre-financier");
  revalidatePath("/administration/tresorerie");
  return {
    success: true,
    operation: {
      id: operation.id.toString(),
      nom: operation.nom,
      montant: operation.montant,
      date: operation.date.toISOString().split("T")[0],
      type: (operation.categorie ?? "facture") as "facture" | "financement",
      typeOp: operation.type,
      statut: (operation.statut ?? "en_attente") as "en_attente" | "paye",
      source: operation.source,
      spectacles: operation.spectacles.map((s) => s.titre),
      fichier: operation.fichier ?? undefined,
    },
  };
}

// ─── Modification ───

export async function modifierOperation(data: OperationFormData) {
  if (!data.id) return;

  const context = await getActiveAdministrationContext();
  if (!context.ok) return { error: context.error };

  const operation = await prisma.operationFinanciere.findFirst({
    where: { id: data.id, compagnieId: context.compagnieId },
    select: { id: true },
  });
  if (!operation) return { error: "Opération introuvable" };

  const spectacleConnections =
    data.spectacles && data.spectacles.length > 0
      ? await prisma.spectacle.findMany({
          where: { titre: { in: data.spectacles }, compagnieId: context.compagnieId },
          select: { id: true },
        })
      : [];

  await prisma.operationFinanciere.update({
    where: { id: data.id },
    data: {
      nom: data.nom,
      montant: data.montant,
      date: new Date(data.date),
      categorie: data.categorie,
      statut: data.statut,
      fichier: data.fichier,
      spectacles: {
        set: spectacleConnections.map((s) => ({ id: s.id })),
      },
    },
  });

  revalidatePath("/administration");
  revalidatePath("/administration/recettes");
  revalidatePath("/administration/depenses");
  revalidatePath("/administration/equilibre-financier");
  revalidatePath("/administration/tresorerie");
  return { success: true };
}

// ─── Suppression ───

export async function supprimerOperation(id: number) {
  const context = await getActiveAdministrationContext();
  if (!context.ok) return { error: context.error };

  const operation = await prisma.operationFinanciere.findFirst({
    where: { id, compagnieId: context.compagnieId },
    select: { id: true },
  });
  if (!operation) return { error: "Opération introuvable" };

  await prisma.operationFinanciere.delete({
    where: { id },
  });

  revalidatePath("/administration");
  revalidatePath("/administration/recettes");
  revalidatePath("/administration/depenses");
  revalidatePath("/administration/equilibre-financier");
  revalidatePath("/administration/tresorerie");
  return { success: true };
}

// ─── Validation (basculer entre "paye" et "en_attente") ───

export async function toggleStatutOperation(id: number, actuel: string) {
  const context = await getActiveAdministrationContext();
  if (!context.ok) return { error: context.error };

  const operation = await prisma.operationFinanciere.findFirst({
    where: { id, compagnieId: context.compagnieId },
    select: { id: true },
  });
  if (!operation) return { error: "Opération introuvable" };

  const nouveauStatut = actuel === "paye" ? "en_attente" : "paye";

  await prisma.operationFinanciere.update({
    where: { id },
    data: { statut: nouveauStatut },
  });

  revalidatePath("/administration");
  revalidatePath("/administration/recettes");
  revalidatePath("/administration/depenses");
  revalidatePath("/administration/equilibre-financier");
  revalidatePath("/administration/tresorerie");
  return { success: true };
}
