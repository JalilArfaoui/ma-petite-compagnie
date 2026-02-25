import { Heading, Container, Stack, Text } from "@/components/ui";
import { FaBars } from "react-icons/fa";
import {
  IndicateurCle,
  FacturesAvenir,
  EquilibreFinancier,
  FinancementsSubventions,
} from "./components";
import { formatMontant } from "./utils";
import {
  FACTURES_DATA,
  PAIEMENTS_DATA,
  SPECTACLES_DATA,
  FINANCEMENTS_DATA,
} from "./test_data";

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
          <IndicateurCle titre="Trésorerie actuelle" valeur={formatMontant(12540)} sousTexte="" />
          <IndicateurCle titre="Factures" valeur={formatMontant(320)} sousTexte="attendus" />
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
