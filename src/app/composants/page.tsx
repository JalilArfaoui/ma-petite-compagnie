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
} from "@/components/ui";
import { FaHome } from "react-icons/fa";

export default function Home() {
  return (
    <Container className="py-10 px-4 max-w-7xl mx-auto">
      <Stack className="gap-10">
        <Box className="text-center">
          <Heading as="h3" className="mb-4">
            Composants
          </Heading>
          <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
        </Box>

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

        <Box>
          <Heading as="h3" className="text-xl font-bold mb-6 pb-2 border-b">
            Actions & Navigation
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
      </Stack>
    </Container>
  );
}
