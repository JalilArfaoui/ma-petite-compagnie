/*
  Warnings:

  - Added the required column `compagnieId` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "compagnieId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
