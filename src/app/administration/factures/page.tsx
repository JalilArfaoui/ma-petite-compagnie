import { getFactures } from "@/app/actions/finance";
import { DownloadButton } from "./DownloadButton";
import { Container, Heading, Stack, Button, Table, Badge, Link } from "@/components/ui";
import { Flex } from "@chakra-ui/react";
import NextLink from "next/link";

export default async function Page() {
  const factures = await getFactures();

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);

  // Calculate total TTC helpers
  const getTotalTTC = (f: any) => {
    const totalHT = f.lignes.reduce(
      (acc: number, l: any) => acc + l.quantite * l.prixUnitaireHT,
      0
    );
    const totalTVA = f.lignes.reduce(
      (acc: number, l: any) => acc + l.quantite * l.prixUnitaireHT * (l.tva / 100),
      0
    );
    return totalHT + totalTVA;
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stack gap={6}>
        <Flex justify="space-between" align="center">
          <Heading size="2xl">Factures</Heading>
          <NextLink href="/administration/factures/nouveau" passHref legacyBehavior>
            <Button as="a" colorPalette="blue">
              + Nouvelle Facture
            </Button>
          </NextLink>
        </Flex>

        <Table.Container border="1px solid" borderColor="gray.200" borderRadius="md">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Numéro</Table.Header>
                <Table.Header>Date</Table.Header>
                <Table.Header>Client</Table.Header>
                <Table.Header>Total TTC</Table.Header>
                <Table.Header>Status</Table.Header>
                <Table.Header>Actions</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {factures.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} textAlign="center">
                    Aucune facture trouvée.
                  </Table.Cell>
                </Table.Row>
              ) : (
                factures.map((facture) => (
                  <Table.Row key={facture.id}>
                    <Table.Cell fontWeight="medium">{facture.numero}</Table.Cell>
                    <Table.Cell>{new Date(facture.dateEmission).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{facture.clientNom}</Table.Cell>
                    <Table.Cell>{formatPrice(getTotalTTC(facture))}</Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette={facture.status === "BROUILLON" ? "gray" : "green"}>
                        {facture.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <DownloadButton facture={facture} />
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </Table.Container>

        <Flex justify="center" mt={4}>
          <NextLink href="/administration/entreprise" passHref legacyBehavior>
            <Button as="a" variant="ghost">
              Paramètres de l'entreprise
            </Button>
          </NextLink>
        </Flex>
      </Stack>
    </Container>
  );
}
