"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ReactNode } from "react"
import { Toaster } from "@/components/ui/Toast/toaster"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      {children}
      <Toaster />
    </ChakraProvider>
  )
}
