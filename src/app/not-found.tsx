import { Container, Heading, Text, Button, Stack, Link } from "@/components/ui";

export default function NotFound() {
  return (
    <Container maxW="container.md" py={20}>
      <Stack align="center" gap={6} textAlign="center">
        <Heading size="4xl" color="#d00039" py={30}>
          404
        </Heading>
        <Text fontSize="xl" color="#43566b" fontFamily="Georgia, serif">
          {"Oups ! La page que vous cherchez n'existe pas."}
        </Text>
        <Link href="/">
          <Button variant="solid">{"Retour à l'accueil"}</Button>
        </Link>
      </Stack>
    </Container>
  );
}
