import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type AdministrationContext = {
  userId: number;
  compagnieId: number;
};

type AccessResult = (AdministrationContext & { ok: true }) | { ok: false; error: string };

async function getActiveCompanyContext(): Promise<AccessResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Vous devez être connecté" };
  if (!session.activeCompanyId) {
    return { ok: false, error: "Aucune compagnie active sélectionnée" };
  }

  const userId = Number(session.user.id);
  const compagnieId = Number(session.activeCompanyId);
  const member = await prisma.companyMember.findUnique({
    where: { userId_compagnieId: { userId, compagnieId } },
  });

  if (!member) return { ok: false, error: "Vous n'êtes pas membre de cette compagnie" };

  return { ok: true, userId, compagnieId };
}

export async function getActiveAdministrationContext(): Promise<AccessResult> {
  const context = await getActiveCompanyContext();
  if (!context.ok) return context;

  const member = await prisma.companyMember.findUnique({
    where: {
      userId_compagnieId: {
        userId: context.userId,
        compagnieId: context.compagnieId,
      },
    },
    select: { droitAccesAdministration: true },
  });

  if (!member?.droitAccesAdministration) {
    return { ok: false, error: "Vous n'avez pas les droits nécessaires" };
  }

  return context;
}

export async function requireActiveCompanyAdministration(): Promise<AdministrationContext> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const context = await getActiveAdministrationContext();
  if (!context.ok) redirect("/profil");

  return context;
}
