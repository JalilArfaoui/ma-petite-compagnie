import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-[5px] text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        gray: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        red: "border-transparent bg-red-100 text-red-800 hover:bg-red-100/80",
        outline: "text-slate-950",
        solid: "bg-slate-900 text-white",
        subtle: "bg-slate-100 text-slate-900",
        green: "border-transparent bg-green-100 text-green-800 hover:bg-green-100/80",
        orange: "border-transparent bg-orange-100 text-orange-800 hover:bg-orange-100/80",
        blue: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-100/80",
        purple: "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-100/80",
        yellow: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
        cyan: "border-transparent bg-cyan-100 text-cyan-800 hover:bg-cyan-100/80",
        pink: "border-transparent bg-pink-100 text-pink-800 hover:bg-pink-100/80",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
