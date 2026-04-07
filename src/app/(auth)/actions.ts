"use server";

import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function registerUser(formData: FormData) {
  try {
    const nom = formData.get("nom") as string;
    const prenom = formData.get("prenom") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || !nom || !prenom) {
      return { error: "Veuillez remplir tous les champs" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Cet email est déjà utilisé" };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await prisma.user.create({
      data: {
        nom,
        prenom,
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Registration error:", err);
    return { error: err.message || "Erreur lors de la création du compte." };
  }
}
