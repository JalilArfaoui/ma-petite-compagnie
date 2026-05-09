/*
  Warnings:

  - The `statut` column on the `Cachet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatutCachet" AS ENUM ('NON_PAYE', 'EN_ATTENTE_DE_PAIEMENT', 'PAYE');

-- AlterTable
ALTER TABLE "Cachet" DROP COLUMN "statut",
ADD COLUMN     "statut" "StatutCachet" NOT NULL DEFAULT 'NON_PAYE';
