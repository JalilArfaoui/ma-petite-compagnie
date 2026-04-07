"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Container, Heading, Input, Text, Stack } from "@/components/ui";
import Link from "next/link";
import { registerUser } from "../actions";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await registerUser(formData);

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else if (res?.success) {
        // En cas de succès, on redirige vers le login
        router.push("/login?registered=true");
      }
    } catch {
      setError("Une erreur inattendue est survenue.");
      setIsLoading(false);
    }
  };

  return (
    <Container className="max-w-md mx-auto mt-20 mb-20">
      <Card className="p-8 shadow-sm border border-black/5 bg-white">
        <Stack>
          <div className="text-center mb-6">
            <Heading className="font-serif text-[28px] font-black tracking-tight text-black mb-2">
              Créer un compte
            </Heading>
            <Text className="text-slate-500">Rejoignez Ma petite compagnie</Text>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100 mb-4 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Text className="mb-2 font-medium inline-block">Prénom</Text>
                <Input name="prenom" type="text" required placeholder="Jean" className="w-full" />
              </div>
              <div className="flex-1">
                <Text className="mb-2 font-medium inline-block">Nom</Text>
                <Input name="nom" type="text" required placeholder="Dupont" className="w-full" />
              </div>
            </div>

            <div>
              <Text className="mb-2 font-medium inline-block">Email</Text>
              <Input
                name="email"
                type="email"
                required
                placeholder="votre@email.com"
                className="w-full"
              />
            </div>

            <div>
              <Text className="mb-2 font-medium inline-block">Mot de passe</Text>
              <Input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full"
              />
            </div>

            <Button type="submit" variant="solid" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? "Création..." : "S'inscrire"}
            </Button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <Text className="text-slate-500">
              Déjà un compte ?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors"
              >
                Se connecter
              </Link>
            </Text>
          </div>
        </Stack>
      </Card>
    </Container>
  );
}
