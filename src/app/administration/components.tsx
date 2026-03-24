"use client";

import { useState } from "react";
import { Text, Badge, Tooltip, Card, Link, toaster } from "@/components/ui";
import { FaExclamationTriangle, FaCheck } from "react-icons/fa";
import { formatDateFr, formatMontant } from "./utils";

// ===== Variables CSS partagées =====
const STYLES = {
  textTitle: "font-bold text-sm text-gray-900",
  textSubtitle: "text-xs text-gray-500",
};

// --- Types pour les données ---

export interface Recette {
  id: string;
  nom: string;
  type: "facture" | "financement";
  date?: string;
  spectacle?: string;
  montant: number;
  statut: "en_attente" | "paye";
}

export interface Depense {
  id: string;
  nom: string;
  date?: string;
  montant: number;
}

export interface SpectacleEquilibre {
  nom: string;
  pourcentageConsomme: number;
  montant: number;
}

// Carte pour les indicateurs clés en haut de page
export function IndicateurCle({
  titre,
  valeur,
  sousTexte,
}: {
  titre: string;
  valeur: React.ReactNode;
  sousTexte: string;
}) {
  return (
    <Card title={titre} className="h-full bg-white">
      <div className="flex items-baseline gap-2">
        <Text className="text-4xl text-gray-900">{valeur}</Text>
        <Text className="text-gray-500">{sousTexte}</Text>
      </div>
    </Card>
  );
}

// Composant pour l'en-tête répété des sous-sections (Factures, Financements, etc.)
export function SousSectionEntete({
  titre,
  montant,
  couleur = "green",
  className = "",
}: {
  titre: string;
  montant: number;
  couleur?: "green" | "blue" | "orange";
  className?: string;
}) {
  const styles = {
    green: "bg-[#D4E8CD] text-green-800",
    blue: "bg-[#E6F3FF] text-blue-800",
    orange: "bg-[#FCE5B5] text-orange-900",
  };

  return (
    <div
      className={`flex justify-between items-center ${styles[couleur]} p-2 -mx-5 px-5 mb-3 text-sm font-semibold ${className}`}
    >
      <span>{titre}</span>
      <span>{formatMontant(montant)}</span>
    </div>
  );
}

// Section Recettes
export function RecettesSection({ initialRecettes }: { initialRecettes: Recette[] }) {
  const [recettes, setRecettes] = useState<Recette[]>(initialRecettes);

  const validerRecette = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecettes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, statut: "paye" as const } : r))
    );
    toaster.success({
      title: "Recette validée",
      description: "Le statut a été mis à jour avec succès.",
    });
  };

  const factures = recettes.filter((r) => r.type === "facture");
  const financements = recettes.filter((r) => r.type === "financement");

  const totalRecettes = recettes.reduce((acc, r) => acc + r.montant, 0);
  const totalFactures = factures.reduce((acc, r) => acc + r.montant, 0);
  const totalFinancements = financements.reduce((acc, r) => acc + r.montant, 0);

  const renderListe = (items: Recette[]) => (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const variant = item.statut === "paye" ? "green" : "yellow";
        const label = item.statut === "paye" ? "Payé" : "En attente";

        return (
          <Card key={item.id} className="p-3 bg-white !gap-0 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <Text className={`${STYLES.textTitle} whitespace-nowrap overflow-hidden text-ellipsis`}>
                  {item.nom}
                </Text>
                {item.date && (
                  <Text className={`${STYLES.textSubtitle} whitespace-nowrap`}>
                    {formatDateFr(item.date)}
                  </Text>
                )}
                {item.spectacle && (
                  <Text className={`${STYLES.textSubtitle} whitespace-nowrap overflow-hidden text-ellipsis`}>
                    {item.spectacle}
                  </Text>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                <Text className={STYLES.textTitle}>{formatMontant(item.montant)}</Text>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={variant}
                    className="text-[10px] px-2 py-0 text-center whitespace-nowrap"
                  >
                    {label}
                  </Badge>
                  {item.statut === "en_attente" && (
                    <Tooltip label="Valider">
                      <button
                        onClick={(e) => validerRecette(item.id, e)}
                        className="text-green-600 hover:bg-green-50 p-1.5 rounded-full bg-white border border-gray-100 shadow-sm cursor-pointer transition-colors"
                        title="Valider"
                      >
                        <FaCheck size={10} />
                      </button>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <Card title={`Recettes (${formatMontant(totalRecettes)})`} className="h-full bg-white">
      <SousSectionEntete titre="Factures" montant={totalFactures} couleur="green" />
      {renderListe(factures)}

      <SousSectionEntete
        titre="Financements / Subventions"
        montant={totalFinancements}
        couleur="blue"
        className="mt-4"
      />
      {renderListe(financements)}

      <div className="text-right mt-4">
        <Link href="#">Voir tout</Link>
      </div>
    </Card>
  );
}

// Section Dépenses
export function DepensesSection({ initialDepenses }: { initialDepenses: Depense[] }) {
  const [depenses, setDepenses] = useState<Depense[]>(initialDepenses);

  const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);

  const ajouterDepense = () => {
    const nouvelleDepense: Depense = {
      id: `d${Date.now()}`,
      nom: "Nouvelle dépense (Exemple)",
      date: new Date().toISOString().split("T")[0],
      montant: 150,
    };
    setDepenses([nouvelleDepense, ...depenses]);
    toaster.success({
      title: "Dépense ajoutée",
      description: "La dépense a été directement comptabilisée comme payée.",
    });
  };

  return (
    <Card title={`Dépenses (${formatMontant(totalDepenses)})`} className="h-full bg-white">
      <div className="flex justify-end mb-4">
        <button
          onClick={ajouterDepense}
          className="bg-[#53826A] text-white text-sm px-3 py-1.5 rounded-md hover:bg-[#53826A]/90 transition-colors shadow-sm"
        >
          + Ajouter une dépense
        </button>
      </div>
      
      <div className="flex flex-col gap-3">
        {depenses.map((item) => (
          <Card key={item.id} className="p-3 bg-white !gap-0 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <Text className={STYLES.textTitle}>{item.nom}</Text>
                {item.date && <Text className={STYLES.textSubtitle}>{formatDateFr(item.date)}</Text>}
              </div>
              <Text className={STYLES.textTitle}>{formatMontant(item.montant)}</Text>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-right mt-4">
        <Link href="#">Voir tout</Link>
      </div>
    </Card>
  );
}

// Composant pour une barre de progression de budget
export function BarreBudget({
  pourcentage,
  couleur,
}: {
  pourcentage: number;
  couleur: "green" | "red";
}) {
  const bgColorPrincipal = couleur === "green" ? "bg-[#53826A]" : "bg-[#CC4F4F]";
  const bgColorSecondaire = couleur === "green" ? "bg-[#A3CDA8]" : "bg-[#F0A8A8]";

  return (
    <div className={`h-3 w-48 rounded-sm overflow-hidden ${bgColorSecondaire} relative`}>
      <div className={`h-full ${bgColorPrincipal}`} style={{ width: `${pourcentage}%` }}></div>
    </div>
  );
}

// Section Équilibre Financier des Spectacles
export function EquilibreFinancier({ spectacles }: { spectacles: SpectacleEquilibre[] }) {
  return (
    <Card title="Spectacles : équilibre financier (budget / réalisé)" className="h-full bg-white">
      <div className="flex flex-col gap-4">
        {spectacles.map((spec, idx) => (
          <Card key={idx} className="p-4 bg-white !gap-0 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center w-full">
              <Text className="text-sm text-gray-800 w-1/3">{spec.nom}</Text>

              <div className="flex-1 flex justify-center">
                <BarreBudget
                  pourcentage={spec.pourcentageConsomme}
                  couleur={spec.montant >= 0 ? "green" : "red"}
                />
              </div>

              <div className="w-1/3 text-right flex justify-end items-center gap-2">
                {spec.montant < 0 && (
                  <span className="text-yellow-500 text-lg" title="Attention budget dépassé">
                    <FaExclamationTriangle />
                  </span>
                )}
                <Text className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  {formatMontant(spec.montant, true)}
                </Text>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
