"use client";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Link,
  List,
  Radio,
  RadioGroup,
  Switch,
  Table,
  Textarea,
  Heading,
  Box,
  Container,
  Stack,
  Text,
  Icon,
  SearchBar,
  Select,
  Toaster,
  toaster,
  Modal,
  FileUpload,
  Pagination,
} from "@/components/ui";
import { useState } from "react";
import { FaHome } from "react-icons/fa";

const EXEMPLE_MEMBRES = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  nom: ["Dupont", "Martin", "Bernard", "Lefevre", "Moreau"][i % 5],
  prenom: ["Jean", "Marie", "Alice", "Paul", "Sophie"][i % 5],
  role: ["Comédien", "Metteur en scène", "Régisseur", "Directeur", "Costumière"][i % 5],
}));

const PAGE_SIZE_EXEMPLE = 5;

export default function Home() {
  const [pagePagination, setPagePagination] = useState(1);
  const totalPagesPagination = Math.ceil(EXEMPLE_MEMBRES.length / PAGE_SIZE_EXEMPLE);
  const membresPagines = EXEMPLE_MEMBRES.slice(
    (pagePagination - 1) * PAGE_SIZE_EXEMPLE,
    pagePagination * PAGE_SIZE_EXEMPLE
  );

  return (
    <Container className="py-10 px-4 max-w-7xl mx-auto">
      <Toaster />
      <Stack className="gap-10">
        <Box className="text-center">
          <Heading as="h3" className="mb-4">
            Composants
          </Heading>
          <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
        </Box>

        {/* ======== Icônes ========================================= */}

        <Box>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Heading as="h3" className="mb-6 pb-2 border-b">
                Icons
              </Heading>
              <Card title="Icons">
                <Card.Body>
                  <div className="flex items-center gap-2 mb-2">
                    <Text>Icon size : sm</Text>
                    <Icon className="w-4 h-4">
                      <FaHome />
                    </Icon>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Text>Icon size : md</Text>
                    <Icon className="w-6 h-6">
                      <FaHome />
                    </Icon>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Text>Icon size : lg</Text>
                    <Icon className="w-8 h-8">
                      <FaHome />
                    </Icon>
                  </div>
                  <div className="flex items-center gap-2">
                    <Text>Icon size : xl</Text>
                    <Icon className="w-10 h-10">
                      <FaHome />
                    </Icon>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* ======== Titres ========================================= */}
            <div>
              <Heading as="h3" className="mb-6 pb-2 border-b">
                Headings
              </Heading>
              <Card title="Headings">
                <Card.Body>
                  <Stack className="gap-2">
                    <Heading as="h1" className="font-extrabold mb-6 pb-2">
                      Titre 1
                    </Heading>
                    <Heading as="h2" className="font-bold mb-6 pb-2">
                      Titre 2
                    </Heading>
                    <Heading as="h3" className="font-semibold mb-6 pb-2">
                      Titre 3
                    </Heading>
                    <Heading as="h4" className="font-medium mb-6 pb-2">
                      Titre 4
                    </Heading>
                  </Stack>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Box>

        {/* ======== Cards ========================================= */}

        <Box>
          <Heading as="h3" className="text-xl font-bold mb-6 pb-2 border-b">
            Cards
          </Heading>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <Card title="Simple Card" description="Card Description" />
            <Card
              title="Red Card"
              description="Card Description"
              icon={<FaHome />}
              iconColor="red"
            />
            <Card
              title="Green Card"
              description="Card Description"
              icon={<FaHome />}
              iconColor="green"
            />
            <Card
              title="Blue Card"
              description="Card Description"
              icon={<FaHome />}
              iconColor="blue"
            />
            <Card
              title="Orange Card"
              description="Card Description"
              icon={<FaHome />}
              iconColor="orange"
            />
            <Card
              title="Yellow Card"
              description="Card Description"
              icon={<FaHome />}
              iconColor="yellow"
            />
          </div>
        </Box>

        {/* ======== Boutons et liens ========================================= */}

        <Box>
          <Heading as="h3" className="text-xl font-bold mb-6 pb-2 border-b">
            Boutons et liens
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Buttons">
              <Card.Body>
                <div className="flex flex-wrap gap-4 mb-4">
                  <Button variant="solid">Solid</Button>
                  <Button variant="outline">Outline</Button>
                </div>
                <div className="flex flex-wrap gap-4 mb-4">
                  <Button variant="solid" icon={<FaHome />} iconSide="right">
                    Icon Right
                  </Button>
                  <Button variant="outline" icon={<FaHome />} iconSide="left">
                    Icon Left
                  </Button>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="solid" size="sm">
                    Small
                  </Button>
                  <Button variant="outline" size="default">
                    Medium
                  </Button>
                  <Button variant="solid" size="lg">
                    Large
                  </Button>
                </div>
              </Card.Body>
            </Card>
            <Card title="Links">
              <Card.Body>
                <Stack className="gap-2">
                  <Link href="#">Standard Link</Link>
                </Stack>
              </Card.Body>
            </Card>
          </div>
        </Box>

        {/* ======== Inputs ========================================= */}

        <Box>
          <Heading as="h3" className="text-xl font-bold mb-6 pb-2 border-b">
            Forms & Inputs
          </Heading>
          <Stack className="gap-6">
            <Card title="Inputs">
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Stack className="gap-4">
                    <Box>
                      <Text className="font-bold mb-2">Input</Text>
                      <Input placeholder="Type something..." />
                    </Box>
                    <Box>
                      <Text className="font-bold mb-2">SearchBar</Text>
                      <SearchBar placeholder="Rechercher..." />
                    </Box>
                    <Box>
                      <Text className="font-bold mb-2">Textarea</Text>
                      <Textarea placeholder="Type longer text..." />
                    </Box>
                    <Box>
                      <Text className="font-bold mb-2">Select</Text>
                      <Select defaultValue="item1">
                        <Select.Trigger>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Group>
                            <Select.Label>Catégorie 1</Select.Label>
                            <Select.Item value="item1">Item 1</Select.Item>
                            <Select.Item value="item2">Item 2</Select.Item>
                            <Select.Separator />
                            <Select.Label>Catégorie 2</Select.Label>
                            <Select.Item value="item3">Item 3</Select.Item>
                            <Select.Item value="item4">Item 4</Select.Item>
                            <Select.Item value="item5">Item 5</Select.Item>
                          </Select.Group>
                        </Select.Content>
                      </Select>
                    </Box>
                  </Stack>
                  <Stack className="gap-4">
                    <Box>
                      <Text className="font-bold mb-2">Checkbox</Text>
                      <Checkbox>Accept terms and conditions</Checkbox>
                    </Box>
                    <Box>
                      <Text className="font-bold mb-2">Switch</Text>
                      <Switch>Enable notifications</Switch>
                    </Box>
                    <Box>
                      <Text className="font-bold mb-2">Radio Group</Text>
                      <RadioGroup className="gap-4">
                        <div className="flex flex-row gap-4">
                          <Radio value="1" name="r1">
                            Option 1
                          </Radio>
                          <Radio value="2" name="r1">
                            Option 2
                          </Radio>
                        </div>
                      </RadioGroup>
                    </Box>
                  </Stack>
                </div>
              </Card.Body>
            </Card>
          </Stack>
        </Box>

        {/* ======== Badges et toasts ========================================= */}

        <Box>
          <Heading as="h3" className="text-xl font-bold mb-6 pb-2 border-b">
            Data Display & Feedback
          </Heading>
          <Stack className="gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Badges">
                <Card.Body>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="gray">gray</Badge>
                    <Badge variant="green">green</Badge>
                    <Badge variant="orange">orange</Badge>
                    <Badge variant="red">red</Badge>
                    <Badge variant="blue">blue</Badge>
                    <Badge variant="purple">purple</Badge>
                    <Badge variant="yellow">yellow</Badge>
                    <Badge variant="cyan">cyan</Badge>
                    <Badge variant="pink">pink</Badge>
                  </div>
                </Card.Body>
              </Card>
              <Card title="Alerts">
                <Card.Body>
                  <Stack className="gap-4">
                    <Alert status="info">
                      <Alert.Icon />
                      <Alert.Title>Note:</Alert.Title>
                      <Alert.Description>Everything is running smoothly.</Alert.Description>
                    </Alert>
                    <Alert status="success">
                      <Alert.Icon />
                      <Alert.Title>Note:</Alert.Title>
                      <Alert.Description>Everything is running smoothly.</Alert.Description>
                    </Alert>
                    <Alert status="warning">
                      <Alert.Icon />
                      <Alert.Title>Note:</Alert.Title>
                      <Alert.Description>Everything is running smoothly.</Alert.Description>
                    </Alert>
                    <Alert status="error">
                      <Alert.Icon />
                      <Alert.Title>Note:</Alert.Title>
                      <Alert.Description>Everything is running smoothly.</Alert.Description>
                    </Alert>
                  </Stack>
                </Card.Body>
              </Card>
            </div>
            <Card title="Toasters">
              <Card.Body>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() =>
                      toaster.create({
                        title: "Succès",
                        description: "Action effectuée avec succès",
                        type: "success",
                      })
                    }
                  >
                    Success Toast
                  </Button>
                  <Button
                    onClick={() =>
                      toaster.create({
                        title: "Erreur",
                        description: "Une erreur est survenue",
                        type: "error",
                      })
                    }
                  >
                    Error Toast
                  </Button>
                  <Button
                    onClick={() =>
                      toaster.create({
                        title: "Info",
                        description: "Voici une information importante",
                        type: "info",
                      })
                    }
                  >
                    Info Toast
                  </Button>
                  <Button
                    onClick={() =>
                      toaster.create({
                        title: "Attention",
                        description: "Ceci est un avertissement",
                        type: "warning",
                      })
                    }
                  >
                    Warning Toast
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* ======== Tables ========================================= */}

            <Card title="Table">
              <Card.Body>
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Name</Table.Header>
                      <Table.Header>Role</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Jean Dupont</Table.Cell>
                      <Table.Cell>Directeur</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Marie Martin</Table.Cell>
                      <Table.Cell>Comédienne</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Card.Body>
            </Card>

            <Card title="Pagination">
              <Card.Body>
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>#</Table.Header>
                      <Table.Header>Nom</Table.Header>
                      <Table.Header>Prénom</Table.Header>
                      <Table.Header>Rôle</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {membresPagines.map((m) => (
                      <Table.Row key={m.id}>
                        <Table.Cell>{m.id}</Table.Cell>
                        <Table.Cell>{m.nom}</Table.Cell>
                        <Table.Cell>{m.prenom}</Table.Cell>
                        <Table.Cell>{m.role}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                <Pagination
                  currentPage={pagePagination}
                  totalPages={totalPagesPagination}
                  onPageChange={setPagePagination}
                />
              </Card.Body>
            </Card>

            <Card title="List">
              <Card.Body>
                <List className="gap-3 flex flex-col">
                  <List.Item>
                    <List.Indicator>•</List.Indicator>
                    First item
                  </List.Item>
                  <List.Item>
                    <List.Indicator>•</List.Indicator>
                    Second item
                  </List.Item>
                </List>
              </Card.Body>
            </Card>
          </Stack>
        </Box>

        {/* ======== File Upload ========================================= */}

        <Box>
          <Heading as="h3" className="text-xl font-bold mb-6 pb-2 border-b">
            Upload
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="FileUpload — zone seule">
              <Card.Body>
                <FileUpload
                  accept=".pdf"
                  dropLabel="Importer un PDF"
                  onFileSelect={(file) => console.log(file.name)}
                />
              </Card.Body>
            </Card>
            <Card title="FileUpload — avec action">
              <Card.Body>
                <FileUpload
                  accept=".pdf"
                  dropLabel="Importer un PDF"
                  actionLabel="Faites la vôtre"
                  onFileSelect={(file) => console.log(file.name)}
                  onAction={() => console.log("action")}
                />
              </Card.Body>
            </Card>
          </div>
        </Box>

        {/* ======== Modales ========================================= */}

        <Box>
          <Heading as="h3" className="text-xl font-bold mb-6 pb-2 border-b">
            Modales
          </Heading>
          <div className="flex flex-wrap gap-4">
            <Modal>
              <Modal.Trigger asChild>
                <Button variant="solid">Ouvrir petite modale</Button>
              </Modal.Trigger>
              <Modal.Content size="sm">
                <Modal.Header icon={<FaHome className="h-6 w-6" />}>
                  <Modal.Title>Petite modale</Modal.Title>
                  <Modal.Description>Exemple de modale de confirmation.</Modal.Description>
                </Modal.Header>
                <Modal.Body>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </Text>
                </Modal.Body>
                <Modal.Footer>
                  <Modal.Close asChild>
                    <Button variant="outline">Annuler</Button>
                  </Modal.Close>
                  <Button variant="solid">Confirmer</Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>

            <Modal>
              <Modal.Trigger asChild>
                <Button variant="outline">Ouvrir moyenne modale (Defaut)</Button>
              </Modal.Trigger>
              <Modal.Content size="md">
                <Modal.Header>
                  <Modal.Title>Moyenne modale</Modal.Title>
                  <Modal.Description>La taille par défaut.</Modal.Description>
                </Modal.Header>
                <Modal.Body>
                  <Stack className="gap-4">
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua.
                    </Text>
                    <Box className="p-4 bg-slate-50 rounded-lg border">
                      <Text className="text-sm">
                        Vous pouvez intégrer n&apos;importe quel composant ici.
                      </Text>
                    </Box>
                  </Stack>
                </Modal.Body>
                <Modal.Footer>
                  <Modal.Close asChild>
                    <Button variant="outline">Annuler</Button>
                  </Modal.Close>
                  <Button variant="solid">Confirmer</Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>

            <Modal>
              <Modal.Trigger asChild>
                <Button variant="outline">Ouvrir grande modale</Button>
              </Modal.Trigger>
              <Modal.Content size="lg">
                <Modal.Header icon={<Icon as={FaHome} className="text-primary" />}>
                  <Modal.Title>Grande modale avec icône</Modal.Title>
                  <Modal.Description>
                    Une grande modale pour un contenu plus complexe.
                  </Modal.Description>
                </Modal.Header>
                <Modal.Body>
                  <div className="grid grid-cols-2 gap-4">
                    <Box className="h-32 bg-slate-100 rounded-xl" />
                    <Box className="h-32 bg-slate-100 rounded-xl" />
                    <Box className="h-32 bg-slate-100 rounded-xl" />
                    <Box className="h-32 bg-slate-100 rounded-xl" />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Modal.Close asChild>
                    <Button variant="outline">Annuler</Button>
                  </Modal.Close>
                  <Button variant="solid">Confirmer</Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </div>
        </Box>
      </Stack>
    </Container>
  );
}
