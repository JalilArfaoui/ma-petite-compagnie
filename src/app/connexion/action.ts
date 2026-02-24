"use server";

import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export type ResultatAuth = { succes: boolean; message: string };

export async function inscrireUtilisateur(formData: FormData): Promise<ResultatAuth> {
  const nom = formData.get("nom")?.toString().trim() ?? "";
  const prenom = formData.get("prenom")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const motDePasse = formData.get("motDePasse")?.toString() ?? "";
  const confirmation = formData.get("confirmation")?.toString() ?? "";

  if (!nom || !prenom || !email || !motDePasse) {
    return { succes: false, message: "Tous les champs sont obligatoires." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { succes: false, message: "L'adresse email n'est pas valide." };
  }

  if (motDePasse.length < 8) {
    return { succes: false, message: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  if (motDePasse !== confirmation) {
    return { succes: false, message: "Les mots de passe ne correspondent pas." };
  }

  const existant = await prisma.utilisateur.findUnique({ where: { email } });
  if (existant) {
    return { succes: false, message: "Cette adresse email est déjà utilisée." };
  }

  const motDePasseHache = await bcryptjs.hash(motDePasse, 12);

  await prisma.utilisateur.create({
    data: { nom, prenom, email, motDePasse: motDePasseHache },
  });

  return { succes: true, message: "Compte créé avec succès." };
}

export async function connecterUtilisateur(formData: FormData): Promise<ResultatAuth> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const motDePasse = formData.get("motDePasse")?.toString() ?? "";

  if (!email || !motDePasse) {
    return { succes: false, message: "Email et mot de passe sont obligatoires." };
  }

  try {
    await signIn("credentials", {
      email,
      motDePasse,
      redirect: false,
    });
    return { succes: true, message: "Connexion réussie." };
  } catch (error) {
    if (error instanceof AuthError) {
      return { succes: false, message: "Email ou mot de passe incorrect." };
    }
    return { succes: false, message: "Une erreur est survenue lors de la connexion." };
  }
}
