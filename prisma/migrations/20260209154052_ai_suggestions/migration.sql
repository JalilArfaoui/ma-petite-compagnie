/*
  Warnings:

  - Added the required column `titre` to the `Spectacle` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `statut` on the `Spectacle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatutSpectacle" AS ENUM ('EN_CREATION', 'EN_REPETITION', 'EN_TOURNEE', 'ARCHIVE');

-- AlterTable
ALTER TABLE "Spectacle" ADD COLUMN     "budget_initial" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "titre" TEXT NOT NULL,
DROP COLUMN "statut",
ADD COLUMN     "statut" "StatutSpectacle" NOT NULL;
