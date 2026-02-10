import { type ElementType, type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BoxProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export const Box = forwardRef<HTMLElement, BoxProps>(
  ({ as: Component = "div", className, ...props }, ref) => {
    return <Component ref={ref} className={cn(className)} {...props} />;
  }
);
Box.displayName = "Box";
