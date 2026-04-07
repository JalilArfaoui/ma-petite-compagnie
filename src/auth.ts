import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { type CompanyRights } from "@/types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;
        const passwordsMatch = await bcryptjs.compare(
          credentials.password as string,
          user.password
        );
        if (passwordsMatch) return { ...user, id: String(user.id) };
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      try {
        if (user) {
          token.id = user.id;
          token.nom = user.nom;
          token.prenom = user.prenom;
        }

        if (trigger === "update" && session?.activeCompanyId !== undefined) {
          const userId = token.id || token.sub;
          if (session.activeCompanyId === null) {
            token.activeCompanyId = null;
            token.rights = null;
          } else if (userId) {
            const membership = await prisma.companyMember.findUnique({
              where: {
                userId_compagnieId: {
                  userId: Number(userId),
                  compagnieId: Number(session.activeCompanyId),
                },
              },
            });
            if (membership) {
              token.activeCompanyId = membership.compagnieId;
              token.rights = membership;
            }
          }
        }
      } catch (error) {
        console.error("JWT Callback Error:", error);
      }

      return token;
    },

    async session({ session, token }) {
      try {
        if (!session.user) return session;

        const userId = token.id || token.sub;

        session.user.id = token.id as string;
        session.user.nom = token.nom as string;
        session.user.prenom = token.prenom as string;

        if (userId) {
          const memberships = await prisma.companyMember.findMany({
            where: { userId: Number(userId) },
            include: { compagnie: true },
          });

          session.companies = memberships.map((m) => ({
            id: m.compagnie.id,
            nom: m.compagnie.nom,
          }));

          if (!token.activeCompanyId && memberships.length > 0) {
            session.activeCompanyId = memberships[0].compagnieId;
            session.rights = {
              droitModificationCompagnie: memberships[0].droitModificationCompagnie,
              droitSuppressionCompagnie: memberships[0].droitSuppressionCompagnie,
              droitAjoutMembre: memberships[0].droitAjoutMembre,
              droitSuppressionMembre: memberships[0].droitSuppressionMembre,
              droitGestionDroitsMembres: memberships[0].droitGestionDroitsMembres,
              droitAccesPlanning: memberships[0].droitAccesPlanning,
              droitGestionPlanning: memberships[0].droitGestionPlanning,
            };
          } else {
            session.activeCompanyId = token.activeCompanyId as number | null | undefined;
            session.rights = token.rights as CompanyRights | null | undefined;
          }
        }
      } catch (error) {
        console.error("Session Callback Error:", error);
      }

      return session;
    },
  },
});
