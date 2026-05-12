import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type ProductionContext = {
  userId: number;
  compagnieId: number;
};

export async function requireActiveCompanyProduction(): Promise<ProductionContext> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (!session.activeCompanyId) redirect("/profil");

  const userId = Number(session.user.id);
  const compagnieId = Number(session.activeCompanyId);

  const member = await prisma.companyMember.findUnique({
    where: { userId_compagnieId: { userId, compagnieId } },
  });

  if (!member) redirect("/profil");

  return { userId, compagnieId };
}
