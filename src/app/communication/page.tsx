"use client";
import { use, useEffect, useState } from "react";
import { obtenirBeaucoupContact } from "./api/contact";
import { ContactCard } from "./components/ContactCard";
import { Heading } from "../../components/ui/Heading/Heading";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Link,
  List,
  Radio,
  RadioGroup,
  Switch,
  Table,
  Textarea,
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
} from "@/components/ui";
import { Contact } from "@prisma/client";
import { obtenirContacts, supprimerContact } from "./action/contactAction";

export default function ContactPage() {
  const arrayContact: Contact[] = [];
  const [contacts, setContacts] = useState(arrayContact);
  const [selected, setSelected] = useState(arrayContact);
  useEffect(() => {
    async function loadContact() {
      const contacts = (await obtenirContacts()).contact;
      if (!contacts) {
        setContacts([]);
        return;
      }
      setContacts(contacts);
    }
    loadContact();
  }, []);

  function supprimerContacts() {
    selected.forEach((c) => {
      supprimerContact(c.id);
    });
    setContacts((prev) => {
      return prev.filter((c) => !selected.includes(c));
    });
    deselectAll();
  }
  function updateSelected(contact: Contact) {
    setSelected((prev) => {
      if (prev.includes(contact)) {
        return prev.filter((c) => c !== contact);
      } else {
        return [...prev, contact];
      }
    });
  }

  function selectAll() {
    setSelected(() => {
      return contacts;
    });
  }

  function deselectAll() {
    setSelected(() => {
      return [];
    });
  }
  return (
    <main>
      <Heading as="h1" size="2xl" mb={4}>
        Page de contact
      </Heading>
      <Stack direction="row" gap={4}>
        <Button variant="solid" colorPalette="blue" onClick={() => supprimerContacts()}>
          Supprimer
        </Button>
        <Button variant="solid" colorPalette="blue" onClick={() => selectAll()}>
          Tout sélectionner
        </Button>
        <Button variant="solid" onClick={() => deselectAll()} colorPalette="blue">
          Tout délésectionner
        </Button>
        <Button variant="solid" colorPalette="blue">
          Envoyer un email
        </Button>
      </Stack>

      {contacts.map((contact) => {
        return (
          <ContactCard
            clicked={selected.find((a) => a == contact) != undefined}
            key={contact.id}
            onClick={() => {
              updateSelected(contact);
            }}
            contact={contact}
          ></ContactCard>
        );
      })}
    </main>
  );
}
