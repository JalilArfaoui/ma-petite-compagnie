-- CreateEnum
CREATE TYPE "FactureStatus" AS ENUM ('BROUILLON', 'EMISE', 'PAYEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "LigneType" AS ENUM ('PRESTATION', 'FRAIS', 'REDUCTION');

-- AlterTable
ALTER TABLE "Compagnie" ADD COLUMN     "adresse" TEXT,
ADD COLUMN     "codePostal" TEXT,
ADD COLUMN     "rib" TEXT,
ADD COLUMN     "siteWeb" TEXT,
ADD COLUMN     "ville" TEXT;

-- CreateTable
CREATE TABLE "Facture" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "dateEmission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateEcheance" TIMESTAMP(3) NOT NULL,
    "lieuFacturation" TEXT,
    "clientNom" TEXT NOT NULL,
    "clientAdresse" TEXT,
    "status" "FactureStatus" NOT NULL DEFAULT 'BROUILLON',
    "compagnieId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LigneFacture" (
    "id" SERIAL NOT NULL,
    "factureId" INTEGER NOT NULL,
    "designation" TEXT NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "prixUnitaireHT" DOUBLE PRECISION NOT NULL,
    "tva" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
    "type" "LigneType" NOT NULL DEFAULT 'PRESTATION',

    CONSTRAINT "LigneFacture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Facture_numero_key" ON "Facture"("numero");

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneFacture" ADD CONSTRAINT "LigneFacture_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "Facture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
