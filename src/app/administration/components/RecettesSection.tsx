"use client";

import { useState } from "react";
import { Card, Checkbox, toaster } from "@/components/ui";
import { formatMontant } from "../utils";
import { ModalAjoutRapide, DonneesAjoutFinancier } from "../modals";
import { Recette } from "./types";
import { NoteInfo, FadeContainer, ItemFinancierCard, VoirToutLink } from "./shared";

export function RecettesSection({
  recettes,
  setRecettes,
}: {
  recettes: Recette[];
  setRecettes: React.Dispatch<React.SetStateAction<Recette[]>>;
}) {
  const [showFactures, setShowFactures] = useState(true);
  const [showSubventions, setShowSubventions] = useState(true);

  const validerRecette = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecettes((prev) => prev.map((r) => (r.id === id ? { ...r, statut: "paye" as const } : r)));
    toaster.success({
      title: "Recette validée",
      description: "Le statut a été mis à jour avec succès.",
    });
  };

  const totalRecettes = recettes.reduce((acc, r) => acc + r.montant, 0);

  // Filtrer et trier par date décroissante
  const recettesFiltrees = recettes
    .filter((r) => (r.type === "facture" ? showFactures : showSubventions))
    .sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime());

  // Limiter l'affichage
  const recettesAffichees = recettesFiltrees.slice(0, 5);

  const handleAddRecette = (data: DonneesAjoutFinancier) => {
    const nouvelle: Recette = {
      id: `r-temp-${Date.now()}`,
      nom: data.nom,
      montant: data.montant,
      date: data.date,
      type: data.type as "facture" | "financement",
      statut: data.statut as "en_attente" | "paye",
      spectacles: data.spectacles || [],
      fichier: data.fichier,
    };
    setRecettes([nouvelle, ...recettes]);
    toaster.success({ title: "Recette ajoutée" });
  };

  return (
    <Card className="h-full bg-white">
      <div className="flex justify-between items-center mb-5 mt-[-10px] md:mt-0">
        <h3 className="text-[1.5rem] font-bold font-serif leading-none tracking-tight truncate pr-2">
          Recettes{" "}
          <span className="text-gray-500 font-sans text-xl ml-1">
            ({formatMontant(totalRecettes)})
          </span>
        </h3>
        <ModalAjoutRapide typeSection="Recette" onAdd={handleAddRecette} />
      </div>

      <NoteInfo className="mb-6">
        Note : ces montants incluent les recettes en attente (vision prévisionnelle).
      </NoteInfo>

      {/* Filtres par Checkbox */}
      <div className="flex items-center gap-6 mb-6 px-1">
        <Checkbox checked={showFactures} onChange={(e) => setShowFactures(e.target.checked)}>
          Factures
        </Checkbox>
        <Checkbox checked={showSubventions} onChange={(e) => setShowSubventions(e.target.checked)}>
          Subventions
        </Checkbox>
      </div>

      <FadeContainer>
        {recettesAffichees.map((item) => (
          <ItemFinancierCard
            key={item.id}
            item={item}
            isRecette={true}
            onValider={validerRecette}
          />
        ))}
        {recettesFiltrees.length === 0 && (
          <div className="text-sm text-center py-4 text-text-muted italic">
            Aucune recette ne correspond à votre sélection.
          </div>
        )}
      </FadeContainer>

      <VoirToutLink />
    </Card>
  );
}
