"use client";

import { Heading, Text, Badge, Tooltip, type BadgeProps } from "@/components/ui";
import { FaExclamationTriangle, FaCheck } from "react-icons/fa";

// ===== Variables CSS partagées =====
const STYLES = {
  // Conteneur principal des sections
  sectionContainer: "bg-white rounded-xl p-5 border border-[#EBE5D9]",

  // Petites cartes listant les éléments (factures, financements...)
  itemCard: "bg-white p-3 rounded-lg border border-gray-100 shadow-sm",
  itemCardFlex:
    "bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center",
  textTitle: "font-bold text-sm text-gray-900",
  textSubtitle: "text-xs text-gray-500",
  linkButton: "text-sm text-gray-500 underline hover:text-gray-800",
};

// --- Types pour les données ---

export interface ItemFinancier {
  destinataire: string;
  date: string;
  montant: string;
  statut: string;
  couleurStatut: BadgeProps["variant"];
}

export interface SpectacleEquilibre {
  nom: string;
  statut: "positif" | "negatif" | "alerte";
  budget: number;
  realise: number;
  montant: string;
  alerte?: boolean;
}

export interface FinancementSubvention {
  organisme: string;
  spectacle: string;
  montant: string;
  statut: string;
  type: "attente" | "recu";
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
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-center h-full">
      <Text className="font-semibold mb-2">{titre}</Text>
      <div className="flex items-baseline gap-2">
        <Text className="text-4xl text-gray-900">{valeur}</Text>
        <Text className="text-gray-500">{sousTexte}</Text>
      </div>
    </div>
  );
}

// Composant pour l'en-tête répété des sous-sections
export function SectionEntete({
  titre,
  montant,
  type,
  className = "",
}: {
  titre: string;
  montant: string;
  type: "factures" | "paiements";
  className?: string;
}) {
  const isFacture = type === "factures";
  const bgColor = isFacture ? "bg-[#D4E8CD]" : "bg-[#FCE5B5]";
  const textColor = isFacture ? "text-green-800" : "text-orange-900";

  return (
    <div
      className={`flex justify-between items-center ${bgColor} p-2 -mx-5 px-5 mb-3 text-sm font-semibold ${textColor} ${className}`}
    >
      <span>{titre}</span>
      <span>{montant}</span>
    </div>
  );
}

// Section Factures & Paiements à venir
export function FacturesAvenir({
  factures,
  paiements,
  totalFactures = "+0 €",
  totalPaiements = "-0 €",
}: {
  factures: ItemFinancier[];
  paiements: ItemFinancier[];
  totalFactures?: string;
  totalPaiements?: string;
}) {

  return (
    <div className={STYLES.sectionContainer}>
      <Heading as="h5" className="mb-4 text-gray-800">
        Factures & paiements à venir
      </Heading>

      {/* En-tête Factures */}
      <SectionEntete titre="Factures" montant={totalFactures} type="factures" />

      <div className="flex flex-col gap-3 mb-5">
        {factures.map((item, idx) => (
          <div key={idx} className={STYLES.itemCardFlex}>
            <div>
              <Text className={STYLES.textTitle}>{item.destinataire}</Text>
              <Text className={STYLES.textSubtitle}>{item.date}</Text>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Text className={STYLES.textTitle}>{item.montant}</Text>
              <Badge
                variant={item.couleurStatut}
                className="text-[10px] px-2 py-0 text-center"
              >
                {item.statut}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* En-tête Paiements */}
      <SectionEntete titre="Paiements" montant={totalPaiements} type="paiements" className="mt-4" />

      <div className="flex flex-col gap-3 mb-4">
        {paiements.map((item, idx) => (
          <div key={idx} className={STYLES.itemCardFlex}>
            <div>
              <Text className={STYLES.textTitle}>{item.destinataire}</Text>
              <Text className={STYLES.textSubtitle}>{item.date}</Text>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Text className={STYLES.textTitle}>{item.montant}</Text>
              <Badge
                variant={item.couleurStatut}
                className="text-[10px] px-2 py-0 text-center"
              >
                {item.statut}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="text-right">
        <a href="#" className={STYLES.linkButton}>
          Voir tout
        </a>
      </div>
    </div>
  );
}

// Composant pour une barre de progression de budget
export function BarreBudget({
  pourcentageTotal,
  pourcentageRealise,
  couleur,
}: {
  pourcentageTotal: number;
  pourcentageRealise: number;
  couleur: "green" | "red";
}) {
  const bgColorPrincipal = couleur === "green" ? "bg-[#53826A]" : "bg-[#CC4F4F]";
  const bgColorSecondaire = couleur === "green" ? "bg-[#A3CDA8]" : "bg-[#F0A8A8]";

  return (
    <div className={`h-3 w-48 rounded-sm overflow-hidden flex ${bgColorSecondaire} relative`}>
      <div className={`h-full ${bgColorPrincipal}`} style={{ width: `${pourcentageTotal}%` }}></div>
      <div
        className={`h-full bg-white opacity-40 absolute top-0 bottom-0 right-0`}
        style={{ width: `${100 - pourcentageRealise}%` }}
      ></div>
    </div>
  );
}

// Section Équilibre Financier des Spectacles
export function EquilibreFinancier({ spectacles }: { spectacles: SpectacleEquilibre[] }) {

  return (
    <div className={STYLES.sectionContainer}>
      <Heading as="h5" className="mb-6 text-gray-800">
        Spectacles : équilibre financier (budget / réalisé)
      </Heading>

      <div className="flex flex-col gap-0 border-t border-gray-200">
        {spectacles.map((spec, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center py-4 border-b border-gray-200"
          >
            <Text className="text-sm text-gray-800 w-1/3">{spec.nom}</Text>

            <div className="flex-1 flex justify-center">
              <BarreBudget
                pourcentageTotal={spec.budget}
                pourcentageRealise={spec.realise}
                couleur={spec.statut === "positif" ? "green" : "red"}
              />
            </div>

            <div className="w-1/3 text-right flex justify-end items-center gap-2">
              {spec.alerte && (
                <span className="text-yellow-500 text-lg" title="Attention budget dépassé">
                  <FaExclamationTriangle />
                </span>
              )}
              <Text className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                {spec.montant}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Section Financements & Subventions
export function FinancementsSubventions({
  financements,
}: {
  financements: FinancementSubvention[];
}) {

  return (
    <div className={STYLES.sectionContainer}>
      <Heading as="h5" className="mb-4 text-gray-800">
        Financements & Subventions
      </Heading>

      <div className="flex flex-col gap-3 mb-4">
        {financements.map((fin, idx) => (
          <div key={idx} className={STYLES.itemCard}>
            <Text className={STYLES.textTitle}>{fin.organisme}</Text>
            <Text className={`${STYLES.textSubtitle} mb-2`}>{fin.spectacle}</Text>
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${fin.type === "recu" ? "bg-[#53826A]" : "bg-[#F2C94C]"}`}
              ></span>
              <span className="font-bold text-gray-900">{fin.montant}</span>
              <span className={fin.type === "recu" ? "text-[#53826A]" : "text-[#F2C94C]"}>
                {fin.statut}
              </span>
              {fin.type === "attente" && (
                <Tooltip label="Vous avez reçu ce financement">
                  <button
                    className="ml-auto text-green-600 hover:bg-green-50 p-1 rounded-full bg-white border border-gray-100 shadow-sm cursor-pointer"
                    title="Valider"
                  >
                    <FaCheck size={10} />
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-right">
        <a href="#" className={STYLES.linkButton}>
          Voir tout
        </a>
      </div>
    </div>
  );
}
