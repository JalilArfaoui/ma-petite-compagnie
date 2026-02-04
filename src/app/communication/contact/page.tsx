"use client";
import { Heading, Link, Box, Text } from "@/components/ui";
import {} from "@chakra-ui/react";
import ContactDetails from "../components/contactDetails";
import { creerContactAction } from "../action/contactFormAction";
import { useState } from "react";
export function ContactCreation() {
  const [error, setError] = useState("");
  async function onSubmit(FormData: FormData) {
    const result = await creerContactAction(FormData);
    if (result.succes) {
      alert(
        "Contact créé" +
          result.contact?.nom +
          " " +
          result.contact?.prenom +
          " " +
          result.contact?.role +
          " " +
          result.contact?.email
      );
    } else {
      setError(result.message);
    }
  }
  return (
    <Box alignContent={"center"}>
      <Box textAlign={"center"}>
        <Heading as={"h3"}>Création d'un contact</Heading>
      </Box>
      <Box>
        <Link href={"./"}>Retour</Link>
      </Box>

      <ContactDetails onSubmitted={onSubmit} contactDonnee={null}></ContactDetails>
      {error.length != 0 && (
        <Text color={"red"} textAlign="center">
          {error}
        </Text>
      )}
    </Box>
  );
}
export default ContactCreation;
