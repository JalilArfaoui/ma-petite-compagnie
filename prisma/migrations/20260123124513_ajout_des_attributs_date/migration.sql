/*
  Warnings:

  - Added the required column `dateDebut` to the `Evenement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateFin` to the `Evenement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evenement" ADD COLUMN     "dateDebut" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateFin" TIMESTAMP(3) NOT NULL;
