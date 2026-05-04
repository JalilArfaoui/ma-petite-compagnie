export type MemberUser = { id: number; nom: string | null; prenom: string | null; email: string };

export type MemberRights = {
  droitAccesDetailsCompagnie: boolean;
  droitModificationCompagnie: boolean;
  droitSuppressionCompagnie: boolean;
  droitAjoutMembre: boolean;
  droitSuppressionMembre: boolean;
  droitGestionDroitsMembres: boolean;
  droitAccesPlanning: boolean;
  droitGestionPlanning: boolean;
};

export type Member = MemberRights & {
  id: number;
  userId: number;
  compagnieId: number;
  user: MemberUser;
};

export type CompagnieData = { id: number; nom: string; membres: Member[] };

export const RIGHTS_LABELS: { key: keyof MemberRights; label: string }[] = [
  { key: "droitAccesDetailsCompagnie", label: "Accès aux détails de la compagnie" },
  { key: "droitAccesPlanning", label: "Accès au planning" },
  { key: "droitGestionPlanning", label: "Gérer le planning" },
  { key: "droitAjoutMembre", label: "Ajouter des membres" },
  { key: "droitSuppressionMembre", label: "Retirer des membres" },
  { key: "droitGestionDroitsMembres", label: "Gérer les droits" },
  { key: "droitModificationCompagnie", label: "Modifier la compagnie" },
  { key: "droitSuppressionCompagnie", label: "Supprimer la compagnie" },
];

export const EMPTY_RIGHTS: MemberRights = {
  droitAccesDetailsCompagnie: false,
  droitModificationCompagnie: false,
  droitSuppressionCompagnie: false,
  droitAjoutMembre: false,
  droitSuppressionMembre: false,
  droitGestionDroitsMembres: false,
  droitAccesPlanning: false,
  droitGestionPlanning: false,
};
