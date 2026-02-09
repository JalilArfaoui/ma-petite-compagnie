"use client";
import { use, useEffect, useState } from "react";

import { Contact } from "@prisma/client";
import { toaster } from "@/components/ui/Toast/toaster";
import { modifierContactAction } from "../action/contactFormAction";
import ContactDetails from "../components/contactDetails";
import { trouverParIdContact } from "../api/contact/contact";
import { useRouter } from "next/navigation";
import { Box, Heading, Link } from "@/components/ui";

export function ContactModification({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [chargement, setChargement] = useState(true);
  const { id } = use(params);
  async function onSubmit(FormData: FormData) {
    const resultat = await modifierContactAction(parseInt(id), FormData);

    if (resultat.succes && resultat.donnee) {
      toaster.create({ description: "Contact modifié avec succès !", type: "success" });
    } else {
      toaster.create({ description: resultat.message, type: "error" });
    }
  }
  useEffect(() => {
    async function fetch() {
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

    fetch();
  }, []);
  if (chargement) {
    return "Chargement";
  }
  return (
    <Box alignContent={"center"}>
      <Box textAlign={"center"}>
        <Heading as={"h3"}>Modification d&rsquo;un contact</Heading>
      </Box>
      <Box>
        <Link href={"./"}>Retour</Link>
      </Box>
      <ContactDetails onSubmitted={onSubmit} contactDonnee={contact ?? null}></ContactDetails>
    </Box>
  );
}
export default ContactModification;
