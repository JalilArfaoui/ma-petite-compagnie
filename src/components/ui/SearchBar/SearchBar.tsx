import * as React from "react";
import { FaSearch } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Input, InputProps } from "../Input/Input";

export interface SearchBarProps extends InputProps {
  containerClassName?: string;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <Input.Group className={cn("w-full", containerClassName)}>
        <Input.LeftElement>
          <FaSearch className="h-5 w-5 text-text-muted" />
        </Input.LeftElement>
        <Input type="search" className={cn("pl-11", className)} ref={ref} {...props} />
      </Input.Group>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar };
