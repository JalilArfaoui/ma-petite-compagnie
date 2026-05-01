"use client";

import { Card, Table, Heading } from "@/components/ui";
import { useState, useEffect, useMemo } from "react";
import { getCachetsAction } from "../cachets-actions";

//seule la note est optionnelle, toutes les autres clés sont obligatoires donc pas de null permis
type Cachet = {
  id: number;
  membreId: number;
  membre: { user: { nom: string | null; prenom: string | null } };
  date: string;
  montant: number;
  spectacleId: number;
  spectacle: { titre: string };
  note?: string | null;
};

export default function VisionCachetsPage() {
  const [cachets, setCachets] = useState<Cachet[]>([]);
  const [spectacleFilter, setSpectacleFilter] = useState<string>("tous");
  const [sortBy, setSortBy] = useState<
    "none" | "dateCroissante" | "dateDecroissante" | "montantCroissant" | "montantDecroissant"
  >("none"); //pour avoir un seul tri actif à la fois

  useEffect(() => {
    getCachetsAction()
      .then((result) => {
        if (result.success && result.data) {
          const cachetFormate = result.data.map((c) => ({
            ...c,
            //convertit date de type Date en date de type string
            //simplement parce que je prefère utiliser string plutôt que Date pour la clé date
            date: typeof c.date === "string" ? c.date : c.date.toISOString().split("T")[0],
          }));
          setCachets(cachetFormate);
        } else if (!result.success) {
          console.error(result.error);
        }
      })
      .catch((error) => {
        console.error("Erreur non gérée:", error);
      });
  }, []);

  //filtrage + tri
  const filteredAndSorted = useMemo(() => {
    let result = [...cachets];

    if (spectacleFilter !== "tous") {
      result = result.filter((cachet) => cachet.spectacle.titre === spectacleFilter);
    }

    switch (sortBy) {
      case "dateCroissante":
        result.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case "dateDecroissante":
        result.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case "montantCroissant":
        result.sort((a, b) => {
          return a.montant - b.montant;
        });
        break;
      case "montantDecroissant":
        result.sort((a, b) => {
          return b.montant - a.montant;
        });
        break;
    }

    return result;
  }, [spectacleFilter, sortBy, cachets]);

  return (
    <div>
      <Heading as="h2" className="font-extrabold mb-4 pt-6 text-center">
        Liste des cachets
      </Heading>

      <div className="mx-auto max-w-4xl rounded-[20px] bg-hover p-[20px] border-none shadow-sm transition-shadow flex flex-col gap-[20px]">
        <Heading as="h4" className="font-semibold">
          Filtrer par spectacle
        </Heading>

        <select
          value={spectacleFilter}
          onChange={(e) => setSpectacleFilter(e.target.value as "tous" | string)}
          className="p-2 border border-slate-300 rounded-md w-full"
        >
          <option value="tous">Tous les spectacles</option>
          {[...new Set(cachets.map((c) => c.spectacle.titre))].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <Heading as="h4" className="font-semibold">
          Options de tri
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
      <div className="mx-auto max-w-4xl mt-6 mb-10">
        <Card>
          <Card.Body>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Numero</Table.Header>
                  <Table.Header>Date</Table.Header>
                  <Table.Header>Montant</Table.Header>
                  <Table.Header>Spectacle</Table.Header>
                  <Table.Header>Note</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {filteredAndSorted.map((cachet) => (
                  <Table.Row key={cachet.id}>
                    <Table.Cell>{cachet.id}</Table.Cell>
                    <Table.Cell>{new Date(cachet.date).toLocaleDateString("fr-FR")}</Table.Cell>
                    <Table.Cell>{cachet.montant} €</Table.Cell>
                    <Table.Cell>{cachet.spectacle.titre}</Table.Cell>
                    <Table.Cell>{cachet.note || "-"}</Table.Cell>
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
