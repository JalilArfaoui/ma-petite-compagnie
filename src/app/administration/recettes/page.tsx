"use client";

import { useMemo, useState } from "react";
import { Checkbox, toaster } from "@/components/ui";
import { DonneesAjoutFinancier } from "../modals";
import { RECETTES_DATA, SPECTACLES_DATA } from "../test_data";
import { ItemFinancierCard } from "../components/shared";
import { Recette } from "../components/types";
import { useGestionFinanciere } from "../hooks/useGestionFinanciere";
import { PageGestionFinanciere } from "../components/PageGestionFinanciere";

export default function RecettesPage() {
  // TODO(BDD): Remplacer RECETTES_DATA par un appel à la base de données (ex: Server Action ou API)
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
  } = useGestionFinanciere<Recette>(RECETTES_DATA, "recette");

  const [showFactures, setShowFactures] = useState(true);
  const [showSubventions, setShowSubventions] = useState(true);

  const nomsSpectacles = SPECTACLES_DATA.map((s) => s.nom);

  const recettesFiltrees = useMemo(() => {
    return recettesTriees.filter((r) => (r.type === "facture" ? showFactures : showSubventions));
  }, [recettesTriees, showFactures, showSubventions]);

  const handleAddRecette = (data: DonneesAjoutFinancier) => {
    // TODO(BDD): Envoyer les données à la base de données via une mutation (ex: prisma.recette.create)
    handleAdd(data, (d) => ({
      id: `r-temp-${Date.now()}`,
      nom: d.nom,
      montant: d.montant,
      date: d.date,
      type: d.type ?? "facture",
      statut: d.statut ?? "en_attente",
      spectacles: d.spectacles || [],
      fichier: d.fichier,
    }));
  };

  const handleEditRecette = (data: DonneesAjoutFinancier) => {
    // TODO(BDD): Mettre à jour les données en base de données (ex: prisma.recette.update)
    handleEdit(data, (d) => ({
      id: d.id as string,
      nom: d.nom,
      montant: d.montant,
      date: d.date,
      spectacles: d.spectacles || [],
      fichier: d.fichier,
      type: d.type ?? "facture",
      statut: d.statut ?? "en_attente",
    }));
  };

  const validerRecette = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO(BDD): Mettre à jour le statut en base de données (ex: prisma.recette.update)
    setRecettes((prev) => prev.map((r) => (r.id === id ? { ...r, statut: "paye" } : r)));
    toaster.success({
      title: "Recette validée",
      description: "Le statut a été mis à jour avec succès.",
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
      onDeleteSubmit={handleDelete}
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
