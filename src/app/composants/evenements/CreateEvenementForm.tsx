"use client";

import { useState } from "react";
import {Box, Button, Input, Select, SimpleGrid} from "@/components/ui";
import {Modal} from "@/components/ui/Modal/Modal";
import {createListCollection, Field, GridItem} from "@chakra-ui/react";
import {CreateLieuForm} from "@/app/composants/lieux/CreateLieuForm";
import {CreateCategorieForm} from "@/app/composants/categories/CreateCategorieForm";

type Props = {
  onSuccess?: (evenement: Evenement) => void;
  onCancel?: () => void;
  lieux: { id: number; libelle: string }[];
  categories: { id: number; nom: string }[];
  compagnieId: number;
};

export function CreateEvenementForm({
  onSuccess,
  onCancel,
  lieux,
  categories,
  compagnieId,
}: Props) {
  const [nom, setNom] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [lieuId, setLieuId] = useState<number | null>(null);
  const [categorieId, setCategorieId] = useState<number | null>(null);
  const [showCreateLieu, setShowCreateLieu] = useState(false);
  const [showCreateCategorie, setShowCreateCategorie] = useState(false);

  async function handleSubmitEvenement(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

      const res = await fetch("/api/evenements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          dateDebut,
          dateFin,
          lieuId: lieuId,
          categorieId: Number(categorieId),
          compagnieId: 1, // TODO Bouchon devra être récupérer dans les variables de session
        }),
      });

      if (!res.ok) {
        // TODO gérer les erreurs UI
        return alert("Erreur lors de la création de l'évènement");
      }
      // Vérification console de la création (provisoire)
      const evenement = await res.json();
      if (onSuccess) onSuccess(evenement);
  }

  const lieuxCollection = createListCollection({
    items: lieux.map(lieu => ({ value: lieu.id, label: lieu.libelle }))
  });

    const categoriesCollection = createListCollection({
        items: categories.map(categorie => ({ value: categorie.id, label: categorie.nom }))

    });

  return (
      <div>
    <form onSubmit={handleSubmitEvenement}>
      <Field.Root required>
        <Field.Label>
          Nom <Field.RequiredIndicator />
        </Field.Label>
        <Input type={"text"} value={nom} onChange={(e) => setNom(e.target.value)} required />
      </Field.Root>
      <Select collection={lieuxCollection} onValueChange={(e) => setLieuId(Number(e.value[0]))}>
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: "10px", md: "0px" }}>
          <GridItem colSpan={{ base: 1, md: 4 }}>
            <Box>
              <Field.Root required>
                <Field.Label>
                  Lieu <Field.RequiredIndicator />
                </Field.Label>
              </Field.Root>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 3 }}>
            <Box>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder={"Sélectionner un lieu"} />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                  <Select.ClearTrigger />
                </Select.IndicatorGroup>
              </Select.Control>

              <Select.Positioner>
                <Select.Content>
                  {lieuxCollection.items.map((lieu) => (
                    <Select.Item item={lieu} key={lieu.value}>
                      {lieu.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Box>
          </GridItem>
            <GridItem colSpan={{ base: 1, md: 1 }}>
              <Box>
                <Button onClick={() => setShowCreateLieu(true)}>+</Button>
              </Box>
            </GridItem>
        </SimpleGrid>
      </Select>
      {/* Format des datetime-local YYYY-MM-DDTHH:mm*/}
      <Field.Root required>
        <Field.Label>
          Début
          <Field.RequiredIndicator />
        </Field.Label>
        <Input
          type={"datetime-local"}
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
          required
        />
      </Field.Root>
      <Field.Root required>
        <Field.Label>
          Fin <Field.RequiredIndicator />
        </Field.Label>
        <Input
          type={"datetime-local"}
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
          required
        />
      </Field.Root>

      <Select
        collection={categoriesCollection}
        onValueChange={(e) => setCategorieId(Number(e.value[0]))}
      >
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: "10px", md: "0px" }}>
          <GridItem colSpan={{ base: 1, md: 4 }}>
            <Box>
        <Field.Root required>
          <Field.Label>
            Catégorie <Field.RequiredIndicator />
          </Field.Label>
        </Field.Root>
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 3 }}>
          <Box>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder={"Sélectionner une catégorie"} />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
            <Select.ClearTrigger />
          </Select.IndicatorGroup>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            {categoriesCollection.items.map((categorie) => (
              <Select.Item item={categorie} key={categorie.value}>
                {categorie.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
          </Box>
        </GridItem>
          <GridItem colSpan={{ base: 1, md: 1 }}>
            <Box>
              <Button onClick={() => setShowCreateCategorie(true)}>+</Button>
            </Box>
          </GridItem>
        </SimpleGrid>
      </Select>
      {/* TODO Afficher les catégories existantes associées à la compagnie */}
      {/* TODO pouvoir sélectionner des participants */}
      <SimpleGrid columns={{ base: 3, md: 3 }}>
          <GridItem colSpan={{ base: 1, md: 1 }}>
            <Button onClick={onCancel}>Annuler</Button>
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 1 }}>
              <Button type={"submit"}>Créer</Button>
          </GridItem>
      </SimpleGrid>
    </form>
      {showCreateLieu && (
          <Modal
              open={showCreateLieu}
              onClose={() => setShowCreateLieu(false)}>
            <CreateLieuForm
                idCompagnie={compagnieId}
                onSuccess={() => {
                  setShowCreateLieu(false)
                }}
                onCancel={() => setShowCreateLieu(false)}
            />
          </Modal>
      )}
        {showCreateCategorie && (
            <Modal
                open={showCreateCategorie}
                onClose={() => setShowCreateCategorie(false)}>
              <CreateCategorieForm
                  idCompagnie={compagnieId}
                  onSuccess={() => {
                    setShowCreateCategorie(false)
                  }}
                  onCancel={() => setShowCreateCategorie(false)}
              />
            </Modal>
        )}
    </div>
  );
}
