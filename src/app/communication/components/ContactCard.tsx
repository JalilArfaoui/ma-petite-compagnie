import { Card } from "@chakra-ui/react";
import { Contact } from "@prisma/client";
export function ContactCard({ contact }: { contact: Contact }) {
  return (
    <Card.Root>
      <Card.Header>
        <h4>
          {contact.nom} {contact.prenom}
        </h4>
      </Card.Header>
      <Card.Body>
        <p>
          <strong>Email :</strong> {contact.email || "Non renseigné"}
        </p>
        <p>
          <strong>Téléphone :</strong> {contact.tel || "Non renseigné"}
        </p>
        <p>
          <strong>Rôle :</strong> {contact.role || "Non défini"}
        </p>
        <p>
          <small>Créé le {contact.date_creation.toLocaleDateString()}</small>
        </p>
      </Card.Body>
    </Card.Root>
  );
}
