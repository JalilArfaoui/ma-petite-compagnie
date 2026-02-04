"use client";
import { Heading, Link, Box, Text } from "@/components/ui";
import {} from "@chakra-ui/react";
import ContactDetails from "../components/contactDetails";
import { creerContactAction } from "../action/contactFormAction";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { toaster } from "@/components/ui/Toast/toaster";

export function ContactCreation() {
  async function onSubmit(FormData: FormData) {
    const result = await creerContactAction(FormData);
    if (result.succes) {
      toaster.create({
        description: `Le contact a été créé. `,
        type: "info",
      });
    } else {
      toaster.create({
        description: result.message,
        type: "error",
      });
    }
  }
  return (
    <Box alignContent={"center"}>
      <Toaster />
      <Box textAlign={"center"}>
        <Heading as={"h3"}>Création d&rsquo;un contact</Heading>
      </Box>
      <Box>
        <Link href={"./"}>Retour</Link>
      </Box>

      <ContactDetails onSubmitted={onSubmit} contactDonnee={null}></ContactDetails>
    </Box>
  );
}
export default ContactCreation;
