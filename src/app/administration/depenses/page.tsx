"use client";

import { Button, Card, Container, Heading, Modal, Stack, Text, Toaster } from "@/components/ui";
import { ModalAjoutRapide, DonneesAjoutFinancier } from "../modals";
import { DEPENSES_DATA, SPECTACLES_DATA } from "../test_data";
import { formatMontant } from "../utils";
import { ItemFinancierCard, NoteInfo, BoutonRetourAdministration } from "../components/shared";
import { Depense } from "../components/types";
import { useGestionFinanciere } from "../hooks/useGestionFinanciere";

export default function DepensesPage() {
  // TODO(BDD): Remplacer DEPENSES_DATA par un appel à la base de données (ex: Server Action ou API)
  const {
    items: depenses,
    itemsTries: depensesTries,
    total: totalDepenses,
    itemEnEdition: depenseEnEdition,
    setItemEnEdition: setDepenseEnEdition,
    itemASupprimer: depenseASupprimer,
    setItemASupprimer: setDepenseASupprimer,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useGestionFinanciere<Depense>(DEPENSES_DATA, "dépense");

  const nomsSpectacles = SPECTACLES_DATA.map((s) => s.nom);

  const handleAddDepense = (data: DonneesAjoutFinancier) => {
    // TODO(BDD): Envoyer les données à la base de données via une mutation (ex: prisma.depense.create)
    handleAdd(data, (d) => ({
      id: `d-temp-${Date.now()}`,
      nom: d.nom,
      date: d.date,
      montant: d.montant,
      spectacles: d.spectacles || [],
      fichier: d.fichier,
    }));
  };

  const handleEditDepense = (data: DonneesAjoutFinancier) => {
    // TODO(BDD): Mettre à jour les données en base de données (ex: prisma.depense.update)
    handleEdit(data, (d) => ({
      id: d.id as string,
      nom: d.nom,
      montant: d.montant,
      date: d.date,
      spectacles: d.spectacles || [],
      fichier: d.fichier,
    }));
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
                onSubmit={handleAddDepense}
                spectacles={nomsSpectacles}
              />
            </div>
          </div>

          <NoteInfo className="mb-6">
            Note : l&apos;ensemble des dépenses affichées ici sont considérées comme payées.
          </NoteInfo>

          <div className="flex flex-col gap-3">
            {depensesTries.map((item) => (
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
            {depensesTries.length === 0 && (
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
            <Button variant="solid" className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}
