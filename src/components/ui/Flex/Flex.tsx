import { type ElementType, type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FlexProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  gap?: number | string;
}

export const Flex = forwardRef<HTMLElement, FlexProps>(
  ({ as: Component = "div", className, direction, justify, align, wrap, gap, ...props }, ref) => {
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

    const directionMap = {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    };

    const wrapMap = {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
      "wrap-reverse": "flex-wrap-reverse",
    };

    return (
      <Component
        ref={ref}
        className={cn(
          "flex",
          direction && directionMap[direction],
          justify && justifyMap[justify],
          align && alignMap[align],
          wrap && wrapMap[wrap],
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
Flex.displayName = "Flex";
