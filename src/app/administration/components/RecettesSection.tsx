"use client";

import { useMemo, useTransition } from "react";
import { Card, toaster } from "@/components/ui";
import { formatMontant } from "../utils";
import { ModalAjoutRapide, DonneesAjoutFinancier } from "../modals";
import { Recette } from "./types";
import { FadeContainer, ItemFinancierCard, VoirToutLink } from "./shared";
import { toggleStatutOperation, creerOperation } from "../finance-actions";
import { buildRecettePayload, getNouveauStatut } from "../finance-helpers";

export function RecettesSection({
  recettes,
  setRecettes,
  spectacles,
}: {
  recettes: Recette[];
  setRecettes: React.Dispatch<React.SetStateAction<Recette[]>>;
  spectacles: string[];
}) {
  const [, startTransition] = useTransition();

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

  const totalRecettes = recettes.reduce((acc, r) => acc + r.montant, 0);

  const recettesFiltrees = useMemo(() => {
    return [...recettes].sort(
      (a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
    );
  }, [recettes]);

  const recettesAffichees = recettesFiltrees.slice(0, 5);

  const handleAddRecette = (data: DonneesAjoutFinancier) => {
    startTransition(async () => {
      try {
        const result = await creerOperation(buildRecettePayload(data));
        if ("error" in result) {
          toaster.error({
            title: "Erreur lors de l'ajout",
            description: result.error,
          });
          return;
        }

        setRecettes((prev) => [result.operation, ...prev]);
        toaster.success({ title: "Recette ajoutée" });
      } catch {
        toaster.error({
          title: "Erreur lors de l'ajout",
          description: "Impossible d'ajouter la recette.",
        });
      }
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
