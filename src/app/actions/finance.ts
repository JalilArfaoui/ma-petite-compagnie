"use server";

import { prisma } from "@/lib/prisma";
import { FactureStatus, LigneType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export type CreateFactureData = {
  numero?: string;
  dateEcheance: Date;
  lieuFacturation?: string;
  clientNom: string;
  clientAdresse: string;
  clientSiren?: string;
  estBrouillon: boolean;
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

  await prisma.$transaction(async (tx) => {
    let finalNumero = data.numero?.trim();

    if (data.estBrouillon) {
      if (!finalNumero) {
        finalNumero = `DRAFT-${Date.now()}`;
      }
    } else {
      if (!finalNumero || finalNumero.startsWith("DRAFT-")) {
        const year = new Date().getFullYear();
        const prefix = `FACT-${year}-`;
        const lastFacture = await tx.facture.findFirst({
          where: { numero: { startsWith: prefix }, compagnieId },
          orderBy: { numero: "desc" },
        });
        let nextSeq = 1;
        if (lastFacture) {
          const parts = lastFacture.numero.split("-");
          const lastSeq = parseInt(parts[parts.length - 1]);
          if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
        }
        finalNumero = `${prefix}${nextSeq.toString().padStart(4, "0")}`;
      }
    }

    const lieu = data.lieuFacturation?.trim() || compagnie.ville || "";

    return await tx.facture.create({
      data: {
        numero: finalNumero!,
        dateEcheance: data.dateEcheance,
        lieuFacturation: lieu,
        clientNom: data.clientNom,
        clientAdresse: data.clientAdresse,
        clientSiren: data.clientSiren,
        status: data.estBrouillon ? FactureStatus.BROUILLON : FactureStatus.EMISE,
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

  const created = await prisma.facture.findFirst({
    where: { compagnieId },
    orderBy: { createdAt: "desc" },
  });

  revalidatePath("/administration/factures");
  if (data.estBrouillon && created) {
    redirect(`/administration/factures/${created.id}`);
  } else {
    redirect("/administration/factures");
  }
}

export async function updateFacture(id: number, data: CreateFactureData) {
  const session = await auth();
  if (!session?.activeCompanyId) {
    throw new Error("Aucune compagnie active.");
  }
  const compagnieId = session.activeCompanyId;

  const existing = await prisma.facture.findUnique({
    where: { id, compagnieId },
  });

  if (!existing) throw new Error("Facture introuvable");
  if (existing.status !== "BROUILLON") throw new Error("Seuls les brouillons peuvent être modifiés");

  await prisma.$transaction(async (tx) => {
    let finalNumero = data.numero?.trim() || existing.numero;

    if (!data.estBrouillon && finalNumero.startsWith("DRAFT-")) {
      // Transition DRAFT -> EMISE : assign a sequential number
      const year = new Date().getFullYear();
      const prefix = `FACT-${year}-`;
      const lastFacture = await tx.facture.findFirst({
        where: { numero: { startsWith: prefix }, compagnieId },
        orderBy: { numero: "desc" },
      });
      let nextSeq = 1;
      if (lastFacture) {
        const parts = lastFacture.numero.split("-");
        const lastSeq = parseInt(parts[parts.length - 1]);
        if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
      }
      finalNumero = `${prefix}${nextSeq.toString().padStart(4, "0")}`;
    }

    const lieu = data.lieuFacturation?.trim() || "";

    // Replace lines
    await tx.ligneFacture.deleteMany({ where: { factureId: id } });

    return await tx.facture.update({
      where: { id },
      data: {
        numero: finalNumero,
        dateEcheance: data.dateEcheance,
        lieuFacturation: lieu,
        clientNom: data.clientNom,
        clientAdresse: data.clientAdresse,
        clientSiren: data.clientSiren,
        status: data.estBrouillon ? FactureStatus.BROUILLON : FactureStatus.EMISE,
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

export async function supprimerBrouillon(id: number) {
  const session = await auth();
  if (!session?.activeCompanyId) throw new Error("Non autorisé");

  const facture = await prisma.facture.findUnique({
    where: { id, compagnieId: session.activeCompanyId },
  });

  if (!facture) throw new Error("Facture introuvable");
  if (facture.status !== "BROUILLON") throw new Error("Seuls les brouillons peuvent être supprimés");

  await prisma.facture.delete({ where: { id } });

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
