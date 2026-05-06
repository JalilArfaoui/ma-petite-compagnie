import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

type FicheSection = { title: string; body: string };

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fiche = await prisma.ficheTechnique.findUnique({
    where: { id: Number(id) },
    select: { id: true, 
              pdf: true, 
              texte: true, 
              pdfName: true, 
              spectacleId: true,
              spectacle: {select: {titre: true} },
             },
  });

  if (!fiche) {
    return new NextResponse("Fiche introuvable", { status: 404 });
  }

  if (fiche.pdf) {
    const filename = fiche.pdfName || "fiche-technique.pdf";
    return new NextResponse(fiche.pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  }

  let sections: FicheSection[] = [];
  try {
    const parsed = JSON.parse(fiche.texte ?? "[]");
    if (Array.isArray(parsed)) {
      sections = parsed.filter(
        (s): s is FicheSection =>
          typeof s === "object" &&
          s !== null &&
          typeof s.title === "string" &&
          typeof s.body === "string"
      );
    }
  } catch {
    sections = [{ title: "", body: fiche.texte ?? "" }];
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 15;
  const contentWidth = pageWidth - marginX * 2;
  const footerHeight = 15;
  const bottomLimit = pageHeight - footerHeight - 6;

  const drawFooter = () => {
    doc.setFillColor(245, 245, 245);
    doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, "F");
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const date = new Date().toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Généré le ${date}`, pageWidth / 2, pageHeight - 6, { align: "center" });
  };

  doc.setFillColor(208, 0, 57);
  doc.rect(0, 0, pageWidth, 25, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Fiche Technique", pageWidth / 2, 16, { align: "center" });

  doc.setTextColor(208, 0, 57);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(fiche.spectacle.titre, marginX, 38);

  doc.setDrawColor(208, 0, 57);
  doc.setLineWidth(0.5);
  doc.line(marginX, 42, pageWidth - marginX, 42);

  drawFooter();

  let cursorY = 52;

  for (const section of sections) {
    const sectionBandH = 8;
    const bodyFontSize = 10;
    const lineHeightFactor = 1.5;
    const lineH = (bodyFontSize * lineHeightFactor) / (72 / 25.4);

    doc.setFontSize(bodyFontSize);
    doc.setFont("helvetica", "normal");
    const bodyLines = doc.splitTextToSize(section.body, contentWidth);
    const bodyHeight = bodyLines.length * lineH;

    const titleNeeded = section.title ? sectionBandH + 4 : 0;
    const sectionNeeded = titleNeeded + bodyHeight + 6;

    if (cursorY + sectionNeeded > bottomLimit && cursorY > 52) {
      doc.addPage();
      drawFooter();
      cursorY = 15;
    }

    if (section.title) {
      doc.setFillColor(220, 220, 220);
      doc.rect(marginX, cursorY, contentWidth, sectionBandH, "F");

      doc.setTextColor(40, 40, 40);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(section.title.toUpperCase(), marginX + 3, cursorY + sectionBandH - 2);

      cursorY += sectionBandH + 4;
    }

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(bodyFontSize);
    doc.setFont("helvetica", "normal");

    for (const line of bodyLines) {
      if (cursorY + lineH > bottomLimit) {
        doc.addPage();
        drawFooter();
        cursorY = 15;
      }
      doc.text(line, marginX, cursorY);
      cursorY += lineH;
    }

    cursorY += 8;
  }

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  const filename = fiche.pdfName || "fiche-technique.pdf";

  return new NextResponse(pdfBuffer, {
    status: 200,
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
