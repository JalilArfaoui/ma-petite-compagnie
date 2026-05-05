"use client";

import { ReactNode } from "react";
import { Button, Card, Container, Heading, Modal, Stack, Text, Toaster } from "@/components/ui";
import { ModalAjoutRapide, DonneesAjoutFinancier } from "../modals";
import { formatMontant } from "../utils";
import { NoteInfo, BoutonRetourAdministration } from "./shared";

interface PageGestionFinanciereProps {
  title: string;
  subtitle: string;
  total: number;

  cardTitle: string;
  typeSection: "Dépense" | "Recette";
  noteInfoText: string;
  filtersSlot?: ReactNode;

  children: ReactNode;
  isEmpty: boolean;
  emptyMessage: string;

  nomsSpectacles: string[];

  // Ajout
  onAddSubmit: (data: DonneesAjoutFinancier) => void;

  // Edition
  editInitialData: DonneesAjoutFinancier | null;
  onEditSubmit: (data: DonneesAjoutFinancier) => void;
  onEditClose: () => void;

  // Suppression
  deleteItemName: string | null;
  onDeleteSubmit: () => void;
  onDeleteClose: () => void;
}

export function PageGestionFinanciere({
  title,
  subtitle,
  total,
  cardTitle,
  typeSection,
  noteInfoText,
  filtersSlot,
  children,
  isEmpty,
  emptyMessage,
  nomsSpectacles,
  onAddSubmit,
  editInitialData,
  onEditSubmit,
  onEditClose,
  deleteItemName,
  onDeleteSubmit,
  onDeleteClose,
}: PageGestionFinanciereProps) {
  return (
    <div className="min-h-screen bg-[#fffbef] font-sans pb-20 relative">
      <Toaster />
      <Container maxW="max-w-6xl" className="mx-auto pt-16 px-4">
        <BoutonRetourAdministration />
        <Stack className="mb-8">
          <Heading as="h3" className="text-primary mb-2">
            {title}
          </Heading>
          <Heading as="h4" className="text-gray-900 italic font-serif text-3xl">
            {subtitle}
          </Heading>
          <Text className="text-gray-600 text-xl mt-2">Total actuel : {formatMontant(total)}</Text>
        </Stack>

        <Card className="bg-white">
          <div className="flex justify-between items-start md:items-center mb-5 mt-[-10px] md:mt-0 gap-2">
            <h3 className="text-[1.25rem] md:text-[1.5rem] font-bold font-serif leading-tight tracking-tight pr-2">
              {cardTitle}
            </h3>
            <div className="flex-shrink-0">
              <ModalAjoutRapide
                typeSection={typeSection}
                onSubmit={onAddSubmit}
                spectacles={nomsSpectacles}
              />
            </div>
          </div>

          <NoteInfo className="mb-6">{noteInfoText}</NoteInfo>

          {filtersSlot}

          <div className="flex flex-col gap-3">
            {children}
            {isEmpty && (
              <div className="text-sm text-center py-4 text-text-muted italic">{emptyMessage}</div>
            )}
          </div>
        </Card>
      </Container>

      {editInitialData && (
        <ModalAjoutRapide
          key={editInitialData.id}
          typeSection={typeSection}
          mode="edit"
          hideTrigger
          open
          onOpenChange={(val) => {
            if (!val) onEditClose();
          }}
          initialData={editInitialData}
          onSubmit={onEditSubmit}
          spectacles={nomsSpectacles}
        />
      )}

      <Modal
        open={!!deleteItemName}
        onOpenChange={(val) => {
          if (!val) onDeleteClose();
        }}
      >
        <Modal.Content size="sm">
          <Modal.Header>
            <Modal.Title>
              Supprimer {typeSection === "Dépense" ? "la dépense" : "la recette"} ?
            </Modal.Title>
            <Modal.Description>
              {deleteItemName
                ? `Cette action supprimera définitivement "${deleteItemName}".`
                : "Cette action est irréversible."}
            </Modal.Description>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="ghost" onClick={onDeleteClose}>
              Annuler
            </Button>
            <Button
              variant="solid"
              className="bg-red-600 hover:bg-red-700"
              onClick={onDeleteSubmit}
            >
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}
