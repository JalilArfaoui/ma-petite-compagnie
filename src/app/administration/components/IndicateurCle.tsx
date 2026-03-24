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
  // Fonction pour isoler les centimes et réduire leur taille visuelle
  const renderValeur = () => {
    if (typeof valeur === "string") {
      // Cherche le format (ex: "1 234) et (,50 €")
      const match = valeur.match(/^(.*?)(,\d{2}\s*€)$/);
      if (match) {
        return (
          <>
            {match[1]}
            <span className="text-[0.65em] font-medium opacity-70 ml-[2px]">{match[2]}</span>
          </>
        );
      }
    }
    return valeur;
  };

  return (
    <Card title={titre} className="h-full bg-white">
      <div className="flex items-baseline gap-2">
        <Text className="text-4xl text-gray-900">{renderValeur()}</Text>
        <Text className="text-gray-500">{sousTexte}</Text>
      </div>
    </Card>
  );
}
