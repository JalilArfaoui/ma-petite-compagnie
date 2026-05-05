"use client";
import { use, useEffect, useState } from "react";

import { Contact, Tag } from "@prisma/client";
import { Toaster, toaster } from "@/components/ui/Toast/toaster";
import { modifierContactAction } from "../action/contactFormAction";
import ContactDetails from "../components/contactDetails";
import { trouverParIdContact } from "../api/contact/contact";
import { useRouter } from "next/navigation";
import { Box, Heading, Link, Stack } from "@/components/ui";
import { TagSelector } from "../components/TagSelector";
import { HistoriqueEchanges } from "../components/HistoriqueEchanges";
import { RelanceForm } from "../components/RelanceForm";

type ContactAvecTags = Contact & { tags: Tag[] };

export function ContactModification({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [contact, setContact] = useState<ContactAvecTags | null>(null);
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
        setContact(resultat.donnee as ContactAvecTags);
        setChargement(false);
      } else {
        toaster.create({ description: resultat.message, type: "error" });
        router.push("/communication");
      }
    }
    chargerContact();
  }, [id, router]);

  if (chargement) {
    return (
      <Box className="fixed w-screen h-screen bg-black/20 flex items-center justify-center">
        <Box className="bg-white rounded-xl px-8 py-5 shadow-lg">Chargement...</Box>
      </Box>
    );
  }

  return (
    <Box alignContent={"center"} className="max-w-3xl mx-auto px-4 py-6">
      <Toaster />

      <Box textAlign={"center"} className="mb-2">
        <Heading as={"h3"}>Modification d&rsquo;un contact</Heading>
      </Box>
      <Box className="mb-4">
        <Link href={"/communication"}>← Retour</Link>
      </Box>

      {/* Formulaire principal */}
      <ContactDetails onSubmitted={onSubmit} contactDonnee={contact ?? null} />

      {/* Tags — affiché seulement si le contact existe en base */}
      {contact && (
        <Stack gap={6} className="mt-6">
          {/* Tags et segmentation */}
          <Box className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
            <TagSelector contactId={contact.id} tagsInitiaux={contact.tags} />
          </Box>

          {/* Relance */}
          <Box className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
            <RelanceForm contact={contact} />
          </Box>

          {/* Historique des échanges */}
          <Box className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
            <HistoriqueEchanges contactId={contact.id} />
          </Box>
        </Stack>
      )}
    </Box>
  );
}
export default ContactModification;
