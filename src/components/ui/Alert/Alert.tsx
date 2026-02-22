import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-slate-950",
  {
    variants: {
      variant: {
        error: "text-red-700 [&>svg]:text-red-500 bg-red-100",
        success: "text-green-700 [&>svg]:text-green-600 bg-green-100",
        warning: "text-yellow-700 [&>svg]:text-yellow-600 bg-yellow-100",
        info: "text-blue-700 [&>svg]:text-blue-600 bg-blue-100",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & { status?: string }
>(({ className, variant, status, ...props }, ref) => {
  let effectiveVariant = variant;
  if (status === "error") effectiveVariant = "error";
  if (status === "success") effectiveVariant = "success";
  if (status === "warning") effectiveVariant = "warning";
  if (status === "info") effectiveVariant = "info";

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant: effectiveVariant }), className)}
      {...props}
    />
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

const AlertIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mr-3 inline-block", className)} {...props} />
  )
);
AlertIcon.displayName = "AlertIcon";

const AlertExport = Object.assign(Alert, {
  Title: AlertTitle,
  Description: AlertDescription,
  Icon: AlertIcon,
  Root: Alert,
});

export { AlertExport as Alert };
