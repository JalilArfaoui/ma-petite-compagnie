import * as React from "react";
import { Checkbox as ChakraCheckbox, CheckboxRootProps } from "@chakra-ui/react";

export interface CheckboxProps extends CheckboxRootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
}

import { StyledCheckboxRoot, StyledCheckboxControl, StyledCheckboxLabel } from "./Checkbox.style";

export const Checkbox = (props: CheckboxProps) => {
  const { children, inputProps, rootRef, ...rest } = props;
  return (
    <StyledCheckboxRoot ref={rootRef} {...rest}>
      <ChakraCheckbox.HiddenInput {...inputProps} />
      <StyledCheckboxControl>
        <ChakraCheckbox.Indicator />
      </StyledCheckboxControl>
      {children && <StyledCheckboxLabel>{children}</StyledCheckboxLabel>}
    </StyledCheckboxRoot>
  );
};

// Checkbox.Group is not defined in Chakra v3 this way
