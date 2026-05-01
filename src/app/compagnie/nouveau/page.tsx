"use client";

import { useState } from "react";
import { Button, Input, Text, Stack, Heading, Container, Card } from "@/components/ui";
import { createCompany } from "@/app/(auth)/company-actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";
import { FaTheaterMasks } from "react-icons/fa";
import Link from "next/link";

export default function CreateCompanyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { update } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createCompany(formData);

    if (res.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      // Pass a signal to the JWT callback to force a company re-fetch.
      // Without data, some NextAuth versions may not properly trigger "update".
      await update({ refreshCompanies: true });
      window.location.href = "/";
    }
  };

  return (
    <Container className="max-w-xl py-12">
      <Link
        href="/"
        className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors group"
      >
        <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span>Retour à l&apos;accueil</span>
      </Link>

      <Card className="p-8 shadow-xl border-black/5 bg-white">
        <Stack gap={6}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <FaTheaterMasks size={24} />
            </div>
            <div>
              <Heading as="h3" className="font-serif">
                Nouvelle compagnie
              </Heading>
              <Text className="text-slate-500">Donnez un nom à votre nouvelle structure.</Text>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span className="font-bold">!</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Stack>
              <label htmlFor="nom" className="text-sm font-semibold text-slate-900 ml-1">
                Nom de la compagnie
              </label>
              <Input id="nom" name="nom" required autoFocus className="h-12 text-lg" />
            </Stack>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Annuler
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    <span>Création...</span>
                  </div>
                ) : (
                  "Créer la compagnie"
                )}
              </Button>
            </div>
          </form>
        </Stack>
      </Card>
    </Container>
  );
}
