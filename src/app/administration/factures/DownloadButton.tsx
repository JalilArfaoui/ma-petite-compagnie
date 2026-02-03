"use client";

import { Button } from "@/components/ui";
import { Facture, LigneFacture, Compagnie } from "@prisma/client";
import dynamic from "next/dynamic";
import { PDFFacture } from "@/components/finance/PDFFacture";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <span>...</span> }
);

type FactureFull = Facture & {
  lignes: LigneFacture[];
  compagnie: Compagnie;
};

export function DownloadButton({ facture }: { facture: FactureFull }) {
  const pdfData = {
    numero: facture.numero,
    dateEmission: facture.dateEmission,
    dateEcheance: facture.dateEcheance,
    lieuFacturation: facture.lieuFacturation || undefined,
    clientNom: facture.clientNom,
    clientAdresse: facture.clientAdresse || undefined,
    lignes: facture.lignes, // Compatible if types match (enum vs string might need cast, but strict checks usually ok)
    compagnie: facture.compagnie,
  };

  return (
    <PDFDownloadLink
      document={<PDFFacture data={pdfData} />}
      fileName={`facture-${facture.numero}.pdf`}
    >
      {/* Render prop not supported in all types versions but children function is common */}
      {({ loading }) => (
        <Button size="sm" variant="outline" loading={loading}>
          {loading ? "Génération..." : "Télécharger PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
