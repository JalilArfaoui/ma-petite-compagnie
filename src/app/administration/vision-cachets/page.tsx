"use client";

import { Card, Table, Heading, Pagination } from "@/components/ui";
import { useState, useEffect, useMemo } from "react";
import { getCachetsAction } from "../cachets-actions";
import { Cachet, PAGE_SIZE, STATUT_DICT } from "../cachets-partage";
import { StatutCachet } from "@prisma/client";

export default function VisionCachetsPage() {
  const [cachets, setCachets] = useState<Cachet[]>([]);
  const [filtreSpectacle, setFiltreSpectacle] = useState<string>("tous");
  const [filtreStatut, setFiltreStatut] = useState<StatutCachet | "tous">("tous");
  const [triPar, setTriPar] = useState<
    "none" | "dateCroissante" | "dateDecroissante" | "montantCroissant" | "montantDecroissant"
  >("none"); //pour avoir un seul tri actif à la fois
  const [page, setPage] = useState(1);

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
  const cachetsFiltresEtTries = useMemo(() => {
    let resultat = [...cachets];

    if (filtreSpectacle !== "tous") {
      resultat = resultat.filter((cachet) => cachet.spectacle.titre === filtreSpectacle);
    }

    if (filtreStatut !== "tous") {
      resultat = resultat.filter((cachet) => cachet.statut === filtreStatut);
    }

    switch (triPar) {
      case "dateCroissante":
        resultat.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case "dateDecroissante":
        resultat.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case "montantCroissant":
        resultat.sort((a, b) => {
          return a.montant - b.montant;
        });
        break;
      case "montantDecroissant":
        resultat.sort((a, b) => {
          return b.montant - a.montant;
        });
        break;
    }

    return resultat;
  }, [filtreSpectacle, filtreStatut, triPar, cachets]);

  const totalPages = Math.max(1, Math.ceil(cachetsFiltresEtTries.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const cachetsPagines = cachetsFiltresEtTries.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

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
          value={filtreSpectacle}
          onChange={(e) => {
            setFiltreSpectacle(e.target.value as "tous" | string);
            setPage(1);
          }}
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
          Filtrer par statut
        </Heading>

        <select
          value={filtreStatut}
          onChange={(e) => {
            setFiltreStatut(e.target.value as "tous" | StatutCachet);
            setPage(1);
          }}
          className="p-2 border border-slate-300 rounded-md w-full"
        >
          <option value="tous">Tous</option>
          {Object.entries(StatutCachet)
            .filter(([key]) => isNaN(Number(key))) //filtre les clés numériques de l'enum
            .map(([key, value]) => (
              <option key={value} value={value}>
                {STATUT_DICT[value as StatutCachet]}
              </option>
            ))}
        </select>

        <Heading as="h4" className="font-semibold">
          Options de tri
        </Heading>
        <select
          value={triPar}
          onChange={(e) => {
            setTriPar(e.target.value as typeof triPar);
            setPage(1);
          }}
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
                  <Table.Header>Date</Table.Header>
                  <Table.Header>Montant</Table.Header>
                  <Table.Header>Spectacle</Table.Header>
                  <Table.Header>Statut</Table.Header>
                  <Table.Header>Note</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {cachetsPagines.map((cachet) => (
                  <Table.Row key={cachet.id}>
                    <Table.Cell>{new Date(cachet.date).toLocaleDateString("fr-FR")}</Table.Cell>
                    <Table.Cell>{cachet.montant} €</Table.Cell>
                    <Table.Cell>{cachet.spectacle.titre}</Table.Cell>
                    <Table.Cell>{STATUT_DICT[cachet.statut]}</Table.Cell>
                    <Table.Cell>{cachet.note || "-"}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card.Body>
        </Card>
      </div>
      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
