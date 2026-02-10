import * as React from "react";
import { cn } from "@/lib/utils";

interface SimpleGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | { [key: string]: number };
  gap?: number | string;
  minChildWidth?: string;
}

const SimpleGrid = React.forwardRef<HTMLDivElement, SimpleGridProps>(
  ({ className, columns, gap, minChildWidth, style, ...props }, ref) => {
    const gridTemplateColumns =
      typeof columns === "number" ? `repeat(${columns}, minmax(0, 1fr))` : undefined;
    const template = minChildWidth
      ? `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`
      : gridTemplateColumns;

    return (
      <div
        ref={ref}
        className={cn("grid", className)}
        style={{
          gridTemplateColumns: template,
          gap: typeof gap === "number" ? `${gap * 0.25}rem` : gap,
          ...style,
        }}
        {...props}
      />
    );
  }
);
SimpleGrid.displayName = "SimpleGrid";

export { SimpleGrid };
