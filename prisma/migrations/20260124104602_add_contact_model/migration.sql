-- CreateEnum
CREATE TYPE "Role" AS ENUM ('contribu', 'useur', 'boos', 'Autre');

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'useur',
    "nom" TEXT,
    "prenom" TEXT,
    "age" INTEGER,
    "email" TEXT,
    "tel" TEXT,
    "insta" TEXT,
    "x" TEXT,
    "facebook" TEXT,
    "discord" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
