"use server";

import { getOrReplace, getRoleFromString } from "../util/typeUtility";
import { ContactInformation } from "../api/contact";
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

export async function createContact(FormData: FormData) {
  console.log(transformFormDataContact(FormData));
}
