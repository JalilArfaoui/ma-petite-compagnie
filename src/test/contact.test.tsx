import { creerContact, ContactInformation } from "../app/communication/api/contact/contact";
import { it, expect } from "vitest";

function creerObjetContactAvecNom(nom: string): ContactInformation {
  return { nom: nom, prenom: "User", email: "email@email.com", tel: "0011001100", role: null };
}

it("Créer un mauvais contact", async () => {
  const result = await creerContact(creerObjetContactAvecNom(""));
  expect(result.succes).toBe(false);
});
it("Créer un contact avec email incorrecte", async () => {
  const result = await creerContact({
    nom: "User",
    prenom: "User",
    email: "email@com",
    tel: "0011001100",
    role: null,
  });
  expect(result.succes).toBe(false);
});

it("Créer un contact avec télephone incorrecte", async () => {
  const result = await creerContact({
    nom: "User",
    prenom: "User",
    email: "email@gmail.com",
    tel: "0011",
    role: null,
  });
  expect(result.succes).toBe(false);
});
