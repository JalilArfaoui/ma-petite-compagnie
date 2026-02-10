import * as React from "react";
import { cn } from "@/lib/utils";

const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("list-none flex flex-col font-serif text-[#43566b]", className)}
      {...props}
    />
  )
);
List.displayName = "List";

const ListItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn("flex items-center gap-3 text-[1rem] leading-[1.6]", className)}
      {...props}
    />
  )
);
ListItem.displayName = "ListItem";

const ListIndicator = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "mr-2 flex items-center justify-center shrink-0 text-[#d00039] text-[1.5rem]",
        className
      )}
      {...props}
    />
  )
);
ListIndicator.displayName = "ListIndicator";

const ListExport = Object.assign(List, {
  Item: ListItem,
  Indicator: ListIndicator,
  Root: List,
});

export { ListExport as List };
