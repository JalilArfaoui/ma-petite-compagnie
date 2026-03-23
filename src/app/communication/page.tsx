"use client";
import { Heading, Link, Box, Button, Stack, SimpleGrid } from "@/components/ui";
import { creerContact, listerContacts } from "./api/contact/contact";
import { useEffect, useState } from "react";
import { Contact, Role } from "@prisma/client";
import { ContactInformation } from "./api/contact/contact";
import { ContactCard } from "./components/ContactCard";
import { CSVContactImport } from "./components/CSVContactImport";
import "../globals.css";
import { toaster } from "@/components/ui/Toast/toaster";
export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  useEffect(() => {
    async function loadContact() {
      const resultat = await listerContacts(30, 1);
      if (resultat.succes) {
        setContacts(resultat.donnee ?? []);
      } else {
        toaster.create({ description: resultat.message, type: "error" });
      }
    }
    loadContact();
  }, []);

  function isContactInformation(obj: unknown): obj is ContactInformation {
    const o = obj as Record<string, string>;
    return typeof o.nom === "string" && typeof o.prenom === "string";
  }

  function csvToContacts(donnees: Record<string, string>[]) {
    donnees.forEach((element) => {
      console.log(element);
      if (isContactInformation(element)) {
        console.log(element);
      }
    });
  }
  return (
    <Box className=" py-5 flex-col items-center gap-4">
      <CSVContactImport
        requiredAttributes={["nom", "prenom"]}
        optionnalAttributes={["email"]}
        onCSVRead={csvToContacts}
      ></CSVContactImport>
      <Stack className="gap-5 items-center">
        <Heading as="h3">Page de contact </Heading>
        <Link href="./communication/contact">
          <Button className=" scale-0.9">Créer un contact</Button>
        </Link>
      </Stack>

      <SimpleGrid className="columns-1 lg:columns-3" gap={10}>
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
