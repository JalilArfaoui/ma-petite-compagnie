import { ComponentProps } from "react";
import { InputGroup, InputElement, InputAddon, InputProps } from "@chakra-ui/react";

import { StyledInput } from "./Input.style";

export const Input = (props: InputProps) => {
  return <StyledInput {...props} />;
};

const LeftElement = (props: ComponentProps<typeof InputElement>) => (
  <InputElement placement="start" {...props} />
);
LeftElement.displayName = "InputLeftElement";

const RightElement = (props: ComponentProps<typeof InputElement>) => (
  <InputElement placement="end" {...props} />
);
RightElement.displayName = "InputRightElement";

Input.Group = InputGroup;
Input.LeftElement = LeftElement;
Input.RightElement = RightElement;
Input.LeftAddon = InputAddon;
Input.RightAddon = InputAddon;
