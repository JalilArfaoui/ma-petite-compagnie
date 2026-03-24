"use client";

import { Contact } from "@prisma/client";
import { useState, FormEvent } from "react";
import { Box, Card, Input, Stack, Button } from "@/components/ui";
import { Envoie_Email } from "./actions/Envoyer_Email";

export function Formulaire_Email({contacts, }: {contacts: Contact[];}) {
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [emails_selectionner, setEmails_selectionner] = useState<string[]>([]);

  function toggle_email(email: string) {
    if (emails_selectionner.includes(email)) {
      setEmails_selectionner(emails_selectionner.filter((e) => e !== email));
    } else {
      setEmails_selectionner([...emails_selectionner, email]);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await Envoie_Email(emails_selectionner, sujet, message);

    setSujet("");
    setMessage("");
    setEmails_selectionner([]);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Stack>

          <Box>
            Sujet :
            <Input
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              placeholder="Sujet du mail"
            />
          </Box>

          <Box>
            Message :
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Bonjour {{prenom}} ..."
              style={{ width: "100%", height: "150px" }}
            />
          </Box>

          <Box>
            Liste des contact :
            <Stack>
              {contacts.map((contact) => contact.email ? (
                  <label key={contact.id}>
                    <input type="checkbox" value={contact.email} checked={emails_selectionner.includes(contact.email)} onChange={() => toggle_email(contact.email!)}/>
                    {contact.prenom} {contact.nom} ({contact.email})
                  </label>
                ) : null
              )}
            </Stack>
          </Box>

          <Box>
            variable dispo : {"{{prenom}}"} {"{{nom}}"}
          </Box>

          <Button type="submit">Envoyer</Button>

        </Stack>
      </form>
    </Card>
  );
}

export default Formulaire_Email;