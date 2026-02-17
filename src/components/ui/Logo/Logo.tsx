import { LuTicket } from "react-icons/lu";
import { cn } from "@/lib/utils";

export const Logo = ({ size = 24, iconClassName = "" }) => (
  <div
    className={cn(
      "flex items-center justify-center p-2 rounded-lg",
      "bg-[#ffe3e7] text-[#D00039] -rotate-6 transform shadow-sm",
      iconClassName
    )}
  >
    <LuTicket size={size} />
  </div>
);
