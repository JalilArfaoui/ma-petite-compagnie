import { useEffect, useState } from "react";
import { listerContacts, supprimerContact } from "../api/contact/contact";

import { Contact } from "@prisma/client";
import { ContactGrid } from "./ContactGrid";
import { Toaster, toaster } from "@/components/ui/Toast/toaster";
import { Box, Button, SearchBar, Stack, Table, Text } from "@/components/ui";

const filtreOptions: string[] = ["nom", "date_creation", "prenom", "role", "tel", "email"];
export function ContactTable() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsSelectionne, setContactsSelectionne] = useState<Contact[]>([]);
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

  async function supprimerUnContact(contact: Contact) {
    const resultat = await supprimerContact(contact.id);
    if (resultat.succes) {
      toaster.create({ description: "Le contact a été supprimé", type: "success" });
      setContacts((prev) => {
        return prev.filter((c) => c.id !== contact.id);
      });
    } else {
      toaster.create({ description: resultat.message, type: "error" });
    }
  }
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
    setContactsSelectionne((prev) => {
      if (prev.includes(contact)) {
        return prev.filter((c) => c !== contact);
      } else {
        return [...prev, contact];
      }
    });
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
    <Box>
      <Toaster />
      <Stack direction="row" gap={2} className="justify-between">
        <Stack direction="row" gap={2} className="items-center" justify="start">
          <Text className="h-fit font-bold text-2xl">Liste de contacts</Text>
        </Stack>
        <Stack direction="row" gap={2} justify="end">
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
          <Button
            className=" border-solid "
            variant={"outline"}
            size={"sm"}
            onClick={() => supprimerContacts()}
            disabled={contactsSelectionne.length <= 1}
          >
            Supprimer
          </Button>
          {contactsSelectionne.length == 0 ? (
            <Button variant="outline" size={"sm"} onClick={() => selectAll()}>
              Tout sélectionner
            </Button>
          ) : (
            <Button variant="outline" size={"sm"} onClick={() => deselectAll()}>
              Tout désélectionner
            </Button>
          )}
        </Stack>
      </Stack>
      <Table className="min-w-full">
        <Table.Head>
          <Table.Row>
            <Table.Cell>Nom</Table.Cell>
            <Table.Cell>Prénom</Table.Cell>
            <Table.Cell>Email</Table.Cell>
            <Table.Cell>Téléphone</Table.Cell>
            <Table.Cell className=""></Table.Cell>
            <Table.Cell className=" "></Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {contactsFiltre.map((contact, index) => {
            return (
              <ContactGrid
                index={index}
                key={contact.id}
                onDelete={supprimerUnContact}
                contact={contact}
                onSelect={updateSelected}
                className={contactsSelectionne.includes(contact) ? "bg-gray-100" : ""}
              />
            );
          })}
        </Table.Body>
      </Table>
    </Box>
  );
}
