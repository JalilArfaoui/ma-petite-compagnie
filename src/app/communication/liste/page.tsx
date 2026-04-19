"use client";
import { Box, Select, Text, Toaster, toaster } from "@/components/ui";
import { ListeContact } from "@prisma/client";
import { useEffect, useState } from "react";
import { ContactWithListes, getContactInListe } from "../api/contact/contact";
import { ContactTable } from "../components/ContactTable";
import { getMany } from "../api/contact/liste";

export default function AffichageListeContacts() {
  const [listes, setListes] = useState<ListeContact[]>([]);
  const [listesSelectionnees, setListesSelectionnees] = useState<ListeContact[]>([]);

  useEffect(() => {
    async function loadListeContact() {
      const resultat = await getMany();
      if (resultat.succes) {
        setListes(resultat.donnee ?? []);
      } else {
        toaster.create({ description: resultat.message, type: "error" });
      }
    }
    loadListeContact();
  }, []);
  async function loadContactFromListe(): Promise<ContactWithListes[] | null> {
    if (listesSelectionnees.length == 0) {
      return [];
    } else {
      const liste = listesSelectionnees[0];
      const contacts = await getContactInListe(liste);
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
      <ContactTable
        keyReload={listesSelectionnees[0]?.id ?? -1}
        getContacts={() => loadContactFromListe()}
      ></ContactTable>
    </Box>
  );
}
