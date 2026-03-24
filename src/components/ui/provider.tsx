"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "./Toast/toaster";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
