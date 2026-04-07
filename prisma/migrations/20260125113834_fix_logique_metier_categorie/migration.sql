/*
  Warnings:

  - You are about to drop the column `membreId` on the `Compagnie` table. All the data in the column will be lost.
  - Added the required column `compagnieId` to the `UtilisateurBouchon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Compagnie" DROP CONSTRAINT "Compagnie_membreId_fkey";

-- DropIndex
DROP INDEX "Compagnie_membreId_key";

-- AlterTable
ALTER TABLE "Compagnie" DROP COLUMN "membreId";

-- AlterTable
ALTER TABLE "UtilisateurBouchon" ADD COLUMN     "compagnieId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UtilisateurBouchon" ADD CONSTRAINT "UtilisateurBouchon_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
