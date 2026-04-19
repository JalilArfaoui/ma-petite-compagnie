"use server";

import { BrevoClient } from "@getbrevo/brevo";
import { Contact } from "@prisma/client";

async function envoyer_tous_contact(
  contact: Contact[],
  msg: string,
  object: string,
  client: BrevoClient
) {
  let cpt = 0;

  for (const c of contact) {
    if (!c.email) continue;

    const msg_perso_prenom = msg.replace("{{prenom}}", c.prenom);
    const msg_perso_nom = msg_perso_prenom.replace("{{nom}}", c.nom);
    const msg_perso_email = msg_perso_nom.replace("{{email}}", c.email);

    await client.transactionalEmails.sendTransacEmail({
      sender: {
        name: "Ma compagnie",
        email: "communication@ma-petite-compagnie.fr",
      },
      to: [{ email: c.email }],
      subject: object,
      htmlContent: msg_perso_email,
    });
    cpt=cpt+1;
  }
  return cpt;
}

export async function envoyer_Email_Brevo({
  contact,
  object,
  msg,
}: {
  contact: Contact[];
  object: string;
  msg: string;
}) {
  const client = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY || "",
  });

  try {
    const cpt_envoi = await envoyer_tous_contact(contact, msg, object, client);

    if (cpt_envoi === 0) {
      return { resultat: false, message: "0 contact avec email" };
    }

    return { resultat: true, cpt_envoi};
  } catch (er) {
    console.error("er de Brevo : ", er);
    return { resultat: false, er };
  }
}