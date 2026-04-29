import { useEffect, useState } from "react";
import { ContactWithListes, supprimerContact } from "../api/contact/contact";
import { Box, Button, Stack, Table, Text, Toaster, toaster } from "@/components/ui";
import { Contact, ListeContact } from "@prisma/client";
import { ContactGrid } from "./ContactGrid";
import { CreateListe } from "./CreateListe";
import { GetListe } from "./GetListe";
import { creerListe } from "../api/contact/liste";

export function ContactTable({
  getContacts,
  keyReload,
}: {
  getContacts: (paginationTaille: number, page: number) => Promise<ContactWithListes[] | null>;
  keyReload: number;
}) {
  const [page, setPage] = useState(1);
  const paginationTaille = 30;
  const [contacts, setContacts] = useState<ContactWithListes[]>([]);
  const [contactsSelectionne, setContactsSelectionne] = useState<ContactWithListes[]>([]);
  async function loadContact() {
    const resultat = await getContacts(paginationTaille, page);
    setContacts(resultat ?? []);
  }
  useEffect(() => {
    async function loadContact() {
      const resultat = await getContacts(paginationTaille, page);
      setContacts(resultat ?? []);
    }
    loadContact();
  }, [keyReload, page, getContacts]);

  function changerPage(page: number) {
    setPage(page);
    loadContact();
  }
  async function associerListe(listes: ListeContact[]) {
    const resultats = await Promise.all(
      listes.map((liste) => creerListe(liste.nom, contactsSelectionne))
    );
    const toutesReussies = resultats.every((r) => r.succes);
    if (toutesReussies) {
      toaster.create({ type: "success", title: "Les contacts ont bien été associés à la liste" });
      // mise à jour de l'état ici
    } else {
      const erreur = resultats.find((r) => !r.succes);
      toaster.create({ type: "error", title: erreur?.message });
    }
    loadContact();
    setContactsSelectionne([]);
  }

  async function supprimerUnContact(contact: Contact) {
    const resultat = await supprimerContact(contact.id);
    if (resultat.succes) {
      toaster.create({ description: "Le contact a été supprimé", type: "success" });
      setContacts((prev) => {
        return prev.filter((c) => c.id !== contact.id);
      });
    } else {
      toaster.create({ description: resultat.message, type: "error" });
    }
  }
  async function supprimerContacts() {
    await contactsSelectionne.forEach(async (c) => {
      const resultat = await supprimerContact(c.id);
      if (!resultat.succes) {
        toaster.create({ description: resultat.message, type: "error" });
      }
    });
    toaster.create({ description: "Les contacts ont été supprimés", type: "success" });
    setContacts((prev) => {
      return prev.filter((c) => !contactsSelectionne.includes(c));
    });
    deselectAll();
  }
  function updateSelected(contact: ContactWithListes) {
    setContactsSelectionne((prev) => {
      if (prev.includes(contact)) {
        return prev.filter((c) => c !== contact);
      } else {
        return [...prev, contact];
      }
    });
  }

  function selectAll() {
    setContactsSelectionne(() => {
      return contacts;
    });
  }

  function deselectAll() {
    setContactsSelectionne(() => {
      return [];
    });
  }
  return (
    <Box>
      <Toaster />
      <Stack direction="row" gap={2} className="justify-between">
        <Stack direction="row" gap={2} className="items-end" justify="start">
          <Text className="h-fit font-bold text-2xl">Liste de contacts</Text>
        </Stack>

        <Stack
          direction="row"
          className="grid grid-cols-1 sm:grid-cols-2 flex-wrap "
          gap={2}
          justify="end"
        >
          <Button
            className=" border-solid "
            variant={"outline"}
            size={"sm"}
            onClick={() => supprimerContacts()}
            disabled={contactsSelectionne.length <= 1}
          >
            Supprimer
          </Button>
          <GetListe
            disabled={contactsSelectionne.length <= 0}
            onGetListe={(a) => associerListe(a)}
          ></GetListe>
          <CreateListe
            onCreatedListe={() => loadContacts()}
            disabled={contactsSelectionne.length <= 0}
            getContacts={() => contactsSelectionne}
          ></CreateListe>
          {contactsSelectionne.length == 0 ? (
            <Button variant="outline" size={"sm"} onClick={() => selectAll()}>
              Tout sélectionner
            </Button>
          ) : (
            <Button variant="outline" size={"sm"} onClick={() => deselectAll()}>
              Tout désélectionner
            </Button>
          )}
        </Stack>
      </Stack>
      <div>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell className=" text-[10px] md:text-[16px]">Nom</Table.Cell>
              <Table.Cell className=" text-[10px] md:text-[16px]">Prénom</Table.Cell>
              <Table.Cell className="text-[10px] md:text-[16px]">Email</Table.Cell>
              <Table.Cell className=" text-[10px] md:text-[16px]">Téléphone</Table.Cell>
              <Table.Cell className=" text-[10px] md:text-[16px]">Listes</Table.Cell>
              <Table.Cell className=" text-[10px] md:text-[16px]">Ville</Table.Cell>
              <Table.Cell className=" text-[10px] md:text-[16px]">Lieu</Table.Cell>
              <Table.Cell className="text-[10px] md:text-[16px] max-w-75">Notes</Table.Cell>
              <Table.Cell className=" max-w-17.5"></Table.Cell>
              <Table.Cell className="max-w-17.5"></Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {contacts.map((contact) => {
              return (
                <ContactGrid
                  key={contact.id}
                  onDelete={supprimerUnContact}
                  contact={contact}
                  onSelect={updateSelected}
                  className={contactsSelectionne.includes(contact) ? "bg-gray-100" : ""}
                />
              );
            })}
          </Table.Body>
        </Table>
        <Stack className="p-4" direction="row" justify="center">
          {page > 1 && (
            <Button onClick={() => changerPage(page - 1)} className="p-1" size={"sm"}>
              Page précedente
            </Button>
          )}

          <Text className="p-1 font-bold">{page}</Text>
          {contacts.length == paginationTaille && (
            <Button onClick={() => changerPage(page + 1)} className="p-1" size={"sm"}>
              Page suivante
            </Button>
          )}
        </Stack>
      </div>
    </Box>
  );
}
