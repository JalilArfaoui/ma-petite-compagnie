import * as React from "react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, children, ...props }, ref) => (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "h-5 w-5 rounded-[6px] border border-border bg-white cursor-pointer transition-all hover:bg-bg-hover hover:border-border-hover focus:ring-2 focus:ring-primary/40 checked:bg-primary checked:border-primary accent-primary",
          className
        )}
        {...props}
      />
      {children && (
        <span className="text-[1rem] text-text-primary font-serif leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {children}
        </span>
      )}
    </label>
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
