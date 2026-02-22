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
import { StatutSpectacle } from "@prisma/client";

export const dynamic = "force-dynamic";

/* =========================
   CREATE
========================= */
async function createSpectacle(formData: FormData) {
  "use server";

  const titre = formData.get("titre") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const statut = formData.get("statut") as StatutSpectacle;
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
  const statut = formData.get("statut") as StatutSpectacle;
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
    <Box className="min-h-screen bg-slate-50 py-8">
      <Container className="max-w-7xl">
        <VStack gap={8} align="stretch">
          {/* Header */}
          <Heading as="h1" className="text-4xl text-[#D00039] text-center font-bold">
            🎭 Gestion des Spectacles
          </Heading>

          {/* Create Form */}
          <Card className="p-6 shadow-lg border-t-4 border-t-[#D00039] bg-white">
            <Heading as="h3" className="mb-6 text-[#D00039]">
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
                    className="focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039]"
                  />
                </Box>

                <Box>
                  <Text className="font-semibold mb-2">Type *</Text>
                  <Input
                    name="type"
                    placeholder="Type de spectacle"
                    required
                    className="focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039]"
                  />
                </Box>

                <Box>
                  <Text className="font-semibold mb-2">Troupe *</Text>
                  <Input
                    name="troupe"
                    placeholder="Nom de la troupe"
                    required
                    className="focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039]"
                  />
                </Box>

                <Box>
                  <Text className="font-semibold mb-2">Statut *</Text>
                  <select
                    name="statut"
                    required
                    className="p-2 border border-slate-300 rounded-md w-full"
                  >
                    <option value="EN_CREATION">En Création</option>
                    <option value="EN_REPETITION">En Répétition</option>
                    <option value="EN_TOURNEE">En Tournée</option>
                    <option value="ARCHIVE">Archivé</option>
                  </select>
                </Box>

                <Box className="md:col-span-2">
                  <Text className="font-semibold mb-2">Description</Text>
                  <Input
                    name="description"
                    placeholder="Description du spectacle"
                    className="focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039]"
                  />
                </Box>

                <Box>
                  <Text className="font-semibold mb-2">Budget Initial (€)</Text>
                  <Input
                    name="budget_initial"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039]"
                  />
                </Box>
              </SimpleGrid>

              <Button
                type="submit"
                className="bg-[#D00039] text-white mt-6 h-12 px-6 hover:bg-[#a00030] active:bg-[#800020] w-full md:w-auto"
              >
                ➕ Ajouter le spectacle
              </Button>
            </form>
          </Card>

          {/* Separator */}
          <Box className="h-0.5 bg-[#D00039]" />

          {/* Spectacles List */}
          <Box>
            <Heading as="h3" className="mb-6 text-[#D00039]">
              📋 Liste des spectacles ({spectacles.length})
            </Heading>

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
              {spectacles.map((s) => (
                <Card
                  key={s.id}
                  className="p-6 shadow-md border-l-4 border-l-[#D00039] bg-white transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  <VStack align="stretch" gap={4}>
                    {/* Header */}
                    <Flex justify="between" align="start">
                      <Box className="flex-1">
                        <Text className="text-xs text-slate-500 mb-1">#{s.id}</Text>
                        <Heading as="h4" className="text-[#D00039] mb-2">
                          {s.titre}
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
                    <Box className="h-px bg-slate-200" />

                    {/* Update Form */}
                    <form action={updateSpectacle}>
                      <input type="hidden" name="id" value={s.id} />
                      <VStack gap={3} align="stretch">
                        <SimpleGrid columns={2} gap={2}>
                          <Input
                            name="titre"
                            defaultValue={s.titre}
                            className="text-sm h-8 focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039]"
                          />
                          <Input
                            name="type"
                            defaultValue={s.type}
                            className="text-sm h-8 focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039]"
                          />
                          <Input
                            name="troupe"
                            defaultValue={s.troupe}
                            className="text-sm h-8 focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039]"
                          />
                          <select
                            name="statut"
                            defaultValue={s.statut}
                            className="text-sm p-1 border border-slate-300 rounded-md"
                          >
                            <option value="EN_CREATION">En Création</option>
                            <option value="EN_REPETITION">En Répétition</option>
                            <option value="EN_TOURNEE">En Tournée</option>
                            <option value="ARCHIVE">Archivé</option>
                          </select>
                        </SimpleGrid>
                        <Input
                          name="description"
                          defaultValue={s.description ?? ""}
                          className="text-sm h-8 focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039]"
                          placeholder="Description"
                        />
                        <Input
                          name="budget_initial"
                          type="number"
                          step="0.01"
                          defaultValue={s.budget_initial}
                          className="text-sm h-8 focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039]"
                        />

                        <HStack gap={2}>
                          <Button
                            type="submit"
                            className="bg-[#D00039] text-white text-sm h-8 hover:bg-[#a00030] active:bg-[#800020] flex-1"
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
