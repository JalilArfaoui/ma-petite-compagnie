import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxW?: string;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxW, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("container mx-auto px-4", className)}
        style={{ maxWidth: maxW, ...style }}
        {...props}
      />
    );
  }
);
Container.displayName = "Container";

export { Container };
