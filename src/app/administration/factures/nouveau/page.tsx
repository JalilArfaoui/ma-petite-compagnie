import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FactureEditor } from "./editor";
import { redirect } from "next/navigation";
import { Box, Container, Heading } from "@/components/ui";

export default async function NouveauFacturePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session?.activeCompanyId) {
    redirect("/profil");
  }

  const compagnie = await prisma.compagnie.findUnique({
    where: { id: session.activeCompanyId },
  });

  if (!compagnie) {
    redirect("/profil");
  }

  return (
    <Container className="py-8 max-w-7xl">
      <Heading as="h3" className="mb-6">Nouvelle Facture</Heading>
      <FactureEditor compagnie={compagnie} />
    </Container>
  );
}
