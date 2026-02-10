import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-[12px] border border-[#e1e8f1] bg-white px-4 py-3 text-[1rem] text-[#43566b] font-serif placeholder:text-[#94a3b8] transition-all hover:border-[#cbd5e1] hover:bg-[#f8fafc] focus-visible:outline-none focus-visible:border-[#d00039] focus-visible:ring-1 focus-visible:ring-[#d00039] disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-[#f1f5f9]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
