"use client";

import { Card, Text } from "@/components/ui";
import { formatMontant } from "../utils";
import { FaExclamationTriangle } from "react-icons/fa";
import { SpectacleEquilibre } from "./types";
import { NoteInfo, FadeContainer, BarreBudget, VoirToutLink } from "./shared";

export function EquilibreFinancier({ spectacles }: { spectacles: SpectacleEquilibre[] }) {
  return (
    <Card title="Équilibre financier des spectacles" className="h-full bg-white">
      <NoteInfo className="mb-6">
        Note : cette section compare le budget prévisionnel avec les dépenses et recettes réellement
        réalisées pour chaque spectacle.
      </NoteInfo>

      <FadeContainer>
        {spectacles.map((spec) => (
          <Card key={spec.nom} className="p-4 bg-white !gap-0 shadow-sm border border-gray-100 mb-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2 sm:gap-4">
              <Text className="text-sm font-semibold truncate w-full sm:w-1/3" title={spec.nom}>
                {spec.nom}
              </Text>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full flex-1">
                <div className="flex-1 sm:flex-none sm:w-48 flex justify-start sm:justify-center">
                  <BarreBudget
                    pourcentage={spec.pourcentageConsomme}
                    couleur={spec.montant >= 0 ? "green" : "red"}
                  />
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 min-w-fit">
                  {spec.montant < 0 && (
                    <span className="text-yellow-500 text-lg" title="Attention budget dépassé">
                      <FaExclamationTriangle />
                    </span>
                  )}
                  <Text className="text-sm font-semibold whitespace-nowrap">
                    {formatMontant(spec.montant, true)}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </FadeContainer>

      <VoirToutLink />
    </Card>
  );
}
