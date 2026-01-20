/*
  Warnings:

  - You are about to drop the column `role` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "role";

-- DropEnum
DROP TYPE "Role";
