import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      compagnies: {
        include: {
          compagnie: true
        }
      }
    }
  });

  console.log("=== Debug DB ===");
  users.forEach(user => {
    console.log(`User: ${user.email} (ID: ${user.id})`);
    console.log(`Companies:`, user.compagnies.map(m => ({ 
      id: m.compagnie.id, 
      nom: m.compagnie.nom,
      userId: m.userId 
    })));
    console.log("-----------------");
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
