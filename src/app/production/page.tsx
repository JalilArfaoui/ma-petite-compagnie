import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  Stack,
  Text,
  Badge,
  VStack,
  HStack,
} from "@chakra-ui/react";

export const dynamic = "force-dynamic";

const redish = "#D00039";

/* =========================
   CREATE
========================= */
async function createSpectacle(formData: FormData) {
  "use server";

  const titre = formData.get("titre") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const statut = formData.get("statut") as any;
  const troupe = formData.get("troupe") as string;
  const budget_initial = Number(formData.get("budget_initial")) || 0;

  await prisma.spectacle.create({
    data: {
      titre,
      description,
      type,
      statut,
      troupe,
      budget_initial,
    },
  });

  revalidatePath("/production");
}

/* =========================
   UPDATE
========================= */
async function updateSpectacle(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const titre = formData.get("titre") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const statut = formData.get("statut") as any;
  const troupe = formData.get("troupe") as string;
  const budget_initial = Number(formData.get("budget_initial")) || 0;

  await prisma.spectacle.update({
    where: { id },
    data: {
      titre,
      description,
      type,
      statut,
      troupe,
      budget_initial,
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
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        <VStack gap={8} align="stretch">
          {/* Header */}
          <Heading size="2xl" color={redish} textAlign="center" fontWeight="bold">
            🎭 Gestion des Spectacles
          </Heading>

          {/* Create Form */}
          <Card.Root p={6} boxShadow="lg" borderTopWidth="4px" borderTopColor={redish} bg="white">
            <Heading size="md" mb={6} color={redish}>
              ➕ Ajouter un spectacle
            </Heading>

            <form action={createSpectacle}>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Titre *
                  </Text>
                  <Input
                    name="titre"
                    placeholder="Titre du spectacle"
                    required
                    _focus={{ borderColor: redish, boxShadow: `0 0 0 1px ${redish}` }}
                  />
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Type *
                  </Text>
                  <Input
                    name="type"
                    placeholder="Type de spectacle"
                    required
                    _focus={{ borderColor: redish, boxShadow: `0 0 0 1px ${redish}` }}
                  />
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Troupe *
                  </Text>
                  <Input
                    name="troupe"
                    placeholder="Nom de la troupe"
                    required
                    _focus={{ borderColor: redish, boxShadow: `0 0 0 1px ${redish}` }}
                  />
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Statut *
                  </Text>
                  <Box
                    as="select"
                    name="statut"
                    required
                    p={2}
                    borderWidth="1px"
                    borderColor="gray.300"
                    borderRadius="md"
                    w="100%"
                    _focus={{ borderColor: redish, boxShadow: `0 0 0 1px ${redish}` }}
                  >
                    <option value="EN_CREATION">En Création</option>
                    <option value="EN_REPETITION">En Répétition</option>
                    <option value="EN_TOURNEE">En Tournée</option>
                    <option value="ARCHIVE">Archivé</option>
                  </Box>
                </Box>

                <Box gridColumn={{ base: "1", md: "1 / -1" }}>
                  <Text fontWeight="semibold" mb={2}>
                    Description
                  </Text>
                  <Input
                    name="description"
                    placeholder="Description du spectacle"
                    _focus={{ borderColor: redish, boxShadow: `0 0 0 1px ${redish}` }}
                  />
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Budget Initial (€)
                  </Text>
                  <Input
                    name="budget_initial"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    _focus={{ borderColor: redish, boxShadow: `0 0 0 1px ${redish}` }}
                  />
                </Box>
              </Grid>

              <Button
                type="submit"
                bg={redish}
                color="white"
                mt={6}
                size="lg"
                _hover={{ bg: "#a00030" }}
                _active={{ bg: "#800020" }}
                width={{ base: "full", md: "auto" }}
              >
                ➕ Ajouter le spectacle
              </Button>
            </form>
          </Card.Root>

          {/* Separator */}
          <Box h="2px" bg={redish} />

          {/* Spectacles List */}
          <Box>
            <Heading size="lg" mb={6} color={redish}>
              📋 Liste des spectacles ({spectacles.length})
            </Heading>

            <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
              {spectacles.map((s) => (
                <Card.Root
                  key={s.id}
                  p={6}
                  boxShadow="md"
                  borderLeftWidth="4px"
                  borderLeftColor={redish}
                  bg="white"
                  transition="all 0.2s"
                  _hover={{ boxShadow: "xl", transform: "translateY(-2px)" }}
                >
                  <VStack align="stretch" gap={4}>
                    {/* Header */}
                    <Flex justify="space-between" align="start">
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          #{s.id}
                        </Text>
                        <Heading size="md" color={redish} mb={2}>
                          {s.titre}
                        </Heading>
                        <Badge colorPalette={getStatusColor(s.statut)} mb={2}>
                          {getStatusLabel(s.statut)}
                        </Badge>
                      </Box>
                    </Flex>

                    {/* Info */}
                    <Stack gap={2} fontSize="sm">
                      {s.description && (
                        <Text color="gray.600">
                          <strong>Description:</strong> {s.description}
                        </Text>
                      )}
                      <Text>
                        <strong>Type:</strong> {s.type}
                      </Text>
                      <Text>
                        <strong>Troupe:</strong> {s.troupe}
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
                    <Box h="1px" bg="gray.200" />

                    {/* Update Form */}
                    <form action={updateSpectacle}>
                      <input type="hidden" name="id" value={s.id} />
                      <VStack gap={3} align="stretch">
                        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                          <Input
                            name="titre"
                            defaultValue={s.titre}
                            size="sm"
                            _focus={{ borderColor: redish, boxShadow: `0 0 0 1px ${redish}` }}
                          />
                          <Input
                            name="type"
                            defaultValue={s.type}
                            size="sm"
                            _focus={{ borderColor: redish, boxShadow: `0 0 0 1px ${redish}` }}
                          />
                          <Input
                            name="troupe"
                            defaultValue={s.troupe}
                            size="sm"
                            _focus={{ borderColor: redish, boxShadow: `0 0 0 1px ${redish}` }}
                          />
                          <Box
                            as="select"
                            name="statut"
                            defaultValue={s.statut}
                            fontSize="sm"
                            p={1}
                            borderWidth="1px"
                            borderColor="gray.300"
                            borderRadius="md"
                            _focus={{ borderColor: redish, boxShadow: `0 0 0 1px ${redish}` }}
                          >
                            <option value="EN_CREATION">En Création</option>
                            <option value="EN_REPETITION">En Répétition</option>
                            <option value="EN_TOURNEE">En Tournée</option>
                            <option value="ARCHIVE">Archivé</option>
                          </Box>
                        </Grid>
                        <Input
                          name="description"
                          defaultValue={s.description ?? ""}
                          size="sm"
                          placeholder="Description"
                          _focus={{ borderColor: redish, boxShadow: `0 0 0 1px ${redish}` }}
                        />
                        <Input
                          name="budget_initial"
                          type="number"
                          step="0.01"
                          defaultValue={s.budget_initial}
                          size="sm"
                          _focus={{ borderColor: redish, boxShadow: `0 0 0 1px ${redish}` }}
                        />

                        <HStack gap={2}>
                          <Button
                            type="submit"
                            bg={redish}
                            color="white"
                            size="sm"
                            _hover={{ bg: "#a00030" }}
                            _active={{ bg: "#800020" }}
                            flex={1}
                          >
                            ✏️ Modifier
                          </Button>
                        </HStack>
                      </VStack>
                    </form>

                    {/* Delete Form */}
                    <form action={deleteSpectacle}>
                      <input type="hidden" name="id" value={s.id} />
                      <Button
                        type="submit"
                        variant="outline"
                        colorPalette="red"
                        size="sm"
                        width="full"
                      >
                        🗑️ Supprimer
                      </Button>
                    </form>
                  </VStack>
                </Card.Root>
              ))}
            </Grid>

            {spectacles.length === 0 && (
              <Card.Root p={12} textAlign="center" bg="white">
                <Text color="gray.500" fontSize="lg">
                  Aucun spectacle pour le moment. Ajoutez-en un ci-dessus !
                </Text>
              </Card.Root>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}