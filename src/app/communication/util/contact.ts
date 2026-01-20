import { Contact, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export async function createContact(nom: string, prenom: string) {
  const newContact = await prisma.contact.create({
    data: {
      nom: nom,
      prenom: prenom,
    },
  });
}
export async function getMany() {
  return await prisma.contact.findMany();
}

export async function update(contact: Contact, newContact: Contact) {
  return prisma.contact.update({ where: { ...contact }, data: { ...newContact } });
}

export async function deleteContact(contact: Contact) {
  return prisma.contact.delete({ where: { ...contact } });
}
