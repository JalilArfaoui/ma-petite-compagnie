"use server";

import { getBrevoClient } from "@/lib/brevo";

export async function reli_contact_to_Brevo(contact: any) {
  const client = getBrevoClient();

  if (!client) {
    console.warn("brevo mal config");
    return;
  }

  if (!contact?.email) {
    console.warn("contact pas email");
    return;
  }

  try {
    await client.contacts.createContact({ email: contact.email, attributes: {NOM: contact.nom, PRENOM: contact.prenom, }, listIds: [Number(process.env.BREVO_LIST_ID ?? 0), ], updateEnabled: true,});
    console.log("contact sync avec brevo :", contact.email);
  } catch (err: any) {
    console.error("erreur sync brevo :", err?.message);
  }
}