"use client";
import { useState } from "react";
import { Contact } from "@prisma/client";
import { Box, Button, Stack, Text, Textarea } from "@/components/ui";
import { toaster } from "@/components/ui/Toast/toaster";
import { annulerRelance, planifierRelance } from "../api/contact/contact";
import { IoAlarmOutline, IoCloseCircleOutline } from "react-icons/io5";

/**
 * Affiche un formulaire pour planifier ou annuler une relance sur un contact.
 */
export function RelanceForm({ contact }: { contact: Contact }) {
  const dateInitiale = contact.date_relance
    ? new Date(contact.date_relance).toISOString().substring(0, 10)
    : "";
  const [date, setDate] = useState(dateInitiale);
  const [note, setNote] = useState(contact.note_relance ?? "");
  const [chargement, setChargement] = useState(false);

  const estEnRetard =
    contact.date_relance && new Date(contact.date_relance) < new Date();

  async function sauvegarder() {
    if (!date) {
      toaster.create({ description: "Veuillez choisir une date.", type: "error" });
      return;
    }
    setChargement(true);
    const r = await planifierRelance(contact.id, new Date(date), note || null);
    if (r.succes) {
      toaster.create({ description: "Relance planifiée.", type: "success" });
    } else {
      toaster.create({ description: r.message, type: "error" });
    }
    setChargement(false);
  }

  async function annuler() {
    setChargement(true);
    const r = await annulerRelance(contact.id);
    if (r.succes) {
      setDate("");
      setNote("");
      toaster.create({ description: "Relance annulée.", type: "success" });
    } else {
      toaster.create({ description: r.message, type: "error" });
    }
    setChargement(false);
  }

  return (
    <Box className="p-3 border border-slate-200 rounded-lg bg-slate-50">
      <Stack direction="row" className="items-center mb-3 gap-2">
        <IoAlarmOutline className="w-5 h-5 text-amber-500" />
        <Text className="font-bold">Relance</Text>
        {estEnRetard && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
            En retard
          </span>
        )}
        {contact.date_relance && !estEnRetard && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
            Planifiée
          </span>
        )}
      </Stack>

      <Stack gap={2}>
        <Box>
          <Text className="text-xs text-slate-500 mb-1">Date de relance</Text>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().substring(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 w-full rounded-md border border-slate-300 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
          />
        </Box>
        <Box>
          <Text className="text-xs text-slate-500 mb-1">Note (optionnel)</Text>
          <Textarea
            placeholder="Ex : Rappeler pour le contrat de cession..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-16 text-sm"
          />
        </Box>

        <Stack direction="row" gap={2}>
          <Button
            type="button"
            size="sm"
            onClick={sauvegarder}
            disabled={chargement}
          >
            {chargement ? "..." : "Planifier"}
          </Button>
          {contact.date_relance && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={annuler}
              disabled={chargement}
            >
              <IoCloseCircleOutline className="w-4 h-4 mr-1" />
              Annuler la relance
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
