import { RadioGroup as ChakraRadioGroup, type RadioGroupItemProps } from "@chakra-ui/react";
import * as React from "react";

export interface RadioProps extends RadioGroupItemProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLDivElement>;
}

import {
  StyledRadioRoot,
  StyledRadioItem,
  StyledRadioControl,
  StyledRadioText,
} from "./Radio.style";

export const Radio = React.forwardRef<HTMLDivElement, RadioProps>(function Radio(props, ref) {
  const { children, inputProps, rootRef, ...rest } = props;
  return (
    <StyledRadioItem ref={ref || rootRef} {...rest}>
      <ChakraRadioGroup.ItemHiddenInput {...inputProps} />
      <StyledRadioControl />
      {children && <StyledRadioText>{children}</StyledRadioText>}
    </StyledRadioItem>
  );
});

export const RadioGroup = StyledRadioRoot;
