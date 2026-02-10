"use client";
import { Heading, Link, Box, Button, Stack, SimpleGrid } from "@/components/ui";
import { listerContacts } from "./api/contact/contact";
import { useEffect, useState } from "react";
import { Contact } from "@prisma/client";
import { ContactCard } from "./components/ContactCard";
import { toaster } from "@/components/ui/Toast/toaster";
export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [dernierContactSelect, setDernierContactSelect] = useState<Contact>();
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
  function updateSelected(contact: Contact) {
    setDernierContactSelect(contact);
  }
  return (
    <Box paddingY={5} display="flex" flexDirection="column" alignItems="center" gap={4}>
      <Stack gap={5} alignItems={"center"}>
        <Heading as="h3">Page de contact </Heading>
        <Link href="./communication/contact">
          <Button scale={0.9}>Créer un contact</Button>
        </Link>
      </Stack>
      <SimpleGrid columns={[1, null, 3]} gap={10}>
        {contacts.map((contact) => {
          return (
            <Box key={contact.id} display="flex" flexDirection="column" alignItems={"center"}>
              <Box
                css={{
                  backgroundColor: dernierContactSelect === contact ? "orange" : "transparent",
                }}
              >
                <ContactCard contact={contact} onSelect={updateSelected} />
              </Box>
              {dernierContactSelect === contact && (
                <Link href={"/communication/" + contact.id}>
                  <Button>Modifier</Button>
                </Link>
              )}
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
