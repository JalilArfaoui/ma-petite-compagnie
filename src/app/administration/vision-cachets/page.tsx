"use client";

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
  Heading,
  Box,
  Container,
  Stack,
  Text,
  Icon,
  SearchBar,
  Modal,
} from "@/components/ui";
import { useState, useMemo } from "react";

type Categorie =
  | "representation"
  | "repetition"
  | "formation"
  | "creation"
  | "production"
  | "enregistrement"
  | "intervention"
  | "autre";

type Cachet = {
  id: number;
  categorie: Categorie;
  montant: number;
  date: Date;
};

//dictionnaire temporaire le temps que la bdd soit opérationnelle
const CACHETS_DATA: Cachet[] = [
  { id: 1, categorie: "repetition", montant: 150, date: new Date("2024-01-18") },
  { id: 2, categorie: "representation", montant: 300, date: new Date("2024-03-21") },
  { id: 3, categorie: "enregistrement", montant: 200, date: new Date("2024-06-04") },
  { id: 4, categorie: "repetition", montant: 180, date: new Date("2024-07-15") },
  { id: 5, categorie: "intervention", montant: 250, date: new Date("2024-08-07") },
  { id: 6, categorie: "autre", montant: 120, date: new Date("2024-09-24") },
];

export default function VisionCachetsPage() {
  const [categorieFilter, setCategorieFilter] = useState<"tous" | Categorie>("tous");
  const [sortBy, setSortBy] = useState<
    "none" | "dateCroissante" | "dateDecroissante" | "montantCroissant" | "montantDecroissant"
  >("none"); //pour avoir un seul tri actif à la fois

  //filtrage + tri
  const filteredAndSorted = useMemo(() => {
    let result = [...CACHETS_DATA];

    if (categorieFilter !== "tous") {
      result = result.filter((cachet) => cachet.categorie === categorieFilter);
    }

    switch (sortBy) {
      case "dateCroissante":
        result.sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case "dateDecroissante":
        result.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case "montantCroissant":
        result.sort((a, b) => a.montant - b.montant);
        break;
      case "montantDecroissant":
        result.sort((a, b) => b.montant - a.montant);
        break;
    }

    return result;
  }, [categorieFilter, sortBy]);

  return (
    <div>
      <Heading as="h3" className="font-extrabold mb-6 pt-10 text-center">
        Liste des cachets
      </Heading>

      <div className="mx-140 rounded-[20px] bg-hover p-[20px] border-none shadow-sm transition-shadow flex flex-col gap-[20px]">
        <Heading as="h4" className="font-semibold">
          Filtrer par catégorie
        </Heading>

        <select
          value={categorieFilter}
          onChange={(e) => setCategorieFilter(e.target.value as "tous" | Categorie)}
          className="p-2 border border-slate-300 rounded-md w-full"
        >
          <option value="tous">Tous</option>
          <option value="representation">Représentation</option>
          <option value="repetition">Répétition</option>
          <option value="formation">Formation</option>
          <option value="creation">Création</option>
          <option value="production">Production</option>
          <option value="enregistrement">Enregistrement</option>
          <option value="intervention">Intervention</option>
          <option value="autre">Autre</option>
        </select>

        <Heading as="h4" className="font-semibold">
          Trier par date
        </Heading>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "none" | "dateCroissante" | "dateDecroissante")
          }
          className="p-2 border border-slate-300 rounded-md w-full"
        >
          <option value="none">Aucun tri</option>
          <option value="dateCroissante">Date croissante</option>
          <option value="dateDecroissante">Date décroissante</option>
        </select>

        <Heading as="h4" className="font-semibold">
          Trier par montant
        </Heading>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "none" | "montantCroissant" | "montantDecroissant")
          }
          className="p-2 border border-slate-300 rounded-md w-full"
        >
          <option value="none">Aucun tri</option>
          <option value="montantCroissant">Montant croissant</option>
          <option value="montantDecroissant">Montant décroissant</option>
        </select>
      </div>

      <Heading as="h3" className="font-semibold mt-9 pb-2 border-b text-center">
        Résultats
      </Heading>
      <div className="mx-140 mt-6 mb-10 rounded-[20px] bg-hover p-[20px] border-none shadow-sm transition-shadow flex flex-col gap-[20px]">
        <ul>
          {filteredAndSorted.map((cachet) => (
            <li key={cachet.id}>
              Cachet #{cachet.id} — {cachet.categorie} — {cachet.montant} € —{" "}
              {cachet.date.toLocaleDateString("fr-FR")}
            </li>
          ))}
        </ul>
    </div>
    </div>
  );
}
