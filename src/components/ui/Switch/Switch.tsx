import * as React from "react";
import { cn } from "@/lib/utils";

export const Switch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, children, ...props }, ref) => {
  return (
    <label className="inline-flex items-center space-x-2 cursor-pointer">
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          role="switch"
          ref={ref}
          className={cn("peer sr-only", className)}
          {...props}
        />
        {/* Background */}
        <div className="h-5 w-10 rounded-full bg-slate-200 transition-colors peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#d00039]/50 peer-checked:bg-[#d00039]"></div>
        {/* Handle */}
        <div className="absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 shadow-sm transition-transform duration-200 peer-checked:translate-x-[20px]"></div>
      </div>
      {children && (
        <span className="text-[1rem] text-[#43566b] font-serif leading-none">{children}</span>
      )}
    </label>
  );
});
Switch.displayName = "Switch";
