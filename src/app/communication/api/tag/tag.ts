"use server";
import { prisma } from "@/lib/prisma";
import { resultOf } from "../../utils/helper";

export type TagInformation = {
  nom: string;
  couleur?: string;
};

/** Récupère tous les tags existants. */
export async function listerTags() {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { nom: "asc" } });
    return resultOf(true, "", tags);
  } catch {
    return resultOf(false, "Erreur lors de la récupération des tags.", null);
  }
}

/** Récupère les tags d'un contact spécifique. */
export async function listerTagsContact(contactId: number) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { tags: true },
    });
    if (!contact) return resultOf(false, "Contact introuvable.", null);
    return resultOf(true, "", contact.tags);
  } catch {
    return resultOf(false, "Erreur lors de la récupération des tags du contact.", null);
  }
}

/** Crée un nouveau tag. */
export async function creerTag(info: TagInformation) {
  if (!info.nom || info.nom.trim().length === 0) {
    return resultOf(false, "Le nom du tag ne peut pas être vide.", null);
  }
  try {
    const tag = await prisma.tag.create({
      data: { nom: info.nom.trim(), couleur: info.couleur ?? "#6366f1" },
    });
    return resultOf(true, "", tag);
  } catch {
    return resultOf(false, "Ce tag existe déjà ou une erreur est survenue.", null);
  }
}

/** Supprime un tag (le retire aussi de tous les contacts). */
export async function supprimerTag(tagId: number) {
  try {
    await prisma.tag.delete({ where: { id: tagId } });
    return resultOf(true, "", null);
  } catch {
    return resultOf(false, "Le tag n'a pas pu être supprimé.", null);
  }
}

/** Ajoute un tag à un contact. */
export async function ajouterTagAuContact(contactId: number, tagId: number) {
  try {
    await prisma.contact.update({
      where: { id: contactId },
      data: { tags: { connect: { id: tagId } } },
    });
    return resultOf(true, "", null);
  } catch {
    return resultOf(false, "Impossible d'ajouter le tag au contact.", null);
  }
}

/** Retire un tag d'un contact. */
export async function retirerTagDuContact(contactId: number, tagId: number) {
  try {
    await prisma.contact.update({
      where: { id: contactId },
      data: { tags: { disconnect: { id: tagId } } },
    });
    return resultOf(true, "", null);
  } catch {
    return resultOf(false, "Impossible de retirer le tag du contact.", null);
  }
}

/** Remplace tous les tags d'un contact par une nouvelle liste. */
export async function definirTagsContact(contactId: number, tagIds: number[]) {
  try {
    await prisma.contact.update({
      where: { id: contactId },
      data: { tags: { set: tagIds.map((id) => ({ id })) } },
    });
    return resultOf(true, "", null);
  } catch {
    return resultOf(false, "Impossible de mettre à jour les tags du contact.", null);
  }
}
