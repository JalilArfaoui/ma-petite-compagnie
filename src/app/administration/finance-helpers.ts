/**
 * Helpers partagés entre le dashboard (RecettesSection/DepensesSection)
 * et les pages complètes (RecettesClient/DepensesClient).
 *
 * Centralise la logique de transformation DonneesAjoutFinancier → objet local
 * et la construction des payloads pour les server actions.
 */

import { DonneesAjoutFinancier } from "./modals";
import { Recette, Depense } from "./components/types";
import { OperationFormData } from "./finance-actions";

// ─── Builders : DonneesAjoutFinancier → objet local ───

export function buildRecetteLocale(data: DonneesAjoutFinancier): Recette {
  return {
    id: data.id?.toString() ?? `r-temp-${Date.now()}`,
    nom: data.nom,
    montant: data.montant,
    date: data.date,
    type: data.type ?? "facture",
    statut: data.statut ?? "en_attente",
    spectacles: data.spectacles || [],
    fichier: data.fichier,
  };
}

export function buildDepenseLocale(data: DonneesAjoutFinancier): Depense {
  return {
    id: data.id?.toString() ?? `d-temp-${Date.now()}`,
    nom: data.nom,
    montant: data.montant,
    date: data.date,
    spectacles: data.spectacles || [],
    fichier: data.fichier,
  };
}

// ─── Payloads : DonneesAjoutFinancier → OperationFormData (pour les server actions) ───

export function buildRecettePayload(data: DonneesAjoutFinancier, id?: number): OperationFormData {
  return {
    ...(id ? { id } : {}),
    nom: data.nom,
    montant: data.montant,
    date: data.date,
    type: "RECETTE",
    categorie: data.type ?? "facture",
    statut: data.statut ?? "en_attente",
    spectacles: data.spectacles,
    fichier: data.fichier,
  };
}

export function buildDepensePayload(data: DonneesAjoutFinancier, id?: number): OperationFormData {
  return {
    ...(id ? { id } : {}),
    nom: data.nom,
    montant: data.montant,
    date: data.date,
    type: "DEPENSE",
    statut: "paye",
    spectacles: data.spectacles,
    fichier: data.fichier,
  };
}

export function getNouveauStatut(actuel: string): "paye" | "en_attente" {
  return actuel === "paye" ? "en_attente" : "paye";
}
