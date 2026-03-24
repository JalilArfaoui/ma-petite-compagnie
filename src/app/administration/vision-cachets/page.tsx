"use client";

import { Card, Table, Heading } from "@/components/ui";
import { useState, useMemo } from "react";

type Spectacle = "Hamlet" | "Le Roi Lion" | "Romeo et Juliette";

type Cachet = {
  id: number;
  date: string;
  montant: number;
  spectacle: Spectacle;
};

//dictionnaire temporaire le temps que la bdd soit opérationnelle
const CACHETS_DATA: Cachet[] = [
  { id: 1, date: "2024-01-18", montant: 150, spectacle: "Le Roi Lion" },
  { id: 2, date: "2024-03-21", montant: 300, spectacle: "Hamlet" },
  { id: 3, date: "2024-06-04", montant: 200, spectacle: "Romeo et Juliette" },
  { id: 4, date: "2024-07-15", montant: 180, spectacle: "Le Roi Lion" },
  { id: 5, date: "2024-08-07", montant: 250, spectacle: "Hamlet" },
  { id: 6, date: "2024-09-24", montant: 120, spectacle: "Le Roi Lion" },
];

export default function VisionCachetsPage() {
  const [spectacleFilter, setSpectacleFilter] = useState<"tous" | Spectacle>("tous");
  const [sortBy, setSortBy] = useState<
    "none" | "dateCroissante" | "dateDecroissante" | "montantCroissant" | "montantDecroissant"
  >("none"); //pour avoir un seul tri actif à la fois

  //filtrage + tri
  const filteredAndSorted = useMemo(() => {
    let result = [...CACHETS_DATA];

    if (spectacleFilter !== "tous") {
      result = result.filter((cachet) => cachet.spectacle === spectacleFilter);
    }

    switch (sortBy) {
      case "dateCroissante":
        result.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case "dateDecroissante":
        result.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case "montantCroissant":
        result.sort((a, b) => a.montant - b.montant);
        break;
      case "montantDecroissant":
        result.sort((a, b) => b.montant - a.montant);
        break;
    }

    return result;
  }, [spectacleFilter, sortBy]);

  return (
    <div>
      <Heading as="h3" className="font-extrabold mb-4 pt-6 text-center">
        Liste des cachets
      </Heading>
      
      <div className="mx-auto max-w-4xl bg-hover p-[20px] border-none shadow-sm transition-shadow flex flex-col gap-[20px]">
        <Heading as="h4" className="font-semibold">
          Filtrer par spectacle
        </Heading>

        <select
          value={spectacleFilter}
          onChange={(e) => setSpectacleFilter(e.target.value as "tous" | Spectacle)}
          className="p-2 border border-slate-300 rounded-md w-full"
        >
          <option value="tous">Tous les spectacles</option>
          <option value="Hamlet">Hamlet</option>
          <option value="Le Roi Lion">Le Roi Lion</option>
          <option value="Romeo et Juliette">Romeo et Juliette</option>
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
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="p-2 border border-slate-300 rounded-md w-full"
        >
          <option value="none">Aucun tri</option>
          <option value="dateCroissante">Date croissante</option>
          <option value="dateDecroissante">Date décroissante</option>
          <option value="montantCroissant">Montant croissant</option>
          <option value="montantDecroissant">Montant décroissant</option>
        </select>
      </div>

      <Heading as="h3" className="font-semibold mt-9 pb-2 border-b text-center">
        Résultats
      </Heading>
      <div className="mx-140 mt-6 mb-10">
        <Card>
          <Card.Body>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Numero</Table.Header>
                  <Table.Header>Date</Table.Header>
                  <Table.Header>Montant</Table.Header>
                  <Table.Header>Spectacle</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {filteredAndSorted.map((cachet) => (
                  <Table.Row key={cachet.id}>
                    <Table.Cell>{cachet.id}</Table.Cell>
                    <Table.Cell>{new Date(cachet.date).toLocaleDateString("fr-FR")}</Table.Cell>
                    <Table.Cell>{cachet.montant} €</Table.Cell>
                    <Table.Cell>{cachet.spectacle}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
