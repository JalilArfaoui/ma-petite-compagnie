"use client";
import { useEffect, useState } from "react";
import { Tag } from "@prisma/client";
import { Box, Button, Input, Stack, Text } from "@/components/ui";
import { toaster } from "@/components/ui/Toast/toaster";
import {
  ajouterTagAuContact,
  creerTag,
  listerTags,
  retirerTagDuContact,
} from "../api/tag/tag";
import { TagBadge } from "./TagBadge";

const COULEURS_PRESET = [
  "#6366f1", // indigo
  "#ec4899", // rose
  "#10b981", // emerald
  "#f59e0b", // amber
  "#3b82f6", // blue
  "#ef4444", // red
  "#8b5cf6", // violet
  "#14b8a6", // teal
];

/**
 * Sélecteur de tags pour une fiche contact.
 * Affiche les tags actifs du contact et permet d'en ajouter/retirer/créer.
 */
export function TagSelector({
  contactId,
  tagsInitiaux,
}: {
  contactId: number;
  tagsInitiaux: Tag[];
}) {
  const [tousLesTags, setTousLesTags] = useState<Tag[]>([]);
  const [tagsContact, setTagsContact] = useState<Tag[]>(tagsInitiaux);
  const [ouvert, setOuvert] = useState(false);
  const [nouveauNom, setNouveauNom] = useState("");
  const [nouvelleCouleur, setNouvelleCouleur] = useState(COULEURS_PRESET[0]);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    listerTags().then((r) => {
      if (r.succes && r.donnee) setTousLesTags(r.donnee);
    });
  }, []);

  const tagsDisponibles = tousLesTags.filter(
    (t) => !tagsContact.some((tc) => tc.id === t.id)
  );

  async function ajouterTag(tag: Tag) {
    const r = await ajouterTagAuContact(contactId, tag.id);
    if (r.succes) {
      setTagsContact((prev) => [...prev, tag]);
    } else {
      toaster.create({ description: r.message, type: "error" });
    }
  }

  async function retirerTag(tag: Tag) {
    const r = await retirerTagDuContact(contactId, tag.id);
    if (r.succes) {
      setTagsContact((prev) => prev.filter((t) => t.id !== tag.id));
    } else {
      toaster.create({ description: r.message, type: "error" });
    }
  }

  async function creerEtAjouter() {
    if (!nouveauNom.trim()) return;
    setChargement(true);
    const r = await creerTag({ nom: nouveauNom.trim(), couleur: nouvelleCouleur });
    if (r.succes && r.donnee) {
      setTousLesTags((prev) => [...prev, r.donnee!]);
      await ajouterTag(r.donnee);
      setNouveauNom("");
    } else {
      toaster.create({ description: r.message, type: "error" });
    }
    setChargement(false);
  }

  return (
    <Box>
      <Text className="font-bold mb-1">Tags :</Text>

      {/* Tags actifs du contact */}
      <Stack direction="row" gap={1} className="flex-wrap mb-2 min-h-6">
        {tagsContact.length === 0 && (
          <Text className="text-slate-400 text-sm italic">Aucun tag</Text>
        )}
        {tagsContact.map((tag) => (
          <TagBadge key={tag.id} tag={tag} onRetirer={retirerTag} />
        ))}
      </Stack>

      {/* Bouton pour ouvrir le panneau */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOuvert((v) => !v)}
      >
        {ouvert ? "Fermer" : "+ Gérer les tags"}
      </Button>

      {ouvert && (
        <Box className="mt-2 border border-slate-200 rounded-lg p-3 bg-slate-50 shadow-sm">
          {/* Tags disponibles à ajouter */}
          {tagsDisponibles.length > 0 && (
            <Box className="mb-3">
              <Text className="text-xs text-slate-500 mb-1">Ajouter un tag existant :</Text>
              <Stack direction="row" gap={1} className="flex-wrap">
                {tagsDisponibles.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => ajouterTag(tag)}
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold border-2 border-dashed border-slate-300 hover:border-slate-500 transition-colors"
                    style={{ color: tag.couleur }}
                  >
                    + {tag.nom}
                  </button>
                ))}
              </Stack>
            </Box>
          )}

          {/* Créer un nouveau tag */}
          <Box>
            <Text className="text-xs text-slate-500 mb-1">Créer un nouveau tag :</Text>
            <Stack direction="row" gap={2} className="items-center flex-wrap">
              <Input
                placeholder="Nom du tag"
                value={nouveauNom}
                onChange={(e) => setNouveauNom(e.target.value)}
                className="h-8 text-sm max-w-40"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); creerEtAjouter(); } }}
              />
              {/* Sélecteur couleur preset */}
              <Stack direction="row" gap={1} className="flex-wrap">
                {COULEURS_PRESET.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNouvelleCouleur(c)}
                    className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c,
                      borderColor: nouvelleCouleur === c ? "#1e293b" : "transparent",
                    }}
                    aria-label={`Couleur ${c}`}
                  />
                ))}
              </Stack>
              <Button
                type="button"
                size="sm"
                onClick={creerEtAjouter}
                disabled={!nouveauNom.trim() || chargement}
              >
                {chargement ? "..." : "Créer"}
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
