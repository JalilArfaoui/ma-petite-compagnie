/*
  Warnings:

  - You are about to drop the column `evenementId` on the `Representation` table. All the data in the column will be lost.
  - Added the required column `lieuId` to the `Representation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Representation" DROP CONSTRAINT "Representation_evenementId_fkey";

-- AlterTable
ALTER TABLE "Representation" DROP COLUMN "evenementId",
ADD COLUMN     "lieuId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Representation" ADD CONSTRAINT "Representation_lieuId_fkey" FOREIGN KEY ("lieuId") REFERENCES "Lieu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
