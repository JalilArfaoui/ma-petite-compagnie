"use client";
import type { Lieu } from "@/types/lieu";
import { useState } from "react";
import {Field, GridItem} from "@chakra-ui/react";
import {Button, Input, SimpleGrid} from "@/components/ui";

type Props = {
  onSuccess: (lieu: Lieu) => void;
  onCancel: () => void;
  idCompagnie: number;
};
export function CreateLieuForm({ onSuccess, onCancel, idCompagnie }: Props) {
  const [libelle, setLibelle] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [numeroSalle, setNumeroSalle] = useState("");

  async function handleSubmitLieu(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/lieux", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ libelle, adresse, ville, numeroSalle, idCompagnie }),
    });

    if (!res.ok) {
      alert("La création du lieu a échoué");
      return;
    }

    const lieu: Lieu = await res.json();

    onSuccess(lieu);
  }

  return (
    <form onSubmit={handleSubmitLieu}>
      <div>
        <Field.Root required>
          <Field.Label>
            Nom <Field.RequiredIndicator />
          </Field.Label>

          <Input
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
          <Field.Label>
            Adresse <Field.RequiredIndicator />
          </Field.Label>
          <Input
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
          <Field.Label>
            Ville <Field.RequiredIndicator />
          </Field.Label>
          <Input
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
          <Field.Label>
            N° de la salle <Field.RequiredIndicator />
          </Field.Label>
          <Input type="text" value={numeroSalle} onChange={(e) => setNumeroSalle(e.target.value)} />
        </Field.Root>
      </div>
      <SimpleGrid columns={{ base: 4, md: 5 }} gap={{ base: "0px", md: "0px" }}>
        <GridItem colSpan={{ base: 1, md: 1 }}></GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <Button type="button" onClick={onCancel}>
            Annuler
          </Button>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1}}></GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <Button type="submit" disabled={!libelle || !adresse || !ville}>
            Créer
          </Button>
        </GridItem>
      </SimpleGrid>
    </form>
  );
}
