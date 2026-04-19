"use client";
import { Heading, Link, Box, Button, Stack, Text } from "@/components/ui";

import { toaster, Toaster } from "@/components/ui/Toast/toaster";
import { ContactTable } from "./components/ContactTable";
import { CSVContactImport } from "./components/CSVContactImport";
import { csvToContacts } from "./action/CSVToContacts";
import { getContactsWithListes } from "./api/contact/contact";
export default function ContactPage() {
  async function loadContacts() {
    const resultat = await getContactsWithListes(30, 1);
    if (resultat.succes) {
      return resultat.donnee;
    } else {
      toaster.create({ description: resultat.message, type: "error" });
      return [];
    }
  }
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
    <Box className=" py-5 px-3 flex-col items-center gap-4">
      <Toaster />
      <Stack className="gap-5 items-center mb-3" justify="center" direction="row">
        <Heading as="h3">Page de contact</Heading>
      </Stack>
      <Stack
        className="gap-5 items-center w-full  mb-10 z-10 bg-white"
        direction="row"
        justify="end"
      >
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
        <Link href="./communication/liste">Affichage par liste</Link>
      </Stack>

      <Box className="md:w-full lg:w-[90%] mx-auto   ">
        <ContactTable keyReload={0} getContacts={() => loadContacts()} />
      </Box>
    </Box>
  );
}
