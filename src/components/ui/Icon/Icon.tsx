import { cn } from "@/lib/utils";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const iconVariants = cva("inline-flex items-center justify-center text-icon", {
  variants: {
    size: {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
      xl: "w-10 h-10",
      default: "w-4 h-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface IconProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof iconVariants> {
  as?: React.ElementType;
}

export const Icon = React.forwardRef<HTMLElement, IconProps>(
  ({ as: Component = "span", className, size, children, ...props }, ref) => {
    // If children are provided, we wrap them in a span (or 'as' component) that applies the size classes
    // This assumes the children (e.g. react-icons) will inherit size or fill container.
    // React-icons usually accept size prop via Context or direct prop, but here we control wrapper size.
    // To make SVG inside fill the wrapper, we might need specific CSS on the SVG.
    // Usually standard icon libraries use '1em' width/height, so font-size on wrapper works, or explicit w/h.
    // We are setting w/h on the wrapper. We might need [&>svg]:w-full [&>svg]:h-full.

    return (
      <Component
        ref={ref}
        className={cn(iconVariants({ size }), "[&>svg]:w-full [&>svg]:h-full", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Icon.displayName = "Icon";
