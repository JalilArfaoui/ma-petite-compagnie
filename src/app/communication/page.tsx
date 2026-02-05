"use client";
import { Heading, Link, Box, Button, Stack, SimpleGrid } from "@/components/ui";
import { listerContacts } from "./api/contact/contact";
import { useEffect, useState } from "react";
import { Contact } from "@prisma/client";
import { ContactCard } from "./components/ContactCard";
export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  useEffect(() => {
    async function loadContact() {
      const contacts = (await listerContacts(30, 1)).donnee;
      if (!contacts) {
        setContacts([]);
        return;
      }
      setContacts(contacts);
    }
    loadContact();
  }, []);
  return (
    <Box paddingY={5} display="flex" flexDirection="column" alignItems="center" gap={4}>
      <Stack gap={5} alignItems={"center"}>
        <Heading as="h3">Page de contact </Heading>
        <Link href="./communication/contact">
          <Button scale={0.9}>Créer un contact</Button>
        </Link>
      </Stack>

      <SimpleGrid columns={3} gap={10}>
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
