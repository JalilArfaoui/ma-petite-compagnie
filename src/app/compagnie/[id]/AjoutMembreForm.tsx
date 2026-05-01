"use client";

import { useState } from "react";
import { Card, Stack, Heading, Text, Button, Flex, Box, Input, Switch } from "@/components/ui";
import { LuUserPlus, LuCheck, LuShield } from "react-icons/lu";
import { addMemberByEmail } from "@/app/(auth)/company-actions";
import { RIGHTS_LABELS, EMPTY_RIGHTS, type MemberRights } from "./types";

export function AjoutMembreForm({
  compagnieId,
  canSetRights,
  onMemberAdded,
}: {
  compagnieId: number;
  canSetRights: boolean;
  onMemberAdded: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newMemberRights, setNewMemberRights] = useState<MemberRights>(EMPTY_RIGHTS);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    const fd = new FormData();
    fd.set("compagnieId", String(compagnieId));
    fd.set("email", email);
    Object.entries(newMemberRights).forEach(([k, v]) => fd.set(k, String(v)));
    const result = await addMemberByEmail(fd);
    setSubmitting(false);
    if ("error" in result) {
      setError(result.error ?? null);
    } else {
      setSuccess(`${result.nom} a été ajouté à la compagnie.`);
      setEmail("");
      setNewMemberRights(EMPTY_RIGHTS);
      onMemberAdded();
    }
  };

  return (
    <Card className="p-6 border-black/5 shadow-sm bg-white">
      <Stack gap={4}>
        <Flex align="center" gap={3}>
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <LuUserPlus size={18} />
          </div>
          <Heading as="h4">Ajouter un membre</Heading>
        </Flex>

        <Flex gap={2}>
          <Input
            type="email"
            placeholder="adresse@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
              setSuccess(null);
            }}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && email && handleSubmit()}
          />
          <Button onClick={handleSubmit} disabled={submitting || !email}>
            {submitting ? "..." : "Ajouter"}
          </Button>
        </Flex>

        {canSetRights && (
          <Box className="border-t border-slate-100 pt-4">
            <Flex align="center" gap={2} className="mb-3">
              <LuShield size={13} className="text-slate-400" />
              <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Droits accordés
              </Text>
            </Flex>
            <Stack gap={2}>
              {RIGHTS_LABELS.map(({ key, label }) => (
                <Flex key={key} align="center" gap={2}>
                  <Text className="text-sm text-slate-600 shrink-0">{label}</Text>
                  <div className="flex-1 border-b border-dotted border-slate-300 mb-0.5" />
                  <Switch
                    checked={newMemberRights[key]}
                    onChange={(e) =>
                      setNewMemberRights((prev) => ({ ...prev, [key]: e.target.checked }))
                    }
                  />
                </Flex>
              ))}
            </Stack>
          </Box>
        )}

        {error && <Text className="text-sm text-red-500">{error}</Text>}
        {success && (
          <Flex align="center" gap={2} className="text-green-600">
            <LuCheck size={14} />
            <Text className="text-sm">{success}</Text>
          </Flex>
        )}
      </Stack>
    </Card>
  );
}
