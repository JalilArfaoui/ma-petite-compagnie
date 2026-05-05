"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateRepresentation(formData: FormData) {
  const id = Number(formData.get("id"));
  const date = new Date(formData.get("date") as string);
  const spectacleId = Number(formData.get("spectacleId"));
  const lieuId = Number(formData.get("lieuId"));

  await prisma.representation.update({
    where: { id },
    data: { date, spectacleId, lieuId },
  });

  revalidatePath("/production/representations");
}

export async function deleteRepresentation(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.representation.delete({
    where: { id },
  });

  revalidatePath("/production/representations");
}

export async function removeReservation(formData: FormData) {
  const id = Number(formData.get("id"));

  const reservation = await prisma.reservationObjet.findUnique({ where: { id } });
  if (reservation) {
    await prisma.reservationObjet.delete({ where: { id } });
    const remaining = await prisma.reservationObjet.count({
      where: { objetId: reservation.objetId },
    });
    if (remaining === 0) {
      await prisma.objet.update({
        where: { id: reservation.objetId },
        data: { estDisponible: true },
      });
    }
  }

  revalidatePath("/production/representations");
}
