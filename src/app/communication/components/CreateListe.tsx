"use client";
import { Button, Input, Modal, Text, toaster, Toaster } from "@/components/ui";
import { Contact } from "@prisma/client";
import { useRef, useState } from "react";
import { createListe } from "../api/contact/liste";

export function CreateListe({
  disabled,
  getContacts,
  onCreatedListe = () => {},
}: {
  disabled: boolean;
  onCreatedListe: () => void;
  getContacts: () => Contact[];
}) {
  const modal = useRef<HTMLButtonElement>(null);
  const [title, setTitle] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  async function creer() {
    const resultat = await createListe(title, contacts);
    if (resultat.succes) {
      toaster.success({ title: "Succès de la création de la liste" });
    } else {
      toaster.error({ title: resultat.message });
    }
    onCreatedListe();
    modal.current?.click();
  }
  return (
    <Modal onOpenChange={() => setContacts(getContacts())}>
      <Modal.Trigger asChild>
        <Button variant="outline" size={"sm"} disabled={disabled}>
          Créer ou associer une liste aux contacts séléctionnés
        </Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Créer une liste</Modal.Title>
          <Modal.Description>Créer la liste</Modal.Description>
        </Modal.Header>

        <Modal.Body>
          <Toaster></Toaster>
          <Text className="font-bold"> Titre de la liste: </Text>
          <Input type="text" onChange={(e) => setTitle(e.target.value)}></Input>
        </Modal.Body>

        <Modal.Footer>
          <Modal.Close asChild ref={modal}>
            <Button variant="outline">Annuler</Button>
          </Modal.Close>
          <Button onClick={() => creer()} variant="solid">
            Créer
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
