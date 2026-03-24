/*
  Warnings:

  - A unique constraint covering the columns `[lieuId]` on the table `Evenement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[typeId]` on the table `Evenement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Evenement_lieuId_key" ON "Evenement"("lieuId");

-- CreateIndex
CREATE UNIQUE INDEX "Evenement_typeId_key" ON "Evenement"("typeId");
