import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type CreateLieuBody = {
  libelle: string;
  adresse: string;
  ville: string;
  numero_salle: string | null;
  idCompagnie: number;
};

export async function POST(req: NextRequest) {
  try {
    const body: CreateLieuBody = await req.json();
    const { libelle, adresse, ville, numero_salle, idCompagnie } = body;
    if (!libelle || !adresse || !ville || !idCompagnie) {
      return NextResponse.json({ message: "Des informations sont manquantes." }, { status: 400 });
    }

    const lieu = await prisma.lieu.create({
      data: {
        libelle,
        adresse,
        ville,
        numero_salle,
        idCompagnie,
      },
    });
    return NextResponse.json(lieu, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur serveur:" + error }, { status: 500 });
  }
}
