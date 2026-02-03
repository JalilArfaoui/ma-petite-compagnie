"use client";

import * as React from "react";
import { Switch as ChakraSwitch, type SwitchRootProps } from "@chakra-ui/react";
import {
  StyledSwitchRoot,
  StyledSwitchControl,
  StyledSwitchThumb,
  StyledSwitchLabel,
} from "./Switch.style";

export interface SwitchProps extends SwitchRootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
}

export const Switch = (props: SwitchProps) => {
  const { children, inputProps, rootRef, ...rest } = props;
  return (
    <StyledSwitchRoot ref={rootRef} {...rest}>
      <ChakraSwitch.HiddenInput {...inputProps} />
      <StyledSwitchControl>
        <StyledSwitchThumb />
      </StyledSwitchControl>
      {children && <StyledSwitchLabel>{children}</StyledSwitchLabel>}
    </StyledSwitchRoot>
  );
};
