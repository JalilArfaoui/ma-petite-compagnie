/*
  Warnings:

  - You are about to drop the column `email` on the `Evenement` table. All the data in the column will be lost.
  - Added the required column `lieuId` to the `Evenement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `Evenement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `Evenement` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Evenement_email_key";

-- AlterTable
ALTER TABLE "Evenement" DROP COLUMN "email",
ADD COLUMN     "lieuId" INTEGER NOT NULL,
ADD COLUMN     "nom" TEXT NOT NULL,
ADD COLUMN     "typeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Lieu" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "numero_salle" TEXT,

    CONSTRAINT "Lieu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Evenement" ADD CONSTRAINT "Evenement_lieuId_fkey" FOREIGN KEY ("lieuId") REFERENCES "Lieu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evenement" ADD CONSTRAINT "Evenement_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
