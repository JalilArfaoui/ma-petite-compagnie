/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `ListeContact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ListeContact_nom_key" ON "ListeContact"("nom");
