-- CreateTable
CREATE TABLE "OperationFinanciere" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "TypeOperation" NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',
    "source" "SourceOperation" NOT NULL DEFAULT 'MANUEL',
    "categorie" TEXT,
    "fichier" TEXT,
    "factureId" INTEGER,
    "cachetId" INTEGER,
    "compagnieId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperationFinanciere_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OperationFinanciereToSpectacle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OperationFinanciereToSpectacle_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OperationFinanciereToSpectacle_B_index" ON "_OperationFinanciereToSpectacle"("B");

-- AddForeignKey
ALTER TABLE "OperationFinanciere" ADD CONSTRAINT "OperationFinanciere_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OperationFinanciereToSpectacle" ADD CONSTRAINT "_OperationFinanciereToSpectacle_A_fkey" FOREIGN KEY ("A") REFERENCES "OperationFinanciere"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OperationFinanciereToSpectacle" ADD CONSTRAINT "_OperationFinanciereToSpectacle_B_fkey" FOREIGN KEY ("B") REFERENCES "Spectacle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
