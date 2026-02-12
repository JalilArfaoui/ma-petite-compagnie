"use client";
import type { Lieu } from "@/types/lieu";
import { useState } from "react";
import { Field } from "@chakra-ui/react";
import { Input } from "@/components/ui";

type Props = {
  onSuccess: (lieu: Lieu) => void;
  onCancel: () => void;
};
export function CreateLieuForm({ onSuccess, onCancel }: Props) {
  const [libelle, setLibelle] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [numeroSalle, setNumeroSalle] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/lieux", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ libelle, adresse, ville, numeroSalle }),
    });

    if (!res.ok) {
      alert("La création du lieu a échoué");
      return;
    }

    const lieu: Lieu = await res.json();

    onSuccess(lieu);
  }

  return (
    <form onSubmit={handleSubmit}>
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
        <Field.Root required>
          <Field.Label>
            N° de la salle <Field.RequiredIndicator />
          </Field.Label>
          <Input type="text" value={numeroSalle} onChange={(e) => setNumeroSalle(e.target.value)} />
        </Field.Root>
      </div>
      <button type="submit" disabled={!libelle || !adresse || !ville}>
        Créer
      </button>

      <button type="button" onClick={onCancel}>
        Annuler
      </button>
    </form>
  );
}
