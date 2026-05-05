"use client";
import { Lieu } from "@prisma/client";
import { useState } from "react";
import { Button, Input, Field } from "@/components/ui";
import { creerLieu } from "@/app/actions/lieu";

type Props = {
  onSuccess: (lieu: Lieu) => void;
  onCancel: () => void;
};
export function CreateLieuForm({ onSuccess, onCancel }: Props) {
  const [libelle, setLibelle] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [numeroSalle, setNumeroSalle] = useState("");

  async function handleSubmitLieu(datas: FormData) {
    const result = await creerLieu(datas);

    if (result.status != 201 || !result.lieu) {
      alert("La création du lieu a échoué");
      return;
    }

    const lieu: Lieu = result.lieu;

    onSuccess(lieu);
  }

  return (
    <form action={handleSubmitLieu}>
      <div>
        <Field.Root required>
          <Field.Label>Nom {/*<Field.RequiredIndicator />*/}</Field.Label>

          <Input
            name={"libelle"}
            type="text"
            placeholder={"Opéra National du Capitole"}
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            required
          />
        </Field.Root>
      </div>
      <div>
        <Field.Root required>
          <Field.Label>Adresse {/*<Field.RequiredIndicator />*/}</Field.Label>
          <Input
            name={"adresse"}
            type="text"
            placeholder={"Pl. du Capitole"}
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            required
          />
        </Field.Root>
      </div>
      <div>
        <Field.Root required>
          <Field.Label>Ville {/*<Field.RequiredIndicator />*/}</Field.Label>
          <Input
            name={"ville"}
            type="text"
            placeholder={"Toulouse"}
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            required
          />
        </Field.Root>
      </div>
      <div>
        <Field.Root>
          <Field.Label>N° de la salle {/*<Field.RequiredIndicator />*/}</Field.Label>
          <Input
            name={"numero_salle"}
            type="text"
            value={numeroSalle}
            onChange={(e) => setNumeroSalle(e.target.value)}
          />
        </Field.Root>
      </div>
      {/*<SimpleGrid columns={{ base: 4, md: 5 }} gap={0}>
        <GridItem colSpan={{ base: 1, md: 1 }}></GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>*/}
      <Button type="button" onClick={onCancel}>
        Annuler
      </Button>
      {/*</GridItem>
        <GridItem colSpan={{ base: 1, md: 1}}></GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>*/}
      <Button type="submit" disabled={!libelle || !adresse || !ville}>
        Créer
      </Button>
      {/*</GridItem>
      </SimpleGrid>*/}
    </form>
  );
}
