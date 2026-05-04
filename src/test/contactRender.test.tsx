import { describe, it, expect } from "vitest";
import { Contact } from "@prisma/client";
import { render, screen } from "@testing-library/react";
import { creerObjetContactAvecNom, creerUnContactAPartirInformation } from "./testContactUtility";
import ContactDetails from "@/app/communication/components/contactDetails";

describe("Test des pages pour le contact", () => {
  it("La page détails d'un contact doit afficher les informations du contact", async () => {
    const contactFinal: Contact = {
      id: -1,
      date_creation: new Date(),
      nom: "TestRender",
      prenom: "User",
      email: "prenom.nom@mail.fr",
      tel: "0011223344",
      role: "PARTENAIRE",
      ville: "Paris",
      lieu: "Rue quelque chose",
      notes: "Client très important",
    };
    render(
      <ContactDetails
        onSubmitted={(e) => console.log(e)}
        contactDonnee={contactFinal}
      ></ContactDetails>
    );

    // Vérifie que les noms s'affichent
    expect(await screen.getByDisplayValue("TestRender")).toBeTruthy();
    expect(await screen.getByDisplayValue("User")).toBeTruthy();
    expect(await screen.getByDisplayValue("prenom.nom@mail.fr")).toBeTruthy();
    expect(await screen.getByDisplayValue("0011223344")).toBeTruthy();
    expect(await screen.getByDisplayValue("PARTENAIRE")).toBeTruthy();
    expect(await screen.getByDisplayValue("null")).toBeTruthy();
    expect(await screen.getByDisplayValue("null")).toBeTruthy();
    expect(await screen.getByDisplayValue("null")).toBeTruthy();
  });
});
