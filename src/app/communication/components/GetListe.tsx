"use client";
import { Modal, Button, Toaster, Select } from "@/components/ui";
import { ListeContact } from "@prisma/client";
import { useRef, useState } from "react";

export function GetListe({
  disabled = false,
  listes,
  onGetListe,
}: {
  disabled: boolean;
  listes: ListeContact[];
  onGetListe: (listes: ListeContact[]) => void;
}) {
  const close = useRef<HTMLButtonElement>(null);
  const [listesSelectionnees, setListesSelectionnees] = useState<ListeContact[]>([]);
  async function confirmer(listes: ListeContact[]) {
    if (listesSelectionnees.length !== 0) {
      onGetListe(listes);
      close.current?.click();
    }
  }
  return (
    <Modal>
      <Modal.Trigger asChild>
        <Button variant="outline" size={"sm"} disabled={disabled}>
          associer contacts à une liste
        </Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Obtenir une liste</Modal.Title>
          <Modal.Description>Choisir la liste</Modal.Description>
        </Modal.Header>

        <Modal.Body>
          <Toaster></Toaster>
          <Select
            onValueChange={(value) =>
              setListesSelectionnees([listes.find((l) => l.id === Number(value))!])
            }
          >
            <Select.Trigger>
              <Select.Value></Select.Value>
            </Select.Trigger>
            <Select.Content>
              <Select.Group defaultValue={"Aucune sélection"}>
                {listes.map((liste) => {
                  return (
                    <Select.Item key={liste.id} value={"" + liste.id}>
                      {liste.nom}
                    </Select.Item>
                  );
                })}
              </Select.Group>
            </Select.Content>
          </Select>
        </Modal.Body>

        <Modal.Footer>
          <Modal.Close asChild ref={close}>
            <Button variant="outline">Annuler</Button>
          </Modal.Close>
          <Button onClick={() => confirmer(listesSelectionnees)} variant="solid">
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
