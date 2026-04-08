import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fiche = await prisma.ficheTechnique.findUnique({
    where: { id: Number(id) },
    select: { pdf: true, pdfName: true },
  });

  if (!fiche?.pdf) {
    return NextResponse.json({ error: "No PDF" }, { status: 404 });
  }

  const filename = fiche.pdfName || "fiche-technique.pdf";

  return new NextResponse(fiche.pdf, {
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

  await prisma.ficheTechnique.update({
    where: { id: Number(id) },
    data: { pdf: buffer, pdfName: file.name },
  });

  return NextResponse.json({ success: true });
}
