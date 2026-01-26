-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'PARTENAIRE');

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "role" "Role";
