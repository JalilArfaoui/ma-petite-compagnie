import { describe, it, expect } from "vitest";
import { Contact } from "@prisma/client";
import { render, screen } from "@testing-library/react";
import { creerObjetContactAvecNom, creerUnContactAPartirInformation } from "./testContactUtility";
import ContactDetails from "@/app/communication/components/contactDetails";
import { ChakraProvider } from "@chakra-ui/react";
import { defaultSystem } from "@chakra-ui/react";

describe("Test des pages pour le contact", () => {
  it("La page détails d'un contact doit afficher les informations du contact", async () => {
    const contact = creerObjetContactAvecNom("TestRender", "prenom.nom@mail.fr");
    const contactFinal: Contact = creerUnContactAPartirInformation(contact);
    render(
      <ChakraProvider value={defaultSystem}>
        <ContactDetails
          onSubmitted={(e) => console.log(e)}
          contactDonnee={contactFinal}
        ></ContactDetails>
      </ChakraProvider>
    );

    // Vérifie que les noms s'affichent
    expect(await screen.getByDisplayValue("TestRender")).toBeTruthy();
    expect(await screen.getByDisplayValue("User")).toBeTruthy();
    expect(await screen.getByDisplayValue("prenom.nom@mail.fr")).toBeTruthy();
    expect(await screen.getByDisplayValue("0011223344")).toBeTruthy();
  });
});
