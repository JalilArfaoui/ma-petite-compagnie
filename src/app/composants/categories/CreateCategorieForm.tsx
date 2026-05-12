"use client";

import { useState } from "react";
import { Categorie } from "@prisma/client";
import { Button, Input, Field } from "@/components/ui";
import { creerCategorie } from "@/app/actions/categorie";

type Props = {
  onSuccess: (categorie: Categorie) => void;
  onCancel: () => void;
};

export function CreateCategorieForm({ onSuccess, onCancel }: Props) {
  const [nom, setNom] = useState("");
  const [couleur, setCouleur] = useState("#000000");

  async function handleSubmitCategorie(datas: FormData) {
    const result = await creerCategorie(datas);
    if (result.status != 201 || !result.categorie) {
      alert("La création d'une catégorie a échoué");
      return;
    }
    const categorie: Categorie = result.categorie;

    onSuccess(categorie);
  }

  return (
    <form action={handleSubmitCategorie}>
      <Field.Root required>
        <Field.Label>Nom {/*<Field.RequiredIndicator />*/}</Field.Label>
        <Input
          name={"nom"}
          type="text"
          placeholder={"Répétition"}
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
      </Field.Root>
      <Field.Root>
        <Field.Label>Couleur</Field.Label>
        {/* TODO montrer une card représentative d'un évènement pour montrer la couleur */}
        <Input
          name={"couleur"}
          type="color"
          value={couleur}
          onChange={(e) => setCouleur(e.target.value)}
        />
      </Field.Root>
      {/*<SimpleGrid columns={{ base: 4, md: 5 }} gap={{ base: "0px", md: "0px" }}>
                <GridItem colSpan={{ base: 1, md: 1 }}></GridItem>
                <GridItem colSpan={{ base: 1, md: 1 }}>*/}
      <Button type="button" onClick={onCancel}>
        Annuler
      </Button>
      {/*</GridItem>
                <GridItem colSpan={{ base: 1, md: 1}}></GridItem>
                <GridItem colSpan={{ base: 1, md: 1 }}>*/}
      <Button type="submit" disabled={!nom}>
        Créer
      </Button>
      {/*</GridItem>
            </SimpleGrid>*/}
    </form>
  );
}
