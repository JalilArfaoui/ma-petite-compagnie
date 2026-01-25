-- DropForeignKey
ALTER TABLE "UtilisateurBouchon" DROP CONSTRAINT "UtilisateurBouchon_compagnieId_fkey";

-- AlterTable
ALTER TABLE "UtilisateurBouchon" ALTER COLUMN "compagnieId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UtilisateurBouchon" ADD CONSTRAINT "UtilisateurBouchon_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
