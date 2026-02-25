import { Heading, Container, Stack, Text } from "@/components/ui";
import { FaBars } from "react-icons/fa";
import {
  IndicateurCle,
  FacturesAvenir,
  EquilibreFinancier,
  FinancementsSubventions,
  ItemFinancier,
  SpectacleEquilibre,
  FinancementSubvention,
} from "./components";

// --- Données fictives ---

const FACTURES_DATA: ItemFinancier[] = [
  {
    destinataire: "Théâtre municipal des Lices",
    date: "2026-01-27",
    montant: 750,
    statut: "recue",
    couleurStatut: "green",
  },
  {
    destinataire: "Mairie Gaillac",
    date: "2026-01-17",
    montant: 300,
    statut: "recue",
    couleurStatut: "green",
  },
];

const PAIEMENTS_DATA: ItemFinancier[] = [
  {
    destinataire: "Décorations scène",
    date: "2026-01-22",
    montant: 400,
    statut: "paye",
    couleurStatut: "green",
  },
  {
    destinataire: "Loyer local de répét",
    date: "2026-01-22",
    montant: 128,
    statut: "non_paye",
    couleurStatut: "red",
  },
];

const SPECTACLES_DATA: SpectacleEquilibre[] = [
  { nom: "Le Misanthrope", budget: 80, montant: 2300 },
  { nom: "Le Nuit des Rois", budget: 60, montant: 1150 },
  {
    nom: "Les Fourberies de Scapin",
    budget: 50,
    montant: 250,
  },
  { nom: "Le malade imaginaire", budget: 40, montant: -760 },
  {
    nom: "Antigone",
    budget: 22,
    montant: -1200,
    alerte: true,
  },
];

const FINANCEMENTS_DATA: FinancementSubvention[] = [
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

// --- Page Principale ---

export default function PageAdministration() {
  return (
    <div className="min-h-screen bg-[#fffbef] font-sans pb-20 relative">
      {/* Bouton de menu déroulant en haut à gauche */}
      {/* Simule un bouton (code mort) avant que le groupe SOCLE implémente la sidebar dépliable */}
      <div className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer text-gray-600 hover:text-primary transition-colors">
        <FaBars className="text-xl" />
      </div>

      <Container maxW="max-w-6xl" className="mx-auto pt-16 px-4">
        {/* En-tête de la page */}
        <Stack className="mb-10">
          <Heading as="h3" className="text-primary mb-2">
            Administration & finances
          </Heading>
          <Heading as="h4" className="text-gray-900 italic font-serif text-3xl">
            Gestion de la troupe
          </Heading>
          <Text className="text-gray-600 text-xl mt-2">Vue d&apos;ensemble financière</Text>
        </Stack>

        {/* Ligne des cartes indicateurs clés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-nowrap mb-12">
          <IndicateurCle titre="Trésorerie actuelle" valeur="12 540 €" sousTexte="" />
          <IndicateurCle titre="Factures" valeur="320 €" sousTexte="attendus" />
          <IndicateurCle titre="Spectacles en cours" valeur="5" sousTexte="spectacles actifs" />
          <IndicateurCle titre="Financements" valeur="4" sousTexte="dossiers en attente" />
        </div>

        {/* Section principale avec les 3 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6 items-start">
          <FacturesAvenir
            factures={FACTURES_DATA}
            paiements={PAIEMENTS_DATA}
            totalFactures={1050}
            totalPaiements={-528}
          />
          <EquilibreFinancier spectacles={SPECTACLES_DATA} />
          <FinancementsSubventions financements={FINANCEMENTS_DATA} />
        </div>
      </Container>
    </div>
  );
}
