"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Button, Container, Logo, Text, Select } from "@/components/ui";
import { LuLogIn, LuLogOut, LuBuilding, LuRepeat, LuUser, LuMenu, LuX } from "react-icons/lu";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export const Header = () => {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();
  const isLoading = status === "loading";
    
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigationItems = ["Production", "Planning", "Communication", "Administration"];

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
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-cream-50 xs:max-sm:py-2 sm:max-md:py-3 md:py-4">
      <Container className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex xs:max-sm:h-12 sm:max-md:h-14 md:h-16 items-center justify-between xs:max-sm:gap-2 sm:gap-3 md:gap-4">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center xs:max-sm:gap-2 sm:gap-3 md:gap-4 hover:opacity-80 transition-opacity"
          >
            <Logo size={28} />
            <h1 className="font-black leading-[1.1] tracking-tight text-black font-serif xs:max-sm:text-[16px] sm:max-md:text-[18px] md:max-lg:text-[18px] lg:text-[22px]">
              Ma petite
              <br />
              compagnie
            </h1>
          </Link>

          {/* Navigation Section - Desktop */}
          <nav className="hidden md:flex items-center md:gap-6 lg:gap-8 xl:gap-10">
            {navigationItems.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-slate-600 hover:text-primary transition-colors font-serif md:text-[13px] lg:text-[15px] xl:text-[18px]"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* CTA & Burger Section */}
          <div className="flex items-center xs:max-sm:gap-2 sm:gap-3 md:gap-4">
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
                  <Button
                    variant="solid"
                    icon={<LuLogIn className="xs:max-sm:text-lg sm:max-md:text-base md:text-lg" />}
                    className="xs:max-sm:px-2 xs:max-sm:py-2 sm:max-md:px-3 sm:max-md:py-2 md:px-4 md:py-3 xs:max-sm:text-xs sm:max-md:text-sm md:text-base"
                    onClick={() => signIn()}
                  >
                    <span className="xs:max-sm:hidden sm:max-md:inline md:inline">Connexion</span>
                  </Button>
                )}
              </>
            )}

            {/* Burger Menu Button - Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:opacity-60 transition-opacity"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <LuX className="text-2xl" /> : <LuMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu - Sidebar */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 md:hidden z-40"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Sidebar Menu */}
          <nav className="fixed top-0 left-0 h-screen w-64 bg-cream-50 shadow-lg z-50 xs:max-sm:pt-16 sm:max-md:pt-20 overflow-y-auto md:hidden">
            <div className="flex flex-col gap-1 px-4 pb-6">
              {navigationItems.map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-slate-600 hover:text-primary hover:bg-black/5 transition-colors font-serif text-base px-4 py-3 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </nav>
        </>
      )}
    </header>
  );
};