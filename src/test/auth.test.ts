import { describe, it, expect, vi, beforeEach } from "vitest";
import { inscrireUtilisateur } from "@/app/connexion/action";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    utilisateur: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("next-auth", () => ({
  default: vi.fn(),
  AuthError: class AuthError extends Error {},
}));

import { prisma } from "@/lib/prisma";

function creerFormData(data: Record<string, string>): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));
  return formData;
}

describe("inscrireUtilisateur", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne une erreur si les champs sont vides", async () => {
    const formData = creerFormData({
      nom: "",
      prenom: "",
      email: "",
      motDePasse: "",
      confirmation: "",
    });
    const result = await inscrireUtilisateur(formData);
    expect(result.succes).toBe(false);
    expect(result.message).toBeTruthy();
  });

  it("retourne une erreur si l'email est invalide", async () => {
    const formData = creerFormData({
      nom: "Dupont",
      prenom: "Jean",
      email: "pas-un-email",
      motDePasse: "motdepasse123",
      confirmation: "motdepasse123",
    });
    const result = await inscrireUtilisateur(formData);
    expect(result.succes).toBe(false);
    expect(result.message).toContain("email");
  });

  it("retourne une erreur si le mot de passe est trop court", async () => {
    const formData = creerFormData({
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@example.com",
      motDePasse: "court",
      confirmation: "court",
    });
    const result = await inscrireUtilisateur(formData);
    expect(result.succes).toBe(false);
    expect(result.message).toContain("8 caractères");
  });

  it("retourne une erreur si les mots de passe ne correspondent pas", async () => {
    const formData = creerFormData({
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@example.com",
      motDePasse: "motdepasse123",
      confirmation: "motdepasse456",
    });
    const result = await inscrireUtilisateur(formData);
    expect(result.succes).toBe(false);
    expect(result.message).toContain("correspondent");
  });

  it("retourne une erreur si l'email est déjà utilisé", async () => {
    vi.mocked(prisma.utilisateur.findUnique).mockResolvedValue({
      id: 1,
      email: "jean.dupont@example.com",
      motDePasse: "hash",
      nom: "Dupont",
      prenom: "Jean",
      compagnieId: null,
      droitModificationPlanification: false,
      date_creation: new Date(),
    });

    const formData = creerFormData({
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@example.com",
      motDePasse: "motdepasse123",
      confirmation: "motdepasse123",
    });
    const result = await inscrireUtilisateur(formData);
    expect(result.succes).toBe(false);
    expect(result.message).toContain("déjà utilisée");
  });

  it("crée l'utilisateur avec succès si les données sont valides", async () => {
    vi.mocked(prisma.utilisateur.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.utilisateur.create).mockResolvedValue({
      id: 1,
      email: "jean.dupont@example.com",
      motDePasse: "hash",
      nom: "Dupont",
      prenom: "Jean",
      compagnieId: null,
      droitModificationPlanification: false,
      date_creation: new Date(),
    });

    const formData = creerFormData({
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@example.com",
      motDePasse: "motdepasse123",
      confirmation: "motdepasse123",
    });
    const result = await inscrireUtilisateur(formData);
    expect(result.succes).toBe(true);
    expect(prisma.utilisateur.create).toHaveBeenCalledOnce();
  });
});
