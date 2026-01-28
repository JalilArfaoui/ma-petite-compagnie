-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER');

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "insta" TEXT NOT NULL,
    "X" TEXT NOT NULL,
    "facebook" TEXT NOT NULL,
    "discord" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
