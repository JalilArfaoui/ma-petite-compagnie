/*
  Warnings:

  - You are about to drop the column `troupe` on the `Spectacle` table. All the data in the column will be lost.
  - The `type` column on the `Spectacle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `UtilisateurBouchon` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `compagnieId` to the `Spectacle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeSpectacle" AS ENUM ('THEATRE', 'DANSE', 'MUSIQUE', 'CIRQUE', 'AUTRE');

-- CreateEnum
CREATE TYPE "EtatObjet" AS ENUM ('NEUF', 'ABIME', 'CASSE');

-- DropForeignKey
ALTER TABLE "ParticipantsEvenement" DROP CONSTRAINT "ParticipantsEvenement_utilisateurId_fkey";

-- DropForeignKey
ALTER TABLE "UtilisateurBouchon" DROP CONSTRAINT "UtilisateurBouchon_compagnieId_fkey";

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

-- DropTable
DROP TABLE "UtilisateurBouchon";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nom" TEXT,
    "prenom" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyMember" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "compagnieId" INTEGER NOT NULL,
    "droitDestruction" BOOLEAN NOT NULL DEFAULT false,
    "droitModificationInfos" BOOLEAN NOT NULL DEFAULT false,
    "droitGestionUtilisateurs" BOOLEAN NOT NULL DEFAULT false,
    "droitAccesPlanning" BOOLEAN NOT NULL DEFAULT false,
    "droitGestionPlanning" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CompanyMember_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyMember_userId_compagnieId_key" ON "CompanyMember"("userId", "compagnieId");

-- CreateIndex
CREATE UNIQUE INDEX "CategorieObjet_nom_key" ON "CategorieObjet"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "TypeObjet_nom_key" ON "TypeObjet"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "FicheTechnique_spectacleId_key" ON "FicheTechnique"("spectacleId");

-- AddForeignKey
ALTER TABLE "ParticipantsEvenement" ADD CONSTRAINT "ParticipantsEvenement_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyMember" ADD CONSTRAINT "CompanyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyMember" ADD CONSTRAINT "CompanyMember_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
