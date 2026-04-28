"use client";

import { useMemo, useTransition } from "react";
import { Card, toaster } from "@/components/ui";
import { formatMontant } from "../utils";
import { ModalAjoutRapide, DonneesAjoutFinancier } from "../modals";
import { Recette } from "./types";
import { NoteInfo, FadeContainer, ItemFinancierCard, VoirToutLink } from "./shared";
import { validerOperation, creerOperation } from "../finance-actions";
import { buildRecetteLocale, buildRecettePayload } from "../finance-helpers";

export function RecettesSection({
  recettes,
  setRecettes,
  spectacles,
}: {
  recettes: Recette[];
  setRecettes: React.Dispatch<React.SetStateAction<Recette[]>>;
  spectacles: string[];
}) {
  const [isPending, startTransition] = useTransition();

  const validerRecette = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecettes((prev) => prev.map((r) => (r.id === id ? { ...r, statut: "paye" as const } : r)));
    toaster.success({
      title: "Recette validée",
      description: "Le statut a été mis à jour avec succès.",
    });

    startTransition(async () => {
      await validerOperation(Number(id));
    });
  };

  const totalRecettes = recettes.reduce((acc, r) => acc + r.montant, 0);

  const recettesFiltrees = useMemo(() => {
    return [...recettes].sort(
      (a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
    );
  }, [recettes]);

  const recettesAffichees = recettesFiltrees.slice(0, 5);

  const handleAddRecette = (data: DonneesAjoutFinancier) => {
    setRecettes([buildRecetteLocale(data), ...recettes]);
    toaster.success({ title: "Recette ajoutée" });

    startTransition(async () => {
      await creerOperation(buildRecettePayload(data));
    });
  };

  return (
    <Card className="h-full bg-white">
      <div className="flex justify-between items-start md:items-center mb-5 mt-[-10px] md:mt-0 gap-2">
        <h3 className="text-[1.25rem] md:text-[1.5rem] font-bold font-serif leading-tight tracking-tight pr-2 flex flex-col md:flex-row md:items-baseline">
          Recettes{" "}
          <span className="text-gray-500 font-sans text-lg md:text-xl md:ml-2 mt-1 md:mt-0">
            ({formatMontant(totalRecettes)})
          </span>
        </h3>
        <div className="flex-shrink-0">
          <ModalAjoutRapide
            typeSection="Recette"
            onSubmit={handleAddRecette}
            spectacles={spectacles}
          />
        </div>
      </div>

      <FadeContainer>
        {recettesAffichees.map((item) => (
          <ItemFinancierCard key={item.id} item={item} onValider={validerRecette} />
        ))}
        {recettesFiltrees.length === 0 && (
          <div className="text-sm text-center py-4 text-text-muted italic">
            Aucune recette ne correspond à votre sélection.
          </div>
        )}
      </FadeContainer>

      <VoirToutLink href="/administration/recettes" />
    </Card>
  );
}
