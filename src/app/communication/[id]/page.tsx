"use client";
import { use, useEffect, useState } from "react";

import { Contact } from "@prisma/client";
import { toaster } from "@/components/ui/Toast/toaster";
import { modifierContactAction } from "../action/contactFormAction";
import ContactDetails from "../components/contactDetails";
import { trouverParIdContact } from "../api/contact/contact";
import { useRouter } from "next/navigation";
import { Box, Heading, Link } from "@/components/ui";
import { Spinner } from "@chakra-ui/react";

export function ContactModification({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [chargement, setChargement] = useState(true);
  const { id } = use(params);
  async function onSubmit(FormData: FormData) {
    const resultat = await modifierContactAction(parseInt(id), FormData);

    if (resultat.succes && resultat.donnee) {
      toaster.create({ description: "Contact modifié avec succès !", type: "success" });
      router.push("/communication");
    } else {
      toaster.create({ description: resultat.message, type: "error" });
    }
  }
  useEffect(() => {
    async function chargerContact() {
      const resultat = await trouverParIdContact(parseInt(id));
      if (resultat.succes && resultat.donnee) {
        setContact(resultat.donnee);
        setChargement(false);
      } else {
        toaster.create({
          description: resultat.message,
          type: "error",
        });
        router.push("/communication");
      }
    }

    chargerContact();
  }, [id, router]);
  if (chargement) {
    return (
      <Box
        position="fixed"
        width="100vw"
        height="100vh"
        bg="rgba(0, 0, 0, 0.5)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="white" />
      </Box>
    );
  }
  return (
    <Box alignContent={"center"}>
      <Box textAlign={"center"}>
        <Heading as={"h3"}>Modification d&rsquo;un contact</Heading>
      </Box>
      <Box>
        <Link href={"/communication"}>Retour</Link>
      </Box>
      <ContactDetails onSubmitted={onSubmit} contactDonnee={contact ?? null}></ContactDetails>
    </Box>
  );
}
export default ContactModification;
