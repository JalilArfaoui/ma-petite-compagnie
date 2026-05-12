/*
  Migration corrigée le 2026-05-11 suite à un échec en production.
  Voir le commit associé pour le contexte complet.

  Rendue idempotente :
  - peut être rejouée sur un état partiellement appliqué (Representation
    déjà migrée mais Spectacle.dure encore nullable) ;
  - backfill `Spectacle.dure = 90` pour les éventuelles lignes NULL
    avant le SET NOT NULL.
*/

-- Representation : suppression de date, ajout de debutResa et finResa
ALTER TABLE "Representation" DROP COLUMN IF EXISTS "date";

ALTER TABLE "Representation" ADD COLUMN IF NOT EXISTS "debutResa" TIMESTAMP(3);
UPDATE "Representation" SET "debutResa" = NOW() WHERE "debutResa" IS NULL;
ALTER TABLE "Representation" ALTER COLUMN "debutResa" SET NOT NULL;

ALTER TABLE "Representation" ADD COLUMN IF NOT EXISTS "finResa" TIMESTAMP(3);
UPDATE "Representation" SET "finResa" = NOW() WHERE "finResa" IS NULL;
ALTER TABLE "Representation" ALTER COLUMN "finResa" SET NOT NULL;

-- Spectacle.dure : backfill avant SET NOT NULL
UPDATE "Spectacle" SET "dure" = 90 WHERE "dure" IS NULL;
ALTER TABLE "Spectacle" ALTER COLUMN "dure" SET NOT NULL;
