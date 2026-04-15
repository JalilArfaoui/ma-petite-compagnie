"use client";

import { Text, Badge, Tooltip, Card, Link, Alert, Button } from "@/components/ui";
import { FaArrowLeft, FaCheck, FaInfoCircle, FaPen, FaTrash } from "react-icons/fa";
import { formatDateFr, formatMontant } from "../utils";
import { Recette, Depense } from "./types";

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

export function BoutonRetourAdministration() {
  return (
    <Link href="/administration" className="block w-fit mb-8 group">
      <Button
        variant="solid"
        size="sm"
        className="rounded-full px-4 py-2 hover:scale-105 transition-transform shadow-sm"
        icon={<FaArrowLeft size={14} />}
      >
        Administration
      </Button>
    </Link>
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
export function VoirToutLink({ href, label = "Voir tout" }: { href: string; label?: string }) {
  return (
    <div className="text-center mt-4">
      <Link href={href} className="text-sm font-semibold">
        {label}
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
    <div
      className={`h-3 w-full max-w-[192px] rounded-sm overflow-hidden ${bgColorSecondaire} relative`}
    >
      <div className={`h-full ${bgColorPrincipal}`} style={{ width: `${pourcentage}%` }}></div>
    </div>
  );
}

// Fonction guard permettant de déduire automatiquement si l'item est une Recette
function isRecetteType(item: Recette | Depense): item is Recette {
  return "statut" in item;
}

export function ItemFinancierCard({
  item,
  onValider,
  onEdit,
  onDelete,
  showSpectaclesInline = false,
}: {
  item: Recette | Depense;
  onValider?: (id: string, e: React.MouseEvent) => void;
  onEdit?: (id: string, e: React.MouseEvent) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
  showSpectaclesInline?: boolean;
}) {
  const isRecette = isRecetteType(item);
  const recette = isRecette ? item : null;
  const isEnAttente = recette?.statut === "en_attente";

  const typeBadgeVariant = recette?.type === "facture" ? "purple" : "blue";
  const typeLabel =
    recette?.type === "facture" ? "Facture" : recette?.type === "financement" ? "Subvention" : "";

  return (
    <Card className="p-3 bg-white !gap-0 shadow-sm border border-gray-100 transition-all hover:shadow-md overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-2">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <Text className="font-bold text-sm truncate w-full" title={item.nom}>
              {item.nom}
            </Text>
            {isRecette && (
              <div className="mt-0.5">
                <Badge
                  variant={typeBadgeVariant}
                  className="text-[9px] px-1.5 py-0 uppercase tracking-wider w-fit"
                >
                  {typeLabel}
                </Badge>
              </div>
            )}
            {item.date && (
              <Text className="text-xs text-text-muted truncate mt-0.5">
                {formatDateFr(item.date)}
              </Text>
            )}
            {showSpectaclesInline && item.spectacles && item.spectacles.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {item.spectacles.map((s, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-[9px] px-1.5 py-0 bg-gray-50 text-gray-600 border-gray-200"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-gray-50 sm:border-none">
            <Text className="font-bold text-sm">{formatMontant(item.montant)}</Text>
            {isRecette && (
              <div className="flex items-center gap-2">
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
            {(onEdit || onDelete) && (
              <div className="flex items-center gap-2">
                {onEdit && (
                  <Tooltip label="Modifier" delayDuration={0}>
                    <button
                      onClick={(e) => onEdit(item.id, e)}
                      className="text-blue-700 hover:bg-blue-50 p-1 rounded-full bg-white border border-gray-100 shadow-sm cursor-pointer transition-colors"
                      title="Modifier"
                    >
                      <FaPen size={10} />
                    </button>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip label="Supprimer" delayDuration={0}>
                    <button
                      onClick={(e) => onDelete(item.id, e)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded-full bg-white border border-gray-100 shadow-sm cursor-pointer transition-colors"
                      title="Supprimer"
                    >
                      <FaTrash size={10} />
                    </button>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>
    </Card>
  );
}
