/*
  Warnings:

  - You are about to drop the column `troupe` on the `Spectacle` table. All the data in the column will be lost.
  - The `type` column on the `Spectacle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `compagnieId` to the `Spectacle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeSpectacle" AS ENUM ('THEATRE', 'DANSE', 'MUSIQUE', 'CIRQUE', 'AUTRE');

-- CreateEnum
CREATE TYPE "EtatObjet" AS ENUM ('NEUF', 'ABIME', 'CASSE');

-- AlterTable
ALTER TABLE "Spectacle" DROP COLUMN "troupe",
ADD COLUMN     "compagnieId" INTEGER NOT NULL,
ADD COLUMN     "dossierArtistique" BYTEA,
ADD COLUMN     "dossierArtistiqueName" TEXT,
ADD COLUMN     "dure" INTEGER,
ADD COLUMN     "image" BYTEA,
ADD COLUMN     "imageMimeType" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "TypeSpectacle",
ALTER COLUMN "statut" SET DEFAULT 'EN_CREATION';

-- CreateTable
CREATE TABLE "CategorieObjet" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "CategorieObjet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeObjet" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "image" TEXT,
    "categorieId" INTEGER NOT NULL,

    CONSTRAINT "TypeObjet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BesoinSpectacle" (
    "id" SERIAL NOT NULL,
    "nb" INTEGER NOT NULL DEFAULT 1,
    "spectacleId" INTEGER NOT NULL,
    "typeObjetId" INTEGER NOT NULL,

    CONSTRAINT "BesoinSpectacle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FicheTechnique" (
    "id" SERIAL NOT NULL,
    "texte" TEXT NOT NULL,
    "pdf" BYTEA,
    "pdfName" TEXT,
    "spectacleId" INTEGER NOT NULL,

    CONSTRAINT "FicheTechnique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Representation" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "spectacleId" INTEGER NOT NULL,
    "lieuId" INTEGER NOT NULL,

    CONSTRAINT "Representation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Objet" (
    "id" SERIAL NOT NULL,
    "typeObjetId" INTEGER NOT NULL,
    "etat" "EtatObjet" NOT NULL DEFAULT 'NEUF',
    "estDisponible" BOOLEAN NOT NULL DEFAULT true,
    "compagnieId" INTEGER NOT NULL,
    "commentaire" TEXT,

    CONSTRAINT "Objet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservationObjet" (
    "id" SERIAL NOT NULL,
    "objetId" INTEGER NOT NULL,
    "representationId" INTEGER NOT NULL,

    CONSTRAINT "ReservationObjet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategorieObjet_nom_key" ON "CategorieObjet"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "TypeObjet_nom_key" ON "TypeObjet"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "FicheTechnique_spectacleId_key" ON "FicheTechnique"("spectacleId");

-- AddForeignKey
ALTER TABLE "TypeObjet" ADD CONSTRAINT "TypeObjet_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "CategorieObjet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spectacle" ADD CONSTRAINT "Spectacle_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BesoinSpectacle" ADD CONSTRAINT "BesoinSpectacle_spectacleId_fkey" FOREIGN KEY ("spectacleId") REFERENCES "Spectacle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BesoinSpectacle" ADD CONSTRAINT "BesoinSpectacle_typeObjetId_fkey" FOREIGN KEY ("typeObjetId") REFERENCES "TypeObjet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FicheTechnique" ADD CONSTRAINT "FicheTechnique_spectacleId_fkey" FOREIGN KEY ("spectacleId") REFERENCES "Spectacle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Representation" ADD CONSTRAINT "Representation_spectacleId_fkey" FOREIGN KEY ("spectacleId") REFERENCES "Spectacle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Representation" ADD CONSTRAINT "Representation_lieuId_fkey" FOREIGN KEY ("lieuId") REFERENCES "Lieu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objet" ADD CONSTRAINT "Objet_typeObjetId_fkey" FOREIGN KEY ("typeObjetId") REFERENCES "TypeObjet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objet" ADD CONSTRAINT "Objet_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationObjet" ADD CONSTRAINT "ReservationObjet_objetId_fkey" FOREIGN KEY ("objetId") REFERENCES "Objet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationObjet" ADD CONSTRAINT "ReservationObjet_representationId_fkey" FOREIGN KEY ("representationId") REFERENCES "Representation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
