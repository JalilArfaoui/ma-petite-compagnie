import {
  creerContact,
  listerContacts,
  modifierContact,
  supprimerContact,
} from "../app/communication/api/contact/contact";
import { validerTelephone } from "@/app/communication/utils/helper";
import { validerEmail } from "@/app/communication/utils/helper";
import { describe, it, expect, afterAll, beforeAll } from "vitest";
import { creerObjetContactAvecNom } from "./testContactUtility";
import { Contact } from "@prisma/client";
import { prisma } from "@/lib/prisma";

async function creerUnContactAvecNom(nom: string, email: string): Promise<Contact> {
  const contact = await creerObjetContactAvecNom(nom, email);
  const created = await creerContact(contact);
  if (created.donnee == null) {
    expect.fail("Le contact n'a pas été créé correctement. Message : " + created.message);
  }
  return created.donnee;
}
it.skip("fichier .env chargé", () => {
  expect(
    process.env.DATABASE_URL,
    "Le fichier .env n'a pas été chargé vérifié que dotenv est utilisé dans vitest afin de le chargé"
  ).toBeDefined();
});
describe("Contact", () => {
  const contactACleanup: Contact[] = [];
  beforeAll(async () => {
    await prisma.contact.deleteMany({});
  });
  

  afterAll(async () => {
    contactACleanup.forEach(async (contact) => {
      console.log(contact);
      if (contact) {
        console.log(await supprimerContact(contact.id));
      }
    });
  });

  it("Valider téléphone", async () => {
    const resultat = validerTelephone("0011223344");
    expect(resultat?.succes).toBe(true);
    const resultat2 = validerTelephone("001122334");
    expect(resultat2?.succes).toBe(false);
    const resultat2Bis = validerTelephone("00112233445");
    expect(resultat2Bis?.succes).toBe(false);

    const resultat3 = validerTelephone("+33 011223344");
    expect(resultat3?.succes).toBe(true);

    const resultat4 = validerTelephone("00-11-22-33-44");
    expect(resultat4?.succes).toBe(true);
  });
  it("Valider email", async () => {
    const resultat = validerEmail("test.1@email.com");
    expect(resultat.succes).toBe(true);
    const resultat2 = validerEmail("test.10@email.");
    expect(resultat2.succes).toBe(false);
    const resultat3 = validerEmail("test.10email.");
    expect(resultat3.succes).toBe(false);
    const resultat4 = validerEmail("test.10@.com");
    expect(resultat4.succes).toBe(false);
  });
  it.skip("Créer un contact", async () => {
    const created = await creerUnContactAvecNom("TestLire2", "email@gmail.com");
    contactACleanup.push(created);
    expect(created).toBeDefined();
    expect(created.nom).toStrictEqual("TestLire2");
  });
  it.skip("Lister des contacts", async () => {
    const created = await creerUnContactAvecNom("TestLire4Test", "email2@gmail.com");
    const contactsListe = await listerContacts();
    contactACleanup.push(created);
    expect(contactsListe.succes).toBe(true);
    expect(contactsListe.donnee?.length).toBeGreaterThanOrEqual(1);
    if (contactsListe.donnee?.length == 1) {
      expect(contactsListe.donnee[0]).toStrictEqual(created);
    }
  });
  it.skip("Modifier un contact", async () => {
    const created = await creerUnContactAvecNom("TestModifier", "email3@gmail.com");
    contactACleanup.push(created);
    const modifier = await modifierContact(
      created.id,
      creerObjetContactAvecNom("TestModification", "email3Modi@gmail.com")
    );
    expect(modifier.donnee?.nom).toBe("TestModification");
  });
  it.skip("Supprimer un contact", async () => {
    const created = await creerUnContactAvecNom("TestSuppressionContact", "email4@gmail.com");
    await supprimerContact(created.id);
  });
  it("Créer un contact sans nom", async () => {
    const result = await creerContact(creerObjetContactAvecNom("", ""));
    expect(result.succes).toBe(false);
  });
  it("Créer un contact avec mauvais email", async () => {
    const result = await creerContact({
      nom: "nom",
      prenom: "User",
      email: "prenom.nom",
      tel: "0011223344",
      role: "PARTENAIRE",
      notes: null,
      ville: null,
      lieu: null,
    });
    expect(result.succes, "Le contact a été créé avec un mauvais email").toBe(false);
  });
});
