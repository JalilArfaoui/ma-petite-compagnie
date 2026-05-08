/*
  Warnings:

  - Added the required column `statut` to the `Cachet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cachet" ADD COLUMN     "statut" INTEGER NOT NULL;
