"use client";
import { useEffect, useState } from "react";
import { TypeEchange } from "@prisma/client";
import { Box, Button, Stack, Text, Textarea } from "@/components/ui";
import { toaster } from "@/components/ui/Toast/toaster";
import {
  ajouterEchange,
  listerEchanges,
  supprimerEchange,
  EchangeInformation,
} from "../api/echange/echange";
import {
  IoChatbubbleOutline,
  IoCallOutline,
  IoMailOutline,
  IoPeopleOutline,
  IoDocumentOutline,
  IoTrashOutline,
} from "react-icons/io5";

type Echange = {
  id: number;
  contactId: number;
  type: TypeEchange;
  description: string;
  date: Date;
};

const ICONES_TYPE: Record<TypeEchange, React.ReactNode> = {
  EMAIL: <IoMailOutline className="w-4 h-4" />,
  APPEL: <IoCallOutline className="w-4 h-4" />,
  RENCONTRE: <IoPeopleOutline className="w-4 h-4" />,
  COURRIER: <IoDocumentOutline className="w-4 h-4" />,
  AUTRE: <IoChatbubbleOutline className="w-4 h-4" />,
};

const LABELS_TYPE: Record<TypeEchange, string> = {
  EMAIL: "E-mail",
  APPEL: "Appel",
  RENCONTRE: "Rencontre",
  COURRIER: "Courrier",
  AUTRE: "Autre",
};

/**
 * Affiche l'historique des échanges d'un contact et permet d'en ajouter.
 */
export function HistoriqueEchanges({ contactId }: { contactId: number }) {
  const [echanges, setEchanges] = useState<Echange[]>([]);
  const [chargement, setChargement] = useState(true);
  const [type, setType] = useState<TypeEchange>("APPEL");
  const [description, setDescription] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function charger() {
    const r = await listerEchanges(contactId);
    if (r.succes && r.donnee) {
      setEchanges(r.donnee as Echange[]);
    }
    setChargement(false);
  }

  useEffect(() => {
    charger();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  async function ajouter() {
    if (!description.trim()) {
      toaster.create({ description: "La description ne peut pas être vide.", type: "error" });
      return;
    }
    setEnvoi(true);
    const info: EchangeInformation = { contactId, type, description: description.trim() };
    const r = await ajouterEchange(info);
    if (r.succes) {
      setDescription("");
      await charger();
      toaster.create({ description: "Échange ajouté.", type: "success" });
    } else {
      toaster.create({ description: r.message, type: "error" });
    }
    setEnvoi(false);
  }

  async function supprimer(id: number) {
    const r = await supprimerEchange(id);
    if (r.succes) {
      setEchanges((prev) => prev.filter((e) => e.id !== id));
    } else {
      toaster.create({ description: r.message, type: "error" });
    }
  }

  return (
    <Box>
      <Stack direction="row" gap={2} className="items-center mb-3">
        <IoChatbubbleOutline className="w-5 h-5 text-slate-500" />
        <Text className="font-bold">Historique des échanges</Text>
      </Stack>

      {/* Formulaire d'ajout */}
      <Box className="p-3 border border-slate-200 rounded-lg bg-slate-50 mb-4">
        <Text className="text-xs text-slate-500 mb-2">Ajouter un échange</Text>
        <Stack gap={2}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TypeEchange)}
            className="h-9 rounded-md border border-slate-300 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 bg-white"
          >
            {(Object.keys(LABELS_TYPE) as TypeEchange[]).map((t) => (
              <option key={t} value={t}>
                {LABELS_TYPE[t]}
              </option>
            ))}
          </select>
          <Textarea
            placeholder="Description de l'échange..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-16 text-sm"
          />
          <Button type="button" size="sm" onClick={ajouter} disabled={envoi}>
            {envoi ? "..." : "Ajouter"}
          </Button>
        </Stack>
      </Box>

      {/* Liste des échanges */}
      {chargement ? (
        <Text className="text-slate-400 italic text-sm">Chargement...</Text>
      ) : echanges.length === 0 ? (
        <Text className="text-slate-400 italic text-sm">Aucun échange enregistré.</Text>
      ) : (
        <Stack gap={2}>
          {echanges.map((e) => (
            <Box
              key={e.id}
              className="flex gap-3 items-start p-3 rounded-lg border border-slate-100 bg-white"
            >
              <Box className="flex-shrink-0 mt-0.5 text-slate-400">
                {ICONES_TYPE[e.type]}
              </Box>
              <Box className="flex-1 min-w-0">
                <Stack direction="row" justify="between" className="flex-wrap gap-1">
                  <Text className="text-xs font-semibold text-slate-600">
                    {LABELS_TYPE[e.type]}
                  </Text>
                  <Text className="text-xs text-slate-400">
                    {new Date(e.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </Stack>
                <Text className="text-sm text-slate-700 mt-0.5 whitespace-pre-wrap">
                  {e.description}
                </Text>
              </Box>
              <button
                type="button"
                onClick={() => supprimer(e.id)}
                className="flex-shrink-0 text-slate-300 hover:text-red-400 transition-colors"
                aria-label="Supprimer cet échange"
              >
                <IoTrashOutline className="w-4 h-4" />
              </button>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
