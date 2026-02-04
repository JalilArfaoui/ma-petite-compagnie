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
 * @returns Le résultat de la vérification. Peut donner des messages d'erreur si le contact est incorrecte.
 */
function verificationDonnee(contact: ContactInformation) {
  if (!contact.nom || contact.nom.trim().length == 0 || contact.prenom.trim().length == 0) {
    return resultOf(false, "Le nom ou le prénom est vide.", null);
  }
  if (contact.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      return resultOf(false, "L'adresse email n'est pas valide.", null);
    }
  }

  if (contact.tel) {
    const telRegex = /^[0-9\s\-\+\(\)]+$/; // Chiffres, espaces, +, -, ()
    if (!telRegex.test(contact.tel)) {
      return resultOf(false, "Le numéro de téléphone n'est pas valide.", null);
    }
  }
  return resultOf(true, "", null);
}
export async function creerUnContact(contact: ContactInformation) {
  const verificationResultat = verificationDonnee(contact);
  if (!verificationResultat.succes) {
    return verificationResultat;
  }
  const newContact = await prisma.contact.create({
    data: {
      ...contact,
    },
  });
  return resultOf(true, "", newContact);
}
export async function trouverParIdContact(id: number) {
  const contact = await prisma.contact.findFirst({ where: { id: id } });
  return resultOf(true, "", contact);
}

export async function trouverParNomContact(nom: string) {
  return resultOf(true, "", await prisma.contact.findFirst({ where: { nom: nom } }));
}
export async function obtenirBeaucoupContact() {
  return resultOf(true, "", await prisma.contact.findMany());
}

export async function supprimerParNomContact(nom: string) {
  return resultOf(true, "", await prisma.contact.deleteMany({ where: { nom: nom } }));
}
export async function mettreAJourContact(contactId: number, newContact: ContactInformation) {
  const verificationResultat = verificationDonnee(newContact);
  if (!verificationResultat.succes) {
    return verificationResultat;
  }
  return resultOf(
    true,
    "",
    await prisma.contact.update({ where: { id: contactId }, data: { ...newContact } })
  );
}

export async function supprimerParId(contactId: number) {
  return resultOf(true, "", await prisma.contact.delete({ where: { id: contactId } }));
}
