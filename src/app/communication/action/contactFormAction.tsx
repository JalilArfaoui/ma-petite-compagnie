"use server";
import { Role } from "@prisma/client";
import { ContactInformation, creerContact, modifierContact } from "../api/contact/contact";

function transformerFormDataContact(FormData: FormData): ContactInformation {
  const listeIdsRaw = FormData.getAll("listeIds");
  // const listeIds = listeIdsRaw
  //   .map((v) => parseInt(v.toString(), 10))
  //   .filter((n) => !isNaN(n));
  return {
    nom: FormData.get("nom")?.toString() ?? "",
    prenom: FormData.get("prenom")?.toString() ?? "",
    tel: FormData.get("tel")?.toString() ?? null,
    email: FormData.get("email")?.toString() ?? null,
    role: (FormData.get("role")?.toString() as Role) ?? null,
    notes: FormData.get("notes")?.toString() ?? null,
    ville: FormData.get("ville")?.toString() ?? null,
    lieu: FormData.get("lieu")?.toString() ?? null,
    

  };
}
export async function creerContactAction(FormData: FormData) {
  const contactData = transformerFormDataContact(FormData);
  const result = await creerContact(contactData);

  return result;
}

export async function modifierContactAction(id: number, FormData: FormData) {
  const contactData = transformerFormDataContact(FormData);
  const result = await modifierContact(id, contactData);

  return result;
}
