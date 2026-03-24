"use client";

import { Text, Badge, Tooltip, Card, Link } from "@/components/ui";
import { FaExclamationTriangle, FaCheck } from "react-icons/fa";
import { formatDateFr, formatMontant } from "./utils";

// ===== Variables CSS partagées =====
const STYLES = {
  textTitle: "font-bold text-sm text-gray-900",
  textSubtitle: "text-xs text-gray-500",
};

// --- Types pour les données ---

export interface ItemFinancier {
  destinataire: string;
  date: string;
  montant: number;
  statut: string;
}

export interface SpectacleEquilibre {
  nom: string;
  pourcentageConsomme: number;
  montant: number;
}

export interface FinancementSubvention {
  organisme: string;
  spectacle: string;
  montant: number;
  statut: "en_attente" | "recu";
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

// Composant pour l'en-tête répété des sous-sections
export function SectionEntete({
  titre,
  montant,
  type,
  className = "",
}: {
  titre: string;
  montant: number;
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
      <span>{formatMontant(montant, true)}</span>
    </div>
  );
}

// Composant pour afficher une liste d'éléments financiers (factures ou paiements)
export function ListeItemsFinanciers({
  items,
  className = "",
}: {
  items: ItemFinancier[];
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {items.map((item, idx) => {
        // logique pour savoir la couleur du badge
        const variant =
          item.statut === "non_paye"
            ? "red"
            : ["recue", "recu", "paye"].includes(item.statut)
              ? "green"
              : "gray";

        // logique pour formater le texte affiché
        const label =
          item.statut === "recue"
            ? "Reçue"
            : item.statut === "paye"
              ? "Payé"
              : item.statut === "non_paye"
                ? "Non payé"
                : item.statut;

        return (
          <Card key={idx} className="p-3 bg-white !gap-0">
            <div className="flex justify-between items-center">
              <div>
                <Text className={STYLES.textTitle}>{item.destinataire}</Text>
                <Text className={STYLES.textSubtitle}>{formatDateFr(item.date)}</Text>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Text className={STYLES.textTitle}>{formatMontant(item.montant)}</Text>
                <Badge variant={variant} className="text-[10px] px-2 py-0 text-center">
                  {label}
                </Badge>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// Section Factures & Paiements à venir
export function FacturesAvenir({
  factures,
  paiements,
  totalFactures = 0,
  totalPaiements = 0,
}: {
  factures: ItemFinancier[];
  paiements: ItemFinancier[];
  totalFactures?: number;
  totalPaiements?: number;
}) {
  return (
    <Card title="Factures & paiements à venir" className="h-full bg-white">
      {/* En-tête Factures */}
      <SectionEntete titre="Factures" montant={totalFactures} type="factures" />

      <ListeItemsFinanciers items={factures} className="mb-5" />

      {/* En-tête Paiements */}
      <SectionEntete titre="Paiements" montant={totalPaiements} type="paiements" className="mt-4" />

      <ListeItemsFinanciers items={paiements} className="mb-4" />

      <div className="text-right">
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
          <Card key={idx} className="p-4 bg-white !gap-0">
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

// Bouton pour marquer un élément comme reçu ou payé
export function BoutonValider({ onClick }: { onClick?: () => void }) {
  return (
    <Tooltip label="Marquer comme reçu">
      <button
        onClick={onClick}
        className="ml-auto text-green-600 hover:bg-green-50 p-1 rounded-full bg-white border border-gray-100 shadow-sm cursor-pointer"
        title="Valider"
      >
        <FaCheck size={10} />
      </button>
    </Tooltip>
  );
}

// Section Financements & Subventions
export function FinancementsSubventions({
  financements,
}: {
  financements: FinancementSubvention[];
}) {
  return (
    <Card title="Financements & Subventions" className="h-full bg-white">
      <div className="flex flex-col gap-3 mb-4">
        {financements.map((fin, idx) => {
          // logique pour savoir la couleur du badge
          const variant = fin.statut === "recu" ? "green" : "yellow";
          const label = fin.statut === "recu" ? "Reçu" : "En attente";

          return (
            <Card key={idx} className="p-3 bg-white !gap-0">
              <div className="flex flex-col gap-1">
                <Text className={STYLES.textTitle}>{fin.organisme}</Text>
                <Text className={`${STYLES.textSubtitle} mb-2`}>{fin.spectacle}</Text>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant={variant} className="text-[10px] px-2 py-0">
                    {label}
                  </Badge>
                  <span className="font-bold text-gray-900">{formatMontant(fin.montant)}</span>
                  {fin.statut === "en_attente" && <BoutonValider />}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-right">
        <Link href="#">Voir tout</Link>
      </div>
    </Card>
  );
}
