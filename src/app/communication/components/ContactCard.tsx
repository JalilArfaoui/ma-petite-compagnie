import { Card, Stack, Heading } from "@/components/ui";
import { Contact } from "@prisma/client";
export function ContactCard({
  contact,
  onSelected,
  estSelectionne,
}: {
  contact: Contact;
  onSelected: () => void;
  estSelectionne: boolean;
}) {
  return (
    <Card onClick={onSelected}>
      {estSelectionne && <Heading as={"h1"}>Sélectionné</Heading>}
      <Heading as={"h4"}>
        {contact.nom} {contact.prenom}
      </Heading>

      <Card.Body>
        <Stack gap={4}>
          <strong>Email :</strong> {contact.email || "Non renseigné"}
          <strong>Téléphone :</strong> {contact.tel || "Non renseigné"}
          <strong>Rôle :</strong> {contact.role || "Non défini"}
          <small>
            Créé le{" "}
            {(contact.date_creation instanceof Date &&
              contact.date_creation.toLocaleDateString()) ||
              "Non défini"}
          </small>
        </Stack>
      </Card.Body>
    </Card>
  );
}
