"use client";

import { EvenementBuiltInt } from "../../calendar/calendar";

type EventDetailsPopupProps = {
  event: EvenementBuiltInt;
  top: number;
  left: number;
  theme: {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    accentColor: string;
  };
  onClose: () => void;
};

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getDurationLabel = (start: number, end: number) => {
  const totalMinutes = Math.max(Math.round((end - start) / 60000), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}min`;
};

export default function EventDetailsPopup({ event, top, left, theme, onClose }: EventDetailsPopupProps) {
  return (
    <div
      className="event-details-popup"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        backgroundColor: theme.backgroundColor,
        borderColor: theme.borderColor,
        color: theme.textColor,
      }}
      role="dialog"
      aria-label="Details de l'evenement"
    >
      <span className="event-details-popup-accent" style={{ backgroundColor: theme.accentColor }} />
      <button type="button" className="event-details-popup-close" onClick={onClose} aria-label="Fermer">
        ×
      </button>
      <p className="event-details-popup-title">{event.nom}</p>
      <div className="event-details-popup-row">
        <span className="event-details-popup-label">Debut</span>
        <span>{formatDate(event.dateDebut)}</span>
      </div>
      <div className="event-details-popup-row">
        <span className="event-details-popup-label">Fin</span>
        <span>{formatDate(event.dateFin)}</span>
      </div>
      <div className="event-details-popup-row">
        <span className="event-details-popup-label">Duree</span>
        <span>{getDurationLabel(event.dateDebut, event.dateFin)}</span>
      </div>
      <div className="event-details-popup-row">
        <span className="event-details-popup-label">Compagnie</span>
        <span>#{event.compagnieId}</span>
      </div>
      <div className="event-details-popup-row">
        <span className="event-details-popup-label">Lieu</span>
        <span>#{event.lieuId}</span>
      </div>
      <div className="event-details-popup-row">
        <span className="event-details-popup-label">Categorie</span>
        <span>#{event.categorieId}</span>
      </div>
    </div>
  );
}
