"use client";
import { Toaster as Sonner, toast, type ExternalToast } from "sonner";

export const Toaster = () => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:shadow-lg group-[.toaster]:border-slate-200",
          description: "group-[.toast]:text-slate-500",
          actionButton: "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50",
          cancelButton: "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500",
          success:
            "group-[.toaster]:!bg-green-50 group-[.toaster]:!text-green-900 group-[.toaster]:!border-green-300",
          error:
            "group-[.toaster]:!bg-red-50 group-[.toaster]:!text-red-900 group-[.toaster]:!border-red-300",
          info: "group-[.toaster]:!bg-blue-50 group-[.toaster]:!text-blue-900 group-[.toaster]:!border-blue-300",
          warning:
            "group-[.toaster]:!bg-orange-50 group-[.toaster]:!text-orange-900 group-[.toaster]:!border-orange-300",
        },
      }}
    />
  );
};

interface ToastOptions {
  type?: "success" | "error" | "loading" | "info" | "warning";
  title?: React.ReactNode;
  description?: React.ReactNode;
  duration?: number;
  closable?: boolean;
  id?: string;
}

export const toaster = {
  create: (options: ToastOptions) => {
    const type = options.type;
    const title = options.title || "";
    if (type && type !== "loading" && type in toast) {
      const fn = toast[type as keyof typeof toast] as (
        message: string | React.ReactNode,
        data?: ExternalToast
      ) => string | number;
      fn(title, {
        description: options.description,
        duration: options.duration,
        id: options.id,
      });
    } else {
      toast(title, {
        description: options.description,
        duration: options.duration,
        id: options.id,
      });
    }
  },
  success: (options: ToastOptions) =>
    toast.success(options.title, { description: options.description }),
  error: (options: ToastOptions) =>
    toast.error(options.title, { description: options.description }),
  // ...
};
