"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { StatutSpectacle, TypeSpectacle } from "@prisma/client";
import { redirect } from "next/navigation";

export async function updateSpectacle(formData: FormData) {
  const id = Number(formData.get("id"));
  const titre = formData.get("titre") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as TypeSpectacle;
  const statut = formData.get("statut") as StatutSpectacle;
  const budget_initial = Number(formData.get("budget_initial")) || 0;
  const dure = Number(formData.get("dure"));

  await prisma.spectacle.update({
    where: { id },
    data: { titre, description, type, statut, budget_initial, dure },
  });

  revalidatePath(`/production/spectacles/${id}`);
}

export async function deleteSpectacle(id: number) {
  await prisma.spectacle.delete({ where: { id } });
  revalidatePath("/production");
  redirect("/production");
}

export async function createBesoin(spectacleId: number, typeObjetId: number, nb: number) {
  await prisma.besoinSpectacle.create({
    data: { spectacleId, typeObjetId, nb },
  });
  revalidatePath(`/production/spectacles/${spectacleId}`);
}

export async function createBesoinsFromList(
  spectacleId: number,
  items: { typeObjetId: number; nb: number }[]
) {
  await prisma.besoinSpectacle.createMany({
    data: items.map((item) => ({
      spectacleId,
      typeObjetId: item.typeObjetId,
      nb: item.nb,
    })),
  });
  revalidatePath(`/production/spectacles/${spectacleId}`);
}

export async function updateBesoin(formData: FormData) {
  const id = Number(formData.get("id"));
  const nb = Number(formData.get("nb"));

  const besoin = await prisma.besoinSpectacle.update({
    where: { id },
    data: { nb },
  });

  revalidatePath(`/production/spectacles/${besoin.spectacleId}`);
}

export async function deleteBesoin(id: number, spectacleId: number) {
  await prisma.besoinSpectacle.delete({ where: { id } });
  revalidatePath(`/production/spectacles/${spectacleId}`);
}

export async function ensureFicheTechnique(spectacleId: number): Promise<number> {
  const existing = await prisma.ficheTechnique.findUnique({
    where: { spectacleId },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await prisma.ficheTechnique.create({
    data: { spectacleId, texte: "" },
  });
  return created.id;
}
