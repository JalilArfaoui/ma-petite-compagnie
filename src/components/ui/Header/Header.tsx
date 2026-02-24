import Link from "next/link";
import { Button, Container, Logo } from "@/components/ui";
import { LuLogIn, LuLogOut, LuUser } from "react-icons/lu";
import { auth, signOut } from "@/lib/auth";

export const Header = async () => {
  const session = await auth();

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
            {session?.user ? (
              <>
                <span className="hidden md:flex items-center gap-2 text-sm font-serif text-slate-600">
                  <LuUser size={16} />
                  {session.user.name}
                </span>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <Button type="submit" variant="outline" icon={<LuLogOut />}>
                    Déconnexion
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/connexion">
                <Button variant="solid" icon={<LuLogIn />}>
                  Connexion
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};
