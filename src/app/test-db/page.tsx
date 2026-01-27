import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TestDbPage() {
  const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW() as now`;
  const dbTime = result[0].now;

  await prisma.spectacle.create({
  data: {
    id: 1,
    description: 'test_description',
    type: "test_type",
    statut: "test_statut",
    troupe: "test_troupe",
  },
  });

  return (
    <div>
      <h1>Test connexion Prisma</h1>
      <p>Heure serveur PostgreSQL : {dbTime.toISOString()}</p>
    </div>
  );
}
