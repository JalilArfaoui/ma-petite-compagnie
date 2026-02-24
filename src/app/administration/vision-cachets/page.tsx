"use client";

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
      result = result.filter((item) => item.categorie === categorieFilter);
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
      <h1>Liste des cachets</h1>

      <h3>Filtrer par catégorie</h3>
      <select onChange={(e) => setCategorieFilter(e.target.value as "tous" | Categorie)}>
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

      <h3>Trier par date</h3>
      <select
        onChange={(e) =>
          setSortBy(e.target.value as "none" | "dateCroissante" | "dateDecroissante")
        }
      >
        <option value="none">Aucun tri</option>
        <option value="dateCroissante">Date croissante</option>
        <option value="dateDecroissante">Date décroissante</option>
      </select>

      <h3>Trier par montant</h3>
      <select
        onChange={(e) =>
          setSortBy(e.target.value as "none" | "montantCroissant" | "montantDecroissant")
        }
      >
        <option value="none">Aucun tri</option>
        <option value="montantCroissant">Montant croissant</option>
        <option value="montantDecroissant">Montant décroissant</option>
      </select>

      <h2>Résultats</h2>
      <ul>
        {filteredAndSorted.map((cachet) => (
          <li key={cachet.id}>
            Cachet #{cachet.id} — {cachet.categorie} — {cachet.montant} € —{" "}
            {cachet.date.toLocaleDateString("fr-FR")}
          </li>
        ))}
      </ul>
    </div>
  );
}
