"use server";

import { get_Brevo_Client } from "@/lib/brevo";
import type { Contact } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";

import { Result, resultOf } from "../api/contact/contact";
export async function relier_contact_to_Brevo(contact: Contact): Promise<Result<null>> {
  const client = get_Brevo_Client();
  if (!client || !contact.email) return resultOf(false, "La clé API BREVO est incorrecte", null);

  try {
    const response = await client.contacts.createContact({
      email: contact.email,
      listIds: [Number(process.env.BREVO_LIST_ID)],
      attributes: {
        NOM: contact.nom,
        PRENOM: contact.prenom,
        TEL: contact.tel ?? "",
        ROLE: contact.role ?? "",
      },
    });

    return resultOf(true, "", null);
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.message?.includes("existe")) {
        return resultOf(true, "Contact déja existant", null);
      }
    }
    return resultOf(false, "Problème de synchronisation avec Brevo", null);
  }
}
