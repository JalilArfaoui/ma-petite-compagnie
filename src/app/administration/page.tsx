import { Heading, Container, Stack, Text, SimpleGrid, Toaster } from "@/components/ui";
import { FaBars } from "react-icons/fa";
import { IndicateurCle, RecettesSection, EquilibreFinancier, DepensesSection } from "./components";
import { formatMontant } from "./utils";
import { RECETTES_DATA, DEPENSES_DATA, SPECTACLES_DATA } from "./test_data";

// --- Page Principale ---

export default function PageAdministration() {
  return (
    <div className="min-h-screen bg-[#fffbef] font-sans pb-20 relative">
      <Toaster />
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
        <SimpleGrid gap={4} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <IndicateurCle titre="Trésorerie actuelle" valeur={formatMontant(12540)} sousTexte="" />
          <IndicateurCle titre="Recettes" valeur={formatMontant(8400)} sousTexte="attendues" />
          <IndicateurCle titre="Spectacles en cours" valeur="5" sousTexte="spectacles actifs" />
          <IndicateurCle titre="Dépenses" valeur={formatMontant(528)} sousTexte="réalisées" />
        </SimpleGrid>

        {/* Section principale avec les 3 colonnes */}
        <SimpleGrid
          gap={6}
          className="grid-cols-1 lg:grid-cols-[1.1fr_1.5fr_1.1fr] items-start min-w-0"
        >
          <RecettesSection initialRecettes={RECETTES_DATA} />
          <EquilibreFinancier spectacles={SPECTACLES_DATA} />
          <DepensesSection initialDepenses={DEPENSES_DATA} />
        </SimpleGrid>
      </Container>
    </div>
  );
}
