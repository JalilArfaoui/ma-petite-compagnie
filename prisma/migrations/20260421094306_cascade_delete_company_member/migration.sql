-- DropForeignKey
ALTER TABLE "CompanyMember" DROP CONSTRAINT "CompanyMember_compagnieId_fkey";

-- AddForeignKey
ALTER TABLE "CompanyMember" ADD CONSTRAINT "CompanyMember_compagnieId_fkey" FOREIGN KEY ("compagnieId") REFERENCES "Compagnie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
