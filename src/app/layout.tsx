import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/ui";

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
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
