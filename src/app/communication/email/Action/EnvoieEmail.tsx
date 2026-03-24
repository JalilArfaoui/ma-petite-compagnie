"use server";

import { prisma } from "@/lib/prisma";
import { getBrevoClient } from "@/lib/brevo";

export const Envoie_Email = async (liste_email: string[], sujet: string, message: string) => {
  const client = getBrevoClient();
  if (!client) {console.error("brevo config");
    return { success: false };
  }

  try {
    const Contactes = await prisma.contact.findMany({where: {email: { in: liste_email },},});

    for (const contact of Contactes) {
      if (!contact.email) continue;
      const message_perso = message
        .replaceAll("{{prenom}}", contact.prenom)
        .replaceAll("{{nom}}", contact.nom);
      await client.smtp.sendTransacEmail({
        sender: {
          name: "Titre",                //problème
          email: "jesaispas@gmail.com", //problème
        }, to: [{ email: contact.email }], subject: sujet, htmlContent: `<p>${message_perso}</p>`,
      });
    }
    return { success: true };
  } catch (error) {
    console.error("eureur d'envoye mail:", error);
    return { success: false, error };
  }
};