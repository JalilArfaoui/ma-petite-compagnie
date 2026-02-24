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
    date: "le 27 janvier 2026",
    montant: "750 €",
    statut: "reçue",
    couleurStatut: "green",
  },
  {
    destinataire: "Mairie Gaillac",
    date: "le 17 janvier 2026",
    montant: "300 €",
    statut: "reçue",
    couleurStatut: "green",
  },
];

const PAIEMENTS_DATA: ItemFinancier[] = [
  {
    destinataire: "Décorations scène",
    date: "le 22 janvier 2026",
    montant: "400 €",
    statut: "payé",
    couleurStatut: "green",
  },
  {
    destinataire: "Loyer local de répét",
    date: "le 22 janvier 2026",
    montant: "128 €",
    statut: "non payé",
    couleurStatut: "red",
  },
];

const SPECTACLES_DATA: SpectacleEquilibre[] = [
  { nom: "Le Misanthrope", statut: "positif", budget: 80, realise: 100, montant: "+2 300 €" },
  { nom: "Le Nuit des Rois", statut: "positif", budget: 60, realise: 100, montant: "+1 150 €" },
  {
    nom: "Les Fourberies de Scapin",
    statut: "positif",
    budget: 50,
    realise: 100,
    montant: "+250 €",
  },
  { nom: "Le malade imaginaire", statut: "negatif", budget: 40, realise: 100, montant: "-760 €" },
  {
    nom: "Antigone",
    statut: "alerte",
    budget: 22,
    realise: 100,
    montant: "-1 200 €",
    alerte: true,
  },
];

const FINANCEMENTS_DATA: FinancementSubvention[] = [
  {
    organisme: "DRAC Occitanie",
    spectacle: "Le Misanthrope",
    montant: "5 000 €",
    statut: "en attente",
    type: "attente",
  },
  {
    organisme: "Ville d'Albi",
    spectacle: "Le Nuit des Rois",
    montant: "1 150 €",
    statut: "reçu",
    type: "recu",
  },
  {
    organisme: "Conseil départemental",
    spectacle: "Le malade imaginaire",
    montant: "750 €",
    statut: "en attente",
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
          <IndicateurCle titre="Factures" valeur={<span>320 €</span>} sousTexte="attendus" />
          <IndicateurCle titre="Spectacles en cours" valeur="5" sousTexte="spectacles actifs" />
          <IndicateurCle titre="Financements" valeur="4" sousTexte="dossiers en attente" />
        </div>

        {/* Section principale avec les 3 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6 items-start">
          <FacturesAvenir 
            factures={FACTURES_DATA} 
            paiements={PAIEMENTS_DATA} 
            totalFactures="+1 050 €"
            totalPaiements="-528 €"
          />
          <EquilibreFinancier spectacles={SPECTACLES_DATA} />
          <FinancementsSubventions financements={FINANCEMENTS_DATA} />
        </div>
      </Container>
    </div>
  );
}
