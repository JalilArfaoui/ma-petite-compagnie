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

export default function ContactPage() {
  const arrayContact: Contact[] = [];
  const [contacts, setContacts] = useState(arrayContact);
  const [selected, setSelected] = useState(arrayContact);
  useEffect(() => {
    async function loadContact() {
      const request = await fetch("http://localhost:3000/communication/api/contact/");
      const contacts = await request.json();
      setContacts(contacts);
    }
    loadContact();
  }, []);

  return (
    <main>
      <Heading as="h1" size="2xl" mb={4}>
        Page de contact
      </Heading>
      <Stack direction="row" gap={4}>
        <Button variant="solid" colorPalette="blue">
          Supprimer
        </Button>
        <Button variant="solid" colorPalette="blue">
          Tout sélectionner
        </Button>
        <Button variant="solid" colorPalette="blue">
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
              setSelected((prev) => {
                if (prev.includes(contact)) {
                  return prev.filter((c) => c !== contact);
                } else {
                  return [...prev, contact];
                }
              });
            }}
            contact={contact}
          ></ContactCard>
        );
      })}
    </main>
  );
}
