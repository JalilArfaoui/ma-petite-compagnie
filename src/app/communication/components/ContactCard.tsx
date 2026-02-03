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
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Heading,
} from "@/components/ui";
import { Contact } from "@prisma/client";
export function ContactCard({
  contact,
  onClick,
  clicked,
}: {
  contact: Contact;
  onClick: () => void;
  clicked: boolean;
}) {
  return (
    <Card onClick={onClick}>
      {clicked && <Heading as={"h1"}>Séléctionné</Heading>}
      <Heading as={"h4"}></Heading>
      {contact.nom} {contact.prenom}
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
