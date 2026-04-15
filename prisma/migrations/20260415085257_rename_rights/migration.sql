/*
  Warnings:

  - You are about to drop the column `droitDestruction` on the `CompanyMember` table. All the data in the column will be lost.
  - You are about to drop the column `droitGestionUtilisateurs` on the `CompanyMember` table. All the data in the column will be lost.
  - You are about to drop the column `droitModificationInfos` on the `CompanyMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyMember" DROP COLUMN "droitDestruction",
DROP COLUMN "droitGestionUtilisateurs",
DROP COLUMN "droitModificationInfos",
ADD COLUMN     "droitAjoutMembre" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "droitGestionDroitsMembres" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "droitModificationCompagnie" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "droitSuppressionCompagnie" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "droitSuppressionMembre" BOOLEAN NOT NULL DEFAULT false;
