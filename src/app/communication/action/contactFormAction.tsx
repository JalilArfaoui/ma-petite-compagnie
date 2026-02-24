"use server";

import { Role } from "@prisma/client";
import { ContactInformation, creerContact } from "../api/contact/contact";
import { reli_contact_to_Brevo } from "./syncContactToBrevo";

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
  if (result.email) {
    await reli_contact_to_Brevo(result);
  }

  return result;
}

