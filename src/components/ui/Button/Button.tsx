import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";
import { StyledButton } from "./Button.style";

export const Button = (props: ButtonProps) => {
  return <StyledButton {...props} />;
};
