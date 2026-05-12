"use client";
import { Box, Select, Text, Toaster, toaster } from "@/components/ui";
import { ListeContact } from "@prisma/client";
import { useEffect, useState } from "react";
import { ContactWithListes, listerContactsDansListe } from "../api/contact/contact";
import { ContactTable } from "../components/ContactTable";
import { trouverListes } from "../api/contact/liste";

export default function AffichageListeContacts() {
  const [listes, setListes] = useState<ListeContact[]>([]);
  const [listesSelectionnees, setListesSelectionnees] = useState<ListeContact[]>([]);

  useEffect(() => {
    async function loadListeContact() {
      const resultat = await trouverListes();
      if (resultat.succes) {
        setListes(resultat.donnee ?? []);
      } else {
        toaster.create({ description: resultat.message, type: "error" });
      }
    }
    loadListeContact();
  }, []);
  async function loadContactFromListe(
    pagination = 30,
    page = 1
  ): Promise<ContactWithListes[] | null> {
    if (listesSelectionnees.length == 0) {
      return [];
    } else {
      const liste = listesSelectionnees[0];
      const contacts = await listerContactsDansListe(liste, pagination, page);
      if (contacts && contacts.succes) {
        return contacts.donnee;
      } else {
        return [];
      }
    }
  }
  return (
    <Box className=" py-5 px-3 flex-col items-center gap-4">
      <Toaster />
      <Text className="h-fit font-bold text-2xl">Listes : </Text>
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
      <ContactTable
        keyReload={listesSelectionnees[0]?.id ?? -1}
        getContacts={(pagination, page) => loadContactFromListe(pagination, page)}
      ></ContactTable>
    </Box>
  );
}
