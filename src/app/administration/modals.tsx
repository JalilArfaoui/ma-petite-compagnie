"use client";

import { useState } from "react";
import { Modal, Button } from "@/components/ui";
import { FaPlus } from "react-icons/fa";

// Modal pour ajout rapide fake
export function ModalAjoutRapide({
  typeSection,
  onAdd,
}: {
  typeSection: "Recette" | "Dépense";
  onAdd: (data: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [montant, setMontant] = useState("");

  const handleSubmit = () => {
    if (!nom || !montant) return;
    onAdd({ nom, montant: Number(montant) });
    setOpen(false);
    setNom("");
    setMontant("");
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer"
        >
          <FaPlus size={12} className="text-slate-600" />
        </Button>
      </Modal.Trigger>
      <Modal.Content size="sm">
        <Modal.Header>
          <Modal.Title>Ajouter une {typeSection.toLowerCase()}</Modal.Title>
          <Modal.Description>
            Remplissez rapidement les informations pour simuler l'ajout.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Libellé</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex: Achat matériel"
              autoFocus
              className="border border-gray-200 rounded-[12px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Montant (€)</label>
            <input
              type="number"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              placeholder="Ex: 150"
              className="border border-gray-200 rounded-[12px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button variant="solid" onClick={handleSubmit}>
            Ajouter
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
