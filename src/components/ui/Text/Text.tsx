import { type ElementType, type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ as: Component = "p", className, ...props }, ref) => {
    return (
      <Component ref={ref} className={cn("font-serif text-text-primary", className)} {...props} />
    );
  }
);
Text.displayName = "Text";
