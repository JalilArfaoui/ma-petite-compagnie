"use client"

import { toaster } from "@/components/ui/Toast/toaster"

// Define a compatible interface for the Toast options
export interface UseToastOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  status?: "info" | "warning" | "success" | "error" | "loading"
  duration?: number
  isClosable?: boolean
  id?: string
}

/**
 * A backward-compatible shim for the useToast hook in Chakra UI v3.
 * Consider using `toaster.create()` directly from "@/components/ui/toaster" in new code.
 */
export const useToast = () => {
  return (options: UseToastOptions) => {
    return toaster.create({
      title: options.title,
      description: options.description,
      type: options.status, 
      duration: options.duration,
      closable: options.isClosable,
      id: options.id
    })
  }
}