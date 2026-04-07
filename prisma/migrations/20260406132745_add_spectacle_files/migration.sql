-- AlterTable
ALTER TABLE "FicheTechnique" ADD COLUMN     "pdf" BYTEA,
ADD COLUMN     "pdfName" TEXT;

-- AlterTable
ALTER TABLE "Spectacle" ADD COLUMN     "dossierArtistique" BYTEA,
ADD COLUMN     "dossierArtistiqueName" TEXT,
ADD COLUMN     "image" BYTEA,
ADD COLUMN     "imageMimeType" TEXT;
