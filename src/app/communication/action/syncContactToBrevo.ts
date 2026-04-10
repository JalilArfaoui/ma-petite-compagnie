"use server";

import { prisma } from "@/lib/prisma";

export async function sync_contact_vers_brevo(contact: any) {
  if (!process.env.BREVO_API_KEY) {
    console.warn("pas de clé brevo");
    return;
  }

  if (!contact.email) {
    console.warn("contact sans email donc pas sync");
    return;
  }

  try {
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: contact.email,
        attributes: {
          NOM: contact.nom,
          PRENOM: contact.prenom,
          TELEPHONE: contact.tel,
          VILLE: contact.ville,
          ADRESSE: contact.adresse,
          NOTES: contact.notes,
        },
        updateEnabled: true,
      }),
    });
  } catch (erreur_sync) {
    console.error("erreur sync brevo", erreur_sync);
  }
}