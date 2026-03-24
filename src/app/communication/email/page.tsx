import { prisma } from "@/lib/prisma";
import { Heading, Box, Link } from "@/components/ui";
import Formulaire_Email from "./Formulaire_Email";

export default async function Page_Email() {
  const contacts = await prisma.contact.findMany({
    orderBy: { nom: "asc" },
  });
  return (
    <Box>
      <Heading>Envoyé un email</Heading>
      <Box>
        <Link href="/">retour</Link>
      </Box>
      <Formulaire_Email contacts={contacts} />
    </Box>
  );
}