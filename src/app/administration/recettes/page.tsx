"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Container,
  Heading,
  Link,
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

export default function RecettesPage() {
  // TODO(BDD): remplacer cette source locale par une récupération serveur (API/DB).
  const [recettes, setRecettes] = useState<Recette[]>(RECETTES_DATA);
  const [showFactures, setShowFactures] = useState(true);
  const [showSubventions, setShowSubventions] = useState(true);
  const [recetteEnEdition, setRecetteEnEdition] = useState<Recette | null>(null);
  const [recetteASupprimer, setRecetteASupprimer] = useState<Recette | null>(null);

  const nomsSpectacles = SPECTACLES_DATA.map((s) => s.nom);
  const totalRecettes = recettes.reduce((acc, r) => acc + r.montant, 0);

  const recettesFiltrees = useMemo(() => {
    return [...recettes]
      .filter((r) => (r.type === "facture" ? showFactures : showSubventions))
      .sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime());
  }, [recettes, showFactures, showSubventions]);

  // TODO(BDD): brancher ce handler sur une mutation serveur.
  const handleAddRecette = (data: DonneesAjoutFinancier) => {
    const nouvelle: Recette = {
      id: `r-temp-${Date.now()}`,
      nom: data.nom,
      montant: data.montant,
      date: data.date,
      type: data.type ?? "facture",
      statut: data.statut ?? "en_attente",
      spectacles: data.spectacles || [],
      fichier: data.fichier,
    };

    setRecettes((prev) => [nouvelle, ...prev]);
    toaster.success({ title: "Recette ajoutée" });
  };

  // TODO(BDD): brancher ce handler sur une mutation serveur.
  const handleEditRecette = (data: DonneesAjoutFinancier) => {
    if (!data.id) return;

    setRecettes((prev) =>
      prev.map((r) =>
        r.id === data.id
          ? {
              ...r,
              nom: data.nom,
              montant: data.montant,
              date: data.date,
              spectacles: data.spectacles || [],
              fichier: data.fichier,
              type: data.type ?? "facture",
              statut: data.statut ?? "en_attente",
            }
          : r
      )
    );

    setRecetteEnEdition(null);
    toaster.success({ title: "Recette modifiée" });
  };

  // TODO(BDD): brancher ce handler sur une mutation serveur.
  const handleDeleteRecette = () => {
    if (!recetteASupprimer) return;
    setRecettes((prev) => prev.filter((r) => r.id !== recetteASupprimer.id));
    setRecetteASupprimer(null);
    toaster.success({ title: "Recette supprimée" });
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
                onAdd={handleAddRecette}
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
            <Checkbox checked={showSubventions} onChange={(e) => setShowSubventions(e.target.checked)}>
              Subventions
            </Checkbox>
          </div>

          <div className="flex flex-col gap-3">
            {recettesFiltrees.map((item) => (
              <ItemFinancierCard
                key={item.id}
                item={item}
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
            <Button variant="solid" className="bg-red-600 hover:bg-red-700" onClick={handleDeleteRecette}>
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}
