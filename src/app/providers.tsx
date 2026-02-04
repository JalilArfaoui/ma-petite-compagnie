"use client";

import { Provider } from "@/components/ui/provider";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/Toast/toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider>
      {children}
      <Toaster />
    </Provider>
  );
}
