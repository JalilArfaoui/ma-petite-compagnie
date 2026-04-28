"use client";

import { useMemo, useState, useTransition } from "react";
import { Checkbox, toaster } from "@/components/ui";
import { DonneesAjoutFinancier } from "../modals";
import { ItemFinancierCard } from "../components/shared";
import { Recette } from "../components/types";
import { useGestionFinanciere } from "../hooks/useGestionFinanciere";
import { PageGestionFinanciere } from "../components/PageGestionFinanciere";
import {
  toggleStatutOperation,
  creerOperation,
  modifierOperation,
  supprimerOperation,
} from "../finance-actions";
import { buildRecetteLocale, buildRecettePayload, getNouveauStatut } from "../finance-helpers";

type RecetteFromServer = {
  id: string;
  nom: string;
  montant: number;
  date: string;
  type: "facture" | "financement";
  statut: "en_attente" | "paye";
  spectacles: string[];
  fichier?: string;
};

export default function RecettesClient({
  initialRecettes,
  nomsSpectacles,
}: {
  initialRecettes: RecetteFromServer[];
  nomsSpectacles: string[];
}) {
  const [, startTransition] = useTransition();

  const {
    items: recettes,
    setItems: setRecettes,
    itemsTries: recettesTriees,
    total: totalRecettes,
    itemEnEdition: recetteEnEdition,
    setItemEnEdition: setRecetteEnEdition,
    itemASupprimer: recetteASupprimer,
    setItemASupprimer: setRecetteASupprimer,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useGestionFinanciere<Recette>(initialRecettes, "recette");

  const [showFactures, setShowFactures] = useState(true);
  const [showSubventions, setShowSubventions] = useState(true);

  const recettesFiltrees = useMemo(() => {
    return recettesTriees.filter((r) => (r.type === "facture" ? showFactures : showSubventions));
  }, [recettesTriees, showFactures, showSubventions]);

  const handleAddRecette = (data: DonneesAjoutFinancier) => {
    handleAdd(data, buildRecetteLocale, "Recette ajoutée");

    startTransition(async () => {
      await creerOperation(buildRecettePayload(data));
    });
  };

  const handleEditRecette = (data: DonneesAjoutFinancier) => {
    handleEdit(data, buildRecetteLocale, "Recette modifiée");

    if (data.id) {
      startTransition(async () => {
        await modifierOperation(buildRecettePayload(data, Number(data.id)));
      });
    }
  };

  const validerRecette = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const recetteCible = recettes.find((r) => r.id === id);
    if (!recetteCible) return;

    const nouveauStatut = getNouveauStatut(recetteCible.statut);

    setRecettes((prev) => prev.map((r) => (r.id === id ? { ...r, statut: nouveauStatut } : r)));

    toaster.success({
      title: nouveauStatut === "paye" ? "Recette validée" : "Recette dévalidée",
      description: "Le statut a été mis à jour avec succès.",
    });

    startTransition(async () => {
      await toggleStatutOperation(Number(id), recetteCible.statut);
    });
  };

  const handleDeleteRecette = () => {
    if (!recetteASupprimer) return;
    const idToDelete = recetteASupprimer.id;

    handleDelete("Recette supprimée");

    startTransition(async () => {
      await supprimerOperation(Number(idToDelete));
    });
  };

  const editInitialData = recetteEnEdition
    ? {
        id: recetteEnEdition.id,
        nom: recetteEnEdition.nom,
        montant: recetteEnEdition.montant,
        date: recetteEnEdition.date || new Date().toISOString().split("T")[0],
        spectacles: recetteEnEdition.spectacles || [],
        fichier: recetteEnEdition.fichier,
        type: recetteEnEdition.type,
        statut: recetteEnEdition.statut,
      }
    : null;

  const filtersSlot = (
    <div className="flex items-center gap-6 mb-6 px-1">
      <Checkbox checked={showFactures} onChange={(e) => setShowFactures(e.target.checked)}>
        Factures
      </Checkbox>
      <Checkbox checked={showSubventions} onChange={(e) => setShowSubventions(e.target.checked)}>
        Subventions
      </Checkbox>
    </div>
  );

  return (
    <PageGestionFinanciere
      title="Recettes"
      subtitle="Vue complète des recettes"
      total={totalRecettes}
      cardTitle="Toutes les recettes"
      typeSection="Recette"
      noteInfoText="Note : ces montants incluent les recettes en attente (vision prévisionnelle)."
      filtersSlot={filtersSlot}
      nomsSpectacles={nomsSpectacles}
      isEmpty={recettesFiltrees.length === 0}
      emptyMessage="Aucune recette ne correspond à votre sélection."
      onAddSubmit={handleAddRecette}
      editInitialData={editInitialData}
      onEditSubmit={handleEditRecette}
      onEditClose={() => setRecetteEnEdition(null)}
      deleteItemName={recetteASupprimer?.nom || null}
      onDeleteSubmit={handleDeleteRecette}
      onDeleteClose={() => setRecetteASupprimer(null)}
    >
      {recettesFiltrees.map((item) => (
        <ItemFinancierCard
          key={item.id}
          item={item}
          showSpectaclesInline={true}
          onValider={validerRecette}
          onEdit={
            item.type === "facture"
              ? undefined
              : (id, e) => {
                  e.stopPropagation();
                  const cible = recettes.find((r) => r.id === id);
                  if (!cible) return;
                  setRecetteEnEdition(cible);
                }
          }
          onDelete={(id, e) => {
            e.stopPropagation();
            const cible = recettes.find((r) => r.id === id);
            if (!cible) return;
            setRecetteASupprimer(cible);
          }}
        />
      ))}
    </PageGestionFinanciere>
  );
}
