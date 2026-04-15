export interface Recette {
  id: string;
  nom: string;
  type: "facture" | "financement";
  date?: string;
  spectacles?: string[];
  montant: number;
  statut: "en_attente" | "paye";
  fichier?: string;
}

export interface Depense {
  id: string;
  nom: string;
  date?: string;
  spectacles?: string[];
  montant: number;
  fichier?: string;
}

export interface SpectacleEquilibre {
  nom: string;
  pourcentageConsomme: number;
  montant: number;
}
