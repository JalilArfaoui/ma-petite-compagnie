/*
  Warnings:

  - You are about to drop the column `participantId` on the `Evenement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Evenement" DROP CONSTRAINT "Evenement_participantId_fkey";

-- DropIndex
DROP INDEX "Evenement_participantId_key";

-- AlterTable
ALTER TABLE "Evenement" DROP COLUMN "participantId";

-- CreateTable
CREATE TABLE "ParticipantsEvenement" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "evenementId" INTEGER NOT NULL,

    CONSTRAINT "ParticipantsEvenement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantsEvenement_utilisateurId_key" ON "ParticipantsEvenement"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantsEvenement_evenementId_key" ON "ParticipantsEvenement"("evenementId");

-- AddForeignKey
ALTER TABLE "ParticipantsEvenement" ADD CONSTRAINT "ParticipantsEvenement_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "UtilisateurBouchon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantsEvenement" ADD CONSTRAINT "ParticipantsEvenement_evenementId_fkey" FOREIGN KEY ("evenementId") REFERENCES "Evenement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
