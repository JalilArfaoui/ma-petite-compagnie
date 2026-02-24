export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/((?!api/auth|connexion|inscription|_next/static|_next/image|favicon.ico|$).*)",
  ],
};
