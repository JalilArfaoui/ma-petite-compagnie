/*
  Warnings:

  - Added the required column `idCompagnie` to the `Lieu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lieu" ADD COLUMN     "idCompagnie" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Lieu" ADD CONSTRAINT "Lieu_idCompagnie_fkey" FOREIGN KEY ("idCompagnie") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
