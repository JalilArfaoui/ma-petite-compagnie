"use client";

import { useState } from "react";
import { Box, Input, Button, Textarea, Stack } from "@/components/ui";
import { envoyer_Email_Brevo } from "./Action/EnvoieEmail";
import { Filtre_Email } from "./Filtre_Email";
import { Contact } from "@prisma/client";

export default function Page_Email() {
  const [objet, set_Objet] = useState("");
  const [msg, set_Msg] = useState("");

  const [ville, set_Ville] = useState("");
  const [role, set_Role] = useState("");
  const [nom, set_Nom] = useState("");
  const [prenom, set_Prenom] = useState("");

  const [contacts_filtre, setContactsFiltre] = useState<Contact[]>([]);

  // fake contacts a changer 
  const contacts_fake: Contact[] = [
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      email: "jean@mail.com",
      role: "COMEDIEN",
      tel: null,
      notes: null,
      ville: "Paris",
      lieu: null,
      date_creation: new Date(),
      listeContacts: [],
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Paul",
      email: null,
      role: "TECHNICIEN",
      tel: null,
      notes: null,
      ville: "Lyon",
      lieu: null,
      date_creation: new Date(),
      listeContacts: [],
    },
    {
      id: 3,
      nom: "brother",
      prenom: "mario",
      email: "mario@mail.com",
      role: "PARTENAIRE",
      tel: null,
      notes: null,
      ville: "Paris",
      lieu: null,
      date_creation: new Date(),
      listeContacts: [],
    },
  ];

  function appliquer_filtre() {
    let res = contacts_fake;

    if (ville) {
      res = res.filter((c) =>
        c.ville?.toLowerCase().includes(ville.toLowerCase())
      );
    }

    if (role) {
      res = res.filter((c) => c.role?.includes(role));
    }

    if (nom) {
      res = res.filter((c) =>
        c.nom.toLowerCase().includes(nom.toLowerCase())
      );
    }

    if (prenom) {
      res = res.filter((c) =>
        c.prenom.toLowerCase().includes(prenom.toLowerCase())
      );
    }

    setContactsFiltre(res);
  }

  function envoyer() {
    envoyer_Email_Brevo({
      contact: contacts_filtre,
      object: objet,
      msg,
    }).then((res) => {
      if (res.resultat) {
        alert(res.cpt_envoi + " mails envoyés");
      } else {
        alert("erreur");
      }
    });
  }

  return (
    <Box className="p-4">
      <Stack>

        <Filtre_Email
          set_Ville={set_Ville}
          set_Role={set_Role}
          set_Nom={set_Nom}
          set_Prenom={set_Prenom}
        />

        <Button onClick={appliquer_filtre}>
          Filtrer
        </Button>

        <Input
          value={objet}
          onChange={(e) => set_Objet(e.target.value)}
        />

        <Textarea
          placeholder="Message (ex: Bonjour {{prenom}})"
          value={msg}
          onChange={(e) => set_Msg(e.target.value)}
        />

        <Button onClick={envoyer}>
          Envoyer
        </Button>

        <Box>
          {contacts_filtre.length} contact(s)
        </Box>

      </Stack>
    </Box>
  );
}