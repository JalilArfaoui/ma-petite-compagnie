import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { DATABASE_URL } from "@/config/database";

const globalForPrisma = global as unknown as {
  pool: Pool | undefined;
  prisma: PrismaClient | undefined;
};

const pool = globalForPrisma.pool ?? new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
  globalForPrisma.prisma = prisma;
}
