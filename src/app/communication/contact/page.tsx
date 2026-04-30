"use client";
import { Heading, Link, Box, Button } from "@/components/ui";
import ContactDetails from "../components/contactDetails";
import { creerContactAction } from "../action/contactFormAction";

import { Toaster, toaster } from "@/components/ui/Toast/toaster";

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
      <Box className="p-3">
        <Link href={"./"}>
          <Button size={"sm"} variant={"link"}>
            Retour
          </Button>
        </Link>
      </Box>

      <ContactDetails onSubmitted={onSubmit} contactDonnee={null}></ContactDetails>
    </Box>
  );
}
export default ContactCreation;
