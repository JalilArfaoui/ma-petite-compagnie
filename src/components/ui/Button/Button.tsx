import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid:
          "bg-primary text-white hover:bg-primary-hover active:bg-primary-active rounded-[12px] font-serif italic font-bold",
        destructive: "bg-red-500 text-white hover:bg-red-500/90 rounded-[12px]",
        outline:
          "bg-white border text-text-primary border-border hover:bg-bg-hover active:bg-bg-disabled font-serif rounded-[12px]",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80 rounded-[12px]",
        ghost: "hover:bg-slate-100 hover:text-slate-900 rounded-[12px]",
        link: "text-slate-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "px-8 py-4 gap-2 text-base",
        sm: "px-4 py-3 text-sm",
        lg: "px-8 py-6 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconSide?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, icon, iconSide = "left", children, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {icon && iconSide === "left" && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconSide === "right" && <span className="ml-2">{icon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
