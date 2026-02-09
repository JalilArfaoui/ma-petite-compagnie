"use client";
import { use, useEffect, useState } from "react";

import { Contact } from "@prisma/client";
import { toaster } from "@/components/ui/toaster";
import { modifierContactAction } from "../action/contactFormAction";
import ContactDetails from "../components/contactDetails";
import { trouverParIdContact } from "../api/contact/contact";

import { useRouter } from "next/navigation";

export function ContactModification({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [contact, setContact] = useState<Contact>();
  const [chargement, setChargement] = useState(true);
  const { id } = use(params);
  async function onSubmit(FormData: FormData) {
    const resultat = await modifierContactAction(parseInt(id), FormData);

    if (resultat.succes && resultat.donnee) {
      toaster.create({ description: "Contact modifié avec succès !", type: "success" });
      setContact(resultat.donnee);
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
        toaster.create({ description: resultat.message, type: "error" });
        router.push("/communication");
      }
    }

    fetch();
  }, []);
  if (chargement) {
    return "Chargement";
  }
  return (
    <>
      <ContactDetails onSubmitted={onSubmit} contactDonnee={contact ?? null}></ContactDetails>
    </>
  );
}
export default ContactModification;
