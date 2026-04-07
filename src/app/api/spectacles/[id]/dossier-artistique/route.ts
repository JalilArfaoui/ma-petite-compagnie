import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const spectacle = await prisma.spectacle.findUnique({
    where: { id: Number(id) },
    select: { dossierArtistique: true, dossierArtistiqueName: true },
  });

  if (!spectacle?.dossierArtistique) {
    return NextResponse.json({ error: "No dossier" }, { status: 404 });
  }

  const filename = spectacle.dossierArtistiqueName || "dossier-artistique.pdf";

  return new NextResponse(spectacle.dossierArtistique, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "Invalid PDF file" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  await prisma.spectacle.update({
    where: { id: Number(id) },
    data: { dossierArtistique: buffer, dossierArtistiqueName: file.name },
  });

  return NextResponse.json({ success: true });
}
