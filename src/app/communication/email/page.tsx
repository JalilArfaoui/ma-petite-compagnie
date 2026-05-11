"use client";

import { useState, useEffect } from "react";
import {Box, Input, Button, Textarea, Stack,} from "@/components/ui";
import { envoyer_Email_Brevo } from "./Action/EnvoieEmail";
import { Filtre_Email } from "./Filtre_Email";
import { Contact, ListeContact } from "@prisma/client";


type ListeContactAvecContacts = ListeContact & {contacts: Contact[];};

export default function Page_Email() {
  const [objet, set_Objet] = useState("");
  const [msg, set_Msg] = useState("");
  const [ville, set_Ville] = useState("");
  const [role, set_Role] = useState("");
  const [nom, set_Nom] = useState("");
  const [prenom, set_Prenom] = useState("");
  const [contacts_filtre, setContactsFiltre] = useState<Contact[]>([]);
  const [listes_contacts, set_Listes_Contacts] = useState<ListeContactAvecContacts[]>([]);
  const [liste_select_id, set_Liste_Select_Id] = useState<number>();

  useEffect(() => {
    async function charger_liste() {
      const rep = await fetch("/communication/api/liste-contact");
      const data = await rep.json();
      set_Listes_Contacts(data);
      if (data.length > 0) {
        set_Liste_Select_Id(data[0].id);
      }
    }
    charger_liste();
  }, []);

  function appliquer_filtre() {
    const liste_select = listes_contacts.find((l) => l.id === liste_select_id);
    if (!liste_select) {setContactsFiltre([]);
      return;}
    let res = liste_select.contacts;

    if (ville) {
      res = res.filter((c) => c.ville?.toLowerCase().includes(ville.toLowerCase()));
    }

    if (role) {
      res = res.filter((c) => c.role?.toLowerCase().includes(role.toLowerCase()));
    }

    if (nom) {
      res = res.filter((c) => c.nom.toLowerCase().includes(nom.toLowerCase()));
    }

    if (prenom) {
      res = res.filter((c) => c.prenom.toLowerCase().includes(prenom.toLowerCase()));
    }


    setContactsFiltre(res);
  }

  function envoyer() {
    envoyer_Email_Brevo({contact: contacts_filtre, object: objet, msg,}).then((res) => {
      if (res.resultat) {
        alert(res.cpt_envoi + " mails envoyés");
      } else {
        alert("Erreur : " + JSON.stringify(res.er || res.message));
      }
    });
  }

  return (
    <Box className="p-6 max-w-4xl mx-auto">
      <Stack className="gap-4">

        <Box className="text-2xl font-bold">
          Emailing Brevo
        </Box>
        <Box className="border rounded-xl p-4">

          <Box className="mb-2 font-semibold">
            Liste de contacts
          </Box>
          <select className="border rounded-lg p-2 w-full" value={liste_select_id} onChange={(e) => set_Liste_Select_Id(Number(e.target.value))}>
            {listes_contacts.map((liste) => (
              <option key={liste.id} value={liste.id}> {liste.nom}</option>
              ))}
          </select>

        </Box>

        <Filtre_Email set_Ville={set_Ville} set_Role={set_Role} set_Nom={set_Nom} set_Prenom={set_Prenom}/>

        <Button onClick={appliquer_filtre}>
          Filtrer les contacts
        </Button>

        <Box className="border rounded-xl p-4">
          <Box className="font-semibold mb-2">
            Contacts sélectionnés :
          </Box>
          <Stack className="gap-2">
            {contacts_filtre.map((c) => (
              <Box key={c.id} className="border rounded-lg p-2">
                <Box>
                  {c.prenom} {c.nom}
                </Box>

                <Box>
                  {c.email || "Pas d'email"}
                </Box>

                <Box>
                  {c.role}
                </Box>

                <Box>
                  {c.ville}
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        <Input placeholder="Object du mail"  value={objet}  onChange={(e) => set_Objet(e.target.value)}/>


        <Textarea placeholder="Bonjour {{prenom}} {{nom}} ..." value={msg} onChange={(e) => set_Msg(e.target.value)} className="min-h-[250px]"/>
        <Button onClick={envoyer}>
          Envoyer Email
        </Button>

        <Box className="text-sm text-gray-500">
          {contacts_filtre.length} contact(s)
        </Box>
      </Stack>
    </Box>
  );
}