import { ContactInformation } from "@/app/communication/api/contact";
export function creerUnContactAPartirInformation(contact: ContactInformation) {
  return { id: 1, date_creation: new Date(), ...contact };
}
export function creerObjetContactAvecNom(nom: string): ContactInformation {
  return {
    nom: nom,
    prenom: "User",
    email: "prenom.nom@mail.fr",
    tel: "0011223344",
    role: "PARTENAIRE",
  };
}
