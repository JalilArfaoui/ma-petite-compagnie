"use client"

import { CreateEvenementForm } from "@/app/composants/evenements/CreateEvenementForm"
import {useState} from "react";
import {Modal} from "@/components/ui/Modal/Modal";
import {Button} from "@/components/ui";

export default function CreateEvenementPage() {
    const [showCreateLieu, setShowCreateLieu] = useState(false)

    return (
      <div>
          <Button onClick={() => setShowCreateLieu(true)}>
              + Ajouter un event
          </Button>
        <h1>Création d’un évènement (dev)</h1>
          {showCreateLieu && (
              <Modal
                  open={showCreateLieu}
                  onClose={() => setShowCreateLieu(false)}>
                  <CreateEvenementForm
                      lieux={[]}
                      categories={[]}
                      compagnieId={1}
                      onSuccess={(lieu) => {
                          setShowCreateLieu(false)
                      }}
                      onCancel={() => setShowCreateLieu(false)}
                  />
              </Modal>
          )}
      </div>
    );
}