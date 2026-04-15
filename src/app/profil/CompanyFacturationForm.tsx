"use client";

import { useState, useEffect, useTransition } from "react";
import { Button, Input, Stack, Text, Heading, Box, Card, Flex } from "@/components/ui";
import { getCompanyDetails, updateCompanyFacturationDetails } from "@/app/(auth)/company-actions";
import { toast } from "sonner";
import { LuSave, LuRefreshCw } from "react-icons/lu";

export function CompanyFacturationForm({ companyId }: { companyId: number }) {
  const [data, setData] = useState<{
    adresse: string;
    ville: string;
    codePostal: string;
    siteWeb: string;
    rib: string;
  }>({
    adresse: "",
    ville: "",
    codePostal: "",
    siteWeb: "",
    rib: "",
  });
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    setLoading(true);
    getCompanyDetails(companyId).then((comp) => {
      if (active && comp) {
        setData({
          adresse: comp.adresse || "",
          ville: comp.ville || "",
          codePostal: comp.codePostal || "",
          siteWeb: comp.siteWeb || "",
          rib: comp.rib || "",
        });
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [companyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData();
      formData.append("adresse", data.adresse);
      formData.append("ville", data.ville);
      formData.append("codePostal", data.codePostal);
      formData.append("siteWeb", data.siteWeb);
      formData.append("rib", data.rib);

      const res = await updateCompanyFacturationDetails(companyId, formData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Informations de facturation mises à jour !");
      }
    });
  };

  if (loading) {
    return (
      <Card className="p-8 border-black/5 shadow-sm bg-white">
        <Flex justify="center" align="center" className="py-4">
          <LuRefreshCw className="animate-spin text-slate-400" />
        </Flex>
      </Card>
    );
  }

  return (
    <Card className="p-8 border-black/5 shadow-sm bg-white">
      <Stack gap={6}>
        <Box>
          <Heading as="h4">Informations de Facturation (Compagnie)</Heading>
          <Text className="text-sm text-slate-500 mt-1">
            Ces informations apparaîtront sur vos factures.
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Box>
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Adresse
              </Text>
              <Input
                value={data.adresse}
                onChange={(e) => setData({ ...data, adresse: e.target.value })}
                placeholder="10 rue de la Paix"
              />
            </Box>
            <Flex gap={4}>
              <Box className="flex-1">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Code Postal
                </Text>
                <Input
                  value={data.codePostal}
                  onChange={(e) => setData({ ...data, codePostal: e.target.value })}
                  placeholder="75000"
                />
              </Box>
              <Box className="flex-2">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Ville
                </Text>
                <Input
                  value={data.ville}
                  onChange={(e) => setData({ ...data, ville: e.target.value })}
                  placeholder="Paris"
                />
              </Box>
            </Flex>
            <Box>
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Site Web
              </Text>
              <Input
                value={data.siteWeb}
                onChange={(e) => setData({ ...data, siteWeb: e.target.value })}
                placeholder="https://maliste.com"
              />
            </Box>
            <Box>
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                RIB (IBAN complet)
              </Text>
              <Input
                value={data.rib}
                onChange={(e) => setData({ ...data, rib: e.target.value })}
                placeholder="FR76 ...."
              />
            </Box>

            <Flex justify="end" className="mt-4">
              <Button type="submit" disabled={isPending} icon={<LuSave />}>
                {isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </Flex>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
}
