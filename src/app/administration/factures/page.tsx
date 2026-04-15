import { getFactures } from "@/app/actions/finance";
import { Box, Button, Card, Container, Flex, Heading, Text, Badge } from "@/components/ui";
import { Table } from "@/components/ui/Table/Table";
import { FactureStatus } from "@prisma/client";
import Link from "next/link";
import { LuPlus, LuFileText } from "react-icons/lu";

function getStatusBadge(status: FactureStatus) {
  switch (status) {
    case "BROUILLON":
      return <Badge variant="gray">Brouillon</Badge>;
    case "EMISE":
      return <Badge variant="blue">Émise</Badge>;
    case "PAYEE":
      return <Badge variant="green">Payée</Badge>;
    case "ANNULEE":
      return <Badge variant="red">Annulée</Badge>;
    default:
      return <Badge variant="gray">{status}</Badge>;
  }
}

export default async function FacturesPage() {
  const factures = await getFactures();

  return (
    <Container className="py-8 max-w-6xl">
      <Flex justify="between" align="center" className="mb-8">
        <Box>
          <Heading as="h2">Factures</Heading>
          <Text className="text-slate-500">Gérez les factures émises par la compagnie.</Text>
        </Box>
        <Link href="/administration/factures/nouveau">
          <Button icon={<LuPlus />}>Nouvelle facture</Button>
        </Link>
      </Flex>

      <Card className="overflow-hidden">
        {factures.length === 0 ? (
          <Flex direction="column" align="center" justify="center" className="py-16 text-slate-400">
            <LuFileText size={48} className="mb-4 opacity-50" />
            <Text className="text-lg">Aucune facture</Text>
            <Text className="text-sm">Commencez par en créer une nouvelle.</Text>
          </Flex>
        ) : (
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Numéro</Table.Header>
                <Table.Header>Client</Table.Header>
                <Table.Header>Date d'émission</Table.Header>
                <Table.Header>Échéance</Table.Header>
                <Table.Header>Montant HT</Table.Header>
                <Table.Header>Statut</Table.Header>
                <Table.Header className="text-right">Actions</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {factures.map((facture) => {
                const montantHT = facture.lignes.reduce(
                  (acc, ligne) => acc + ligne.quantite * ligne.prixUnitaireHT,
                  0
                );

                return (
                  <Table.Row key={facture.id}>
                    <Table.Cell className="font-medium text-slate-900">{facture.numero}</Table.Cell>
                    <Table.Cell>{facture.clientNom}</Table.Cell>
                    <Table.Cell>{facture.dateEmission.toLocaleDateString("fr-FR")}</Table.Cell>
                    <Table.Cell>{facture.dateEcheance.toLocaleDateString("fr-FR")}</Table.Cell>
                    <Table.Cell>{montantHT.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</Table.Cell>
                    <Table.Cell>{getStatusBadge(facture.status)}</Table.Cell>
                    <Table.Cell className="text-right">
                      {/* TODO: Add actions like view PDF / Edit / Delete */}
                      <Button variant="ghost" size="sm">Voir</Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        )}
      </Card>
    </Container>
  );
}
