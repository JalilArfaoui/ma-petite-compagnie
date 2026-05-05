"use client";
import { Tag } from "@prisma/client";
import { IoClose } from "react-icons/io5";

/**
 * Affiche un tag sous forme de pastille colorée.
 * Si onRetirer est fourni, un bouton × apparaît pour retirer le tag.
 */
export function TagBadge({
  tag,
  onRetirer,
}: {
  tag: Tag;
  onRetirer?: (tag: Tag) => void;
}) {
  // Calcul d'une couleur de texte lisible selon la couleur de fond
  const couleurTexte = couleurLisible(tag.couleur);

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: tag.couleur, color: couleurTexte }}
    >
      {tag.nom}
      {onRetirer && (
        <button
          type="button"
          onClick={() => onRetirer(tag)}
          className="ml-0.5 rounded-full hover:opacity-70 transition-opacity"
          aria-label={`Retirer le tag ${tag.nom}`}
        >
          <IoClose className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

/** Retourne noir ou blanc selon la luminosité de la couleur hex. */
function couleurLisible(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  // Luminance relative WCAG
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1e293b" : "#ffffff";
}
