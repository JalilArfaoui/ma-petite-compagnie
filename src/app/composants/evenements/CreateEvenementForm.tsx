"use client";

import {SubmitEventHandler, useEffect, useState} from "react";
import {Evenement} from "@prisma/client";
import {Box, Button, Input, Select, SimpleGrid, Modal, Field} from "@/components/ui";
import {CreateLieuForm} from "@/app/composants/lieux/CreateLieuForm";
import {CreateCategorieForm} from "@/app/composants/categories/CreateCategorieForm";
import {creerEvenement} from "@/app/actions/evenement";
import {DialogContent, DialogTitle} from "@radix-ui/react-dialog";
import {getCategories} from "@/app/actions/categorie";
import {getLieux} from "@/app/actions/lieu";

type Props = {
  onSuccess?: (evenement: Evenement) => void;
  onCancel?: () => void;
  compagnieId: number;
};

export function CreateEvenementForm({
  onSuccess,
  onCancel,
  compagnieId,
}: Props) {
  const [nom, setNom] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [lieuId, setLieuId] = useState<number>(0);
  const [categorieId, setCategorieId] = useState<number>(0);
  const [showCreateLieu, setShowCreateLieu] = useState(false);
  const [showCreateCategorie, setShowCreateCategorie] = useState(false);
  const [lieuxMap, setLieuxMap] = useState<{ id: number, libelle: string }[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<{ id: number, nom: string }[]>([]);

  useEffect(() => {
    async function fetchDataCategorie() {
      const result = (await getCategories()).categories;
      const mapped = result?.map(({ id, nom }) => ({ id, nom })) ?? [];
      setCategoriesMap(mapped);
    }
    fetchDataCategorie();
  }, []);

  useEffect(() => {
    async function fetchDataLieu() {
      const result = (await getLieux()).lieux;
      const mapped = result?.map(({ id, libelle }) => ({ id, libelle })) ?? [];
      setLieuxMap(mapped);
    }

    fetchDataLieu();
  }, []);

  async function handleSubmitEvenement(datas:FormData) {
    const result = await creerEvenement(datas);
      if (result.status != 201 || !result.evenement) {
        return alert("Erreur lors de la création de l'évènement");
      }
      // Vérification console de la création (provisoire)
      const evenement:Evenement = result.evenement;
      if (onSuccess) {
        setNom("");
        setLieuId(0);
        setDateDebut("");
        setDateFin("");
        setCategorieId(0);
        alert("Evenement ajouté");
        onSuccess(evenement);
      }
  }

  return (
      <div>
    <form action={handleSubmitEvenement}>
      <Field.Root required>
        <Field.Label>
          Nom {/*<Field.RequiredIndicator />*/}
        </Field.Label>
        <Input name={"nom"} type={"text"} value={nom} onChange={(e) => setNom(e.target.value)} required />
      </Field.Root>
      <Select
          name="lieuId"
          value={lieuId?.toString() ?? ""}
          onValueChange={(e) => setLieuId(Number(e))}>
          <Field.Root required>
            <Field.Label>Lieu</Field.Label>
          </Field.Root>
          <Select.Trigger>
            <Select.Value placeholder="Sélectionner un lieu" />
          </Select.Trigger>

          <Select.Content>
            {lieuxMap.map((lieu) => (
                <Select.Item key={lieu.id} value={lieu.id.toString()}>
                  {lieu.libelle}
                  <Select.ItemIndicator />
                </Select.Item>
            ))}
          </Select.Content>
          <Button onClick={() => setShowCreateLieu(true)}>+</Button>
      </Select>
      {/* Format des datetime-local YYYY-MM-DDTHH:mm*/}
      <Field.Root required>
        <Field.Label>
          Début
          {/*<Field.RequiredIndicator />*/}
        </Field.Label>
        <Input
            name={"dateDebut"}
            type={"datetime-local"}
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            required
        />
      </Field.Root>
      <Field.Root required>
        <Field.Label>
          Fin {/*<Field.RequiredIndicator />*/}
        </Field.Label>
        <Input
            name={"dateFin"}
          type={"datetime-local"}
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
          required
        />
      </Field.Root>

      <Select
          name="categorieId"
          value={categorieId?.toString() ?? ""}
          onValueChange={(e) => setCategorieId(Number(e))}
      >
        <Box>
          <Field.Root required>
            <Field.Label>Catégorie</Field.Label>
          </Field.Root>
        </Box>

        <Box>
          <Select.Trigger>
            <Select.Value placeholder="Sélectionner une catégorie" />
          </Select.Trigger>

          <Select.Content>
            {categoriesMap.map((categorie) => (
                <Select.Item key={categorie.id} value={categorie.id.toString()}>
                  {categorie.nom}
                  <Select.ItemIndicator />
                </Select.Item>
            ))}
          </Select.Content>
        </Box>
        <Box>
          <Button onClick={() => setShowCreateCategorie(true)}>+</Button>
        </Box>
        {/*</GridItem>
        </SimpleGrid>*/}
      </Select>
      {/* TODO pouvoir sélectionner des participants */}
      {/*<SimpleGrid columns={{ base: 3, md: 3 }}>
          <GridItem colSpan={{ base: 1, md: 1 }}>*/}
            <Button onClick={onCancel}>Annuler</Button>
      {/*}</GridItem>
          <GridItem colSpan={{ base: 1, md: 1 }}>*/}
              <Button type={"submit"}>Créer</Button>
      {/*}</GridItem>
      </SimpleGrid>*/}
    </form>
      {showCreateLieu && (
          <Modal
              open={showCreateLieu}
              onOpenChange={setShowCreateLieu}
          >
            <Modal.Header>
              <Modal.Title>Lieu</Modal.Title>
              <Modal.Description>
                Créé un lieu s&#39;il n&#39;existe pas déjà
              </Modal.Description>
            </Modal.Header>
            <Modal.Content>
              <CreateLieuForm
                  idCompagnie={compagnieId}
                  onSuccess={( lieu) =>
                  {
                    const { id, libelle } = lieu;
                    setLieuxMap((prev) =>[ ...prev,{id,libelle}]);
                    setLieuId(id)
                    setShowCreateLieu(false)}}
                  onCancel={() => setShowCreateLieu(false)}
              />
            </Modal.Content>
          </Modal>
      )}
        {showCreateCategorie && (
          <Modal
          open={showCreateCategorie}
            onOpenChange={setShowCreateCategorie}>
            <Modal.Header>
              <Modal.Title>Catégorie</Modal.Title>
              <Modal.Description>
                Créé une nouvelle catégorie si elle n&#39;existe pas déjà
              </Modal.Description>
            </Modal.Header>
            <Modal.Content>
              <CreateCategorieForm
                  idCompagnie={compagnieId}
                  onSuccess={( categorie) =>
                  {
                    const { id, nom } = categorie;
                    setCategoriesMap((prev) =>[ ...prev,{id,nom}]);
                      setShowCreateCategorie(false)}}
                  onCancel={() => setShowCreateCategorie(false)}
              />
            </Modal.Content>
          </Modal>
        )}
    </div>
  );
}
