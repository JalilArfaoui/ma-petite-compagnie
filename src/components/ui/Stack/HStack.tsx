import { forwardRef } from "react";
import { Stack, type StackProps } from "../Stack/Stack";
import { cn } from "@/lib/utils";

export const HStack = forwardRef<HTMLElement, StackProps>(({ className, ...props }, ref) => {
  return <Stack ref={ref} className={cn("flex-row", className)} {...props} />;
});
HStack.displayName = "HStack";
