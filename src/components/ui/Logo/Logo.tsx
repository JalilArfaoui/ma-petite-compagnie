import { LuTicket } from "react-icons/lu";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  iconClassName?: string;
}

export const Logo = ({ size = 24, iconClassName = "" }: LogoProps) => (
  <div
    className={cn(
      "flex items-center justify-center p-2 rounded-lg",
      "bg-primary-light text-primary -rotate-6 transform shadow-sm",
      iconClassName
    )}
  >
    <LuTicket size={size} />
  </div>
);
