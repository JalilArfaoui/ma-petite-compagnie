import { ContactInformation } from "../app/communication/api/contact/contact";
import { describe, it, expect } from "vitest";

function creerObjetContactAvecNom(nom: string): ContactInformation {
  return { nom: nom, prenom: "User", email: null, tel: null, role: null };
}

it("Créer un mauvais contact", async () => {
  const result = await createContact(creerObjetContactAvecNom(""));
  expect(result.success).toBe(false);
});
