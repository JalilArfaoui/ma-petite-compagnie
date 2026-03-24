import { forwardRef } from "react";
import { Stack, type StackProps } from "../Stack/Stack";
import { cn } from "@/lib/utils";

export const VStack = forwardRef<HTMLElement, StackProps>(({ className, ...props }, ref) => {
  return <Stack ref={ref} className={cn("flex-col", className)} {...props} />;
});
VStack.displayName = "VStack";
