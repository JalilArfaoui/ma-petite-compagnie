/*
  Warnings:

  - You are about to drop the column `date` on the `Representation` table. All the data in the column will be lost.
  - Added the required column `debutResa` to the `Representation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finResa` to the `Representation` table without a default value. This is not possible if the table is not empty.
  - Made the column `dure` on table `Spectacle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Representation" DROP COLUMN "date",
ADD COLUMN     "debutResa" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "finResa" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Spectacle" ALTER COLUMN "dure" SET NOT NULL;
