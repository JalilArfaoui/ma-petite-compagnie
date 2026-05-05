"use server";
import { TypeEchange } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { resultOf } from "../../utils/helper";

export type EchangeInformation = {
  contactId: number;
  type: TypeEchange;
  description: string;
  date?: Date;
};

/** Liste tous les échanges d'un contact, du plus récent au plus ancien. */
export async function listerEchanges(contactId: number) {
  try {
    const echanges = await prisma.echange.findMany({
      where: { contactId },
      orderBy: { date: "desc" },
    });
    return resultOf(true, "", echanges);
  } catch {
    return resultOf(false, "Erreur lors de la récupération des échanges.", null);
  }
}

/** Ajoute un échange dans l'historique d'un contact. */
export async function ajouterEchange(info: EchangeInformation) {
  if (!info.description || info.description.trim().length === 0) {
    return resultOf(false, "La description de l'échange ne peut pas être vide.", null);
  }
  try {
    const echange = await prisma.echange.create({
      data: {
        contactId: info.contactId,
        type: info.type,
        description: info.description.trim(),
        date: info.date ?? new Date(),
      },
    });
    return resultOf(true, "", echange);
  } catch {
    return resultOf(false, "Erreur lors de l'ajout de l'échange.", null);
  }
}

/** Supprime un échange de l'historique. */
export async function supprimerEchange(echangeId: number) {
  try {
    await prisma.echange.delete({ where: { id: echangeId } });
    return resultOf(true, "", null);
  } catch {
    return resultOf(false, "L'échange n'a pas pu être supprimé.", null);
  }
}
