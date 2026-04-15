"use server";
import { prisma } from "@/lib/prisma";
import { Contact } from "@prisma/client";
import { resultOf } from "../../utils/helper";

export async function getOneByNom(nomListe: string) {
  try {
    const resultat = await prisma.listeContact.findFirst({ where: { nom: nomListe } });
    return resultOf(true, "", resultat);
  } catch (error: unknown) {
    console.log(error);
    return resultOf(false, "Impossible de récupérer les listes par nom", null);
  }
}
export async function createListe(nomListe: string, contacts: Contact[]) {
  try {
    let resultat = null;
    const liste = await getOneByNom(nomListe);
    if (liste.succes && liste.donnee !== null) {
      resultat = prisma.listeContact.update({
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
      resultat = prisma.listeContact.create({
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
