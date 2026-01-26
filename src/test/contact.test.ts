import { PrismaClient } from "@prisma/client/extension";
import {
  createContact,
  supprimerParId,
  getMany,
  trouverParNom,
  mettreAJour,
  getPrismaClient,
} from "../app/communication/api/contact";
import { describe, it, expect, beforeEach, afterEach, afterAll, beforeAll } from "vitest";

describe("Contact", () => {
  it("Créer et lire", async () => {
    const created = await createContact({ nom: "TestLire", prenom: "User" });

    const found = await trouverParNom("TestLire");
    expect(found).toBeDefined();
    expect(found).toStrictEqual(created);
    supprimerParId(created.id);
  });
  it("Supprimer un contact", async () => {
    const created = await createContact({ nom: "Test2", prenom: "User" });
    await supprimerParId(created.id);
    const contactTrouve = await trouverParNom("Test2");
    expect(contactTrouve).toBeNull();
  });
  it("Mettre à jour un contact", async () => {
    const created = await createContact({ nom: "Test3", prenom: "User" });
    const updated = await mettreAJour(created.id, { nom: "Test3Updated", prenom: "User" });
    console.log(updated);
    expect(updated.nom == "Test3Updated").toBe(true);
    await supprimerParId(updated.id);
  });
});
