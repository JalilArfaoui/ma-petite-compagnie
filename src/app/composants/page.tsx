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
} from "@/components/ui";

export default function Home() {
  return (
    <Container maxW="container.xl" py={10}>
      <Stack gap={10}>
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Composants
          </Heading>
          <Heading as="h2" size="2xl" mb={4}>
            Composants
          </Heading>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={6} pb={2} borderBottom="1px solid" borderColor="gray.200">
            Actions & Navigation
          </Heading>
          <SimpleGrid columns={[1, null, 2]} gap={6}>
            <Card>
              <Card.Header>
                <Heading size="md">Buttons</Heading>
              </Card.Header>
              <Card.Body>
                <Stack direction="row" gap={4}>
                  <Button variant="solid" colorPalette="blue">
                    Primary
                  </Button>
                  <Button variant="outline">Secondary</Button>
                  <Button variant="ghost" colorPalette="red">
                    Ghost Red
                  </Button>
                </Stack>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <Heading size="md">Links</Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={2}>
                  <Link href="#">Standard Link</Link>
                  <Link href="#" variant="underline">
                    Underline Link
                  </Link>
                </Stack>
              </Card.Body>
            </Card>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={6} pb={2} borderBottom="1px solid" borderColor="gray.200">
            Forms & Inputs
          </Heading>
          <Stack gap={6}>
            <Card>
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
          <Heading as="h2" size="lg" mb={6} pb={2} borderBottom="1px solid" borderColor="gray.200">
            Data Display & Feedback
          </Heading>
          <Stack gap={6}>
            <SimpleGrid columns={[1, null, 2]} gap={6}>
              <Card>
                <Card.Header>
                  <Heading size="md">Badges</Heading>
                </Card.Header>
                <Card.Body>
                  <Stack direction="row" gap={2}>
                    <Badge colorPalette="green">Success</Badge>
                    <Badge colorPalette="orange">Warning</Badge>
                    <Badge colorPalette="red">Error</Badge>
                    <Badge colorPalette="blue">Info</Badge>
                  </Stack>
                </Card.Body>
              </Card>
              <Card>
                <Card.Header>
                  <Heading size="md">Alerts</Heading>
                </Card.Header>
                <Card.Body>
                  <Stack gap={4}>
                    <Alert status="info">
                      <Alert.Icon />
                      <Alert.Title>Note:</Alert.Title>
                      <Alert.Description>Everything is running smoothly.</Alert.Description>
                    </Alert>
                  </Stack>
                </Card.Body>
              </Card>
            </SimpleGrid>

            <Card>
              <Card.Header>
                <Heading size="md">Table</Heading>
              </Card.Header>
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

            <Card>
              <Card.Header>
                <Heading size="md">List</Heading>
              </Card.Header>
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
