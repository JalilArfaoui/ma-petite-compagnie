"use server";

import { getOrReplace, getRoleFromString } from "../util/typeUtility";
import { ContactInformation, creerUnContact } from "../api/contact";
import { redirect } from "next/navigation";
/// formulaire communication/[id] page
function transformFormDataContact(FormData: FormData): ContactInformation {
  return {
    nom: getOrReplace(FormData.get("nom")?.toString(), ""),
    prenom: getOrReplace(FormData.get("prenom")?.toString(), ""),
    tel: getOrReplace(FormData.get("tel")?.toString(), ""),
    email: getOrReplace(FormData.get("email")?.toString(), ""),
    role: getRoleFromString(getOrReplace(FormData.get("role")?.toString(), "")),
  };
}
export async function creerContact(FormData: FormData) {
  const contactData = transformFormDataContact(FormData);
  const result = await creerUnContact(contactData);

  return result;
}
