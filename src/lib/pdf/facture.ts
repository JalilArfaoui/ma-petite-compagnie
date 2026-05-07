import { jsPDF } from "jspdf";

export interface FactureLigne {
  designation: string;
  quantite: number;
  prixUnitaireHT: number;
  tva: number;
}

export interface FactureData {
  numero: string;
  dateEmission: string | Date;
  dateEcheance: string | Date;
  lieuFacturation?: string | null;
  clientNom: string;
  clientAdresse: string | null;
  clientSiren?: string | null;
  lignes: FactureLigne[];
  compagnie: {
    nom: string;
    adresse?: string | null;
    ville?: string | null;
    codePostal?: string | null;
    siteWeb?: string | null;
    rib?: string | null;
    formeJuridique?: string | null;
    capitalSocial?: string | number | null;
    siren?: string | null;
    rcs?: string | null;
  };
}

export function generateFacturePDF(data: FactureData): string {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const drawTextWithPlaceholder = (
    text: string | null | undefined,
    placeholder: string,
    x: number,
    y: number,
    options?: object
  ) => {
    if (!text || text.trim() === "") {
      doc.setTextColor(250, 61, 47); // #fa3d2f
      doc.text(placeholder, x, y, options);
      doc.setTextColor(0, 0, 0);
    } else {
      doc.text(text, x, y, options);
    }
  };

  // Company Info (Left)
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  drawTextWithPlaceholder(data.compagnie.nom, "Nom de l'entreprise", 15, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  let startY = 26;
  if (data.compagnie.adresse) {
    doc.text(data.compagnie.adresse, 15, startY);
    startY += 5;
  }
  if (data.compagnie.codePostal || data.compagnie.ville) {
    doc.text(`${data.compagnie.codePostal || ""} ${data.compagnie.ville || ""}`, 15, startY);
    startY += 5;
  }

  // Légal compagnie
  const legalParts = [];
  if (data.compagnie.formeJuridique) legalParts.push(data.compagnie.formeJuridique);
  if (data.compagnie.capitalSocial) legalParts.push(`Capital: ${data.compagnie.capitalSocial}€`);
  if (data.compagnie.siren) legalParts.push(`SIREN: ${data.compagnie.siren}`);
  if (data.compagnie.rcs) legalParts.push(`RCS: ${data.compagnie.rcs}`);

  if (legalParts.length > 0) {
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(legalParts.join(" - "), 15, startY);
    startY += 5;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
  }

  if (data.compagnie.siteWeb) {
    doc.setTextColor(0, 0, 255);
    doc.text(data.compagnie.siteWeb, 15, startY);
    doc.setTextColor(0, 0, 0);
  }

  // Client Info (Right)
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Facturé à :", pageWidth - 15, 20, { align: "right" });
  doc.setFontSize(12);
  drawTextWithPlaceholder(data.clientNom, "Nom du client", pageWidth - 15, 26, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  let clientY = 32;
  if (!data.clientAdresse || data.clientAdresse.trim() === "") {
    drawTextWithPlaceholder("", "Adresse du client", pageWidth - 15, clientY, { align: "right" });
    clientY += 5;
  } else {
    const lines = doc.splitTextToSize(data.clientAdresse, 60);
    doc.text(lines, pageWidth - 15, clientY, { align: "right" });
    clientY += lines.length * 5;
  }
  if (data.clientSiren) {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`SIREN / TVA: ${data.clientSiren}`, pageWidth - 15, clientY, { align: "right" });
    doc.setTextColor(0, 0, 0);
  }

  // Invoice Details
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`FACTURE N° ${data.numero}`, 15, 60);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const formatDate = (d: string | Date) => {
    if (!d || d === "Non définie" || d.toString() === "Invalid Date") return d?.toString() || "";
    try {
      return new Date(d).toLocaleDateString("fr-FR");
    } catch {
      return d.toString();
    }
  };

  doc.text(`Date d'émission : ${formatDate(data.dateEmission)}`, 15, 68);
  if (data.lieuFacturation) {
    doc.text(`Lieu : ${data.lieuFacturation}`, 15, 73);
  }

  doc.text("Date d'échéance : ", 15, 78);
  if (!data.dateEcheance || data.dateEcheance === "Non définie") {
    drawTextWithPlaceholder("", "À définir", 46, 78);
  } else {
    doc.text(formatDate(data.dateEcheance), 46, 78);
  }

  let totalHT = 0;
  let totalTVA = 0;

  data.lignes.forEach((ligne: FactureLigne) => {
    const prixHT = ligne.quantite * ligne.prixUnitaireHT;
    totalHT += prixHT;
    totalTVA += prixHT * (ligne.tva / 100);
  });

  const hasTVA = totalTVA > 0;

  // Table Header
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 85, pageWidth - 30, 10, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Désignation", 18, 91);
  if (hasTVA) {
    doc.text("Qté", 110, 91, { align: "right" });
    doc.text("P.U. HT", 140, 91, { align: "right" });
    doc.text("TVA", 160, 91, { align: "right" });
    doc.text("Total HT", 192, 91, { align: "right" });
  } else {
    doc.text("Qté", 120, 91, { align: "right" });
    doc.text("Prix unitaire", 155, 91, { align: "right" });
    doc.text("Total", 192, 91, { align: "right" });
  }

  doc.setDrawColor(200, 200, 200);
  doc.line(15, 95, pageWidth - 15, 95);

  // Table Body
  doc.setFont("helvetica", "normal");
  let tableY = 102;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
  };

  data.lignes.forEach((ligne: FactureLigne) => {
    const prixHT = ligne.quantite * ligne.prixUnitaireHT;

    drawTextWithPlaceholder(ligne.designation, "Désignation de la prestation", 18, tableY);
    if (hasTVA) {
      doc.text(ligne.quantite.toString(), 110, tableY, { align: "right" });
      doc.text(formatCurrency(ligne.prixUnitaireHT), 140, tableY, { align: "right" });
      doc.text(`${ligne.tva}%`, 160, tableY, { align: "right" });
      doc.text(formatCurrency(prixHT), 192, tableY, { align: "right" });
    } else {
      doc.text(ligne.quantite.toString(), 120, tableY, { align: "right" });
      doc.text(formatCurrency(ligne.prixUnitaireHT), 155, tableY, { align: "right" });
      doc.text(formatCurrency(prixHT), 192, tableY, { align: "right" });
    }

    doc.line(15, tableY + 3, pageWidth - 15, tableY + 3);
    tableY += 10;
  });

  const totalTTC = totalHT + totalTVA;

  // Totals
  if (totalTVA === 0) {
    doc.setFillColor(250, 250, 250);
    doc.rect(pageWidth - 80, tableY + 5, 65, 15, "F");

    doc.setFont("helvetica", "bold");
    doc.text("Total à payer :", pageWidth - 75, tableY + 14);
    doc.text(formatCurrency(totalTTC), pageWidth - 20, tableY + 14, { align: "right" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("TVA non applicable, art. 293 B du CGI", 15, tableY + 10);
  } else {
    doc.setFillColor(250, 250, 250);
    doc.rect(pageWidth - 80, tableY + 5, 65, 25, "F");

    doc.text("Total HT :", pageWidth - 75, tableY + 12);
    doc.text(formatCurrency(totalHT), pageWidth - 20, tableY + 12, { align: "right" });

    doc.text("Total TVA :", pageWidth - 75, tableY + 18);
    doc.text(formatCurrency(totalTVA), pageWidth - 20, tableY + 18, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.text("Total TTC :", pageWidth - 75, tableY + 26);
    doc.text(formatCurrency(totalTTC), pageWidth - 20, tableY + 26, { align: "right" });
  }

  // Bank Info (RIB)
  if (data.compagnie.rib) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Informations Bancaires (RIB) :", 15, tableY + 45);
    doc.setFont("helvetica", "normal");
    doc.text(data.compagnie.rib, 15, tableY + 50);
  }

  // Legal Payment Info
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Escompte pour paiement anticipé : néant.", 15, tableY + 65);
  doc.text("Taux des pénalités de retard : 3 fois le taux d'intérêt légal.", 15, tableY + 70);
  doc.text(
    "Indemnité forfaitaire pour frais de recouvrement en cas de retard de paiement : 40 €.",
    15,
    tableY + 75
  );

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Merci de votre confiance.", pageWidth / 2, pageHeight - 15, { align: "center" });
  doc.text(
    `${data.compagnie.nom} - ${data.compagnie.siteWeb || ""}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  return doc.output("datauristring");
}
