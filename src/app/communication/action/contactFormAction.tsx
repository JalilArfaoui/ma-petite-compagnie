"use server";

import { Role } from "@prisma/client";
import { ContactInformation, creerContact } from "../api/contact/contact";
import { relier_contact_to_Brevo } from "./syncContactToBrevo";

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
  console.log("Synchronisation donnée " + contactData);
  let result = await creerContact(contactData);
  if (result.succes && result.data) {
    console.log("Synchronisation avec Brevo");
    const resultBrevo = await relier_contact_to_Brevo(result.data);
    if (resultBrevo.succes) {
      console.log("Synchronisation effectué avec Brevo");
    } else {
      result = resultBrevo;
      console.log("Erreur " + resultBrevo.message);
    }
  }

  return result;
}
