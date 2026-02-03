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
  SimpleGrid,
  Stack,
  Text,
  Icon,
} from "@/components/ui";
import { FaHome } from "react-icons/fa";

export default function Home() {
  return (
    <Container maxW="container.xl" py={10} px={10}>
      <Stack gap={10}>
        <Box textAlign="center">
          <Heading as="h3" size="2xl" mb={4}>
            Composants
          </Heading>
          <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
        </Box>

        <Box>
          <SimpleGrid columns={[1, null, 2]} gap={6}>
            <div>
              <Heading as="h3" size="lg" mb={6} pb={2}>
                Icons
              </Heading>
              <Card title="Icons">
                <Card.Body>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Text>Icon size : sm</Text>
                    <Icon size="sm">
                      <FaHome />
                    </Icon>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Text>Icon size : md</Text>
                    <Icon size="md">
                      <FaHome />
                    </Icon>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Text>Icon size : lg</Text>
                    <Icon size="lg">
                      <FaHome />
                    </Icon>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Text>Icon size : xl</Text>
                    <Icon size="xl">
                      <FaHome />
                    </Icon>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div>
              <Heading as="h3" size="lg" mb={6} pb={2}>
                Headings
              </Heading>
              <Card title="Headings">
                <Card.Body>
                  <Stack gap={2}>
                    <Heading as="h1" size="lg" mb={6} pb={2}>
                      Titre 1
                    </Heading>
                    <Heading as="h2" size="lg" mb={6} pb={2}>
                      Titre 2
                    </Heading>
                    <Heading as="h3" size="lg" mb={6} pb={2}>
                      Titre 3
                    </Heading>
                    <Heading as="h4" size="lg" mb={6} pb={2}>
                      Titre 4
                    </Heading>
                  </Stack>
                </Card.Body>
              </Card>
            </div>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading as="h3" size="lg" mb={6} pb={2}>
            Cards
          </Heading>
          <SimpleGrid columns={[1, null, 6]} gap={6}>
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
          </SimpleGrid>
        </Box>

        <Box>
          <Heading as="h3" size="lg" mb={6} pb={2}>
            Actions & Navigation
          </Heading>
          <SimpleGrid columns={[1, null, 2]} gap={6}>
            <Card title="Buttons">
              <Card.Body>
                <Stack direction="row" gap={4}>
                  <Button variant="solid" colorPalette="blue">
                    Primary
                  </Button>
                  <Button variant="outline">Secondary</Button>
                  <Button variant="solid" icon={<FaHome />} iconSide="right">
                    Icon Right
                  </Button>
                  <Button variant="outline" icon={<FaHome />} iconSide="left">
                    Icon Left
                  </Button>
                </Stack>
              </Card.Body>
            </Card>
            <Card title="Links">
              <Card.Body>
                <Stack gap={2}>
                  <Link href="#">Standard Link</Link>
                </Stack>
              </Card.Body>
            </Card>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading as="h3" size="lg" mb={6} pb={2}>
            Forms & Inputs
          </Heading>
          <Stack gap={6}>
            <Card title="Inputs">
              <Card.Body>
                <SimpleGrid columns={[1, null, 2]} gap={8}>
                  <Stack gap={4}>
                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Input
                      </Text>
                      <Input placeholder="Type something..." />
                    </Box>
                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Textarea
                      </Text>
                      <Textarea placeholder="Type longer text..." />
                    </Box>
                  </Stack>
                  <Stack gap={4}>
                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Checkbox
                      </Text>
                      <Checkbox>Accept terms and conditions</Checkbox>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Switch
                      </Text>
                      <Switch>Enable notifications</Switch>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Radio Group
                      </Text>
                      <RadioGroup defaultValue="1">
                        <Stack direction="row" gap={4}>
                          <Radio value="1">Option 1</Radio>
                          <Radio value="2">Option 2</Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>
                  </Stack>
                </SimpleGrid>
              </Card.Body>
            </Card>
          </Stack>
        </Box>

        <Box>
          <Heading as="h3" size="lg" mb={6} pb={2}>
            Data Display & Feedback
          </Heading>
          <Stack gap={6}>
            <SimpleGrid columns={[1, null, 2]} gap={6}>
              <Card title="Badges">
                <Card.Body>
                  <Stack direction="row" gap={2}>
                    <Badge>Defaut</Badge>
                    <Badge colorPalette="green">Vert</Badge>
                    <Badge colorPalette="orange">Orange</Badge>
                    <Badge colorPalette="red">Rouge</Badge>
                    <Badge colorPalette="blue">Bleu</Badge>
                    <Badge colorPalette="purple">Violet</Badge>
                    <Badge colorPalette="yellow">Jaune</Badge>
                    <Badge colorPalette="cyan">Cyan</Badge>
                    <Badge colorPalette="pink">Rose</Badge>
                  </Stack>
                </Card.Body>
              </Card>
              <Card title="Alerts">
                <Card.Body>
                  <Stack gap={4}>
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
            </SimpleGrid>

            <Card title="Table">
              <Card.Body>
                <Table variant="line">
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

            <Card title="List">
              <Card.Body>
                <List gap={3}>
                  <List.Item>
                    <List.Indicator />
                    First item
                  </List.Item>
                  <List.Item>
                    <List.Indicator />
                    Second item
                  </List.Item>
                </List>
              </Card.Body>
            </Card>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
