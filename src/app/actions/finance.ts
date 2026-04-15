"use server";

import { prisma } from "@/lib/prisma";
import { FactureStatus, LigneType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

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
  const session = await auth();
  if (!session?.activeCompanyId) {
    throw new Error("Aucune compagnie active.");
  }
  const compagnieId = session.activeCompanyId;

  const compagnie = await prisma.compagnie.findUnique({
    where: { id: compagnieId },
  });

  if (!compagnie) throw new Error("Compagnie introuvable");

  const newFacture = await prisma.$transaction(async (tx) => {
    const year = new Date().getFullYear();
    const prefix = `FACT-${year}-`;

    // Find last invoice from this year
    const lastFacture = await tx.facture.findFirst({
      where: {
        numero: { startsWith: prefix },
        compagnieId,
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
    const lieu = data.lieuFacturation?.trim() || compagnie.ville || "";

    return await tx.facture.create({
      data: {
        numero,
        dateEcheance: data.dateEcheance,
        lieuFacturation: lieu,
        clientNom: data.clientNom,
        clientAdresse: data.clientAdresse,
        compagnieId,
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
  const session = await auth();
  if (!session?.activeCompanyId) return [];

  return await prisma.facture.findMany({
    where: { compagnieId: session.activeCompanyId },
    orderBy: { dateEmission: "desc" },
    include: {
      lignes: true,
      compagnie: true,
    },
  });
}

export async function getFactureById(id: number) {
  const session = await auth();
  if (!session?.activeCompanyId) return null;

  return await prisma.facture.findUnique({
    where: { 
      id,
      compagnieId: session.activeCompanyId
    },
    include: { lignes: true, compagnie: true },
  });
}
