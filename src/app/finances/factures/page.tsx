"use client"; //pour rendre page client component, afin d'utiliser les fonctions de clic du bouton

import jsPDF from "jspdf";
import styles from "./page.module.css";

export default function ExportPage() {
  return (
    //brouillin visuel minimal, pour tester le bon fonctionnement, le temps de recevoir les composants de l'équipe en charge
    <main className={styles.page}>
      <div className={styles.card}>
        <button className={styles.button} onClick={generatePDFFile}>
          Exporter la facture en .pdf
        </button>
      </div>
    </main>
  );
}

function generatePDFFile() {
  //brouillon, j'attends qu'Alexandre m'envoie toutes les variables correspondantes, afin de mettre le tout en forme
  const pdfFile = new jsPDF();

  pdfFile.text("Hello, this is a PDF generated with jsPDF!", 100, 100);
  pdfFile.save("sample.pdf");
  console.log("Facture enregistrée en format .pdf");
}
