"use client"

import { CreateEvenementForm } from "@/app/composants/evenements/CreateEvenementForm"

export default function CreateEvenementPage() {

    return (
      <div>
        <h1>Création d’un évènement (dev)</h1>
              <CreateEvenementForm
                  lieux={[]}
                  categories={[]}
                  compagnieId={1}
                  onSuccess={() => {}}
                  onCancel={() => {}}
              />
      </div>
    );
}