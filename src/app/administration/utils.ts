import { type BadgeProps } from "@/components/ui";

/**
 * Formate une date ISO (YYYY-MM-DD) en format lisible : "le 27 janvier 2026".
 * @param dateStr La date au format ISO.
 * @returns La date formatée en français.
 */
export const formatDateFr = (dateStr: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const [year, month, day] = dateStr.split("-");
  const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
  return `le ${date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}`;
};

/**
 * Formate un montant numérique en euros avec le symbole devise.
 * @param montant Le montant à formater.
 * @param showSign Si vrai, force l'affichage du signe "+" pour les montants positifs.
 * @returns Le montant formaté (ex: "750 €" ou "+2 300 €").
 */
export const formatMontant = (montant: number, showSign: boolean = false) => {
  const formatted = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.abs(montant));

  if (showSign) {
    return montant >= 0 ? `+${formatted}` : `-${formatted}`;
  }
  return montant < 0 ? `-${formatted}` : formatted;
};

/**
 * Transforme un identifiant de statut technique en libellé lisible.
 * @param statut La clé du statut (ex: "non_paye").
 * @returns Le texte à afficher (ex: "Non payé").
 */
export const formatStatut = (statut: string) => {
  switch (statut) {
    case "recue":
      return "Reçue";
    case "recu":
      return "Reçu";
    case "paye":
      return "Payé";
    case "non_paye":
      return "Non payé";
    case "en_attente":
      return "En attente";
    default:
      return statut;
  }
};

/**
 * Détermine la couleur du badge en fonction du statut.
 * @param statut Le statut technique.
 * @returns La variante de couleur pour le composant Badge.
 */
export const getCouleurStatut = (statut: string): BadgeProps["variant"] => {
  switch (statut) {
    case "recue":
    case "recu":
    case "paye":
      return "green";
    case "non_paye":
      return "red";
    case "en_attente":
      return "yellow";
    default:
      return "gray";
  }
};
