"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Container,
  Heading,
  Modal,
  Stack,
  Text,
  Toaster,
  toaster,
} from "@/components/ui";
import { ModalAjoutRapide, DonneesAjoutFinancier } from "../modals";
import { RECETTES_DATA, SPECTACLES_DATA } from "../test_data";
import { formatMontant } from "../utils";
import { ItemFinancierCard, NoteInfo, BoutonRetourAdministration } from "../components/shared";
import { Recette } from "../components/types";
import { useGestionFinanciere } from "../hooks/useGestionFinanciere";

export default function RecettesPage() {
  const {
    items: recettes,
    setItems: setRecettes,
    itemsTries: recettesTriees,
    total: totalRecettes,
    itemEnEdition: recetteEnEdition,
    setItemEnEdition: setRecetteEnEdition,
    itemASupprimer: recetteASupprimer,
    setItemASupprimer: setRecetteASupprimer,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useGestionFinanciere<Recette>(RECETTES_DATA, "recette");

  const [showFactures, setShowFactures] = useState(true);
  const [showSubventions, setShowSubventions] = useState(true);

  const nomsSpectacles = SPECTACLES_DATA.map((s) => s.nom);

  const recettesFiltrees = useMemo(() => {
    return recettesTriees.filter((r) => (r.type === "facture" ? showFactures : showSubventions));
  }, [recettesTriees, showFactures, showSubventions]);

  const handleAddRecette = (data: DonneesAjoutFinancier) => {
    handleAdd(data, (d) => ({
      id: `r-temp-${Date.now()}`,
      nom: d.nom,
      montant: d.montant,
      date: d.date,
      type: d.type ?? "facture",
      statut: d.statut ?? "en_attente",
      spectacles: d.spectacles || [],
      fichier: d.fichier,
    }));
  };

  const handleEditRecette = (data: DonneesAjoutFinancier) => {
    handleEdit(data, (d) => ({
      id: d.id as string,
      nom: d.nom,
      montant: d.montant,
      date: d.date,
      spectacles: d.spectacles || [],
      fichier: d.fichier,
      type: d.type ?? "facture",
      statut: d.statut ?? "en_attente",
    }));
  };

  const validerRecette = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecettes((prev) => prev.map((r) => (r.id === id ? { ...r, statut: "paye" } : r)));
    toaster.success({
      title: "Recette validée",
      description: "Le statut a été mis à jour avec succès.",
    });
  };

  return (
    <div className="min-h-screen bg-[#fffbef] font-sans pb-20 relative">
      <Toaster />
      <Container maxW="max-w-6xl" className="mx-auto pt-16 px-4">
        <BoutonRetourAdministration />
        <Stack className="mb-8">
          <Heading as="h3" className="text-primary mb-2">
            Recettes
          </Heading>
          <Heading as="h4" className="text-gray-900 italic font-serif text-3xl">
            Vue complète des recettes
          </Heading>
          <Text className="text-gray-600 text-xl mt-2">
            Total actuel : {formatMontant(totalRecettes)}
          </Text>
        </Stack>

        <Card className="bg-white">
          <div className="flex justify-between items-start md:items-center mb-5 mt-[-10px] md:mt-0 gap-2">
            <h3 className="text-[1.25rem] md:text-[1.5rem] font-bold font-serif leading-tight tracking-tight pr-2">
              Toutes les recettes
            </h3>
            <div className="flex-shrink-0">
              <ModalAjoutRapide
                typeSection="Recette"
                onSubmit={handleAddRecette}
                spectacles={nomsSpectacles}
              />
            </div>
          </div>

          <NoteInfo className="mb-6">
            Note : ces montants incluent les recettes en attente (vision prévisionnelle).
          </NoteInfo>

          <div className="flex items-center gap-6 mb-6 px-1">
            <Checkbox checked={showFactures} onChange={(e) => setShowFactures(e.target.checked)}>
              Factures
            </Checkbox>
            <Checkbox
              checked={showSubventions}
              onChange={(e) => setShowSubventions(e.target.checked)}
            >
              Subventions
            </Checkbox>
          </div>

          <div className="flex flex-col gap-3">
            {recettesFiltrees.map((item) => (
              <ItemFinancierCard
                key={item.id}
                item={item}
                showSpectaclesInline={true}
                onValider={validerRecette}
                onEdit={
                  item.type === "facture"
                    ? undefined
                    : (id, e) => {
                        e.stopPropagation();
                        const cible = recettes.find((r) => r.id === id);
                        if (!cible) return;
                        setRecetteEnEdition(cible);
                      }
                }
                onDelete={(id, e) => {
                  e.stopPropagation();
                  const cible = recettes.find((r) => r.id === id);
                  if (!cible) return;
                  setRecetteASupprimer(cible);
                }}
              />
            ))}
            {recettesFiltrees.length === 0 && (
              <div className="text-sm text-center py-4 text-text-muted italic">
                Aucune recette ne correspond à votre sélection.
              </div>
            )}
          </div>
        </Card>
      </Container>

      {recetteEnEdition && (
        <ModalAjoutRapide
          key={recetteEnEdition.id}
          typeSection="Recette"
          mode="edit"
          hideTrigger
          open
          onOpenChange={(val) => {
            if (!val) setRecetteEnEdition(null);
          }}
          initialData={{
            id: recetteEnEdition.id,
            nom: recetteEnEdition.nom,
            montant: recetteEnEdition.montant,
            date: recetteEnEdition.date || new Date().toISOString().split("T")[0],
            spectacles: recetteEnEdition.spectacles || [],
            fichier: recetteEnEdition.fichier,
            type: recetteEnEdition.type,
            statut: recetteEnEdition.statut,
          }}
          onSubmit={handleEditRecette}
          spectacles={nomsSpectacles}
        />
      )}

      <Modal
        open={!!recetteASupprimer}
        onOpenChange={(val) => {
          if (!val) setRecetteASupprimer(null);
        }}
      >
        <Modal.Content size="sm">
          <Modal.Header>
            <Modal.Title>Supprimer la recette ?</Modal.Title>
            <Modal.Description>
              {recetteASupprimer
                ? `Cette action supprimera définitivement "${recetteASupprimer.nom}".`
                : "Cette action est irréversible."}
            </Modal.Description>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setRecetteASupprimer(null)}>
              Annuler
            </Button>
            <Button variant="solid" className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}
