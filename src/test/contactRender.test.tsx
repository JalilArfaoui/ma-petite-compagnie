import ContactModification from "@/app/communication/components/ContactModification";
import { describe, it, expect, vi } from "vitest";
import { Contact } from "@prisma/client";
import { render, screen } from "@testing-library/react";
import { creerObjetContactAvecNom, creerUnContactAPartirInformation } from "./testContactUtility";

describe("Test des pages pour le contact", () => {
  it("Modifier un contact doit afficher les informations du contact", async () => {
    const contact = creerObjetContactAvecNom("TestRender");
    const contactFinal: Contact = creerUnContactAPartirInformation(contact);
    render(
      <ContactModification
        onSubmitted={(e) => console.log(e)}
        contactDonnee={contactFinal}
      ></ContactModification>
    );

    // Vérifie que les noms s'affichent
    expect(await screen.getByDisplayValue("TestRender")).toBeTruthy();
    expect(await screen.getByDisplayValue("User")).toBeTruthy();
    expect(await screen.getByDisplayValue("prenom.nom@mail.fr")).toBeTruthy();
    expect(await screen.getByDisplayValue("0011223344")).toBeTruthy();
  });
});
