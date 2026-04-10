"use client";

import { Heading, Box, Link } from "@/components/ui";
import { Formulaire_Email } from "./Formulaire_Email";

export default function Page_Email() {
  return (
    <Box>
      <Heading>Envoye Email (Brevo)</Heading>

      <Box>
        <Link href="./">Retour</Link>
      </Box>

      <Formulaire_Email />
    </Box>
  );
}