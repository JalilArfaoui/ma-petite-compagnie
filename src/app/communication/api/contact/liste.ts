"use server";
import { prisma } from "@/lib/prisma";
import { Contact } from "@prisma/client";
import { resultOf } from "../../utils/helper";

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
  if (paginationTaille < 1 || page < 1) {
    paginationTaille = 10;
    page = 1;
  }

  const skip = paginationTaille * (page - 1);
  try {
    const resultat = await prisma.listeContact.findMany({ skip, take: paginationTaille });
    return resultOf(true, "", resultat);
  } catch (error: unknown) {
    console.error(error);
    return resultOf(false, "Impossible de récupérer les listes", null);
  }
}
export async function supprimerContactDeListe(contact: Contact, nomListe: string) {
  try {
    const liste = await trouverListeParNom(nomListe);
    if (liste.succes && liste.donnee) {
      await prisma.listeContact.update({
        where: { id: liste.donnee.id },
        data: {
          contacts: {
            disconnect: {
              id: contact.id,
            },
          },
        },
      });
    }
  } catch (error: unknown) {
    console.error(error);
    return resultOf(
      false,
      "Une erreur est survenue lors de la suppression d'un contact d'une liste",
      null
    );
  }
}
export async function creerListe(nomListe: string, contacts: Contact[]) {
  try {
    let resultat = null;
    const liste = await trouverListeParNom(nomListe);
    if (liste.succes && liste.donnee !== null) {
      resultat = await prisma.listeContact.update({
        where: { id: liste.donnee.id },
        data: {
          contacts: {
            connect: contacts.map((contact) => {
              return { id: contact.id };
            }),
          },
        },
      });
    } else {
      resultat = await prisma.listeContact.create({
        data: {
          nom: nomListe,
          contacts: {
            connect: contacts.map((contact) => {
              return { id: contact.id };
            }),
          },
        },
      });
    }
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
