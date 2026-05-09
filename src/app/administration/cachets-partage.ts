//stockage des fonctions, variables, constantes pour les cachets partagés entre les pages de gestion et de vision des cachets

import { Prisma, StatutCachet } from "@prisma/client";

export const MONTANT_CACHET_MINIMUM_LEGAL = 110;
export const NOTE_NB_MAX_CARACS = 120;

export const PAGE_SIZE = 20;

export const STATUT_DICT: Record<StatutCachet, string> = {
  [StatutCachet.NON_PAYE]: "Non payé",
  [StatutCachet.EN_ATTENTE_DE_PAIEMENT]: "En attente de paiement",
  [StatutCachet.PAYE]: "Payé",
};

//seule la note est optionnelle, toutes les autres clés sont obligatoires donc pas de null permis
export type Cachet = {
  id: number;
  membreId: number;
  membre: { user: { nom: string | null; prenom: string | null } };
  date: string;
  montant: string;
  spectacleId: number;
  spectacle: { titre: string };
  statut: StatutCachet;
  note?: string | null;
};

//type pour représenter le Cachet retourné par Prisma avant transformation
export type CachetAvecRelations = Prisma.CachetGetPayload<{
  include: {
    membre: {
      include: {
        user: true;
      };
    };
    spectacle: true;
  };
}>;

//fonction helper pour transformer les données de Prisma au format du state local
export function formateCachet(data: CachetAvecRelations): Cachet {
  return {
    ...data,
    montant: data.montant.toString(),
    date: typeof data.date === "string" ? data.date : data.date.toISOString().split("T")[0],
  };
}
