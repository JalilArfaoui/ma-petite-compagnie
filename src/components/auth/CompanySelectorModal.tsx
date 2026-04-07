"use client";

import { useState } from "react";
import { Modal, Button, Text, Stack, Box } from "@/components/ui";
import { useSession } from "next-auth/react";
import { LuChevronRight, LuRepeat } from "react-icons/lu";

export function CompanySelectorModal({ trigger }: { trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const { data: session, update } = useSession();

  const handleSelect = async (companyId: number) => {
    setIsLoading(companyId);
    await update({ activeCompanyId: companyId });
    setIsLoading(null);
    setIsOpen(false);
  };

  const companies = session?.companies || [];

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <Modal.Trigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" icon={<LuRepeat />}>
            Changer
          </Button>
        )}
      </Modal.Trigger>
      <Modal.Content size="sm">
        <Modal.Header>
          <Modal.Title>Choisir une compagnie</Modal.Title>
          <Modal.Description>
            Sélectionnez la compagnie avec laquelle vous souhaitez travailler.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body className="pb-8">
          <Stack>
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => handleSelect(company.id)}
                disabled={isLoading !== null}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                  session?.activeCompanyId === company.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-slate-100 hover:border-primary/30 hover:bg-slate-50"
                }`}
              >
                <div>
                  <Text className="font-bold text-slate-900">{company.nom}</Text>
                  {session?.activeCompanyId === company.id && (
                    <Text className="text-[10px] text-primary font-medium mt-1">Actuelle</Text>
                  )}
                </div>
                {isLoading === company.id ? (
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                ) : (
                  <LuChevronRight className={`h-5 w-5 ${session?.activeCompanyId === company.id ? 'text-primary' : 'text-slate-300'}`} />
                )}
              </button>
            ))}
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
