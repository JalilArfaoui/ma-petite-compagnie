import { creerUnContact, ContactInformation } from "../app/communication/api/contact/contact";
import { describe, it, expect } from "vitest";

function creerObjetContactAvecNom(nom: string): ContactInformation {
  return { nom: nom, prenom: "User", email: "email@email.com", tel: "0011001100", role: null };
}

it("Créer un mauvais contact", async () => {
  const result = await creerUnContact(creerObjetContactAvecNom(""));
  expect(result.succes).toBe(false);
});
