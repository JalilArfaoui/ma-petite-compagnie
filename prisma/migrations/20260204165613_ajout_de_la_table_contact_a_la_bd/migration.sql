-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COMEDIEN', 'TECHNICIEN', 'PARTENAIRE');

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "role" "Role",
    "email" TEXT,
    "tel" TEXT,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
