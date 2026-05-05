"use client";

import { Badge, Card, Container, Heading, SimpleGrid, Stack, Text } from "@/components/ui";
import { formatDateFr, formatMontant } from "../utils";
import { BoutonRetourAdministration, NoteInfo } from "../components/shared";
import type { TresorerieData, TresorerieMouvement } from "../finance-actions";

export default function TresorerieClient({ tresorerie }: { tresorerie: TresorerieData }) {
  return (
    <div className="min-h-screen bg-[#fffbef] font-sans pb-20 relative">
      <Container maxW="max-w-6xl" className="mx-auto pt-16 px-4">
        <BoutonRetourAdministration />

        <Stack className="mb-8">
          <Heading as="h3" className="text-primary mb-2">
            Trésorerie
          </Heading>
          <Heading as="h4" className="text-gray-900 italic font-serif text-3xl">
            Vue réelle des encaissements
          </Heading>
          <Text className="text-gray-600 text-xl mt-2">
            Solde actuel : {formatMontant(tresorerie.soldeActuel, true)}
          </Text>
        </Stack>

        <SimpleGrid gap={4} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <TresorerieStatCard
            label="Solde réel"
            value={formatMontant(tresorerie.soldeActuel, true)}
            tone={tresorerie.soldeActuel >= 0 ? "green" : "red"}
          />
          <TresorerieStatCard
            label="Encaissements"
            value={formatMontant(tresorerie.totalEncaisse)}
            tone="green"
          />
          <TresorerieStatCard
            label="Dépenses"
            value={formatMontant(tresorerie.totalDepense)}
            tone="red"
          />
          <TresorerieStatCard
            label="Dernier mouvement"
            value={
              tresorerie.derniereDateMouvement
                ? formatDateFr(tresorerie.derniereDateMouvement)
                : "Aucun"
            }
            tone="gray"
          />
        </SimpleGrid>

        <Card className="bg-white">
          <div className="flex flex-col gap-2 mb-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3 className="text-[1.25rem] md:text-[1.5rem] font-bold font-serif leading-tight tracking-tight">
                Mouvements réels
              </h3>
              <Badge variant="gray" className="w-fit">
                {tresorerie.nombreMouvements} mouvement
                {tresorerie.nombreMouvements !== 1 ? "s" : ""}
              </Badge>
            </div>
            <NoteInfo className="mb-0">
              Cette vue inclut uniquement les recettes payées et toutes les dépenses. Les recettes
              en attente ne sont pas prises en compte.
            </NoteInfo>
          </div>

          <div className="flex flex-col gap-3">
            {tresorerie.mouvements.map((mouvement) => (
              <MouvementCard key={mouvement.id} mouvement={mouvement} />
            ))}

            {tresorerie.mouvements.length === 0 && (
              <div className="text-sm text-center py-4 text-text-muted italic">
                Aucun mouvement réel trouvé.
              </div>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}

function TresorerieStatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "red" | "gray";
}) {
  const toneClass =
    tone === "green" ? "text-green-700" : tone === "red" ? "text-red-700" : "text-gray-900";

  return (
    <Card className="bg-white h-full border border-gray-100">
      <div className="flex flex-col gap-2">
        <Text className="text-sm text-text-muted">{label}</Text>
        <Text className={`text-2xl font-bold ${toneClass}`}>{value}</Text>
      </div>
    </Card>
  );
}

function MouvementCard({ mouvement }: { mouvement: TresorerieMouvement }) {
  const isEntree = mouvement.typeOp === "RECETTE";

  return (
    <Card className="p-4 bg-white !gap-0 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Text className="font-bold text-sm truncate" title={mouvement.nom}>
              {mouvement.nom}
            </Text>
            <Badge variant={isEntree ? "green" : "red"} className="text-[10px] px-2 py-0">
              {isEntree ? "Entrée" : "Sortie"}
            </Badge>
          </div>

          <Text className="text-xs text-text-muted mt-1">{formatDateFr(mouvement.date)}</Text>

          {mouvement.spectacles.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {mouvement.spectacles.map((spectacle) => (
                <Badge
                  key={spectacle}
                  variant="outline"
                  className="text-[9px] px-1.5 py-0 bg-gray-50 text-gray-600 border-gray-200"
                >
                  {spectacle}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Text
          className={`font-bold text-base whitespace-nowrap ${
            isEntree ? "text-green-700" : "text-red-700"
          }`}
        >
          {formatMontant(mouvement.montant, true)}
        </Text>
      </div>
    </Card>
  );
}
