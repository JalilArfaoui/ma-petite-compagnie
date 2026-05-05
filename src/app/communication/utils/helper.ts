import { ContactInformation } from "../api/contact/contact";

export function validerEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return resultOf(false, "L'adresse email n'est pas valide.", null);
  }
  return resultOf(true, "", null);
}
export function validerTelephone(tel: string) {
  let valide = true;
  if (tel && tel?.at(0) === "+") {
    if (
      tel.at(3) === " " &&
      tel.charCodeAt(1) >= 48 &&
      tel.charCodeAt(1) <= 57 &&
      tel.charCodeAt(2) >= 48 &&
      tel.charCodeAt(2) <= 57
    ) {
      valide = true;
    } else if (
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
    const telRegex =
      /^((\+[0-9][0-9] )?(([0-9][0-9][-]){4}[0-9][0-9])|(\+[0-9][0-9] )?([0-9]{9,10}))$/;

    if (!telRegex.test(tel)) {
      return resultOf(false, "Le numéro de téléphone n'est pas valide.", null);
    }
  } else {
    const telRegex =
      /^((\+[0-9][0-9] )?(([0-9][0-9][-]){4}[0-9][0-9])|(\+[0-9][0-9] )?([0-9]{10}))$/;

    if (!telRegex.test(tel)) {
      return resultOf(false, "Le numéro de téléphone n'est pas valide.", null);
    }
  }
  return resultOf(true, "", null);
} /**
 * Résultat pour envoyer un message uniforme lorsqu'une interaction avec la BD ce fait.
 */
export type Result<T> = { succes: boolean; message: string; donnee: T | null };
/**
 * Méthode utilitaire pour créer un objet résultat sans créer l'objet.
 * @param succes
 * @param message
 * @param donnee
 * @returns
 */

export function resultOf<T>(succes: boolean, message: string, donnee: T | null): Result<T> {
  return { succes: succes, message: message, donnee: donnee };
} /**
 * Méthode pour vérifier les données d'un contact;
 * @param contact Le contact à vérifier.
 * @returns Le résultat de la vérification. Peut donner des messages d'erreur si le contact est incorrect.
 */
export function validerContact(contact: ContactInformation) {
  if (
    !contact.nom ||
    !contact.prenom ||
    contact.nom.trim().length == 0 ||
    contact.prenom.trim().length == 0
  ) {
    return resultOf(false, "Le nom ou le prénom est vide.", null);
  }

  if (contact.email) {
    const resultat = validerEmail(contact.email);
    if (resultat && !resultat?.succes) {
      return resultat;
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

export function resolvePagination(paginationTaille: number, page: number) {
  if (paginationTaille < 1 || page < 1) {
    paginationTaille = 10;
    page = 1;
  }

  const skip = paginationTaille * (page - 1);
  return { skip, paginationTaille };
}
