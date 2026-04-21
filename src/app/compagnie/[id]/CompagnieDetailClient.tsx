"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Card,
  Stack,
  Heading,
  Text,
  Button,
  Badge,
  Flex,
  Box,
  SimpleGrid,
  Input,
  Switch,
} from "@/components/ui";
import {
  LuPencil,
  LuTrash2,
  LuX,
  LuCheck,
  LuUserPlus,
  LuUserMinus,
  LuArrowLeft,
  LuShield,
} from "react-icons/lu";
import { FaTheaterMasks } from "react-icons/fa";
import Link from "next/link";
import {
  updateCompany,
  deleteCompany,
  addMemberByEmail,
  removeMember,
  updateMemberRights,
} from "@/app/(auth)/company-actions";

type MemberUser = { id: number; nom: string | null; prenom: string | null; email: string };
type MemberRights = {
  droitAccesDetailsCompagnie: boolean;
  droitModificationCompagnie: boolean;
  droitSuppressionCompagnie: boolean;
  droitAjoutMembre: boolean;
  droitSuppressionMembre: boolean;
  droitGestionDroitsMembres: boolean;
  droitAccesPlanning: boolean;
  droitGestionPlanning: boolean;
};
type Member = MemberRights & { id: number; userId: number; compagnieId: number; user: MemberUser };
type CompagnieData = { id: number; nom: string; membres: Member[] };

const RIGHTS_LABELS: { key: keyof MemberRights; label: string }[] = [
  { key: "droitAccesDetailsCompagnie", label: "Accès aux détails de la compagnie" },
  { key: "droitAccesPlanning", label: "Accès au planning" },
  { key: "droitGestionPlanning", label: "Gérer le planning" },
  { key: "droitAjoutMembre", label: "Ajouter des membres" },
  { key: "droitSuppressionMembre", label: "Retirer des membres" },
  { key: "droitGestionDroitsMembres", label: "Gérer les droits" },
  { key: "droitModificationCompagnie", label: "Modifier la compagnie" },
  { key: "droitSuppressionCompagnie", label: "Supprimer la compagnie" },
];

function getInitials(user: MemberUser) {
  return (
    `${user.prenom?.[0] ?? ""}${user.nom?.[0] ?? ""}`.toUpperCase() || user.email[0].toUpperCase()
  );
}

function getDisplayName(user: MemberUser) {
  const name = `${user.prenom ?? ""} ${user.nom ?? ""}`.trim();
  return name || user.email;
}

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

  // --- Name edit ---
  const [companyName, setCompanyName] = useState(compagnie.nom);
  const [editingName, setEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSubmitting, setNameSubmitting] = useState(false);

  // --- Delete ---
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // --- Add member ---
  const [addEmail, setAddEmail] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [newMemberRights, setNewMemberRights] = useState<MemberRights>({
    droitAccesDetailsCompagnie: false,
    droitModificationCompagnie: false,
    droitSuppressionCompagnie: false,
    droitAjoutMembre: false,
    droitSuppressionMembre: false,
    droitGestionDroitsMembres: false,
    droitAccesPlanning: false,
    droitGestionPlanning: false,
  });

  // --- Remove member ---
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [removeErrors, setRemoveErrors] = useState<Record<number, string>>({});

  // --- Member rights (optimistic overrides only — falls back to props) ---
  const [localRights, setLocalRights] = useState<Record<number, MemberRights>>({});
  const [savingRights, setSavingRights] = useState<Set<number>>(new Set());
  const [rightsErrors, setRightsErrors] = useState<Record<number, string>>({});

  const getMemberRights = (member: Member): MemberRights =>
    localRights[member.id] ?? {
      droitAccesDetailsCompagnie: member.droitAccesDetailsCompagnie,
      droitModificationCompagnie: member.droitModificationCompagnie,
      droitSuppressionCompagnie: member.droitSuppressionCompagnie,
      droitAjoutMembre: member.droitAjoutMembre,
      droitSuppressionMembre: member.droitSuppressionMembre,
      droitGestionDroitsMembres: member.droitGestionDroitsMembres,
      droitAccesPlanning: member.droitAccesPlanning,
      droitGestionPlanning: member.droitGestionPlanning,
    };

  const handleSaveName = async () => {
    setNameSubmitting(true);
    setNameError(null);
    const fd = new FormData();
    fd.set("id", String(compagnie.id));
    fd.set("nom", editNameValue);
    const result = await updateCompany(fd);
    setNameSubmitting(false);
    if ("error" in result) {
      setNameError(result.error ?? null);
    } else {
      setCompanyName(editNameValue);
      setEditingName(false);
    }
  };

  const handleDelete = async () => {
    setDeleteSubmitting(true);
    setDeleteError(null);
    const fd = new FormData();
    fd.set("id", String(compagnie.id));
    const result = await deleteCompany(fd);
    setDeleteSubmitting(false);
    if ("error" in result) {
      setDeleteError(result.error ?? null);
    } else {
      router.push("/profil");
    }
  };

  const handleAddMember = async () => {
    setAddSubmitting(true);
    setAddError(null);
    setAddSuccess(null);
    const fd = new FormData();
    fd.set("compagnieId", String(compagnie.id));
    fd.set("email", addEmail);
    Object.entries(newMemberRights).forEach(([k, v]) => fd.set(k, String(v)));
    const result = await addMemberByEmail(fd);
    setAddSubmitting(false);
    if ("error" in result) {
      setAddError(result.error ?? null);
    } else {
      setAddSuccess(`${result.nom} a été ajouté à la compagnie.`);
      setAddEmail("");
      setNewMemberRights({
        droitAccesDetailsCompagnie: false,
        droitModificationCompagnie: false,
        droitSuppressionCompagnie: false,
        droitAjoutMembre: false,
        droitSuppressionMembre: false,
        droitGestionDroitsMembres: false,
        droitAccesPlanning: false,
        droitGestionPlanning: false,
      });
      router.refresh();
    }
  };

  const handleRemoveMember = async (member: Member) => {
    setRemovingId(member.id);
    setRemoveErrors((prev) => {
      const n = { ...prev };
      delete n[member.id];
      return n;
    });
    const fd = new FormData();
    fd.set("compagnieId", String(compagnie.id));
    fd.set("memberId", String(member.id));
    const result = await removeMember(fd);
    setRemovingId(null);
    if ("error" in result) {
      setRemoveErrors((prev) => ({ ...prev, [member.id]: result.error ?? "Erreur" }));
    } else {
      router.refresh();
    }
  };

  const handleToggleRight = async (
    member: Member,
    rightKey: keyof MemberRights,
    value: boolean
  ) => {
    const previousRights = getMemberRights(member);
    const newRights = { ...previousRights, [rightKey]: value };
    setLocalRights((prev) => ({ ...prev, [member.id]: newRights }));
    setSavingRights((prev) => new Set(prev).add(member.id));
    setRightsErrors((prev) => { const n = { ...prev }; delete n[member.id]; return n; });

    const fd = new FormData();
    fd.set("compagnieId", String(compagnie.id));
    fd.set("memberId", String(member.id));
    Object.entries(newRights).forEach(([k, v]) => fd.set(k, String(v)));
    const result = await updateMemberRights(fd);

    setSavingRights((prev) => { const n = new Set(prev); n.delete(member.id); return n; });
    if ("error" in result) {
      setLocalRights((prev) => ({ ...prev, [member.id]: previousRights }));
      setRightsErrors((prev) => ({ ...prev, [member.id]: result.error ?? "Erreur" }));
    }
  };

  return (
    <Container className="py-12 max-w-4xl">
      <Stack gap={8}>
        {/* Back link */}
        <Link
          href="/profil"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors w-fit"
        >
          <LuArrowLeft size={14} /> Retour au profil
        </Link>

        {/* Header card */}
        <Card className="p-8 border-black/5 shadow-sm bg-white">
          <Flex align="start" justify="between" gap={4}>
            <Flex align="center" gap={4} className="flex-1 min-w-0">
              <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                <FaTheaterMasks size={24} />
              </div>
              {editingName ? (
                <Stack gap={2} className="flex-1">
                  <Input
                    value={editNameValue}
                    onChange={(e) => setEditNameValue(e.target.value)}
                    className="text-lg font-semibold"
                    autoFocus
                  />
                  {nameError && <Text className="text-xs text-red-500">{nameError}</Text>}
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      onClick={handleSaveName}
                      disabled={nameSubmitting || editNameValue.length < 2}
                    >
                      {nameSubmitting ? "..." : "Enregistrer"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingName(false);
                        setNameError(null);
                      }}
                      icon={<LuX />}
                    />
                  </Flex>
                </Stack>
              ) : (
                <Heading as="h3" className="font-serif truncate">
                  {companyName}
                </Heading>
              )}
            </Flex>

            {!editingName && (
              <Flex gap={2} className="shrink-0">
                {rights.droitModificationCompagnie && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingName(true);
                      setEditNameValue(companyName);
                    }}
                    className="hover:bg-primary/10 hover:text-primary"
                    icon={<LuPencil size={14} />}
                  />
                )}
                {rights.droitSuppressionCompagnie && !confirmDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmDelete(true)}
                    className="hover:bg-red-50 hover:text-red-600"
                    icon={<LuTrash2 size={14} />}
                  />
                )}
              </Flex>
            )}
          </Flex>

          {confirmDelete && (
            <Box className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100">
              <Stack gap={3}>
                <Text className="text-sm font-medium text-red-800">
                  Supprimer &laquo;{companyName}&raquo; ? Cette action est irréversible.
                </Text>
                {deleteError && <Text className="text-xs text-red-600">{deleteError}</Text>}
                <Flex gap={2}>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDelete}
                    disabled={deleteSubmitting}
                  >
                    {deleteSubmitting ? "..." : "Confirmer la suppression"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setConfirmDelete(false);
                      setDeleteError(null);
                    }}
                    icon={<LuX />}
                  />
                </Flex>
              </Stack>
            </Box>
          )}
        </Card>

        {/* Add member */}
        {rights.droitAjoutMembre && (
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
                  value={addEmail}
                  onChange={(e) => {
                    setAddEmail(e.target.value);
                    setAddError(null);
                    setAddSuccess(null);
                  }}
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && addEmail && handleAddMember()}
                />
                <Button onClick={handleAddMember} disabled={addSubmitting || !addEmail}>
                  {addSubmitting ? "..." : "Ajouter"}
                </Button>
              </Flex>

              {rights.droitGestionDroitsMembres && (
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

              {addError && <Text className="text-sm text-red-500">{addError}</Text>}
              {addSuccess && (
                <Flex align="center" gap={2} className="text-green-600">
                  <LuCheck size={14} />
                  <Text className="text-sm">{addSuccess}</Text>
                </Flex>
              )}
            </Stack>
          </Card>
        )}

        {/* Members list */}
        <Stack gap={4}>
          <Flex align="center" gap={3}>
            <Heading as="h3" className="font-serif">
              Membres
            </Heading>
            <Badge variant="blue">{compagnie.membres.length}</Badge>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {compagnie.membres.map((member) => {
              const memberRights = getMemberRights(member);
              const isSelf = member.userId === currentUserId;
              const isSaving = savingRights.has(member.id);
              const rightsError = rightsErrors[member.id];
              const isRemoving = removingId === member.id;
              const removeError = removeErrors[member.id];

              return (
                <Card key={member.id} className="p-5 border-black/5 shadow-sm bg-white">
                  <Stack gap={4}>
                    {/* Member header */}
                    <Flex align="center" justify="between" gap={3}>
                      <Flex align="center" gap={3} className="min-w-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                          {getInitials(member.user)}
                        </div>
                        <Box className="min-w-0">
                          <Flex align="center" gap={2}>
                            <Text className="font-semibold text-slate-900 truncate">
                              {getDisplayName(member.user)}
                            </Text>
                            {isSelf && (
                              <Badge variant="blue" className="text-[10px] shrink-0">
                                Vous
                              </Badge>
                            )}
                          </Flex>
                          <Text className="text-xs text-slate-400 truncate">
                            {member.user.email}
                          </Text>
                        </Box>
                      </Flex>

                      {rights.droitSuppressionMembre && !isSelf && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveMember(member)}
                          disabled={isRemoving}
                          className="hover:bg-red-50 hover:text-red-600 shrink-0"
                          icon={<LuUserMinus size={14} />}
                        />
                      )}
                    </Flex>

                    {removeError && <Text className="text-xs text-red-500">{removeError}</Text>}

                    {/* Rights */}
                    {rights.droitGestionDroitsMembres && (
                      <Box className="border-t border-slate-100 pt-4">
                        <Flex align="center" gap={2} className="mb-3">
                          <LuShield size={13} className="text-slate-400" />
                          <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Droits
                          </Text>
                          {isSaving && (
                            <Text className="text-xs text-slate-400 ml-auto">Enregistrement…</Text>
                          )}
                          {rightsError && (
                            <Text className="text-xs text-red-500 ml-auto">{rightsError}</Text>
                          )}
                        </Flex>
                        <Stack gap={2}>
                          {RIGHTS_LABELS.map(({ key, label }) => (
                            <Flex key={key} align="center" gap={2}>
                              <Text className="text-sm text-slate-600 shrink-0">{label}</Text>
                              <div className="flex-1 border-b border-dotted border-slate-300 mb-0.5" />
                              <Switch
                                checked={memberRights[key]}
                                disabled={isSaving}
                                onChange={(e) => handleToggleRight(member, key, e.target.checked)}
                              />
                            </Flex>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Stack>
    </Container>
  );
}
