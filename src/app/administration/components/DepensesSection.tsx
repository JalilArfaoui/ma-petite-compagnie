"use client";

import { Card, toaster } from "@/components/ui";
import { formatMontant } from "../utils";
import { ModalAjoutRapide, DonneesAjoutFinancier } from "../modals";
import { Depense } from "./types";
import { NoteInfo, FadeContainer, ItemFinancierCard, VoirToutLink } from "./shared";
import { LISTE_SPECTACLES } from "../test_data";

export function DepensesSection({
  depenses,
  setDepenses,
}: {
  depenses: Depense[];
  setDepenses: React.Dispatch<React.SetStateAction<Depense[]>>;
}) {
  const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);

  const depensesAffichees = [...depenses]
    .sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime())
    .slice(0, 5);

  const handleAddDepense = (data: DonneesAjoutFinancier) => {
    const nouvelleDepense: Depense = {
      id: `d-temp-${Date.now()}`, // dépenses temporaires (non connecté à la bdd encore)
      nom: data.nom,
      date: data.date,
      montant: data.montant,
      spectacles: data.spectacles || [],
      fichier: data.fichier,
    };
    setDepenses([nouvelleDepense, ...depenses]);
    toaster.success({
      title: "Dépense ajoutée",
      description: "La dépense a été directement comptabilisée comme payée.",
    });
  };

  return (
    <Card className="h-full bg-white">
      <div className="flex justify-between items-start md:items-center mb-5 mt-[-10px] md:mt-0 gap-2">
        <h3 className="text-[1.25rem] md:text-[1.5rem] font-bold font-serif leading-tight tracking-tight pr-2 flex flex-col md:flex-row md:items-baseline">
          Dépenses{" "}
          <span className="text-gray-500 font-sans text-lg md:text-xl md:ml-2 mt-1 md:mt-0">
            ({formatMontant(totalDepenses)})
          </span>
        </h3>
        <div className="flex-shrink-0">
          <ModalAjoutRapide
            typeSection="Dépense"
            onAdd={handleAddDepense}
            spectacles={LISTE_SPECTACLES}
          />
        </div>
      </div>

      <NoteInfo className="mb-6">
        Note : l&apos;ensemble des dépenses affichées ici sont considérées comme payées.
      </NoteInfo>

      <FadeContainer>
        {depensesAffichees.map((item) => (
          <ItemFinancierCard key={item.id} item={item} isRecette={false} />
        ))}
        {depensesAffichees.length === 0 && (
          <div className="text-sm text-center py-4 text-text-muted">Aucune dépense trouvée.</div>
        )}
      </FadeContainer>

      <VoirToutLink />
    </Card>
  );
}
