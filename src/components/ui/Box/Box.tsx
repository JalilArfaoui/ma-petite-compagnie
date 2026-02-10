import { type ElementType, type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BoxProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  alignContent?: "start" | "end" | "center" | "between" | "around" | "stretch";
  textAlign?: "left" | "center" | "right" | "justify";
}

const alignContentMap = {
  start: "content-start",
  end: "content-end",
  center: "content-center",
  between: "content-between",
  around: "content-around",
  stretch: "content-stretch",
};

const textAlignMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

export const Box = forwardRef<HTMLElement, BoxProps>(
  ({ as: Component = "div", className, alignContent, textAlign, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          alignContent && alignContentMap[alignContent],
          textAlign && textAlignMap[textAlign],
          className
        )}
        {...props}
      />
    );
  }
);
Box.displayName = "Box";
