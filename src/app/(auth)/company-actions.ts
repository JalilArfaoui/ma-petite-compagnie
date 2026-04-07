"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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
            droitModificationCompagnie: true,
            droitSuppressionCompagnie: true,
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
  } catch (error) {
    console.error("Erreur création compagnie:", error);
    return { error: "Une erreur est survenue lors de la création" };
  }
}
