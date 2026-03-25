"use client";

import { useState } from "react";
import { Modal, Button, Select, Badge, Switch, Text, Input, Alert, Link } from "@/components/ui";
import { FaPlus, FaTimes, FaInfoCircle } from "react-icons/fa";
import { LISTE_SPECTACLES } from "./test_data";

// Modal pour ajout rapide -> fake pour le moment (non connecté à la bdd)
export function ModalAjoutRapide({
  typeSection,
  onAdd,
}: {
  typeSection: "Recette" | "Dépense";
  onAdd: (data: any) => void;
}) {
  const [open, setOpen] = useState(false);

  // Champs communs
  const [nom, setNom] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [fichier, setFichier] = useState<string>("");
  const [spectacles, setSpectacles] = useState<string[]>([]);

  // Champs spécifiques aux Recettes
  const [typeRecette, setTypeRecette] = useState<"facture" | "financement">("financement"); // subvention par défaut
  const [estPaye, setEstPaye] = useState(false);

  const handleAddSpectacle = (val: string) => {
    if (!spectacles.includes(val)) {
      setSpectacles([...spectacles, val]);
    }
  };

  const handleRemoveSpectacle = (val: string) => {
    setSpectacles(spectacles.filter((s) => s !== val));
  };

  const handleSubmit = () => {
    if (!nom || !montant || !date) return;

    const payload: any = {
      nom,
      montant: Number(montant),
      date,
      spectacles: spectacles,
    };

    if (fichier) {
      payload.fichier = fichier;
    }

    if (typeSection === "Recette") {
      payload.type = typeRecette;
      payload.statut = estPaye ? "paye" : "en_attente";
    }

    onAdd(payload);

    // Reset
    setOpen(false);
    setNom("");
    setMontant("");
    setDate(new Date().toISOString().split("T")[0]);
    setFichier("");
    setSpectacles([]);
    setTypeRecette("financement");
    setEstPaye(false);
  };

  const resetAndClose = () => {
    setOpen(false);
    // reset
    setNom("");
    setMontant("");
    setDate(new Date().toISOString().split("T")[0]);
    setFichier("");
    setSpectacles([]);
    setTypeRecette("financement");
    setEstPaye(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(val) => {
        if (!val) resetAndClose();
        else setOpen(true);
      }}
    >
      <Modal.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer"
        >
          <FaPlus size={12} className="text-slate-600" />
        </Button>
      </Modal.Trigger>
      <Modal.Content size="lg">
        <Modal.Header>
          <Modal.Title>Ajouter une {typeSection.toLowerCase()}</Modal.Title>
          <Modal.Description>
            {typeSection === "Recette"
              ? "Saisissez les informations de la nouvelle recette."
              : "Remplissez les informations de votre dépense."}
          </Modal.Description>
        </Modal.Header>
        <Modal.Body className="flex flex-col gap-6 pt-2 max-h-[75vh] overflow-y-auto">
          {/* tabs pour Recette (Subvention/Facture) */}
          {typeSection === "Recette" && (
            <div className="flex flex-col gap-3">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setTypeRecette("financement")}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                    typeRecette === "financement"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Subvention
                </button>
                <button
                  type="button"
                  onClick={() => setTypeRecette("facture")}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                    typeRecette === "facture"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Facture
                </button>
              </div>

              {typeRecette === "facture" && (
                // Avertissement qu'il existe un générateur fourni par le site pour générer des factures
                <Alert status="warning" className="text-xs">
                  <Alert.Icon>
                    <FaInfoCircle className="h-4 w-4" />
                  </Alert.Icon>
                  <Alert.Title>À savoir sur les factures :</Alert.Title>
                  <Alert.Description>
                    L'outil intègre un générateur de factures automatisé. Toute facture créée via ce
                    générateur sera <strong>automatiquement</strong> comptabilisée ici.
                    <div className="mt-3 flex flex-col gap-2">
                      <p>
                        N'utilisez ce formulaire d'ajout manuel que si vous avez émis une facture en
                        dehors notre système.
                      </p>
                      <Link
                        href="#"
                        className="text-yellow-800 font-bold underline flex items-center gap-1 w-fit"
                      >
                        Créer une facture avec l'outil intégré en cliquant ici
                      </Link>
                    </div>
                  </Alert.Description>
                </Alert>
              )}
            </div>
          )}

          {/* 1. Libellé & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Libellé</label>
              <Input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder={
                  typeSection === "Recette" && typeRecette === "financement"
                    ? "Ex: Aide Région"
                    : "Ex: Matériel décor"
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          {/* montant et pièce jointe */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Montant (€)</label>
              <Input
                type="number"
                step="0.01"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="flex flex-col gap-1.5 overflow-hidden">
              <label className="text-sm font-semibold text-gray-700 truncate">
                Pièce jointe <span className="text-gray-400 font-normal">(facultatif)</span>
              </label>
              <input
                type="file"
                onChange={(e) => setFichier(e.target.files?.[0]?.name || "")}
                className="text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer h-10 font-serif"
              />
            </div>
          </div>

          {/* statut (uniquement pour recettes) */}
          {typeSection === "Recette" && (
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex flex-col">
                <Text className="text-sm font-semibold text-gray-700">Déjà payé ?</Text>
                <div className="text-[10px] text-gray-500">
                  {estPaye ? "L'argent a été encaissé" : "L'argent est en attente"}
                </div>
              </div>
              <Switch checked={estPaye} onChange={(e) => setEstPaye(e.target.checked)} />
            </div>
          )}

          {/* spectacles (sélections multiples) */}
          <div className="flex flex-col gap-2 mt-[-5px]">
            <label className="text-sm font-semibold text-gray-700">Spectacles rattachés</label>
            <Select onValueChange={handleAddSpectacle}>
              <Select.Trigger className="rounded-[12px] h-10 border-gray-200 font-serif">
                <Select.Value placeholder="Sélectionner un spectacle..." />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {LISTE_SPECTACLES.filter((s) => !spectacles.includes(s)).map((s) => (
                    <Select.Item key={s} value={s}>
                      {s}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select>

            {/* Liste des badges spectacles (pour la sélection multiple) */}
            <div className="flex flex-wrap gap-2 mt-1">
              {spectacles.map((s) => (
                <Badge
                  key={s}
                  variant="purple"
                  className="flex items-center gap-1.5 py-1 px-2.5 normal-case font-medium"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSpectacle(s)}
                    className="hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <FaTimes size={10} />
                  </button>
                </Badge>
              ))}
              {spectacles.length === 0 && (
                <Text className="text-[11px] text-text-muted italic">
                  Aucun spectacle sélectionné.
                </Text>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="pt-4">
          <Button variant="ghost" onClick={resetAndClose}>
            Annuler
          </Button>
          <Button variant="solid" onClick={handleSubmit} disabled={!nom || !montant || !date}>
            Ajouter {typeSection === "Recette" ? "la recette" : "la dépense"}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
