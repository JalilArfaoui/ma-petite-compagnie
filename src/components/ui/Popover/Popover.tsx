import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

const PopoverRoot = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-white p-4 text-slate-950 shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const PopoverExport = Object.assign(PopoverRoot, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Body: ({ className, ...props }: any) => <div className={cn("p-4", className)} {...props} />,
  Header: ({ className, ...props }: any) => (
    <div className={cn("px-4 py-2 font-semibold border-b", className)} {...props} />
  ),
  Footer: ({ className, ...props }: any) => (
    <div className={cn("px-4 py-2 border-t", className)} {...props} />
  ),
  Arrow: PopoverPrimitive.Arrow,
  CloseTrigger: PopoverPrimitive.Close,
});

export { PopoverExport as Popover };
