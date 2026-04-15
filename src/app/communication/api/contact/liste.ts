"use server";
import { prisma } from "@/lib/prisma";
import { Contact, ListeContact } from "@prisma/client";
import { resultOf } from "../../utils/helper";

export async function createListe(nomListe: string, contacts: Contact[]) {
  try {
    const resultat = prisma.listeContact.create({
      data: {
        nom: nomListe,
        contacts: {
          connect: contacts.map((contact) => {
            return { id: contact.id };
          }),
        },
      },
    });
    return resultOf(true, "", resultat);
  } catch (error: unknown) {
    console.log(error);
    return resultOf(false, "Une erreur est survenue lors de la création de la liste", null);
  }
}

export async function getListes(id: number) {
  try {
    const resultat = await prisma.listeContact.findMany({
      where: { contacts: { some: { id: id } } },
    });
    return resultOf(true, "", resultat);
  } catch (error: unknown) {
    console.log(error);
    return resultOf(false, "Une erreur est survenue lors de l'obtention d'une liste", null);
  }
}
