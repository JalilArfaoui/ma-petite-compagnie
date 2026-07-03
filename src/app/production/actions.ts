"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TypeSpectacle } from "@prisma/client";

export async function createSpectacle(formData: FormData) {
  const session = await auth();
  if (!session?.activeCompanyId) throw new Error("Aucune compagnie active.");
  const compagnieId = Number(session.activeCompanyId);

  const titre = formData.get("titre") as string;
  const type = formData.get("type") as TypeSpectacle;
  const dure = Number(formData.get("dure"));

  await prisma.spectacle.create({
    data: {
      titre,
      dure,
      type,
      compagnieId,
    },
  });

  revalidatePath("/production");
}

export async function deleteSpectacle(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.spectacle.delete({
    where: { id },
  });

  revalidatePath("/production");
}
