import NextAuth, { type DefaultSession } from "next-auth";

export type CompanyRights = {
  droitAccesDetailsCompagnie: boolean;
  droitModificationCompagnie: boolean;
  droitSuppressionCompagnie: boolean;
  droitAjoutMembre: boolean;
  droitSuppressionMembre: boolean;
  droitGestionDroitsMembres: boolean;
  droitAccesPlanning: boolean;
  droitGestionPlanning: boolean;
};

declare module "next-auth" {
  interface Session {
    activeCompanyId?: number | null;
    rights?: CompanyRights | null;
    companies?: { id: number; nom: string }[];
    user: {
      id: string;
      nom?: string | null;
      prenom?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    nom?: string | null;
    prenom?: string | null;
  }

  interface JWT {
    id: string;
    nom?: string | null;
    prenom?: string | null;
    activeCompanyId?: number | null;
    companies?: { id: number; nom: string }[];
    rights?: CompanyRights | null;
  }
}
