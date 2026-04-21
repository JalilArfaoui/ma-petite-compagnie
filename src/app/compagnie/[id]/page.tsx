import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CompagnieDetailClient from "./CompagnieDetailClient";

export const dynamic = "force-dynamic";

export default async function CompagnieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const compagnieId = Number(id);
  const userId = Number(session.user.id);

  const compagnie = await prisma.compagnie.findUnique({
    where: { id: compagnieId },
    include: {
      membres: {
        include: {
          user: { select: { id: true, nom: true, prenom: true, email: true } },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!compagnie) redirect("/profil");

  const currentMember = compagnie.membres.find((m) => m.userId === userId);
  if (!currentMember) redirect("/profil");

  const hasAccess =
    currentMember.droitAccesDetailsCompagnie ||
    currentMember.droitModificationCompagnie ||
    currentMember.droitSuppressionCompagnie ||
    currentMember.droitAjoutMembre ||
    currentMember.droitSuppressionMembre ||
    currentMember.droitGestionDroitsMembres ||
    currentMember.droitAccesPlanning ||
    currentMember.droitGestionPlanning;

  if (!hasAccess) redirect("/profil");

  return (
    <CompagnieDetailClient
      compagnie={compagnie}
      currentMembership={currentMember}
      currentUserId={userId}
    />
  );
}
