/*
  Migration corrigée le 2026-05-11 suite à la divergence avec la prod.
  Voir le commit associé pour le contexte complet.

  Rendue idempotente :
  - peut être rejouée sur un état partiellement appliqué (la prod avait
    déjà la table Cachet sous une ancienne forme : montant en INTEGER,
    pas de colonne statut, enum StatutCachet absent) ;
  - aligne les types et ajoute la colonne statut si elle manque.
*/

-- Création du type StatutCachet si manquant
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'StatutCachet') THEN
    CREATE TYPE "StatutCachet" AS ENUM ('NON_PAYE', 'EN_ATTENTE_DE_PAIEMENT', 'PAYE');
  END IF;
END $$;

-- Compagnie : ajout des champs de facturation
ALTER TABLE "Compagnie"
  ADD COLUMN IF NOT EXISTS "capitalSocial" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "formeJuridique" TEXT,
  ADD COLUMN IF NOT EXISTS "rcs" TEXT,
  ADD COLUMN IF NOT EXISTS "siren" TEXT;

-- Facture : ajout de clientSiren
ALTER TABLE "Facture" ADD COLUMN IF NOT EXISTS "clientSiren" TEXT;

-- Cachet : création si absente
CREATE TABLE IF NOT EXISTS "Cachet" (
    "id" SERIAL NOT NULL,
    "membreId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "spectacleId" INTEGER NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "statut" "StatutCachet" NOT NULL DEFAULT 'NON_PAYE',
    "note" TEXT,
    CONSTRAINT "Cachet_pkey" PRIMARY KEY ("id")
);

-- Alignement si la table existait déjà avec un schéma incomplet
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Cachet' AND column_name = 'montant' AND data_type = 'integer'
  ) THEN
    ALTER TABLE "Cachet" ALTER COLUMN "montant" TYPE DECIMAL(10,2) USING "montant"::numeric;
  END IF;
END $$;

ALTER TABLE "Cachet" ADD COLUMN IF NOT EXISTS "statut" "StatutCachet" NOT NULL DEFAULT 'NON_PAYE';

-- Foreign keys (idempotentes)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'Cachet_membreId_fkey' AND table_name = 'Cachet'
  ) THEN
    ALTER TABLE "Cachet" ADD CONSTRAINT "Cachet_membreId_fkey"
      FOREIGN KEY ("membreId") REFERENCES "CompanyMember"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'Cachet_spectacleId_fkey' AND table_name = 'Cachet'
  ) THEN
    ALTER TABLE "Cachet" ADD CONSTRAINT "Cachet_spectacleId_fkey"
      FOREIGN KEY ("spectacleId") REFERENCES "Spectacle"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
