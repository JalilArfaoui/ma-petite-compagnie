import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const listes = await prisma.listeContact.findMany({include: {contacts: true,},});
  return NextResponse.json(listes);
}