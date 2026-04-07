"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Card, Container, Heading, Input, Text, Stack } from "@/components/ui";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email ou mot de passe incorrect");
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Une erreur est survenue");
      setIsLoading(false);
    }
  };

  return (
    <Container className="max-w-md mx-auto mt-20 mb-20">
      <Card className="p-8 shadow-sm border border-black/5 bg-white">
        <Stack>
          <div className="text-center mb-6">
            <Heading className="font-serif text-[28px] font-black tracking-tight text-black mb-2">
              Connexion
            </Heading>
            <Text className="text-slate-500">Connectez-vous à votre espace membre</Text>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100 mb-4 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                className="w-full"
              />
            </div>

            <Button type="submit" variant="solid" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <Text className="text-slate-500">
              Pas encore de compte ?{" "}
              <Link
                href="/register"
                className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors"
              >
                Créer un compte
              </Link>
            </Text>
          </div>
        </Stack>
      </Card>
    </Container>
  );
}
