"use client";

import { useState } from "react";
import { Card, toaster } from "@/components/ui";
import { formatMontant } from "../utils";
import { ModalAjoutRapide } from "../modals";
import { Depense } from "./types";
import { NoteInfo, FadeContainer, ItemFinancierCard, VoirToutLink } from "./shared";

export function DepensesSection({ initialDepenses }: { initialDepenses: Depense[] }) {
  const [depenses, setDepenses] = useState<Depense[]>(initialDepenses);

  const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);

  const depensesAffichees = [...depenses]
    .sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime())
    .slice(0, 5);

  const handleAddDepense = (data: any) => {
    const nouvelleDepense: Depense = {
      id: `d-temp-${Date.now()}`,
      nom: data.nom,
      date: new Date().toISOString().split("T")[0],
      montant: data.montant,
      spectacles: [],
    };
    setDepenses([nouvelleDepense, ...depenses]);
    toaster.success({
      title: "Dépense ajoutée",
      description: "La dépense a été directement comptabilisée comme payée.",
    });
  };

  return (
    <Card className="h-full bg-white">
      <div className="flex justify-between items-center mb-5 mt-[-10px] md:mt-0">
        <h3 className="text-[1.5rem] font-bold font-serif leading-none tracking-tight truncate pr-2">
          Dépenses{" "}
          <span className="text-gray-500 font-sans text-xl ml-1">
            ({formatMontant(totalDepenses)})
          </span>
        </h3>
        <ModalAjoutRapide typeSection="Dépense" onAdd={handleAddDepense} />
      </div>

      <NoteInfo className="mb-6">
        Note : l'ensemble des dépenses affichées ici sont considérées comme payées.
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
