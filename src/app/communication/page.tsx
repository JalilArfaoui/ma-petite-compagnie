"use client";
import { Heading, Link, Box, Button, Stack, Text } from "@/components/ui";

import { toaster, Toaster } from "@/components/ui/Toast/toaster";
import { ContactTable } from "./components/ContactTable";
import { CSVContactImport } from "./components/CSVContactImport";
import { csvToContacts } from "./action/CSVToContacts";
export default function ContactPage() {
  async function onCSVRead(donnees: Record<string, string>[]) {
    const resultats = await csvToContacts(donnees);
    console.log("On csv Read");
    if (resultats.some((e) => !e.succes)) {
      let message = "Certains contacts dans le CSV n'ont pas pu être importé. \n";
      resultats.forEach((e) => {
        if (!e.succes) {
          message += e.message + "\n";
        }
      });
      toaster.create({
        title: "Importation",
        description: message,
        type: "error",
        duration: 30000,
      });
    } else {
      toaster.success({
        title: "Importation",
        description: "Tous les contacts du CSV ont été importés",
      });
    }
  }
  return (
    <Box className=" py-5 flex-col items-center gap-4">
      <Toaster />

      <Stack
        className="gap-5 items-center w-full justify-between  mb-10 z-10 bg-white"
        direction="row"
      >
        <Stack className="gap-5 items-center" direction="row">
          <Heading as="h3">Page de contact </Heading>
        </Stack>
        <Stack className="gap-5 items-center w-fit" direction="row" justify="end">
          <CSVContactImport
            attributs={{
              attributsObligatoire: ["Nom", "Prénom"],
              attributsOptionnels: ["Email", "Notes", "Téléphone", "Ville", "Adresse"],
            }}
            nomObjet="Contact"
            onCSVRead={onCSVRead}
          ></CSVContactImport>
          <Link href="./communication/contact">
            <Button size={"sm"} className=" scale-0.9">
              <Text className="text-white">+ Créer un contact</Text>
            </Button>
          </Link>
        </Stack>
      </Stack>

      <Box className="md:w-full lg:w-[75%] mx-auto  ">
        <ContactTable />
      </Box>
    </Box>
  );
}
