"use client";

import { Text, Badge, Tooltip, Card, Link } from "@/components/ui";
import { FaCheck, FaInfoCircle } from "react-icons/fa";
import { formatDateFr, formatMontant } from "../utils";
import { Recette, Depense } from "./types";

// Composant de note d'information réutilisable (basé sur Alert)
import { Alert } from "@/components/ui";

export function NoteInfo({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Alert
      status="info"
      className={`mb-4 py-2 px-3 border-none flex items-center gap-0 ${className}`}
    >
      <Alert.Icon className="mr-2">
        <FaInfoCircle size={12} />
      </Alert.Icon>
      <Alert.Description className="text-[11px] leading-tight m-0 p-0">
        {children}
      </Alert.Description>
    </Alert>
  );
}

// flou pour le bas de liste des sections pour montrer la suite d'éléments
export function FadeContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative max-h-[420px] overflow-hidden">
      <div className="flex flex-col gap-3 pb-8">{children}</div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}

// bouton "voir tout" en bas des sections
export function VoirToutLink() {
  return (
    <div className="text-center mt-4">
      <Link href="#" className="text-sm font-semibold">
        Voir tout
      </Link>
    </div>
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

export function ItemFinancierCard({
  item,
  isRecette,
  onValider,
}: {
  item: Recette | Depense;
  isRecette: boolean;
  onValider?: (id: string, e: React.MouseEvent) => void;
}) {
  const recette = isRecette ? (item as Recette) : null;
  const isEnAttente = recette?.statut === "en_attente";

  const typeBadgeVariant = recette?.type === "facture" ? "purple" : "blue";
  const typeLabel =
    recette?.type === "facture" ? "Facture" : recette?.type === "financement" ? "Subvention" : "";

  const tooltipLabel =
    item.spectacles && item.spectacles.length > 0
      ? `${item.spectacles.join(", ")}`
      : "Aucun spectacle rattaché";

  return (
    <Tooltip label={tooltipLabel} delayDuration={0}>
      <Card className="p-3 bg-white !gap-0 shadow-sm border border-gray-100 transition-all hover:shadow-md cursor-help overflow-hidden">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col gap-1 min-w-0 flex-1 pr-2">
            <Text className="font-bold text-sm truncate w-full" title={item.nom}>
              {item.nom}
            </Text>
            {isRecette && (
              <div className="mt-0.5 mb-0.5">
                <Badge
                  variant={typeBadgeVariant}
                  className="text-[9px] px-1.5 py-0 uppercase tracking-wider w-fit"
                >
                  {typeLabel}
                </Badge>
              </div>
            )}
            {item.date && (
              <Text className="text-xs text-text-muted truncate mt-1">
                {formatDateFr(item.date)}
              </Text>
            )}
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <Text className="font-bold text-sm">{formatMontant(item.montant)}</Text>
            {isRecette && (
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={isEnAttente ? "yellow" : "green"}
                  className="text-[10px] px-2 py-0 text-center whitespace-nowrap"
                >
                  {isEnAttente ? "En attente" : "Payé"}
                </Badge>
                {isEnAttente && onValider && (
                  <Tooltip label="Valider" delayDuration={0}>
                    <button
                      onClick={(e) => onValider(item.id, e)}
                      className="text-green-600 hover:bg-green-50 p-1 rounded-full bg-white border border-gray-100 shadow-sm cursor-pointer transition-colors"
                      title="Valider"
                    >
                      <FaCheck size={10} />
                    </button>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Tooltip>
  );
}
