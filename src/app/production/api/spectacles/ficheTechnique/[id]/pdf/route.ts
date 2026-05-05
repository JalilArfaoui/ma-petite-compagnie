import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { spec } from "node:test/reporters";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fiche = await prisma.ficheTechnique.findUnique({
    where: { id: Number(id) },
    select: { id: true,
              pdf: true,
              texte: true, 
              pdfName: true, 
              spectacleId: true
     },
  });

  


  if (!fiche) {
    return new NextResponse("Fiche introuvable", { status: 404 });
  }

  const spectacle = await prisma.spectacle.findUnique({
    where: { id: fiche.spectacleId },
    select: {
      id: true,
      titre: true,
      type: true,
      statut: true,
      dure: true,
      ficheTechnique: {
        select: { id: true, texte: true, pdfName: true, spectacleId: true},
      },
    },
  });

  if (!spectacle) {
    return new NextResponse("Fiche introuvable", { status: 404 });
  }


if (fiche?.pdf) {
  const filename = fiche.pdfName || "fiche-technique.pdf";

  return new NextResponse(fiche.pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
  }

  else {
  const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // Header band
    doc.setFillColor(208, 0, 57);
    doc.rect(0, 0, pageWidth, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Fiche Technique", pageWidth / 2, 16, { align: "center" });
  
    // Spectacle title
    doc.setTextColor(208, 0, 57);
    doc.setFontSize(14);
    doc.text(spectacle.titre, 15, 40);
  
    // Divider
    doc.setDrawColor(208, 0, 57);
    doc.setLineWidth(0.5);
    doc.line(15, 44, pageWidth - 15, 44);
  
    // Meta
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Référence fiche : #${fiche.id}`, 15, 52);
    doc.text(`Référence spectacle : #${fiche.spectacleId}`, 15, 58);
  
    // Section title
    doc.setTextColor(208, 0, 57);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Contenu de la fiche", 15, 70);
  
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 73, pageWidth - 15, 73);
  
    // Content
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(fiche.texte, pageWidth - 30);
    doc.text(lines, 15, 82);
  
    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(245, 245, 245);
    doc.rect(0, pageHeight - 15, pageWidth, 15, "F");
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    const date = new Date().toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Généré le ${date}`, pageWidth / 2, pageHeight - 6, { align: "center" });
  
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    const filename = `${fiche.pdfName}`;
  
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  
}
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


