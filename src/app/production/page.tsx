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
   CREATE
========================= */
async function createSpectacle(formData: FormData) {
  "use server";

  const titre = formData.get("titre") as string;
  const type = formData.get("type") as TypeSpectacle;

  await prisma.spectacle.create({
    data: {
      titre: titre,
      type: type,
      compagnieId: 1, // placeholder
    },
  });

  revalidatePath("/production");
}

/* =========================
   DELETE
========================= */
async function deleteSpectacle(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.spectacle.delete({
    where: { id },
  });

  revalidatePath("/production");
}

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

/* =========================
   PAGE
========================= */
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
            🎭 Gestion des Spectacles
          </Heading>

          {/* Create Form */}
          <Card className="p-6 shadow-lg border-t-4 border-t-primary bg-white">
            <Heading as="h3" className="mb-6 text-primary">
              ➕ Ajouter un spectacle
            </Heading>

            <form action={createSpectacle}>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Box>
                  <Text className="font-semibold mb-2">Titre *</Text>
                  <Input
                    name="titre"
                    placeholder="Titre du spectacle"
                    required
                    className="focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </Box>

                <Box>
                  <Text className="font-semibold mb-2">Type *</Text>
                  <select
                    name="type"
                    defaultValue=""
                    className="text-sm p-1 border border-slate-300 rounded-md"
                  >
                    <option disabled value="">
                      type de spectacle
                    </option>
                    <option value="THEATRE">Theatre</option>
                    <option value="DANSE">Danse</option>
                    <option value="MUSIQUE">Musique</option>
                    <option value="CIRQUE">Cirque</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </Box>
              </SimpleGrid>

              <Button
                type="submit"
                className="bg-primary text-white mt-6 h-12 px-6 hover:bg-primary-hover active:bg-primary-active w-full md:w-auto"
              >
                ➕ Ajouter le spectacle
              </Button>
            </form>
          </Card>

          {/* Separator */}
          <Box className="h-0.5 bg-primary" />

          {/* Spectacles List */}
          <Box>
            <Heading as="h3" className="mb-6 text-primary">
              📋 Liste des spectacles ({spectacles.length})
            </Heading>

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
                          <a href={"production/spectacles/" + s.id}>{s.titre}</a>
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

                    {/* Separator */}
                    <Box className="h-px bg-slate-200" />

                    {/* Delete Form */}
                    <form action={deleteSpectacle}>
                      <input type="hidden" name="id" value={s.id} />
                      <Button
                        type="submit"
                        className="border border-red-200 text-red-600 bg-white hover:bg-red-50 text-sm h-8 w-full"
                      >
                        🗑️ Supprimer
                      </Button>
                    </form>
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
