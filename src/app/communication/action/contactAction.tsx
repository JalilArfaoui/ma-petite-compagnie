"use server";
import { obtenirBeaucoupContact, supprimerParId } from "../api/contact";

export async function obtenirContacts() {
  return await obtenirBeaucoupContact();
}

export async function supprimerContact(id: number) {
  return await supprimerParId(id);
}
