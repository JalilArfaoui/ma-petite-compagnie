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

export default function VisionCachetsPage() {
  //dictionnaire temporaire le temps que la bdd soit opérationnelle
  const cachetsData: Cachet[] = [
    { id: 1, categorie: "repetition", montant: 150, date: new Date("2024-01-18") },
    { id: 2, categorie: "representation", montant: 300, date: new Date("2024-03-21") },
    { id: 3, categorie: "enregistrement", montant: 200, date: new Date("2024-06-04") },
    { id: 4, categorie: "repetition", montant: 180, date: new Date("2024-07-15") },
    { id: 5, categorie: "intervention", montant: 250, date: new Date("2024-08-07") },
    { id: 6, categorie: "autre", montant: 120, date: new Date("2024-09-24") },
  ];

  const [categorieFilter, setCategorieFilter] = useState<"tous" | Categorie>("tous");
  const [montantSort, setMontantSort] = useState<"none" | "croissant" | "decroissant">("none");
  const [dateFilter, setDateFilter] = useState<"none" | "croissant" | "decroissant">("none");

  //filtrage + tri
  const filteredAndSorted = useMemo(() => {
    let result = [...cachetsData];

    if (categorieFilter !== "tous") {
      result = result.filter((item) => item.categorie === categorieFilter);
    }

    if (dateFilter === "croissant") {
      result.sort((a, b) => b.date.getTime() - a.date.getTime());
    } else if (dateFilter === "decroissant") {
      result.sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    if (montantSort === "croissant") {
      result.sort((a, b) => a.montant - b.montant);
    } else if (montantSort === "decroissant") {
      result.sort((a, b) => b.montant - a.montant);
    }

    return result;
  }, [categorieFilter, montantSort]);

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
        onChange={(e) => setDateFilter(e.target.value as "none" | "croissant" | "decroissant")}
      >
        <option value="none">Aucun tri</option>
        <option value="croissant">Date croissante</option>
        <option value="decroissant">Date décroissante</option>
      </select>

      <h3>Trier par montant</h3>
      <select
        onChange={(e) => setMontantSort(e.target.value as "none" | "croissant" | "decroissant")}
      >
        <option value="none">Aucun tri</option>
        <option value="croissant">Montant croissant</option>
        <option value="decroissant">Montant décroissant</option>
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
