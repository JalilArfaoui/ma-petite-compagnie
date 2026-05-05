"use server";
import { Contact, ListeContact } from "@prisma/client";
export type ContactInformation = Omit<Contact, "id" | "date_creation">;
import { prisma } from "@/lib/prisma";
import { Result, resultOf, validerContact, resolvePagination } from "../../utils/helper";
export async function contactAvecMemeEmail(email: string) {
  const contact = await prisma.contact.findFirst({ where: { email: email } });
  return contact ?? false;
}
export async function creerContact(contact: ContactInformation) {
  const verificationResultat = await validerContact(contact);
  if (!verificationResultat.succes) {
    return verificationResultat;
  }
  if (contact.email && (await contactAvecMemeEmail(contact.email))) {
    return resultOf(
      false,
      "Cette email est déjà utilisé. Veuillez utiliser un email différent.",
      null
    );
  }
  try {
    const nouveauContact = await prisma.contact.create({
      data: {
        ...contact,
      },
    });
    return resultOf(true, "", nouveauContact);
  } catch (error: unknown) {
    console.error(error);
    return resultOf(false, "Une erreur est survenue lors de la création du contact", null);
  }
}

export async function listerContacts(paginationTaille: number = 10, page: number = 1) {
  let skip;
  ({ skip, paginationTaille } = resolvePagination(paginationTaille, page));
  try {
    const contacts = await prisma.contact.findMany({ skip, take: paginationTaille });
    return resultOf(true, "", contacts);
  } catch (error) {
    console.error(error);
    return resultOf(false, "Erreur lors de la récupération des contacts", null);
  }
}

export async function modifierContact(contactId: number, nouveauContact: ContactInformation) {
  const verificationResultat = validerContact(nouveauContact);
  if (!verificationResultat.succes) {
    return verificationResultat;
  }
  if (nouveauContact.email) {
    const contactExistant = await prisma.contact.findFirst({
      where: {
        email: nouveauContact.email,
        NOT: { id: contactId },
      },
    });
    if (contactExistant) {
      return resultOf(
        false,
        "Cet email est déjà utilisé. Veuillez utiliser un email différent.",
        null
      );
    }
  }
  try {
    const contactModifie = await prisma.contact.update({
      where: { id: contactId },
      data: { ...nouveauContact },
    });
    return resultOf(true, "", contactModifie);
  } catch (error) {
    console.error(error);
    return resultOf(false, "Le contact n'existe pas ou n'a pas pu être modifié.", null);
  }
}

export async function supprimerContact(id: number) {
  try {
    return await resultOf(true, "", prisma.contact.delete({ where: { id: id } }));
  } catch (error) {
    console.error(error);
    return resultOf(false, "Le contact n'a pas pu être supprimé", null);
  }
}

export async function supprimerContactAvecNom(nom: string) {
  try {
    return await resultOf(true, "", prisma.contact.deleteMany({ where: { nom: nom } }));
  } catch (error) {
    console.error(error);
    return resultOf(false, "Le contact n'a pas pu être supprimé", null);
  }
}
export async function supprimerContactsAvecEmail(email: string) {
  try {
    return await resultOf(true, "", prisma.contact.deleteMany({ where: { email: email } }));
  } catch (error) {
    console.error(error);
    return resultOf(false, "Le contact n'a pas pu être supprimé", null);
  }
}
export type ContactWithListes = Contact & {
  listeContacts: {
    id: number;
    nom: string;
  }[];
};
export async function listerContactsAvecListes(
  paginationTaille: number = 10,
  page: number = 1
): Promise<Result<null> | Result<ContactWithListes[]>> {
  try {
    let skip;
    ({ skip, paginationTaille } = resolvePagination(paginationTaille, page));
    const contacts = await prisma.contact.findMany({
      take: paginationTaille,
      skip: skip,
      include: { listeContacts: true },
    });
    return resultOf(true, "", contacts);
  } catch (error) {
    console.error(error);
    return resultOf(false, "Impossible de récuperer les contacts de la liste", null);
  }
}
export async function listerContactsDansListe(
  liste: ListeContact,
  paginationTaille: number = 10,
  page: number = 1
): Promise<Result<null> | Result<ContactWithListes[]>> {
  try {
    let skip;
    ({ skip, paginationTaille } = resolvePagination(paginationTaille, page));
    const contacts = await prisma.contact.findMany({
      where: { listeContacts: { some: { id: liste.id } } },
      take: paginationTaille,
      skip: skip,
      include: { listeContacts: true },
    });

    return resultOf(true, "", contacts);
  } catch (error) {
    console.error(error);
    return resultOf(false, "Impossible de récuperer les contacts de la liste", null);
  }
}

export async function trouverParIdContact(id: number) {
  const contact = await prisma.contact.findUnique({ where: { id: id } });
  if (!contact) {
    return resultOf(false, "Le contact n'existe pas.", null);
  }
  return resultOf(true, "", contact);
}
