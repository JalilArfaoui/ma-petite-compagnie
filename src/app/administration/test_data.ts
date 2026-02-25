import { ItemFinancier, SpectacleEquilibre, FinancementSubvention } from "./components";

export const FACTURES_DATA: ItemFinancier[] = [
  {
    destinataire: "Théâtre municipal des Lices",
    date: "2026-01-27",
    montant: 750,
    statut: "recue",
  },
  {
    destinataire: "Mairie Gaillac",
    date: "2026-01-17",
    montant: 300,
    statut: "recue",
  },
];

export const PAIEMENTS_DATA: ItemFinancier[] = [
  {
    destinataire: "Décorations scène",
    date: "2026-01-22",
    montant: 400,
    statut: "paye",
  },
  {
    destinataire: "Loyer local de répét",
    date: "2026-01-22",
    montant: 128,
    statut: "non_paye",
  },
];

export const SPECTACLES_DATA: SpectacleEquilibre[] = [
  { nom: "Le Misanthrope", pourcentageConsomme: 80, montant: 2300 },
  { nom: "Le Nuit des Rois", pourcentageConsomme: 60, montant: 1150 },
  {
    nom: "Les Fourberies de Scapin",
    pourcentageConsomme: 50,
    montant: 250,
  },
  { nom: "Le malade imaginaire", pourcentageConsomme: 40, montant: -760 },
  {
    nom: "Antigone",
    pourcentageConsomme: 22,
    montant: -1200,
  },
];

export const FINANCEMENTS_DATA: FinancementSubvention[] = [
  {
    organisme: "DRAC Occitanie",
    spectacle: "Le Misanthrope",
    montant: 5000,
    statut: "en_attente",
    type: "attente",
  },
  {
    organisme: "Ville d'Albi",
    spectacle: "Le Nuit des Rois",
    montant: 1150,
    statut: "recu",
    type: "recu",
  },
  {
    organisme: "Conseil départemental",
    spectacle: "Le malade imaginaire",
    montant: 750,
    statut: "en_attente",
    type: "attente",
  },
];
