"use client";
import { Box, Button, Input, Modal, Stack, Text } from "@/components/ui";
import { useRef, useState } from "react";

export function CSVContactImport({
  requiredAttributes,
  optionnalAttributes,
  onCSVRead,
}: {
  requiredAttributes: string[];
  optionnalAttributes: string[];
  onCSVRead: (donnees: Record<string, string>[]) => void;
}) {
  const attributes = [...requiredAttributes, ...optionnalAttributes];

  const modal = useRef<HTMLButtonElement>(null);
  const inputFile = useRef<HTMLInputElement>(null);
  const [champs, setChamps] = useState<string[]>(requiredAttributes ?? []);
  const [erreur, setErreur] = useState("");
  const handleFile = async (input: HTMLInputElement) => {
    const file = input.files?.[0];
    if (!file) return;

    const text = await file.text();

    const rows = text.split("\n").map((row) => row.split(","));
    console.log(rows);
    const datas: Record<string, string>[] = [];
    rows.forEach((row, i) => {
      if (i === 0) return; // skip header si besoin

      const obj: Record<string, string> = {};

      champs.forEach((champ, index) => {
        obj[champ] = row[index] || ""; // associe le champ à la valeur de la colonne
      });

      datas.push(obj);
    });
    onCSVRead(datas);
  };
  function changeChamps(index: number, newType: string) {
    setChamps((prev) =>
      prev.map((champ, i) => {
        const result = i === index ? newType : champ;
        return result;
      })
    );
  }
  function champsDoublon() {
    return champs.find((champ, i) => {
      return champs.find((champ2, i2) => i !== i2 && champ === champ2);
    });
  }
  function champsContientRequiredAttributes() {
    return requiredAttributes.every((attribute) => champs.includes(attribute));
  }
  function addChamp() {
    setChamps((prev) => [...prev, ""]);
  }
  function supprimerColonne(i: number) {
    setChamps((prev) => {
      return prev.filter((champs, inedx) => i !== inedx);
    });
  }
  function confirmation() {
    console.log("Importation du csv");
    console.log(attributes);
    if (!inputFile.current?.files || !inputFile.current?.files[0]) {
      setErreur("Aucun fichier sélectionné");
      return;
    }
    if (champsDoublon()) {
      setErreur("Votre sélection contient des choix doublons");
      return;
    }
    if (!champsContientRequiredAttributes()) {
      setErreur("Votre sélection ne contient pas tous les choix obligatoires");
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
            <Input ref={inputFile} type="file" accept=".csv"></Input>
            <Text>Colonnes : </Text>
            {champs.map((attributeChamp, i) => {
              return (
                <Stack key={i} direction="row">
                  {" "}
                  <Box>(Colonne numéro : {i})</Box>
                  <select
                    defaultValue={attributeChamp}
                    onChange={(e) => changeChamps(i, e.target.value)}
                  >
                    {attributes.map((attribute, indexAttribute) => {
                      return (
                        <option
                          key={indexAttribute}
                          className={
                            requiredAttributes.includes(attribute) ? "text-red-600" : "text-black"
                          }
                        >
                          {attribute}
                        </option>
                      );
                    })}
                  </select>
                  <Button size={"sm"} variant={"outline"} onClick={() => supprimerColonne(i)}>
                    Supprimer colonne
                  </Button>
                </Stack>
              );
            })}
            <Button onClick={() => addChamp()} size={"sm"}>
              Ajouter champ
            </Button>
            {erreur && <Text className=" text-red-600">{erreur}</Text>}
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
