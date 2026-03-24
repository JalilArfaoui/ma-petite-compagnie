import { creerContact, ContactInformation } from "../api/contact/contact";

function isContactInformation(obj: unknown): obj is ContactInformation {
  const o = obj as Record<string, string>;
  return typeof o.nom === "string" && typeof o.prenom === "string";
}

export function csvToContacts(donnees: Record<string, string>[]) {
  donnees.forEach(async (element) => {
    console.log(element);
    if (isContactInformation(element)) {
      console.log("Validé");
      const resultat = await creerContact(element);
      console.log(resultat.message);
    }
  });
}
