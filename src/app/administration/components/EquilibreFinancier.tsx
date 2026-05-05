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
          <Card
            key={spec.nom}
            className="p-4 bg-white !gap-0 shadow-sm border border-gray-100 mb-1"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_90px] items-start sm:items-center w-full gap-2 sm:gap-4">
              <Text className="text-sm font-semibold truncate" title={spec.nom}>
                {spec.nom}
              </Text>

              <div className="flex sm:justify-center">
                <BarreBudget
                  pourcentage={spec.pourcentageConsomme}
                  couleur={spec.montant >= 0 ? "green" : "red"}
                />
              </div>

              <div className="flex items-center justify-end gap-2 flex-shrink-0">
                {spec.montant < 0 && (
                  <span className="text-yellow-500 text-lg" title="Attention budget dépassé">
                    <FaExclamationTriangle />
                  </span>
                )}
                <Text className="text-sm font-semibold whitespace-nowrap text-right min-w-[75px]">
                  {formatMontant(spec.montant, true)}
                </Text>
              </div>
            </div>
          </Card>
        ))}
      </FadeContainer>

      <VoirToutLink href="/administration" />
    </Card>
  );
}
