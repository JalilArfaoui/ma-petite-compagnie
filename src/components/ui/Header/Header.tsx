"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Button, Container, Logo, Select } from "@/components/ui";
import { LuLogIn, LuLogOut, LuUser, LuMenu, LuX } from "react-icons/lu";
import { FaTheaterMasks } from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export const Header = () => {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();
  const isLoading = status === "loading";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const canAccessAdministration = Boolean(session?.rights?.droitAccesAdministration);
  const navigationItems = [
    { label: "Production", href: "/production" },
    { label: "Planning", href: "/planning" },
    { label: "Communication", href: "/communication" },
    ...(canAccessAdministration
      ? [{ label: "Administration", href: "/administration" }]
      : session
        ? [{ label: "Cachets", href: "/administration/vision-cachets" }]
        : []),
  ];

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
    if (pathname.startsWith("/administration")) {
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-cream-50">
      <Container className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 md:h-16 items-center justify-between gap-3">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity shrink-0"
          >
            <Logo size={28} />
            <h1 className="font-black leading-[1.1] tracking-tight text-black font-serif text-[16px] sm:text-[18px] lg:text-[22px]">
              Ma petite
              <br />
              compagnie
            </h1>
          </Link>

          {/* Navigation Section - Desktop uniquement */}
          <nav className="hidden md:flex items-center md:gap-6 lg:gap-8 xl:gap-10">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-600 hover:text-primary transition-colors font-serif md:text-[13px] lg:text-[15px] xl:text-[18px]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Section - Desktop uniquement */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {!isLoading && (
              <>
                {session ? (
                  <>
                    {hasMultipleCompanies ? (
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
                    ) : hasNoCompany ? (
                      <Link href="/compagnie/nouveau">
                        <Button
                          variant="solid"
                          size="sm"
                          icon={<FaTheaterMasks />}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Créer une compagnie
                        </Button>
                      </Link>
                    ) : (
                      <Badge
                        variant="red"
                        className="px-4 py-1.5 font-bold text-sm rounded-full max-w-[180px] truncate"
                      >
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
                        Profil
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => signOut({ redirectTo: "/" })}
                      icon={<LuLogOut />}
                    >
                      Déconnexion
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

          {/* Mobile : connexion (si déconnecté) + burger */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            {!isLoading && !session && (
              <Button variant="solid" size="sm" icon={<LuLogIn />} onClick={() => signIn()}>
                Connexion
              </Button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:opacity-60 transition-opacity"
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
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsMenuOpen(false)} />

          <nav className="fixed top-0 left-0 h-screen w-72 bg-cream-50 shadow-lg z-50 overflow-y-auto">
            {/* Logo sidebar */}
            <div className="flex items-center gap-3 px-8 h-14 border-b border-black/10 shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                onClick={() => setIsMenuOpen(false)}
              >
                <Logo size={24} />
                <span className="font-black leading-[1.1] tracking-tight text-black font-serif text-[15px]">
                  Ma petite
                  <br />
                  compagnie
                </span>
              </Link>
            </div>

            <div className="flex flex-col gap-1 px-4 pb-6 pt-2">
              {/* Compagnie */}
              {session && (
                <div className="px-4 py-3 mb-2 border-b border-black/10">
                  {hasMultipleCompanies ? (
                    <Select
                      value={session?.activeCompanyId?.toString()}
                      onValueChange={(v) => {
                        handleCompanyChange(v);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Select.Trigger className="w-full">
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
                  ) : hasNoCompany ? (
                    <Link href="/compagnie/nouveau" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="solid"
                        size="sm"
                        icon={<FaTheaterMasks />}
                        className="bg-primary hover:bg-primary/90 w-full"
                      >
                        Créer une compagnie
                      </Button>
                    </Link>
                  ) : (
                    <Badge
                      variant="red"
                      className="px-4 py-1.5 font-bold text-sm rounded-full max-w-full truncate"
                    >
                      {activeCompany?.nom || "Inconnue"}
                    </Badge>
                  )}
                </div>
              )}

              {/* Navigation */}
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-600 hover:text-primary hover:bg-black/5 transition-colors font-serif text-base px-4 py-3 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Actions auth */}
              {session && (
                <div className="mt-4 pt-4 border-t border-black/10 flex flex-col gap-2">
                  <Link href="/profil" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<LuUser />}
                      className="border-slate-200 hover:bg-slate-50 w-full"
                    >
                      Profil
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signOut({ redirectTo: "/" });
                      setIsMenuOpen(false);
                    }}
                    icon={<LuLogOut />}
                    className="w-full"
                  >
                    Déconnexion
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
};
