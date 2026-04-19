"use client";

import { useState } from "react";
import { Contact } from "@prisma/client";
import { envoyer_Email_Brevo } from "./Action/EnvoieEmail";

import { Box, Button, Input, Textarea, Stack } from "@/components/ui";

export function Formulaire_Email({getContacts} : {getContacts : () => Promise<Contact[]>;}) {
  const [objet, set_Objet] = useState("");
  const [msg, set_Msg] = useState("");

  async function envoyer() {
    const contacts = await getContacts();

    const res = await envoyer_Email_Brevo({
      contact: contacts,
      object: objet,
      msg,
    });

    if (res.resultat) {
      alert(res.cpt_envoi + " mail envoyé");
    } else {
      alert("er : " + JSON.stringify(res.er || res.message));
    }
  }

  return (
    <Box className="max-w-xl mx-auto p-6">
      <Stack gap="4">
        <Box>
          <Input value={objet} onChange={(e) => set_Objet(e.target.value)}/>
        </Box>
        <Box>
          <Textarea placeholder="message (ex: Bonjour {{prenom}} {{nom}} {{email}} ...)" value={msg} onChange={(e) => set_Msg(e.target.value)}/>
        </Box>
        <Button onClick={envoyer}>Envoyer</Button>
      </Stack>
    </Box>
  );
}