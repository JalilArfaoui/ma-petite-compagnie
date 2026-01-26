import { Contact, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "../../../../envConfig.ts";
console.log("env database is " + process.env.DATABASE_URL);
type ContactInformation = Omit<Contact, "id" | "date_creation">;
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
export async function getPrismaClient() {
  return prisma;
}
export async function createContact(contact: ContactInformation) {
  console.log(process.env.DATABASE_URL);
  const newContact = await prisma.contact.create({
    data: {
      ...contact,
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

export async function mettreAJour(contactId: number, newContact: ContactInformation) {
  return prisma.contact.update({ where: { id: contactId }, data: { ...newContact } });
}

export async function supprimerParId(contactId: number) {
  return prisma.contact.delete({ where: { id: contactId } });
}
