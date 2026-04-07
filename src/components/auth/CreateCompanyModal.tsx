"use client";

import { useState } from "react";
import { Modal, Button, Input, Text, Stack, Heading } from "@/components/ui";
import { createCompany } from "@/app/(auth)/company-actions";
import { useSession } from "next-auth/react";
import { LuPlus } from "react-icons/lu";

export function CreateCompanyModal({ trigger }: { trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { update } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createCompany(formData);

    if (res.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      await update(); // Refresh session to get new company
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <Modal.Trigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" icon={<LuPlus />}>
            Créer une compagnie
          </Button>
        )}
      </Modal.Trigger>
      <Modal.Content size="sm">
        <Modal.Header>
          <Modal.Title>Nouvelle compagnie</Modal.Title>
          <Modal.Description>
            Donnez un nom à votre nouvelle structure.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
              {error}
            </div>
          )}
          <form id="create-company-form" onSubmit={handleSubmit}>
            <Stack>
              <div>
                <Text className="mb-2 font-medium text-sm">Nom de la compagnie</Text>
                <Input 
                  name="nom" 
                  placeholder="Ex: La Compagnie du Soleil" 
                  required 
                  autoFocus
                />
              </div>
            </Stack>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
          <Button 
            type="submit" 
            form="create-company-form" 
            disabled={isLoading}
          >
            {isLoading ? "Création..." : "Créer"}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
