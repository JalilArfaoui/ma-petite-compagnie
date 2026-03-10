import { creerContact, listerContacts } from "../app/communication/api/contact/contact";
import { describe, it, expect } from "vitest";
import { creerObjetContactAvecNom } from "./testContactUtility";

async function creerUnContactAvecNom(nom: string) {
  const created = (await creerContact(creerObjetContactAvecNom(nom))).donnee;
  if (created == null) {
    expect.fail("Le contact n'a pas été créé correctement");
    return { id: 1, nom: "", prenom: "", tel: null, email: null };
  }
  return created;
}
it.skip("fichier .env chargé", () => {
  expect(
    process.env.DATABASE_URL,
    "Le fichier .env n'a pas été chargé vérifié que dotenv est utilisé dans vitest afin de le chargé"
  ).toBeDefined();
});
describe("Contact", () => {
  it.skip("Créer un contact", async () => {
    const created = await creerUnContactAvecNom("TestLire2");

    expect(created).toBeDefined();
    expect(created.nom).toStrictEqual("TestLire2");
  });
  it.skip("Lister des contacts", async () => {
    const created = await creerUnContactAvecNom("TestLire4Test");
    const contactsListe = await listerContacts();
    expect(contactsListe.succes).toBe(true);
    expect(contactsListe.donnee?.length).toBeGreaterThanOrEqual(1);
    if (contactsListe.donnee?.length == 1) {
      expect(contactsListe.donnee[0]).toStrictEqual(created);
    }
  });
  it("Créer un contact sans nom", async () => {
    const result = await creerContact(creerObjetContactAvecNom(""));
    expect(result.succes).toBe(false);
  });
  it("Créer un contact avec mauvais email", async () => {
    const result = await creerContact({
      nom: "nom",
      prenom: "User",
      email: "prenom.nom",
      tel: "0011223344",
      role: "PARTENAIRE",
    });
    expect(result.succes, "Le contact a été créé avec un mauvais email").toBe(false);
  });
});
