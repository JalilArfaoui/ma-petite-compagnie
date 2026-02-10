import { type ElementType, type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface StackProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export const Stack = forwardRef<HTMLElement, StackProps>(
  ({ as: Component = "div", className, ...props }, ref) => {
    return <Component ref={ref} className={cn("flex flex-col gap-2", className)} {...props} />;
  }
);
Stack.displayName = "Stack";
