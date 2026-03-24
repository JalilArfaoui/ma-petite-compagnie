"use client";

import { Text, Card } from "@/components/ui";

export function IndicateurCle({
  titre,
  valeur,
  sousTexte,
}: {
  titre: string;
  valeur: React.ReactNode;
  sousTexte: string;
}) {
  return (
    <Card title={titre} className="h-full bg-white">
      <div className="flex items-baseline gap-2">
        <Text className="text-4xl text-gray-900">{valeur}</Text>
        <Text className="text-gray-500">{sousTexte}</Text>
      </div>
    </Card>
  );
}
