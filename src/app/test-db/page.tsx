import { prisma } from "@/lib/prisma";

export default async function TestDbPage() {
  const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW() as now`;
  const dbTime = result[0].now;

  return (
    <div>
      <h1>Test connexion Prisma</h1>
      <p>Heure serveur PostgreSQL : {dbTime.toISOString()}</p>
    </div>
  );
}
