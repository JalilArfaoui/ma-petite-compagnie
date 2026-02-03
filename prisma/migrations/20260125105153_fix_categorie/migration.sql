/*
  Warnings:

  - You are about to drop the column `typeId` on the `Evenement` table. All the data in the column will be lost.
  - You are about to drop the `Type` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categorieId` to the `Evenement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Evenement" DROP CONSTRAINT "Evenement_typeId_fkey";

-- AlterTable
ALTER TABLE "Evenement" DROP COLUMN "typeId",
ADD COLUMN     "categorieId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Type";

-- CreateTable
CREATE TABLE "Categorie" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "idCompagnie" INTEGER NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Categorie" ADD CONSTRAINT "Categorie_idCompagnie_fkey" FOREIGN KEY ("idCompagnie") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evenement" ADD CONSTRAINT "Evenement_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
