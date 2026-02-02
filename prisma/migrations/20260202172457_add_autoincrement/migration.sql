-- AlterTable
CREATE SEQUENCE spectacle_id_seq;
ALTER TABLE "Spectacle" ALTER COLUMN "id" SET DEFAULT nextval('spectacle_id_seq');
ALTER SEQUENCE spectacle_id_seq OWNED BY "Spectacle"."id";
