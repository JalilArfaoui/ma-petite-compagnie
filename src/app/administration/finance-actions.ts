"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TypeOperation } from "@prisma/client";

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

// ─── Lecture ───

export async function getOperations(type: TypeOperation, compagnieId: number = 1) {
  const operations = await prisma.operationFinanciere.findMany({
    where: { type, compagnieId },
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

export async function getNomsSpectacles(compagnieId: number = 1) {
  const spectacles = await prisma.spectacle.findMany({
    where: { compagnieId },
    select: { titre: true },
    orderBy: { titre: "asc" },
  });
  return spectacles.map((s) => s.titre);
}

// ─── Création ───

export async function creerOperation(data: OperationFormData) {
  // Résoudre les spectacles par leur titre
  const spectacleConnections =
    data.spectacles && data.spectacles.length > 0
      ? await prisma.spectacle.findMany({
          where: { titre: { in: data.spectacles } },
          select: { id: true },
        })
      : [];

  await prisma.operationFinanciere.create({
    data: {
      nom: data.nom,
      montant: data.montant,
      date: new Date(data.date),
      type: data.type,
      categorie: data.categorie,
      statut: data.statut ?? "en_attente",
      fichier: data.fichier,
      compagnieId: 1,
      spectacles: {
        connect: spectacleConnections.map((s) => ({ id: s.id })),
      },
    },
  });

  revalidatePath("/administration");
  revalidatePath("/administration/recettes");
  revalidatePath("/administration/depenses");
}

// ─── Modification ───

export async function modifierOperation(data: OperationFormData) {
  if (!data.id) return;

  const spectacleConnections =
    data.spectacles && data.spectacles.length > 0
      ? await prisma.spectacle.findMany({
          where: { titre: { in: data.spectacles } },
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
}

// ─── Suppression ───

export async function supprimerOperation(id: number) {
  await prisma.operationFinanciere.delete({
    where: { id },
  });

  revalidatePath("/administration");
  revalidatePath("/administration/recettes");
  revalidatePath("/administration/depenses");
}

// ─── Validation (basculer entre "paye" et "en_attente") ───

export async function toggleStatutOperation(id: number, actuel: string) {
  const nouveauStatut = actuel === "paye" ? "en_attente" : "paye";

  await prisma.operationFinanciere.update({
    where: { id },
    data: { statut: nouveauStatut },
  });

  revalidatePath("/administration");
  revalidatePath("/administration/recettes");
  revalidatePath("/administration/depenses");
}
