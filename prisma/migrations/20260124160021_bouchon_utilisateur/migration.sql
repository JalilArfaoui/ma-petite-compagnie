/*
  Warnings:

  - A unique constraint covering the columns `[utilisateurBouchonId]` on the table `Evenement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `utilisateurBouchonId` to the `Evenement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evenement" ADD COLUMN     "utilisateurBouchonId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UtilisateurBouchon" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "UtilisateurBouchon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Evenement_utilisateurBouchonId_key" ON "Evenement"("utilisateurBouchonId");

-- AddForeignKey
ALTER TABLE "Evenement" ADD CONSTRAINT "Evenement_utilisateurBouchonId_fkey" FOREIGN KEY ("utilisateurBouchonId") REFERENCES "UtilisateurBouchon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
