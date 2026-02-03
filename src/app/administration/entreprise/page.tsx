import { getInfosCompagnie } from "@/app/actions/finance";
import { CompanyForm } from "./form";
import { Container, Heading, Stack, Text } from "@/components/ui";

export default async function Page() {
  const compagnie = await getInfosCompagnie();

  return (
    <Container py={8} maxW="container.md">
      <Stack gap={6}>
        <Heading size="2xl">Informations de l'entreprise</Heading>
        <Text color="gray.600">Ces informations figureront sur vos factures.</Text>
        <CompanyForm initialData={compagnie} />
      </Stack>
    </Container>
  );
}
