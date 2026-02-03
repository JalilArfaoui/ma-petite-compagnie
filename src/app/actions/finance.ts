"use server";

import { prisma } from "@/lib/prisma";
import { FactureStatus, LigneType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper to get the current company context
// In a real app, this would come from the user's session
export async function getCompagnie() {
  const first = await prisma.compagnie.findFirst();
  if (first) return first;

  // Fallback for development/initialization
  return await prisma.compagnie.create({
    data: {
      nom: "Ma Petite Compagnie",
      adresse: "1 rue de la Paix",
      ville: "Paris",
      codePostal: "75000",
    },
  });
}

export async function getInfosCompagnie() {
  return await getCompagnie();
}

export async function updateInfoCompagnie(data: {
  adresse?: string;
  ville?: string;
  codePostal?: string;
  siteWeb?: string;
  rib?: string;
}) {
  const compagnie = await getCompagnie();

  await prisma.compagnie.update({
    where: { id: compagnie.id },
    data: { ...data },
  });

  revalidatePath("/administration/entreprise");
  revalidatePath("/administration/factures/nouveau");
}

export type CreateFactureData = {
  dateEcheance: Date;
  lieuFacturation?: string;
  clientNom: string;
  clientAdresse?: string;
  lignes: {
    designation: string;
    quantite: number;
    prixUnitaireHT: number;
    tva: number;
    type: LigneType;
  }[];
};

export async function creerFacture(data: CreateFactureData) {
  const compagnie = await getCompagnie();

  const newFacture = await prisma.$transaction(async (tx) => {
    const year = new Date().getFullYear();
    const prefix = `FACT-${year}-`;

    // Find last invoice from this year
    const lastFacture = await tx.facture.findFirst({
      where: {
        numero: { startsWith: prefix },
        compagnieId: compagnie.id,
      },
      orderBy: { numero: "desc" },
    });

    let nextSeq = 1;
    if (lastFacture) {
      const parts = lastFacture.numero.split("-");
      const lastSeq = parseInt(parts[parts.length - 1]);
      if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
    }

    const numero = `${prefix}${nextSeq.toString().padStart(4, "0")}`;

    // Default location if empty
    const lieu = data.lieuFacturation?.trim() || compagnie.ville || "Paris";

    return await tx.facture.create({
      data: {
        numero,
        dateEcheance: data.dateEcheance,
        lieuFacturation: lieu,
        clientNom: data.clientNom,
        clientAdresse: data.clientAdresse,
        compagnieId: compagnie.id,
        lignes: {
          create: data.lignes.map((l) => ({
            designation: l.designation,
            quantite: l.quantite,
            prixUnitaireHT: l.prixUnitaireHT,
            tva: l.tva,
            type: l.type,
          })),
        },
      },
    });
  });

  revalidatePath("/administration/factures");
  redirect("/administration/factures");
}

export async function getFactures() {
  const compagnie = await getCompagnie();
  return await prisma.facture.findMany({
    where: { compagnieId: compagnie.id },
    orderBy: { dateEmission: "desc" },
    include: {
      lignes: true,
      compagnie: true,
    },
  });
}

export async function getFactureById(id: number) {
  return await prisma.facture.findUnique({
    where: { id },
    include: { lignes: true, compagnie: true },
  });
}
