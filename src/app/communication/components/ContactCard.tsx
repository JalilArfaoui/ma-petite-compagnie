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
    <Card
      onClick={() => onSelect(contact)}
      className="bg-gray-200 hover:bg-gray-50 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-orange-300"
    >
      <Heading as={"h4"}>
        {contact.nom} {contact.prenom}
      </Heading>

      <Card.Body className=" pl-2">
        <Stack gap={1}>
          <Stack direction="column" gap={1}>
            <Box>
              <Text className=" font-bold">Email : </Text>
              <Text>{contact.email || "Non renseigné"}</Text>
            </Box>
            <Box>
              <Text className=" font-bold">Téléphone :</Text>
              <Text> {contact.tel || "Non renseigné"}</Text>
            </Box>
            <Box>
              <Text className=" font-bold">Rôle :</Text> <Text>{contact.role || "Non défini"}</Text>
            </Box>
          </Stack>
          <Stack direction="row-reverse" justify="end">
            <Box>
              <Text className=" font-bold">Créé le</Text>

              <Text>
                {contact.date_creation
                  ? new Date(contact.date_creation).toLocaleDateString()
                  : "Non défini"}
              </Text>
            </Box>
          </Stack>
        </Stack>
      </Card.Body>
    </Card>
  );
}
