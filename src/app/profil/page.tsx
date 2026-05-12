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
  Modal,
} from "@/components/ui";
import { LuUser, LuMail, LuPlus, LuCheck, LuPencil } from "react-icons/lu";
import { FaTheaterMasks } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CompanyFacturationForm } from "./CompanyFacturationForm";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);

  if (status === "loading") {
    return (
      <Container className="py-20 text-center">
        <Text>Chargement...</Text>
      </Container>
    );
  }

  if (status === "unauthenticated" || !session) {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return null;
  }

  const user = session.user;
  const companies = session.companies || [];
  const activeCompanyId = session.activeCompanyId;

  const handleSwitchCompany = async (companyId: number) => {
    setIsUpdating(companyId);
    await update({ activeCompanyId: companyId });
    setIsUpdating(null);
  };

  return (
    <Container className="py-12 max-w-5xl">
      <Stack gap={10}>
        <Box>
          <Heading as="h3" className="font-serif mb-2">
            Mon Profil
          </Heading>
          <Text className="text-slate-500">
            Gérez vos informations personnelles et vos compagnies.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
          {/* Personal Info */}
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

          {/* Companies */}
          <Card className="p-8 border-black/5 shadow-sm bg-white">
            <Stack gap={6}>
              <Flex align="center" justify="between">
                <Flex align="center" gap={4}>
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <FaTheaterMasks size={24} />
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

                    return (
                      <Box
                        key={company.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isActive
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                        }`}
                      >
                        <Flex align="center" justify="between">
                          <Stack gap={1}>
                            <Text className="font-bold text-slate-900">{company.nom}</Text>
                            {isActive && (
                              <Badge variant="blue" className="w-fit text-[10px]">
                                Active
                              </Badge>
                            )}
                          </Stack>

                          <Flex gap={2} align="center">
                            {activeCompanyId !== company.id && (
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

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingCompanyId(company.id)}
                              className="hover:bg-slate-100 text-slate-500 transition-colors"
                              title="Modifier les informations"
                            >
                              <LuPencil size={16} />
                            </Button>

                            {activeCompanyId === company.id && (
                              <div className="bg-primary text-white p-1 rounded-full ml-2">
                                <LuCheck size={14} />
                              </div>
                            )}
                          </Flex>
                        </Flex>
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

        <Modal
          open={editingCompanyId !== null}
          onOpenChange={(open) => !open && setEditingCompanyId(null)}
        >
          <Modal.Content size="lg">
            <Modal.Header>
              <Modal.Title>Paramètres de la compagnie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {editingCompanyId && (
                <CompanyFacturationForm
                  companyId={editingCompanyId}
                  onSuccess={() => setEditingCompanyId(null)}
                />
              )}
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Stack>
    </Container>
  );
}
