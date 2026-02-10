"use server";
import { Contact, Prisma } from "@prisma/client";
export type ContactInformation = Omit<Contact, "id" | "date_creation">;
import { prisma } from "@/lib/prisma";
/**
 * Résultat pour envoyer un message uniforme lorsqu'une interaction avec la BD ce fait.
 */
type Result<T> = { succes: boolean; message: string; donnee: T | null };

/**
 * Méthode utilitaire pour créer un objet résultat sans créer l'objet.
 * @param succes
 * @param message
 * @param donnee
 * @returns
 */
function resultOf<T>(succes: boolean, message: string, donnee: T | null): Result<T> {
  return { succes: succes, message: message, donnee: donnee };
}

function validerTelephone(tel: string) {
  let valide = true;
  if (tel && tel?.at(0) === "+") {
    if (
      tel.length === 18 &&
      tel.at(3) === " " &&
      tel.charCodeAt(1) >= 48 &&
      tel.charCodeAt(1) <= 57 &&
      tel.charCodeAt(2) >= 48 &&
      tel.charCodeAt(2) <= 57
    ) {
      valide = true;
    } else if (
      tel.length === 13 &&
      tel.charCodeAt(1) >= 48 &&
      tel.charCodeAt(1) <= 57 &&
      tel.charCodeAt(2) >= 48 &&
      tel.charCodeAt(2) <= 57
    ) {
      valide = true;
    } else {
      valide = false;
    }
    if (!valide) {
      return resultOf(false, "L'indicatif est mal écrit", null);
    }
    const telRegex = /^(\+[0-9][0-9] )?(([0-9][0-9][-]){4}[0-9][0-9])|([0-9]{10})$/;
    if (!telRegex.test(tel)) {
      return resultOf(false, "Le numéro de téléphone n'est pas valide.", null);
    }
  }
}
/**
 * Méthode pour vérifier les données d'un contact;
 * @param contact Le contact à vérifier.
 * @returns Le résultat de la vérification. Peut donner des messages d'erreur si le contact est incorrect.
 */
function validerContact(contact: ContactInformation) {
  if (
    !contact.nom ||
    !contact.prenom ||
    contact.nom.trim().length == 0 ||
    contact.prenom.trim().length == 0
  ) {
    return resultOf(false, "Le nom ou le prénom est vide.", null);
  }

  if (contact.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      return resultOf(false, "L'adresse email n'est pas valide.", null);
    }
  }

  if (contact.tel) {
    const resultat = validerTelephone(contact.tel);
    if (resultat && !resultat?.succes) {
      return resultat;
    }
  }
  return resultOf(true, "", null);
}
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
    console.log(error);
    return resultOf(false, "Une erreur est survenue lors de la création du contact", null);
  }
}

export async function listerContacts(paginationTaille: number = 10, page: number = 1) {
  if (paginationTaille < 1 || page < 1) {
    paginationTaille = 10;
    page = 1;
  }

  const skip = paginationTaille * (page - 1);
  try {
    const contacts = await prisma.contact.findMany({ skip, take: paginationTaille });
    return resultOf(true, "", contacts);
  } catch (error) {
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
        "Cette email est déjà utilisé. Veuillez utiliser un email différent.",
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
    return resultOf(false, "Le contact n'existe pas ou n'a pas pu être modifié.", null);
  }
}
export async function trouverParIdContact(id: number) {
  const contact = await prisma.contact.findUnique({ where: { id: id } });
  if (!contact) {
    return resultOf(false, "Le contact n'existe pas.", null);
  }
  return resultOf(true, "", contact);
}
