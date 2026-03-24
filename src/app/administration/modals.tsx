"use client";

import { useState } from "react";
import { Modal, Button, Select, Badge, Radio, RadioGroup, Switch, Text } from "@/components/ui";
import { FaPlus, FaTimes } from "react-icons/fa";
import { LISTE_SPECTACLES } from "./test_data";

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
  const [spectacles, setSpectacles] = useState<string[]>([]);
  
  // Champs spécifiques aux Recettes
  const [typeRecette, setTypeRecette] = useState<"facture" | "financement">("facture");
  const [estPaye, setEstPaye] = useState(false);

  const handleAddSpectacle = (val: string) => {
    if (!spectacles.includes(val)) {
      setSpectacles([...spectacles, val]);
    }
  };

  const handleRemoveSpectacle = (val: string) => {
    setSpectacles(spectacles.filter(s => s !== val));
  };

  const handleSubmit = () => {
    if (!nom || !montant) return;
    
    const payload: any = { 
      nom, 
      montant: Number(montant),
      spectacles: spectacles
    };

    if (typeSection === "Recette") {
      payload.type = typeRecette;
      payload.statut = estPaye ? "paye" : "en_attente";
    }

    onAdd(payload);
    
    // Reset
    setOpen(false);
    setNom("");
    setMontant("");
    setSpectacles([]);
    setTypeRecette("facture");
    setEstPaye(false);
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
      <Modal.Content size="md">
        <Modal.Header>
          <Modal.Title>Ajouter une {typeSection.toLowerCase()}</Modal.Title>
          <Modal.Description>
            Remplissez les informations ci-dessous.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body className="flex flex-col gap-5 pt-2">
          {/* Libellé & Montant */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Libellé</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Facture #123"
                className="border border-gray-200 rounded-[12px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-10 transition-all font-serif"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Montant (€)</label>
              <input
                type="number"
                step="0.01"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="0.00"
                className="border border-gray-200 rounded-[12px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-10 transition-all font-serif"
              />
            </div>
          </div>

          {/* Type & Statut (Uniquement Recettes) */}
          {typeSection === "Recette" && (
            <div className="flex items-end justify-between gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-gray-700">Type de recette</label>
                <RadioGroup className="flex-row gap-6">
                  <Radio 
                    name="typeRecette" 
                    value="facture" 
                    checked={typeRecette === "facture"}
                    onChange={() => setTypeRecette("facture")}
                  >
                    Facture
                  </Radio>
                  <Radio 
                    name="typeRecette" 
                    value="financement"
                    checked={typeRecette === "financement"}
                    onChange={() => setTypeRecette("financement")}
                  >
                    Subvention
                  </Radio>
                </RadioGroup>
              </div>
              
              <div className="flex items-center gap-3 pb-1">
                <Text className="text-sm font-semibold text-gray-700">Déjà payé ?</Text>
                <Switch 
                  checked={estPaye}
                  onChange={(e) => setEstPaye(e.target.checked)}
                />
              </div>
            </div>
          )}

          {/* Spectacles (Multi-select simulation) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Spectacles rattachés</label>
            <Select onValueChange={handleAddSpectacle}>
              <Select.Trigger className="rounded-[12px] h-10 border-gray-200 font-serif">
                <Select.Value placeholder="Sélectionner un spectacle..." />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {LISTE_SPECTACLES.filter(s => !spectacles.includes(s)).map(s => (
                    <Select.Item key={s} value={s}>{s}</Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select>

            {/* Liste des badges spectacles */}
            <div className="flex flex-wrap gap-2 mt-1">
              {spectacles.map(s => (
                <Badge key={s} variant="purple" className="flex items-center gap-1.5 py-1 px-2.5 normal-case font-medium">
                  {s}
                  <button 
                    onClick={() => handleRemoveSpectacle(s)}
                    className="hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <FaTimes size={10} />
                  </button>
                </Badge>
              ))}
              {spectacles.length === 0 && (
                <Text className="text-xs text-text-muted italic">Aucun spectacle sélectionné.</Text>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-t pt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button variant="solid" onClick={handleSubmit} disabled={!nom || !montant}>
            Ajouter {typeSection === "Recette" ? "la recette" : "la dépense"}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
