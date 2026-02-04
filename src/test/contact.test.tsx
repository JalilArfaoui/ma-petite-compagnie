import { creerUnContact, ContactInformation } from "../app/communication/api/contact/contact";
import { describe, it, expect } from "vitest";

function creerObjetContactAvecNom(nom: string): ContactInformation {
  return { nom: nom, prenom: "User", email: "email@email.com", tel: "0011001100", role: null };
}

it("Créer un mauvais contact", async () => {
  const result = await creerUnContact(creerObjetContactAvecNom(""));
  expect(result.succes).toBe(false);
});
it("Créer un contact avec email incorrecte", async () => {
  const result = await creerUnContact({
    nom: "User",
    prenom: "User",
    email: "email@com",
    tel: "0011001100",
    role: null,
  });
  expect(result.succes).toBe(false);
});

it("Créer un contact avec télephone incorrecte", async () => {
  const result = await creerUnContact({
    nom: "User",
    prenom: "User",
    email: "email@gmail.com",
    tel: "0011",
    role: null,
  });
  expect(result.succes).toBe(false);
});
