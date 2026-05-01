"use server";

import { prisma } from "@/lib/prisma";

export async function getCachetsAction() {
  try {
    const cachets = await prisma.cachet.findMany({
      include: {
        spectacle: true,
        membre: {
          include: {
            user: true,
          },
        },
      },
    });
    return { success: true, data: cachets };
  } catch (error) {
    console.error("Erreur lors de la récupération des cachets:", error);
    return { success: false, error: "Impossible de récupérer les cachets" };
  }
}
