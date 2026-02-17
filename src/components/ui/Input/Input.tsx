import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-[12px] border border-border bg-white px-4 py-3 text-[1rem] text-text-primary font-serif placeholder:text-text-muted transition-all hover:border-border-hover hover:bg-bg-hover focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-bg-disabled",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const InputGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative flex items-center", className)} {...props} />
  )
);
InputGroup.displayName = "InputGroup";

const InputLeftElement = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("absolute left-3 flex items-center justify-center text-slate-500", className)}
      {...props}
    />
  )
);
InputLeftElement.displayName = "InputLeftElement";

const InputRightElement = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("absolute right-3 flex items-center justify-center text-slate-500", className)}
      {...props}
    />
  )
);
InputRightElement.displayName = "InputRightElement";

const InputWithExtensions = Object.assign(Input, {
  Group: InputGroup,
  LeftElement: InputLeftElement,
  RightElement: InputRightElement,
  LeftAddon: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={cn("px-3 py-2 border border-r-0 rounded-l-md bg-slate-50", className)}
      {...props}
    />
  ),
  RightAddon: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={cn("px-3 py-2 border border-l-0 rounded-r-md bg-slate-50", className)}
      {...props}
    />
  ),
});

export { InputWithExtensions as Input };
