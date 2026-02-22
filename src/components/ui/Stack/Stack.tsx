import * as React from "react";
import { cn } from "@/lib/utils";

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  gap?: number | string;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "start" | "end" | "center" | "baseline" | "stretch";
}

const justifyMap = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const alignMap = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  baseline: "items-baseline",
  stretch: "items-stretch",
};

export const Stack = React.forwardRef<HTMLElement, StackProps>(
  ({ as: Component = "div", className, gap, direction, justify, align, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "flex",
          direction === "row" || direction === "row-reverse" ? direction : "flex-col",
          justify && justifyMap[justify],
          align && alignMap[align],
          className
        )}
        style={{
          gap: typeof gap === "number" ? `${gap * 0.25}rem` : gap,
          ...props.style,
        }}
        {...props}
      />
    );
  }
);
Stack.displayName = "Stack";
