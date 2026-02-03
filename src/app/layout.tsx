import { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/ui";
import StyledComponentsRegistry from "@/lib/registry";

export const metadata: Metadata = {
  title: "Ma Petite Compagnie",
  description: "Application de gestion pour compagnie de théâtre",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <StyledComponentsRegistry>
            <Header />
            <main>{children}</main>
          </StyledComponentsRegistry>
        </Providers>
      </body>
    </html>
  );
}
