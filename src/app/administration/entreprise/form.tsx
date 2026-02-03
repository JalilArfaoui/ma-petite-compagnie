"use client";

import { useState, useTransition } from "react";
import { updateInfoCompagnie } from "@/app/actions/finance";
import { Button, Input, Stack, Text, Heading, Box } from "@/components/ui";
// Card might be under Card/Card
import { Card } from "@/components/ui/Card/Card";
import { toaster } from "@/components/ui/toaster";
import { Compagnie } from "@prisma/client";

export function CompanyForm({ initialData }: { initialData: Compagnie }) {
  const [isPending, startTransition] = useTransition();

  // We can use a simple form submit handler
  const handleSubmit = (formData: FormData) => {
    const data = {
      adresse: formData.get("adresse") as string,
      codePostal: formData.get("codePostal") as string,
      ville: formData.get("ville") as string,
      siteWeb: formData.get("siteWeb") as string,
      rib: formData.get("rib") as string,
    };

    startTransition(async () => {
      try {
        await updateInfoCompagnie(data);
        toaster.create({
          title: "Informations mises à jour",
          type: "success",
        });
      } catch (error) {
        toaster.create({
          title: "Erreur lors de la mise à jour",
          description: "Veuillez réessayer",
          type: "error",
        });
      }
    });
  };

  return (
    <Card>
      <Card.Body>
        <form action={handleSubmit}>
          <Stack gap={4}>
            <Box>
              <Text fontWeight="bold" mb={1}>
                Nom de l'entreprise (Non modifiable)
              </Text>
              <Input value={initialData.nom} readOnly disabled bg="gray.100" />
            </Box>

            <Box>
              <Text fontWeight="bold" mb={1}>
                Adresse
              </Text>
              <Input
                name="adresse"
                defaultValue={initialData.adresse || ""}
                placeholder="123 Rue de Exemple"
              />
            </Box>

            <Stack direction="row" gap={4}>
              <Box flex={1}>
                <Text fontWeight="bold" mb={1}>
                  Code Postal
                </Text>
                <Input
                  name="codePostal"
                  defaultValue={initialData.codePostal || ""}
                  placeholder="75000"
                />
              </Box>
              <Box flex={2}>
                <Text fontWeight="bold" mb={1}>
                  Ville
                </Text>
                <Input name="ville" defaultValue={initialData.ville || ""} placeholder="Paris" />
              </Box>
            </Stack>

            <Box>
              <Text fontWeight="bold" mb={1}>
                Site Web
              </Text>
              <Input
                name="siteWeb"
                defaultValue={initialData.siteWeb || ""}
                placeholder="https://example.com"
              />
              <Text fontSize="xs" color="gray.500">
                S'affichera sur la facture si renseigné
              </Text>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={1}>
                RIB / IBAN
              </Text>
              <Input name="rib" defaultValue={initialData.rib || ""} placeholder="FR76 ..." />
            </Box>

            <Button type="submit" loading={isPending} colorPalette="blue">
              Enregistrer les modifications
            </Button>
          </Stack>
        </form>
      </Card.Body>
    </Card>
  );
}
