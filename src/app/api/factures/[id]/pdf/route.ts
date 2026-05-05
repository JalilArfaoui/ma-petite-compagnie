import { NextRequest, NextResponse } from "next/server";
import { getFactureById } from "@/app/actions/finance";
import { generateFacturePDF } from "@/lib/pdf/facture";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const factureId = parseInt(id);
  if (isNaN(factureId)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const facture = await getFactureById(factureId);
  if (!facture) {
    return new NextResponse("Facture introuvable", { status: 404 });
  }

  const pdfData = {
    numero: facture.numero,
    dateEmission: new Date(facture.dateEmission).toISOString().split("T")[0],
    dateEcheance: new Date(facture.dateEcheance).toISOString().split("T")[0],
    lieuFacturation: facture.lieuFacturation,
    clientNom: facture.clientNom,
    clientAdresse: facture.clientAdresse,
    clientSiren: facture.clientSiren,
    lignes: facture.lignes,
    compagnie: {
      nom: facture.compagnie.nom,
      adresse: facture.compagnie.adresse,
      ville: facture.compagnie.ville,
      codePostal: facture.compagnie.codePostal,
      siteWeb: facture.compagnie.siteWeb,
      rib: facture.compagnie.rib,
      siren: facture.compagnie.siren,
      rcs: facture.compagnie.rcs,
      formeJuridique: facture.compagnie.formeJuridique,
      capitalSocial: facture.compagnie.capitalSocial,
    },
  };

  try {
    const pdfDataUri = generateFacturePDF(pdfData);
    // The data URI is: "data:application/pdf;filename=generated.pdf;base64,..."
    const base64 = pdfDataUri.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${facture.numero}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Erreur génération PDF:", err);
    return new NextResponse("Erreur lors de la génération du PDF", { status: 500 });
  }
}
