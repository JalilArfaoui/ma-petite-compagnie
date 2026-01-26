import {
  createContact,
  supprimerParId,
  trouverParNom,
  mettreAJour,
  ContactInformation,
  supprimerParNom,
} from "../app/communication/api/contact";
import { describe, it, expect } from "vitest";

function creerObjetContactAvecNom(nom: string): ContactInformation {
  return { nom: nom, prenom: "User", email: null, tel: null, role: null };
}

// Il se peut que les données soit déjà dans la base
async function createAContactWithName(nom: string) {
  const created = (await createContact(creerObjetContactAvecNom(nom))).contact;
  if (created == null) {
    expect(created).toBeDefined();
    return { id: 1, nom: "", prenom: "" };
  }
  return created;
}
describe("Contact", () => {
  it("Créer et lire", async () => {
    await supprimerParNom("TestLire2");
    const created = await createAContactWithName("TestLire2");

    const found = (await trouverParNom("TestLire2")).contact;
    expect(found).toBeDefined();
    expect(found).toStrictEqual(created);
    supprimerParId(created.id);
  });
  it("Supprimer un contact", async () => {
    await supprimerParNom("Test10");
    const created = await createAContactWithName("Test10");
    await supprimerParId(created.id);
    const contactTrouve = (await trouverParNom("Test10")).contact;
    expect(contactTrouve).toBeNull();
  });
  it("Mettre à jour un contact", async () => {
    await supprimerParNom("Test3");
    await supprimerParNom("Test3Updated");
    const created = await createAContactWithName("Test3");
    const updated = (await mettreAJour(created.id, creerObjetContactAvecNom("Test3Updated")))
      .contact;
    if (updated == null) {
      expect(updated).toBeDefined();
      return;
    }
    expect(updated.nom == "Test3Updated").toBe(true);
    await supprimerParId(updated.id);
  });
  it("Créer un mauvais contact", async () => {
    const result = await createContact(creerObjetContactAvecNom(""));
    expect(result.success).toBe(false);
  });
});
