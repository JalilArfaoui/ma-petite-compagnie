import {
  creerUnContact,
  supprimerParId,
  trouverParNomContact,
  mettreAJourContact,
  supprimerParNomContact as supprimerParNomContact,
} from "../app/communication/api/contact";
import { describe, it, expect } from "vitest";
import { creerObjetContactAvecNom } from "./testContactUtility";

// Il se peut que les données soit déjà dans la base
async function creerUnContactAvecNom(nom: string) {
  const created = (await creerUnContact(creerObjetContactAvecNom(nom))).contact;
  if (created == null) {
    expect.fail("Le contact n'a pas été créé correctement");
    return { id: 1, nom: "", prenom: "" };
  }
  return created;
}
describe("Contact", () => {
  it("Créer et lire", async () => {
    await supprimerParNomContact("TestLire2");
    const created = await creerUnContactAvecNom("TestLire2");

    const found = (await trouverParNomContact("TestLire2")).contact;
    expect(found).toBeDefined();
    expect(found).toStrictEqual(created);
    supprimerParId(created.id);
  });
  it("Supprimer un contact", async () => {
    await supprimerParNomContact("Test10");
    const created = await creerUnContactAvecNom("Test10");
    await supprimerParId(created.id);
    const contactTrouve = (await trouverParNomContact("Test10")).contact;
    expect(contactTrouve).toBeNull();
  });
  it("Mettre à jour un contact", async () => {
    await supprimerParNomContact("Test3");
    await supprimerParNomContact("Test3Updated");
    const created = await creerUnContactAvecNom("Test3");
    const updated = (await mettreAJourContact(created.id, creerObjetContactAvecNom("Test3Updated")))
      .contact;
    if (updated == null) {
      expect(updated).toBeDefined();
      return;
    }
    expect(updated.nom == "Test3Updated").toBe(true);
    await supprimerParId(updated.id);
  });
  it("Créer un contact sans nom", async () => {
    const result = await creerUnContact(creerObjetContactAvecNom(""));
    expect(result.succes).toBe(false);
  });
  it("Créer un contact avec mauvais email", async () => {
    const result = await creerUnContact({
      nom: "nom",
      prenom: "User",
      email: "prenom.nom",
      tel: "0011223344",
      role: "PARTENAIRE",
    });
    expect(result.succes, "Le contact a été créé avec un mauvais email").toBe(false);
  });
});
/*test("Afficher donnée contact dans une interface", async () => {
  await supprimerParNom("TestAffichageContact");
  const created = await createAContactWithName("TestAffichageContact");

  async function getId() {
    return { id: created.id.toString() };
  }
  render(<Contact></Contact>);
  expect(screen.getByText("Page")).toBeDefined();
});*/
