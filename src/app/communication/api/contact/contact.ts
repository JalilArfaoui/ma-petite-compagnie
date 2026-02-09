"use server";
import { Contact } from "@prisma/client";
export type ContactInformation = Omit<Contact, "id" | "date_creation">;
import { prisma } from "@/lib/prisma";
/**
 * Résultat pour envoyer un message uniforme lorsqu'une interaction avec la BD ce fait.
 */
type Result<T> = { succes: boolean; message: string; contact: T | null };

/**
 * Méthode utilitaire pour créer un objet résultat sans créer l'objet.
 * @param succes
 * @param message
 * @param contact
 * @returns
 */
function resultOf<T>(succes: boolean, message: string, contact: T | null): Result<T> {
  return { succes: succes, message: message, contact: contact };
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
    const telRegex = /^(([0-9][0-9][-]){4}[0-9][0-9])|([0-9]{10})$/;
    if (!telRegex.test(contact.tel)) {
      return resultOf(false, "Le numéro de téléphone n'est pas valide.", null);
    }
  }
  return resultOf(true, "", null);
}
export async function contactAvecMemeEmail(email: string) {
  const contact = prisma.contact.findFirst({ where: { email: email } });
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
