"use server";

import { get_Brevo_Client } from "@/lib/brevo";
import type { Contact } from "@prisma/client";

export async function reli_contact_to_Brevo(contact: Contact) {
  const client = get_Brevo_Client();
  if (!client || !contact.email) return { success: false, reason: "Pas clée Brevo ou email" };

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

    return { success: true, data: response };
  } catch (err: any) {
    // existe
    if (err?.response?.body?.message?.includes("existe")) {
      return { success: true, data: "Contact existent" };
    }
    console.error("problème avec la sync a Brevo:", contact.email, err);
    return { success: false, error: err };
  }
}