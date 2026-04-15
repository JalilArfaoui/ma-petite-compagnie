"use client";

import { DonneesAjoutFinancier } from "../modals";
import { DEPENSES_DATA, SPECTACLES_DATA } from "../test_data";
import { ItemFinancierCard } from "../components/shared";
import { Depense } from "../components/types";
import { useGestionFinanciere } from "../hooks/useGestionFinanciere";
import { PageGestionFinanciere } from "../components/PageGestionFinanciere";

export default function DepensesPage() {
  // TODO(BDD): Remplacer DEPENSES_DATA par un appel à la base de données (ex: Server Action ou API)
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
  } = useGestionFinanciere<Depense>(DEPENSES_DATA, "dépense");

  const nomsSpectacles = SPECTACLES_DATA.map((s) => s.nom);

  const handleAddDepense = (data: DonneesAjoutFinancier) => {
    // TODO(BDD): Envoyer les données à la base de données via une mutation (ex: prisma.depense.create)
    handleAdd(
      data,
      (d) => ({
        id: `d-temp-${Date.now()}`,
        nom: d.nom,
        date: d.date,
        montant: d.montant,
        spectacles: d.spectacles || [],
        fichier: d.fichier,
      }),
      "Dépense ajoutée"
    );
  };

  const handleEditDepense = (data: DonneesAjoutFinancier) => {
    // TODO(BDD): Mettre à jour les données en base de données (ex: prisma.depense.update)
    handleEdit(
      data,
      (d) => ({
        id: d.id as string,
        nom: d.nom,
        montant: d.montant,
        date: d.date,
        spectacles: d.spectacles || [],
        fichier: d.fichier,
      }),
      "Dépense modifiée"
    );
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
      onDeleteSubmit={() => handleDelete("Dépense supprimée")}
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
