/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `ListeContact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Cachet" (
    "id" SERIAL NOT NULL,
    "membreId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "spectacleId" INTEGER NOT NULL,
    "montant" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "Cachet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListeContact_nom_key" ON "ListeContact"("nom");

-- AddForeignKey
ALTER TABLE "Cachet" ADD CONSTRAINT "Cachet_membreId_fkey" FOREIGN KEY ("membreId") REFERENCES "CompanyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cachet" ADD CONSTRAINT "Cachet_spectacleId_fkey" FOREIGN KEY ("spectacleId") REFERENCES "Spectacle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
