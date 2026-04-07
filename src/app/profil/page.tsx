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
  SimpleGrid
} from "@/components/ui";
import { LuUser, LuBuilding, LuMail, LuPlus, LuCheck } from "react-icons/lu";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

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

  const handleSwitchCompany = async (companyId: number) => {
    setIsUpdating(companyId);
    await update({ activeCompanyId: companyId });
    setIsUpdating(null);
  };

  return (
    <Container className="py-12 max-w-5xl">
      <Stack gap={10}>
        {/* Header Section */}
        <Box>
          <Heading as="h3" className="font-serif mb-2">Mon Profil</Heading>
          <Text className="text-slate-500">Gérez vos informations personnelles et vos compagnies.</Text>
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
                  <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nom complet</Text>
                  <Text className="text-lg font-medium text-slate-900">
                    {user.prenom} {user.nom}
                  </Text>
                </Box>

                <Box>
                  <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Adresse Email</Text>
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
                  companies.map((company) => (
                    <Flex 
                      key={company.id} 
                      align="center" 
                      justify="between" 
                      className={`p-4 rounded-xl border transition-all ${
                        activeCompanyId === company.id 
                          ? "border-primary bg-primary/5 shadow-sm" 
                          : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                      }`}
                    >
                      <Stack gap={1}>
                        <Text className="font-bold text-slate-900">{company.nom}</Text>
                        {activeCompanyId === company.id && (
                          <Badge variant="blue" className="w-fit text-[10px]">Active</Badge>
                        )}
                      </Stack>

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
                      
                      {activeCompanyId === company.id && (
                        <div className="bg-primary text-white p-1 rounded-full">
                          <LuCheck size={14} />
                        </div>
                      )}
                    </Flex>
                  ))
                ) : (
                  <Box className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Text className="text-slate-400 italic mb-4">Vous n'avez pas encore de compagnie.</Text>
                    <Link href="/compagnie/nouveau">
                      <Button size="sm" icon={<LuPlus />}>Créer ma première compagnie</Button>
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
