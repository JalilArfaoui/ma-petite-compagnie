import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("font-serif font-bold m-0 leading-[0.9]", {
  variants: {
    as: {
      h1: "text-black text-[110px]",
      h2: "text-primary italic text-[110px]",
      h3: "text-primary italic text-[36px]",
      h4: "text-black text-[24px]",
      h5: "text-black",
      h6: "text-black",
    },
  },
  defaultVariants: {
    as: "h1",
  },
});

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as = "h2", ...props }, ref) => {
    // Map 'as' prop to the variant key.
    const Component = as;

    return <Component ref={ref} className={cn(headingVariants({ as }), className)} {...props} />;
  }
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
