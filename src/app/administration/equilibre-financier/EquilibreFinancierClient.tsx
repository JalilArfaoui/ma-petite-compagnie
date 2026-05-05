"use client";

import { Badge, Card, Container, Heading, SimpleGrid, Stack, Text } from "@/components/ui";
import { FaExclamationTriangle } from "react-icons/fa";
import { formatMontant } from "../utils";
import { SpectacleEquilibre } from "../components/types";
import { BarreBudget, BoutonRetourAdministration, NoteInfo } from "../components/shared";

export default function EquilibreFinancierClient({
  spectacles,
}: {
  spectacles: SpectacleEquilibre[];
}) {
  const soldeGlobal = spectacles.reduce((total, spectacle) => total + spectacle.montant, 0);

  return (
    <div className="min-h-screen bg-[#fffbef] font-sans pb-20 relative">
      <Container maxW="max-w-6xl" className="mx-auto pt-16 px-4">
        <BoutonRetourAdministration />

        <Stack className="mb-8">
          <Heading as="h3" className="text-primary mb-2">
            Équilibre financier
          </Heading>
          <Heading as="h4" className="text-gray-900 italic font-serif text-3xl">
            Vue complète par spectacle
          </Heading>
          <Text className="text-gray-600 text-xl mt-2">
            Solde global : {formatMontant(soldeGlobal, true)}
          </Text>
        </Stack>

        <Card className="bg-white">
          <div className="flex flex-col gap-2 mb-1">
            <h3 className="text-[1.25rem] md:text-[1.5rem] font-bold font-serif leading-tight tracking-tight">
              Tous les spectacles
            </h3>
            <NoteInfo className="mb-0">
              Le solde correspond au budget initial augmenté des recettes payées, puis diminué des
              dépenses. Les recettes en attente sont affichées séparément.
            </NoteInfo>
          </div>

          <div className="flex flex-col gap-3">
            {spectacles.map((spectacle) => {
              const isNegatif = spectacle.montant < 0;

              return (
                <Card
                  key={spectacle.id}
                  className="p-4 bg-white !gap-0 shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Text className="font-bold text-base truncate" title={spectacle.nom}>
                            {spectacle.nom}
                          </Text>
                          {isNegatif && (
                            <span
                              className="text-yellow-500 text-base flex-shrink-0"
                              title="Attention budget dépassé"
                            >
                              <FaExclamationTriangle />
                            </span>
                          )}
                        </div>
                        <Text className="text-xs text-text-muted mt-1">
                          Budget consommé : {Math.round(spectacle.pourcentageConsomme)} %
                        </Text>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-2">
                        <Badge variant={isNegatif ? "red" : "green"}>
                          Solde {formatMontant(spectacle.montant, true)}
                        </Badge>
                        <BarreBudget
                          pourcentage={spectacle.pourcentageConsomme}
                          couleur={isNegatif ? "red" : "green"}
                        />
                      </div>
                    </div>

                    <SimpleGrid gap={3} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                      <MontantCell label="Budget initial" value={spectacle.budgetInitial} />
                      <MontantCell label="Recettes payées" value={spectacle.recettesPayees} />
                      <MontantCell
                        label="Recettes en attente"
                        value={spectacle.recettesEnAttente}
                      />
                      <MontantCell label="Dépenses" value={spectacle.depenses} />
                      <MontantCell label="Solde" value={spectacle.montant} showSign />
                    </SimpleGrid>
                  </div>
                </Card>
              );
            })}

            {spectacles.length === 0 && (
              <div className="text-sm text-center py-4 text-text-muted italic">
                Aucun spectacle trouvé.
              </div>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}

function MontantCell({
  label,
  value,
  showSign = false,
}: {
  label: string;
  value: number;
  showSign?: boolean;
}) {
  return (
    <div className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2 min-w-0">
      <Text className="text-[11px] text-text-muted uppercase tracking-wide truncate">{label}</Text>
      <Text className="font-bold text-sm mt-1 truncate" title={formatMontant(value, showSign)}>
        {formatMontant(value, showSign)}
      </Text>
    </div>
  );
}
