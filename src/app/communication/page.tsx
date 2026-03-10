"use client";
import { Heading, Link, Box, Button, Stack, SimpleGrid, Select, SearchBar } from "@/components/ui";
import { listerContacts, supprimerContact } from "./api/contact/contact";
import { useEffect, useState } from "react";
import { Contact } from "@prisma/client";
import { ContactCard } from "./components/ContactCard";
import "../globals.css";
import { toaster } from "@/components/ui/Toast/toaster";

const filtreOptions: string[] = ["nom", "date_creation", "prenom", "role", "tel", "email"];
export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsSelectionne, setContactsSelectionne] = useState<Contact[]>([]);
  const [dernierContactSelect, setDernierContactSelect] = useState<Contact>();
  const [contactsFiltre, setContactsFiltre] = useState<Contact[]>([]);
  const [filterSelected, setFilterSelected] = useState<keyof Contact>("nom");
  useEffect(() => {
    async function loadContact() {
      const resultat = await listerContacts(30, 1);
      if (resultat.succes) {
        setContacts(resultat.donnee ?? []);
        setContactsFiltre(resultat.donnee ?? []);
      } else {
        toaster.create({ description: resultat.message, type: "error" });
      }
    }
    loadContact();
  }, []);

  async function supprimerContacts() {
    await contactsSelectionne.forEach(async (c) => {
      const resultat = await supprimerContact(c.id);
      if (!resultat.succes) {
        toaster.create({ description: resultat.message, type: "error" });
      }
    });
    toaster.create({ description: "Les contacts ont été supprimés", type: "success" });
    setContacts((prev) => {
      return prev.filter((c) => !contactsSelectionne.includes(c));
    });
    deselectAll();
  }
  function updateSelected(contact: Contact) {
    setDernierContactSelect(contact);
    setContactsSelectionne((prev) => {
      if (prev.includes(contact)) {
        return prev.filter((c) => c !== contact);
      } else {
        return [...prev, contact];
      }
    });
  }
  function afficherContact(contact: Contact) {
    return (
      <Box className="flex flex-col items-center" key={contact.id}>
        <Box className={dernierContactSelect === contact ? "orange" : "transparent"}>
          <ContactCard contact={contact} onSelect={updateSelected} />
        </Box>
        {dernierContactSelect === contact && (
          <Link href={"/communication/" + contact.id}>
            <Button>Modifier</Button>
          </Link>
        )}
      </Box>
    );
  }
  function selectAll() {
    setContactsSelectionne(() => {
      return contacts;
    });
  }

  function deselectAll() {
    setContactsSelectionne(() => {
      return [];
    });
  }

  function filtrer(texte: string) {
    console.log(texte);
    if (texte === "") {
      setContactsFiltre(contacts);
    } else {
      const filter: Contact[] = [];

      contacts.forEach((c) => {
        const str = filterSelected as keyof typeof c;

        switch (str) {
          case "date_creation":
            if (c.date_creation.toLocaleDateString().startsWith(texte)) {
              filter.push(c);
            }

            break;
          default:
            if (c[str]?.toString().startsWith(texte)) {
              filter.push(c);
            }
            break;
        }
      });
      console.log(filter);
      setContactsFiltre(filter);
    }
  }
  return (
    <Box className=" py-5 flex-col items-center gap-4">
      <Stack className="gap-5 items-center">
        <Heading as="h3">Page de contact </Heading>
        <Link href="./communication/contact">
          <Button className=" scale-0.9">Créer un contact</Button>
        </Link>
      </Stack>
      <Stack direction="row" gap={2}>
        <Button className=" border-solid " onClick={() => supprimerContacts()}>
          Supprimer
        </Button>
        <Button variant="solid" onClick={() => selectAll()}>
          Tout sélectionner
        </Button>
        <Button variant="solid" onClick={() => deselectAll()}>
          Tout désélectionner
        </Button>
        <SearchBar onChange={(e) => filtrer(e.target.value)}></SearchBar>
        <select
          value={filterSelected}
          onChange={(e) => setFilterSelected(e.target.value as keyof Contact)}
        >
          {filtreOptions.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </Stack>

      <SimpleGrid className="grid grid-cols-1 lg:grid-cols-3" gap={10}>
        {contactsFiltre.map(afficherContact)}
      </SimpleGrid>
    </Box>
  );
}
