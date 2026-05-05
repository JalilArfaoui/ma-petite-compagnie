"use server";
import { prisma } from "@/lib/prisma";
import { Contact } from "@prisma/client";
import { resolvePagination, resultOf } from "../../utils/helper";

export async function trouverListeParNom(nomListe: string) {
  try {
    const resultat = await prisma.listeContact.findFirst({ where: { nom: nomListe } });
    return resultOf(true, "", resultat);
  } catch (error: unknown) {
    console.error(error);
    return resultOf(false, "Impossible de récupérer les listes par nom", null);
  }
}
export async function trouverListes(paginationTaille: number = 10, page: number = 1) {
  let skip;
  ({ skip, paginationTaille } = resolvePagination(paginationTaille, page));
  try {
    const resultat = await prisma.listeContact.findMany({ skip, take: paginationTaille });
    return resultOf(true, "", resultat);
  } catch (error: unknown) {
    console.error(error);
    return resultOf(false, "Impossible de récupérer les listes", null);
  }
}
export async function creerListe(nomListe: string, contacts: Contact[]) {
  try {
    const listeIds = contacts.map((contact) => {
      return { id: contact.id };
    });
    const resultat = await prisma.listeContact.upsert({
      where: { nom: nomListe },
      update: {
        contacts: {
          connect: listeIds,
        },
      },
      create: {
        nom: nomListe,
        contacts: {
          connect: listeIds,
        },
      },
    });

    return resultOf(true, "", resultat);
  } catch (error: unknown) {
    console.error(error);
    return resultOf(false, "Une erreur est survenue lors de la création de la liste", null);
  }
}

export async function trouverListesAvecIdContact(id: number) {
  try {
    const resultat = await prisma.listeContact.findMany({
      where: { contacts: { some: { id: id } } },
    });
    return resultOf(true, "", resultat);
  } catch (error: unknown) {
    console.error(error);
    return resultOf(false, "Une erreur est survenue lors de l'obtention d'une liste", null);
  }
}
