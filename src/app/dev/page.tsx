"use client"

import { CreateEvenementForm } from "@/app/composants/evenements/CreateEvenementForm"

export default function CreateEvenementPage() {

    
import {getCategories} from "@/app/actions/categorie";
import {getLieux} from "@/app/actions/lieu";
import {useState, useEffect} from "react";

export default function CreateEvenementPage() {
    const [categories, setCategories] = useState<{ id: number; nom: string }[]>([]);

    useEffect(() => {
        async function fetchDataCategorie() {
            const result = (await getCategories()).categories;
            const mapped = result?.map(({ id, nom }) => ({ id, nom })) ?? [];
            setCategories(mapped);
        }

        fetchDataCategorie();
    }, []);

    const [lieux, setLieux] = useState<{ id: number, libelle: string }[]>([]);

    useEffect(() => {
        async function fetchDataLieu() {
            const result = (await getLieux()).lieux;
            const mapped = result?.map(({ id, libelle }) => ({ id, libelle })) ?? [];
            setLieux(mapped);
        }

        fetchDataLieu();
    }, []);

    return (
      <div>
        <h1>Création d’un évènement (dev)</h1>
              <CreateEvenementForm
                  lieux={lieux}
                  categories={categories}
                  compagnieId={1}
                  onSuccess={() => {}}
                  onCancel={() => {}}
              />
      </div>
    );
}