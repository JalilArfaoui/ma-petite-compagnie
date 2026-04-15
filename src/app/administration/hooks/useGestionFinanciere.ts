import { useState, useMemo } from "react";
import { toaster } from "@/components/ui";
import { DonneesAjoutFinancier } from "../modals";

export function useGestionFinanciere<
  T extends { id: string; nom: string; date?: string; montant: number },
>(initialData: T[], nomType: string) {
  const [items, setItems] = useState<T[]>(initialData);
  const [itemEnEdition, setItemEnEdition] = useState<T | null>(null);
  const [itemASupprimer, setItemASupprimer] = useState<T | null>(null);

  const total = useMemo(() => items.reduce((acc, item) => acc + item.montant, 0), [items]);

  const itemsTries = useMemo(() => {
    return [...items].sort(
      (a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
    );
  }, [items]);

  const handleAdd = (data: DonneesAjoutFinancier, mapping: (d: DonneesAjoutFinancier) => T) => {
    const nouvelItem = mapping(data);
    setItems((prev) => [nouvelItem, ...prev]);
    toaster.success({ title: `${nomType} ajouté${nomType.endsWith("e") ? "e" : ""}` });
  };

  const handleEdit = (data: DonneesAjoutFinancier, mapping: (d: DonneesAjoutFinancier) => T) => {
    if (!data.id) return;

    setItems((prev) => prev.map((item) => (item.id === data.id ? mapping(data) : item)));
    setItemEnEdition(null);
    toaster.success({ title: `${nomType} modifié${nomType.endsWith("e") ? "e" : ""}` });
  };

  const handleDelete = () => {
    if (!itemASupprimer) return;
    // TODO(BDD): Supprimer l'item en base de données (ex: prisma.depense.delete)
    setItems((prev) => prev.filter((item) => item.id !== itemASupprimer.id));
    setItemASupprimer(null);
    toaster.success({ title: `${nomType} supprimé${nomType.endsWith("e") ? "e" : ""}` });
  };

  return {
    items,
    setItems,
    itemsTries,
    total,
    itemEnEdition,
    setItemEnEdition,
    itemASupprimer,
    setItemASupprimer,
    handleAdd,
    handleEdit,
    handleDelete,
  };
}
