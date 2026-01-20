import { PrismaClient } from "@prisma/client";

export async function createContact(nom: string, prenom: string) {
  const prisma = new PrismaClient();
  const newContact = await prisma.contact.create({
    data: {
      nom: nom,
      prenom: prenom,
    },
  });
}
