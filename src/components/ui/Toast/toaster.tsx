"use client";
import { Toaster as Sonner } from "sonner";
import { toast } from "sonner";

export const Toaster = () => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-slate-500",
          actionButton: "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50",
          cancelButton: "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500",
        },
      }}
    />
  );
};

export const toaster = {
  create: (options: any) => {
    const fn =
      options.type && options.type !== "loading" && toast[options.type]
        ? toast[options.type]
        : toast;
    fn(options.title, { description: options.description });
  },
  success: (options: any) => toast.success(options.title, { description: options.description }),
  error: (options: any) => toast.error(options.title, { description: options.description }),
  // ...
};
