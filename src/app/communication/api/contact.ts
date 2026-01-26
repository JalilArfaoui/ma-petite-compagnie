import { Contact, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "../../../../envConfig.ts";
console.log("env database is " + process.env.DATABASE_URL);
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export async function createContact(nom: string, prenom: string) {
  console.log(process.env.DATABASE_URL);
  const newContact = await prisma.contact.create({
    data: {
      nom: nom,
      prenom: prenom,
    },
  });
  return newContact;
}

export async function trouverParNom(nom: string) {
  return await prisma.contact.findFirst({ where: { nom: nom } });
}
export async function getMany() {
  return await prisma.contact.findMany();
}

export async function update(contact: Contact, newContact: Contact) {
  return prisma.contact.update({ where: { ...contact }, data: { ...newContact } });
}

export async function supprimerParId(contactId: number) {
  return prisma.contact.delete({ where: { id: contactId } });
}
