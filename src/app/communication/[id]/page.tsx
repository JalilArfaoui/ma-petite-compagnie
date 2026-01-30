"use client";
import { use, useEffect, useState } from "react";
import { creerContact } from "../action/contactFormAction";
import ContactModification from "../components/ContactModification";
import { trouverParIdContact } from "../api/contact";
import { Contact } from "@prisma/client";
import { toaster } from "@/components/ui/toaster";
export function ContactDetails({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = useState<Contact | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const { id } = use(params);
  async function onSubmit(FormData: FormData) {
    if (data) {
      // TODO modifier le contact
    } else {
      const result = await creerContact(FormData);
      if (result.succes) {
        toaster.success({ title: "Contact créé avec succès !" });
      } else {
        toaster.error({ title: "Erreur", description: result.message });
      }
    }
  }
  useEffect(() => {
    async function fetch() {
      const dataC = (await trouverParIdContact(parseInt(id))).contact;
      console.log(dataC);
      if (dataC) {
        setData(dataC);
      }
      setDataLoading(false);
    }

    fetch();
    return;
  }, []);
  if (dataLoading) {
    return <>...Loading</>;
  }
  return (
    <>
      <ContactModification onSubmitted={onSubmit} contactDonnee={data}></ContactModification>
    </>
  );
}
export default ContactDetails;
