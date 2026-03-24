"use client";

import { toaster } from "@/components/ui/Toast/toaster";

export interface UseToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  status?: "info" | "warning" | "success" | "error" | "loading";
  duration?: number;
  isClosable?: boolean;
  id?: string;
}

export const useToast = () => {
  return (options: UseToastOptions) => {
    return toaster.create({
      title: options.title,
      description: options.description,
      type: options.status,
      duration: options.duration,
      closable: options.isClosable,
      id: options.id,
    });
  };
};
