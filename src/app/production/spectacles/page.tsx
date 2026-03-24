import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@/components/ui";
import { StatutSpectacle, TypeSpectacle } from "@prisma/client";

export const dynamic = "force-dynamic";

/* =========================
   HELPER FUNCTIONS
========================= */
const getStatusColor = (statut: string) => {
  switch (statut) {
    case "EN_CREATION":
      return "blue";
    case "EN_REPETITION":
      return "orange";
    case "EN_TOURNEE":
      return "green";
    case "ARCHIVE":
      return "gray";
    default:
      return "gray";
  }
};

const getStatusLabel = (statut: string) => {
  switch (statut) {
    case "EN_CREATION":
      return "En Création";
    case "EN_REPETITION":
      return "En Répétition";
    case "EN_TOURNEE":
      return "En Tournée";
    case "ARCHIVE":
      return "Archivé";
    default:
      return statut;
  }
};

export default async function ProductionPage() {
  const spectacles = await prisma.spectacle.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <Box className="min-h-screen bg-slate-50 py-8">
      <Container className="max-w-7xl">
        <VStack gap={8} align="stretch">
          {/* Header */}
          <Heading as="h1" className="text-4xl text-primary text-center font-bold">
            📋 Liste des spectacles ({spectacles.length})
          </Heading>

          {/* Spectacles List */}
          <Box>
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
              {spectacles.map((s) => (
                <Card
                  key={s.id}
                  className="p-6 shadow-md border-l-4 border-l-primary bg-white transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  <VStack align="stretch" gap={4}>
                    {/* Header */}
                    <Flex justify="between" align="start">
                      <Box className="flex-1">
                        <Text className="text-xs text-slate-500 mb-1">#{s.id}</Text>
                        <Heading as="h4" className="text-primary mb-2">
                          <a href={"spectacles/" + s.id}>{s.titre}</a>
                        </Heading>
                        <Badge variant={getStatusColor(s.statut)} className="mb-2">
                          {getStatusLabel(s.statut)}
                        </Badge>
                      </Box>
                    </Flex>

                    {/* Info */}
                    <Stack gap={2} className="text-sm">
                      {s.description && (
                        <Text className="text-slate-600">
                          <strong>Description:</strong> {s.description}
                        </Text>
                      )}
                      <Text>
                        <strong>Type:</strong> {s.type}
                      </Text>
                      <Text>
                        <strong>Budget:</strong>{" "}
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(s.budget_initial)}
                      </Text>
                    </Stack>
                  </VStack>
                </Card>
              ))}
            </SimpleGrid>

            {spectacles.length === 0 && (
              <Card className="p-12 text-center bg-white">
                <Text className="text-slate-500 text-lg">
                  Aucun spectacle pour le moment. Ajoutez-en un ci-dessus !
                </Text>
              </Card>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
