"use client";

import { useRouter } from "next/navigation";
import { Container, Stack, Heading, Badge, Flex, SimpleGrid } from "@/components/ui";
import { LuArrowLeft } from "react-icons/lu";
import Link from "next/link";
import { CompagnieHeader } from "./CompagnieHeader";
import { AjoutMembreForm } from "./AjoutMembreForm";
import { CarteMembre } from "./CarteMembre";
import type { CompagnieData, Member, MemberRights } from "./types";

export default function CompagnieDetailClient({
  compagnie,
  currentMembership,
  currentUserId,
}: {
  compagnie: CompagnieData;
  currentMembership: Member;
  currentUserId: number;
}) {
  const router = useRouter();
  const rights = currentMembership as MemberRights;

  return (
    <Container className="py-12 max-w-4xl">
      <Stack gap={8}>
        <Link
          href="/profil"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors w-fit"
        >
          <LuArrowLeft size={14} /> Retour au profil
        </Link>

        <CompagnieHeader
          compagnieId={compagnie.id}
          initialNom={compagnie.nom}
          canEdit={rights.droitModificationCompagnie}
          canDelete={rights.droitSuppressionCompagnie}
          onDeleted={() => router.push("/profil")}
        />

        {rights.droitAjoutMembre && (
          <AjoutMembreForm
            compagnieId={compagnie.id}
            canSetRights={rights.droitGestionDroitsMembres}
            onMemberAdded={() => router.refresh()}
          />
        )}

        <Stack gap={4}>
          <Flex align="center" gap={3}>
            <Heading as="h3" className="font-serif">
              Membres
            </Heading>
            <Badge variant="blue">{compagnie.membres.length}</Badge>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {compagnie.membres.map((member) => (
              <CarteMembre
                key={member.id}
                member={member}
                currentUserId={currentUserId}
                canRemove={rights.droitSuppressionMembre}
                canManageRights={rights.droitGestionDroitsMembres}
                onRemoved={() => router.refresh()}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Stack>
    </Container>
  );
}
