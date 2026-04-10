"use server";

import { prisma } from "@/lib/prisma";
import { BrevoClient } from "@getbrevo/brevo";

export async function envoyer_Email({
  sujet,
  message,
  filtres,
}: any) {
  const client = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY || "",
  });

  const contacts = await prisma.contact.findMany({
    where: {
      ville: filtres.ville || undefined,
      role: filtres.role || undefined,
    },
  });

  for (const contact of contacts) {
    if (!contact.email) continue;

    
    const message_perso = message.replace(
      "{{prenom}}",
      contact.prenom || ""
    );

    try {
      await client.transactionalEmails.sendTransacEmail({
        sender: {
          name: "Ma compagnie",
          email: "test@test.com",
        },
        to: [{ email: contact.email }],
        subject: sujet,
        htmlContent: message_perso,
      });
    } catch (err) {
      console.error("erreur envoie mail", err);
    }
  }

  return { success: true };
}