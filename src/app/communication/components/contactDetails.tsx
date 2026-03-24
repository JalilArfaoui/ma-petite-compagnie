"use client";
import { Contact, Role } from "@prisma/client";
import { useState } from "react";
import { Box, Card, Input, Radio, RadioGroup, Stack, Button } from "@/components/ui";

export function ContactDetails({
  onSubmitted,
  contactDonnee,
}: {
  onSubmitted: (donneeFormulaire: FormData) => void;
  contactDonnee: Contact | null;
}) {
  const [nom, setNom] = useState(contactDonnee?.nom ?? "");
  const [prenom, setPrenom] = useState(contactDonnee?.prenom ?? "");
  const [email, setEmail] = useState(contactDonnee?.email ?? "");
  const [tel, setTel] = useState(contactDonnee?.tel ?? "");
  const [role, setRole] = useState<"COMEDIEN" | "TECHNICIEN" | "PARTENAIRE">(
    contactDonnee?.role ?? "COMEDIEN"
  );
  return (
    <Card>
      <form action={onSubmitted}>
        <Stack>
          <Box>
            Nom :{" "}
            <Input
              placeholder="Richard"
              name="nom"
              onChange={(e) => setNom(e.target.value)}
              value={nom}
            />
          </Box>

          <Box>
            Prenom :
            <Input
              name="prenom"
              placeholder="Benoit"
              onChange={(e) => setPrenom(e.target.value)}
              value={prenom}
            />
          </Box>
          <Box>
            Email :
            <Input
              name="email"
              placeholder="Richard@email.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </Box>
          <Box>
            Téléphone :{" "}
            <Input
              name="tel"
              placeholder="01234567891"
              onChange={(e) => setTel(e.target.value)}
              value={tel}
            />
          </Box>
          <Box>
            Rôles
            <RadioGroup
              name="role"
              value={role}
              onValueChange={(v) => setRole(v.valueOf() as Role)}
            >
              <Radio value="COMEDIEN">Comedien</Radio>
              <Radio value="TECHNICIEN">Technicien</Radio>
              <Radio value="PARTENAIRE">Partenaire</Radio>
            </RadioGroup>
          </Box>
          <Button type="submit">Confirmer</Button>
        </Stack>
      </form>
    </Card>
  );
}

export default ContactDetails;
