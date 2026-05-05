import { getFactureById } from "@/app/actions/finance";
import { FactureEditor } from "../nouveau/editor";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Box, Button, Container, Flex, Heading, Text, Badge } from "@/components/ui";
import Link from "next/link";
import { LuArrowLeft, LuDownload } from "react-icons/lu";

const statusLabel: Record<string, string> = {
  EMISE: "Émise",
  PAYEE: "Payée",
  ANNULEE: "Annulée",
};

export default async function FacturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const factureId = parseInt(id);
  if (isNaN(factureId)) notFound();

  const facture = await getFactureById(factureId);
  if (!facture) notFound();

  const session = await auth();
  const compagnieId = session?.activeCompanyId;
  if (!compagnieId) notFound();

  const compagnie = await prisma.compagnie.findUnique({ where: { id: compagnieId } });
  if (!compagnie) notFound();

  // --- Brouillon : on ouvre l'éditeur pré-rempli ---
  if (facture.status === "BROUILLON") {
    return (
      <Box className="p-6">
        <Flex align="center" gap={4} className="mb-6">
          <Link href="/administration/factures">
            <Button variant="ghost" size="sm" icon={<LuArrowLeft />}>Retour</Button>
          </Link>
          <Heading as="h3" className="text-lg font-semibold">Brouillon - {facture.numero}</Heading>
        </Flex>
        <FactureEditor compagnie={compagnie} initialFacture={facture} />
      </Box>
    );
  }

  // --- Émise / Payée / Annulée : on affiche le PDF en lecture seule ---
  return (
    <Container className="py-8 max-w-6xl" style={{ height: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}>
      <Flex justify="between" align="center" className="mb-6">
        <Flex align="center" gap={4}>
          <Link href="/administration/factures">
            <Button variant="ghost" size="sm" icon={<LuArrowLeft />}>Retour</Button>
          </Link>
          <Box>
            <Heading as="h2">{facture.numero}</Heading>
            <Text className="text-slate-500">{facture.clientNom}</Text>
          </Box>
          <Badge variant={facture.status === "PAYEE" ? "green" : facture.status === "ANNULEE" ? "red" : "blue"}>
            {statusLabel[facture.status] || facture.status}
          </Badge>
        </Flex>
        <a href={`/api/factures/${factureId}/pdf`} download={`${facture.numero}.pdf`}>
          <Button variant="outline" size="sm" icon={<LuDownload />}>Télécharger le PDF</Button>
        </a>
      </Flex>
      <Box className="flex-1 bg-slate-100 rounded-xl overflow-hidden shadow-inner border">
        <iframe
          src={`/api/factures/${factureId}/pdf`}
          className="w-full h-full border-none rounded-xl"
          style={{ minHeight: "700px" }}
        />
      </Box>
    </Container>
  );
}
