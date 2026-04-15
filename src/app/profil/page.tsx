"use client";

import { useSession } from "next-auth/react";
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
} from "@/components/ui";
import { LuUser, LuBuilding, LuMail, LuPlus, LuCheck, LuPencil, LuTrash2, LuX } from "react-icons/lu";
import Link from "next/link";
import { useState } from "react";
import { updateCompany, deleteCompany } from "@/app/(auth)/company-actions";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session) {
    return (
      <Container className="py-20 text-center">
        <Text>Chargement...</Text>
      </Container>
    );
  }

  const user = session.user;
  const companies = session.companies || [];
  const activeCompanyId = session.activeCompanyId;
  const rights = session.rights;

  const handleSwitchCompany = async (companyId: number) => {
    setIsUpdating(companyId);
    await update({ activeCompanyId: companyId });
    setIsUpdating(null);
  };

  const handleStartEdit = (id: number, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
    setActionError(null);
    setConfirmDeleteId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setActionError(null);
  };

  const handleSaveEdit = async (id: number) => {
    setIsSubmitting(true);
    setActionError(null);
    const formData = new FormData();
    formData.set("id", String(id));
    formData.set("nom", editName);
    const result = await updateCompany(formData);
    setIsSubmitting(false);
    if ("error" in result) {
      setActionError(result.error ?? null);
    } else {
      setEditingId(null);
      // Déclenche un refresh de session pour récupérer le nouveau nom
      await update({});
    }
  };

  const handleDelete = async (id: number) => {
    setIsSubmitting(true);
    setActionError(null);
    const formData = new FormData();
    formData.set("id", String(id));
    const result = await deleteCompany(formData);
    setIsSubmitting(false);
    if ("error" in result) {
      setActionError(result.error ?? null);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(null);
      // Reset activeCompanyId → la session auto-sélectionnera la première compagnie restante
      await update({ activeCompanyId: null });
    }
  };

  return (
    <Container className="py-12 max-w-5xl">
      <Stack gap={10}>
        {/* Header Section */}
        <Box>
          <Heading as="h3" className="font-serif mb-2">
            Mon Profil
          </Heading>
          <Text className="text-slate-500">
            Gérez vos informations personnelles et vos compagnies.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
          {/* Personal Info Card */}
          <Card className="p-8 border-black/5 shadow-sm bg-white">
            <Stack gap={6}>
              <Flex align="center" gap={4}>
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <LuUser size={24} />
                </div>
                <Heading as="h4">Informations personnelles</Heading>
              </Flex>

              <Stack gap={4}>
                <Box>
                  <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Nom complet
                  </Text>
                  <Text className="text-lg font-medium text-slate-900">
                    {user.prenom} {user.nom}
                  </Text>
                </Box>

                <Box>
                  <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Adresse Email
                  </Text>
                  <Flex align="center" gap={2}>
                    <LuMail className="text-slate-400" size={16} />
                    <Text className="text-lg font-medium text-slate-900">{user.email}</Text>
                  </Flex>
                </Box>
              </Stack>
            </Stack>
          </Card>

          {/* Companies Card */}
          <Card className="p-8 border-black/5 shadow-sm bg-white">
            <Stack gap={6}>
              <Flex align="center" justify="between">
                <Flex align="center" gap={4}>
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <LuBuilding size={24} />
                  </div>
                  <Heading as="h4">Mes Compagnies</Heading>
                </Flex>
                <Link href="/compagnie/nouveau">
                  <Button size="sm" variant="outline" icon={<LuPlus />}>
                    Nouveau
                  </Button>
                </Link>
              </Flex>

              <Stack gap={3}>
                {companies.length > 0 ? (
                  companies.map((company) => {
                    const isActive = activeCompanyId === company.id;
                    const isEditing = editingId === company.id;
                    const isConfirmingDelete = confirmDeleteId === company.id;

                    return (
                      <Box
                        key={company.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isActive
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                        }`}
                      >
                        {isEditing ? (
                          <Stack gap={2}>
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="text-sm"
                              autoFocus
                            />
                            {actionError && (
                              <Text className="text-xs text-red-500">{actionError}</Text>
                            )}
                            <Flex gap={2}>
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(company.id)}
                                disabled={isSubmitting || editName.length < 2}
                                className="flex-1"
                              >
                                {isSubmitting ? "..." : "Enregistrer"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEdit}
                                disabled={isSubmitting}
                                icon={<LuX />}
                              />
                            </Flex>
                          </Stack>
                        ) : isConfirmingDelete ? (
                          <Stack gap={2}>
                            <Text className="text-sm font-medium text-slate-700">
                              Supprimer &laquo;{company.nom}&raquo; ?
                            </Text>
                            <Text className="text-xs text-slate-500">
                              Cette action est irréversible.
                            </Text>
                            {actionError && (
                              <Text className="text-xs text-red-500">{actionError}</Text>
                            )}
                            <Flex gap={2}>
                              <Button
                                size="sm"
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => handleDelete(company.id)}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "..." : "Confirmer la suppression"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => { setConfirmDeleteId(null); setActionError(null); }}
                                disabled={isSubmitting}
                                icon={<LuX />}
                              />
                            </Flex>
                          </Stack>
                        ) : (
                          /* Normal display */
                          <Flex align="center" justify="between">
                            <Stack gap={1}>
                              <Text className="font-bold text-slate-900">{company.nom}</Text>
                              {isActive && (
                                <Badge variant="blue" className="w-fit text-[10px]">
                                  Active
                                </Badge>
                              )}
                            </Stack>

                            <Flex align="center" gap={1}>
                              {isActive && rights?.droitModificationCompagnie && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleStartEdit(company.id, company.nom)}
                                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                                  icon={<LuPencil size={14} />}
                                />
                              )}

                              {isActive && rights?.droitSuppressionCompagnie && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => { setConfirmDeleteId(company.id); setActionError(null); }}
                                  className="hover:bg-red-50 hover:text-red-600 transition-colors"
                                  icon={<LuTrash2 size={14} />}
                                />
                              )}

                              {!isActive && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleSwitchCompany(company.id)}
                                  disabled={isUpdating !== null}
                                  className="hover:bg-primary/10 hover:text-primary transition-colors font-medium text-xs"
                                >
                                  {isUpdating === company.id ? "..." : "Basculer"}
                                </Button>
                              )}

                              {isActive && !rights?.droitModificationCompagnie && !rights?.droitSuppressionCompagnie && (
                                <div className="bg-primary text-white p-1 rounded-full">
                                  <LuCheck size={14} />
                                </div>
                              )}
                            </Flex>
                          </Flex>
                        )}
                      </Box>
                    );
                  })
                ) : (
                  <Box className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Text className="text-slate-400 italic mb-4">
                      Vous n&apos;avez pas encore de compagnie.
                    </Text>
                    <Link href="/compagnie/nouveau">
                      <Button size="sm" icon={<LuPlus />}>
                        Créer ma première compagnie
                      </Button>
                    </Link>
                  </Box>
                )}
              </Stack>
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
