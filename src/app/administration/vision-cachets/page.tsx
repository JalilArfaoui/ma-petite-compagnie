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

export default function VisionCachetsPage() {
  //dictionnaire temporaire le temps que la bdd soit opérationnelle
  const cachetsData: Record<number, [Categorie, number]> = {
    1: ["repetition", 150],
    2: ["representation", 300],
    3: ["enregistrement", 200],
    4: ["repetition", 180],
    5: ["intervention", 250],
    6: ["autre", 120],
  };

  const [categorieFilter, setCategorieFilter] = useState<"tous" | Categorie>("tous");
  const [montantSort, setMontantSort] = useState<"none" | "croissant" | "decroissant">("none");

  //transformation du dictionnaire en tableau exploitable
  const cachetsArray = Object.entries(cachetsData).map(([id, value]) => ({
    id,
    categorie: value[0],
    montant: value[1],
  }));

  //filtrage + tri
  const filteredAndSorted = useMemo(() => {
    let result = [...cachetsArray];

    if (categorieFilter !== "tous") {
      result = result.filter((item) => item.categorie === categorieFilter);
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
            Cachet #{cachet.id} — {cachet.categorie} — {cachet.montant} €
          </li>
        ))}
      </ul>
    </div>
  );
}
