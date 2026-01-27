/*
  Warnings:

  - You are about to drop the column `utilisateurBouchonId` on the `Evenement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[compagnieId]` on the table `Evenement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[participantId]` on the table `Evenement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `compagnieId` to the `Evenement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantId` to the `Evenement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Evenement" DROP CONSTRAINT "Evenement_utilisateurBouchonId_fkey";

-- DropIndex
DROP INDEX "Evenement_utilisateurBouchonId_key";

-- AlterTable
ALTER TABLE "Evenement" DROP COLUMN "utilisateurBouchonId",
ADD COLUMN     "compagnieId" INTEGER NOT NULL,
ADD COLUMN     "participantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UtilisateurBouchon" ADD COLUMN     "droitModificationPlanification" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Compagnie" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "membreId" INTEGER NOT NULL,

    CONSTRAINT "Compagnie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Compagnie_membreId_key" ON "Compagnie"("membreId");

-- CreateIndex
CREATE UNIQUE INDEX "Evenement_compagnieId_key" ON "Evenement"("compagnieId");

-- CreateIndex
CREATE UNIQUE INDEX "Evenement_participantId_key" ON "Evenement"("participantId");

-- AddForeignKey
ALTER TABLE "Compagnie" ADD CONSTRAINT "Compagnie_membreId_fkey" FOREIGN KEY ("membreId") REFERENCES "UtilisateurBouchon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evenement" ADD CONSTRAINT "Evenement_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evenement" ADD CONSTRAINT "Evenement_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "UtilisateurBouchon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
