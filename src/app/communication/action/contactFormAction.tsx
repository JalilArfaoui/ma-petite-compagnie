"use server";

import { Role } from "@prisma/client";
import { ContactInformation, creerContact } from "../api/contact/contact";

function transformerFormDataContact(FormData: FormData): ContactInformation {
  return {
    nom: FormData.get("nom")?.toString() ?? "",
    prenom: FormData.get("prenom")?.toString() ?? "",
    tel: FormData.get("tel")?.toString() ?? "",
    email: FormData.get("email")?.toString() ?? "",
    role: transformerStringEnRole(FormData.get("role")?.toString()),
  };
}

function transformerStringEnRole(str: string | undefined): Role | null {
  if (str == "COMEDIEN") {
    return "COMEDIEN";
  } else if (str == "TECHNICIEN") {
    return "TECHNICIEN";
  } else if (str == "PARTENAIRE") {
    return "PARTENAIRE";
  }
  return null;
}
export async function creerContactAction(FormData: FormData) {
  const contactData = transformerFormDataContact(FormData);
  const result = await creerContact(contactData);

  return result;
}
