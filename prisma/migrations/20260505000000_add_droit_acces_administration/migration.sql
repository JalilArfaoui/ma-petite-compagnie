ALTER TABLE "CompanyMember" ADD COLUMN "droitAccesAdministration" BOOLEAN NOT NULL DEFAULT false;

UPDATE "CompanyMember"
SET "droitAccesAdministration" = true
WHERE "droitGestionDroitsMembres" = true
  AND "droitSuppressionCompagnie" = true;
