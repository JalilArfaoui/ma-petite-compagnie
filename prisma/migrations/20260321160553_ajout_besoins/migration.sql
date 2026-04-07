DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
    CREATE TYPE "Role" AS ENUM ('COMEDIEN', 'TECHNICIEN', 'PARTENAIRE');
  END IF;
END$$;

-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'StatutSpectacle') THEN
    CREATE TYPE "StatutSpectacle" AS ENUM ('EN_CREATION', 'EN_REPETITION', 'EN_TOURNEE', 'ARCHIVE');
  END IF;
END$$;

-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TypeSpectacle') THEN
    CREATE TYPE "TypeSpectacle" AS ENUM ('THEATRE', 'DANSE', 'MUSIQUE', 'CIRQUE', 'AUTRE');
  END IF;
END$$;

-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EtatObjet') THEN
    CREATE TYPE "EtatObjet" AS ENUM ('NEUF', 'ABIME', 'CASSE');
  END IF;
END$$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Lieu" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "numero_salle" TEXT,
    "idCompagnie" INTEGER NOT NULL,

    CONSTRAINT "Lieu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Categorie" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "idCompagnie" INTEGER NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Compagnie" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Compagnie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Evenement" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "compagnieId" INTEGER NOT NULL,
    "lieuId" INTEGER NOT NULL,
    "categorieId" INTEGER NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evenement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ParticipantsEvenement" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "evenementId" INTEGER NOT NULL,

    CONSTRAINT "ParticipantsEvenement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "UtilisateurBouchon" (
    "id" SERIAL NOT NULL,
    "compagnieId" INTEGER,
    "droitModificationPlanification" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UtilisateurBouchon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Contact" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "role" "Role",
    "email" TEXT,
    "tel" TEXT,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "CategorieObjet" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "CategorieObjet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TypeObjet" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "image" TEXT,
    "categorieId" INTEGER NOT NULL,

    CONSTRAINT "TypeObjet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Spectacle" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "dure" INTEGER NOT NULL,
    "description" TEXT,
    "type" "TypeSpectacle" NOT NULL,
    "statut" "StatutSpectacle" NOT NULL,
    "budget_initial" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "compagnieId" INTEGER NOT NULL,

    CONSTRAINT "Spectacle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "BesoinSpectacle" (
    "id" SERIAL NOT NULL,
    "spectacleId" INTEGER NOT NULL,
    "typeObjetId" INTEGER NOT NULL,

    CONSTRAINT "BesoinSpectacle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "FicheTechnique" (
    "id" SERIAL NOT NULL,
    "texte" TEXT NOT NULL,
    "spectacleId" INTEGER NOT NULL,

    CONSTRAINT "FicheTechnique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Representation" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "spectacleId" INTEGER NOT NULL,
    "evenementId" INTEGER NOT NULL,

    CONSTRAINT "Representation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Objet" (
    "id" SERIAL NOT NULL,
    "typeObjetId" INTEGER NOT NULL,
    "etat" "EtatObjet" NOT NULL DEFAULT 'NEUF',
    "estDisponible" BOOLEAN NOT NULL DEFAULT true,
    "compagnieId" INTEGER NOT NULL,
    "commentaire" TEXT,

    CONSTRAINT "Objet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ReservationObjet" (
    "id" SERIAL NOT NULL,
    "objetId" INTEGER NOT NULL,
    "representationId" INTEGER NOT NULL,

    CONSTRAINT "ReservationObjet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "CategorieObjet_nom_key" ON "CategorieObjet"("nom");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "FicheTechnique_spectacleId_key" ON "FicheTechnique"("spectacleId");

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Lieu_idCompagnie_fkey') THEN
    ALTER TABLE "Lieu" ADD CONSTRAINT "Lieu_idCompagnie_fkey" FOREIGN KEY ("idCompagnie") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Categorie_idCompagnie_fkey') THEN
    ALTER TABLE "Categorie" ADD CONSTRAINT "Categorie_idCompagnie_fkey" FOREIGN KEY ("idCompagnie") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Evenement_compagnieId_fkey') THEN
    ALTER TABLE "Evenement" ADD CONSTRAINT "Evenement_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Evenement_lieuId_fkey') THEN
    ALTER TABLE "Evenement" ADD CONSTRAINT "Evenement_lieuId_fkey" FOREIGN KEY ("lieuId") REFERENCES "Lieu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Evenement_categorieId_fkey') THEN
    ALTER TABLE "Evenement" ADD CONSTRAINT "Evenement_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ParticipantsEvenement_utilisateurId_fkey') THEN
    ALTER TABLE "ParticipantsEvenement" ADD CONSTRAINT "ParticipantsEvenement_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "UtilisateurBouchon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ParticipantsEvenement_evenementId_fkey') THEN
    ALTER TABLE "ParticipantsEvenement" ADD CONSTRAINT "ParticipantsEvenement_evenementId_fkey" FOREIGN KEY ("evenementId") REFERENCES "Evenement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UtilisateurBouchon_compagnieId_fkey') THEN
    ALTER TABLE "UtilisateurBouchon" ADD CONSTRAINT "UtilisateurBouchon_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TypeObjet_categorieId_fkey') THEN
    ALTER TABLE "TypeObjet" ADD CONSTRAINT "TypeObjet_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "CategorieObjet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Spectacle_compagnieId_fkey') THEN
    ALTER TABLE "Spectacle" ADD CONSTRAINT "Spectacle_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'BesoinSpectacle_spectacleId_fkey') THEN
    ALTER TABLE "BesoinSpectacle" ADD CONSTRAINT "BesoinSpectacle_spectacleId_fkey" FOREIGN KEY ("spectacleId") REFERENCES "Spectacle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'BesoinSpectacle_typeObjetId_fkey') THEN
    ALTER TABLE "BesoinSpectacle" ADD CONSTRAINT "BesoinSpectacle_typeObjetId_fkey" FOREIGN KEY ("typeObjetId") REFERENCES "TypeObjet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FicheTechnique_spectacleId_fkey') THEN
    ALTER TABLE "FicheTechnique" ADD CONSTRAINT "FicheTechnique_spectacleId_fkey" FOREIGN KEY ("spectacleId") REFERENCES "Spectacle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Representation_spectacleId_fkey') THEN
    ALTER TABLE "Representation" ADD CONSTRAINT "Representation_spectacleId_fkey" FOREIGN KEY ("spectacleId") REFERENCES "Spectacle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Representation_evenementId_fkey') THEN
    ALTER TABLE "Representation" ADD CONSTRAINT "Representation_evenementId_fkey" FOREIGN KEY ("evenementId") REFERENCES "Evenement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Objet_typeObjetId_fkey') THEN
    ALTER TABLE "Objet" ADD CONSTRAINT "Objet_typeObjetId_fkey" FOREIGN KEY ("typeObjetId") REFERENCES "TypeObjet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Objet_compagnieId_fkey') THEN
    ALTER TABLE "Objet" ADD CONSTRAINT "Objet_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ReservationObjet_objetId_fkey') THEN
    ALTER TABLE "ReservationObjet" ADD CONSTRAINT "ReservationObjet_objetId_fkey" FOREIGN KEY ("objetId") REFERENCES "Objet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ReservationObjet_representationId_fkey') THEN
    ALTER TABLE "ReservationObjet" ADD CONSTRAINT "ReservationObjet_representationId_fkey" FOREIGN KEY ("representationId") REFERENCES "Representation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
