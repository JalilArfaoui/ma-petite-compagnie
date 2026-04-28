"use client";

import { useTransition } from "react";
import { DonneesAjoutFinancier } from "../modals";
import { ItemFinancierCard } from "../components/shared";
import { Depense } from "../components/types";
import { useGestionFinanciere } from "../hooks/useGestionFinanciere";
import { PageGestionFinanciere } from "../components/PageGestionFinanciere";
import { creerOperation, modifierOperation, supprimerOperation } from "../finance-actions";
import { buildDepenseLocale, buildDepensePayload } from "../finance-helpers";

type DepenseFromServer = {
  id: string;
  nom: string;
  montant: number;
  date: string;
  spectacles: string[];
  fichier?: string;
};

export default function DepensesClient({
  initialDepenses,
  nomsSpectacles,
}: {
  initialDepenses: DepenseFromServer[];
  nomsSpectacles: string[];
}) {
  const [, startTransition] = useTransition();

  const {
    items: depenses,
    itemsTries: depensesTries,
    total: totalDepenses,
    itemEnEdition: depenseEnEdition,
    setItemEnEdition: setDepenseEnEdition,
    itemASupprimer: depenseASupprimer,
    setItemASupprimer: setDepenseASupprimer,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useGestionFinanciere<Depense>(initialDepenses, "dépense");

  const handleAddDepense = (data: DonneesAjoutFinancier) => {
    handleAdd(data, buildDepenseLocale, "Dépense ajoutée");

    startTransition(async () => {
      await creerOperation(buildDepensePayload(data));
    });
  };

  const handleEditDepense = (data: DonneesAjoutFinancier) => {
    handleEdit(data, buildDepenseLocale, "Dépense modifiée");

    if (data.id) {
      startTransition(async () => {
        await modifierOperation(buildDepensePayload(data, Number(data.id)));
      });
    }
  };

  const handleDeleteDepense = () => {
    if (!depenseASupprimer) return;
    const idToDelete = depenseASupprimer.id;

    handleDelete("Dépense supprimée");

    startTransition(async () => {
      await supprimerOperation(Number(idToDelete));
    });
  };

  const editInitialData = depenseEnEdition
    ? {
        id: depenseEnEdition.id,
        nom: depenseEnEdition.nom,
        montant: depenseEnEdition.montant,
        date: depenseEnEdition.date || new Date().toISOString().split("T")[0],
        spectacles: depenseEnEdition.spectacles || [],
        fichier: depenseEnEdition.fichier,
      }
    : null;

  return (
    <PageGestionFinanciere
      title="Dépenses"
      subtitle="Vue complète des dépenses"
      total={totalDepenses}
      cardTitle="Toutes les dépenses"
      typeSection="Dépense"
      noteInfoText="Note : l'ensemble des dépenses affichées ici sont considérées comme payées."
      nomsSpectacles={nomsSpectacles}
      isEmpty={depensesTries.length === 0}
      emptyMessage="Aucune dépense trouvée."
      onAddSubmit={handleAddDepense}
      editInitialData={editInitialData}
      onEditSubmit={handleEditDepense}
      onEditClose={() => setDepenseEnEdition(null)}
      deleteItemName={depenseASupprimer?.nom || null}
      onDeleteSubmit={handleDeleteDepense}
      onDeleteClose={() => setDepenseASupprimer(null)}
    >
      {depensesTries.map((item) => (
        <ItemFinancierCard
          key={item.id}
          item={item}
          showSpectaclesInline={true}
          onEdit={(id, e) => {
            e.stopPropagation();
            const cible = depenses.find((d) => d.id === id);
            if (!cible) return;
            setDepenseEnEdition(cible);
          }}
          onDelete={(id, e) => {
            e.stopPropagation();
            const cible = depenses.find((d) => d.id === id);
            if (!cible) return;
            setDepenseASupprimer(cible);
          }}
        />
      ))}
    </PageGestionFinanciere>
  );
}
