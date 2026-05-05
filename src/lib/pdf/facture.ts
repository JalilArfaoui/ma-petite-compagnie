import { jsPDF } from "jspdf";

export function generateFacturePDF(data: any): string {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Company Info (Left)
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(data.compagnie.nom || "Votre Compagnie", 15, 20);
  
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
  doc.text(data.clientNom || "Client", pageWidth - 15, 26, { align: "right" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  if (data.clientAdresse) {
    const lines = doc.splitTextToSize(data.clientAdresse, 60);
    doc.text(lines, pageWidth - 15, 32, { align: "right" });
  }

  // Invoice Details
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`FACTURE N° ${data.numero}`, 15, 60);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const formatDate = (d: string) => {
    if (!d || d === "Non définie" || d === "Invalid Date") return d;
    try {
      return new Date(d).toLocaleDateString("fr-FR");
    } catch {
      return d;
    }
  };

  doc.text(`Date d'émission : ${formatDate(data.dateEmission)}`, 15, 68);
  if (data.lieuFacturation) {
    doc.text(`Lieu : ${data.lieuFacturation}`, 15, 73);
  }
  doc.text(`Date d'échéance : ${formatDate(data.dateEcheance)}`, 15, 78);

  // Table Header
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 85, pageWidth - 30, 10, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Désignation", 18, 91);
  doc.text("Qté", 110, 91, { align: "right" });
  doc.text("P.U. HT", 140, 91, { align: "right" });
  doc.text("TVA", 160, 91, { align: "right" });
  doc.text("Total HT", 192, 91, { align: "right" });

  doc.setDrawColor(200, 200, 200);
  doc.line(15, 95, pageWidth - 15, 95);

  // Table Body
  doc.setFont("helvetica", "normal");
  let tableY = 102;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
  };

  let totalHT = 0;
  let totalTVA = 0;

  data.lignes.forEach((ligne: any) => {
    const prixHT = ligne.quantite * ligne.prixUnitaireHT;
    const tva = prixHT * (ligne.tva / 100);
    totalHT += prixHT;
    totalTVA += tva;

    doc.text(ligne.designation || "-", 18, tableY);
    doc.text(ligne.quantite.toString(), 110, tableY, { align: "right" });
    doc.text(formatCurrency(ligne.prixUnitaireHT), 140, tableY, { align: "right" });
    doc.text(`${ligne.tva}%`, 160, tableY, { align: "right" });
    doc.text(formatCurrency(prixHT), 192, tableY, { align: "right" });
    
    doc.line(15, tableY + 3, pageWidth - 15, tableY + 3);
    tableY += 10;
  });

  const totalTTC = totalHT + totalTVA;

  // Totals
  doc.setFillColor(250, 250, 250);
  doc.rect(pageWidth - 80, tableY + 5, 65, 25, "F");
  
  doc.text("Total HT :", pageWidth - 75, tableY + 12);
  doc.text(formatCurrency(totalHT), pageWidth - 20, tableY + 12, { align: "right" });
  
  doc.text("Total TVA :", pageWidth - 75, tableY + 18);
  doc.text(formatCurrency(totalTVA), pageWidth - 20, tableY + 18, { align: "right" });
  
  doc.setFont("helvetica", "bold");
  doc.text("Total TTC :", pageWidth - 75, tableY + 26);
  doc.text(formatCurrency(totalTTC), pageWidth - 20, tableY + 26, { align: "right" });

  // Bank Info (RIB)
  if (data.compagnie.rib) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Informations Bancaires (RIB) :", 15, tableY + 45);
    doc.setFont("helvetica", "normal");
    doc.text(data.compagnie.rib, 15, tableY + 50);
  }

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Merci de votre confiance.", pageWidth / 2, pageHeight - 15, { align: "center" });
  doc.text(`${data.compagnie.nom} - ${data.compagnie.siteWeb || ""}`, pageWidth / 2, pageHeight - 10, { align: "center" });

  return doc.output("datauristring");
}
