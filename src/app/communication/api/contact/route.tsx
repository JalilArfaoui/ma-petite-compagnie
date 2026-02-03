import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContactInformation, obtenirBeaucoupContact } from "../contact";

export async function GET(req: NextRequest) {
  try {
    const result = await obtenirBeaucoupContact();
    if (!result.succes) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }
    return NextResponse.json(result.contact, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur serveur:" + error }, { status: 500 });
  }
}
