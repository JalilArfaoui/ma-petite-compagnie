"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Card,
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
import { DEPENSES_DATA, SPECTACLES_DATA } from "../test_data";
import { formatMontant } from "../utils";
import { ItemFinancierCard, NoteInfo, BoutonRetourAdministration } from "../components/shared";
import { Depense } from "../components/types";

export default function DepensesPage() {
  // TODO(BDD): remplacer cette source locale par une récupération serveur (API/DB).
  const [depenses, setDepenses] = useState<Depense[]>(DEPENSES_DATA);
  const [depenseEnEdition, setDepenseEnEdition] = useState<Depense | null>(null);
  const [depenseASupprimer, setDepenseASupprimer] = useState<Depense | null>(null);

  const nomsSpectacles = SPECTACLES_DATA.map((s) => s.nom);
  const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);

  const depensesTriees = useMemo(() => {
    return [...depenses].sort(
      (a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
    );
  }, [depenses]);

  // TODO(BDD): brancher ce handler sur une mutation serveur.
  const handleAddDepense = (data: DonneesAjoutFinancier) => {
    const nouvelleDepense: Depense = {
      id: `d-temp-${Date.now()}`,
      nom: data.nom,
      date: data.date,
      montant: data.montant,
      spectacles: data.spectacles || [],
      fichier: data.fichier,
    };
    setDepenses((prev) => [nouvelleDepense, ...prev]);
    toaster.success({ title: "Dépense ajoutée" });
  };

  // TODO(BDD): brancher ce handler sur une mutation serveur.
  const handleEditDepense = (data: DonneesAjoutFinancier) => {
    if (!data.id) return;

    setDepenses((prev) =>
      prev.map((d) =>
        d.id === data.id
          ? {
              ...d,
              nom: data.nom,
              montant: data.montant,
              date: data.date,
              spectacles: data.spectacles || [],
              fichier: data.fichier,
            }
          : d
      )
    );

    setDepenseEnEdition(null);
    toaster.success({ title: "Dépense modifiée" });
  };

  // TODO(BDD): brancher ce handler sur une mutation serveur.
  const handleDeleteDepense = () => {
    if (!depenseASupprimer) return;
    setDepenses((prev) => prev.filter((d) => d.id !== depenseASupprimer.id));
    setDepenseASupprimer(null);
    toaster.success({ title: "Dépense supprimée" });
  };

  return (
    <div className="min-h-screen bg-[#fffbef] font-sans pb-20 relative">
      <Toaster />
      <Container maxW="max-w-6xl" className="mx-auto pt-16 px-4">
        <BoutonRetourAdministration />
        <Stack className="mb-8">
          <Heading as="h3" className="text-primary mb-2">
            Dépenses
          </Heading>
          <Heading as="h4" className="text-gray-900 italic font-serif text-3xl">
            Vue complète des dépenses
          </Heading>
          <Text className="text-gray-600 text-xl mt-2">
            Total actuel : {formatMontant(totalDepenses)}
          </Text>
        </Stack>

        <Card className="bg-white">
          <div className="flex justify-between items-start md:items-center mb-5 mt-[-10px] md:mt-0 gap-2">
            <h3 className="text-[1.25rem] md:text-[1.5rem] font-bold font-serif leading-tight tracking-tight pr-2">
              Toutes les dépenses
            </h3>
            <div className="flex-shrink-0">
              <ModalAjoutRapide
                typeSection="Dépense"
                onAdd={handleAddDepense}
                spectacles={nomsSpectacles}
              />
            </div>
          </div>

          <NoteInfo className="mb-6">
            Note : l&apos;ensemble des dépenses affichées ici sont considérées comme payées.
          </NoteInfo>

          <div className="flex flex-col gap-3">
            {depensesTriees.map((item) => (
              <ItemFinancierCard
                key={item.id}
                item={item}
                showSpectaclesInline={true}
                onEdit={(id, e) => {
                  e.stopPropagation();
                  const cible = depenses.find((d) => d.id === id);
                  if (!cible) return;
                  setDepenseEnEdition(cible);
                }}
                onDelete={(id, e) => {
                  e.stopPropagation();
                  const cible = depenses.find((d) => d.id === id);
                  if (!cible) return;
                  setDepenseASupprimer(cible);
                }}
              />
            ))}
            {depensesTriees.length === 0 && (
              <div className="text-sm text-center py-4 text-text-muted italic">
                Aucune dépense trouvée.
              </div>
            )}
          </div>
        </Card>
      </Container>

      {depenseEnEdition && (
        <ModalAjoutRapide
          key={depenseEnEdition.id}
          typeSection="Dépense"
          mode="edit"
          hideTrigger
          open
          onOpenChange={(val) => {
            if (!val) setDepenseEnEdition(null);
          }}
          initialData={{
            id: depenseEnEdition.id,
            nom: depenseEnEdition.nom,
            montant: depenseEnEdition.montant,
            date: depenseEnEdition.date || new Date().toISOString().split("T")[0],
            spectacles: depenseEnEdition.spectacles || [],
            fichier: depenseEnEdition.fichier,
          }}
          onSubmit={handleEditDepense}
          spectacles={nomsSpectacles}
        />
      )}

      <Modal
        open={!!depenseASupprimer}
        onOpenChange={(val) => {
          if (!val) setDepenseASupprimer(null);
        }}
      >
        <Modal.Content size="sm">
          <Modal.Header>
            <Modal.Title>Supprimer la dépense ?</Modal.Title>
            <Modal.Description>
              {depenseASupprimer
                ? `Cette action supprimera définitivement "${depenseASupprimer.nom}".`
                : "Cette action est irréversible."}
            </Modal.Description>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setDepenseASupprimer(null)}>
              Annuler
            </Button>
            <Button
              variant="solid"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteDepense}
            >
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}
