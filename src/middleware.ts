export { auth as middleware } from "@/lib/auth";

// Routes publiques : /connexion, /inscription, la page d'accueil (/), les assets Next.js et l'API auth
export const config = {
  matcher: [
    "/((?!api/auth|connexion|inscription|_next/static|_next/image|favicon.ico|$).*)",
  ],
};
