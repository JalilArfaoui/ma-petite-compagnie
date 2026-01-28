"use client";
import { use, useEffect, useState } from "react";
import { createContact } from "../action/contactFormAction";
import ContactModification from "../components/ContactModification";
import { trouverParId } from "../api/contact";
import { Contact } from "@prisma/client";
export function ContactDetails({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = useState<Contact | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const { id } = use(params);
  function onSubmit(FormData: FormData) {
    if (data) {
      console.log("Created");
    } else {
      createContact(FormData);
    }
  }
  useEffect(() => {
    async function fetch() {
      const dataC = (await trouverParId(parseInt(id))).contact;
      console.log(dataC);
      if (dataC) {
        setData(dataC);
      }
      setDataLoading(false);
    }

    fetch();
    return;
  });
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
