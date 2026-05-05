/*
  Adds the unique constraint declared in Prisma schema for ListeContact.nom.
  This belongs to the Communication domain and is intentionally isolated from
  the Finance operations migration.
*/
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "ListeContact"
    GROUP BY "nom"
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Cannot create unique index ListeContact_nom_key: duplicate ListeContact.nom values exist';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "ListeContact_nom_key" ON "ListeContact"("nom");
