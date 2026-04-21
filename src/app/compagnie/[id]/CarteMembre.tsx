"use client";

import { useState } from "react";
import { Card, Stack, Text, Button, Badge, Flex, Box, Switch } from "@/components/ui";
import { LuUserMinus, LuShield } from "react-icons/lu";
import { removeMember, updateMemberRights } from "@/app/(auth)/company-actions";
import { RIGHTS_LABELS, type Member, type MemberRights } from "./types";

function getInitials(user: Member["user"]) {
  return `${user.prenom?.[0] ?? ""}${user.nom?.[0] ?? ""}`.toUpperCase() || user.email[0].toUpperCase();
}

function getDisplayName(user: Member["user"]) {
  return `${user.prenom ?? ""} ${user.nom ?? ""}`.trim() || user.email;
}

export function CarteMembre({
  member,
  currentUserId,
  canRemove,
  canManageRights,
  onRemoved,
}: {
  member: Member;
  currentUserId: number;
  canRemove: boolean;
  canManageRights: boolean;
  onRemoved: () => void;
}) {
  const isSelf = member.userId === currentUserId;

  const [localRights, setLocalRights] = useState<MemberRights | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [rightsError, setRightsError] = useState<string | null>(null);

  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const memberRights: MemberRights =
    localRights ?? (Object.fromEntries(RIGHTS_LABELS.map(({ key }) => [key, member[key]])) as MemberRights);

  const handleToggleRight = async (rightKey: keyof MemberRights, value: boolean) => {
    const previousRights = memberRights;
    const newRights = { ...previousRights, [rightKey]: value };
    setLocalRights(newRights);
    setIsSaving(true);
    setRightsError(null);

    const fd = new FormData();
    fd.set("compagnieId", String(member.compagnieId));
    fd.set("memberId", String(member.id));
    Object.entries(newRights).forEach(([k, v]) => fd.set(k, String(v)));
    const result = await updateMemberRights(fd);

    setIsSaving(false);
    if ("error" in result) {
      setLocalRights(previousRights);
      setRightsError(result.error ?? "Erreur");
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    setRemoveError(null);
    const fd = new FormData();
    fd.set("compagnieId", String(member.compagnieId));
    fd.set("memberId", String(member.id));
    const result = await removeMember(fd);
    setIsRemoving(false);
    if ("error" in result) {
      setRemoveError(result.error ?? "Erreur");
    } else {
      onRemoved();
    }
  };

  return (
    <Card className="p-5 border-black/5 shadow-sm bg-white">
      <Stack gap={4}>
        <Flex align="center" justify="between" gap={3}>
          <Flex align="center" gap={3} className="min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {getInitials(member.user)}
            </div>
            <Box className="min-w-0">
              <Flex align="center" gap={2}>
                <Text className="font-semibold text-slate-900 truncate">{getDisplayName(member.user)}</Text>
                {isSelf && <Badge variant="blue" className="text-[10px] shrink-0">Vous</Badge>}
              </Flex>
              <Text className="text-xs text-slate-400 truncate">{member.user.email}</Text>
            </Box>
          </Flex>

          {canRemove && !isSelf && (
            <Button size="sm" variant="ghost" onClick={handleRemove} disabled={isRemoving}
              className="hover:bg-red-50 hover:text-red-600 shrink-0" icon={<LuUserMinus size={14} />} />
          )}
        </Flex>

        {removeError && <Text className="text-xs text-red-500">{removeError}</Text>}

        {canManageRights && (
          <Box className="border-t border-slate-100 pt-4">
            <Flex align="center" gap={2} className="mb-3">
              <LuShield size={13} className="text-slate-400" />
              <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Droits</Text>
              {isSaving && <Text className="text-xs text-slate-400 ml-auto">Enregistrement…</Text>}
              {rightsError && <Text className="text-xs text-red-500 ml-auto">{rightsError}</Text>}
            </Flex>
            <Stack gap={2}>
              {RIGHTS_LABELS.map(({ key, label }) => (
                <Flex key={key} align="center" gap={2}>
                  <Text className="text-sm text-slate-600 shrink-0">{label}</Text>
                  <div className="flex-1 border-b border-dotted border-slate-300 mb-0.5" />
                  <Switch
                    checked={memberRights[key]}
                    disabled={isSaving}
                    onChange={(e) => handleToggleRight(key, e.target.checked)}
                  />
                </Flex>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
