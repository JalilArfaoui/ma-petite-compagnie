"use server";

import { prisma } from "@/lib/prisma";
import { getBrevoClient } from "@/lib/brevo";

export async function sync_Brevo_vers_prisma() {
  const client = getBrevoClient();
  if (!client) {
    console.warn("brevo non config");
    return;
  }
  try {
    const response = await client.contacts.getContacts({
      limit: 50,
    });
    const contacts_brevo = response.contacts ?? [];
    for (const contact of contacts_brevo) {
      if (!contact.email) continue;
      const nom = contact.attributes?.NOM ?? "";
      const prenom = contact.attributes?.PRENOM ?? "";
      try {
        await prisma.contact.upsert({
        where: {
            email: contact.email,
        },
        update: {
            nom,
            prenom,
            role: "USER",
        },
        create: {
            nom,
            prenom,
            email: contact.email,
            role: "USER",
        },
        });
        console.log("sync ok :", contact.email);
      } catch (err) {
        console.error("erreur prisma :", contact.email);
      }
    }
    return { success: true };
  } catch (err) {
    console.error("erreur brevo :", err);
    return { success: false };
  }
}