import * as React from "react";
import { cn } from "@/lib/utils";

const CardRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    iconColor?: string;
  }
>(({ className, title, description, icon, iconColor, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[20px] bg-hover p-[20px] border-none shadow-sm transition-shadow flex flex-col gap-[20px]",
      className
    )}
    {...props}
  >
    {icon && (
      <div
        className={cn(
          "w-fit p-[10px] rounded-full flex items-center justify-center text-3xl",
          iconColor === "red"
            ? "bg-primary-light text-primary"
            : iconColor === "blue"
              ? "bg-[#E9F2FD] text-[#2563eb]"
              : iconColor === "yellow"
                ? "bg-[#FFF4C2] text-[#eab308]"
                : iconColor === "green"
                  ? "bg-[#E9F8F2] text-[#16a34a]"
                  : iconColor === "orange"
                    ? "bg-[#FFF5D9] text-[#ea580c]"
                    : "bg-gray-100 text-gray-900"
        )}
      >
        {icon}
      </div>
    )}
    <div className="flex flex-col gap-[20px]">
      {title && (
        <h3 className="text-[1.5rem] font-bold font-serif leading-none tracking-tight">{title}</h3>
      )}
      {description && <p className="text-slate-600 font-sans">{description}</p>}
      <div className="">{children}</div>
    </div>
  </div>
));
CardRoot.displayName = "Card";

const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("pt-0", className)} {...props} />
);
CardBody.displayName = "CardBody";

const CardExport = Object.assign(CardRoot, {
  Body: CardBody,
});

export { CardExport as Card };
