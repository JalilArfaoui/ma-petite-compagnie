/*
  Warnings:

  - You are about to drop the `UtilisateurBouchon` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ParticipantsEvenement" DROP CONSTRAINT "ParticipantsEvenement_utilisateurId_fkey";

-- DropForeignKey
ALTER TABLE "UtilisateurBouchon" DROP CONSTRAINT "UtilisateurBouchon_compagnieId_fkey";

-- DropTable
DROP TABLE "UtilisateurBouchon";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nom" TEXT,
    "prenom" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyMember" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "compagnieId" INTEGER NOT NULL,
    "droitDestruction" BOOLEAN NOT NULL DEFAULT false,
    "droitModificationInfos" BOOLEAN NOT NULL DEFAULT false,
    "droitGestionUtilisateurs" BOOLEAN NOT NULL DEFAULT false,
    "droitAccesPlanning" BOOLEAN NOT NULL DEFAULT false,
    "droitGestionPlanning" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CompanyMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyMember_userId_compagnieId_key" ON "CompanyMember"("userId", "compagnieId");

-- AddForeignKey
ALTER TABLE "ParticipantsEvenement" ADD CONSTRAINT "ParticipantsEvenement_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyMember" ADD CONSTRAINT "CompanyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyMember" ADD CONSTRAINT "CompanyMember_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
