"use client";
import { Box, Button, Input, Modal, Stack, Table, Text } from "@/components/ui";
import { useRef, useState } from "react";

export type MappageAttributs = {
  /**
   * Champs de l'objet mappé
   */
  attributsObjets: string[];
  /**
   * Champs des attributs à mapper
   */
  attributsCSV: string[];
};

export function mappingTexte(
  mappageAttributs: MappageAttributs,
  fichierEntetes: string[],
  texteCSV: string
) {
  const rows = texteCSV.split("\n").map((row) => splitVirgule(row));
  const datas: Record<string, string>[] = [];
  rows.forEach((CSVcolonnes, numeroLigne) => {
    if (numeroLigne === 0) return; // Skip header
    const obj: Record<string, string> = {};
    mappageAttributs.attributsCSV.forEach((attributCSVChoisie, indexObjet) => {
      if (attributCSVChoisie !== "Aucun") {
        // Récupère la colonne par rapport à l'entete du fichier avec le champ choisie
        const indexColonne = fichierEntetes.indexOf(attributCSVChoisie);
        let valeurCSV = CSVcolonnes[indexColonne] || "";
        if (valeurCSV.endsWith("\r")) {
          valeurCSV = valeurCSV.substring(0, valeurCSV.length - 1);
        }
        obj[mappageAttributs.attributsObjets[indexObjet]] = valeurCSV;
      }
    });

    datas.push(obj);
  });
  return datas;
}
/**
 *
 * @param mappageAttributs Parmètres qui définit le mapping entre les attributs du csv et les champs de l'objet
 * @param fichierEntetes Les champs d'entete du fichier CSV
 * @param file Le fichier CSV
 * @returns
 */
async function readCSV(
  mappageAttributs: MappageAttributs,
  fichierEntetes: string[],
  file: File
): Promise<Record<string, string>[]> {
  const text = await file.text();
  return mappingTexte(mappageAttributs, fichierEntetes, text);
}

/**
 * Méthode utilitaire pour séparer les parties d'un csv par virgule en prenant en compte, les champs avec des virgules à l'intérieur.
 * Exemple : "Je suis Mathieu, et toi ?"
 * Ce texte ne sera pas séparé par la virgule mais pris en compte en entier grâce au guillemets.
 *
 * @param texte Le texte à séparer par virgule
 * @returns
 */
function splitVirgule(texte: string): string[] {
  const seperation = [];
  while (texte != "") {
    texte = texte.replace(",", ";?;");
    const parts = texte.split(";?;");
    if (parts.length == 2) {
      const first = parts[0];
      const second = parts[1];
      if (!first.startsWith('"')) {
        seperation.push(first);
        texte = second;
      } else {
        const indexComma = second.indexOf('"');

        const separationComma =
          first.substring(1, first.length) + "," + second.substring(0, indexComma);

        seperation.push(separationComma);
        texte = second.substring(indexComma + 2);
      }
    } else {
      seperation.push(parts[0]);
      break;
    }
  }

  return seperation;
}

/**
 * Attributs du CSV, avec son nom de l'entete et si il est obligatoire
 */
type CSVAttribute = {
  name: string;
  required: boolean;
};
/**
 * Attributs qui vont permettre de créer un objet par rapport à ce qui est lue avec le CSV
 */
export type Attributes = {
  attributsObligatoire: string[];
  attributsOptionnels: string[];
};

/**
 * Composants UI qui permet de mapper un fichier CSV en objet avec les attributs données en argument
 * @param onCSVRead Méthode appelé quand le fichier CSV est lue
 */
export function CSVContactImport({
  attributs,
  nomObjet,
  onCSVRead,
}: {
  attributs: Attributes;
  nomObjet: string;
  onCSVRead: (donnees: Record<string, string>[]) => void;
}) {
  const AttributsCSV: CSVAttribute[] = [
    ...attributs.attributsObligatoire.map((attribute) => {
      return { name: attribute, champDuCSV: "", required: true };
    }),
    ...attributs.attributsOptionnels.map((attribute) => {
      return { name: attribute, champDuCSV: "", required: false };
    }),
  ];
  const attributsObjets = [...attributs.attributsObligatoire, ...attributs.attributsOptionnels];
  const [fichierEnTete, setFichierEnTete] = useState<string[]>([]);
  const modal = useRef<HTMLButtonElement>(null);
  const CSVFileInput = useRef<HTMLInputElement>(null);
  const [champsCSVSelectionnes, setChampsCSVSelectionnes] = useState<string[]>(attributsObjets);
  const [erreur, setErreur] = useState("");

  /**
   * Méthode pour s'occuper de la lecture du csv et faire le mapping du CSV en objet
   * @param input
   * @returns
   */
  const handleFile = async (input: HTMLInputElement) => {
    const file = input.files?.[0];
    if (!file) return;

    const datas = await readCSV(
      { attributsObjets: attributsObjets, attributsCSV: champsCSVSelectionnes },
      fichierEnTete,
      file
    );
    onCSVRead(datas);
  };
  function updateChampsCSVSelectionnes(indexChamp: number, newChamp: string) {
    setChampsCSVSelectionnes((prev) =>
      prev.map((champ, i) => {
        const result = i === indexChamp ? newChamp : champ;
        return result;
      })
    );
  }

  function champObligatoireNonChoisi() {
    return champsCSVSelectionnes.find((champ, i) => {
      const CSVAttribute = AttributsCSV.at(i);

      return CSVAttribute?.required ? champ === "Aucun" : false;
    });
  }
  function champsDoublon() {
    return champsCSVSelectionnes.find((champ, i) => {
      return champsCSVSelectionnes.find(
        (champ2, i2) => i !== i2 && champ !== "Aucun" && champ === champ2
      );
    });
  }

  async function modifierChampsEnTete(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (!file) return;

    const text = await file.text();

    let header = text.split("\n").map((row) => row.split(","))[0];
    header = header.map((texte) => {
      return texte.replace("\r", "");
    });

    setFichierEnTete([...header]);
    setChampsCSVSelectionnes([
      ...header.map(() => {
        return "Aucun";
      }),
    ]);
  }

  function afficherSelectChampsFichier(id: number) {
    return (
      <select
        defaultValue={"Aucun"}
        onChange={(e) => updateChampsCSVSelectionnes(id, e.target.value)}
      >
        <option key={-1}>Aucun</option>
        {fichierEnTete.map((att, indexAttribute) => {
          return <option key={indexAttribute}>{att}</option>;
        })}
      </select>
    );
  }
  function afficherChampsAttributs() {
    return AttributsCSV.map((CSVAttribute, id) => {
      return (
        <Table.Row key={id}>
          <Table.Cell>{CSVAttribute.name}</Table.Cell>
          <Table.Cell>{afficherSelectChampsFichier(id)}</Table.Cell>
          <Table.Cell>
            {CSVAttribute.required ? <Box className="text-red-500">*</Box> : ""}
          </Table.Cell>
        </Table.Row>
      );
    });
  }
  function afficherErreur() {
    return <Text className=" text-red-600 text-center">{erreur}</Text>;
  }
  function confirmation() {
    if (!CSVFileInput.current?.files || !CSVFileInput.current?.files[0]) {
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
    handleFile(CSVFileInput.current);
    fermerModal();
  }
  function fermerModal() {
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
                ref={CSVFileInput}
                type="file"
                onChange={(e) => modifierChampsEnTete(e.target)}
                accept=".csv"
              ></Input>
            </Box>
            <Text className="font-bold">Champs de la conversion : </Text>

            <Table className="text-center">
              <Table.Head>
                <Table.Row className=" text-center">
                  <Table.Header className="text-center">Champ de {nomObjet}</Table.Header>
                  <Table.Header className="text-center">Champ du CSV</Table.Header>
                  <Table.Header className="text-center">Obligatoire</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>{afficherChampsAttributs()}</Table.Body>
            </Table>
            {erreur && afficherErreur()}
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
