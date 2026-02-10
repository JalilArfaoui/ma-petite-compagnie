import { Card, Stack, Heading, SimpleGrid, Text, Box } from "@/components/ui";
import { Contact } from "@prisma/client";
export function ContactCard({
  contact,
  onSelect,
}: {
  contact: Contact;
  onSelect: (contact: Contact) => void;
}) {
  return (
    <Card onClick={() => onSelect(contact)}>
      <Heading as={"h4"}>
        {contact.nom} {contact.prenom}
      </Heading>

      <Card.Body padding={"3"}>
        <Stack gap={4}>
          <Box>
            <Text fontWeight="bold">Email : </Text>
            <Text>{contact.email || "Non renseigné"}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Téléphone :</Text>
            <Text> {contact.tel || "Non renseigné"}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Rôle :</Text> <Text>{contact.role || "Non défini"}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Créé le</Text>

            <Text>
              {contact.date_creation
                ? new Date(contact.date_creation).toLocaleDateString()
                : "Non défini"}
            </Text>
          </Box>
        </Stack>
      </Card.Body>
    </Card>
  );
}
