"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Container, Heading, Input, Stack, Text } from "@/components/ui";
import { connecterUtilisateur } from "./action";

export default function PageConnexion() {
  const router = useRouter();
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setChargement(true);

    const formData = new FormData(event.currentTarget);
    const resultat = await connecterUtilisateur(formData);

    setChargement(false);

    if (resultat.succes) {
      router.push("/");
      router.refresh();
    } else {
      setErreur(resultat.message);
    }
  }

  return (
    <div className="bg-[#fffbef] min-h-screen flex items-center justify-center py-12 px-4">
      <Container className="w-full max-w-md">
        <Stack className="gap-6">
          <div className="text-center">
            <Heading as="h1" className="text-3xl">
              Connexion
            </Heading>
            <Text className="mt-2 text-slate-600">
              Accédez à votre espace Ma Petite Compagnie
            </Text>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {erreur && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
                {erreur}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium font-serif">
                Adresse email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="votre@email.com"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="motDePasse" className="text-sm font-medium font-serif">
                Mot de passe
              </label>
              <Input
                id="motDePasse"
                name="motDePasse"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={chargement} className="w-full mt-2">
              {chargement ? "Connexion en cours…" : "Se connecter"}
            </Button>
          </form>

          <Text className="text-center text-sm text-slate-600">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-primary font-medium hover:underline">
              Créer un compte
            </Link>
          </Text>
        </Stack>
      </Container>
    </div>
  );
}
