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
        {spectacles.map((spec, idx) => (
          <Card key={idx} className="p-4 bg-white !gap-0 shadow-sm border border-gray-100 mb-1">
            <div className="flex justify-between items-center w-full">
              <Text className="text-sm font-semibold truncate w-1/3 pr-2" title={spec.nom}>
                {spec.nom}
              </Text>

              <div className="flex-1 flex justify-center">
                <BarreBudget
                  pourcentage={spec.pourcentageConsomme}
                  couleur={spec.montant >= 0 ? "green" : "red"}
                />
              </div>

              <div className="w-1/3 text-right flex justify-end items-center gap-2 pl-2">
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
          </Card>
        ))}
      </FadeContainer>

      <VoirToutLink />
    </Card>
  );
}
