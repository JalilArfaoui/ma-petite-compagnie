import { Tooltip as ChakraTooltip, type TooltipRootProps } from "@chakra-ui/react";
import React from "react";

export interface TooltipProps extends TooltipRootProps {
  label?: React.ReactNode;
  children: React.ReactNode;
  showArrow?: boolean;
  contentProps?: React.ComponentProps<typeof ChakraTooltip.Content>;
}

export const Tooltip = (props: TooltipProps) => {
  const { label, children, showArrow, contentProps, ...rest } = props;

  return (
    <ChakraTooltip.Root {...rest}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <ChakraTooltip.Positioner>
        {showArrow && <ChakraTooltip.Arrow />}
        <ChakraTooltip.Content {...contentProps}>{label}</ChakraTooltip.Content>
      </ChakraTooltip.Positioner>
    </ChakraTooltip.Root>
  );
};
