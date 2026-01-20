/*
  Warnings:

  - You are about to drop the column `X` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `discord` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `facebook` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `insta` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `tel` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "X",
DROP COLUMN "age",
DROP COLUMN "discord",
DROP COLUMN "email",
DROP COLUMN "facebook",
DROP COLUMN "insta",
DROP COLUMN "tel";
