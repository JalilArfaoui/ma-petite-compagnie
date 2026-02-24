"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Container, Heading, Input, Stack, Text } from "@/components/ui";
import { inscrireUtilisateur } from "../connexion/action";

export default function PageInscription() {
  const router = useRouter();
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setChargement(true);

    const formData = new FormData(event.currentTarget);
    const resultat = await inscrireUtilisateur(formData);

    setChargement(false);

    if (resultat.succes) {
      setSucces(true);
      setTimeout(() => router.push("/connexion"), 2000);
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
              Créer un compte
            </Heading>
            <Text className="mt-2 text-slate-600">Rejoignez Ma Petite Compagnie</Text>
          </div>

          {succes ? (
            <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-green-700 text-sm text-center">
              Compte créé avec succès ! Redirection vers la page de connexion…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {erreur && (
                <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
                  {erreur}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label htmlFor="prenom" className="text-sm font-medium font-serif">
                  Prénom
                </label>
                <Input
                  id="prenom"
                  name="prenom"
                  type="text"
                  autoComplete="given-name"
                  required
                  placeholder="Jean"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="nom" className="text-sm font-medium font-serif">
                  Nom
                </label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  autoComplete="family-name"
                  required
                  placeholder="Dupont"
                />
              </div>

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
                  autoComplete="new-password"
                  required
                  placeholder="Minimum 8 caractères"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="confirmation" className="text-sm font-medium font-serif">
                  Confirmer le mot de passe
                </label>
                <Input
                  id="confirmation"
                  name="confirmation"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" disabled={chargement} className="w-full mt-2">
                {chargement ? "Création en cours…" : "Créer mon compte"}
              </Button>
            </form>
          )}

          <Text className="text-center text-sm text-slate-600">
            Déjà un compte ?{" "}
            <Link href="/connexion" className="text-primary font-medium hover:underline">
              Se connecter
            </Link>
          </Text>
        </Stack>
      </Container>
    </div>
  );
}
