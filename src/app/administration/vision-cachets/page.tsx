"use client";

import { Card, Table, Heading, Pagination } from "@/components/ui";
import { useState, useEffect, useMemo } from "react";
import { getCachetsAction, accesPageAuth } from "../cachets-actions";

const PAGE_SIZE = 20;

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
  const [idUtilisateurConnecte, setIdUtilisateurConnecte] = useState<number>(-1);
  const [estConnecte, setEstConnecte] = useState<boolean>(false);

  useEffect(() => {
    //appel uniquement dans vision-cachets car c'est la page par défaut de l'onglet administration après connexion
    accesPageAuth().then((result) => {
      const estConnecteResultat = result.estConnecte;
      const idResultat = result.idUtilisateurConnecte || -1;
      const error = result.error || "";

      setEstConnecte(estConnecteResultat);
      setIdUtilisateurConnecte(idResultat);

      if (error !== "") {
        if (!estConnecteResultat) {
          console.error("Utilisateur non connecté. Redirection vers la page de connexion.");
          //window.location.href = "/connexion";
        }
      }
    });
  }, []);

  const [cachets, setCachets] = useState<Cachet[]>([]);
  const [filtreSpectacle, setFiltreSpectacle] = useState<string>("tous");
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
  const filtresEtTries = useMemo(() => {
    let resultat = [...cachets];

    resultat = resultat.filter((cachet) => cachet.membreId === idUtilisateurConnecte);

    if (filtreSpectacle !== "tous") {
      resultat = resultat.filter((cachet) => cachet.spectacle.titre === filtreSpectacle);
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
  }, [filtreSpectacle, triPar, cachets]);

  const totalPages = Math.max(1, Math.ceil(filtresEtTries.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const cachetsPagines = filtresEtTries.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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
                  <Table.Header>Note</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {cachetsPagines.map((cachet) => (
                  <Table.Row key={cachet.id}>
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
        {filtresEtTries.length > PAGE_SIZE && (
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}
