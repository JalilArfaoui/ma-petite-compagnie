import { Container, Heading, Text, Button, Stack, Link } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="max-w-container.md py-20">
      <Stack className="items-center gap-6 text-center">
        <Heading className="text-4xl text-[#d00039] py-30">404</Heading>
        <Text className="text-xl text-[#43566b] font-serif">
          {"Oups ! La page que vous cherchez n'existe pas."}
        </Text>
        <Link href="/">
          <Button variant="solid">{"Retour à l'accueil"}</Button>
        </Link>
      </Stack>
    </Container>
  );
}
