"use server";
import { Contact, ListeContact } from "@prisma/client";
import { getActiveAdministrationContext } from "@/app/administration/auth-helpers";
export type ContactInformation = Omit<Contact, "id" | "date_creation" | "compagnieId">;
import { prisma } from "@/lib/prisma";
import { Result, resultOf, validerContact, resolvePagination } from "../../utils/helper";

async function getCompagnieId() {
  const context = await getActiveAdministrationContext();
  if (!context.ok) {
    throw new Error(context.error);
  }
  return context.compagnieId;
}

export async function creerContact(contact: ContactInformation) {
  try {
    const compagnieId = await getCompagnieId();
    const verificationResultat = await validerContact(contact);
    if (!verificationResultat.succes) {
      return verificationResultat;
    }
    const nouveauContact = await prisma.contact.create({
      data: {
        ...contact,
        compagnieId,
      },
    });
    return resultOf(true, "", nouveauContact);
  } catch (error) {
    console.error(error);
    return resultOf(false, "Erreur lors de la création du contact", null);
  }
}

export async function listerContacts(
  paginationTaille = 10,
  page = 1
) {
  try {
    const compagnieId = await getCompagnieId();
    let skip;
    ({ skip, paginationTaille } = resolvePagination(paginationTaille, page));
    const contacts = await prisma.contact.findMany({
      where: {compagnieId},
      skip,
      take: paginationTaille,
    });
    return resultOf(true, "", contacts);
  } catch (error) {
    console.error(error);
    return resultOf(false, "Erreur lors de la récupération des contacts", null);
  }
}


export async function modifierContact(contactId: number, nouveauContact: ContactInformation) {
  try {
    const compagnieId = await getCompagnieId();
    const verificationResultat = validerContact(nouveauContact);
    if (!verificationResultat.succes) {
      return verificationResultat;
    }
    if (nouveauContact.email) {
      const contactExistant = await prisma.contact.findFirst({
        where: {
          email: nouveauContact.email,
          compagnieId,
          NOT: { id: contactId },
        },
      });

      if (contactExistant) {
        return resultOf(false, "Email déjà utilisé", null);
      }
    }

    const contactModifie = await prisma.contact.updateMany({
      where: {
        id: contactId,
        compagnieId,
      },
      data: {
        ...nouveauContact,
      },
    });

    if (contactModifie.count === 0) {
      return resultOf(false, "Contact introuvable", null);
    }

    return resultOf(true, "", contactModifie);
  } catch (error) {
    console.error(error);
    return resultOf(false, "Erreur modification contact", null);
  }
}

export async function supprimerContact(id: number) {
  try {
    const compagnieId = await getCompagnieId();

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        compagnieId,
      },
    });

    if (!contact) {
      return resultOf(false, "Contact introuvable", null);
    }

    await prisma.contact.delete({
      where: {
        id,
      },
    });

    return resultOf(true, "", null);
  } catch (error) {
    console.error(error);
    return resultOf(false, "Le contact n'a pas pu être supprimé", null);
  }
}

export async function supprimerContactAvecNom(nom: string) {
  try {
    const compagnieId = await getCompagnieId();

    const result = await prisma.contact.deleteMany({
      where: {
        nom,
        compagnieId,
      },
    });

    return resultOf(true, "", result);
  } catch (error) {
    console.error(error);
    return resultOf(false, "Erreur suppression contact", null);
  }
}

export async function supprimerContactsAvecEmail(email: string) {
  try {
    const compagnieId = await getCompagnieId();

    const result = await prisma.contact.deleteMany({
      where: {
        email,
        compagnieId,
      },
    });

    return resultOf(true, "", result);
  } catch (error) {
    console.error(error);
    return resultOf(false, "Erreur suppression contact", null);
  }
}

export type ContactWithListes = Contact & {
  listeContacts: {
    id: number;
    nom: string;
  }[];
};

export async function listerContactsAvecListes(
  paginationTaille = 10,
  page = 1
) {
  try {
    const compagnieId = await getCompagnieId();

    let skip;
    ({ skip, paginationTaille } = resolvePagination(paginationTaille, page));

    const contacts = await prisma.contact.findMany({
      where: {
        compagnieId,
      },
      include: {
        listeContacts: true,
      },
      skip,
      take: paginationTaille,
    });

    return resultOf(true, "", contacts);
  } catch (error) {
    console.error(error);
    return resultOf(false, "Erreur récupération contacts", null);
  }
}


export async function listerContactsDansListe(
  liste: ListeContact,
  paginationTaille = 10,
  page = 1
) {
  try {
    const compagnieId = await getCompagnieId();

    let skip;
    ({ skip, paginationTaille } = resolvePagination(paginationTaille, page));

    const contacts = await prisma.contact.findMany({
      where: {
        compagnieId,
        listeContacts: {
          some: {
            id: liste.id,
          },
        },
      },
      include: {
        listeContacts: true,
      },
      skip,
      take: paginationTaille,
    });

    return resultOf(true, "", contacts);
  } catch (error) {
    console.error(error);
    return resultOf(false, "Erreur récupération liste contacts", null);
  }
}


export async function trouverParIdContact(id: number) {
  try {
    const compagnieId = await getCompagnieId();

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        compagnieId,
      },
    });

    if (!contact) {
      return resultOf(false, "Le contact n'existe pas.", null);
    }

    return resultOf(true, "", contact);
  } catch (error) {
    console.error(error);
    return resultOf(false, "Erreur lors de la récupération du contact", null);
  }
}