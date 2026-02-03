/**
 * Formate une durée en minutes vers un format lisible.
 * Utile pour afficher la durée d'un spectacle ou d'une répétition.
 */
export function formatDuree(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const heures = Math.floor(minutes / 60);
  const reste = minutes % 60;

  if (reste === 0) {
    return `${heures}h`;
  }

  return `${heures}h${reste.toString().padStart(2, "0")}`;
}
