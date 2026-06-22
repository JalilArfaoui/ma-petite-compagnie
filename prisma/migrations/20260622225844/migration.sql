/*
  Warnings:

  - A unique constraint covering the columns `[compagnieId,email]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Contact_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "Contact_compagnieId_email_key" ON "Contact"("compagnieId", "email");
