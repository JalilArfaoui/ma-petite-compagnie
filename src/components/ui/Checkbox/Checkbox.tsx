import * as React from "react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, children, ...props }, ref) => (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "h-5 w-5 rounded-[6px] border border-[#e1e8f1] bg-white cursor-pointer transition-all hover:bg-[#f8fafc] hover:border-[#cbd5e1] focus:ring-2 focus:ring-[#d00039]/40 checked:bg-[#d00039] checked:border-[#d00039] accent-[#d00039]",
          className
        )}
        {...props}
      />
      {children && (
        <span className="text-[1rem] text-[#43566b] font-serif leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {children}
        </span>
      )}
    </label>
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
