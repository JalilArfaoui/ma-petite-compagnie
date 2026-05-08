"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { EtatObjet } from "@prisma/client";

// ========== TypeObjet CRUD ==========

export async function createTypeObjet(formData: FormData) {
  const nom = formData.get("nom") as string;
  const categorieId = Number(formData.get("categorieId"));
  const image = (formData.get("image") as string) || null;

  await prisma.typeObjet.create({
    data: { nom, categorieId, image },
  });

  revalidatePath("/production/objets");
}

export async function updateTypeObjet(formData: FormData) {
  const id = Number(formData.get("id"));
  const nom = formData.get("nom") as string;
  const categorieId = Number(formData.get("categorieId"));
  const image = (formData.get("image") as string) || null;

  await prisma.typeObjet.update({
    where: { id },
    data: { nom, categorieId, image },
  });

  revalidatePath("/production/objets");
}

export async function deleteTypeObjet(formData: FormData) {
  const id = Number(formData.get("id"));

  // Delete all objets of this type first
  await prisma.objet.deleteMany({ where: { typeObjetId: id } });
  await prisma.typeObjet.delete({ where: { id } });

  revalidatePath("/production/objets");
}

// ========== Objet CRUD ==========

export async function createObjet(formData: FormData) {
  const session = await auth();
  if (!session?.activeCompanyId) throw new Error("Aucune compagnie active.");
  const compagnieId = Number(session.activeCompanyId);

  const typeObjetId = Number(formData.get("typeObjetId"));
  const etat = (formData.get("etat") as EtatObjet) || "NEUF";
  const estDisponible = formData.get("estDisponible") === "true";
  const commentaire = (formData.get("commentaire") as string) || null;

  await prisma.objet.create({
    data: { typeObjetId, etat, estDisponible, compagnieId, commentaire },
  });

  revalidatePath("/production/objets");
}

export async function updateObjet(formData: FormData) {
  const id = Number(formData.get("id"));
  const etat = (formData.get("etat") as EtatObjet) || "NEUF";
  const estDisponible = formData.get("estDisponible") === "true";
  const commentaire = (formData.get("commentaire") as string) || null;

  await prisma.objet.update({
    where: { id },
    data: { etat, estDisponible, commentaire },
  });

  revalidatePath("/production/objets");
}

export async function deleteObjet(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.reservationObjet.deleteMany({ where: { objetId: id } });
  await prisma.objet.delete({ where: { id } });

  revalidatePath("/production/objets");
}

// ========== ReservationObjet CRUD ==========

export async function createReservation(formData: FormData) {
  const objetId = Number(formData.get("objetId"));
  const representationId = Number(formData.get("representationId"));

  // Mark objet as unavailable
  await prisma.objet.update({
    where: { id: objetId },
    data: { estDisponible: false },
  });

  await prisma.reservationObjet.create({
    data: { objetId, representationId },
  });

  revalidatePath("/production/objets");
}

export async function deleteReservation(formData: FormData) {
  const id = Number(formData.get("id"));

  const reservation = await prisma.reservationObjet.findUnique({ where: { id } });
  if (reservation) {
    await prisma.reservationObjet.delete({ where: { id } });
    // Re-mark objet as available if no more reservations
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

  revalidatePath("/production/objets");
}

// ========== Fetch data ==========

export async function fetchObjetsPageData(compagnieId: number) {
  const [typesObjets, categories, representations] = await Promise.all([
    prisma.typeObjet.findMany({
      orderBy: { nom: "asc" },
      include: {
        categorie: true,
        objets: {
          where: { compagnieId },
          include: {
            compagnie: true,
            reservations: {
              include: {
                representation: {
                  include: {
                    spectacle: true,
                    lieu: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.categorieObjet.findMany({ orderBy: { nom: "asc" } }),
    prisma.representation.findMany({
      orderBy: { debutResa: "asc" },
      where: { spectacle: { compagnieId } },
      include: {
        spectacle: true,
        lieu: true,
      },
    }),
  ]);

  return { typesObjets, categories, representations };
}
