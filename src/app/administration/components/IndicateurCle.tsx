"use client";

import { Text, Card, Link } from "@/components/ui";

export function IndicateurCle({
  titre,
  valeur,
  sousTexte,
  href,
}: {
  titre: string;
  valeur: React.ReactNode;
  sousTexte: string;
  href?: string;
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

  const content = (
    <Card
      title={titre}
      role="button"
      tabIndex={0}
      className="h-full bg-white cursor-pointer transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px] active:scale-[0.98] group border border-transparent hover:border-primary-light/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
    >
      <div className="flex items-baseline gap-2">
        <Text className="text-4xl text-gray-900">{renderValeur()}</Text>
        <Text className="text-gray-500">{sousTexte}</Text>
      </div>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
