export interface Recette {
  id: string;
  nom: string;
  type: "facture" | "financement";
  date?: string;
  spectacles?: string[];
  montant: number;
  statut: "en_attente" | "paye";
  typeOp?: "RECETTE" | "DEPENSE";
  fichier?: string;
}

export interface Depense {
  id: string;
  nom: string;
  date?: string;
  spectacles?: string[];
  montant: number;
  typeOp?: "RECETTE" | "DEPENSE";
  fichier?: string;
}

export interface SpectacleEquilibre {
  nom: string;
  pourcentageConsomme: number;
  montant: number;
}
