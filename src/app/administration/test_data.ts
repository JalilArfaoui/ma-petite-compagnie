import { Recette, SpectacleEquilibre, Depense } from "./components/types";

// note dev :
// fichier contenant les jeux de données de test
// données fictives pour le moment
// la connexion à la bdd sera ultérieure

export const LISTE_SPECTACLES = [
  "Le Misanthrope",
  "Le Nuit des Rois",
  "Les Fourberies de Scapin",
  "Le malade imaginaire",
  "Antigone",
  "L'Avare",
  "Cyrano de Bergerac",
];

export const RECETTES_DATA: Recette[] = [
  {
    id: "r-init",
    nom: "Fonds de roulement initial",
    type: "financement",
    date: "2025-12-01",
    spectacles: [],
    montant: 10600.83,
    statut: "paye",
  },
  {
    id: "r1",
    nom: "Théâtre municipal des Lices",
    type: "facture",
    date: "2026-01-27",
    spectacles: ["Le Misanthrope"],
    montant: 750.5,
    statut: "paye",
  },
  {
    id: "r2",
    nom: "Mairie Gaillac",
    type: "facture",
    date: "2026-01-17",
    spectacles: [],
    montant: 300.25,
    statut: "paye",
  },
  {
    id: "r2-pending",
    nom: "Théâtre de Cordes",
    type: "facture",
    date: "2026-02-10",
    spectacles: ["Le Nuit des Rois", "Le malade imaginaire"],
    montant: 450,
    statut: "en_attente",
  },
  {
    id: "r3",
    nom: "DRAC Occitanie",
    type: "financement",
    date: "2026-01-10",
    spectacles: ["Le Misanthrope"],
    montant: 5000,
    statut: "en_attente",
  },
  {
    id: "r4",
    nom: "Ville d'Albi",
    type: "financement",
    date: "2026-01-15",
    spectacles: ["Le Nuit des Rois"],
    montant: 1150,
    statut: "paye",
  },
  {
    id: "r5",
    nom: "Conseil départemental",
    type: "financement",
    date: "2026-01-20",
    spectacles: ["Le malade imaginaire"],
    montant: 750,
    statut: "en_attente",
  },
];

export const DEPENSES_DATA: Depense[] = [
  {
    id: "d1",
    nom: "Décorations scène",
    date: "2026-01-22",
    spectacles: ["Le malade imaginaire", "Antigone"],
    montant: 400,
  },
  {
    id: "d2",
    nom: "Loyer local de répét",
    date: "2026-01-22",
    spectacles: [],
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
