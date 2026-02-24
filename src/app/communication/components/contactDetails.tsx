"use client";

import { Contact, Role } from "@prisma/client";
import { useState, FormEvent } from "react";
import { Box, Card, Input, Radio, RadioGroup, Stack, Button } from "@/components/ui";

export function ContactDetails({ contactDonnee }: { contactDonnee: Contact | null }) {
  const [nom, setNom] = useState(contactDonnee?.nom ?? "");
  const [prenom, setPrenom] = useState(contactDonnee?.prenom ?? "");
  const [email, setEmail] = useState(contactDonnee?.email ?? "");
  const [tel, setTel] = useState(contactDonnee?.tel ?? "");
  const [role, setRole] = useState<Role>(contactDonnee?.role ?? "USER");

  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("nom", nom);
    formData.set("prenom", prenom);
    formData.set("email", email);
    formData.set("tel", tel);
    formData.set("role", role);

    try {
      const { creerContactAction } = await import("../actions/contactFormAction");
      const contact = await creerContactAction(formData);

      if (contact?.email) {
        setMessage("Contact créé et relié à Brevo");
      } else {
        setMessage("Problème lors de la création du contact");
      }

      setNom("");
      setPrenom("");
      setEmail("");
      setTel("");
      setRole("USER");
    } catch (err) {
      console.error(err);
      setMessage("Erreur creation du contact");
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Stack>
          <Box>
            Nom :
            <Input
              placeholder="Richard"
              name="nom"
              onChange={(e) => setNom(e.target.value)}
              value={nom}
              required
            />
          </Box>

          <Box>
            Prénom :
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
              type="email"
              placeholder="Richard@email.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </Box>

          <Box>
            Téléphone :
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
              <Radio value="USER">Utilisateur</Radio>
              <Radio value="PARTENAIRE">Partenaire</Radio>
            </RadioGroup>
          </Box>

          <Button type="submit">Confirmer</Button>

          {message && <Box>{message}</Box>}
        </Stack>
      </form>
    </Card>
  );
}

export default ContactDetails;