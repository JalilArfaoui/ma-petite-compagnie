"use server";

import { Role } from "@prisma/client";
import { ContactInformation, creerContact, modifierContact } from "../api/contact/contact";

function transformerFormDataContact(FormData: FormData): ContactInformation {
  return {
    nom: FormData.get("nom")?.toString() ?? "",
    prenom: FormData.get("prenom")?.toString() ?? "",
    tel: FormData.get("tel")?.toString() ?? null,
    email: FormData.get("email")?.toString() ?? null,
    role: (FormData.get("role")?.toString() as Role) ?? null,
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
