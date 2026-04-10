"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function sync_brevo_vers_prisma() {
  if (!process.env.BREVO_API_KEY) {
    console.warn("pas de clé brevo");
    return;
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "GET",
      headers: {
        "api-key": process.env.BREVO_API_KEY, // .env.example mais visuale dit faut donc je laisse .env si marche pas problème ici 
      },
    });

    const data = await res.json();

    const contacts = data.contacts ?? [];

    for (const contact of contacts) {
      if (!contact.email) continue;

      await prisma.contact.upsert({
        where: {
          email: contact.email,
        },
        update: {
          nom: contact.attributes?.NOM ?? "",
          prenom: contact.attributes?.PRENOM ?? "",
          tel: contact.attributes?.TELEPHONE ?? "",
          ville: contact.attributes?.VILLE ?? "",
          adresse: contact.attributes?.ADRESSE ?? "",
          notes: contact.attributes?.NOTES ?? "",
        },
        create: {
          email: contact.email,
          nom: contact.attributes?.NOM ?? "",
          prenom: contact.attributes?.PRENOM ?? "",
          tel: contact.attributes?.TELEPHONE ?? "",
          ville: contact.attributes?.VILLE ?? "",
          adresse: contact.attributes?.ADRESSE ?? "",
          notes: contact.attributes?.NOTES ?? "",
          role: "COMEDIEN" as Role, // role def
        },
      });
    }
  } catch (erreur_sync) {
    console.error("erreur sync inverse", erreur_sync);
  }
}