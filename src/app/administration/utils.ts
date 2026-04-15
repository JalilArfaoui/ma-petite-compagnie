// administration/utils.ts : fichier contenant des fonctions utilitaires
// pour la section administration

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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(montant));

  if (showSign) {
    return montant >= 0 ? `+${formatted}` : `-${formatted}`;
  }
  return montant < 0 ? `-${formatted}` : formatted;
};
