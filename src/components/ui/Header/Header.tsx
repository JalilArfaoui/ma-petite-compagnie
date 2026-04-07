"use client";

import Link from "next/link";
import { Badge, Button, Container, Logo, Text, Select } from "@/components/ui";
import { LuLogIn, LuLogOut, LuBuilding, LuRepeat, LuUser } from "react-icons/lu";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export const Header = () => {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();
  const isLoading = status === "loading";

  // Cache le header sur les pages d'auth
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  // Retrouver le nom de la compagnie active
  const companies = session?.companies || [];
  const activeCompany = companies.find((c) => c.id === session?.activeCompanyId);
  const hasMultipleCompanies = companies.length > 1;
  const hasNoCompany = companies.length === 0;

  const handleCompanyChange = async (value: string) => {
    await update({ activeCompanyId: parseInt(value) });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-cream-50 py-4">
      <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <Logo size={28} />
            <h1 className="text-[22px] font-black leading-[1.1] tracking-tight text-black font-serif">
              Ma petite
              <br />
              compagnie
            </h1>
          </Link>

          {/* Navigation Section */}
          <nav className="hidden md:flex items-center gap-10">
            {["Production", "Planning", "Communication", "Administration"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-[18px] text-slate-600 hover:text-primary transition-colors font-serif"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* CTA Section */}
          <div className="flex items-center gap-4">
            {!isLoading && (
              <>
                {session ? (
                  <>
                    {hasMultipleCompanies ? (
                      <div className="flex items-center gap-2">
                        <Select
                          value={session?.activeCompanyId?.toString()}
                          onValueChange={handleCompanyChange}
                        >
                          <Select.Trigger className="w-[200px]">
                            <Select.Value placeholder="Choisir une compagnie" />
                          </Select.Trigger>
                          <Select.Content>
                            {companies.map((company) => (
                              <Select.Item key={company.id} value={company.id.toString()}>
                                {company.nom}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </div>
                    ) : hasNoCompany ? (
                      <Link href="/compagnie/nouveau">
                        <Button
                          variant="solid"
                          size="sm"
                          icon={<LuBuilding />}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Créer une compagnie
                        </Button>
                      </Link>
                    ) : (
                      <Badge variant="red" className="px-4 py-1.5 font-bold text-sm rounded-full">
                        {activeCompany?.nom || "Inconnue"}
                      </Badge>
                    )}

                    <Link href="/profil">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<LuUser />}
                        className="border-slate-200 hover:bg-slate-50"
                      >
                        <span className="hidden sm:inline">Profil</span>
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => signOut({ redirectTo: "/" })}
                      icon={<LuLogOut />}
                    >
                      <span className="hidden sm:inline">Déconnexion</span>
                    </Button>
                  </>
                ) : (
                  <Button variant="solid" icon={<LuLogIn />} onClick={() => signIn()}>
                    Connexion
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};
