import { Contact, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "../../../../envConfig.ts";
console.log("env database is " + process.env.DATABASE_URL);
export type ContactInformation = Omit<Contact, "id" | "date_creation">;
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
export async function getPrismaClient() {
  return prisma;
}

type Result<T> = { success: boolean; message: string; contact: T | null };

function resultOf<T>(success: boolean, message: string, contact: T | null): Result<T> {
  return { success: success, message: message, contact: contact };
}
export async function createContact(contact: ContactInformation) {
  if (!contact.nom || contact.nom.trim().length == 0 || contact.prenom.trim().length == 0) {
    return resultOf(false, "Le nom ou le prénom est vide.", null);
  }
  const newContact = await prisma.contact.create({
    data: {
      ...contact,
    },
  });
  return resultOf(true, "", newContact);
}

export async function trouverParNom(nom: string) {
  return resultOf(true, "", await prisma.contact.findFirst({ where: { nom: nom } }));
}
export async function getMany() {
  return resultOf(true, "", await prisma.contact.findMany());
}

export async function mettreAJour(contactId: number, newContact: ContactInformation) {
  if (newContact.nom.trim().length == 0 || newContact.prenom.trim().length == 0) {
    return resultOf(false, "Le nom ou le prénom est vide.", null);
  }
  return resultOf(
    true,
    "",
    await prisma.contact.update({ where: { id: contactId }, data: { ...newContact } })
  );
}

export async function supprimerParId(contactId: number) {
  return resultOf(true, "", await prisma.contact.delete({ where: { id: contactId } }));
}
