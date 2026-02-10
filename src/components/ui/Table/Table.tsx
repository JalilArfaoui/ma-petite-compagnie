import * as React from "react";
import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-hidden rounded-[12px] border border-[#e1e8f1] font-serif text-[#43566b]">
      <table
        ref={ref}
        className={cn("w-full border-collapse border-spacing-0 caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-[#f8fafc] [&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("bg-white [&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-auto px-4 py-4 text-left align-middle font-bold text-xs uppercase tracking-wider text-[#64748b] border-b border-[#e1e8f1] [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle border-b border-[#e1e8f1] text-[1rem] [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-slate-500", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

const TableExport = Object.assign(Table, {
  Root: Table,
  Header: TableHead,
  Head: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  Caption: TableCaption,
  Footer: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tfoot {...props}>{children}</tfoot>
  ),
  Container: ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto">{children}</div>
  ),
});

export { TableExport as Table };
