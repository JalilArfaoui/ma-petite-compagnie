import * as React from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { Input, InputProps } from "../Input/Input";

export interface SearchBarProps extends InputProps {
  onSearch?: (value: string) => void;
  containerClassName?: string;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, containerClassName, onSearch, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e);
      if (onSearch) onSearch(e.target.value);
    };

    return (
      <Input.Group className={cn("w-full", containerClassName)}>
        <Input.LeftElement>
          <HiOutlineSearch className="h-5 w-5 text-text-muted" />
        </Input.LeftElement>
        <Input
          type="search"
          className={cn("pl-11", className)}
          ref={ref}
          onChange={handleChange}
          {...props}
        />
      </Input.Group>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar };
