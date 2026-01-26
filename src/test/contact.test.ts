import {
  createContact,
  supprimerParId,
  getMany,
  trouverParNom,
} from "../app/communication/api/contact";
import { describe, it, expect } from "vitest";
describe("Contact", () => {
  it("create + read", async () => {
    const created = await createContact("Test", "User");
    const list = await getMany();
    expect(list.length).toBeGreaterThan(0);
    expect(list.some((c) => c.id === created.id)).toBe(true);
    supprimerParId(created.id);
  });
  it("Supprimer un contact", async () => {
    const created = await createContact("Test2", "User");
    await supprimerParId(created.id);
    const contactTrouve = await trouverParNom("Test2");
    expect(contactTrouve).toBeNull();
  });
});
