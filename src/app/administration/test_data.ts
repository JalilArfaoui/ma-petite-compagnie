import { Recette, SpectacleEquilibre, Depense } from "./components";

export const RECETTES_DATA: Recette[] = [
  {
    id: "r1",
    nom: "Théâtre municipal des Lices",
    type: "facture",
    date: "2026-01-27",
    montant: 750,
    statut: "paye",
  },
  {
    id: "r2",
    nom: "Mairie Gaillac",
    type: "facture",
    date: "2026-01-17",
    montant: 300,
    statut: "paye",
  },
  {
    id: "r2-pending",
    nom: "Théâtre de Cordes",
    type: "facture",
    date: "2026-02-10",
    montant: 450,
    statut: "en_attente",
  },
  {
    id: "r3",
    nom: "DRAC Occitanie",
    type: "financement",
    spectacle: "Le Misanthrope",
    montant: 5000,
    statut: "en_attente",
  },
  {
    id: "r4",
    nom: "Ville d'Albi",
    type: "financement",
    spectacle: "Le Nuit des Rois",
    montant: 1150,
    statut: "paye",
  },
  {
    id: "r5",
    nom: "Conseil départemental",
    type: "financement",
    spectacle: "Le malade imaginaire",
    montant: 750,
    statut: "en_attente",
  },
];

export const DEPENSES_DATA: Depense[] = [
  {
    id: "d1",
    nom: "Décorations scène",
    date: "2026-01-22",
    montant: 400,
  },
  {
    id: "d2",
    nom: "Loyer local de répét",
    date: "2026-01-22",
    montant: 128,
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
