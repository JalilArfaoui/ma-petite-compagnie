"use client"

import { CreateEvenementForm } from "@/app/composants/evenements/CreateEvenementForm"
import {getCategories} from "@/app/actions/categorie";
import {getLieux} from "@/app/actions/lieu";
import {useState, useEffect} from "react";

export default function CreateEvenementPage() {

    return (
      <div>
        <h1>Création d’un évènement (dev)</h1>
              <CreateEvenementForm
                  compagnieId={1}
                  onSuccess={() => {}}
                  onCancel={() => {}}
              />
      </div>
    );
}