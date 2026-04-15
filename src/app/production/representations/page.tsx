import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import RepresentationsClient from "./RepresentationsClient";

export const dynamic = "force-dynamic";

/* =========================
   UPDATE
========================= */
async function updateRepresentation(formData: FormData) {
  "use server";

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

/* =========================
   DELETE
========================= */
async function deleteRepresentation(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.representation.delete({
    where: { id },
  });

  revalidatePath("/production/representations");
}

/* =========================
   DELETE RESERVATION
========================= */
async function removeReservation(formData: FormData) {
  "use server";

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

/* =========================
   PAGE
========================= */
export default async function RepresentationsPage() {
  const [representations, spectacles, lieux] = await Promise.all([
    prisma.representation.findMany({
      orderBy: { date: "desc" },
      include: {
        spectacle: true,
        lieu: true,
        _count: { select: { reservations: true } },
        reservations: {
          include: {
            objet: {
              include: {
                typeObjet: true,
              },
            },
          },
        },
      },
    }),
    prisma.spectacle.findMany({ orderBy: { titre: "asc" } }),
    prisma.lieu.findMany({ orderBy: { libelle: "asc" } }),
  ]);

  const serialized = JSON.parse(JSON.stringify(representations));

  return (
    <RepresentationsClient
      representations={serialized}
      spectacles={spectacles}
      lieux={lieux}
      updateRepresentation={updateRepresentation}
      deleteRepresentation={deleteRepresentation}
      removeReservation={removeReservation}
    />
  );
}
