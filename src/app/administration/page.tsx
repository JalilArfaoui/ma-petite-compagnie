"use client";

import { useState } from "react";
import { Heading, Container, Stack, Text, SimpleGrid, Toaster } from "@/components/ui";
import {
  IndicateurCle,
  RecettesSection,
  EquilibreFinancier,
  DepensesSection,
  Recette,
  Depense,
} from "./components";
import { formatMontant } from "./utils";
import { RECETTES_DATA, DEPENSES_DATA, SPECTACLES_DATA } from "./test_data";

// --- Page Principale ---

export default function PageAdministration() {
  const [recettes, setRecettes] = useState<Recette[]>(RECETTES_DATA);
  const [depenses, setDepenses] = useState<Depense[]>(DEPENSES_DATA);

  const totalRecettes = recettes.reduce((acc, r) => acc + r.montant, 0);
  const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);

  // La Trésorerie est calculée uniquement sur la base des données (fictives pour le moment) :
  // Recettes réellement encaissées (avec le statut "paye") - Dépenses
  const totalPaye = recettes
    .filter((r) => r.statut === "paye")
    .reduce((acc, r) => acc + r.montant, 0);
  const tresorerieActuelle = totalPaye - totalDepenses;

  const nomsSpectacles = SPECTACLES_DATA.map((s) => s.nom);

  return (
    <div className="min-h-screen bg-[#fffbef] font-sans pb-20 relative">
      <Toaster />
      <Container maxW="max-w-6xl" className="mx-auto pt-16 px-4">
        {/* en tete de la page */}
        <Stack className="mb-10">
          <Heading as="h3" className="text-primary mb-2">
            Administration & finances
          </Heading>
          <Heading as="h4" className="text-gray-900 italic font-serif text-3xl">
            Gestion de la troupe
          </Heading>
          <Text className="text-gray-600 text-xl mt-2">Vue d&apos;ensemble financière</Text>
        </Stack>

        {/* cards indicateurs clés */}
        <SimpleGrid gap={4} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <IndicateurCle
            titre="Trésorerie actuelle"
            valeur={formatMontant(tresorerieActuelle)}
            sousTexte=""
            href="#"
          />
          <IndicateurCle
            titre="Recettes"
            valeur={formatMontant(totalRecettes)}
            sousTexte="réalisées"
            href="/administration/recettes"
          />
          <IndicateurCle
            titre="Dépenses"
            valeur={formatMontant(totalDepenses)}
            sousTexte="payées"
            href="/administration/depenses"
          />
          <IndicateurCle
            titre="Gestion des cachets"
              valeur="5"
              sousTexte="cachets en attente"
              href="/administration/gestion-cachets"
          />
        </SimpleGrid>

        {/* section principale avec les 3 colonnes */}
        <SimpleGrid
          gap={6}
          className="grid-cols-1 lg:grid-cols-[1.1fr_1.5fr_1.1fr] items-start min-w-0"
        >
          <RecettesSection
            recettes={recettes}
            setRecettes={setRecettes}
            spectacles={nomsSpectacles}
          />
          <EquilibreFinancier spectacles={SPECTACLES_DATA} />
          <DepensesSection
            depenses={depenses}
            setDepenses={setDepenses}
            spectacles={nomsSpectacles}
          />
        </SimpleGrid>
      </Container>
    </div>
  );
}
