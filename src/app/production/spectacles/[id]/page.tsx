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
   BESOINS
========================= */
async function deleteBesoin(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.besoinSpectacle.delete({
    where: { id },
  });

  revalidatePath("/production");
}

async function updateBesoin(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const typeObjetId = Number(formData.get("typeObjetId"));
  const nb = Number(formData.get("nb"));

  await prisma.besoinSpectacle.update({
    where: { id },
    data: {
      typeObjetId: typeObjetId,
      nb: nb,
    },
  });
  revalidatePath("/production");
}

async function createBesoin(formData: FormData) {
  "use server";

  const spectacleId = Number(formData.get("spectacleId"));
  const typeObjetId = Number(formData.get("typeObjetId"));
  const nb = Number(formData.get("nb"));

  await prisma.besoinSpectacle.create({
    data: {
      spectacleId: spectacleId,
      typeObjetId: typeObjetId,
      nb: nb,
    },
  });

  revalidatePath("/production/spectacles/" + spectacleId);
}

/* =========================
   SPECTACLES
========================= */
async function deleteSpectacle(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.spectacle.delete({
    where: { id },
  });

  revalidatePath("/production");
}

async function updateSpectacle(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const titre = formData.get("titre") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as TypeSpectacle;
  const statut = formData.get("statut") as StatutSpectacle;
  const budget_initial = Number(formData.get("budget_initial")) || 0;

  await prisma.spectacle.update({
    where: { id },
    data: {
      titre: titre,
      description: description,
      type: type,
      statut: statut,
      budget_initial: budget_initial,
    },
  });

  revalidatePath("/production/spectacles");
}

export default async function ProductionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const spectacle = await prisma.spectacle.findFirst({
    where: {
      id: Number(id),
    },
  });
  const besoins = await prisma.besoinSpectacle.findMany({
    where: {
      spectacleId: Number(id), // fusionner les deux requetes pour avoir le type d'objet et son nom dans le besoin
    },
  });
  const typeObjets = await prisma.typeObjet.findMany({
    orderBy: { nom: "asc" },
  });

  if (spectacle == null) {
    return <p>ce spectacle n&apos;existe pas</p>;
  } else {
    return (
      <Box className="min-h-screen bg-slate-50 py-8">
        <Container className="max-w-7xl">
          <VStack gap={8} align="stretch">
            {/* Header */}
            <Heading as="h1" className="text-4xl text-primary text-center font-bold">
              Modifier le Spectacle
            </Heading>

            {/* Spectacles List */}
            <Box>
              <Card
                key={spectacle.id}
                className="p-6 shadow-md border-l-4 border-l-primary bg-white transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <VStack align="stretch" gap={4}>
                  {/* Update Form */}
                  <form action={updateSpectacle}>
                    <input type="hidden" name="id" value={spectacle.id} />
                    <VStack gap={3} align="stretch">
                      <SimpleGrid columns={2} gap={2}>
                        <Input
                          name="titre"
                          defaultValue={spectacle.titre}
                          className="text-sm h-8 focus:border-primary focus:ring-1 focus:ring-primary"
                        />

                        <select
                          name="type"
                          defaultValue={spectacle.type || ""}
                          className="text-sm p-1 border border-slate-300 rounded-md"
                        >
                          <option disabled value="">
                            type de spectacle
                          </option>
                          <option value="THEATRE">Thetre</option>
                          <option value="DANSE">Danse</option>
                          <option value="MUSIQUE">Musique</option>
                          <option value="CIRQUE">Cirque</option>
                          <option value="AUTRE">Autre</option>
                        </select>
                        <select
                          name="statut"
                          defaultValue={spectacle.statut}
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
                        defaultValue={spectacle.description ?? ""}
                        className="text-sm h-8 focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Description"
                      />
                      <Input
                        name="budget_initial"
                        type="number"
                        step="0.01"
                        defaultValue={spectacle.budget_initial}
                        className="text-sm h-8 focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Budget initial"
                      />

                      <HStack gap={2}>
                        <Button
                          type="submit"
                          className="bg-primary text-white text-sm h-8 hover:bg-primary-hover active:bg-primary-active flex-1"
                        >
                          ✏️ Modifier
                        </Button>
                      </HStack>
                    </VStack>
                  </form>
                  {(besoins.length == 0 && (
                    <Heading as="h3" className="mb-6 text-primary">
                      Aucun objet n&apos;est asigné au spectacle
                    </Heading>
                  )) ||
                    (besoins.length > 0 && (
                      <Heading as="h3" className="mb-6 text-primary">
                        Besoins matériels :
                      </Heading>
                    ))}

                  <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
                    {besoins.map((besoin) => (
                      <Card
                        key={besoin.id}
                        className="p-6 shadow-md border-l-4 border-l-primary bg-white transition-all hover:shadow-xl hover:-translate-y-0.5"
                      >
                        <form action={updateBesoin}>
                          <input name="id" type="hidden" value={besoin.id}></input>
                          <Box>
                            <Text className="font-semibold mb-2">objet</Text>
                            <select
                              name="typeObjetId"
                              required
                              defaultValue={besoin.typeObjetId}
                              className="p-2 border border-slate-300 rounded-md w-full"
                            >
                              {typeObjets.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.nom}
                                </option>
                              ))}
                            </select>
                          </Box>

                          <Box>
                            <Text className="font-semibold mb-2">nombre</Text>
                            <Input
                              type="number"
                              name="nb"
                              defaultValue={besoin.nb}
                              required
                              className="focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                          </Box>

                          <Button
                            type="submit"
                            className="bg-primary text-white mt-6 h-12 px-6 hover:bg-primary-hover active:bg-primary-active w-full md:w-auto"
                          >
                            modifier
                          </Button>
                        </form>

                        {/* Separator */}
                        <Box className="h-px bg-slate-200" />

                        {/* Delete Form */}
                        <form action={deleteBesoin}>
                          <input type="hidden" name="id" value={besoin.id} />
                          <Button
                            type="submit"
                            className="border border-red-200 text-red-600 bg-white hover:bg-red-50 text-sm h-8 w-full"
                          >
                            🗑️ Supprimer
                          </Button>
                        </form>
                      </Card>
                    ))}
                  </SimpleGrid>
                  {/* Separator */}
                  <Box className="h-px bg-slate-200" />
                  <Heading as="h4" className="mb-6 text-primary">
                    ➕ Asigner un objet a ce spectacle
                  </Heading>
                  <form action={createBesoin}>
                    <Box>
                      <Text className="font-semibold mb-2">objet</Text>
                      <input name="spectacleId" type="hidden" value={spectacle.id}></input>
                      <select
                        name="typeObjetId"
                        required
                        defaultValue=""
                        className="p-2 border border-slate-300 rounded-md w-full"
                      >
                        <option disabled value="">
                          type d&apos;objet
                        </option>
                        {typeObjets.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.nom}
                          </option>
                        ))}
                      </select>
                    </Box>

                    <Box>
                      <Text className="font-semibold mb-2">nombre</Text>
                      <Input
                        type="number"
                        name="nb"
                        defaultValue={1}
                        required
                        className="focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </Box>

                    <Button
                      type="submit"
                      className="bg-primary text-white mt-6 h-12 px-6 hover:bg-primary-hover active:bg-primary-active w-full md:w-auto"
                    >
                      ➕ asigner cet objet
                    </Button>
                  </form>

                  <Button className="border border-red-200 text-red-600 bg-white hover:bg-red-50 text-sm h-8 w-full">
                    <a href={spectacle.id + "/nouvelle-representation/"}>
                      programmer une representation
                    </a>
                  </Button>
                  {/* Delete Form */}
                  <form action={deleteSpectacle}>
                    <input type="hidden" name="id" value={spectacle.id} />
                    <Button
                      type="submit"
                      className="border border-red-200 text-red-600 bg-white hover:bg-red-50 text-sm h-8 w-full"
                    >
                      🗑️ Supprimer le spectacle
                    </Button>
                  </form>
                </VStack>
              </Card>
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  }
}
