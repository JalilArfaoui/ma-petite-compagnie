import { ContactInformation } from "@/app/communication/api/contact/contact";
export function creerUnContactAPartirInformation(contact: ContactInformation) {
  return { id: 1, date_creation: new Date(), ...contact };
}
export function creerObjetContactAvecNom(nom: string, email: string): ContactInformation {
  return {
    nom: nom,
    prenom: "User",
    email: email,
    tel: "0011223344",
    role: "PARTENAIRE",
  };
}
