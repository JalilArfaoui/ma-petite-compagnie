-- AlterTable
ALTER TABLE "Compagnie" ADD COLUMN     "capitalSocial" DOUBLE PRECISION,
ADD COLUMN     "formeJuridique" TEXT,
ADD COLUMN     "rcs" TEXT,
ADD COLUMN     "siren" TEXT;

-- AlterTable
ALTER TABLE "Facture" ADD COLUMN     "clientSiren" TEXT;

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

-- AddForeignKey
ALTER TABLE "Cachet" ADD CONSTRAINT "Cachet_membreId_fkey" FOREIGN KEY ("membreId") REFERENCES "CompanyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cachet" ADD CONSTRAINT "Cachet_spectacleId_fkey" FOREIGN KEY ("spectacleId") REFERENCES "Spectacle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
