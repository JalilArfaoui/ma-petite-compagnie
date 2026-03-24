"use client";
import { Box, Button, Input, Modal, Stack, Table, Text } from "@/components/ui";
import { useRef, useState } from "react";

async function readCSV(
  champsObjets: string[],
  champsCSVChoisie: string[],
  champsCSV: string[],
  file: File
): Promise<Record<string, string>[]> {
  const text = await file.text();

  const rows = text.split("\n").map((row) => row.split(","));
  const datas: Record<string, string>[] = [];
  rows.forEach((row, i) => {
    if (i === 0) return; // Skip header

    const obj: Record<string, string> = {};
    console.log(row);
    champsCSVChoisie.forEach((champChoisie, index) => {
      if (champChoisie !== "Aucun") {
        const r = row[champsCSV.indexOf(champChoisie) - 1].replace("\r", "") || "";
        console.log(r);
        obj[index] = r; // associe le champ à la valeur de la colonne
      }
    });

    datas.push(obj);
  });
  return datas;
}

type CSVAttribute = {
  name: string;
  required: boolean;
};

export function CSVContactImport({
  requiredAttributes,
  optionnalAttributes,
  onCSVRead,
}: {
  requiredAttributes: string[];
  optionnalAttributes: string[];
  onCSVRead: (donnees: Record<string, string>[]) => void;
}) {
  const CSVAttributes: CSVAttribute[] = [
    ...requiredAttributes.map((attribute) => {
      return { name: attribute, champDuCSV: "", required: true };
    }),
    ...optionnalAttributes.map((attribute) => {
      return { name: attribute, champDuCSV: "", required: false };
    }),
  ];
  const attributes = [...requiredAttributes, ...optionnalAttributes];
  const [champsCSV, setChampsCSV] = useState<string[]>([]);
  const modal = useRef<HTMLButtonElement>(null);
  const inputFile = useRef<HTMLInputElement>(null);
  const [champs, setChamps] = useState<string[]>(attributes);
  const [erreur, setErreur] = useState("");
  const handleFile = async (input: HTMLInputElement) => {
    const file = input.files?.[0];
    if (!file) return;
    console.log(champsCSV);
    console.log(champs);
    const datas = await readCSV(attributes, champs, champsCSV, file);
    onCSVRead(datas);
  };
  function updateChamps(index: number, newType: string) {
    setChamps((prev) =>
      prev.map((champ, i) => {
        const result = i === index ? newType : champ;
        return result;
      })
    );
  }

  function champObligatoireNonChoisi() {
    console.log(champs);
    return champs.find((champ, i) => {
      const CSVAttribute = CSVAttributes.at(i);

      return CSVAttribute?.required ? champ === "Aucun" : false;
    });
  }
  function champsDoublon() {
    return champs.find((champ, i) => {
      return champs.find((champ2, i2) => i !== i2 && champ !== "Aucun" && champ === champ2);
    });
  }

  async function lireChampCSV(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (!file) return;

    const text = await file.text();

    let header = text.split("\n").map((row) => row.split(","))[0];
    console.log(header);
    header = header.map((texte) => {
      return texte.replace("\r", "");
    });

    setChampsCSV(["Aucun", ...header]);
    setChamps([
      ...header.map((value, i) => {
        return "Aucun";
      }),
    ]);
  }
  function confirmation() {
    if (!inputFile.current?.files || !inputFile.current?.files[0]) {
      setErreur("Aucun fichier sélectionné");
      return;
    }
    if (champsDoublon()) {
      setErreur("Votre sélection contient des choix doublons");
      return;
    }
    if (champObligatoireNonChoisi()) {
      setErreur("Un champ obligatoire n'a pas de champ associé au CSV.");
      return;
    }

    setErreur("");
    handleFile(inputFile.current);
    modal.current?.click();
  }
  return (
    <Modal>
      <Modal.Trigger asChild>
        <Button variant="outline">Import contacts CSV</Button>
      </Modal.Trigger>
      <Modal.Content size="md">
        <Modal.Header>
          <Modal.Title>Import contacts par CSV</Modal.Title>
          <Modal.Description>Importez vos contacts</Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <Stack className="gap-4">
            <Box>
              <Text className="font-bold"> Fichier CSV: </Text>
              <Input
                ref={inputFile}
                type="file"
                onChange={(e) => lireChampCSV(e.target)}
                accept=".csv"
              ></Input>
            </Box>
            <Text className="font-bold">Colonnes : </Text>

            <Table className="text-center">
              <Table.Head>
                <Table.Row className=" text-center">
                  <Table.Header>Champ</Table.Header>
                  <Table.Header>Champs CSV</Table.Header>
                  <Table.Header>Obligatoire</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {CSVAttributes.map((CSVAttribute, id) => {
                  return (
                    <Table.Row key={id}>
                      <Table.Cell>{CSVAttribute.name} </Table.Cell>
                      <Table.Cell>
                        <select
                          defaultValue={"Aucun"}
                          onChange={(e) => updateChamps(id, e.target.value)}
                        >
                          {champsCSV.map((att, indexAttribute) => {
                            return <option key={indexAttribute}>{att}</option>;
                          })}
                        </select>
                      </Table.Cell>
                      <Table.Cell>
                        {CSVAttribute.required ? <Box className="text-red-500">*</Box> : ""}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
            {erreur && <Text className=" text-red-600 text-center">{erreur}</Text>}
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild ref={modal}>
            <Button variant="outline">Annuler</Button>
          </Modal.Close>
          <Button onClick={() => confirmation()} variant="solid">
            Importer
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
