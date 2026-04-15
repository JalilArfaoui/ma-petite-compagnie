/*
  Warnings:

  - Made the column `nom` on table `UtilisateurBouchon` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UtilisateurBouchon" ALTER COLUMN "nom" SET NOT NULL;
