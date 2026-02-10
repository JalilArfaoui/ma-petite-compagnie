import * as React from "react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, href, external, ...props }, ref) => {
    const isExternal = external || href.startsWith("http");

    if (isExternal) {
      return (
        <a
          href={href}
          ref={ref}
          className={cn(
            "text-[#43566b] font-serif hover:text-[#d00039] active:text-[#5e0019] no-underline",
            className
          )}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        />
      );
    }

    return (
      <NextLink
        href={href}
        ref={ref}
        className={cn(
          "text-[#43566b] font-serif hover:text-[#d00039] active:text-[#5e0019] no-underline",
          className
        )}
        {...props}
      />
    );
  }
);
Link.displayName = "Link";

export { Link };
