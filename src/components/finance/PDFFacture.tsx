import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  companyInfo: {
    width: "40%",
  },
  clientInfo: {
    width: "40%",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  metadata: {
    marginBottom: 20,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 5,
    fontWeight: "bold",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  // Column widths
  colDesc: { width: "40%" },
  colQty: { width: "10%" },
  colPrice: { width: "15%" },
  colTVA: { width: "15%" },
  colTotal: { width: "20%" },

  totals: {
    alignSelf: "flex-end",
    width: "40%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: "gray",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  rib: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    fontSize: 10,
  },
});

export interface LigneFactureData {
  designation: string;
  quantite: number;
  prixUnitaireHT: number;
  tva: number;
  type: string; // 'PRESTATION' | 'FRAIS' | 'REDUCTION'
}

export interface FacturePDFProps {
  numero: string;
  dateEmission: string | Date;
  dateEcheance: string | Date;
  lieuFacturation?: string;
  clientNom: string;
  clientAdresse?: string;
  lignes: LigneFactureData[];
  compagnie: {
    nom: string;
    adresse?: string | null;
    ville?: string | null;
    codePostal?: string | null;
    siteWeb?: string | null;
    rib?: string | null;
  };
}

const formatDate = (date: string | Date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR");
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
};

export const PDFFacture = ({ data }: { data: FacturePDFProps }) => {
  // Calculs
  const totalHT = data.lignes.reduce((acc, l) => acc + l.quantite * l.prixUnitaireHT, 0);
  const totalTVA = data.lignes.reduce(
    (acc, l) => acc + l.quantite * l.prixUnitaireHT * (l.tva / 100),
    0
  );
  const totalTTC = totalHT + totalTVA;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>{data.compagnie.nom}</Text>
            {data.compagnie.adresse && <Text>{data.compagnie.adresse}</Text>}
            {(data.compagnie.codePostal || data.compagnie.ville) && (
              <Text>{`${data.compagnie.codePostal || ""} ${data.compagnie.ville || ""}`}</Text>
            )}
            {data.compagnie.siteWeb && (
              <Text style={{ marginTop: 5, color: "blue" }}>{data.compagnie.siteWeb}</Text>
            )}
          </View>
          <View style={styles.clientInfo}>
            <Text style={{ color: "gray", marginBottom: 5 }}>Facturé à :</Text>
            <Text style={{ fontWeight: "bold" }}>{data.clientNom}</Text>
            {data.clientAdresse && <Text>{data.clientAdresse}</Text>}
          </View>
        </View>

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.title}>FACTURE N° {data.numero}</Text>
          <Text>Date d'émission : {formatDate(data.dateEmission)}</Text>
          {data.lieuFacturation && <Text>Lieu : {data.lieuFacturation}</Text>}
          <Text>Date d'échéance : {formatDate(data.dateEcheance)}</Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, styles.colDesc]}>
              <Text>Désignation</Text>
            </View>
            <View style={[styles.tableColHeader, styles.colQty]}>
              <Text>Qté</Text>
            </View>
            <View style={[styles.tableColHeader, styles.colPrice]}>
              <Text>P.U. HT</Text>
            </View>
            <View style={[styles.tableColHeader, styles.colTVA]}>
              <Text>TVA %</Text>
            </View>
            <View style={[styles.tableColHeader, styles.colTotal]}>
              <Text>Total HT</Text>
            </View>
          </View>

          {data.lignes.map((ligne, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={[styles.tableCol, styles.colDesc]}>
                <Text>{ligne.designation}</Text>
              </View>
              <View style={[styles.tableCol, styles.colQty]}>
                <Text>{ligne.quantite}</Text>
              </View>
              <View style={[styles.tableCol, styles.colPrice]}>
                <Text>{formatCurrency(ligne.prixUnitaireHT)}</Text>
              </View>
              <View style={[styles.tableCol, styles.colTVA]}>
                <Text>{ligne.tva}%</Text>
              </View>
              <View style={[styles.tableCol, styles.colTotal]}>
                <Text>{formatCurrency(ligne.quantite * ligne.prixUnitaireHT)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT :</Text>
            <Text>{formatCurrency(totalHT)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total TVA :</Text>
            <Text>{formatCurrency(totalTVA)}</Text>
          </View>
          <View style={[styles.totalRow, { marginTop: 5, borderTopWidth: 1, paddingTop: 5 }]}>
            <Text style={[styles.totalLabel, { fontSize: 14 }]}>Total TTC :</Text>
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>{formatCurrency(totalTTC)}</Text>
          </View>
        </View>

        {/* RIB */}
        {data.compagnie.rib && (
          <View style={styles.rib}>
            <Text style={{ fontWeight: "bold", marginBottom: 2 }}>
              Informations Bancaires (RIB) :
            </Text>
            <Text>{data.compagnie.rib}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Merci de votre confiance.</Text>
          <Text>
            {data.compagnie.nom} - {data.compagnie.siteWeb}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
