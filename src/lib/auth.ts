import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        motDePasse: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.motDePasse) {
          return null;
        }

        const utilisateur = await prisma.utilisateur.findUnique({
          where: { email: credentials.email as string },
        });

        if (!utilisateur) {
          return null;
        }

        const motDePasseValide = await bcryptjs.compare(
          credentials.motDePasse as string,
          utilisateur.motDePasse
        );

        if (!motDePasseValide) {
          return null;
        }

        return {
          id: String(utilisateur.id),
          email: utilisateur.email,
          name: `${utilisateur.prenom} ${utilisateur.nom}`,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/connexion",
  },
});
