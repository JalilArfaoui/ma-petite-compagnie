import { MappageAttributs, mappingTexte } from "@/app/communication/components/CSVContactImport";
import { describe, expect, it } from "vitest";

describe("Test CSV", () => {
  it("Lecture renvoie objets avec bon champs", async () => {
    const texte: string = `
        NomTest,Prenom,Email,Notes
        Laurent,Mathis,laurent3.mathis@gmail.com,"J'ai appelé cette personne, a X je dois rappeller Y"
        Benoit,Jaufrey,benoit3.jaufrey@email.com,
    `;
    const mappage: MappageAttributs = {
      attributsObjets: ["Nom", "Prenom"],
      attributsCSV: ["NomTest", "Prenom"],
    };

    const objet = mappingTexte(mappage, ["NomTest", "Prenom", "Email", "Notes"], texte);
    expect(objet[0].Nom).toBeDefined();
    expect(objet[0].Prenom).toBeDefined();
  });
  it("Lecture renvoie bon objets selon le texte", async () => {
    const texte: string = `NomTest,Prenom,Email,Notes
Laurent,Mathis,laurent3.mathis@gmail.com,"J'ai appelé cette personne, a X je dois rappeller Y"
Benoit,Jaufrey,benoit3.jaufrey@email.com,`;
    const mappage: MappageAttributs = {
      attributsObjets: ["Nom", "Prenom"],
      attributsCSV: ["NomTest", "Prenom"],
    };

    const objet = mappingTexte(mappage, ["NomTest", "Prenom", "Email", "Notes"], texte);
    expect(objet[0].Nom).toBe("Laurent");
    expect(objet[0].Prenom).toBe("Mathis");
    expect(objet[1].Nom).toBe("Benoit");
    expect(objet[1].Prenom).toBe("Jaufrey");
    expect(objet.length).toBe(2);
  });

  it("Lecture d'autre champs", async () => {
    const texte: string = `NomTest,Prenom,Email,Notes
Laurent,Mathis,laurent3.mathis@gmail.com,"J'ai appelé cette personne, a X je dois rappeller Y"
Benoit,Jaufrey,benoit3.jaufrey@email.com,`;
    const mappage: MappageAttributs = {
      attributsObjets: ["Email", "N"],
      attributsCSV: ["Email", "Notes"],
    };

    const objet = mappingTexte(mappage, ["NomTest", "Prenom", "Email", "Notes"], texte);
    expect(objet[0].Email).toBeDefined();
    expect(objet[0].N).toBeDefined();
    expect(objet[0].Email).toBe("laurent3.mathis@gmail.com");
    expect(objet[0].N).toBe("J'ai appelé cette personne, a X je dois rappeller Y");
    expect(objet[1].N).toBe("");
  });
});
