import { getInfosCompagnie } from "@/app/actions/finance";
import { FactureEditor } from "./editor";
import { Container } from "@chakra-ui/react";

export default async function Page() {
  const compagnie = await getInfosCompagnie();

  return (
    <Container maxW="container.xl" py={4} h="100vh">
      <FactureEditor compagnie={compagnie} />
    </Container>
  );
}
