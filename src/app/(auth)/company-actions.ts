"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateCompany(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Vous devez être connecté" };

  const id = Number(formData.get("id"));
  const nom = formData.get("nom") as string;

  if (!nom || nom.length < 2) return { error: "Le nom est trop court" };

  const member = await prisma.companyMember.findUnique({
    where: { userId_compagnieId: { userId: Number(session.user.id), compagnieId: id } },
  });

  if (!member?.droitModificationInfos) return { error: "Vous n'avez pas les droits nécessaires" };

  try {
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

  const member = await prisma.companyMember.findUnique({
    where: { userId_compagnieId: { userId: Number(session.user.id), compagnieId: id } },
  });

  if (!member?.droitDestruction) return { error: "Vous n'avez pas les droits nécessaires" };

  try {
    await prisma.compagnie.delete({ where: { id } });
    revalidatePath("/profil");
    return { success: true };
  } catch {
    return { error: "Erreur lors de la suppression" };
  }
}

export async function createCompany(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vous devez être connecté" };
  }

  const nom = formData.get("nom") as string;
  if (!nom || nom.length < 2) {
    return { error: "Le nom de la compagnie est trop court" };
  }

  try {
    const company = await prisma.compagnie.create({
      data: {
        nom,
        membres: {
          create: {
            userId: Number(session.user.id),
            // Default rights for creator
            droitDestruction: true,
            droitModificationInfos: true,
            droitGestionUtilisateurs: true,
            droitAccesPlanning: true,
            droitGestionPlanning: true,
          },
        },
      },
    });

    revalidatePath("/");
    return { success: true, company };
  } catch (error) {
    console.error("Erreur création compagnie:", error);
    return { error: "Une erreur est survenue lors de la création" };
  }
}
