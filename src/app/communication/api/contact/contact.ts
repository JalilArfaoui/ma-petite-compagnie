"use server";
import { Contact, Tag } from "@prisma/client";
export type ContactInformation = Omit<Contact, "id" | "date_creation">;
export type ContactAvecTags = Contact & { tags: Tag[] };
import { prisma } from "@/lib/prisma";
import { resultOf, validerContact } from "../../utils/helper";

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
    return resultOf(false, "Cette email est déjà utilisé. Veuillez utiliser un email différent.", null);
  }
  try {
    const nouveauContact = await prisma.contact.create({ data: { ...contact } });
    return resultOf(true, "", nouveauContact);
  } catch {
    return resultOf(false, "Une erreur est survenue lors de la création du contact", null);
  }
}

export async function listerContacts(paginationTaille: number = 10, page: number = 1) {
  if (paginationTaille < 1 || page < 1) { paginationTaille = 10; page = 1; }
  const skip = paginationTaille * (page - 1);
  try {
    const contacts = await prisma.contact.findMany({ skip, take: paginationTaille });
    return resultOf(true, "", contacts);
  } catch {
    return resultOf(false, "Erreur lors de la récupération des contacts", null);
  }
}

export async function modifierContact(contactId: number, nouveauContact: ContactInformation) {
  const verificationResultat = validerContact(nouveauContact);
  if (!verificationResultat.succes) return verificationResultat;
  if (nouveauContact.email) {
    const contactExistant = await prisma.contact.findFirst({
      where: { email: nouveauContact.email, NOT: { id: contactId } },
    });
    if (contactExistant) {
      return resultOf(false, "Cet email est déjà utilisé. Veuillez utiliser un email différent.", null);
    }
  }
  try {
    const contactModifie = await prisma.contact.update({
      where: { id: contactId },
      data: { ...nouveauContact },
    });
    return resultOf(true, "", contactModifie);
  } catch {
    return resultOf(false, "Le contact n'existe pas ou n'a pas pu être modifié.", null);
  }
}

export async function supprimerContact(id: number) {
  try {
    return await resultOf(true, "", prisma.contact.delete({ where: { id: id } }));
  } catch {
    return resultOf(false, "Le contact n'a pas pu être supprimé", null);
  }
}

export async function supprimerContactAvecNom(nom: string) {
  try {
    return await resultOf(true, "", prisma.contact.deleteMany({ where: { nom: nom } }));
  } catch {
    return resultOf(false, "Le contact n'a pas pu être supprimé", null);
  }
}

export async function supprimerContactsAvecEmail(email: string) {
  try {
    return await resultOf(true, "", prisma.contact.deleteMany({ where: { email: email } }));
  } catch {
    return resultOf(false, "Le contact n'a pas pu être supprimé", null);
  }
}

export async function trouverParIdContact(id: number) {
  const contact = await prisma.contact.findUnique({
    where: { id: id },
    include: { tags: true },
  });
  if (!contact) return resultOf(false, "Le contact n'existe pas.", null);
  return resultOf(true, "", contact);
}

export async function planifierRelance(contactId: number, date: Date, note: string | null) {
  try {
    await prisma.contact.update({
      where: { id: contactId },
      data: { date_relance: date, note_relance: note },
    });
    return resultOf(true, "", null);
  } catch {
    return resultOf(false, "Impossible de planifier la relance.", null);
  }
}

export async function annulerRelance(contactId: number) {
  try {
    await prisma.contact.update({
      where: { id: contactId },
      data: { date_relance: null, note_relance: null },
    });
    return resultOf(true, "", null);
  } catch {
    return resultOf(false, "Impossible d'annuler la relance.", null);
  }
}

export async function listerContactsARelancer() {
  try {
    const contacts = await prisma.contact.findMany({
      where: { date_relance: { not: null } },
      include: { tags: true },
      orderBy: { date_relance: "asc" },
    });
    return resultOf(true, "", contacts);
  } catch {
    return resultOf(false, "Erreur lors de la récupération des relances.", null);
  }
}