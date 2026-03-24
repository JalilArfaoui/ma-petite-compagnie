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
  const [role, setRole] = useState<Role>(contactDonnee?.role ?? "COMEDIEN");
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
              required
            />
          </Box>

          <Box>
            Prenom :
            <Input
              name="prenom"
              placeholder="Benoit"
              onChange={(e) => setPrenom(e.target.value)}
              value={prenom}
              required
            />
          </Box>
          <Box>
            Email :
            <Input
              name="email"
              placeholder="Richard@email.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
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
            <RadioGroup name="role" value={role} onChange={(v) => setRole(v.valueOf() as Role)}>
              <Radio value="COMEDIEN" name="role">
                Comedien
              </Radio>
              <Radio value="TECHNICIEN" name="role">
                Technicien
              </Radio>
              <Radio value="PARTENAIRE" name="role">
                Partenaire
              </Radio>
            </RadioGroup>
          </Box>
          <Button type="submit">Confirmer</Button>
        </Stack>
      </form>
    </Card>
  );
}

export default ContactDetails;
