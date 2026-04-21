"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { CompanyMember } from "@prisma/client";

type ActionError = { error: string };

async function requireRight<K extends keyof CompanyMember>(
  userId: number,
  compagnieId: number,
  right: K
): Promise<CompanyMember | ActionError> {
  const member = await prisma.companyMember.findUnique({
    where: { userId_compagnieId: { userId, compagnieId } },
  });
  if (!member?.[right]) return { error: "Vous n'avez pas les droits nécessaires" };
  return member;
}

function isError(value: CompanyMember | ActionError): value is ActionError {
  return "error" in value;
}

export async function addMemberByEmail(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Vous devez être connecté" };

  const compagnieId = Number(formData.get("compagnieId"));
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email) return { error: "Adresse email requise" };

  try {
    const memberOrError = await requireRight(
      Number(session.user.id),
      compagnieId,
      "droitAjoutMembre"
    );
    if (isError(memberOrError)) return memberOrError;

    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) return { error: "Aucun compte trouvé avec cette adresse email" };
    if (userToAdd.id === Number(session.user.id))
      return { error: "Vous êtes déjà membre de cette compagnie" };

    const existing = await prisma.companyMember.findUnique({
      where: { userId_compagnieId: { userId: userToAdd.id, compagnieId } },
    });
    if (existing) return { error: "Cet utilisateur est déjà membre de cette compagnie" };

    const canSetRights = memberOrError.droitGestionDroitsMembres;

    await prisma.companyMember.create({
      data: {
        userId: userToAdd.id,
        compagnieId,
        ...(canSetRights && {
          droitAccesDetailsCompagnie: formData.get("droitAccesDetailsCompagnie") === "true",
          droitModificationCompagnie: formData.get("droitModificationCompagnie") === "true",
          droitSuppressionCompagnie: formData.get("droitSuppressionCompagnie") === "true",
          droitAjoutMembre: formData.get("droitAjoutMembre") === "true",
          droitSuppressionMembre: formData.get("droitSuppressionMembre") === "true",
          droitGestionDroitsMembres: formData.get("droitGestionDroitsMembres") === "true",
          droitAccesPlanning: formData.get("droitAccesPlanning") === "true",
          droitGestionPlanning: formData.get("droitGestionPlanning") === "true",
        }),
      },
    });
    revalidatePath(`/compagnie/${compagnieId}`);
    return {
      success: true,
      nom: `${userToAdd.prenom ?? ""} ${userToAdd.nom ?? ""}`.trim() || email,
    };
  } catch {
    return { error: "Erreur lors de l'ajout du membre" };
  }
}

export async function updateCompany(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Vous devez être connecté" };

  const id = Number(formData.get("id"));
  const nom = formData.get("nom") as string;

  if (!nom || nom.length < 2) return { error: "Le nom est trop court" };

  try {
    const memberOrError = await requireRight(
      Number(session.user.id),
      id,
      "droitModificationCompagnie"
    );
    if (isError(memberOrError)) return memberOrError;

    const company = await prisma.compagnie.update({ where: { id }, data: { nom } });
    revalidatePath("/profil");
    return { success: true, company };
  } catch {
    return { error: "Erreur lors de la modification" };
  }
}

export async function deleteCompany(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Vous devez être connecté" };

  const id = Number(formData.get("id"));

  try {
    const memberOrError = await requireRight(
      Number(session.user.id),
      id,
      "droitSuppressionCompagnie"
    );
    if (isError(memberOrError)) return memberOrError;

    await prisma.compagnie.delete({ where: { id } });
    revalidatePath("/profil");
    return { success: true };
  } catch {
    return { error: "Erreur lors de la suppression" };
  }
}

export async function removeMember(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Vous devez être connecté" };

  const compagnieId = Number(formData.get("compagnieId"));
  const memberId = Number(formData.get("memberId"));

  try {
    const memberOrError = await requireRight(
      Number(session.user.id),
      compagnieId,
      "droitSuppressionMembre"
    );
    if (isError(memberOrError)) return memberOrError;

    const target = await prisma.companyMember.findUnique({ where: { id: memberId } });
    if (!target || target.compagnieId !== compagnieId) return { error: "Membre introuvable" };
    if (target.userId === Number(session.user.id))
      return { error: "Vous ne pouvez pas vous retirer vous-même" };

    await prisma.companyMember.delete({ where: { id: memberId } });
    revalidatePath(`/compagnie/${compagnieId}`);
    return { success: true };
  } catch {
    return { error: "Erreur lors de la suppression du membre" };
  }
}

export async function updateMemberRights(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Vous devez être connecté" };

  const compagnieId = Number(formData.get("compagnieId"));
  const memberId = Number(formData.get("memberId"));

  try {
    const memberOrError = await requireRight(
      Number(session.user.id),
      compagnieId,
      "droitGestionDroitsMembres"
    );
    if (isError(memberOrError)) return memberOrError;

    const target = await prisma.companyMember.findUnique({ where: { id: memberId } });
    if (!target || target.compagnieId !== compagnieId) return { error: "Membre introuvable" };
    if (target.userId === Number(session.user.id))
      return { error: "Vous ne pouvez pas modifier vos propres droits" };

    await prisma.companyMember.update({
      where: { id: memberId },
      data: {
        droitAccesDetailsCompagnie: formData.get("droitAccesDetailsCompagnie") === "true",
        droitModificationCompagnie: formData.get("droitModificationCompagnie") === "true",
        droitSuppressionCompagnie: formData.get("droitSuppressionCompagnie") === "true",
        droitAjoutMembre: formData.get("droitAjoutMembre") === "true",
        droitSuppressionMembre: formData.get("droitSuppressionMembre") === "true",
        droitGestionDroitsMembres: formData.get("droitGestionDroitsMembres") === "true",
        droitAccesPlanning: formData.get("droitAccesPlanning") === "true",
        droitGestionPlanning: formData.get("droitGestionPlanning") === "true",
      },
    });
    revalidatePath(`/compagnie/${compagnieId}`);
    return { success: true };
  } catch {
    return { error: "Erreur lors de la mise à jour des droits" };
  }
}

export async function createCompany(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Vous devez être connecté" };

  const nom = formData.get("nom") as string;
  if (!nom || nom.length < 2) return { error: "Le nom de la compagnie est trop court" };

  try {
    const company = await prisma.compagnie.create({
      data: {
        nom,
        membres: {
          create: {
            userId: Number(session.user.id),
            droitAccesDetailsCompagnie: true,
            droitSuppressionCompagnie: true,
            droitModificationCompagnie: true,
            droitAjoutMembre: true,
            droitSuppressionMembre: true,
            droitGestionDroitsMembres: true,
            droitAccesPlanning: true,
            droitGestionPlanning: true,
          },
        },
      },
    });
    revalidatePath("/");
    return { success: true, company };
  } catch {
    return { error: "Une erreur est survenue lors de la création" };
  }
}
