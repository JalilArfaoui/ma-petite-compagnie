import { toaster, Modal, Button, Toaster, Select } from "@/components/ui";
import { ListeContact } from "@prisma/client";
import { getMany } from "../api/contact/liste";
import { useEffect, useRef, useState } from "react";

export function GetListe({
  disabled = false,
  onGetListe,
}: {
  disabled: boolean;
  onGetListe: (listes: ListeContact[]) => void;
}) {
  const close = useRef<HTMLButtonElement>(null);
  const [listes, setListes] = useState<ListeContact[]>([]);
  const [listesSelectionnees, setListesSelectionnees] = useState<ListeContact[]>([]);
  async function confirmer(listes: ListeContact[]) {
    if (listesSelectionnees.length !== 0) {
      onGetListe(listes);
      close.current?.click();
    }
  }
  useEffect(() => {
    async function loadContact() {
      const resultat = await getMany();
      if (resultat.succes) {
        setListes(resultat.donnee ?? []);
      } else {
        toaster.create({ description: resultat.message, type: "error" });
      }
    }
    loadContact();
  }, []);
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
          <Select onValueChange={(value) => setListesSelectionnees([listes[Number(value)]])}>
            <Select.Trigger>
              <Select.Value></Select.Value>
            </Select.Trigger>
            <Select.Content>
              <Select.Group defaultValue={"Aucune sélection"}>
                {listes.map((liste, i) => {
                  return (
                    <Select.Item key={i} value={"" + i}>
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
