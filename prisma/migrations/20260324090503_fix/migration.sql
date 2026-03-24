/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `TypeObjet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TypeObjet_nom_key" ON "TypeObjet"("nom");
