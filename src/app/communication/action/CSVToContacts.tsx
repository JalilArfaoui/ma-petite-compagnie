import { creerContact, ContactInformation } from "../api/contact/contact";
import { Contact } from "@prisma/client";
function isContactInformation(obj: unknown): obj is ContactInformation {
  const o = obj as Record<string, string>;
  return typeof o.Nom === "string" && typeof o.Prénom === "string";
}
/**
 * Résultat pour envoyer un message uniforme lorsqu'une interaction avec la BD ce fait.
 */
type Result<T> = { succes: boolean; message: string; donnee: T | null };
function toContactInformation(donnees: Record<string, string>): ContactInformation {
  return {
    nom: donnees.Nom,
    prenom: donnees.Prénom,
    email: donnees.Email,
    tel: donnees.Téléphone,
    role: null,
    notes: donnees.Notes,
    ville: donnees.Ville,
    lieu: donnees.Adresse,
  };
}
export async function csvToContacts(donnees: Record<string, string>[]) {
  const errors: Result<Contact>[] = [];
  let index = 2;
  for (const element of donnees) {
    console.log(element);
    if (isContactInformation(element)) {
      console.log("Validé");

      const info = toContactInformation(element);
      const resultat = await creerContact(info);
      resultat.message = "Ligne CSV numéro " + index + " : " + resultat.message;
      errors.push(resultat);
      console.log(resultat.succes);
      console.log(resultat.message);
    } else {
      console.log("L'élément n'est pas un contact.");
    }
    index += 1;
  }
  return errors;
}
