import { prisma } from "@/lib/prisma";
// permet de refresh la liste des spectacles après en avoir ajouté un
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function createSpectacle(formData: FormData) {
  "use server";

  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const statut = formData.get("statut") as string;
  const troupe = formData.get("troupe") as string;

  //jsp pas pourquoi il me souligne le data alors que la migration de l'autoincrement est passée mais ça marche anyway
  await prisma.spectacle.create({
    data: {
      description,
      type,
      statut,
      troupe,
    },
  });
  // le refresh en question
  revalidatePath("/production");
}

export default async function ProductionPage() {
  

  const spectacles = await prisma.spectacle.findMany({
    orderBy: { id: "desc" },
    take: 10,
  });

  return (
    <div>

      <h2>Ajouter un spectacle</h2>
      <form action={createSpectacle}>
        <input type="text" name="description" placeholder="Description" />
        <input type="text" name="type" placeholder="Type" required />
        <input type="text" name="statut" placeholder="Statut" required />
        <input type="text" name="troupe" placeholder="Troupe" required />
        <button type="submit">Ajouter</button>
      </form>

      <h3>liste des spectacles :</h3>
      <ul>
        {spectacles.map((s) => (
          <li key={s.id}>
            {s.id} - {s.description} ({s.type}, {s.statut}, {s.troupe})
          </li>
        ))}
      </ul>
    </div>
  );
}